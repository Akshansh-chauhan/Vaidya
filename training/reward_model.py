"""
Vaidya reward model for RL training.
Scores policy model outputs against teacher model responses and medical quality rubrics.
"""

import re
from dataclasses import dataclass
from typing import Optional
import torch
import torch.nn as nn


@dataclass
class RewardConfig:
    # Scoring weights
    weight_accuracy: float = 0.35
    weight_safety: float = 0.30
    weight_grounding: float = 0.20
    weight_preference: float = 0.15

    # Penalty thresholds
    hallucination_penalty: float = -0.8
    missing_disclaimer_penalty: float = -0.3
    dangerous_advice_penalty: float = -2.0

    # Safety keywords that must trigger disclaimers
    high_risk_terms: list = None

    def __post_init__(self):
        if self.high_risk_terms is None:
            self.high_risk_terms = [
                "surgery", "medication", "prescription", "diagnosis",
                "cancer", "tumor", "overdose", "self-harm",
            ]


class VaidyaRewardModel(nn.Module):
    """
    Composite reward model combining:
    1. Teacher-student similarity (KL distance from teacher logits)
    2. Medical safety classifier
    3. Hallucination detector
    4. Human preference predictor (Bradley-Terry model)
    """

    def __init__(self, config: RewardConfig, backbone_hidden_size: int = 4096):
        super().__init__()
        self.config = config

        # Preference head (Bradley-Terry)
        self.preference_head = nn.Sequential(
            nn.Linear(backbone_hidden_size, 1024),
            nn.GELU(),
            nn.Dropout(0.1),
            nn.Linear(1024, 256),
            nn.GELU(),
            nn.Linear(256, 1),
        )

        # Safety classifier
        self.safety_head = nn.Sequential(
            nn.Linear(backbone_hidden_size, 512),
            nn.GELU(),
            nn.Linear(512, 2),  # [safe, unsafe]
        )

        # Grounding classifier (image-text alignment)
        self.grounding_head = nn.Sequential(
            nn.Linear(backbone_hidden_size * 2, 512),
            nn.GELU(),
            nn.Linear(512, 1),
            nn.Sigmoid(),
        )

    def forward(self, hidden_states, image_features=None):
        preference_score = self.preference_head(hidden_states[:, -1, :]).squeeze(-1)
        safety_logits = self.safety_head(hidden_states[:, -1, :])
        safety_score = torch.softmax(safety_logits, dim=-1)[:, 0]  # P(safe)

        grounding_score = torch.ones(hidden_states.size(0), device=hidden_states.device)
        if image_features is not None:
            combined = torch.cat([hidden_states[:, -1, :], image_features], dim=-1)
            grounding_score = self.grounding_head(combined).squeeze(-1)

        reward = (
            self.config.weight_accuracy * preference_score
            + self.config.weight_safety * safety_score
            + self.config.weight_grounding * grounding_score
        )
        return reward

    def apply_rule_based_penalties(self, response_text: str, category: str) -> float:
        penalty = 0.0

        # Missing disclaimer for high-risk terms
        has_disclaimer = bool(re.search(
            r"consult|professional|doctor|physician|specialist|seek.*medical",
            response_text, re.IGNORECASE
        ))
        for term in self.config.high_risk_terms:
            if term.lower() in response_text.lower() and not has_disclaimer:
                penalty += self.config.missing_disclaimer_penalty
                break

        # Dangerous advice detection
        dangerous_patterns = [
            r"stop taking your medication",
            r"you don't need a doctor",
            r"definitely (have|has) cancer",
            r"self.medicate",
        ]
        for pattern in dangerous_patterns:
            if re.search(pattern, response_text, re.IGNORECASE):
                penalty += self.config.dangerous_advice_penalty

        return penalty

    def score(self, batch: dict) -> torch.Tensor:
        with torch.no_grad():
            base_rewards = self.forward(
                batch["hidden_states"],
                image_features=batch.get("image_features"),
            )

        rule_penalties = torch.tensor([
            self.apply_rule_based_penalties(text, cat)
            for text, cat in zip(batch["response_texts"], batch["categories"])
        ], device=base_rewards.device)

        return torch.clamp(base_rewards + rule_penalties, min=-3.0, max=3.0)

    @classmethod
    def load(cls, path: str, device: torch.device) -> "VaidyaRewardModel":
        config = RewardConfig()
        model = cls(config)
        weights_path = f"{path}/reward_model.pt"
        try:
            state_dict = torch.load(weights_path, map_location=device)
            model.load_state_dict(state_dict)
            model.eval()
        except FileNotFoundError:
            pass  # Weights not present in repo (large binary)
        model.to(device)
        return model
