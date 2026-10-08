# InfoLens - Push ALL Files to GitHub
# This script pushes EVERYTHING including node_modules, venv, .env files

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  InfoLens - Push ALL Files to GitHub" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
Write-Host "Checking if Git is installed..." -ForegroundColor Yellow
$gitInstalled = Get-Command git -ErrorAction SilentlyContinue

if (-not $gitInstalled) {
    Write-Host "❌ ERROR: Git is not installed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please install Git first:" -ForegroundColor Yellow
    Write-Host "1. Download from: https://git-scm.com/download/win" -ForegroundColor White
    Write-Host "2. Run the installer" -ForegroundColor White
    Write-Host "3. Restart PowerShell" -ForegroundColor White
    Write-Host "4. Run this script again" -ForegroundColor White
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Git is installed" -ForegroundColor Green
Write-Host ""

# Navigate to script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "📂 Working directory: $scriptPath" -ForegroundColor Cyan
Write-Host ""

# Check if .git exists
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Git repository initialized" -ForegroundColor Green
    Write-Host ""
}

# Configure Git user (if not configured)
$userName = git config user.name
$userEmail = git config user.email

if (-not $userName) {
    Write-Host "⚙️ Configuring Git user..." -ForegroundColor Yellow
    git config user.name "Gokul Mahendran"
    git config user.email "gokulmahendran46@gmail.com"
    Write-Host "✅ Git user configured" -ForegroundColor Green
    Write-Host ""
}

# Check if remote exists
$remoteUrl = git remote get-url origin 2>$null

if (-not $remoteUrl) {
    Write-Host "Adding GitHub remote..." -ForegroundColor Yellow
    git remote add origin https://github.com/gokulmahendran46-lgtm/InfoLens-Intelligent-Assistant-.git
    Write-Host "✅ Remote added" -ForegroundColor Green
    Write-Host ""
} else {
    Write-Host "✅ Remote already configured: $remoteUrl" -ForegroundColor Green
    
    # Update remote URL to ensure it's correct
    git remote set-url origin https://github.com/gokulmahendran46-lgtm/InfoLens-Intelligent-Assistant-.git
    Write-Host ""
}

# Create minimal .gitignore (already done)
Write-Host "✅ Minimal .gitignore in place" -ForegroundColor Green
Write-Host ""

# Show what will be pushed
Write-Host "📊 Files that will be pushed:" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ ALL Python files (including venv/)" -ForegroundColor White
Write-Host "✅ ALL Node files (including node_modules/)" -ForegroundColor White
Write-Host "✅ ALL .env files (with your API keys)" -ForegroundColor White
Write-Host "✅ ALL uploaded documents" -ForegroundColor White
Write-Host "✅ ALL configuration files" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  WARNING: This will push sensitive files!" -ForegroundColor Red
Write-Host "   - API keys in .env files will be PUBLIC" -ForegroundColor Yellow
Write-Host "   - Repository size will be VERY LARGE (500MB+)" -ForegroundColor Yellow
Write-Host ""

# Ask for confirmation
Write-Host "Are you SURE you want to push ALL files including secrets?" -ForegroundColor Red
$confirmation = Read-Host "Type 'YES I AM SURE' to continue"

if ($confirmation -ne "YES I AM SURE") {
    Write-Host "❌ Push cancelled" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 0
}

Write-Host ""
Write-Host "Adding ALL files..." -ForegroundColor Yellow

# Add all files (force add everything)
git add -A
git add -f .env
git add -f frontend/.env
git add -f backend/.env
git add -f node_modules/
git add -f venv/
git add -f uploads/

Write-Host "✅ All files staged" -ForegroundColor Green
Write-Host ""

# Show status
Write-Host "Files to be committed:" -ForegroundColor Cyan
git status --short | Select-Object -First 20
$totalFiles = (git status --short | Measure-Object).Count
Write-Host "... and $totalFiles more files" -ForegroundColor Gray
Write-Host ""

# Get commit message
Write-Host "Enter commit message (or press Enter for default):" -ForegroundColor Cyan
$commitMessage = Read-Host "Commit message"

if (-not $commitMessage) {
    $commitMessage = "Complete InfoLens project with all dependencies and files"
}

# Commit
Write-Host ""
Write-Host "Creating commit..." -ForegroundColor Yellow
git commit -m $commitMessage

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️  No changes to commit or commit failed" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Commit created" -ForegroundColor Green
Write-Host ""

# Warn about large push
Write-Host "⚠️  WARNING: Push may take several minutes (large files)" -ForegroundColor Yellow
Write-Host "   Please be patient..." -ForegroundColor White
Write-Host ""

# Push
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "⏳ This will take a while..." -ForegroundColor Gray
Write-Host ""

# Set larger buffer for large push
git config http.postBuffer 524288000

# Try to push
git branch -M main
git push -u origin main --force 2>&1

$pushSuccess = $LASTEXITCODE -eq 0

if ($pushSuccess) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "  ✅ SUCCESS!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "All files have been pushed to GitHub!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🔗 Repository URL:" -ForegroundColor Cyan
    Write-Host "   https://github.com/gokulmahendran46-lgtm/InfoLens-Intelligent-Assistant-" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  IMPORTANT SECURITY WARNING:" -ForegroundColor Red
    Write-Host "   - Your .env files with API keys are now PUBLIC" -ForegroundColor Yellow
    Write-Host "   - Anyone can see your OpenAI/Supabase keys" -ForegroundColor Yellow
    Write-Host "   - You should REGENERATE all API keys immediately" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "🔒 To secure your repository:" -ForegroundColor Cyan
    Write-Host "1. Go to repository Settings → Delete .env files from history" -ForegroundColor White
    Write-Host "2. Regenerate all API keys:" -ForegroundColor White
    Write-Host "   - OpenAI: https://platform.openai.com/api-keys" -ForegroundColor White
    Write-Host "   - Supabase: https://supabase.com/dashboard/project/_/settings/api" -ForegroundColor White
    Write-Host "3. Add proper .gitignore and recommit" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Push failed!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common reasons:" -ForegroundColor Yellow
    Write-Host "1. Files too large (GitHub limit: 100MB per file)" -ForegroundColor White
    Write-Host "2. Authentication failed" -ForegroundColor White
    Write-Host "3. Network timeout" -ForegroundColor White
    Write-Host ""
    Write-Host "Try:" -ForegroundColor Cyan
    Write-Host "1. Use GitHub Desktop instead (easier for large files)" -ForegroundColor White
    Write-Host "2. Use Git LFS for large files" -ForegroundColor White
    Write-Host "3. Push without node_modules and venv" -ForegroundColor White
    Write-Host ""
}

Read-Host "Press Enter to exit"
