import type { Document, Issue, Insight, ChatMessage, SearchResult, ComparisonResult } from '../types'

export const mockDocuments: Document[] = [
  {
    id: 'doc-1',
    name: 'Student_Application_Gokul.pdf',
    type: 'pdf',
    size: 245760,
    pages: 4,
    uploadedAt: '2026-10-08T09:00:00Z',
    status: 'completed',
    summary: {
      shortSummary:
        'Student application form for Gokul Mahendran applying to B.Tech Computer Science Engineering. The form includes personal details, academic history, and contact information.',
      keyPoints: [
        'Applicant: Gokul Mahendran',
        'Program: B.Tech Computer Science Engineering',
        'Register Number: 22CS0456',
        'Date of Birth: 12/05/2004',
        'Application Date: 05/10/2026',
        'Contact: gokul.mahendran@email.com',
      ],
      importantDates: [
        { label: 'Application Date', value: '05/10/2026' },
        { label: 'Date of Birth', value: '12/05/2004' },
        { label: 'Submission Deadline', value: '15/10/2026' },
      ],
      names: ['Gokul Mahendran', 'Dr. Ramesh Kumar (Faculty Advisor)', 'Chennai Institute of Technology'],
      amounts: [
        { label: 'Application Fee', value: '₹500' },
      ],
      deadlines: ['15/10/2026 – Application submission deadline'],
      entities: ['Chennai Institute of Technology', 'Tamil Nadu State Board'],
      actionItems: [
        'Submit community certificate',
        'Verify date of birth across all documents',
        'Complete fee payment',
      ],
    },
    issues: [],
    missingFields: [
      { fieldName: 'Full Name', isPresent: true, importance: 'required' },
      { fieldName: 'Register Number', isPresent: true, importance: 'required' },
      { fieldName: 'Date of Birth', isPresent: true, importance: 'required' },
      { fieldName: 'Email Address', isPresent: true, importance: 'required' },
      { fieldName: 'Phone Number', isPresent: true, importance: 'required' },
      { fieldName: 'Community Certificate', isPresent: false, importance: 'required' },
      { fieldName: 'Signature', isPresent: false, importance: 'required' },
      { fieldName: 'Guardian Details', isPresent: true, importance: 'recommended' },
    ],
  },
  {
    id: 'doc-2',
    name: 'Marksheet_Class12_Gokul.pdf',
    type: 'pdf',
    size: 189440,
    pages: 2,
    uploadedAt: '2026-10-08T09:02:00Z',
    status: 'completed',
    summary: {
      shortSummary:
        'Class 12 marksheet for Gokul Mahendran issued by Tamil Nadu State Board of Higher Secondary Education. Shows academic performance in the 2022-2023 academic year.',
      keyPoints: [
        'Student: Gokul Mahendran',
        'Register Number: 22CS0456',
        'Board: Tamil Nadu State Board',
        'Year: 2022-2023',
        'Total Marks: 578/600',
        'Percentage: 96.33%',
        'Result: Pass with Distinction',
      ],
      importantDates: [
        { label: 'Exam Date', value: 'March 2023' },
        { label: 'Issue Date', value: '15/06/2023' },
      ],
      names: ['Gokul Mahendran', 'Tamil Nadu State Board'],
      amounts: [],
      deadlines: [],
      entities: ['Tamil Nadu State Board of Higher Secondary Education', 'Government Higher Secondary School'],
      actionItems: ['Verify percentage calculation', 'Check subject-wise marks for eligibility'],
    },
    issues: [],
    missingFields: [
      { fieldName: 'Student Name', isPresent: true, importance: 'required' },
      { fieldName: 'Register Number', isPresent: true, importance: 'required' },
      { fieldName: 'Subject Marks', isPresent: true, importance: 'required' },
      { fieldName: 'Date of Birth', isPresent: true, importance: 'required' },
      { fieldName: 'Issuing Authority Seal', isPresent: true, importance: 'required' },
    ],
  },
  {
    id: 'doc-3',
    name: 'Aadhaar_ID_Gokul.jpg',
    type: 'image',
    size: 512000,
    pages: 1,
    uploadedAt: '2026-10-08T09:04:00Z',
    status: 'completed',
    summary: {
      shortSummary:
        'Aadhaar Card (Government ID Proof) for Gokul Mahendran. Shows a different Date of Birth than the Student Application form – requires verification.',
      keyPoints: [
        'Name: Gokul Mahendran',
        'Date of Birth: 15/05/2004',
        'Aadhaar Number: XXXX-XXXX-5678',
        'Gender: Male',
        'Address: Chennai, Tamil Nadu',
        '⚠️ DOB differs from Application Form (12/05/2004 vs 15/05/2004)',
      ],
      importantDates: [
        { label: 'Date of Birth (on Aadhaar)', value: '15/05/2004' },
        { label: 'Issue Date', value: '2018' },
      ],
      names: ['Gokul Mahendran'],
      amounts: [],
      deadlines: [],
      entities: ['Unique Identification Authority of India (UIDAI)'],
      actionItems: ['Verify actual Date of Birth', 'Correct discrepancy in application form'],
    },
    issues: [],
    missingFields: [
      { fieldName: 'Name', isPresent: true, importance: 'required' },
      { fieldName: 'Date of Birth', isPresent: true, importance: 'required' },
      { fieldName: 'Aadhaar Number', isPresent: true, importance: 'required' },
      { fieldName: 'Address', isPresent: true, importance: 'required' },
    ],
  },
  {
    id: 'doc-4',
    name: 'Fee_Receipt_2026.pdf',
    type: 'pdf',
    size: 98304,
    pages: 1,
    uploadedAt: '2026-10-08T09:06:00Z',
    status: 'completed',
    summary: {
      shortSummary:
        'Fee payment receipt for Gokul Mahendran for the academic year 2026-2027. Confirms application fee and first semester tuition fee payment.',
      keyPoints: [
        'Receipt Number: FR-2026-00892',
        'Student: Gokul Mahendran',
        'Amount Paid: ₹75,500',
        'Payment Date: 07/10/2026',
        'Payment Mode: Online Transfer',
        'Status: Confirmed',
      ],
      importantDates: [
        { label: 'Payment Date', value: '07/10/2026' },
        { label: 'Due Date (Next Semester)', value: '15/01/2027' },
      ],
      names: ['Gokul Mahendran', 'Chennai Institute of Technology'],
      amounts: [
        { label: 'Application Fee', value: '₹500' },
        { label: 'Tuition Fee', value: '₹65,000' },
        { label: 'Lab Fee', value: '₹8,000' },
        { label: 'Library Fee', value: '₹2,000' },
        { label: 'Total', value: '₹75,500' },
      ],
      deadlines: ['15/01/2027 – Second semester fee payment'],
      entities: ['Chennai Institute of Technology', 'State Bank of India'],
      actionItems: ['Keep receipt for records', 'Note next semester payment date'],
    },
    issues: [],
    missingFields: [
      { fieldName: 'Receipt Number', isPresent: true, importance: 'required' },
      { fieldName: 'Student Name', isPresent: true, importance: 'required' },
      { fieldName: 'Amount', isPresent: true, importance: 'required' },
      { fieldName: 'Payment Date', isPresent: true, importance: 'required' },
      { fieldName: 'Authorized Signature', isPresent: true, importance: 'required' },
    ],
  },
]

export const mockIssues: Issue[] = [
  {
    id: 'issue-1',
    type: 'conflict',
    title: 'Date of Birth Conflict Detected',
    description:
      'Date of Birth differs between Student Application (12/05/2004) and Aadhaar ID (15/05/2004). This discrepancy must be resolved before admission.',
    severity: 'high',
    documentIds: ['doc-1', 'doc-3'],
  },
  {
    id: 'issue-2',
    type: 'missing',
    title: 'Community Certificate Missing',
    description:
      'The Community Certificate is required for reservation category verification but has not been uploaded.',
    severity: 'high',
    documentIds: ['doc-1'],
  },
  {
    id: 'issue-3',
    type: 'missing',
    title: 'Application Signature Missing',
    description: 'The student application form is missing the applicant signature, making it legally incomplete.',
    severity: 'high',
    documentIds: ['doc-1'],
  },
  {
    id: 'issue-4',
    type: 'warning',
    title: 'Submission Deadline Approaching',
    description: 'Application submission deadline is 15/10/2026. Only 7 days remaining to resolve all issues.',
    severity: 'medium',
    documentIds: ['doc-1'],
  },
]

export const mockInsights: Insight[] = [
  {
    id: 'ins-1',
    type: 'warning',
    title: 'Student Admission Status: Needs Verification',
    description:
      'Gokul Mahendran\'s application cannot be processed until Date of Birth conflict is resolved and missing documents are submitted.',
    priority: 'high',
    relatedDocuments: ['doc-1', 'doc-3'],
    actions: [
      { id: 'act-1', label: 'Contact student about DOB discrepancy', description: 'Email or call Gokul to verify correct date of birth', completed: false },
      { id: 'act-2', label: 'Request Community Certificate', description: 'Send official request for community certificate submission', completed: false },
      { id: 'act-3', label: 'Collect signed application form', description: 'Obtain student signature on application', completed: false },
      { id: 'act-4', label: 'Update records once verified', description: 'Correct DOB in system after verification', completed: false },
    ],
  },
  {
    id: 'ins-2',
    type: 'success',
    title: 'Academic Eligibility Confirmed',
    description: 'Marksheet confirms 96.33% in Class 12, meeting the minimum requirement of 75% for B.Tech CS.',
    priority: 'low',
    relatedDocuments: ['doc-2'],
    actions: [],
  },
  {
    id: 'ins-3',
    type: 'success',
    title: 'Fee Payment Verified',
    description: 'Application fee and first semester tuition fee (₹75,500) have been successfully paid and confirmed.',
    priority: 'low',
    relatedDocuments: ['doc-4'],
    actions: [],
  },
  {
    id: 'ins-4',
    type: 'action',
    title: 'Upcoming Fee Deadline',
    description: 'Second semester fee payment of approximately ₹75,500 is due on 15/01/2027.',
    priority: 'medium',
    relatedDocuments: ['doc-4'],
    actions: [
      { id: 'act-5', label: 'Set payment reminder', description: 'Schedule reminder for second semester fee', completed: false },
      { id: 'act-6', label: 'Send fee notice to student', description: 'Notify student about upcoming payment', completed: false },
    ],
  },
]

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    role: 'assistant',
    content:
      "Hello! I'm your InfoLens AI Assistant. I've analyzed 4 documents for Gokul Mahendran. I found 1 conflict (Date of Birth mismatch) and 2 missing items (Community Certificate, Signature). How can I help you today?",
    timestamp: new Date().toISOString(),
  },
]

export const mockSearchResults: SearchResult[] = [
  {
    documentId: 'doc-1',
    documentName: 'Student_Application_Gokul.pdf',
    documentType: 'pdf',
    snippet: '...application submitted by Gokul Mahendran for B.Tech Computer Science Engineering. Submission deadline: 15/10/2026...',
    relevanceScore: 0.97,
    pageNumber: 1,
  },
  {
    documentId: 'doc-2',
    documentName: 'Marksheet_Class12_Gokul.pdf',
    documentType: 'pdf',
    snippet: '...Gokul Mahendran has achieved 96.33% in Class 12 Board Examination 2022-2023...',
    relevanceScore: 0.89,
    pageNumber: 1,
  },
]

export const mockComparisonResult: ComparisonResult = {
  documentA: mockDocuments[0],
  documentB: mockDocuments[2],
  matchScore: 72,
  summary:
    'Comparing Student Application and Aadhaar ID Proof reveals a critical Date of Birth conflict. Name and other identifiers match.',
  differences: [
    { category: 'Full Name', valueA: 'Gokul Mahendran', valueB: 'Gokul Mahendran', status: 'match' },
    { category: 'Date of Birth', valueA: '12/05/2004', valueB: '15/05/2004', status: 'conflict' },
    { category: 'Gender', valueA: 'Male', valueB: 'Male', status: 'match' },
    { category: 'Address (City)', valueA: 'Chennai', valueB: 'Chennai', status: 'match' },
    { category: 'Register/ID Number', valueA: '22CS0456', valueB: 'XXXX-XXXX-5678', status: 'changed' },
    { category: 'Community Certificate', valueA: 'Not Available', valueB: 'N/A', status: 'removed' },
    { category: 'Photograph', valueA: 'Not Attached', valueB: 'Present', status: 'added' },
  ],
}

export const aiChatResponses: Record<string, string> = {
  deadline:
    'Based on the uploaded documents, I found **2 key deadlines**:\n\n1. **Application Submission Deadline**: 15/10/2026 (in 7 days) – from Student Application form\n2. **Second Semester Fee Payment**: 15/01/2027 – from Fee Receipt\n\n⚠️ The application cannot be submitted until the DOB conflict is resolved and the Community Certificate is uploaded.',
  amount:
    'Here are all financial amounts found across your documents:\n\n**From Fee Receipt (FR-2026-00892):**\n- Application Fee: ₹500\n- Tuition Fee: ₹65,000\n- Lab Fee: ₹8,000\n- Library Fee: ₹2,000\n- **Total Paid: ₹75,500**\n\n**Status**: Payment confirmed via Online Transfer on 07/10/2026.',
  responsible:
    'Based on the documents analyzed:\n\n- **Student**: Gokul Mahendran (responsible for resolving DOB conflict and submitting Community Certificate)\n- **Faculty Advisor**: Dr. Ramesh Kumar (application review)\n- **Administration**: Chennai Institute of Technology (document verification and admission processing)\n\nThe student must act immediately given the 15/10/2026 deadline.',
  missing:
    '**Missing Information Detected:**\n\n🔴 **Critical (Required)**:\n1. **Community Certificate** – Not uploaded\n2. **Application Signature** – Missing from Student Application\n\n⚠️ **Conflict (Needs Resolution)**:\n3. **Date of Birth** – Mismatch: Application says 12/05/2004, Aadhaar says 15/05/2004\n\n✅ **Present**: Name, Register Number, Marksheet, Fee Receipt, ID Proof',
  dob:
    '⚠️ **Date of Birth Conflict Detected!**\n\n| Document | Date of Birth |\n|----------|--------------|\n| Student Application | 12/05/2004 |\n| Aadhaar ID Card | 15/05/2004 |\n\nThe 3-day difference needs immediate resolution. The student should verify the correct date and provide a sworn affidavit or correction certificate.',
  default:
    'I\'ve analyzed all 4 documents for Gokul Mahendran. Here\'s a quick summary:\n\n✅ **Verified**: Name, Register Number, Marksheet (96.33%), Fee Payment (₹75,500)\n\n⚠️ **Issues Found**:\n1. Date of Birth conflict between Application and Aadhaar\n2. Community Certificate not uploaded\n3. Application signature missing\n\n**Overall Status**: Application cannot be processed until conflicts are resolved. Deadline: 15/10/2026.',
}
