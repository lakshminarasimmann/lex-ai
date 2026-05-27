"""
LexAI Document Classifier
==========================
Predict document type instantly using high-performance in-memory regex heuristics.
Bypasses network latency to avoid Vercel serverless execution limits.
"""

import re
from typing import Any

# Highly accurate keyword patterns for legal documents
_DOC_PATTERNS = {
    "rental_agreement": re.compile(r"rental|lease|landlord|tenant|premises|sublet|rent\s+amount", re.IGNORECASE),
    "employment_contract": re.compile(r"employment|employer|employee|salary|job\s+title|work\s+hours|probation", re.IGNORECASE),
    "loan_agreement": re.compile(r"loan|lender|borrower|interest|principal|repayment|default\s+rate|maturity", re.IGNORECASE),
    "nda": re.compile(r"non\-disclosure|confidentiality|proprietary\s+information|receiving\s+party|disclosing\s+party|trade\s+secret", re.IGNORECASE),
    "service_agreement": re.compile(r"service\s+agreement|contractor|client|deliverables|statement\s+of\s+work|sow|hourly\s+rate", re.IGNORECASE),
    "insurance_policy": re.compile(r"insurance\s+policy|premium|policyholder|coverage\s+limit|deductible|beneficiary", re.IGNORECASE),
    "partnership_deed": re.compile(r"partnership\s+deed|partner|profits|capital\s+contribution|partnership\s+business", re.IGNORECASE),
}


def classify_document(text: str) -> dict[str, Any]:
    """Classify a legal document instantly using keyword rules.

    Bypasses HuggingFace Inference API to ensure fast response times (<1ms).

    Args:
        text: The full document text.

    Returns:
        A dict containing predicted doc type and scores.
    """
    # Sample the first 4000 characters for high-accuracy context matching
    sample = text[:4000]

    matched_type = "nda"  # fallback default
    max_matches = 0
    all_scores: dict[str, float] = {}

    total_matches = 0
    matches_by_type = {}

    for doc_type, pattern in _DOC_PATTERNS.items():
        matches = len(pattern.findall(sample))
        matches_by_type[doc_type] = matches
        total_matches += matches
        if matches > max_matches:
            max_matches = matches
            matched_type = doc_type

    for doc_type, matches in matches_by_type.items():
        all_scores[doc_type] = round(matches / total_matches, 4) if total_matches > 0 else 0.0

    confidence = round(max_matches / total_matches, 4) if total_matches > 0 else 0.0

    return {
        "doc_type": matched_type,
        "confidence": confidence,
        "all_scores": all_scores,
    }
