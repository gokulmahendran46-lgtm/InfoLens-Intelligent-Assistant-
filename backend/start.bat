@echo off
echo ========================================
echo   InfoLens Backend Server
echo ========================================
echo.
echo Starting FastAPI server...
echo API: http://localhost:8000
echo Docs: http://localhost:8000/api/docs
echo.
echo Press Ctrl+C to stop
echo ========================================
echo.
uvicorn main:app --reload --port 8000
