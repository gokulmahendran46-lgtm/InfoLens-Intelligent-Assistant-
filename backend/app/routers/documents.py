import uuid
import os
import asyncio
from datetime import datetime
from pathlib import Path
from typing import List

from fastapi import APIRouter, UploadFile, File, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse

from app.config import settings
from app.models.schemas import DocumentResponse, DocumentStatus, DocumentType, UploadResponse, MissingField
from app.services.document_store import document_store
from app.services.document_processor import extract_text_from_file
from app.services.ai_service import ai_service

router = APIRouter(prefix="/documents", tags=["documents"])

ALLOWED_TYPES = {
    "application/pdf": DocumentType.pdf,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": DocumentType.docx,
    "text/plain": DocumentType.txt,
    "image/jpeg": DocumentType.image,
    "image/png": DocumentType.image,
    "image/webp": DocumentType.image,
    "image/gif": DocumentType.image,
}

ALLOWED_EXTENSIONS = {".pdf", ".docx", ".doc", ".txt", ".jpg", ".jpeg", ".png", ".webp"}


def _get_doc_type(filename: str, content_type: str) -> DocumentType:
    ext = Path(filename).suffix.lower()
    if ext == ".pdf":
        return DocumentType.pdf
    if ext in (".docx", ".doc"):
        return DocumentType.docx
    if ext == ".txt":
        return DocumentType.txt
    if ext in (".jpg", ".jpeg", ".png", ".webp", ".gif"):
        return DocumentType.image
    return ALLOWED_TYPES.get(content_type, DocumentType.pdf)


async def _process_document(doc_id: str, file_path: str, filename: str):
    """Background task: extract text, run AI analysis, update document."""
    try:
        await asyncio.sleep(1)  # Simulate processing start
        document_store.update(doc_id, status=DocumentStatus.processing)

        # Extract text
        text, pages = extract_text_from_file(file_path, filename)

        # AI summarization
        summary = await ai_service().summarize(text, filename)

        # Detect missing fields based on document type
        missing_fields = _detect_missing_fields(text, filename)

        document_store.update(
            doc_id,
            status=DocumentStatus.completed,
            pages=pages,
            summary=summary,
            missing_fields=missing_fields,
        )

        # Update the stored text for search
        doc = document_store.get_by_id(doc_id)
        if doc:
            # re-store with text
            import app.services.document_store as ds
            ds.document_store._texts[doc_id] = text

    except Exception as e:
        document_store.update(doc_id, status=DocumentStatus.failed)
        print(f"Processing failed for {doc_id}: {e}")


def _detect_missing_fields(text: str, filename: str) -> List[MissingField]:
    """Simple heuristic-based missing field detection."""
    text_lower = text.lower()
    fields = []

    common_fields = [
        ("Full Name", ["name:", "applicant:", "student:"]),
        ("Date of Birth", ["date of birth", "dob:", "d.o.b"]),
        ("Email Address", ["email:", "@", "e-mail:"]),
        ("Phone Number", ["phone:", "mobile:", "contact:"]),
        ("Signature", ["signature", "signed by"]),
    ]

    for field_name, indicators in common_fields:
        is_present = any(ind in text_lower for ind in indicators)
        fields.append(MissingField(field_name=field_name, is_present=is_present, importance="required"))

    return fields


@router.get("", response_model=List[DocumentResponse])
async def get_documents():
    return document_store.get_all()


@router.get("/{doc_id}", response_model=DocumentResponse)
async def get_document(doc_id: str):
    doc = document_store.get_by_id(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail=f"Document '{doc_id}' not found")
    return doc


@router.post("/upload", response_model=List[UploadResponse])
async def upload_documents(
    background_tasks: BackgroundTasks,
    files: List[UploadFile] = File(...),
):
    if not files:
        raise HTTPException(status_code=400, detail="No files provided")

    results = []
    max_bytes = settings.max_file_size_mb * 1024 * 1024

    for file in files:
        # Validate extension
        ext = Path(file.filename or "").suffix.lower()
        if ext not in ALLOWED_EXTENSIONS:
            results.append(UploadResponse(
                id="", name=file.filename or "", status="rejected",
                message=f"File type '{ext}' not supported"
            ))
            continue

        # Read content
        content = await file.read()
        if len(content) > max_bytes:
            results.append(UploadResponse(
                id="", name=file.filename or "", status="rejected",
                message=f"File exceeds {settings.max_file_size_mb}MB limit"
            ))
            continue

        # Save to disk
        doc_id = str(uuid.uuid4())
        safe_name = f"{doc_id}_{file.filename}"
        file_path = os.path.join(settings.upload_dir, safe_name)
        with open(file_path, "wb") as f:
            f.write(content)

        # Create document record
        doc_type = _get_doc_type(file.filename or "", file.content_type or "")
        doc = DocumentResponse(
            id=doc_id,
            name=file.filename or "unnamed",
            type=doc_type,
            size=len(content),
            pages=1,
            uploaded_at=datetime.utcnow(),
            status=DocumentStatus.uploading,
        )
        document_store.create(doc)

        # Queue background processing
        background_tasks.add_task(_process_document, doc_id, file_path, file.filename or "")

        results.append(UploadResponse(
            id=doc_id,
            name=file.filename or "",
            status="accepted",
            message="Document uploaded and queued for processing"
        ))

    return results


@router.post("/{doc_id}/summarize", response_model=DocumentResponse)
async def summarize_document(doc_id: str):
    doc = document_store.get_by_id(doc_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    text = document_store.get_text(doc_id)
    if not text:
        raise HTTPException(status_code=400, detail="Document text not available")

    summary = await ai_service().summarize(text, doc.name)
    updated = document_store.update(doc_id, summary=summary, status=DocumentStatus.completed)
    return updated


@router.delete("/{doc_id}")
async def delete_document(doc_id: str):
    if not document_store.delete(doc_id):
        raise HTTPException(status_code=404, detail="Document not found")
    return {"message": "Document deleted successfully"}
