"""
LexAI LLM Synthesis
====================
Claude API integration for generating human-readable legal analysis,
explanations, counter-clauses, and negotiation guides.
"""

import json
import os
from typing import Any

import google.generativeai as genai


def synthesize_analysis(
    doc_type: str,
    risky_clauses: list[dict[str, Any]],
    all_clauses: list[dict[str, Any]],
) -> dict[str, Any]:
    """Generate a comprehensive legal analysis using Claude.

    Sends the top 10 riskiest clauses to Claude (claude-sonnet-4-20250514) and
    returns a structured analysis with explanations, counter-clauses,
    and a negotiation guide.

    Args:
        doc_type: The classified document type (e.g. ``rental_agreement``).
        risky_clauses: Clause dicts sorted by risk_score descending.
        all_clauses: All clause dicts for context.

    Returns:
        A dict containing:
        - ``clause_analyses``: per-clause explanations.
        - ``document_summary``: overall summary.
        - ``top_things_to_know``: list of 3 key points.
        - ``negotiation_guide``: structured negotiation advice.

    Raises:
        RuntimeError: If ``GEMINI_API_KEY`` is not set.
    """
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY environment variable is not set")

    genai.configure(api_key=api_key)

    # Take top 3 riskiest clauses to prevent response truncation
    top_clauses = risky_clauses[:3]

    # Format clauses for the prompt
    clause_block = ""
    for i, c in enumerate(top_clauses):
        clause_block += (
            f"\n--- Clause {c.get('index', i)} "
            f"(Category: {c.get('category', 'unknown')}, "
            f"Risk Score: {c.get('risk_score', 0)}/100, "
            f"Risk Level: {c.get('risk_level', 'unknown')}) ---\n"
            f"{c.get('text', '')}\n"
        )

    doc_type_display = doc_type.replace("_", " ").title()

    user_prompt = f"""Analyze these clauses from a {doc_type_display}.

{clause_block}

For each clause provide:
1. A brief plain English explanation in exactly 1 sentence
2. Why this clause may disadvantage the signing party in exactly 1 sentence
3. A specific suggested counter-clause or negotiation point in exactly 1 sentence

Also provide:
- A 3-sentence overall summary of what this document is about
- Top 3 things the signer should know before signing
- A negotiation guide with:
  - Top 3 clauses to push back on with exact suggested wording
  - 3 Dos and 3 Don'ts for negotiating this type of document
  - Standard market terms for key metrics

Format your ENTIRE response as a JSON object with this exact structure:
{{
  "clause_analyses": [{{"clause_index": int, "explanation": str, "disadvantage": str, "counter_clause": str}}],
  "document_summary": str,
  "top_things_to_know": [str, str, str],
  "negotiation_guide": {{
    "push_back_clauses": [{{"clause_summary": str, "suggested_wording": str}}],
    "dos": [str],
    "donts": [str],
    "market_terms": [{{"metric": str, "standard": str}}]
  }}
}}

Return ONLY the JSON object, no other text."""

    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            system_instruction="You are a senior legal analyst. You provide clear, accurate legal analysis in JSON format. Always respond with valid JSON only."
        )
        response = model.generate_content(
            user_prompt,
            generation_config=genai.GenerationConfig(
                max_output_tokens=4096,
                response_mime_type="application/json"
            )
        )
        response_text = response.text if response.text else "{}"

        # Parse JSON from the response
        result = _parse_llm_json(response_text)
        return result

    except Exception as exc:
        return _fallback_analysis(top_clauses, doc_type_display, str(exc))


def _parse_llm_json(text: str) -> dict[str, Any]:
    """Parse JSON from Claude's response, handling markdown fences.

    Args:
        text: Raw response text.

    Returns:
        Parsed JSON dict.
    """
    cleaned = text.strip()

    # Robustly isolate the JSON block by finding the first '{' and the last '}'
    start = cleaned.find("{")
    end = cleaned.rfind("}")

    if start != -1 and end != -1 and end > start:
        json_str = cleaned[start : end + 1]
        try:
            return json.loads(json_str)
        except json.JSONDecodeError as exc:
            print(f"JSON decode failed on extracted brackets: {exc}")
            print(f"Extracted bracket text was: {json_str}")
            pass

    # Fallback to direct parsing
    try:
        if cleaned.startswith("```json"):
            cleaned = cleaned[7:]
        elif cleaned.startswith("```"):
            cleaned = cleaned[3:]
        if cleaned.endswith("```"):
            cleaned = cleaned[:-3]
        cleaned = cleaned.strip()
        return json.loads(cleaned)
    except Exception as exc:
        print(f"Direct JSON parse fallback failed: {exc}")
        print(f"Raw Cleaned Text was: {cleaned}")
        
        # Return a minimal structure on complete parse failure
        return {
            "clause_analyses": [],
            "document_summary": "Analysis completed but response parsing failed. Please retry.",
            "top_things_to_know": [
                "The LLM response could not be parsed.",
                "Risk scores and categories are still available.",
                "Please try re-running the analysis.",
            ],
            "negotiation_guide": {
                "push_back_clauses": [],
                "dos": ["Review all high-risk clauses carefully"],
                "donts": ["Do not sign without legal advice"],
                "market_terms": [],
            },
        }


def _fallback_analysis(
    clauses: list[dict[str, Any]],
    doc_type: str,
    error: str,
) -> dict[str, Any]:
    """Generate a minimal analysis when the LLM call fails.

    Args:
        clauses: The clauses that were to be analysed.
        doc_type: Display name of the document type.
        error: The error message.

    Returns:
        A minimal analysis dict.
    """
    clause_analyses = []
    for c in clauses:
        clause_analyses.append({
            "clause_index": c.get("index", 0),
            "explanation": f"This is a {c.get('category', 'general')} clause with "
                           f"risk level {c.get('risk_level', 'unknown')}.",
            "disadvantage": c.get("risk_reason", "Review this clause carefully."),
            "counter_clause": "Consult a legal professional for specific counter-clause language.",
        })

    return {
        "clause_analyses": clause_analyses,
        "document_summary": (
            f"This appears to be a {doc_type}. "
            f"LLM analysis encountered an error: {error}. "
            f"Risk scoring and clause classification results are still available."
        ),
        "top_things_to_know": [
            f"This is a {doc_type} with {len(clauses)} high-risk clauses identified.",
            "Automated risk scores are available but detailed analysis requires retry.",
            "Consider having a lawyer review clauses marked as 'critical' or 'high' risk.",
        ],
        "negotiation_guide": {
            "push_back_clauses": [],
            "dos": [
                "Review all clauses marked as high or critical risk",
                "Seek legal counsel before signing",
                "Compare with standard market terms",
                "Request modifications to one-sided clauses",
                "Keep written records of all negotiations",
            ],
            "donts": [
                "Do not sign without reading every clause",
                "Do not ignore high-risk clauses",
                "Do not agree to waive fundamental rights",
                "Do not accept unlimited liability provisions",
                "Do not overlook automatic renewal terms",
            ],
            "market_terms": [],
        },
    }
