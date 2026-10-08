@echo off
echo ========================================
echo   InfoLens - Upload to GitHub
echo ========================================
echo.

echo WARNING: This will upload ALL files including:
echo   - .env files with your API keys (PUBLIC!)
echo   - node_modules (200MB+)
echo   - venv (250MB+)
echo   - All other files
echo.

echo RECOMMENDED: Download GitHub Desktop first
echo Go to: https://desktop.github.com/
echo.
echo After installing GitHub Desktop:
echo 1. Open GitHub Desktop
echo 2. Click "Add Local Repository"
echo 3. Choose this folder
echo 4. Click "Publish repository"
echo 5. Check "Keep this code private"
echo 6. Click "Publish"
echo.

echo Do you want to open GitHub website for manual upload?
set /p answer=Type 'YES' to open GitHub, or 'NO' to cancel: 

if /i "%answer%"=="YES" (
    echo Opening GitHub...
    start "" "https://github.com/gokulmahendran46-lgtm/InfoLens-Intelligent-Assistant-"
    echo.
    echo Instructions for web upload:
    echo 1. Click "Add file" -> "Upload files"
    echo 2. Drag and drop ALL folders
    echo 3. Click "Commit changes"
    echo.
    echo WARNING: Web upload has 25MB file limit
    echo For large files, use GitHub Desktop
) else (
    echo Operation cancelled.
)

echo.
pause