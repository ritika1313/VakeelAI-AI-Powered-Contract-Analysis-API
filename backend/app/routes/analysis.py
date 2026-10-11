# Coordinates the analysis request, database updates, and response
from fastapi import APIRouter, HTTPException
from bson import ObjectId
from bson.errors import InvalidId
import logging

from app.config import GEMINI_API_KEY
from app.database import contracts_collection, analyses_collection
from app.service.gemini_analyse import analyze_contract


router = APIRouter(
    prefix="/analysis",
    tags=["analysis"],
)

logger = logging.getLogger(__name__)


def _parse_object_id(value: str, resource: str) -> ObjectId:
    try:
        return ObjectId(value)
    except (InvalidId, TypeError):
        raise HTTPException(
            status_code=400,
            detail=f"Invalid {resource} ID"
        ) from None


def _serialize_analysis(doc: dict) -> dict:
    doc = dict(doc)
    doc["id"] = str(doc.pop("_id"))
    return doc


@router.post("/analyse/{contract_id}")
async def analyse_contract(contract_id: str):
    """
    Analyze a contract using AI and return insights.
    """

    # Check Gemini API key
    if not GEMINI_API_KEY:
        raise HTTPException(
            status_code=500,
            detail="AI API Key is not configured"
        )

    # Validate ObjectId
    object_id = _parse_object_id(contract_id, "contract")

    # Find contract
    contract = contracts_collection.find_one({
        "_id": object_id
    })

    if not contract:
        raise HTTPException(
            status_code=404,
            detail="Contract not found"
        )

    # Check extracted text
    if not contract.get("text_content"):
        raise HTTPException(
            status_code=400,
            detail="Contract has no text content to analyze"
        )

    # Mark analysis as in progress
    contracts_collection.update_one(
        {"_id": object_id},
        {
            "$set": {
                "analysis_status": "in_progress"
            }
        }
    )

    try:
        # Analyze contract using Gemini
        result = await analyze_contract(
            contract_id,
            contract["text_content"]
        )

        # Convert Pydantic model to dictionary
        doc = result.model_dump()

        # Save analysis in MongoDB
        insert_result = analyses_collection.insert_one(doc)

        # Add MongoDB analysis ID to response
        result.id = str(insert_result.inserted_id)

        # Mark contract analysis as completed
        contracts_collection.update_one(
            {"_id": object_id},
            {
                "$set": {
                    "analysis_status": "completed"
                }
            }
        )

        return {
            "message": "Contract analyzed successfully",
            "analysis": result.model_dump(),
            "id": result.id
        }

    except Exception:
        logger.exception("Contract analysis failed for contract %s", contract_id)

        # Mark analysis as failed
        contracts_collection.update_one(
            {"_id": object_id},
            {
                "$set": {
                    "analysis_status": "failed"
                }
            }
        )

        raise HTTPException(
            status_code=500,
            detail="Contract analysis failed. Check the server logs for details."
        ) from None

@router.get("/{analysis_id}")
def get_analysis(analysis_id: str):
    """
    Retrieve the results of a specific analysis by ID.
    """
    object_id = _parse_object_id(analysis_id, "analysis")
    analysis = analyses_collection.find_one({"_id": object_id})

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    return {"analysis": _serialize_analysis(analysis)}


@router.get("/")
def list_analyses():
    """
    List all analyses performed.
    """
    analyses = [
        _serialize_analysis(doc)
        for doc in analyses_collection.find({})
    ]
    return {"analyses": analyses}

@router.get("/contract/{contract_id}")
async def get_analyses_for_contract(contract_id: str):
    """
    Get all analyses for a specific contract.
    """
    analyses = [
        _serialize_analysis(doc)
        for doc in analyses_collection.find({"contract_id": contract_id})
    ]
    return {"analyses": analyses, "total": len(analyses)}

    