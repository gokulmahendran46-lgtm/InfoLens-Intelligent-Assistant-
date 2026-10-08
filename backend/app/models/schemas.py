from pydantic import BaseModel, Field
from typing import Optional, List, Any, Dict
from datetime import datetime
from enum import Enum


class DocumentStatus(str, Enum):
    uploading = "uploading"
    processing = "processing"
    completed = "completed"
    failed = "failed"


class DocumentType(str, Enum):
    pdf = "pdf"
    docx = "docx"
    txt = "txt"
    image = "image"


class DateEntry(BaseModel):
    label: str
    value: str


class AmountEntry(BaseModel):
    label: str
    value: str


class DocumentSummary(BaseModel):
    short_summary: str
    key_points: List[str] = []
    important_dates: List[DateEntry] = []
    names: List[str] = []
    amounts: List[AmountEntry] = []
    deadlines: List[str] = []
    entities: List[str] = []
    action_items: List[str] = []


class MissingField(BaseModel):
    field_name: str
    is_present: bool
    importance: str = "recommended"  # required | recommended | optional


class Issue(BaseModel):
    id: str
    type: str  # conflict | missing | warning | info
    title: str
    description: str
    severity: str  # high | medium | low
    document_ids: List[str] = []


class DocumentResponse(BaseModel):
    id: str
    name: str
    type: DocumentType
    size: int
    pages: int
    uploaded_at: datetime
    status: DocumentStatus
    summary: Optional[DocumentSummary] = None
    issues: List[Issue] = []
    missing_fields: List[MissingField] = []


class UploadResponse(BaseModel):
    id: str
    name: str
    status: str
    message: str


class ChatRequest(BaseModel):
    message: str
    document_ids: Optional[List[str]] = None
    conversation_history: Optional[List[Dict[str, str]]] = None


class SourceDocument(BaseModel):
    id: str
    name: str
    excerpt: str


class ChatResponse(BaseModel):
    response: str
    source_documents: List[SourceDocument] = []
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class CompareRequest(BaseModel):
    document_a_id: str
    document_b_id: str


class ComparisonDifference(BaseModel):
    category: str
    value_a: str
    value_b: str
    status: str  # match | conflict | added | removed | changed


class ComparisonResult(BaseModel):
    document_a_id: str
    document_b_id: str
    match_score: int
    summary: str
    differences: List[ComparisonDifference] = []


class SearchRequest(BaseModel):
    query: str
    document_ids: Optional[List[str]] = None
    limit: int = 10


class SearchResult(BaseModel):
    document_id: str
    document_name: str
    document_type: str
    snippet: str
    relevance_score: float
    page_number: Optional[int] = None


class SmartAction(BaseModel):
    id: str
    label: str
    description: str
    completed: bool = False


class Insight(BaseModel):
    id: str
    type: str  # action | warning | info | success
    title: str
    description: str
    priority: str  # high | medium | low
    related_documents: List[str] = []
    actions: List[SmartAction] = []


class DashboardStats(BaseModel):
    total_documents: int
    processed_documents: int
    important_issues: int
    pending_actions: int
