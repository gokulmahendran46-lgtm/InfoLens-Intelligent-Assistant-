# Push InfoLens to GitHub - Complete Guide

## 📋 Prerequisites

You need to install Git first.

### Install Git for Windows

1. **Download Git:**
   - Go to: https://git-scm.com/download/win
   - Download "64-bit Git for Windows Setup"

2. **Install Git:**
   - Run the installer
   - Use default settings (just click "Next")
   - Important: Check "Git from the command line and also from 3rd-party software"

3. **Verify Installation:**
   ```powershell
   git --version
   ```

---

## 🚀 Quick Push (After Git is Installed)

### Option 1: Using PowerShell Script (Recommended)

Run this in PowerShell from the `infolens` directory:

```powershell
.\push-to-github.ps1
```

### Option 2: Manual Commands

```powershell
cd "c:\Users\gokul\OneDrive\Desktop\Intelligent Information Understanding & Processing\infolens"

# Initialize git if not already done
git init

# Configure git (first time only)
git config user.name "Gokul Mahendran"
git config user.email "gokulmahendran46@gmail.com"

# Add remote repository
git remote add origin https://github.com/gokulmahendran46-lgtm/InfoLens-Intelligent-Assistant-.git

# Or if remote exists, update it:
git remote set-url origin https://github.com/gokulmahendran46-lgtm/InfoLens-Intelligent-Assistant-.git

# Check what will be added
git status

# Add all files
git add .

# Create .gitignore if needed
echo "node_modules/" > .gitignore
echo "venv/" >> .gitignore
echo "__pycache__/" >> .gitignore
echo "*.pyc" >> .gitignore
echo ".env" >> .gitignore
echo "uploads/*" >> .gitignore
echo "!uploads/.gitkeep" >> .gitignore

# Commit
git commit -m "Complete InfoLens implementation with AI features"

# Push to GitHub
git push -u origin main

# If main branch doesn't exist, try master:
# git push -u origin master

# Or force push if needed (WARNING: overwrites remote):
# git push -u origin main --force
```

---

## 📂 What Will Be Pushed

### Backend Files:
```
backend/
├── app/
│   ├── main.py                    # FastAPI app entry
│   ├── config.py                  # Configuration
│   ├── routers/                   # API endpoints
│   │   ├── documents.py
│   │   ├── chat.py
│   │   ├── compare.py
│   │   ├── search.py
│   │   └── insights.py
│   ├── services/                  # Business logic
│   │   ├── ai_service.py          # AI providers
│   │   ├── ai_service_enhanced.py # Intelligent mock AI
│   │   ├── document_processor.py  # Text extraction
│   │   ├── document_store.py      # In-memory storage
│   │   └── insights_generator.py  # Conflict detection
│   └── models/
│       └── schemas.py             # Pydantic models
├── main.py                        # Entry point
├── requirements.txt               # Python dependencies
├── .env.example                   # Environment template
└── AI_FEATURES.md                 # Documentation
```

### Frontend Files:
```
frontend/
├── src/
│   ├── pages/                     # React pages
│   │   ├── Dashboard.tsx
│   │   ├── Documents.tsx
│   │   ├── DocumentDetail.tsx
│   │   ├── AIAssistant.tsx
│   │   ├── Compare.tsx
│   │   ├── Insights.tsx
│   │   └── Settings.tsx
│   ├── components/                # React components
│   ├── services/
│   │   └── api.ts                 # API client
│   ├── store/                     # Zustand state
│   ├── types/                     # TypeScript types
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── .env.example
```

### Root Files:
```
├── README.md                      # Main documentation
├── SETUP_AND_TESTING.md          # Setup guide
├── AI_FEATURES.md                # AI documentation
└── .gitignore                    # Git ignore rules
```

---

## 🔒 Files That Won't Be Pushed (.gitignore)

These files are excluded for security/size:

- `node_modules/` - Frontend dependencies (too large)
- `venv/` - Python virtual environment
- `__pycache__/` - Python cache
- `.env` - Environment secrets (contains API keys)
- `uploads/*` - Uploaded documents (user data)

**Why?**
- Others will run `npm install` to get node_modules
- Others will create their own venv
- `.env` contains your API keys (should never be public)

---

## ⚠️ Before Pushing - Security Check

### Check Your .env File

Make sure your `.env` file is NOT committed:

```powershell
# Check if .env is tracked
git status

# If .env appears, remove it:
git rm --cached backend/.env
git rm --cached frontend/.env

# Add to .gitignore
echo ".env" >> .gitignore
```

### Create .env.example Instead

Copy your `.env` but remove sensitive values:

**backend/.env.example:**
```env
AI_PROVIDER=mock
OPENAI_API_KEY=your-key-here
ANTHROPIC_API_KEY=your-key-here
AI_MODEL=gpt-4o
UPLOAD_DIR=./uploads
MAX_FILE_SIZE_MB=50
DEBUG=true
ALLOWED_ORIGINS=http://localhost:5173
```

**frontend/.env.example:**
```env
VITE_API_URL=http://localhost:8000
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-public-key
```

---

## 🐛 Troubleshooting

### Issue: "git: command not found"

**Solution:** Install Git first (see Prerequisites above)

---

### Issue: "fatal: remote origin already exists"

**Solution:**
```powershell
git remote remove origin
git remote add origin https://github.com/gokulmahendran46-lgtm/InfoLens-Intelligent-Assistant-.git
```

---

### Issue: "Updates were rejected"

**Solution:** Force push (WARNING: overwrites remote)
```powershell
git push -u origin main --force
```

---

### Issue: "Permission denied"

**Solutions:**

**Option A: Use Personal Access Token (Recommended)**

1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens
2. Generate new token (classic)
3. Give it "repo" permissions
4. Copy the token
5. When pushing, use token as password:
   ```
   Username: gokulmahendran46-lgtm
   Password: <paste your token>
   ```

**Option B: Use GitHub Desktop**

1. Download: https://desktop.github.com/
2. Sign in with GitHub account
3. Add repository: File → Add Local Repository
4. Select your infolens folder
5. Click "Publish repository"

---

### Issue: "Large files detected"

If git complains about large files:

```powershell
# Remove large files from git
git rm --cached path/to/large/file

# Add to .gitignore
echo "large-file.pdf" >> .gitignore

# Commit and push again
git commit -m "Remove large files"
git push
```

---

## 📊 Verify Upload

After pushing, check GitHub:

1. Go to: https://github.com/gokulmahendran46-lgtm/InfoLens-Intelligent-Assistant-
2. Verify you see:
   - ✅ `backend/` folder with all Python files
   - ✅ `frontend/` folder with all React files
   - ✅ `README.md` with documentation
   - ✅ `requirements.txt`
   - ✅ `package.json`
   - ❌ NO `node_modules/` (should be ignored)
   - ❌ NO `venv/` (should be ignored)
   - ❌ NO `.env` files (should be ignored)

---

## 🎯 After Pushing

Update your README on GitHub to include:

1. **Badges:**
   ```markdown
   ![Python](https://img.shields.io/badge/python-3.11+-blue.svg)
   ![React](https://img.shields.io/badge/react-18.2-blue.svg)
   ![FastAPI](https://img.shields.io/badge/FastAPI-0.115-green.svg)
   ```

2. **Live Demo Link** (if deployed)

3. **Screenshots** (add to `screenshots/` folder)

---

## 🚀 Quick Command Summary

```powershell
# One-time setup
git init
git config user.name "Gokul Mahendran"
git config user.email "gokulmahendran46@gmail.com"
git remote add origin https://github.com/gokulmahendran46-lgtm/InfoLens-Intelligent-Assistant-.git

# Regular workflow
git add .
git commit -m "Your commit message"
git push -u origin main

# If branch is master instead of main:
git push -u origin master

# Force push (only if needed):
git push -u origin main --force
```

---

## 📞 Need Help?

If you encounter any issues:

1. Check if Git is installed: `git --version`
2. Check current status: `git status`
3. Check remote URL: `git remote -v`
4. Check branch: `git branch`

---

**Note:** After pushing, others can clone your repository with:
```bash
git clone https://github.com/gokulmahendran46-lgtm/InfoLens-Intelligent-Assistant-.git
cd InfoLens-Intelligent-Assistant-
```

Then they follow the setup instructions in README.md!
