from fastapi import APIRouter, Query, HTTPException
from typing import List
from app.models.schemas import SearchResult
from app.services.document_store import document_store
from app.services.ai_service import ai_service

router = APIRouter(prefix="/search", tags=["search"])


@router.get("", response_model=List[SearchResult])
async def search_documents(q: str = Query(..., min_length=2, description="Search query")):
    if not q.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")

    all_docs = document_store.get_all_with_texts()
    raw_results = await ai_service().search(q, all_docs)

    return [
        SearchResult(
            document_id=r["document_id"],
            document_name=r["document_name"],
            document_type=r.get("document_type", "pdf"),
            snippet=r["snippet"],
            relevance_score=r["relevance_score"],
            page_number=r.get("page_number"),
        )
        for r in raw_results
    ]
