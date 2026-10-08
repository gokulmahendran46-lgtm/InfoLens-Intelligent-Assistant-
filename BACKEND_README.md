# InfoLens Backend - FastAPI

## Overview

Production-ready FastAPI backend for InfoLens with document processing, AI analysis, and RESTful APIs.

## Features

✅ **Document Upload & Processing**
- Multi-file upload with validation
- PDF, DOCX, TXT, Image support
- Background processing with async tasks
- File size limits and security checks

✅ **AI Services**
- Mock AI (works without API keys)
- OpenAI GPT-4 integration
- Anthropic Claude integration
- Pluggable architecture

✅ **Document Analysis**
- Text extraction (PyPDF2, python-docx)
- OCR support (pytesseract)
- Automatic summarization
- Key information extraction

✅ **APIs**
- Document management CRUD
- AI chat with document context
- Document comparison
- Semantic search
- Insights and smart actions

## Project Structure

```
backend/
├── main.py                 # Entry point (uvicorn main:app)
├── run.py                  # Alternative entry (python run.py)
├── requirements.txt        # Dependencies
├── .env.example           # Environment template
├── start.bat              # Windows startup script
├── uploads/               # Document storage
└── app/
    ├── __init__.py
    ├── main.py            # FastAPI app definition
    ├── config.py          # Settings & configuration
    ├── models/
    │   ├── __init__.py
    │   └── schemas.py     # Pydantic models
    ├── routers/
    │   ├── __init__.py
    │   ├── documents.py   # Document endpoints
    │   ├── chat.py        # Chat endpoint
    │   ├── compare.py     # Comparison endpoint
    │   ├── search.py      # Search endpoint
    │   └── insights.py    # Insights endpoint
    └── services/
        ├── __init__.py
        ├── ai_service.py          # AI abstraction layer
        ├── document_processor.py  # Text extraction
        └── document_store.py      # In-memory storage
```

## Quick Start

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Run the Server

**Option A: Using uvicorn directly**
```bash
uvicorn main:app --reload --port 8000
```

**Option B: Using Python script**
```bash
python run.py
```

**Option C: Windows batch file**
```bash
start.bat
```

The server will start at:
- API: http://localhost:8000
- Interactive docs: http://localhost:8000/api/docs
- ReDoc: http://localhost:8000/api/redoc

### 3. Test the API

Visit http://localhost:8000/api/docs for interactive API testing.

## API Endpoints

### Documents
- `POST /documents/upload` - Upload multiple documents
- `GET /documents` - List all documents
- `GET /documents/{id}` - Get document details
- `POST /documents/{id}/summarize` - Re-run AI summary
- `DELETE /documents/{id}` - Delete document

### Chat
- `POST /chat` - Ask questions about documents
  ```json
  {
    "message": "What is the deadline?",
    "document_ids": ["doc-1", "doc-2"]
  }
  ```

### Compare
- `POST /compare` - Compare two documents
  ```json
  {
    "document_a_id": "doc-1",
    "document_b_id": "doc-2"
  }
  ```

### Search
- `GET /search?q=keyword` - Search across documents

### Insights
- `GET /insights` - Get AI-generated insights
- `GET /insights/dashboard` - Dashboard statistics

### Health
- `GET /health` - Health check
- `GET /` - API info

## Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# AI Provider (mock works without API keys)
AI_PROVIDER=mock           # mock | openai | anthropic

# If using OpenAI
OPENAI_API_KEY=sk-...
AI_MODEL=gpt-4o

# If using Anthropic
ANTHROPIC_API_KEY=...

# File upload
MAX_FILE_SIZE_MB=50
UPLOAD_DIR=./uploads

# CORS (for frontend)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### AI Providers

**Mock (Default)** - No API key needed
- Returns realistic contextual responses
- Perfect for demos and development
- Set `AI_PROVIDER=mock`

**OpenAI** - Requires API key
- GPT-4o, GPT-4 Turbo, GPT-3.5
- Set `AI_PROVIDER=openai`
- Add `OPENAI_API_KEY=sk-...`

**Anthropic** - Requires API key
- Claude 3.5 Sonnet
- Set `AI_PROVIDER=anthropic`
- Add `ANTHROPIC_API_KEY=...`

## Document Processing

### Supported Formats

| Format | Extension | Processor |
|--------|-----------|-----------|
| PDF | .pdf | PyPDF2 |
| Word | .docx, .doc | python-docx |
| Text | .txt | Native |
| Images | .jpg, .png, .webp | pytesseract (OCR) |

### Text Extraction

The system automatically:
1. Detects file type
2. Extracts text content
3. Estimates page count
4. Stores for AI processing

### AI Processing Pipeline

1. **Upload** → File saved to `uploads/`
2. **Extract** → Text extracted based on type
3. **Analyze** → AI summarization
4. **Store** → Results cached in memory
5. **Ready** → Available for queries

## Demo Data

The backend comes pre-loaded with 4 demo documents:
- Student Application (Gokul Mahendran)
- Class 12 Marksheet
- Aadhaar ID Card
- Fee Receipt

This allows immediate testing without uploading files.

## Development

### Adding New Endpoints

1. Create router in `app/routers/`
2. Import in `app/main.py`
3. Add to app: `app.include_router(your_router)`

### Adding New AI Provider

Extend `AIServiceBase` in `app/services/ai_service.py`:

```python
class CustomAIService(AIServiceBase):
    async def summarize(self, text: str, filename: str):
        # Your implementation
        pass
    
    async def chat(self, message: str, context_texts: List[str]):
        # Your implementation
        pass
```

## Production Deployment

### Database Migration

Replace in-memory store with PostgreSQL:

```python
# In config.py
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/infolens

# Create models with SQLAlchemy
# Run migrations with Alembic
```

### Vector Search

Add pgvector for semantic search:

```python
pip install pgvector
# Store document embeddings
# Use cosine similarity for search
```

### File Storage

Use cloud storage instead of local:
- AWS S3
- Azure Blob Storage
- Google Cloud Storage

### Security

- Enable authentication (JWT)
- Rate limiting
- Input validation
- File scanning
- HTTPS only

## Troubleshooting

### Import Errors
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Port Already in Use
```bash
# Change port in command
uvicorn main:app --reload --port 8001
```

### PDF Extraction Not Working
```bash
pip install --upgrade PyPDF2
```

### OCR Not Working
```bash
# Install Tesseract OCR separately
# Windows: https://github.com/UB-Mannheim/tesseract/wiki
# Add to PATH
```

## Testing

```bash
# Test health endpoint
curl http://localhost:8000/health

# Test document upload
curl -X POST "http://localhost:8000/documents/upload" \
  -H "accept: application/json" \
  -F "files=@document.pdf"

# Test chat
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{"message":"What is the deadline?"}'
```

## Performance

- Async/await for I/O operations
- Background tasks for processing
- Efficient text extraction
- Cached AI responses
- Fast in-memory storage (demo)

## Security Features

✅ File type validation
✅ File size limits
✅ CORS configured
✅ Input sanitization
✅ Error handling
✅ Environment-based secrets

## Next Steps

1. Install Python dependencies: `pip install -r requirements.txt`
2. Run the server: `uvicorn main:app --reload --port 8000`
3. Visit http://localhost:8000/api/docs
4. Start uploading documents!

---

**Built for InfoLens - Intelligent Information Assistant**
