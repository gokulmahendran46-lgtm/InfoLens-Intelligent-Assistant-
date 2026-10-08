"""
InfoLens Backend - Demo Scenario Data
College Administration: Gokul Mahendran's B.Tech CSE Application
"""
from models import (
    Document, DocumentSummary, DateEntry, AmountEntry,
    MissingField, Issue, Insight, SmartAction,
    DocumentStatus, DocumentType, ComparisonResult, ComparisonDifference,
    SearchResult,
)
from datetime import datetime


# ══════════════════════════════════════════════════════════════
# DOCUMENTS
# ══════════════════════════════════════════════════════════════

DEMO_DOCUMENTS: list[Document] = [
    Document(
        id="doc-1",
        name="Student_Application_Gokul.pdf",
        type=DocumentType.pdf,
        size=245760,
        pages=4,
        uploadedAt="2026-10-08T09:00:00Z",
        status=DocumentStatus.completed,
        extractedText=(
            "Student Application Form\n"
            "Chennai Institute of Technology\n\n"
            "Applicant Name: Gokul Mahendran\n"
            "Program: B.Tech Computer Science Engineering\n"
            "Register Number: 22CS0456\n"
            "Date of Birth: 12/05/2004\n"
            "Gender: Male\n"
            "Address: 14, Gandhi Nagar, Chennai, Tamil Nadu 600028\n"
            "Contact Email: gokul.mahendran@email.com\n"
            "Phone: +91 98765 43210\n"
            "Guardian: Mr. Mahendran K (Father)\n"
            "Faculty Advisor: Dr. Ramesh Kumar\n\n"
            "Application Date: 05/10/2026\n"
            "Submission Deadline: 15/10/2026\n"
            "Application Fee: ₹500\n"
        ),
        summary=DocumentSummary(
            shortSummary="Student application form for Gokul Mahendran applying to B.Tech Computer Science Engineering. The form includes personal details, academic history, and contact information.",
            keyPoints=[
                "Applicant: Gokul Mahendran",
                "Program: B.Tech Computer Science Engineering",
                "Register Number: 22CS0456",
                "Date of Birth: 12/05/2004",
                "Application Date: 05/10/2026",
                "Contact: gokul.mahendran@email.com",
            ],
            importantDates=[
                DateEntry(label="Application Date", value="05/10/2026"),
                DateEntry(label="Date of Birth", value="12/05/2004"),
                DateEntry(label="Submission Deadline", value="15/10/2026"),
            ],
            names=["Gokul Mahendran", "Dr. Ramesh Kumar (Faculty Advisor)", "Chennai Institute of Technology"],
            amounts=[AmountEntry(label="Application Fee", value="₹500")],
            deadlines=["15/10/2026 – Application submission deadline"],
            entities=["Chennai Institute of Technology", "Tamil Nadu State Board"],
            actionItems=[
                "Submit community certificate",
                "Verify date of birth across all documents",
                "Complete fee payment",
            ],
        ),
        issues=[],
        missingFields=[
            MissingField(fieldName="Full Name", isPresent=True, importance="required"),
            MissingField(fieldName="Register Number", isPresent=True, importance="required"),
            MissingField(fieldName="Date of Birth", isPresent=True, importance="required"),
            MissingField(fieldName="Email Address", isPresent=True, importance="required"),
            MissingField(fieldName="Phone Number", isPresent=True, importance="required"),
            MissingField(fieldName="Community Certificate", isPresent=False, importance="required"),
            MissingField(fieldName="Signature", isPresent=False, importance="required"),
            MissingField(fieldName="Guardian Details", isPresent=True, importance="recommended"),
        ],
    ),
    Document(
        id="doc-2",
        name="Marksheet_Class12_Gokul.pdf",
        type=DocumentType.pdf,
        size=189440,
        pages=2,
        uploadedAt="2026-10-08T09:02:00Z",
        status=DocumentStatus.completed,
        extractedText=(
            "Tamil Nadu State Board of Higher Secondary Education\n"
            "Class XII Marksheet – 2022-2023\n\n"
            "Student Name: Gokul Mahendran\n"
            "Register Number: 22CS0456\n"
            "School: Government Higher Secondary School\n"
            "Date of Birth: 12/05/2004\n\n"
            "Tamil: 95\n"
            "English: 98\n"
            "Mathematics: 100\n"
            "Physics: 96\n"
            "Chemistry: 94\n"
            "Computer Science: 95\n"
            "Total: 578/600\n"
            "Percentage: 96.33%\n"
            "Result: Pass with Distinction\n\n"
            "Exam Date: March 2023\n"
            "Issue Date: 15/06/2023\n"
        ),
        summary=DocumentSummary(
            shortSummary="Class 12 marksheet for Gokul Mahendran issued by Tamil Nadu State Board of Higher Secondary Education. Shows academic performance in the 2022-2023 academic year.",
            keyPoints=[
                "Student: Gokul Mahendran",
                "Register Number: 22CS0456",
                "Board: Tamil Nadu State Board",
                "Year: 2022-2023",
                "Total Marks: 578/600",
                "Percentage: 96.33%",
                "Result: Pass with Distinction",
            ],
            importantDates=[
                DateEntry(label="Exam Date", value="March 2023"),
                DateEntry(label="Issue Date", value="15/06/2023"),
            ],
            names=["Gokul Mahendran", "Tamil Nadu State Board"],
            amounts=[],
            deadlines=[],
            entities=["Tamil Nadu State Board of Higher Secondary Education", "Government Higher Secondary School"],
            actionItems=["Verify percentage calculation", "Check subject-wise marks for eligibility"],
        ),
        issues=[],
        missingFields=[
            MissingField(fieldName="Student Name", isPresent=True, importance="required"),
            MissingField(fieldName="Register Number", isPresent=True, importance="required"),
            MissingField(fieldName="Subject Marks", isPresent=True, importance="required"),
            MissingField(fieldName="Date of Birth", isPresent=True, importance="required"),
            MissingField(fieldName="Issuing Authority Seal", isPresent=True, importance="required"),
        ],
    ),
    Document(
        id="doc-3",
        name="Aadhaar_ID_Gokul.jpg",
        type=DocumentType.image,
        size=512000,
        pages=1,
        uploadedAt="2026-10-08T09:04:00Z",
        status=DocumentStatus.completed,
        extractedText=(
            "Government of India\n"
            "Unique Identification Authority of India (UIDAI)\n"
            "AADHAAR\n\n"
            "Name: Gokul Mahendran\n"
            "Date of Birth: 15/05/2004\n"
            "Gender: Male\n"
            "Address: 14, Gandhi Nagar, Chennai, Tamil Nadu 600028\n"
            "Aadhaar Number: XXXX-XXXX-5678\n"
            "Issue Year: 2018\n"
        ),
        summary=DocumentSummary(
            shortSummary="Aadhaar Card (Government ID Proof) for Gokul Mahendran. Shows a different Date of Birth than the Student Application form – requires verification.",
            keyPoints=[
                "Name: Gokul Mahendran",
                "Date of Birth: 15/05/2004",
                "Aadhaar Number: XXXX-XXXX-5678",
                "Gender: Male",
                "Address: Chennai, Tamil Nadu",
                "⚠️ DOB differs from Application Form (12/05/2004 vs 15/05/2004)",
            ],
            importantDates=[
                DateEntry(label="Date of Birth (on Aadhaar)", value="15/05/2004"),
                DateEntry(label="Issue Date", value="2018"),
            ],
            names=["Gokul Mahendran"],
            amounts=[],
            deadlines=[],
            entities=["Unique Identification Authority of India (UIDAI)"],
            actionItems=["Verify actual Date of Birth", "Correct discrepancy in application form"],
        ),
        issues=[],
        missingFields=[
            MissingField(fieldName="Name", isPresent=True, importance="required"),
            MissingField(fieldName="Date of Birth", isPresent=True, importance="required"),
            MissingField(fieldName="Aadhaar Number", isPresent=True, importance="required"),
            MissingField(fieldName="Address", isPresent=True, importance="required"),
        ],
    ),
    Document(
        id="doc-4",
        name="Fee_Receipt_2026.pdf",
        type=DocumentType.pdf,
        size=98304,
        pages=1,
        uploadedAt="2026-10-08T09:06:00Z",
        status=DocumentStatus.completed,
        extractedText=(
            "Chennai Institute of Technology\n"
            "Fee Payment Receipt\n\n"
            "Receipt Number: FR-2026-00892\n"
            "Student Name: Gokul Mahendran\n"
            "Register Number: 22CS0456\n"
            "Program: B.Tech CSE\n\n"
            "Application Fee: ₹500\n"
            "Tuition Fee: ₹65,000\n"
            "Lab Fee: ₹8,000\n"
            "Library Fee: ₹2,000\n"
            "Total Amount: ₹75,500\n\n"
            "Payment Date: 07/10/2026\n"
            "Payment Mode: Online Transfer\n"
            "Bank: State Bank of India\n"
            "Status: Confirmed\n\n"
            "Next Due Date: 15/01/2027 (Second Semester)\n"
        ),
        summary=DocumentSummary(
            shortSummary="Fee payment receipt for Gokul Mahendran for the academic year 2026-2027. Confirms application fee and first semester tuition fee payment.",
            keyPoints=[
                "Receipt Number: FR-2026-00892",
                "Student: Gokul Mahendran",
                "Amount Paid: ₹75,500",
                "Payment Date: 07/10/2026",
                "Payment Mode: Online Transfer",
                "Status: Confirmed",
            ],
            importantDates=[
                DateEntry(label="Payment Date", value="07/10/2026"),
                DateEntry(label="Due Date (Next Semester)", value="15/01/2027"),
            ],
            names=["Gokul Mahendran", "Chennai Institute of Technology"],
            amounts=[
                AmountEntry(label="Application Fee", value="₹500"),
                AmountEntry(label="Tuition Fee", value="₹65,000"),
                AmountEntry(label="Lab Fee", value="₹8,000"),
                AmountEntry(label="Library Fee", value="₹2,000"),
                AmountEntry(label="Total", value="₹75,500"),
            ],
            deadlines=["15/01/2027 – Second semester fee payment"],
            entities=["Chennai Institute of Technology", "State Bank of India"],
            actionItems=["Keep receipt for records", "Note next semester payment date"],
        ),
        issues=[],
        missingFields=[
            MissingField(fieldName="Receipt Number", isPresent=True, importance="required"),
            MissingField(fieldName="Student Name", isPresent=True, importance="required"),
            MissingField(fieldName="Amount", isPresent=True, importance="required"),
            MissingField(fieldName="Payment Date", isPresent=True, importance="required"),
            MissingField(fieldName="Authorized Signature", isPresent=True, importance="required"),
        ],
    ),
]


# ══════════════════════════════════════════════════════════════
# ISSUES
# ══════════════════════════════════════════════════════════════

DEMO_ISSUES: list[Issue] = [
    Issue(
        id="issue-1",
        type="conflict",
        title="Date of Birth Conflict Detected",
        description="Date of Birth differs between Student Application (12/05/2004) and Aadhaar ID (15/05/2004). This discrepancy must be resolved before admission.",
        severity="high",
        documentIds=["doc-1", "doc-3"],
    ),
    Issue(
        id="issue-2",
        type="missing",
        title="Community Certificate Missing",
        description="The Community Certificate is required for reservation category verification but has not been uploaded.",
        severity="high",
        documentIds=["doc-1"],
    ),
    Issue(
        id="issue-3",
        type="missing",
        title="Application Signature Missing",
        description="The student application form is missing the applicant signature, making it legally incomplete.",
        severity="high",
        documentIds=["doc-1"],
    ),
    Issue(
        id="issue-4",
        type="warning",
        title="Submission Deadline Approaching",
        description="Application submission deadline is 15/10/2026. Only 7 days remaining to resolve all issues.",
        severity="medium",
        documentIds=["doc-1"],
    ),
]


# ══════════════════════════════════════════════════════════════
# INSIGHTS
# ══════════════════════════════════════════════════════════════

DEMO_INSIGHTS: list[Insight] = [
    Insight(
        id="ins-1",
        type="warning",
        title="Student Admission Status: Needs Verification",
        description="Gokul Mahendran's application cannot be processed until Date of Birth conflict is resolved and missing documents are submitted.",
        priority="high",
        relatedDocuments=["doc-1", "doc-3"],
        actions=[
            SmartAction(id="act-1", label="Contact student about DOB discrepancy", description="Email or call Gokul to verify correct date of birth", completed=False),
            SmartAction(id="act-2", label="Request Community Certificate", description="Send official request for community certificate submission", completed=False),
            SmartAction(id="act-3", label="Collect signed application form", description="Obtain student signature on application", completed=False),
            SmartAction(id="act-4", label="Update records once verified", description="Correct DOB in system after verification", completed=False),
        ],
    ),
    Insight(
        id="ins-2",
        type="success",
        title="Academic Eligibility Confirmed",
        description="Marksheet confirms 96.33% in Class 12, meeting the minimum requirement of 75% for B.Tech CS.",
        priority="low",
        relatedDocuments=["doc-2"],
        actions=[],
    ),
    Insight(
        id="ins-3",
        type="success",
        title="Fee Payment Verified",
        description="Application fee and first semester tuition fee (₹75,500) have been successfully paid and confirmed.",
        priority="low",
        relatedDocuments=["doc-4"],
        actions=[],
    ),
    Insight(
        id="ins-4",
        type="action",
        title="Upcoming Fee Deadline",
        description="Second semester fee payment of approximately ₹75,500 is due on 15/01/2027.",
        priority="medium",
        relatedDocuments=["doc-4"],
        actions=[
            SmartAction(id="act-5", label="Set payment reminder", description="Schedule reminder for second semester fee", completed=False),
            SmartAction(id="act-6", label="Send fee notice to student", description="Notify student about upcoming payment", completed=False),
        ],
    ),
]


# ══════════════════════════════════════════════════════════════
# COMPARISON
# ══════════════════════════════════════════════════════════════

DEMO_COMPARISON = ComparisonResult(
    documentA=DEMO_DOCUMENTS[0],
    documentB=DEMO_DOCUMENTS[2],
    matchScore=72,
    summary="Comparing Student Application and Aadhaar ID Proof reveals a critical Date of Birth conflict. Name and other identifiers match.",
    differences=[
        ComparisonDifference(category="Full Name", valueA="Gokul Mahendran", valueB="Gokul Mahendran", status="match"),
        ComparisonDifference(category="Date of Birth", valueA="12/05/2004", valueB="15/05/2004", status="conflict"),
        ComparisonDifference(category="Gender", valueA="Male", valueB="Male", status="match"),
        ComparisonDifference(category="Address (City)", valueA="Chennai", valueB="Chennai", status="match"),
        ComparisonDifference(category="Register/ID Number", valueA="22CS0456", valueB="XXXX-XXXX-5678", status="changed"),
        ComparisonDifference(category="Community Certificate", valueA="Not Available", valueB="N/A", status="removed"),
        ComparisonDifference(category="Photograph", valueA="Not Attached", valueB="Present", status="added"),
    ],
)


# ══════════════════════════════════════════════════════════════
# CHAT RESPONSES
# ══════════════════════════════════════════════════════════════

CHAT_KEYWORD_RESPONSES: dict[str, dict] = {
    "deadline": {
        "response": (
            "Based on the uploaded documents, I found **2 key deadlines**:\n\n"
            "1. **Application Submission Deadline**: 15/10/2026 (in 7 days) – from Student Application form\n"
            "2. **Second Semester Fee Payment**: 15/01/2027 – from Fee Receipt\n\n"
            "⚠️ The application cannot be submitted until the DOB conflict is resolved and the Community Certificate is uploaded."
        ),
        "sources": [
            {"id": "doc-1", "name": "Student_Application_Gokul.pdf", "excerpt": "Submission Deadline: 15/10/2026"},
            {"id": "doc-4", "name": "Fee_Receipt_2026.pdf", "excerpt": "Next Due Date: 15/01/2027"},
        ],
    },
    "amount": {
        "response": (
            "Here are all financial amounts found across your documents:\n\n"
            "**From Fee Receipt (FR-2026-00892):**\n"
            "- Application Fee: ₹500\n"
            "- Tuition Fee: ₹65,000\n"
            "- Lab Fee: ₹8,000\n"
            "- Library Fee: ₹2,000\n"
            "- **Total Paid: ₹75,500**\n\n"
            "**Status**: Payment confirmed via Online Transfer on 07/10/2026."
        ),
        "sources": [
            {"id": "doc-4", "name": "Fee_Receipt_2026.pdf", "excerpt": "Total Amount: ₹75,500 – Payment confirmed"},
        ],
    },
    "responsible": {
        "response": (
            "Based on the documents analyzed:\n\n"
            "- **Student**: Gokul Mahendran (responsible for resolving DOB conflict and submitting Community Certificate)\n"
            "- **Faculty Advisor**: Dr. Ramesh Kumar (application review)\n"
            "- **Administration**: Chennai Institute of Technology (document verification and admission processing)\n\n"
            "The student must act immediately given the 15/10/2026 deadline."
        ),
        "sources": [
            {"id": "doc-1", "name": "Student_Application_Gokul.pdf", "excerpt": "Faculty Advisor: Dr. Ramesh Kumar"},
        ],
    },
    "missing": {
        "response": (
            "**Missing Information Detected:**\n\n"
            "🔴 **Critical (Required):**\n"
            "1. **Community Certificate** – Not uploaded\n"
            "2. **Application Signature** – Missing from Student Application\n\n"
            "⚠️ **Conflict (Needs Resolution):**\n"
            "3. **Date of Birth** – Mismatch: Application says 12/05/2004, Aadhaar says 15/05/2004\n\n"
            "✅ **Present**: Name, Register Number, Marksheet, Fee Receipt, ID Proof"
        ),
        "sources": [
            {"id": "doc-1", "name": "Student_Application_Gokul.pdf", "excerpt": "Community Certificate: NOT FOUND, Signature: NOT FOUND"},
            {"id": "doc-3", "name": "Aadhaar_ID_Gokul.jpg", "excerpt": "DOB discrepancy detected"},
        ],
    },
    "dob": {
        "response": (
            "⚠️ **Date of Birth Conflict Detected!**\n\n"
            "| Document | Date of Birth |\n"
            "|----------|---------------|\n"
            "| Student Application | 12/05/2004 |\n"
            "| Aadhaar ID Card | 15/05/2004 |\n\n"
            "The 3-day difference needs immediate resolution. The student should verify the correct date and provide a sworn affidavit or correction certificate."
        ),
        "sources": [
            {"id": "doc-1", "name": "Student_Application_Gokul.pdf", "excerpt": "Date of Birth: 12/05/2004"},
            {"id": "doc-3", "name": "Aadhaar_ID_Gokul.jpg", "excerpt": "Date of Birth: 15/05/2004"},
        ],
    },
    "eligible": {
        "response": (
            "**Eligibility Assessment for Gokul Mahendran – B.Tech CSE:**\n\n"
            "✅ **Academic**: 96.33% in Class 12 – exceeds minimum 75% cutoff\n"
            "✅ **Fee Payment**: ₹75,500 paid and confirmed\n"
            "✅ **ID Proof**: Aadhaar card uploaded\n\n"
            "❌ **Pending Issues:**\n"
            "1. Date of Birth conflict must be resolved\n"
            "2. Community Certificate must be uploaded\n"
            "3. Application signature missing\n\n"
            "**Verdict**: Conditionally eligible – admission cannot be confirmed until all issues are resolved before 15/10/2026."
        ),
        "sources": [
            {"id": "doc-2", "name": "Marksheet_Class12_Gokul.pdf", "excerpt": "Percentage: 96.33% – Pass with Distinction"},
        ],
    },
    "marks": {
        "response": (
            "**Gokul Mahendran – Class 12 Board Results:**\n\n"
            "| Subject | Marks |\n"
            "|---------|-------|\n"
            "| Tamil | 95 |\n"
            "| English | 98 |\n"
            "| Mathematics | 100 |\n"
            "| Physics | 96 |\n"
            "| Chemistry | 94 |\n"
            "| Computer Science | 95 |\n\n"
            "**Total: 578/600 (96.33%)**\n"
            "Result: Pass with Distinction 🏆"
        ),
        "sources": [
            {"id": "doc-2", "name": "Marksheet_Class12_Gokul.pdf", "excerpt": "Total: 578/600, Percentage: 96.33%"},
        ],
    },
    "fee": {
        "response": (
            "**Fee Payment Summary for Gokul Mahendran:**\n\n"
            "Receipt Number: FR-2026-00892\n\n"
            "| Component | Amount |\n"
            "|-----------|--------|\n"
            "| Application Fee | ₹500 |\n"
            "| Tuition Fee | ₹65,000 |\n"
            "| Lab Fee | ₹8,000 |\n"
            "| Library Fee | ₹2,000 |\n"
            "| **Total** | **₹75,500** |\n\n"
            "✅ Payment confirmed via Online Transfer on 07/10/2026 through State Bank of India.\n\n"
            "📅 **Next Payment**: ~₹75,500 due on 15/01/2027 (Second Semester)"
        ),
        "sources": [
            {"id": "doc-4", "name": "Fee_Receipt_2026.pdf", "excerpt": "Total: ₹75,500 – Status: Confirmed"},
        ],
    },
}

DEFAULT_CHAT_RESPONSE = {
    "response": (
        "I've analyzed all 4 documents for Gokul Mahendran. Here's a quick summary:\n\n"
        "✅ **Verified**: Name, Register Number, Marksheet (96.33%), Fee Payment (₹75,500)\n\n"
        "⚠️ **Issues Found**:\n"
        "1. Date of Birth conflict between Application and Aadhaar\n"
        "2. Community Certificate not uploaded\n"
        "3. Application signature missing\n\n"
        "**Overall Status**: Application cannot be processed until conflicts are resolved. Deadline: 15/10/2026.\n\n"
        "You can ask me specific questions like:\n"
        "- \"What is the deadline?\"\n"
        "- \"What is the total fee amount?\"\n"
        "- \"What information is missing?\"\n"
        "- \"Is the student eligible?\""
    ),
    "sources": [
        {"id": "doc-1", "name": "Student_Application_Gokul.pdf", "excerpt": "Application overview"},
        {"id": "doc-2", "name": "Marksheet_Class12_Gokul.pdf", "excerpt": "Academic record"},
        {"id": "doc-3", "name": "Aadhaar_ID_Gokul.jpg", "excerpt": "ID verification"},
        {"id": "doc-4", "name": "Fee_Receipt_2026.pdf", "excerpt": "Payment record"},
    ],
}
