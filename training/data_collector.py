"""
Experience collector for PPO training.
Queries teacher model (NVIDIA NIM) to generate reference responses,
then samples policy model for comparison rollouts.
"""

import base64
import json
import logging
import os
import random
import time
import uuid
from pathlib import Path
from typing import Optional

import requests

logger = logging.getLogger(__name__)

CATEGORY_PROMPTS = {
    "posture": [
        "Analyze the spinal alignment in this image.",
        "Identify any postural deviations visible in this scan.",
        "Assess the forward head posture severity.",
        "Describe the shoulder alignment and any asymmetries.",
    ],
    "skin": [
        "Describe the visible skin condition in this image.",
        "Identify the lesion characteristics: shape, border, color, diameter.",
        "Assess the distribution pattern of this skin finding.",
        "Describe any pigmentation changes visible.",
    ],
    "eye": [
        "Analyze the visible structures of the eye in this image.",
        "Describe any abnormalities in the conjunctiva or sclera.",
        "Assess the pupil response and symmetry if visible.",
        "Identify any redness patterns and their distribution.",
    ],
    "mental": [
        "Based on this assessment, what mental health concerns should be explored?",
        "Analyze the reported symptoms and suggest appropriate screening tools.",
        "What lifestyle factors might be contributing to these symptoms?",
        "Describe appropriate next steps for this mental health presentation.",
    ],
}


class ExperienceCollector:
    def __init__(
        self,
        teacher_endpoint: str,
        teacher_model: str,
        categories: list,
        reward_data_dir: str = "./training/reward_data",
    ):
        self.teacher_endpoint = teacher_endpoint
        self.teacher_model = teacher_model
        self.categories = categories
        self.reward_data_dir = Path(reward_data_dir)
        self.reward_data_dir.mkdir(parents=True, exist_ok=True)
        self.api_key = os.getenv("NVIDIA_API_KEY", "")

        self.session = requests.Session()
        self.session.headers.update({
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        })

    def _query_teacher(self, prompt: str, category: str, image_b64: Optional[str] = None) -> str:
        """Query teacher model for reference response."""
        messages = [
            {
                "role": "system",
                "content": f"You are a medical AI assistant specializing in {category} analysis. Provide detailed, accurate, and safe medical insights.",
            },
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": prompt},
                    *(
                        [{"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_b64}"}}]
                        if image_b64 else []
                    ),
                ],
            },
        ]

        max_retries = 3
        for attempt in range(max_retries):
            try:
                resp = self.session.post(
                    f"{self.teacher_endpoint}/chat/completions",
                    json={
                        "model": self.teacher_model,
                        "messages": messages,
                        "max_tokens": 1024,
                        "temperature": 0.6,
                    },
                    timeout=30,
                )
                if resp.status_code == 429:
                    wait = 8.5 * (attempt + 1)
                    logger.warning(f"Rate limited. Waiting {wait}s...")
                    time.sleep(wait)
                    continue
                resp.raise_for_status()
                return resp.json()["choices"][0]["message"]["content"]
            except Exception as e:
                logger.error(f"Teacher query failed (attempt {attempt + 1}): {e}")
                time.sleep(2)

        return ""

    def collect_rollout(self, batch_size: int, policy_model) -> dict:
        """Collect a batch of (prompt, policy_response, teacher_response) tuples."""
        batch = {
            "prompts": [],
            "policy_responses": [],
            "teacher_responses": [],
            "categories": [],
            "images": [],
            "experience_ids": [],
        }

        for _ in range(batch_size):
            category = random.choice(self.categories)
            prompt = random.choice(CATEGORY_PROMPTS[category])
            exp_id = str(uuid.uuid4())

            teacher_response = self._query_teacher(prompt, category)
            policy_response = policy_model.generate(prompt, category=category)

            batch["prompts"].append(prompt)
            batch["policy_responses"].append(policy_response)
            batch["teacher_responses"].append(teacher_response)
            batch["categories"].append(category)
            batch["images"].append(None)
            batch["experience_ids"].append(exp_id)

            self._save_experience(exp_id, {
                "prompt": prompt,
                "category": category,
                "teacher_response": teacher_response,
                "policy_response": policy_response,
                "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            })

        return batch

    def _save_experience(self, exp_id: str, data: dict):
        path = self.reward_data_dir / f"{exp_id}.json"
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False))
