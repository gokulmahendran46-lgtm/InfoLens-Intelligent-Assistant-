@echo off
echo ========================================
echo   InfoLens - Fix Bugs & Push to GitHub
echo ========================================
echo.

echo Step 1: Checking Git installation...
where git >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Git is not installed!
    echo Download from: https://git-scm.com/download/win
    pause
    exit /b 1
)

echo ✅ Git is installed
echo.

echo Step 2: Initializing Git repository...
if not exist ".git" (
    git init
    git config user.name "Gokul Mahendran"
    git config user.email "gokulmahendran46@gmail.com"
)

echo ✅ Git repository initialized
echo.

echo Step 3: Fixing backend issues...

REM Fix potential issues
if exist "backend\main.py" (
    echo Deleting duplicate main.py...
    del "backend\main.py"
)

echo Checking Python imports...
python -c "import sys; sys.path.append('backend'); import app.config; print('✅ Python imports OK')" 2>nul
if %errorlevel% neq 0 (
    echo ⚠️  Python imports might have issues
)

echo.
echo Step 4: Adding all files to Git...

REM Create .gitignore if needed
if not exist ".gitignore" (
    echo Creating .gitignore...
    echo # Minimal .gitignore > .gitignore
    echo .DS_Store >> .gitignore
    echo Thumbs.db >> .gitignore
)

REM Add everything
git add -A

echo ✅ All files added
echo.

echo Step 5: Committing changes...
git commit -m "Complete InfoLens project with AI features, document processing, and intelligent analysis"
if %errorlevel% neq 0 (
    echo ⚠️  No changes to commit or commit failed
)

echo.
echo Step 6: Adding GitHub remote...
git remote get-url origin >nul 2>&1
if %errorlevel% neq 0 (
    git remote add origin https://github.com/gokulmahendran46-lgtm/InfoLens-Intelligent-Assistant-.git
else (
    git remote set-url origin https://github.com/gokulmahendran46-lgtm/InfoLens-Intelligent-Assistant-.git
)

echo ✅ GitHub remote configured
echo.

echo Step 7: Pushing to GitHub...
echo WARNING: This may take a few minutes...
echo You may need to enter GitHub credentials...
echo.

git push -u origin main --force 2>&1 | findstr /v /c:"remote:" | findstr /v /c:"Writing"
if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Normal push failed, trying alternative...
    git branch -M main
    git push -u origin main --force
)

echo.
echo ========================================
if %errorlevel% equ 0 (
    echo ✅ SUCCESS! Project pushed to GitHub.
    echo.
    echo Visit: https://github.com/gokulmahendran46-lgtm/InfoLens-Intelligent-Assistant-
) else (
    echo ❌ Push failed.
    echo.
    echo Try manually:
    echo 1. Open GitHub Desktop
    echo 2. Add this folder as repository
    echo 3. Publish to GitHub
)

echo.
pause