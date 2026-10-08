from fastapi import APIRouter, HTTPException
from app.models.schemas import CompareRequest, ComparisonResult, ComparisonDifference
from app.services.document_store import document_store
from app.services.ai_service import ai_service

router = APIRouter(prefix="/compare", tags=["compare"])


@router.post("", response_model=ComparisonResult)
async def compare_documents(request: CompareRequest):
    doc_a = document_store.get_by_id(request.document_a_id)
    doc_b = document_store.get_by_id(request.document_b_id)

    if not doc_a:
        raise HTTPException(status_code=404, detail=f"Document A '{request.document_a_id}' not found")
    if not doc_b:
        raise HTTPException(status_code=404, detail=f"Document B '{request.document_b_id}' not found")

    text_a = document_store.get_text(request.document_a_id)
    text_b = document_store.get_text(request.document_b_id)

    result_data = await ai_service().compare(text_a, text_b, doc_a.name, doc_b.name)

    differences = [
        ComparisonDifference(
            category=d["category"],
            value_a=d["value_a"],
            value_b=d["value_b"],
            status=d["status"],
        )
        for d in result_data.get("differences", [])
    ]

    return ComparisonResult(
        document_a_id=request.document_a_id,
        document_b_id=request.document_b_id,
        match_score=result_data.get("match_score", 50),
        summary=result_data.get("summary", "Comparison complete."),
        differences=differences,
    )
