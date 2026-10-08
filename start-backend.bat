@echo off
echo =====================================
echo   InfoLens - Starting Backend API
echo =====================================
echo.
echo API at http://localhost:8000
echo Docs at http://localhost:8000/api/docs
echo.
cd /d "%~dp0backend"
python run.py
pause
