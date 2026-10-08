# InfoLens Backend - Start Server
# Automatically uses the virtual environment

$VENV_PYTHON = ".\venv\Scripts\python.exe"
$BACKEND_DIR = $PSScriptRoot

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  InfoLens Backend Server" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if virtual environment exists
if (-not (Test-Path $VENV_PYTHON)) {
    Write-Host "✗ Virtual environment not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please run setup first:" -ForegroundColor Yellow
    Write-Host "  .\setup-venv.ps1" -ForegroundColor Cyan
    Write-Host ""
    exit 1
}

Write-Host "Starting FastAPI server..." -ForegroundColor Green
Write-Host ""
Write-Host "API Server:    http://localhost:8000" -ForegroundColor Cyan
Write-Host "API Docs:      http://localhost:8000/api/docs" -ForegroundColor Cyan
Write-Host "Health Check:  http://localhost:8000/health" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Start uvicorn
& $VENV_PYTHON -m uvicorn main:app --reload --port 8000
