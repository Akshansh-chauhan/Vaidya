"""
PPO-based reinforcement learning trainer for Vaidya VLM.
Uses teacher model responses as reward signal for policy improvement.
"""

import json
import logging
import os
import time
from dataclasses import dataclass, field
from pathlib import Path
from typing import Optional

import torch
from torch.optim import AdamW
from torch.optim.lr_scheduler import CosineAnnealingLR

from reward_model import VaidyaRewardModel
from data_collector import ExperienceCollector

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

try:
    from transformers import AutoModelForCausalLM, AutoTokenizer, BitsAndBytesConfig
    from peft import PeftModel, get_peft_model, LoraConfig
except ImportError:
    logger.warning("transformers/peft not installed — model loading will fail")


@dataclass
class PPOConfig:
    # Training
    total_steps: int = 20000
    rollout_batch_size: int = 8
    mini_batch_size: int = 4
    ppo_epochs: int = 4
    gradient_accumulation_steps: int = 2

    # PPO hyperparams
    clip_ratio: float = 0.2
    value_clip_ratio: float = 0.2
    kl_coeff: float = 0.05
    target_kl: float = 0.1
    entropy_coeff: float = 0.01
    gamma: float = 1.0
    gae_lambda: float = 0.95

    # Optimizer
    learning_rate: float = 1e-6
    weight_decay: float = 0.01
    max_grad_norm: float = 1.0
    warmup_steps: int = 100

    # Checkpointing
    checkpoint_dir: str = "./models/vaidya-vlm-v1/checkpoints"
    save_every_n_steps: int = 400
    eval_every_n_steps: int = 200

    # Model paths
    policy_model_path: str = "./models/vaidya-vlm-v1"
    reward_model_path: str = "./models/vaidya-reward-v1"

    # Teacher (reference) model — NVIDIA NIM endpoint
    teacher_endpoint: str = os.getenv("NVIDIA_API_BASE", "https://integrate.api.nvidia.com/v1")
    teacher_model: str = "meta/llama-3.2-90b-vision-instruct"

    # Domains
    categories: list = field(default_factory=lambda: ["posture", "skin", "eye", "mental"])
    languages: list = field(default_factory=lambda: ["en", "hi", "zh", "es", "fr"])


class PPOTrainer:
    def __init__(self, config: PPOConfig):
        self.config = config
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.step = 0

        logger.info(f"Initializing PPO trainer on {self.device}")
        logger.info(f"Policy model: {config.policy_model_path}")
        logger.info(f"Reward model: {config.reward_model_path}")

        # Load policy model with quantisation for memory efficiency
        logger.info("Loading base model with 4-bit quantisation...")
        bnb_config = BitsAndBytesConfig(
            load_in_4bit=True,
            bnb_4bit_quant_type="nf4",
            bnb_4bit_compute_dtype=torch.float16,
            bnb_4bit_use_double_quant=True,
        )
        self.policy_model = AutoModelForCausalLM.from_pretrained(
            config.policy_model_path,
            quantization_config=bnb_config,
            device_map="auto",
            torch_dtype=torch.float16,
            trust_remote_code=True,
        )
        self.tokenizer = AutoTokenizer.from_pretrained(
            config.policy_model_path, trust_remote_code=True
        )

        # Apply LoRA adapters for parameter-efficient fine-tuning
        lora_config = LoraConfig(
            r=16,
            lora_alpha=32,
            target_modules=["q_proj", "k_proj", "v_proj", "o_proj", "gate_proj", "up_proj", "down_proj"],
            lora_dropout=0.05,
            bias="none",
            task_type="CAUSAL_LM",
        )
        self.policy_model = get_peft_model(self.policy_model, lora_config)
        self.policy_model.print_trainable_parameters()
        logger.info("Policy model loaded successfully")

        self.reward_model = VaidyaRewardModel.load(config.reward_model_path, device=self.device)
        self.collector = ExperienceCollector(
            teacher_endpoint=config.teacher_endpoint,
            teacher_model=config.teacher_model,
            categories=config.categories,
        )

        self.optimizer = AdamW(
            self._get_trainable_params(),
            lr=config.learning_rate,
            weight_decay=config.weight_decay,
            betas=(0.9, 0.95),
        )
        self.scheduler = CosineAnnealingLR(self.optimizer, T_max=config.total_steps)

        self._load_latest_checkpoint()

    def _get_trainable_params(self):
        # Only fine-tune top transformer layers + vision-language projector
        trainable = []
        for name, param in self.policy_model.named_parameters():
            if any(layer in name for layer in ["layers.7", "layers.6", "lm_head", "vision_proj"]):
                param.requires_grad = True
                trainable.append(param)
            else:
                param.requires_grad = False
        logger.info(f"Trainable parameters: {sum(p.numel() for p in trainable):,}")
        return trainable

    def _load_latest_checkpoint(self):
        checkpoint_dir = Path(self.config.checkpoint_dir)
        checkpoints = sorted(checkpoint_dir.glob("checkpoint_step_*.json"))
        if checkpoints:
            latest = checkpoints[-1]
            meta = json.loads(latest.read_text())
            self.step = meta["step"]
            logger.info(f"Resumed from step {self.step} (reward_mean={meta['metrics']['reward_mean']:.3f})")
        else:
            logger.info("No checkpoint found — starting from scratch")

    def compute_advantages(self, rewards, values, dones):
        advantages = torch.zeros_like(rewards)
        last_advantage = 0.0
        for t in reversed(range(len(rewards))):
            delta = rewards[t] + self.config.gamma * values[t + 1] * (1 - dones[t]) - values[t]
            advantages[t] = delta + self.config.gamma * self.config.gae_lambda * (1 - dones[t]) * last_advantage
            last_advantage = advantages[t]
        returns = advantages + values[:-1]
        advantages = (advantages - advantages.mean()) / (advantages.std() + 1e-8)
        return advantages, returns

    def ppo_step(self, batch):
        total_policy_loss = 0.0
        total_value_loss = 0.0
        total_entropy = 0.0
        total_kl = 0.0

        advantages, returns = self.compute_advantages(
            batch["rewards"], batch["values"], batch["dones"]
        )

        for _ in range(self.config.ppo_epochs):
            indices = torch.randperm(len(batch["states"]))
            for start in range(0, len(indices), self.config.mini_batch_size):
                mb_idx = indices[start : start + self.config.mini_batch_size]

                logprobs, values, entropy = self.policy_model.evaluate(
                    batch["states"][mb_idx],
                    batch["actions"][mb_idx],
                    batch["images"][mb_idx],
                )

                ratio = torch.exp(logprobs - batch["log_probs"][mb_idx])
                surr1 = ratio * advantages[mb_idx]
                surr2 = torch.clamp(ratio, 1 - self.config.clip_ratio, 1 + self.config.clip_ratio) * advantages[mb_idx]
                policy_loss = -torch.min(surr1, surr2).mean()

                value_pred_clipped = batch["values"][mb_idx] + torch.clamp(
                    values - batch["values"][mb_idx], -self.config.value_clip_ratio, self.config.value_clip_ratio
                )
                value_loss = 0.5 * torch.max(
                    (values - returns[mb_idx]) ** 2,
                    (value_pred_clipped - returns[mb_idx]) ** 2,
                ).mean()

                kl = (batch["log_probs"][mb_idx] - logprobs).mean()
                loss = policy_loss + 0.5 * value_loss - self.config.entropy_coeff * entropy.mean() + self.config.kl_coeff * kl

                loss.backward()
                torch.nn.utils.clip_grad_norm_(self._get_trainable_params(), self.config.max_grad_norm)
                self.optimizer.step()
                self.scheduler.step()
                self.optimizer.zero_grad()

                total_policy_loss += policy_loss.item()
                total_value_loss += value_loss.item()
                total_entropy += entropy.mean().item()
                total_kl += kl.item()

                if kl > 1.5 * self.config.target_kl:
                    logger.warning(f"Early stopping PPO epoch due to high KL: {kl:.4f}")
                    break

        return {
            "policy_loss": total_policy_loss,
            "value_loss": total_value_loss,
            "entropy": total_entropy,
            "kl": total_kl,
        }

    def train(self):
        logger.info(f"Starting PPO training from step {self.step} to {self.config.total_steps}")

        while self.step < self.config.total_steps:
            batch = self.collector.collect_rollout(
                batch_size=self.config.rollout_batch_size,
                policy_model=self.policy_model,
            )

            rewards = self.reward_model.score(batch)
            batch["rewards"] = rewards

            metrics = self.ppo_step(batch)
            self.step += 1

            if self.step % 50 == 0:
                logger.info(
                    f"Step {self.step:6d} | "
                    f"reward={rewards.mean():.4f} ± {rewards.std():.4f} | "
                    f"policy_loss={metrics['policy_loss']:.4f} | "
                    f"value_loss={metrics['value_loss']:.4f} | "
                    f"kl={metrics['kl']:.4f} | "
                    f"entropy={metrics['entropy']:.4f}"
                )

            if self.step % self.config.save_every_n_steps == 0:
                self._save_checkpoint(metrics, rewards)

        logger.info("Training complete.")

    def _save_checkpoint(self, metrics, rewards):
        meta = {
            "step": self.step,
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "metrics": {
                "reward_mean": float(rewards.mean()),
                "reward_std": float(rewards.std()),
                "policy_loss": metrics["policy_loss"],
                "value_loss": metrics["value_loss"],
                "kl_divergence": metrics["kl"],
                "entropy": metrics["entropy"],
            },
        }
        path = Path(self.config.checkpoint_dir) / f"checkpoint_step_{self.step}.json"
        path.write_text(json.dumps(meta, indent=2))
        logger.info(f"Checkpoint saved: {path}")


if __name__ == "__main__":
    config = PPOConfig()
    trainer = PPOTrainer(config)
    trainer.train()
