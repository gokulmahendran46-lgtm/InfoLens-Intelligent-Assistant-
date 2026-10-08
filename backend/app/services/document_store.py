"""
In-memory document store for MVP/demo.
Replace with database (SQLAlchemy + PostgreSQL) for production.
"""
import uuid
from datetime import datetime
from typing import Dict, List, Optional
from app.models.schemas import (
    DocumentResponse, DocumentStatus, DocumentType,
    DocumentSummary, Issue, MissingField, DateEntry, AmountEntry
)


class InMemoryDocumentStore:
    def __init__(self):
        self._documents: Dict[str, DocumentResponse] = {}
        self._texts: Dict[str, str] = {}
        self._seed_demo_data()

    def _seed_demo_data(self):
        """Pre-load the college administration demo scenario."""
        docs = [
            DocumentResponse(
                id="doc-1",
                name="Student_Application_Gokul.pdf",
                type=DocumentType.pdf,
                size=245760,
                pages=4,
                uploaded_at=datetime(2026, 10, 8, 9, 0, 0),
                status=DocumentStatus.completed,
                summary=DocumentSummary(
                    short_summary="Student application form for Gokul Mahendran applying to B.Tech Computer Science Engineering.",
                    key_points=[
                        "Applicant: Gokul Mahendran",
                        "Program: B.Tech Computer Science Engineering",
                        "Register Number: 22CS0456",
                        "Date of Birth: 12/05/2004",
                        "Application Date: 05/10/2026",
                    ],
                    important_dates=[
                        DateEntry(label="Application Date", value="05/10/2026"),
                        DateEntry(label="Date of Birth", value="12/05/2004"),
                        DateEntry(label="Submission Deadline", value="15/10/2026"),
                    ],
                    names=["Gokul Mahendran", "Dr. Ramesh Kumar", "Chennai Institute of Technology"],
                    amounts=[AmountEntry(label="Application Fee", value="₹500")],
                    deadlines=["15/10/2026 – Application submission deadline"],
                    entities=["Chennai Institute of Technology", "Tamil Nadu State Board"],
                    action_items=["Submit community certificate", "Verify date of birth", "Complete fee payment"],
                ),
                issues=[
                    Issue(
                        id="issue-1",
                        type="conflict",
                        title="Date of Birth Conflict",
                        description="DOB differs between application (12/05/2004) and Aadhaar (15/05/2004).",
                        severity="high",
                        document_ids=["doc-1", "doc-3"],
                    ),
                    Issue(
                        id="issue-2",
                        type="missing",
                        title="Community Certificate Missing",
                        description="Community Certificate required for reservation verification.",
                        severity="high",
                        document_ids=["doc-1"],
                    ),
                ],
                missing_fields=[
                    MissingField(field_name="Full Name", is_present=True, importance="required"),
                    MissingField(field_name="Register Number", is_present=True, importance="required"),
                    MissingField(field_name="Date of Birth", is_present=True, importance="required"),
                    MissingField(field_name="Email Address", is_present=True, importance="required"),
                    MissingField(field_name="Community Certificate", is_present=False, importance="required"),
                    MissingField(field_name="Signature", is_present=False, importance="required"),
                ],
            ),
            DocumentResponse(
                id="doc-2",
                name="Marksheet_Class12_Gokul.pdf",
                type=DocumentType.pdf,
                size=189440,
                pages=2,
                uploaded_at=datetime(2026, 10, 8, 9, 2, 0),
                status=DocumentStatus.completed,
                summary=DocumentSummary(
                    short_summary="Class 12 marksheet for Gokul Mahendran. Total marks 578/600 (96.33%). Pass with Distinction.",
                    key_points=[
                        "Student: Gokul Mahendran",
                        "Register Number: 22CS0456",
                        "Percentage: 96.33%",
                        "Result: Pass with Distinction",
                    ],
                    important_dates=[DateEntry(label="Issue Date", value="15/06/2023")],
                    names=["Gokul Mahendran"],
                    amounts=[],
                    deadlines=[],
                    entities=["Tamil Nadu State Board"],
                    action_items=["Verify percentage for eligibility"],
                ),
                issues=[],
                missing_fields=[
                    MissingField(field_name="Student Name", is_present=True, importance="required"),
                    MissingField(field_name="Register Number", is_present=True, importance="required"),
                    MissingField(field_name="Subject Marks", is_present=True, importance="required"),
                ],
            ),
            DocumentResponse(
                id="doc-3",
                name="Aadhaar_ID_Gokul.jpg",
                type=DocumentType.image,
                size=512000,
                pages=1,
                uploaded_at=datetime(2026, 10, 8, 9, 4, 0),
                status=DocumentStatus.completed,
                summary=DocumentSummary(
                    short_summary="Aadhaar Card for Gokul Mahendran. ⚠️ Date of Birth (15/05/2004) differs from application form.",
                    key_points=[
                        "Name: Gokul Mahendran",
                        "Date of Birth: 15/05/2004",
                        "⚠️ DOB conflict with Application Form",
                    ],
                    important_dates=[DateEntry(label="Date of Birth (Aadhaar)", value="15/05/2004")],
                    names=["Gokul Mahendran"],
                    amounts=[],
                    deadlines=[],
                    entities=["UIDAI"],
                    action_items=["Verify correct Date of Birth", "Resolve DOB discrepancy"],
                ),
                issues=[],
                missing_fields=[
                    MissingField(field_name="Name", is_present=True, importance="required"),
                    MissingField(field_name="Date of Birth", is_present=True, importance="required"),
                    MissingField(field_name="Aadhaar Number", is_present=True, importance="required"),
                ],
            ),
            DocumentResponse(
                id="doc-4",
                name="Fee_Receipt_2026.pdf",
                type=DocumentType.pdf,
                size=98304,
                pages=1,
                uploaded_at=datetime(2026, 10, 8, 9, 6, 0),
                status=DocumentStatus.completed,
                summary=DocumentSummary(
                    short_summary="Fee receipt confirming ₹75,500 payment for Gokul Mahendran for academic year 2026-27.",
                    key_points=[
                        "Receipt Number: FR-2026-00892",
                        "Total Paid: ₹75,500",
                        "Payment Mode: Online Transfer",
                        "Status: Confirmed",
                    ],
                    important_dates=[DateEntry(label="Payment Date", value="07/10/2026")],
                    names=["Gokul Mahendran"],
                    amounts=[
                        AmountEntry(label="Tuition Fee", value="₹65,000"),
                        AmountEntry(label="Lab Fee", value="₹8,000"),
                        AmountEntry(label="Library Fee", value="₹2,000"),
                        AmountEntry(label="Total", value="₹75,500"),
                    ],
                    deadlines=["15/01/2027 – Second semester fee payment"],
                    entities=["Chennai Institute of Technology"],
                    action_items=["Keep receipt for records", "Note next semester payment"],
                ),
                issues=[],
                missing_fields=[
                    MissingField(field_name="Receipt Number", is_present=True, importance="required"),
                    MissingField(field_name="Amount", is_present=True, importance="required"),
                    MissingField(field_name="Authorized Signature", is_present=True, importance="required"),
                ],
            ),
        ]

        demo_texts = {
            "doc-1": "Student Application Form\nApplicant: Gokul Mahendran\nRegister Number: 22CS0456\nDate of Birth: 12/05/2004\nProgram: B.Tech Computer Science Engineering\nDeadline: 15/10/2026",
            "doc-2": "Marksheet - Tamil Nadu State Board\nStudent: Gokul Mahendran\nRegister: 22CS0456\nTotal: 578/600 (96.33%)\nResult: Pass with Distinction",
            "doc-3": "Aadhaar Card\nName: Gokul Mahendran\nDate of Birth: 15/05/2004\nUID: XXXX-XXXX-5678\nAddress: Chennai, Tamil Nadu",
            "doc-4": "Fee Receipt FR-2026-00892\nStudent: Gokul Mahendran\nTuition: 65000 Lab: 8000 Library: 2000\nTotal: 75500\nDate: 07/10/2026\nNext due: 15/01/2027",
        }

        for doc in docs:
            self._documents[doc.id] = doc
            self._texts[doc.id] = demo_texts.get(doc.id, "")

    def get_all(self) -> List[DocumentResponse]:
        return sorted(self._documents.values(), key=lambda d: d.uploaded_at, reverse=True)

    def get_by_id(self, doc_id: str) -> Optional[DocumentResponse]:
        return self._documents.get(doc_id)

    def create(self, doc: DocumentResponse, text: str = "") -> DocumentResponse:
        self._documents[doc.id] = doc
        self._texts[doc.id] = text
        return doc

    def update(self, doc_id: str, **kwargs) -> Optional[DocumentResponse]:
        doc = self._documents.get(doc_id)
        if not doc:
            return None
        updated = doc.model_copy(update=kwargs)
        self._documents[doc_id] = updated
        return updated

    def delete(self, doc_id: str) -> bool:
        if doc_id not in self._documents:
            return False
        del self._documents[doc_id]
        self._texts.pop(doc_id, None)
        return True

    def get_text(self, doc_id: str) -> str:
        return self._texts.get(doc_id, "")

    def get_all_with_texts(self) -> List[Dict]:
        return [
            {
                "id": doc.id,
                "name": doc.name,
                "type": doc.type,
                "text": self._texts.get(doc.id, ""),
            }
            for doc in self._documents.values()
        ]


# Singleton store
document_store = InMemoryDocumentStore()
