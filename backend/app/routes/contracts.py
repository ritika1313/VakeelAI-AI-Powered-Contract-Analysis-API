# Handles uploading and retrieveing contract records
from fastapi import APIRouter, UploadFile, File, HTTPException
from bson import ObjectId
from bson.errors import InvalidId
import logging
import os
import uuid
from app.config import ALLOWED_EXTENSIONS, MAX_FILE_SIZE_MB, UPLOAD_DIR
from app.service.document_parser import extract_text
from app.database import contracts_collection
from app.models import Contract

router = APIRouter(
    prefix="/contracts",
    tags=["contracts"],
)

logger = logging.getLogger(__name__)

@router.post("/upload")
async def upload_contract(
    file: UploadFile = File(...)
):
    """
    Upload a PDF or TXT contract for analysis.
    """

    ext = os.path.splitext(file.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="File type not allowed")

    content = await file.read()

    size_mb = len(content) / (1024 * 1024)

    if size_mb > MAX_FILE_SIZE_MB:
        raise HTTPException(status_code=400, detail="File size excedds the maximum length")

    os.makedirs(UPLOAD_DIR, exist_ok=True)
    unique_name = f"{uuid.uuid4().hex}{ext}"

    file_path = os.path.join(UPLOAD_DIR, unique_name)

    with open(file_path, "wb") as f:
        f.write(content)

    try:
        parsed = extract_text(file_path)
    except Exception:
        os.remove(file_path)
        logger.exception("Failed to parse uploaded contract %s", unique_name)
        raise HTTPException(
            status_code=400,
            detail="Unable to parse the uploaded contract"
        ) from None

    if not parsed["text"].strip():
        os.remove(file_path)
        raise HTTPException(
            status_code=400,
            detail="No text could be extracted. Scanned PDFs require OCR, which is not supported."
        )

    contract_data = Contract(
        filename=unique_name,
        original_name=file.filename,
        text_content=parsed["text"],
        page_count=parsed["page_count"],
        word_count=parsed["word_count"],
    )

    doc = contract_data.model_dump()
    result = contracts_collection.insert_one(doc)
    contract_data.id = str(result.inserted_id)

    return{
        "message": "File uploaded and processed successfully",
        "contract": contract_data.model_dump(),
        "id": contract_data.id
    }

@router.get("/")
async def list_contracts():
    """
    List all uploaded contracts.
    """
    contracts = []
    for doc in contracts_collection.find({}, {"text_content": 0}):
        contract = Contract(**doc)
        contract.id = str(doc["_id"])
        contracts.append(contract.model_dump())
    return {"contracts": contracts}

@router.get("/{contract_id}")
async def get_contract(contract_id: str):
    """
    Retrieve a specific contract by its ID.
    """
    try:
        object_id = ObjectId(contract_id)
    except (InvalidId, TypeError):
        raise HTTPException(status_code=400, detail="Invalid contract ID") from None

    doc = contracts_collection.find_one({"_id": object_id})
    if not doc:
        raise HTTPException(status_code=404, detail="Contract not found")

    contract = Contract(**doc)
    contract.id = str(doc["_id"])

    return {"contract": contract.model_dump()}
