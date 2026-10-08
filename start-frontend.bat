@echo off
echo =====================================
echo   InfoLens - Starting Frontend
echo =====================================
echo.
echo Opening at http://localhost:5173
echo.
cd /d "%~dp0frontend"
node node_modules/vite/bin/vite.js
pause
