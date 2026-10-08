# InfoLens - Setup from GitHub

Complete guide for setting up InfoLens after cloning from GitHub.

---

## 📥 Clone Repository

```bash
git clone https://github.com/gokulmahendran46-lgtm/InfoLens-Intelligent-Assistant-.git
cd InfoLens-Intelligent-Assistant-
```

---

## 🔧 Backend Setup

### 1. Install Python

- **Required:** Python 3.9 or higher
- Download from: https://www.python.org/downloads/
- During installation, check ✅ **"Add Python to PATH"**

### 2. Create Virtual Environment

```powershell
cd backend

# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\Activate.ps1

# If you get execution policy error, run this first:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### 3. Install Dependencies

```powershell
pip install -r requirements.txt
```

### 4. Create Environment File

Copy `.env.example` to `.env`:

```powershell
copy .env.example .env
```

Edit `.env` and configure:

```env
# AI Provider (mock = no API key needed)
AI_PROVIDER=mock

# Optional: If you want to use real AI
# AI_PROVIDER=openai
# OPENAI_API_KEY=sk-your-key-here
# AI_MODEL=gpt-4o

# File Storage
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=50

# Application
DEBUG=true
SECRET_KEY=your-secret-key-change-in-production

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

### 5. Start Backend

```powershell
# Make sure venv is activated
.\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

**Backend runs on:** http://localhost:8000  
**API Docs:** http://localhost:8000/api/docs

---

## 🎨 Frontend Setup

### 1. Install Node.js

- **Required:** Node.js 18 or higher
- Download from: https://nodejs.org/
- Choose LTS (Long Term Support) version

### 2. Install Dependencies

```powershell
cd frontend

npm install
```

This will install all packages from `package.json` (takes 2-3 minutes).

### 3. Create Environment File

Copy `.env.example` to `.env`:

```powershell
copy .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:8000

# Optional: Supabase (if you use it for auth/storage)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-public-key
```

### 4. Start Frontend

```powershell
npm run dev
```

**Frontend runs on:** http://localhost:5173

---

## ✅ Verify Setup

1. **Backend Health Check:**
   ```powershell
   curl http://localhost:8000/health
   ```
   Should return: `{"status":"healthy",...}`

2. **Frontend:**
   - Open http://localhost:5173
   - You should see the InfoLens dashboard
   - 4 demo documents should be pre-loaded

3. **Test Upload:**
   - Click "Upload Document"
   - Upload a PDF or DOCX file
   - Wait for processing
   - View AI summary

4. **Test AI Chat:**
   - Go to "AI Assistant" page
   - Ask: "What are the deadlines?"
   - Should return dates from documents

---

## 🐛 Troubleshooting

### Backend Issues

**Problem:** `Module not found` errors

**Solution:**
```powershell
cd backend
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

---

**Problem:** `Port 8000 already in use`

**Solution:**
```powershell
# Find process using port 8000
Get-Process -Id (Get-NetTCPConnection -LocalPort 8000).OwningProcess

# Kill it (replace PID with actual process ID)
Stop-Process -Id PID -Force

# Or use a different port:
uvicorn main:app --reload --port 8001
```

---

**Problem:** Uploads fail or no text extracted

**Solution:**
```powershell
# For PDFs
pip install PyPDF2

# For DOCX
pip install python-docx

# For Images (OCR)
pip install pytesseract Pillow
# Also download Tesseract: https://github.com/UB-Mannheim/tesseract/wiki
```

---

### Frontend Issues

**Problem:** `npm install` fails

**Solution:**
```powershell
# Clear cache
npm cache clean --force

# Delete node_modules and try again
Remove-Item -Recurse -Force node_modules
npm install
```

---

**Problem:** Frontend can't connect to backend

**Solution:**
1. Check backend is running on port 8000
2. Verify `.env` has correct `VITE_API_URL`
3. Check CORS in backend `.env`
4. Restart frontend: `npm run dev`

---

**Problem:** `VITE_API_URL` not working

**Solution:**
- Environment variables in Vite must start with `VITE_`
- Restart frontend after changing `.env`
- Check console for correct API URL

---

### General Issues

**Problem:** Chat not working

**Check:**
1. Backend logs for errors
2. Browser console (F12) for errors
3. Network tab shows 200 OK responses
4. Test chat endpoint directly:
   ```powershell
   curl -X POST http://localhost:8000/chat -H "Content-Type: application/json" -d "{\"message\":\"test\"}"
   ```

---

## 🔐 Security Notes

### What's NOT in GitHub (for security):

- ❌ `.env` files (contains API keys)
- ❌ `node_modules/` (too large, 200MB+)
- ❌ `venv/` (Python virtual environment)
- ❌ `uploads/` (user documents)

### You Must Create:

1. **backend/.env** - Copy from .env.example
2. **frontend/.env** - Copy from .env.example
3. Add your own API keys if using OpenAI/Anthropic

---

## 📂 Project Structure

```
InfoLens-Intelligent-Assistant-/
├── backend/                    # Python FastAPI backend
│   ├── app/
│   │   ├── routers/            # API endpoints
│   │   ├── services/           # Business logic
│   │   ├── models/             # Data models
│   │   └── main.py
│   ├── uploads/                # File uploads (empty in git)
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # Environment template
│   └── main.py                 # Entry point
├── frontend/                   # React TypeScript frontend
│   ├── src/
│   │   ├── pages/              # React pages
│   │   ├── components/         # React components
│   │   ├── services/           # API client
│   │   └── store/              # State management
│   ├── package.json            # Node dependencies
│   ├── .env.example            # Environment template
│   └── vite.config.ts
├── README.md                   # Main documentation
├── SETUP_AND_TESTING.md       # Testing guide
└── AI_FEATURES.md             # AI documentation
```

---

## 🚀 Development Workflow

### Daily Development:

1. **Start Backend:**
   ```powershell
   cd backend
   .\venv\Scripts\Activate.ps1
   uvicorn main:app --reload --port 8000
   ```

2. **Start Frontend:**
   ```powershell
   cd frontend
   npm run dev
   ```

3. **Make Changes:**
   - Backend: Edit Python files, server auto-reloads
   - Frontend: Edit TypeScript/React files, Vite hot-reloads

4. **Test:**
   - Backend API: http://localhost:8000/api/docs
   - Frontend: http://localhost:5173

### Production Build:

```powershell
# Build frontend
cd frontend
npm run build

# Backend serves frontend from dist/ folder
cd ../backend
uvicorn main:app --host 0.0.0.0 --port 8000
```

---

## 🎯 Quick Start Script

Create `start.bat` in root directory:

```batch
@echo off
echo Starting InfoLens...

start cmd /k "cd backend && .\venv\Scripts\activate && uvicorn main:app --reload --port 8000"
timeout /t 3
start cmd /k "cd frontend && npm run dev"

echo Both servers started!
echo Backend: http://localhost:8000
echo Frontend: http://localhost:5173
```

---

## 📚 Additional Resources

- **FastAPI Docs:** https://fastapi.tiangolo.com/
- **React Docs:** https://react.dev/
- **Vite Docs:** https://vitejs.dev/
- **Tailwind CSS:** https://tailwindcss.com/docs

---

## 💡 Tips

1. **Use VS Code:**
   - Install Python extension
   - Install ESLint extension
   - Install Prettier extension

2. **Keep Dependencies Updated:**
   ```powershell
   pip list --outdated
   npm outdated
   ```

3. **Check Logs:**
   - Backend: Terminal running uvicorn
   - Frontend: Browser console (F12)

4. **API Testing:**
   - Use Postman or Thunder Client
   - Or use built-in Swagger docs

---

**Need Help?**

Check:
1. `README.md` - Feature overview
2. `AI_FEATURES.md` - AI documentation
3. `SETUP_AND_TESTING.md` - Testing guide
4. GitHub Issues: https://github.com/gokulmahendran46-lgtm/InfoLens-Intelligent-Assistant-/issues

---

**InfoLens** - Intelligent Information Understanding & Processing  
Built for Hackathon 2026
