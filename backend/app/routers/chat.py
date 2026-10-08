from fastapi import APIRouter, HTTPException
from app.models.schemas import ChatRequest, ChatResponse, SourceDocument
from app.services.document_store import document_store
from app.services.ai_service import ai_service
from datetime import datetime

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ChatResponse)
async def chat(request: ChatRequest):
    if not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    # Gather document context
    if request.document_ids:
        docs_with_text = [
            d for d in document_store.get_all_with_texts()
            if d["id"] in request.document_ids
        ]
    else:
        # Use all completed documents
        docs_with_text = document_store.get_all_with_texts()

    context_texts = [d["text"] for d in docs_with_text if d.get("text")]
    
    response_text = await ai_service().chat(
        message=request.message,
        context_texts=context_texts,
        history=request.conversation_history,
    )

    # Determine which documents are relevant
    source_docs = []
    for d in docs_with_text[:3]:
        doc = document_store.get_by_id(d["id"])
        if doc:
            source_docs.append(SourceDocument(
                id=doc.id,
                name=doc.name,
                excerpt=d.get("text", "")[:150] + "...",
            ))

    return ChatResponse(
        response=response_text,
        source_documents=source_docs,
        timestamp=datetime.utcnow(),
    )
