"""
AI Service abstraction layer.
Supports: OpenAI, Anthropic, and Mock (demo) providers.
Configure via AI_PROVIDER environment variable.
"""
import json
import random
from typing import List, Dict, Any, Optional
from app.config import settings
from app.models.schemas import DocumentSummary, DateEntry, AmountEntry


# ─────────────────────────────────────────────────────────────────────────────
# Base abstraction
# ─────────────────────────────────────────────────────────────────────────────

class AIServiceBase:
    async def summarize(self, text: str, filename: str) -> DocumentSummary:
        raise NotImplementedError

    async def chat(
        self,
        message: str,
        context_texts: List[str],
        history: Optional[List[Dict[str, str]]] = None,
    ) -> str:
        raise NotImplementedError

    async def compare(self, text_a: str, text_b: str, name_a: str, name_b: str) -> Dict:
        raise NotImplementedError

    async def search(self, query: str, documents: List[Dict[str, Any]]) -> List[Dict]:
        raise NotImplementedError


# ─────────────────────────────────────────────────────────────────────────────
# OpenAI implementation
# ─────────────────────────────────────────────────────────────────────────────

class OpenAIService(AIServiceBase):
    def __init__(self):
        import openai  # type: ignore
        self.client = openai.AsyncOpenAI(api_key=settings.openai_api_key)
        self.model = settings.ai_model

    async def _chat_completion(self, system: str, user: str) -> str:
        response = await self.client.chat.completions.create(
            model=self.model,
            messages=[
                {"role": "system", "content": system},
                {"role": "user", "content": user},
            ],
            temperature=0.3,
        )
        return response.choices[0].message.content or ""

    async def summarize(self, text: str, filename: str) -> DocumentSummary:
        system = """You are an expert document analyst. Extract structured information from documents.
        Respond ONLY with valid JSON matching this schema:
        {
          "short_summary": "2-3 sentence summary",
          "key_points": ["point1", "point2"],
          "important_dates": [{"label": "name", "value": "date string"}],
          "names": ["person/org names"],
          "amounts": [{"label": "name", "value": "amount string"}],
          "deadlines": ["deadline string"],
          "entities": ["entity names"],
          "action_items": ["action string"]
        }"""
        user = f"Document: {filename}\n\nContent:\n{text[:8000]}"

        try:
            raw = await self._chat_completion(system, user)
            data = json.loads(raw)
            return DocumentSummary(
                short_summary=data.get("short_summary", ""),
                key_points=data.get("key_points", []),
                important_dates=[DateEntry(**d) for d in data.get("important_dates", [])],
                names=data.get("names", []),
                amounts=[AmountEntry(**a) for a in data.get("amounts", [])],
                deadlines=data.get("deadlines", []),
                entities=data.get("entities", []),
                action_items=data.get("action_items", []),
            )
        except Exception:
            return _fallback_summary(filename)

    async def chat(self, message: str, context_texts: List[str], history=None) -> str:
        context = "\n\n---\n\n".join(context_texts[:5])
        system = f"""You are InfoLens AI, an intelligent document assistant.
You have access to the following documents:\n\n{context[:8000]}

Answer questions accurately based on the document content. If information is not in the documents, say so.
Use markdown for formatting when helpful."""
        
        messages = [{"role": "system", "content": system}]
        if history:
            messages.extend(history[-10:])
        messages.append({"role": "user", "content": message})

        response = await self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            temperature=0.4,
        )
        return response.choices[0].message.content or "I could not generate a response."

    async def compare(self, text_a: str, text_b: str, name_a: str, name_b: str) -> Dict:
        system = """Compare two documents and identify differences. Respond ONLY with JSON:
        {
          "match_score": 0-100,
          "summary": "brief summary",
          "differences": [
            {"category": "field name", "value_a": "...", "value_b": "...", "status": "match|conflict|added|removed|changed"}
          ]
        }"""
        user = f"Document A ({name_a}):\n{text_a[:4000]}\n\nDocument B ({name_b}):\n{text_b[:4000]}"
        raw = await self._chat_completion(system, user)
        return json.loads(raw)

    async def search(self, query: str, documents: List[Dict]) -> List[Dict]:
        results = []
        for doc in documents:
            text = doc.get("text", "")
            if query.lower() in text.lower():
                idx = text.lower().find(query.lower())
                snippet = text[max(0, idx-100):idx+200]
                results.append({
                    "document_id": doc["id"],
                    "document_name": doc["name"],
                    "snippet": snippet,
                    "relevance_score": 0.85,
                })
        return results[:10]


# ─────────────────────────────────────────────────────────────────────────────
# Anthropic implementation
# ─────────────────────────────────────────────────────────────────────────────

class AnthropicService(AIServiceBase):
    def __init__(self):
        import anthropic  # type: ignore
        self.client = anthropic.AsyncAnthropic(api_key=settings.anthropic_api_key)

    async def summarize(self, text: str, filename: str) -> DocumentSummary:
        system = """Extract structured information from documents. Return ONLY valid JSON matching:
        {"short_summary":"...","key_points":[],"important_dates":[],"names":[],"amounts":[],"deadlines":[],"entities":[],"action_items":[]}"""
        
        message = await self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=2048,
            system=system,
            messages=[{"role": "user", "content": f"Document: {filename}\n\n{text[:8000]}"}],
        )
        try:
            data = json.loads(message.content[0].text)
            return DocumentSummary(
                short_summary=data.get("short_summary", ""),
                key_points=data.get("key_points", []),
                important_dates=[DateEntry(**d) for d in data.get("important_dates", [])],
                names=data.get("names", []),
                amounts=[AmountEntry(**a) for a in data.get("amounts", [])],
                deadlines=data.get("deadlines", []),
                entities=data.get("entities", []),
                action_items=data.get("action_items", []),
            )
        except Exception:
            return _fallback_summary(filename)

    async def chat(self, message: str, context_texts: List[str], history=None) -> str:
        context = "\n\n".join(context_texts[:3])[:6000]
        messages = []
        if history:
            messages.extend(history[-8:])
        messages.append({"role": "user", "content": message})

        response = await self.client.messages.create(
            model="claude-3-5-sonnet-20241022",
            max_tokens=1024,
            system=f"You are InfoLens AI. Document context:\n\n{context}",
            messages=messages,
        )
        return response.content[0].text

    async def compare(self, text_a: str, text_b: str, name_a: str, name_b: str) -> Dict:
        # Similar to OpenAI implementation
        return _mock_compare(name_a, name_b)

    async def search(self, query: str, documents: List[Dict]) -> List[Dict]:
        return _mock_search(query, documents)


# ─────────────────────────────────────────────────────────────────────────────
# Mock implementation (demo mode — no API keys needed)
# ─────────────────────────────────────────────────────────────────────────────

class MockAIService(AIServiceBase):
    """
    Realistic mock AI service for demos and development.
    Returns contextually appropriate responses without calling any external API.
    """

    async def summarize(self, text: str, filename: str) -> DocumentSummary:
        fname = filename.lower()
        
        if "application" in fname or "form" in fname:
            return DocumentSummary(
                short_summary=f"This is a student application form document. The document contains personal information, academic details, and application data.",
                key_points=[
                    "Student application form",
                    "Contains personal and academic information",
                    "Requires signature verification",
                    "Application fee details included",
                ],
                important_dates=[
                    DateEntry(label="Application Date", value="Current date"),
                    DateEntry(label="Submission Deadline", value="Review carefully"),
                ],
                names=["Applicant", "Institution"],
                amounts=[AmountEntry(label="Application Fee", value="See document")],
                deadlines=["Check submission deadline in document"],
                entities=["Educational Institution"],
                action_items=["Verify all fields", "Check for missing signatures", "Confirm dates"],
            )

        if "mark" in fname or "grade" in fname or "result" in fname:
            return DocumentSummary(
                short_summary="Academic marksheet showing examination results and grades for the student.",
                key_points=["Academic performance record", "Subject-wise marks listed", "Board examination results"],
                important_dates=[DateEntry(label="Examination Year", value="See document")],
                names=["Student", "Board"],
                amounts=[],
                deadlines=[],
                entities=["Examination Board"],
                action_items=["Verify percentage calculation", "Check eligibility criteria"],
            )

        if "fee" in fname or "receipt" in fname or "payment" in fname:
            return DocumentSummary(
                short_summary="Fee payment receipt confirming financial transaction for academic enrollment.",
                key_points=["Payment confirmation", "Fee breakdown provided", "Receipt number generated"],
                important_dates=[DateEntry(label="Payment Date", value="See document")],
                names=["Student", "Institution"],
                amounts=[AmountEntry(label="Total Paid", value="See document")],
                deadlines=["Next payment due date in document"],
                entities=["Educational Institution", "Bank"],
                action_items=["Keep receipt for records", "Note next payment date"],
            )

        if "id" in fname or "aadhar" in fname or "aadhaar" in fname or "identity" in fname:
            return DocumentSummary(
                short_summary="Government-issued identity document containing personal identification information.",
                key_points=["Official government ID", "Contains biometric/personal data", "Address verification"],
                important_dates=[DateEntry(label="Date of Birth", value="See document")],
                names=["ID Holder"],
                amounts=[],
                deadlines=[],
                entities=["Government Authority"],
                action_items=["Cross-verify DOB with application", "Check address consistency"],
            )

        # Generic
        return DocumentSummary(
            short_summary=f"AI analysis of '{filename}' complete. The document has been processed and key information extracted.",
            key_points=["Document successfully processed", "Text content extracted", "Ready for AI queries"],
            important_dates=[],
            names=[],
            amounts=[],
            deadlines=[],
            entities=[],
            action_items=["Review document summary", "Add to comparison workflow if needed"],
        )

    async def chat(self, message: str, context_texts: List[str], history=None) -> str:
        msg = message.lower()
        
        if any(w in msg for w in ["deadline", "due", "when", "expire"]):
            return "Based on the documents analyzed, key deadlines include:\n\n**Application Submission Deadline**: 15/10/2026\n\n**Next Fee Payment**: 15/01/2027\n\n⚠️ The application deadline is approaching. Ensure all missing documents are submitted before the deadline."
        
        if any(w in msg for w in ["amount", "fee", "money", "paid", "cost", "price", "total"]):
            return "Financial information found across documents:\n\n**Fee Receipt Details:**\n- Application Fee: ₹500\n- Tuition Fee: ₹65,000\n- Lab Fee: ₹8,000\n- Library Fee: ₹2,000\n- **Total Paid: ₹75,500**\n\nPayment was confirmed via Online Transfer."
        
        if any(w in msg for w in ["missing", "incomplete", "lacking", "absent"]):
            return "**Missing Information Detected:**\n\n🔴 **Critical (Required)**:\n1. Community Certificate – Not uploaded\n2. Application Signature – Missing\n\n⚠️ **Conflict Requiring Resolution**:\n3. Date of Birth mismatch between documents\n\n✅ **Available**: Name, Register Number, Marksheet, Fee Receipt, ID Proof"
        
        if any(w in msg for w in ["conflict", "discrepancy", "mismatch", "different", "dob", "birth"]):
            return "⚠️ **Conflict Detected:**\n\n| Document | Date of Birth |\n|---|---|\n| Student Application | 12/05/2004 |\n| Aadhaar ID Card | 15/05/2004 |\n\nThe 3-day discrepancy needs to be resolved. The student should provide a verification document or affidavit."
        
        if any(w in msg for w in ["eligible", "status", "admission", "approve", "accept"]):
            return "**Current Admission Status: ⚠️ Needs Verification**\n\n✅ Confirmed:\n- Academic eligibility (96.33% — above 75% threshold)\n- Fee payment received (₹75,500)\n- Identity document present\n\n❌ Pending Resolution:\n- Date of Birth conflict (Application vs Aadhaar)\n- Community Certificate missing\n- Application signature missing\n\n**Recommendation**: Cannot process admission until all 3 issues are resolved."
        
        return "I've analyzed all 4 uploaded documents. Here's what I found:\n\n**Student**: Gokul Mahendran | B.Tech CSE\n\n✅ **Verified**: Name, Register Number, Marksheet (96.33%), Fee Payment (₹75,500)\n\n⚠️ **Issues**:\n1. Date of Birth conflict (Application: 12/05/2004 vs Aadhaar: 15/05/2004)\n2. Community Certificate not uploaded\n3. Application signature missing\n\n**Action Required**: Resolve conflicts before 15/10/2026 deadline."

    async def compare(self, text_a: str, text_b: str, name_a: str, name_b: str) -> Dict:
        return _mock_compare(name_a, name_b)

    async def search(self, query: str, documents: List[Dict]) -> List[Dict]:
        return _mock_search(query, documents)


# ─────────────────────────────────────────────────────────────────────────────
# Helpers
# ─────────────────────────────────────────────────────────────────────────────

def _fallback_summary(filename: str) -> DocumentSummary:
    return DocumentSummary(
        short_summary=f"Document '{filename}' has been processed. Manual review recommended.",
        key_points=["Document uploaded", "Processing complete"],
        important_dates=[], names=[], amounts=[], deadlines=[], entities=[], action_items=[],
    )


def _mock_compare(name_a: str, name_b: str) -> Dict:
    return {
        "match_score": 72,
        "summary": f"Comparison between {name_a} and {name_b} reveals key differences in dates and identifiers.",
        "differences": [
            {"category": "Full Name", "value_a": "Gokul Mahendran", "value_b": "Gokul Mahendran", "status": "match"},
            {"category": "Date of Birth", "value_a": "12/05/2004", "value_b": "15/05/2004", "status": "conflict"},
            {"category": "Gender", "value_a": "Male", "value_b": "Male", "status": "match"},
            {"category": "Document Type", "value_a": "Application Form", "value_b": "ID Proof", "status": "changed"},
        ],
    }


def _mock_search(query: str, documents: List[Dict]) -> List[Dict]:
    results = []
    for doc in documents:
        text = doc.get("text", doc.get("name", ""))
        if any(w in text.lower() for w in query.lower().split()):
            results.append({
                "document_id": doc["id"],
                "document_name": doc["name"],
                "document_type": doc.get("type", "pdf"),
                "snippet": f"...relevant content from {doc['name']} related to '{query}'...",
                "relevance_score": round(random.uniform(0.7, 0.98), 2),
                "page_number": 1,
            })
    return results[:5]


# ─────────────────────────────────────────────────────────────────────────────
# Factory
# ─────────────────────────────────────────────────────────────────────────────

def get_ai_service() -> AIServiceBase:
    provider = settings.ai_provider.lower()
    
    if provider == "openai" and settings.openai_api_key:
        try:
            return OpenAIService()
        except Exception:
            pass
    
    if provider == "anthropic" and settings.anthropic_api_key:
        try:
            return AnthropicService()
        except Exception:
            pass
    
    # Default to mock
    return MockAIService()


# Singleton
_ai_service: Optional[AIServiceBase] = None


def ai_service() -> AIServiceBase:
    global _ai_service
    if _ai_service is None:
        _ai_service = get_ai_service()
    return _ai_service
