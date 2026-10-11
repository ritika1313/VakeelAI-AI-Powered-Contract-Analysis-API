# Extracts text and calculate word/page count
import os
from PyPDF2 import PdfReader

def extract_text_from_pdf(file_path: str) -> dict[str, str | int]:
    """
    Extracts text from a document file.

    Args:
        file_path (str): The path to the document file.
    """
    reader = PdfReader(file_path)
    text = "\n".join(page.extract_text() or "" for page in reader.pages).strip()
    return {
        "text": text,
        "page_count": len(reader.pages),
        "word_count": len(text.split()),
    }


def extract_text_from_txt(file_path: str) -> dict[str, str | int]:
    """
    Extracts text from a document file.

    Args:
        file_path (str): The path to the document file.
    """
    with open(file_path, "r", encoding="utf-8") as f:
        text = f.read()
    return {
        "text": text,
        "page_count": len(text.splitlines()),
        "word_count": len(text.split()),
    }


def extract_text(file_path: str) -> dict[str, str | int]:
    """
    Extracts text from a document file.
    
    Args:
        file_path (str): The path to the document file.
    """
    ext = os.path.splitext(file_path)[1].lower()

    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext == ".txt":
        return extract_text_from_txt(file_path)
    else:
        raise ValueError("Unsupported file type. Only PDF and TXT files are allowed")