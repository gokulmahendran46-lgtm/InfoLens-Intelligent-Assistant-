"""
InfoLens Backend - Data Models
"""
from pydantic import BaseModel, Field
from typing import Optional
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


# ── Document Models ──────────────────────────────────────────

class DateEntry(BaseModel):
    label: str
    value: str


class AmountEntry(BaseModel):
    label: str
    value: str


class DocumentSummary(BaseModel):
    shortSummary: str
    keyPoints: list[str] = []
    importantDates: list[DateEntry] = []
    names: list[str] = []
    amounts: list[AmountEntry] = []
    deadlines: list[str] = []
    entities: list[str] = []
    actionItems: list[str] = []


class MissingField(BaseModel):
    fieldName: str
    isPresent: bool
    importance: str  # "required" | "recommended" | "optional"


class Issue(BaseModel):
    id: str
    type: str  # "conflict" | "missing" | "warning" | "info"
    title: str
    description: str
    severity: str  # "high" | "medium" | "low"
    documentIds: list[str] = []


class Document(BaseModel):
    id: str
    name: str
    type: DocumentType
    size: int
    pages: int
    uploadedAt: str
    status: DocumentStatus
    extractedText: Optional[str] = None
    summary: Optional[DocumentSummary] = None
    issues: list[Issue] = []
    missingFields: list[MissingField] = []


# ── Chat Models ──────────────────────────────────────────────

class SourceDocument(BaseModel):
    id: str
    name: str
    excerpt: str


class ChatRequest(BaseModel):
    message: str
    document_ids: Optional[list[str]] = None


class ChatResponse(BaseModel):
    response: str
    source_documents: list[SourceDocument] = []


# ── Compare Models ───────────────────────────────────────────

class CompareRequest(BaseModel):
    document_a_id: str
    document_b_id: str


class ComparisonDifference(BaseModel):
    category: str
    valueA: str
    valueB: str
    status: str  # "match" | "conflict" | "added" | "removed" | "changed"


class ComparisonResult(BaseModel):
    documentA: Document
    documentB: Document
    differences: list[ComparisonDifference] = []
    summary: str = ""
    matchScore: int = 0


# ── Insight Models ───────────────────────────────────────────

class SmartAction(BaseModel):
    id: str
    label: str
    description: str
    completed: bool = False


class Insight(BaseModel):
    id: str
    type: str  # "action" | "warning" | "info" | "success"
    title: str
    description: str
    priority: str  # "high" | "medium" | "low"
    relatedDocuments: list[str] = []
    actions: list[SmartAction] = []


# ── Search Models ────────────────────────────────────────────

class SearchResult(BaseModel):
    documentId: str
    documentName: str
    documentType: DocumentType
    snippet: str
    relevanceScore: float
    pageNumber: Optional[int] = None


# ── Auth Models ──────────────────────────────────────────────

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginRequest(BaseModel):
    username: str
    password: str
