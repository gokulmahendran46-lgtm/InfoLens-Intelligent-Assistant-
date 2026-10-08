"""
InfoLens Backend - Services
Abstracts AI processing, document parsing, and search functionality.
"""
import asyncio
from models import (
    Document, DocumentStatus, DocumentType,
    ChatResponse, ComparisonResult
)
from demo_data import (
    DEMO_DOCUMENTS, DEMO_ISSUES, DEMO_INSIGHTS,
    DEMO_COMPARISON, CHAT_KEYWORD_RESPONSES, DEFAULT_CHAT_RESPONSE
)
import random
import os
import shutil
from fastapi import UploadFile

# In-memory storage for the hackathon MVP
DB = {
    "documents": DEMO_DOCUMENTS.copy(),
    "issues": DEMO_ISSUES.copy(),
    "insights": DEMO_INSIGHTS.copy()
}

class DocumentProcessor:
    @staticmethod
    async def process_file(file: UploadFile, upload_dir: str) -> Document:
        """Saves file to disk and creates initial document record."""
        os.makedirs(upload_dir, exist_ok=True)
        file_path = os.path.join(upload_dir, file.filename)
        
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        file_size = os.path.getsize(file_path)
        
        # Determine type
        ext = file.filename.split('.')[-1].lower()
        if ext == 'pdf':
            doc_type = DocumentType.pdf
        elif ext in ['doc', 'docx']:
            doc_type = DocumentType.docx
        elif ext == 'txt':
            doc_type = DocumentType.txt
        else:
            doc_type = DocumentType.image
            
        # Create a new document in "processing" state
        new_doc = Document(
            id=f"doc-new-{random.randint(1000, 9999)}",
            name=file.filename,
            type=doc_type,
            size=file_size,
            pages=random.randint(1, 10), # Mock page count
            uploadedAt=datetime.utcnow().isoformat() + "Z",
            status=DocumentStatus.processing
        )
        
        DB["documents"].insert(0, new_doc)
        
        # Start async AI processing
        asyncio.create_task(AIService.analyze_document_mock(new_doc.id))
        
        return new_doc


class AIService:
    """
    Abstraction layer for AI services.
    In a real app, this would connect to OpenAI/Gemini APIs.
    For the hackathon MVP, we use the mock data layer.
    """
    
    @staticmethod
    async def analyze_document_mock(doc_id: str):
        """Mocks the AI processing delay and updates document status."""
        await asyncio.sleep(2) # Simulate processing time
        
        for i, doc in enumerate(DB["documents"]):
            if doc.id == doc_id:
                # In a real app, we would use an LLM here to generate summary/issues
                # For demo, just mark as completed with empty summary if it's not a demo doc
                updated_doc = doc.copy()
                updated_doc.status = DocumentStatus.completed
                DB["documents"][i] = updated_doc
                break

    @staticmethod
    def chat_mock(message: str, document_ids: list[str] = None) -> ChatResponse:
        """Mocks context-aware RAG responses based on keywords."""
        msg_lower = message.lower()
        
        # Keyword matching for demo responses
        for keyword, data in CHAT_KEYWORD_RESPONSES.items():
            if keyword in msg_lower:
                return ChatResponse(
                    response=data["response"],
                    source_documents=data["sources"]
                )
                
        # Default response
        return ChatResponse(
            response=DEFAULT_CHAT_RESPONSE["response"],
            source_documents=DEFAULT_CHAT_RESPONSE["sources"]
        )

    @staticmethod
    def compare_documents_mock(doc_a_id: str, doc_b_id: str) -> ComparisonResult:
        """Mocks document comparison."""
        # Check if it's the specific demo comparison
        if (doc_a_id == "doc-1" and doc_b_id == "doc-3") or (doc_a_id == "doc-3" and doc_b_id == "doc-1"):
            # If reversed, we'd ideally flip the result, but returning the demo is fine for MVP
            return DEMO_COMPARISON
            
        # Generic mock response for other documents
        doc_a = next((d for d in DB["documents"] if d.id == doc_a_id), DB["documents"][0])
        doc_b = next((d for d in DB["documents"] if d.id == doc_b_id), DB["documents"][1])
        
        from models import ComparisonDifference
        return ComparisonResult(
            documentA=doc_a,
            documentB=doc_b,
            matchScore=random.randint(40, 95),
            summary=f"Comparison between {doc_a.name} and {doc_b.name} shows some differences.",
            differences=[
                ComparisonDifference(category="File Type", valueA=doc_a.type.value, valueB=doc_b.type.value, status="match" if doc_a.type == doc_b.type else "conflict"),
                ComparisonDifference(category="Size", valueA=f"{doc_a.size} bytes", valueB=f"{doc_b.size} bytes", status="changed"),
            ]
        )
from datetime import datetime
