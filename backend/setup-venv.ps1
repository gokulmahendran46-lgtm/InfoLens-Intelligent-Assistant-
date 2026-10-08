# InfoLens Backend - Virtual Environment Setup
# Uses Python 3.13 from: C:\Users\gokul\AppData\Local\Programs\Python\Python313\python.exe

$PYTHON_EXE = "C:\Users\gokul\AppData\Local\Programs\Python\Python313\python.exe"
$VENV_DIR = "venv"
$BACKEND_DIR = $PSScriptRoot

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  InfoLens Backend - Python Setup" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify Python
Write-Host "[1/4] Verifying Python installation..." -ForegroundColor Yellow
if (Test-Path $PYTHON_EXE) {
    $version = & $PYTHON_EXE --version
    Write-Host "  ✓ Found: $version" -ForegroundColor Green
    Write-Host "  ✓ Location: $PYTHON_EXE" -ForegroundColor Green
} else {
    Write-Host "  ✗ Python not found at expected location!" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 2: Create virtual environment
Write-Host "[2/4] Creating virtual environment..." -ForegroundColor Yellow
if (Test-Path $VENV_DIR) {
    Write-Host "  ℹ Virtual environment already exists, recreating..." -ForegroundColor Cyan
    Remove-Item -Recurse -Force $VENV_DIR
}

& $PYTHON_EXE -m venv $VENV_DIR
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ Virtual environment created at: backend\venv" -ForegroundColor Green
} else {
    Write-Host "  ✗ Failed to create virtual environment" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Upgrade pip
Write-Host "[3/4] Upgrading pip in virtual environment..." -ForegroundColor Yellow
& "$VENV_DIR\Scripts\python.exe" -m pip install --upgrade pip --quiet
if ($LASTEXITCODE -eq 0) {
    $pipVersion = & "$VENV_DIR\Scripts\python.exe" -m pip --version
    Write-Host "  ✓ $pipVersion" -ForegroundColor Green
} else {
    Write-Host "  ✗ Failed to upgrade pip" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 4: Install dependencies
Write-Host "[4/4] Installing project dependencies..." -ForegroundColor Yellow
Write-Host "  (This may take 2-3 minutes)" -ForegroundColor Cyan
& "$VENV_DIR\Scripts\python.exe" -m pip install -r requirements.txt --quiet
if ($LASTEXITCODE -eq 0) {
    Write-Host "  ✓ All dependencies installed successfully" -ForegroundColor Green
} else {
    Write-Host "  ⚠ Some dependencies may have failed" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Setup Complete! ✓" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Virtual environment created at:" -ForegroundColor White
Write-Host "  $BACKEND_DIR\$VENV_DIR" -ForegroundColor Cyan
Write-Host ""
Write-Host "To activate the virtual environment:" -ForegroundColor White
Write-Host "  .\venv\Scripts\Activate.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "To start the server:" -ForegroundColor White
Write-Host "  .\venv\Scripts\python.exe -m uvicorn main:app --reload --port 8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Or use the quick start script:" -ForegroundColor White
Write-Host "  .\start-server.ps1" -ForegroundColor Cyan
Write-Host ""
