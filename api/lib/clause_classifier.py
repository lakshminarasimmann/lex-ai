"""
LexAI Clause Classifier
========================
Classify individual clauses into CUAD-inspired legal categories using the
HuggingFace Inference API (BART-Large-MNLI zero-shot classification).
"""

import os
import time
import requests
from typing import Any

_HF_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli"

CLAUSE_CATEGORIES: list[str] = [
    "termination",
    "indemnification",
    "governing law",
    "limitation of liability",
    "non-compete",
    "confidentiality",
    "intellectual property",
    "payment terms",
    "warranty",
    "dispute resolution",
    "force majeure",
    "assignment",
    "notice requirements",
    "representations",
    "insurance",
    "audit rights",
    "data protection",
    "non-solicitation",
    "exclusivity",
    "change of control",
    "renewal terms",
    "severability",
    "entire agreement",
    "amendment",
    "waiver",
    "arbitration",
    "jurisdiction",
    "definitions",
    "scope of work",
    "delivery terms",
    "acceptance criteria",
    "penalties",
    "subcontracting",
    "compliance",
    "anti-corruption",
    "environmental",
    "health and safety",
    "termination for convenience",
    "termination for cause",
    "survival",
    "miscellaneous",
]

_MAX_RETRIES = 3
_RETRY_DELAY = 10  # seconds
_BATCH_SIZE = 5  # max concurrent to respect rate limits
_INTER_BATCH_DELAY = 1.5  # seconds between batches


def _classify_single(
    text: str,
    headers: dict[str, str],
) -> dict[str, Any]:
    """Classify a single clause text against CUAD categories.

    Args:
        text: The clause text (truncated to 1024 chars).
        headers: Authorization headers for HuggingFace API.

    Returns:
        ``{category: str, confidence: float}``
    """
    payload = {
        "inputs": text[:1024],
        "parameters": {
            "candidate_labels": CLAUSE_CATEGORIES,
        },
    }

    for attempt in range(_MAX_RETRIES):
        try:
            resp = requests.post(_HF_API_URL, headers=headers, json=payload, timeout=30)

            if resp.status_code == 503:
                if attempt < _MAX_RETRIES - 1:
                    time.sleep(_RETRY_DELAY)
                    continue
                resp.raise_for_status()

            if resp.status_code == 429:
                # Rate limited — back off
                retry_after = int(resp.headers.get("Retry-After", _RETRY_DELAY))
                if attempt < _MAX_RETRIES - 1:
                    time.sleep(retry_after)
                    continue
                resp.raise_for_status()

            resp.raise_for_status()
            data = resp.json()

            labels: list[str] = data.get("labels", [])
            scores: list[float] = data.get("scores", [])

            if labels and scores:
                return {
                    "category": labels[0].replace(" ", "_"),
                    "confidence": round(scores[0], 4),
                }

            return {"category": "miscellaneous", "confidence": 0.0}

        except (requests.exceptions.ConnectionError, requests.exceptions.Timeout):
            if attempt < _MAX_RETRIES - 1:
                time.sleep(_RETRY_DELAY)
                continue
            return {"category": "miscellaneous", "confidence": 0.0}

    return {"category": "miscellaneous", "confidence": 0.0}


def classify_clauses(clauses: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Classify a list of clause dicts using zero-shot classification.

    Processes clauses in batches of ``_BATCH_SIZE`` to respect HuggingFace
    rate limits, with a short delay between batches.

    Args:
        clauses: List of clause dicts, each containing at minimum a ``text`` key.

    Returns:
        The same list of clause dicts enriched with ``category`` and ``confidence``
        fields.

    Raises:
        RuntimeError: If ``HUGGINGFACE_API_KEY`` is not set.
    """
    api_key = os.environ.get("HUGGINGFACE_API_KEY")
    if not api_key:
        raise RuntimeError("HUGGINGFACE_API_KEY environment variable is not set")

    headers = {"Authorization": f"Bearer {api_key}"}
    enriched: list[dict[str, Any]] = []

    for batch_start in range(0, len(clauses), _BATCH_SIZE):
        batch = clauses[batch_start : batch_start + _BATCH_SIZE]

        for clause in batch:
            text = clause.get("text", "")
            if not text.strip():
                clause["category"] = "miscellaneous"
                clause["confidence"] = 0.0
            else:
                result = _classify_single(text, headers)
                clause["category"] = result["category"]
                clause["confidence"] = result["confidence"]
            enriched.append(clause)

        # Delay between batches to avoid rate-limiting
        if batch_start + _BATCH_SIZE < len(clauses):
            time.sleep(_INTER_BATCH_DELAY)

    return enriched
