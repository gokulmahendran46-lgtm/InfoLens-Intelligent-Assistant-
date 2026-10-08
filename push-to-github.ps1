# InfoLens - Push to GitHub Script
# Run this script to push all files to your GitHub repository

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  InfoLens - Push to GitHub" -ForegroundColor Cyan
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

Write-Host "✅ Git is installed: $($gitInstalled.Version)" -ForegroundColor Green
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
    Write-Host ""
}

# Create/Update .gitignore
Write-Host "Creating .gitignore..." -ForegroundColor Yellow

$gitignoreContent = @"
# Python
venv/
__pycache__/
*.pyc
*.pyo
*.pyd
.Python
*.so
*.egg
*.egg-info/
dist/
build/

# Node
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
dist/
.cache/

# Environment
.env
.env.local
.env.production

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Uploads
uploads/*
!uploads/.gitkeep

# Logs
*.log
logs/

# Database
*.db
*.sqlite

# Temporary
*.tmp
temp/
"@

$gitignoreContent | Out-File -FilePath ".gitignore" -Encoding UTF8
Write-Host "✅ .gitignore created" -ForegroundColor Green
Write-Host ""

# Check for sensitive files
Write-Host "🔒 Checking for sensitive files..." -ForegroundColor Yellow

if (Test-Path "backend/.env") {
    Write-Host "⚠️  WARNING: backend/.env file found!" -ForegroundColor Red
    Write-Host "   This file contains secrets and will NOT be pushed (in .gitignore)" -ForegroundColor Yellow
}

if (Test-Path "frontend/.env") {
    Write-Host "⚠️  WARNING: frontend/.env file found!" -ForegroundColor Red
    Write-Host "   This file contains secrets and will NOT be pushed (in .gitignore)" -ForegroundColor Yellow
}

Write-Host ""

# Show status
Write-Host "📊 Git Status:" -ForegroundColor Cyan
Write-Host ""
git status --short
Write-Host ""

# Ask for confirmation
Write-Host "Ready to commit and push all files to GitHub?" -ForegroundColor Yellow
$confirmation = Read-Host "Type 'yes' to continue, or 'no' to cancel"

if ($confirmation -ne "yes") {
    Write-Host "❌ Push cancelled" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 0
}

# Add all files
Write-Host ""
Write-Host "Adding files..." -ForegroundColor Yellow
git add .
Write-Host "✅ Files staged" -ForegroundColor Green
Write-Host ""

# Get commit message
Write-Host "Enter commit message (or press Enter for default):" -ForegroundColor Cyan
$commitMessage = Read-Host "Commit message"

if (-not $commitMessage) {
    $commitMessage = "Complete InfoLens implementation - AI-powered document intelligence system"
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

# Push
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "⏳ This may take a few moments..." -ForegroundColor Gray
Write-Host ""

# Try to push to main branch first
git push -u origin main 2>&1 | Out-Null

if ($LASTEXITCODE -ne 0) {
    # If main fails, try master
    Write-Host "Trying master branch..." -ForegroundColor Yellow
    git branch -M main
    git push -u origin main 2>&1 | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        # If still fails, may need force push
        Write-Host ""
        Write-Host "⚠️  Normal push failed. This might be because:" -ForegroundColor Yellow
        Write-Host "   - The remote repository has changes" -ForegroundColor White
        Write-Host "   - This is the first push" -ForegroundColor White
        Write-Host ""
        Write-Host "Do you want to FORCE PUSH? (This will overwrite remote repository)" -ForegroundColor Red
        $forcePush = Read-Host "Type 'FORCE' to force push, or anything else to cancel"
        
        if ($forcePush -eq "FORCE") {
            git push -u origin main --force
            
            if ($LASTEXITCODE -ne 0) {
                Write-Host "❌ Force push failed!" -ForegroundColor Red
                Write-Host ""
                Write-Host "Possible reasons:" -ForegroundColor Yellow
                Write-Host "1. Authentication failed - need to provide credentials" -ForegroundColor White
                Write-Host "2. Repository URL is incorrect" -ForegroundColor White
                Write-Host "3. No internet connection" -ForegroundColor White
                Write-Host ""
                Write-Host "Try manual push with:" -ForegroundColor Cyan
                Write-Host "   git push -u origin main --force" -ForegroundColor White
                Read-Host "Press Enter to exit"
                exit 1
            }
        } else {
            Write-Host "❌ Push cancelled" -ForegroundColor Red
            Read-Host "Press Enter to exit"
            exit 0
        }
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  ✅ SUCCESS!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your InfoLens project has been pushed to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "🔗 Repository URL:" -ForegroundColor Cyan
Write-Host "   https://github.com/gokulmahendran46-lgtm/InfoLens-Intelligent-Assistant-" -ForegroundColor White
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Visit your repository on GitHub" -ForegroundColor White
Write-Host "2. Verify all files are present" -ForegroundColor White
Write-Host "3. Update README if needed" -ForegroundColor White
Write-Host "4. Add screenshots (optional)" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Remember:" -ForegroundColor Yellow
Write-Host "- .env files are NOT pushed (contains secrets)" -ForegroundColor White
Write-Host "- Others need to create their own .env files" -ForegroundColor White
Write-Host "- node_modules and venv are not pushed (too large)" -ForegroundColor White
Write-Host ""

Read-Host "Press Enter to exit"
