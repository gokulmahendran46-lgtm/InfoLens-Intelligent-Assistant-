# Python Setup Guide - InfoLens Backend

## Your Python Installation

**Location:** `C:\Users\gokul\AppData\Local\Programs\Python\Python313\python.exe`  
**Version:** Python 3.13.15  
**Status:** ✅ Verified and working

---

## Step-by-Step Setup Commands

Open PowerShell and navigate to the backend directory:

```powershell
cd "C:\Users\gokul\OneDrive\Desktop\Intelligent Information Understanding & Processing\infolens\backend"
```

### Option A: Automated Setup (Recommended)

Run the setup script:

```powershell
.\setup-venv.ps1
```

This will automatically:
1. ✅ Verify Python 3.13 installation
2. ✅ Create virtual environment in `backend\venv`
3. ✅ Upgrade pip
4. ✅ Install all dependencies from `requirements.txt`

Then start the server:

```powershell
.\start-server.ps1
```

---

### Option B: Manual Setup (Step by Step)

If you prefer to run commands manually:

#### 1. Navigate to backend directory
```powershell
cd "C:\Users\gokul\OneDrive\Desktop\Intelligent Information Understanding & Processing\infolens\backend"
```

#### 2. Verify Python works
```powershell
& "C:\Users\gokul\AppData\Local\Programs\Python\Python313\python.exe" --version
```
**Expected output:** `Python 3.13.15`

#### 3. Verify pip works
```powershell
& "C:\Users\gokul\AppData\Local\Programs\Python\Python313\python.exe" -m pip --version
```
**Expected output:** `pip 26.2.1 from ...`

#### 4. Create virtual environment
```powershell
& "C:\Users\gokul\AppData\Local\Programs\Python\Python313\python.exe" -m venv venv
```
**This creates:** `backend\venv\` directory

#### 5. Activate virtual environment
```powershell
.\venv\Scripts\Activate.ps1
```
**Your prompt should change to show:** `(venv)`

#### 6. Upgrade pip (optional but recommended)
```powershell
python -m pip install --upgrade pip
```

#### 7. Install dependencies
```powershell
pip install -r requirements.txt
```
**This takes 2-3 minutes**

#### 8. Start the server
```powershell
uvicorn main:app --reload --port 8000
```

Or without activating venv:
```powershell
.\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

---

## Quick Reference

### Using Virtual Environment (After Setup)

**Activate:**
```powershell
.\venv\Scripts\Activate.ps1
```

**Deactivate:**
```powershell
deactivate
```

**Install new package:**
```powershell
.\venv\Scripts\python.exe -m pip install package-name
```

**Run server:**
```powershell
.\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

---

## Verification Commands

Check everything is working:

```powershell
# Check Python in venv
.\venv\Scripts\python.exe --version

# Check pip in venv
.\venv\Scripts\python.exe -m pip --version

# List installed packages
.\venv\Scripts\python.exe -m pip list

# Check if FastAPI is installed
.\venv\Scripts\python.exe -m pip show fastapi
```

---

## Troubleshooting

### "Execution of scripts is disabled on this system"

If you get this error when running `.ps1` scripts:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then try again.

### Virtual environment already exists

If you want to recreate it:

```powershell
Remove-Item -Recurse -Force venv
.\setup-venv.ps1
```

### Dependencies fail to install

Try installing core packages first:

```powershell
.\venv\Scripts\python.exe -m pip install fastapi uvicorn python-multipart pydantic
```

Then install the rest:

```powershell
.\venv\Scripts\python.exe -m pip install -r requirements.txt
```

---

## What Gets Installed

From `requirements.txt`:
- **fastapi** - Web framework
- **uvicorn** - ASGI server
- **PyPDF2** - PDF text extraction
- **python-docx** - Word document processing
- **python-multipart** - File upload support
- **pydantic** - Data validation
- **pydantic-settings** - Configuration management
- And more...

---

## After Setup

Once setup is complete, you can start the server with:

```powershell
.\start-server.ps1
```

Or manually:

```powershell
.\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000
```

Then open: http://localhost:8000/api/docs

---

## Summary

Your Python 3.13 is properly installed. The virtual environment keeps project dependencies isolated and prevents conflicts with other Python projects.

**Next Steps:**
1. Run `.\setup-venv.ps1` (one time)
2. Run `.\start-server.ps1` (every time you want to start)
3. Open http://localhost:8000/api/docs

That's it! 🚀
