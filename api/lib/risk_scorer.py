"""
LexAI Risk Scoring Engine
==========================
Rule-based risk scoring for legal clauses using category base scores
and regex pattern matching for risk-amplifying language.
"""

import re
from typing import Any

# ---------------------------------------------------------------------------
# Base risk scores by clause category
# ---------------------------------------------------------------------------

_BASE_RISK: dict[str, int] = {
    "termination": 40,
    "indemnification": 60,
    "governing_law": 20,
    "limitation_of_liability": 55,
    "non-compete": 65,
    "non_compete": 65,
    "confidentiality": 35,
    "intellectual_property": 50,
    "payment_terms": 30,
    "warranty": 40,
    "dispute_resolution": 25,
    "force_majeure": 30,
    "assignment": 35,
    "notice_requirements": 20,
    "representations": 35,
    "insurance": 25,
    "audit_rights": 20,
    "data_protection": 40,
    "non-solicitation": 50,
    "non_solicitation": 50,
    "exclusivity": 55,
    "change_of_control": 45,
    "renewal_terms": 30,
    "severability": 10,
    "entire_agreement": 15,
    "amendment": 25,
    "waiver": 35,
    "arbitration": 30,
    "jurisdiction": 25,
    "definitions": 10,
    "scope_of_work": 25,
    "delivery_terms": 25,
    "acceptance_criteria": 20,
    "penalties": 55,
    "subcontracting": 30,
    "compliance": 25,
    "anti-corruption": 20,
    "anti_corruption": 20,
    "environmental": 20,
    "health_and_safety": 20,
    "termination_for_convenience": 50,
    "termination_for_cause": 45,
    "survival": 30,
    "miscellaneous": 15,
}

# ---------------------------------------------------------------------------
# Risk-amplifying regex patterns: (compiled_pattern, score_delta, reason)
# ---------------------------------------------------------------------------

_RISK_PATTERNS: list[tuple[re.Pattern, int, str]] = [
    (re.compile(r"sole\s+discretion", re.IGNORECASE), 30,
     "Grants unilateral sole discretion to one party"),
    (re.compile(r"without\s+(?:prior\s+)?notice", re.IGNORECASE), 25,
     "Allows action without prior notice"),
    (re.compile(r"indemnify\s+and\s+hold\s+harmless", re.IGNORECASE), 35,
     "Contains broad indemnification with hold harmless provision"),
    (re.compile(r"waive\s+all\s+rights", re.IGNORECASE), 40,
     "Requires waiving all rights"),
    (re.compile(r"perpetual(?:ly)?\s+(?:and\s+)?irrevocable", re.IGNORECASE), 35,
     "Imposes perpetual and irrevocable obligations"),
    (re.compile(r"unlimited\s+liability", re.IGNORECASE), 30,
     "Exposes party to unlimited liability"),
    (re.compile(r"non[\-\s]?refundable", re.IGNORECASE), 20,
     "Payments are non-refundable"),
    (re.compile(r"liquidated\s+damages", re.IGNORECASE), 25,
     "Specifies liquidated damages which may be punitive"),
    (re.compile(r"automatic(?:ally)?\s+renew", re.IGNORECASE), 15,
     "Contains automatic renewal provision"),
    (re.compile(r"unilateral(?:ly)?", re.IGNORECASE), 20,
     "Allows unilateral action by one party"),
    (re.compile(r"at\s+(?:its|their)\s+sole\s+expense", re.IGNORECASE), 15,
     "Places sole financial burden on one party"),
    (re.compile(r"forfeit", re.IGNORECASE), 25,
     "Contains forfeiture provisions"),
    (re.compile(r"penalty|penalt", re.IGNORECASE), 20,
     "Includes penalty provisions"),
    (re.compile(r"irrevocable\s+consent", re.IGNORECASE), 30,
     "Requires irrevocable consent"),
    (re.compile(r"waive\s+(?:any|all)\s+(?:right|claim)", re.IGNORECASE), 35,
     "Requires waiving rights or claims"),
]

# ---------------------------------------------------------------------------
# Risk level mapping
# ---------------------------------------------------------------------------


def _risk_level(score: int) -> str:
    """Map a numeric score to a risk level label.

    - 0–25: low
    - 26–50: medium
    - 51–75: high
    - 76–100: critical
    """
    if score <= 25:
        return "low"
    if score <= 50:
        return "medium"
    if score <= 75:
        return "high"
    return "critical"


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------


def score_risks(clauses: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Score the risk level of each clause in-place.

    Each clause dict is enriched with:
    - ``risk_score`` (int): 0–100 capped.
    - ``risk_level`` (str): ``low | medium | high | critical``.
    - ``risk_reason`` (str): human-readable explanation.

    Args:
        clauses: List of clause dicts, each with at minimum ``text``
            and ``category`` keys.

    Returns:
        The same list with risk fields added.
    """
    for clause in clauses:
        category = clause.get("category", "miscellaneous")
        text = clause.get("text", "")

        # Normalise category key (handle spaces / hyphens)
        cat_key = category.replace(" ", "_").replace("-", "_")
        base = _BASE_RISK.get(cat_key, _BASE_RISK.get(category, 20))

        score = base
        reasons: list[str] = []

        for pattern, delta, reason in _RISK_PATTERNS:
            if pattern.search(text):
                score += delta
                reasons.append(reason)

        # Cap at 100
        score = min(score, 100)

        if not reasons:
            reasons.append(
                f"Base risk for '{category}' category is {base}/100"
            )

        clause["risk_score"] = score
        clause["risk_level"] = _risk_level(score)
        clause["risk_reason"] = "; ".join(reasons)

    return clauses
