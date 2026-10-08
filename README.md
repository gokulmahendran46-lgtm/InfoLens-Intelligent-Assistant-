# InfoLens – Intelligent Information Assistant

> AI-powered document analysis, summarization, comparison, and insights platform

Built for the **Hackathon Demo** featuring a College Administration use case:
*Gokul Mahendran's B.Tech CSE admission application analysis*

---

## Features

| Feature | Description |
|---|---|
| **Dashboard** | Stats overview, recent docs, issues, and actions |
| **Document Upload** | PDF, DOCX, TXT, Images with drag-and-drop |
| **AI Summary** | Key points, dates, names, amounts, deadlines |
| **AI Chat** | Ask natural language questions about your documents |
| **Comparison** | Side-by-side diff with conflict highlighting |
| **Missing Info Detection** | Field-by-field completeness check |
| **Conflict Detection** | Cross-document discrepancy alerts |
| **Smart Actions** | AI-generated recommended next steps |
| **Search** | Semantic search across all documents |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript + Vite + Tailwind CSS |
| Backend | Python FastAPI + Uvicorn |
| AI | OpenAI GPT-4o / Anthropic Claude / Mock (demo) |
| Document Processing | PyPDF2, python-docx, pytesseract |
| State Management | Zustand |
| Charts | Recharts |

---

## Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+

### 1. Start Frontend (Development)

```bash
cd frontend
npm install
npm run dev
```
Opens at http://localhost:5173

### 2. Start Backend

```bash
cd backend
pip install -r requirements.txt
python run.py
```
API available at http://localhost:8000
API docs at http://localhost:8000/api/docs

### 3. Configure AI (Optional)

Copy `.env.example` to `.env` in the backend directory:

```bash
cd backend
copy .env.example .env
```

Edit `.env` and set:
```
AI_PROVIDER=openai        # openai | anthropic | mock
OPENAI_API_KEY=sk-...     # if using OpenAI
ANTHROPIC_API_KEY=...     # if using Anthropic
```

If no API key is configured, the app uses the **Mock AI provider** which returns realistic demo responses — perfect for hackathon demos.

---

## Demo Scenario

The app is pre-loaded with a **College Administration demo case**:

**Student: Gokul Mahendran**  
Program: B.Tech Computer Science Engineering

| Document | Status |
|---|---|
| Student Application | ✅ Uploaded |
| Class 12 Marksheet | ✅ Uploaded |
| Aadhaar ID Card | ✅ Uploaded |
| Fee Receipt | ✅ Uploaded |

**AI Analysis Results:**
- ✅ Name matched across documents
- ✅ Register number matched
- ✅ Marksheet available (96.33%)
- ✅ Fee receipt available (₹75,500)
- ⚠️ **Date of Birth conflict** – Application: 12/05/2004 vs Aadhaar: 15/05/2004
- ❌ **Community Certificate missing**
- ❌ **Application signature missing**

**Final Status: Needs Verification**

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/documents` | List all documents |
| GET | `/documents/:id` | Get document details |
| POST | `/documents/upload` | Upload document(s) |
| POST | `/documents/:id/summarize` | Re-run AI summarization |
| DELETE | `/documents/:id` | Delete document |
| POST | `/chat` | AI chat about documents |
| POST | `/compare` | Compare two documents |
| GET | `/search?q=query` | Search all documents |
| GET | `/insights` | Get AI insights |
| GET | `/insights/dashboard` | Dashboard statistics |
| GET | `/health` | Health check |

---

## Project Structure

```
infolens/
├── frontend/              # React + TypeScript frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── data/          # Mock data (demo)
│   │   ├── store/         # Zustand state
│   │   ├── services/      # API client
│   │   └── types/         # TypeScript types
│   └── ...
├── backend/               # FastAPI backend
│   ├── app/
│   │   ├── main.py        # App entry point
│   │   ├── config.py      # Settings
│   │   ├── routers/       # API route handlers
│   │   ├── services/      # AI, document processing
│   │   └── models/        # Pydantic schemas
│   ├── uploads/           # Uploaded files
│   ├── requirements.txt
│   └── run.py
└── README.md
```

---

## Production Deployment

1. Build frontend: `cd frontend && npm run build`
2. The FastAPI backend serves the built frontend from `/frontend/dist`
3. Set production environment variables in `.env`
4. Use a PostgreSQL database by setting `DATABASE_URL`
5. Add vector embeddings for semantic search using pgvector

---

*Built for InfoLens Hackathon 2026*
