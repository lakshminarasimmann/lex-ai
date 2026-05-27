"""
LexAI Document Classifier
==========================
Zero-shot document type classification using the HuggingFace Inference API
with ``facebook/bart-large-mnli``.
"""

import os
import time
import requests
from typing import Any

_HF_API_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-mnli"

_CANDIDATE_LABELS: list[str] = [
    "rental agreement",
    "employment contract",
    "loan agreement",
    "non-disclosure agreement",
    "service agreement",
    "insurance policy",
    "partnership deed",
]

# Map human-readable labels → snake_case keys used internally
_LABEL_TO_KEY: dict[str, str] = {
    "rental agreement": "rental_agreement",
    "employment contract": "employment_contract",
    "loan agreement": "loan_agreement",
    "non-disclosure agreement": "nda",
    "service agreement": "service_agreement",
    "insurance policy": "insurance_policy",
    "partnership deed": "partnership_deed",
}

_MAX_RETRIES = 3
_RETRY_DELAY = 10  # seconds


def classify_document(text: str) -> dict[str, Any]:
    """Classify a legal document using zero-shot classification.

    Sends the first 1024 characters of *text* to the HuggingFace Inference
    API (BART-Large-MNLI) and returns the predicted document type.

    Args:
        text: The full document text (only the first 1024 chars are sent).

    Returns:
        A dict with:
        - ``doc_type`` (str): snake_case document type.
        - ``confidence`` (float): confidence score for the top label.
        - ``all_scores`` (dict): mapping of snake_case type → score.

    Raises:
        RuntimeError: If ``HUGGINGFACE_API_KEY`` is not set.
        requests.HTTPError: After exhausting retries on API failure.
    """
    api_key = os.environ.get("HUGGINGFACE_API_KEY")
    if not api_key:
        raise RuntimeError("HUGGINGFACE_API_KEY environment variable is not set")

    headers = {"Authorization": f"Bearer {api_key}"}
    payload = {
        "inputs": text[:1024],
        "parameters": {
            "candidate_labels": _CANDIDATE_LABELS,
        },
    }

    last_error: Exception | None = None
    for attempt in range(_MAX_RETRIES):
        try:
            resp = requests.post(_HF_API_URL, headers=headers, json=payload, timeout=30)

            # Handle 503 cold-start from HuggingFace
            if resp.status_code == 503:
                last_error = requests.HTTPError(
                    f"Model loading (503), attempt {attempt + 1}/{_MAX_RETRIES}"
                )
                if attempt < _MAX_RETRIES - 1:
                    time.sleep(_RETRY_DELAY)
                    continue
                raise last_error

            resp.raise_for_status()
            data = resp.json()

            labels: list[str] = data.get("labels", [])
            scores: list[float] = data.get("scores", [])

            if not labels or not scores:
                raise ValueError("Unexpected response format from HuggingFace API")

            top_label = labels[0]
            top_score = scores[0]

            all_scores: dict[str, float] = {}
            for lbl, scr in zip(labels, scores):
                key = _LABEL_TO_KEY.get(lbl, lbl.lower().replace(" ", "_"))
                all_scores[key] = round(scr, 4)

            doc_type = _LABEL_TO_KEY.get(top_label, top_label.lower().replace(" ", "_"))

            return {
                "doc_type": doc_type,
                "confidence": round(top_score, 4),
                "all_scores": all_scores,
            }

        except requests.exceptions.ConnectionError as exc:
            last_error = exc
            if attempt < _MAX_RETRIES - 1:
                time.sleep(_RETRY_DELAY)
                continue
            raise

        except requests.exceptions.Timeout as exc:
            last_error = exc
            if attempt < _MAX_RETRIES - 1:
                time.sleep(_RETRY_DELAY)
                continue
            raise

    # Should not reach here, but just in case
    raise RuntimeError(f"classify_document failed after {_MAX_RETRIES} retries: {last_error}")
