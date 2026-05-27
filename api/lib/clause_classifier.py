"""
LexAI Clause Classifier
=======================
Classify individual clauses into CUAD-inspired legal categories instantly
using a high-performance in-memory regex keyword engine. 
Bypasses network latency to ensure compatibility with serverless execution limits.
"""

import re
from typing import Any

# Highly optimized regex patterns for standard CUAD legal domains
_CATEGORY_PATTERNS = {
    "termination": re.compile(r"terminate|termination|cancel|expiry|expiration|cure\s+period", re.IGNORECASE),
    "indemnification": re.compile(r"indemnify|indemnity|indemnification|hold\s+harmless|defend", re.IGNORECASE),
    "governing law": re.compile(r"governing\s+law|jurisdiction|applicable\s+law|choice\s+of\s+law|courts\s+of", re.IGNORECASE),
    "limitation of liability": re.compile(r"limitation\s+of\s+liability|limit\s+liability|liability\s+cap|consequential\s+damages|indirect\s+damages", re.IGNORECASE),
    "non-compete": re.compile(r"non\-compete|noncompete|competing\s+business|covenant\s+not\s+to\s+compete|restrictive\s+covenant", re.IGNORECASE),
    "confidentiality": re.compile(r"confidential|confidentiality|non\-disclosure|disclosure\s+of|proprietary\s+information", re.IGNORECASE),
    "intellectual property": re.compile(r"intellectual\s+property|patent|trademark|copyright|invention|ownership\s+of\s+work|work\s+made\s+for\s+hire", re.IGNORECASE),
    "payment terms": re.compile(r"payment|invoice|fees|billing|salary|rent|deposit|compensation|price|interest\s+rate", re.IGNORECASE),
    "warranty": re.compile(r"warranty|warranties|guarantee|merchantability|fitness\s+for\s+purpose|as\-is", re.IGNORECASE),
    "dispute resolution": re.compile(r"dispute\s+resolution|arbitrate|arbitration|mediation|litigation|settlement", re.IGNORECASE),
    "force majeure": re.compile(r"force\s+majeure|act\s+of\s+god|unforeseen\s+circumstances|natural\s+disaster|pandemic", re.IGNORECASE),
    "assignment": re.compile(r"assignment|assign\s+this|transfer\s+rights|sub-license|successor", re.IGNORECASE),
    "notice requirements": re.compile(r"notice|notices|written\s+notice|deliver\s+notice|address\s+for\s+notice", re.IGNORECASE),
    "severability": re.compile(r"severable|severability|invalid\s+provision|unenforceable", re.IGNORECASE),
    "entire agreement": re.compile(r"entire\s+agreement|integration|supersedes|merger\s+clause|whole\s+agreement", re.IGNORECASE),
    "amendment": re.compile(r"amend|amendment|modification|written\s+instrument|written\s+agreement", re.IGNORECASE),
}


def classify_clauses(clauses: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Classify a list of clause dicts using lightning-fast in-memory regex heuristics.

    Bypasses external network calls completely to maintain speed under 5ms.

    Args:
        clauses: List of clause dicts, each containing at minimum a ``text`` key.

    Returns:
        The same list enriched with ``category`` and ``confidence`` fields.
    """
    enriched: list[dict[str, Any]] = []

    for clause in clauses:
        text = clause.get("text", "")
        if not text.strip():
            clause["category"] = "miscellaneous"
            clause["confidence"] = 0.0
            enriched.append(clause)
            continue

        matched_cat = "miscellaneous"
        max_matches = 0

        for cat, pattern in _CATEGORY_PATTERNS.items():
            matches = len(pattern.findall(text))
            if matches > max_matches:
                max_matches = matches
                matched_cat = cat

        clause["category"] = matched_cat
        clause["confidence"] = 1.0 if max_matches > 0 else 0.0
        enriched.append(clause)

    return enriched
