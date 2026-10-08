"""
Intelligent Insights Generator
Automatically detects missing information, conflicts, and generates smart actions.
"""
import re
from typing import List, Dict, Any, Tuple
from app.models.schemas import Insight, SmartAction, Issue, IssueType


class InsightsGenerator:
    """
    Analyzes all uploaded documents and generates insights:
    - Missing information detection
    - Conflict detection (dates, names, amounts)
    - Recommended actions
    """
    
    def generate_insights(self, documents: List[Dict[str, Any]]) -> List[Insight]:
        """Generate all insights from uploaded documents."""
        insights = []
        
        if not documents:
            return insights
        
        # 1. Detect conflicts across documents
        conflict_insights = self._detect_conflicts(documents)
        insights.extend(conflict_insights)
        
        # 2. Detect missing information
        missing_insights = self._detect_missing_info(documents)
        insights.extend(missing_insights)
        
        # 3. Check academic eligibility (if applicable)
        eligibility_insight = self._check_eligibility(documents)
        if eligibility_insight:
            insights.append(eligibility_insight)
        
        # 4. Check payment status
        payment_insight = self._check_payment_status(documents)
        if payment_insight:
            insights.append(payment_insight)
        
        # 5. Check upcoming deadlines
        deadline_insight = self._check_deadlines(documents)
        if deadline_insight:
            insights.append(deadline_insight)
        
        return insights
    
    def _detect_conflicts(self, documents: List[Dict]) -> List[Insight]:
        """Detect conflicts between documents."""
        insights = []
        
        # Check DOB conflicts
        dob_conflict = self._check_dob_conflict(documents)
        if dob_conflict:
            insights.append(dob_conflict)
        
        # Check name spelling conflicts
        name_conflict = self._check_name_conflicts(documents)
        if name_conflict:
            insights.append(name_conflict)
        
        return insights
    
    def _check_dob_conflict(self, documents: List[Dict]) -> Insight | None:
        """Check for Date of Birth conflicts."""
        dob_data = []
        
        for doc in documents:
            text = doc.get("text", "")
            doc_id = doc.get("id", "")
            doc_name = doc.get("name", "")
            
            # Extract DOB
            dob_pattern = r'(?:date of birth|dob|d\.o\.b)[:\s]*(\d{1,2}[/-]\d{1,2}[/-]\d{4})'
            matches = re.finditer(dob_pattern, text.lower(), re.IGNORECASE)
            
            for match in matches:
                dob = match.group(1)
                dob_data.append({
                    "doc_id": doc_id,
                    "doc_name": doc_name,
                    "dob": dob
                })
        
        # Check for conflicts
        if len(dob_data) >= 2:
            unique_dobs = set(item["dob"] for item in dob_data)
            if len(unique_dobs) > 1:
                # Conflict detected!
                doc_ids = [item["doc_id"] for item in dob_data]
                dob_list = [f"{item['doc_name']}: {item['dob']}" for item in dob_data]
                
                return Insight(
                    id=f"conflict-dob-{len(doc_ids)}",
                    type="warning",
                    title="⚠️ Date of Birth Conflict Detected",
                    description=f"Multiple different dates of birth found:\n" + "\n".join(f"- {item}" for item in dob_list),
                    priority="high",
                    related_documents=doc_ids,
                    actions=[
                        SmartAction(
                            id="act-dob-1",
                            label="Contact applicant for verification",
                            description="Request official birth certificate",
                            completed=False
                        ),
                        SmartAction(
                            id="act-dob-2",
                            label="Hold application processing",
                            description="Do not proceed until resolved",
                            completed=False
                        ),
                        SmartAction(
                            id="act-dob-3",
                            label="Update correct DOB in all systems",
                            description="After verification, update records",
                            completed=False
                        )
                    ]
                )
        
        return None
    
    def _check_name_conflicts(self, documents: List[Dict]) -> Insight | None:
        """Check for name spelling variations."""
        names = []
        
        for doc in documents:
            text = doc.get("text", "")
            name_pattern = r'(?:Name|Student|Applicant)[:\s]+([A-Z][a-z]+(?:\s+[A-Z][a-z]+)*)'
            matches = re.findall(name_pattern, text)
            
            for name in matches:
                names.append(name.strip())
        
        if len(set(names)) > 1 and len(names) >= 2:
            # Possible spelling variations
            return Insight(
                id="conflict-name-spelling",
                type="info",
                title="Name Variations Detected",
                description=f"Multiple name spellings found: {', '.join(set(names))}. Verify consistency.",
                priority="medium",
                related_documents=[d["id"] for d in documents],
                actions=[
                    SmartAction(
                        id="act-name-1",
                        label="Verify official name spelling",
                        description="Check against government ID",
                        completed=False
                    )
                ]
            )
        
        return None
    
    def _detect_missing_info(self, documents: List[Dict]) -> List[Insight]:
        """Detect missing required information."""
        insights = []
        
        # Check for common required documents
        doc_names = [d.get("name", "").lower() for d in documents]
        doc_types = {
            "application": any("application" in name or "form" in name for name in doc_names),
            "id_proof": any("aadhar" in name or "aadhaar" in name or "id" in name for name in doc_names),
            "marksheet": any("mark" in name or "grade" in name for name in doc_names),
            "certificate": any("certificate" in name for name in doc_names),
        }
        
        missing = []
        
        if doc_types["application"] and not doc_types["certificate"]:
            missing.append("Community/Caste Certificate")
        
        # Check for signatures in documents
        signature_found = any("signature" in d.get("text", "").lower() for d in documents)
        if not signature_found:
            missing.append("Signed documents")
        
        if missing:
            insights.append(Insight(
                id="missing-documents",
                type="warning",
                title="Missing Required Documents",
                description=f"The following items are required but not found: {', '.join(missing)}",
                priority="high",
                related_documents=[d["id"] for d in documents if doc_types.get("application")],
                actions=[
                    SmartAction(
                        id=f"act-missing-{i}",
                        label=f"Request {item}",
                        description=f"Contact applicant to submit {item}",
                        completed=False
                    ) for i, item in enumerate(missing)
                ]
            ))
        
        return insights
    
    def _check_eligibility(self, documents: List[Dict]) -> Insight | None:
        """Check academic eligibility if marksheet is present."""
        for doc in documents:
            text = doc.get("text", "")
            doc_name = doc.get("name", "").lower()
            
            if "mark" in doc_name or "grade" in doc_name:
                # Try to extract percentage
                percentage_match = re.search(r'(\d{2,3}\.\d{1,2})\s*%', text)
                
                if percentage_match:
                    percentage = float(percentage_match.group(1))
                    
                    if percentage >= 75:
                        return Insight(
                            id="eligible-academic",
                            type="success",
                            title="✅ Academic Eligibility Confirmed",
                            description=f"Marksheet shows {percentage}% which meets the minimum 75% requirement.",
                            priority="low",
                            related_documents=[doc["id"]],
                            actions=[]
                        )
                    else:
                        return Insight(
                            id="ineligible-academic",
                            type="error",
                            title="❌ Academic Eligibility Not Met",
                            description=f"Marksheet shows {percentage}% which is below the minimum 75% requirement.",
                            priority="high",
                            related_documents=[doc["id"]],
                            actions=[
                                SmartAction(
                                    id="act-reject",
                                    label="Inform applicant of ineligibility",
                                    description="Send rejection notice",
                                    completed=False
                                )
                            ]
                        )
        
        return None
    
    def _check_payment_status(self, documents: List[Dict]) -> Insight | None:
        """Check if fee payment is confirmed."""
        for doc in documents:
            text = doc.get("text", "")
            doc_name = doc.get("name", "").lower()
            
            if "fee" in doc_name or "receipt" in doc_name or "payment" in doc_name:
                # Extract amount
                amounts = re.findall(r'[₹Rs\.]\s*([\d,]+(?:\.\d{2})?)', text)
                
                if amounts:
                    return Insight(
                        id="payment-confirmed",
                        type="success",
                        title="✅ Fee Payment Confirmed",
                        description=f"Payment receipt found. Amount: {amounts[0] if amounts else 'see document'}",
                        priority="low",
                        related_documents=[doc["id"]],
                        actions=[]
                    )
        
        return None
    
    def _check_deadlines(self, documents: List[Dict]) -> Insight | None:
        """Check for upcoming deadlines."""
        from datetime import datetime, timedelta
        
        upcoming_deadlines = []
        
        for doc in documents:
            text = doc.get("text", "")
            
            # Look for deadline keywords
            deadline_pattern = r'(?:deadline|due|before|last date)[:\s]*(\d{1,2}[/-]\d{1,2}[/-]\d{4})'
            matches = re.finditer(deadline_pattern, text.lower(), re.IGNORECASE)
            
            for match in matches:
                deadline_str = match.group(1)
                upcoming_deadlines.append({
                    "date": deadline_str,
                    "doc_id": doc["id"]
                })
        
        if upcoming_deadlines:
            return Insight(
                id="upcoming-deadlines",
                type="action",
                title="📅 Upcoming Deadlines",
                description=f"Important dates found: {', '.join(d['date'] for d in upcoming_deadlines[:3])}",
                priority="medium",
                related_documents=[d["doc_id"] for d in upcoming_deadlines],
                actions=[
                    SmartAction(
                        id="act-deadline-reminder",
                        label="Set reminder notification",
                        description="Configure system reminder",
                        completed=False
                    ),
                    SmartAction(
                        id="act-deadline-notify",
                        label="Notify applicant",
                        description="Send deadline reminder",
                        completed=False
                    )
                ]
            )
        
        return None


# Singleton instance
_insights_generator = InsightsGenerator()


def get_insights_generator() -> InsightsGenerator:
    """Get the global insights generator instance."""
    return _insights_generator
