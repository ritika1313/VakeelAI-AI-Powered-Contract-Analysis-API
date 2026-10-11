# Tell Gemini what to analysis and the expected output format
CONTRACT_ANALYSIS_PROMPT="""
    You are an expert legal analyst specializing in Indian contract law.
    Analyze the following contract text and provide a structured analysis.

    CONTRACT TEXT:
    {contract_text}

    Provide your analysis as a JSON object with exactly this structure:
    {{
    "summary": "A 2-3 sentence summary of what this contract is about",
    "contract_type": "The type of contract (eg., NDA, Service Agreement, Employment Contract)",
    "key_clauses": [
    {{
        "clause_title": "Name of the clause",
        "clause_text": "The relevant text from the contract",
        "explanation": "What this clause means in simple terms",
        "is_standard": true or false
    }}
],
"risk_flags": [
{{
    "risk_title": "Short title of the risk",
    "description": "What the risk is",
    "risk_level": "low, medium, high, or critical",
    "recommendation": "What to do about it",
    "clause_reference": "Which clause this refers to"
    }}
],
    "overall_risk_level": "low" or "medium" or "high" or "critical",
    "recommendations": [
    "Recommendation 1",
    "Recommendation 2"
    ]
}}
Rules:
- Identify at least 3-5 Key clauses
- Flag any unusual, missing, or one-sided clauses as risks
- Be specific with clause references
- Keep explanations simple and clear
- Return ONLY the JSON object, no other text
"""

CLAUSE_EXTRACTION_PROMPT="""
    Extract all distinct clauses from this contract text.
    For each clauses, provide the title and the full text.

    CONTRACT TEXT:
    {contract_text}
    Return as a JSON array:
    [
        {{
            "clause_title": "Title",
            "clause_text": "Full text of the clause"
        }}
    ]
    Return ONLY the JSON array, no other text.
"""

RISK_ASSESSMENT_PROMPT="""
You are a legal risk assessor. Review these contract and flag any risks.

CLAUSES:
{clauses_text}

For each risk found, provide:
{{
    "risk_title": "Short title",
    "description": "What makes this risky",
    "risk_level": "low" or "medium" or "high" or "critical",
    "recommendation": "What to do",
    "clause_reference": "Which clause"
}}
Return as a JSON array. Return ONLY the JSON array, no other text.
"""
SUMMARY_PROMPT="""
Summarize this contract in 3-4 sentences for a non-lawyer.
Include: what it's about, who the parties are, Key obligations, and duration.

CONTRACT TEXT:
{contract_text}

Return only the summary text, no JSON
"""
