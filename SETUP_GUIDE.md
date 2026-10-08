# InfoLens Setup & Demo Guide

## ✅ Prerequisites Installation

### 1. Install Node.js
- Download from: https://nodejs.org/ (LTS version recommended)
- Choose the **Windows Installer (.msi)**
- Run the installer with default options
- Verify: Open PowerShell and run `node --version`

### 2. Install Python
- Download from: https://www.python.org/downloads/ (Python 3.11+)
- **⚠️ IMPORTANT**: Check "Add Python to PATH" during installation
- Run the installer with default options
- Verify: Open PowerShell and run `python --version`

---

## 🚀 First Time Setup

### Step 1: Install Frontend Dependencies

```powershell
cd "C:\Users\gokul\OneDrive\Desktop\Intelligent Information Understanding & Processing\infolens\frontend"
npm install
```

This will take 2-3 minutes. You should see:
```
added 367 packages
```

### Step 2: Install Backend Dependencies

```powershell
cd "C:\Users\gokul\OneDrive\Desktop\Intelligent Information Understanding & Processing\infolens\backend"
pip install -r requirements.txt
```

This will take 3-5 minutes. You should see packages being installed.

**Optional**: If you want to enable PDF extraction and OCR:
```powershell
pip install PyPDF2 python-docx Pillow pytesseract
```

---

## 🎬 Running the Application

### Option A: Double-Click Scripts (Easiest)

1. **Start Backend**: Double-click `start-backend.bat`
   - Wait for: `Uvicorn running on http://0.0.0.0:8000`
   - Keep this window open

2. **Start Frontend**: Double-click `start-frontend.bat`
   - Wait for: `Local: http://localhost:5173`
   - Browser will open automatically

### Option B: Manual Start (for troubleshooting)

**Terminal 1 - Backend:**
```powershell
cd "C:\Users\gokul\OneDrive\Desktop\Intelligent Information Understanding & Processing\infolens\backend"
python run.py
```

**Terminal 2 - Frontend:**
```powershell
cd "C:\Users\gokul\OneDrive\Desktop\Intelligent Information Understanding & Processing\infolens\frontend"
npm run dev
```

---

## 🎯 Demo Walkthrough (for Hackathon Presentation)

### Introduction (30 seconds)
> "InfoLens is an AI-powered document intelligence platform that helps organizations handle large volumes of documents efficiently. Let me show you our college administration use case."

### Demo Flow (5 minutes)

#### 1. Dashboard Overview (30 sec)
- Point out: 4 documents uploaded, 2 important issues detected
- Show the **Demo Case Banner**: Gokul Mahendran's application
- **Narration**: "We've processed 4 documents for a student application. The AI has already flagged 2 critical issues."

#### 2. Document Analysis (1 min)
- Click **"Documents"** in sidebar
- Click on **"Student_Application_Gokul.pdf"**
- Show:
  - AI Summary
  - Key Points extracted
  - Important dates automatically detected
  - Missing fields highlighted
- **Narration**: "Our AI extracts structured information from unstructured documents. Notice it identified the application deadline and flagged 2 missing required fields."

#### 3. Conflict Detection (45 sec)
- Navigate back to Dashboard
- Click on **"Important Issues"** section
- Show the **Date of Birth Conflict**:
  - Application says: 12/05/2004
  - Aadhaar says: 15/05/2004
- **Narration**: "The system detected a date of birth discrepancy across documents — something that would take hours to find manually across hundreds of applications."

#### 4. AI Chat Assistant (1.5 min)
- Click **"AI Assistant"** in sidebar
- Try these queries:
  1. Type: `"What is the deadline?"`
     - **Show**: AI returns 15/10/2026 with context
  2. Type: `"What information is missing?"`
     - **Show**: AI lists Community Certificate and Signature
  3. Type: `"Is the student eligible for admission?"`
     - **Show**: AI provides eligibility analysis
- **Narration**: "Staff can ask questions in natural language instead of manually reviewing each document."

#### 5. Document Comparison (1 min)
- Click **"Compare"** in sidebar
- Select **"Student_Application_Gokul.pdf"** as Document A
- Select **"Aadhaar_ID_Gokul.jpg"** as Document B
- Click **"Compare Documents"**
- Show the comparison table:
  - Name: ✅ Match
  - DOB: ⚠️ Conflict
  - Match Score: 72%
- **Narration**: "AI-powered comparison highlights exactly what's different, making verification instant."

#### 6. Smart Actions (30 sec)
- Click **"Insights"** in sidebar
- Show the **"Recommended Actions"** section
- Point out the checklist:
  - Contact student about DOB
  - Request Community Certificate
  - Collect signature
- **Narration**: "The system doesn't just identify problems — it recommends specific actions to resolve them."

### Closing (20 seconds)
> "InfoLens reduces document processing time from hours to minutes, eliminates human error, and ensures compliance. Perfect for college admissions, HR onboarding, bank KYC, or any document-heavy workflow."

---

## 🎤 Key Talking Points

### Problem Statement
- Organizations process hundreds of documents daily
- Manual verification is slow and error-prone
- Important information is often missed or conflicts ignored

### Solution Highlights
- **AI Summarization**: Extracts key information automatically
- **Conflict Detection**: Finds discrepancies across documents
- **Natural Language Q&A**: Staff can ask questions instead of searching
- **Smart Actions**: AI recommends next steps
- **Document Comparison**: Side-by-side verification

### Technical Highlights
- **Modern Stack**: React + TypeScript + FastAPI
- **AI Abstraction**: Supports OpenAI, Anthropic, or mock mode (no API needed for demos)
- **Production-Ready Architecture**: Modular design, type-safe, documented
- **Extensible**: Easily add more document types or AI features

---

## 🐛 Troubleshooting

### Frontend won't start
```powershell
cd frontend
rm -r -fo node_modules
rm package-lock.json
npm install
npm run dev
```

### Backend won't start
```powershell
cd backend
pip install --upgrade pip
pip install -r requirements.txt
python run.py
```

### Port already in use
- Frontend (5173): Kill any Vite processes
- Backend (8000): Kill any Python/uvicorn processes
```powershell
# Check what's using port 8000
netstat -ano | findstr :8000
# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

### AI responses not working
- The app uses **Mock AI by default** — no API key needed
- To use real AI:
  1. Copy `backend/.env.example` to `backend/.env`
  2. Set `AI_PROVIDER=openai` or `AI_PROVIDER=anthropic`
  3. Add your API key
  4. Restart backend

---

## 📦 What's Included

✅ Fully functional frontend (React + TypeScript)  
✅ REST API backend (FastAPI)  
✅ 4 pre-loaded demo documents  
✅ Mock AI service (works without API keys)  
✅ Document upload & processing  
✅ AI summarization  
✅ Chat assistant  
✅ Document comparison  
✅ Conflict & missing info detection  
✅ Smart actions & insights  
✅ Semantic search  
✅ Responsive UI (mobile-friendly)  

---

## 🎓 For Judges

The application demonstrates:
- **Full-stack development** with modern technologies
- **AI integration** with proper abstraction
- **Real-world problem** solving (document processing automation)
- **Production-ready code** structure
- **Attention to UX** with polished interface
- **Extensibility** for additional features

The college administration use case is just one example — this architecture works for:
- HR onboarding
- Bank KYC processing
- Legal document review
- Healthcare records management
- Any document-heavy workflow

---

**Built by Gokul Mahendran for Intelligent Information Understanding & Processing Project**

*Ready for hackathon demo in under 10 minutes!*
