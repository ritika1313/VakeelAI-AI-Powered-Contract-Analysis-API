# Sends text to Gemini, aprses JSON, and crates validated objects
import asyncio
import json
import logging
from google import genai
from app.config import GEMINI_API_KEY, GEMINI_FALLBACK_MODEL, GEMINI_MODEL
from app.models import AnalysisResult, ClauseAnalysis, RiskFlag
from app.service.prompt import CONTRACT_ANALYSIS_PROMPT


client = genai.Client(api_key=GEMINI_API_KEY)
logger = logging.getLogger(__name__)
TRANSIENT_API_STATUS_CODES = {429, 500, 502, 503, 504}

async def analyze_contract(contract_id: str, text_content: str):

    # Create prompt using contract text
    prompt = CONTRACT_ANALYSIS_PROMPT.format(
        contract_text=text_content[:15000]
    )

    interaction = None
    models = [GEMINI_MODEL]
    if GEMINI_FALLBACK_MODEL != GEMINI_MODEL:
        models.append(GEMINI_FALLBACK_MODEL)

    for model_index, model in enumerate(models):
        for attempt in range(2):
            try:
                interaction = await client.aio.interactions.create(
                    model=model,
                    input=prompt,
                    timeout=60.0,
                )
                break
            except Exception as exc:
                status_code = getattr(exc, "status_code", None)
                if status_code not in TRANSIENT_API_STATUS_CODES:
                    raise

                if attempt == 0:
                    logger.warning(
                        "Gemini model %s returned transient HTTP %s; retrying",
                        model,
                        status_code,
                    )
                    await asyncio.sleep(1)
                    continue

                if model_index + 1 < len(models):
                    logger.warning(
                        "Gemini model %s is still unavailable (HTTP %s); "
                        "trying fallback model %s",
                        model,
                        status_code,
                        models[model_index + 1],
                    )
                    break
                raise

        if interaction is not None:
            break

    if interaction is None:
        raise RuntimeError("Gemini did not return an interaction.")

    raw_text = interaction.output_text
    if not isinstance(raw_text, str) or not raw_text.strip():
        raise ValueError("Gemini returned no text output.")

    raw_text = raw_text.strip()

    # Remove Markdown JSON code block if Gemini returns one
    if raw_text.startswith("```json"):
        raw_text = raw_text[7:]

    elif raw_text.startswith("```"):
        raw_text = raw_text[3:]

    if raw_text.endswith("```"):
        raw_text = raw_text[:-3]

    raw_text = raw_text.strip()

    # Convert JSON string into Python dictionary
    try:
        analysis_data = json.loads(raw_text)
    except json.JSONDecodeError:
        raise ValueError(
            "Gemini returned an invalid JSON response."
        )
    if not isinstance(analysis_data, dict):
        raise ValueError("Gemini returned JSON that is not an analysis object.")

    # Convert key clauses into Pydantic objects
    key_clauses = [
        ClauseAnalysis(**clause)
        for clause in analysis_data.get("key_clauses", [])
    ]

    # Convert risk flags into Pydantic objects
    risk_flags = [
        RiskFlag(**risk)
        for risk in analysis_data.get("risk_flags", [])
    ]

    # Create final AnalysisResult object
    result = AnalysisResult(
        contract_id=contract_id,
        summary=analysis_data.get("summary", ""),
        contract_type=analysis_data.get(
            "contract_type",
            "Unknown"
        ),
        key_clauses=key_clauses,
        risk_flags=risk_flags,
        overall_risk_level=analysis_data.get(
            "overall_risk_level",
            "low"
        ),
        recommendations=analysis_data.get(
            "recommendations",
            []
        ),
    )

    return result