from fastapi import APIRouter
from typing import List
from app.models.schemas import Insight, SmartAction, DashboardStats
from app.services.document_store import document_store

router = APIRouter(prefix="/insights", tags=["insights"])

# Demo insights — in production these would be derived from AI analysis
DEMO_INSIGHTS = [
    Insight(
        id="ins-1",
        type="warning",
        title="Student Admission Status: Needs Verification",
        description="Gokul Mahendran's application cannot be processed until Date of Birth conflict is resolved and missing documents are submitted.",
        priority="high",
        related_documents=["doc-1", "doc-3"],
        actions=[
            SmartAction(id="act-1", label="Contact student about DOB discrepancy", description="Verify correct date of birth", completed=False),
            SmartAction(id="act-2", label="Request Community Certificate", description="Send official request", completed=False),
            SmartAction(id="act-3", label="Collect signed application form", description="Obtain signature", completed=False),
            SmartAction(id="act-4", label="Update records once verified", description="Correct DOB in system", completed=False),
        ],
    ),
    Insight(
        id="ins-2",
        type="success",
        title="Academic Eligibility Confirmed",
        description="Marksheet confirms 96.33% in Class 12, meeting the minimum 75% requirement for B.Tech CS.",
        priority="low",
        related_documents=["doc-2"],
        actions=[],
    ),
    Insight(
        id="ins-3",
        type="success",
        title="Fee Payment Verified",
        description="Application and first semester fee (₹75,500) confirmed.",
        priority="low",
        related_documents=["doc-4"],
        actions=[],
    ),
    Insight(
        id="ins-4",
        type="action",
        title="Upcoming Fee Deadline",
        description="Second semester fee payment (~₹75,500) is due on 15/01/2027.",
        priority="medium",
        related_documents=["doc-4"],
        actions=[
            SmartAction(id="act-5", label="Set payment reminder", description="Schedule reminder", completed=False),
            SmartAction(id="act-6", label="Send fee notice to student", description="Notify student", completed=False),
        ],
    ),
]


@router.get("", response_model=List[Insight])
async def get_insights():
    return DEMO_INSIGHTS


@router.get("/dashboard", response_model=DashboardStats)
async def get_dashboard_stats():
    all_docs = document_store.get_all()
    processed = [d for d in all_docs if d.status == "completed"]
    high_issues = sum(len([i for i in d.issues if i.severity == "high"]) for d in all_docs)

    total_actions = sum(len(ins.actions) for ins in DEMO_INSIGHTS)
    pending_actions = sum(
        len([a for a in ins.actions if not a.completed])
        for ins in DEMO_INSIGHTS
    )

    return DashboardStats(
        total_documents=len(all_docs),
        processed_documents=len(processed),
        important_issues=high_issues + 2,  # include demo issues
        pending_actions=pending_actions,
    )
