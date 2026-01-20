# Restart Pollution Prediction System Servers
# This script stops existing servers and starts fresh ones

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "   Pollution Prediction System - Restart" -ForegroundColor Green  
Write-Host "============================================`n" -ForegroundColor Cyan

# Stop any running Python processes
Write-Host "[1/4] Stopping existing Python processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.Name -like "*python*" -and $_.Path -like "*pollution-prediction*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Stop any running Node processes
Write-Host "[2/4] Stopping existing Node processes..." -ForegroundColor Yellow
Get-Process | Where-Object {$_.Name -like "*node*" -and $_.CommandLine -like "*pollution-prediction*"} | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

Write-Host "`n[3/4] Starting Backend Server..." -ForegroundColor Green
Write-Host "Backend will run on: http://127.0.0.1:8000" -ForegroundColor Gray

# Start backend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\ssingh9\Desktop\pollution-prediction\backend; python -m uvicorn app:app --reload --host 127.0.0.1 --port 8000"

Start-Sleep -Seconds 5

Write-Host "`n[4/4] Starting Frontend Server..." -ForegroundColor Green
Write-Host "Frontend will run on: http://localhost:3000" -ForegroundColor Gray

# Start frontend in new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd C:\Users\ssingh9\Desktop\pollution-prediction\frontend-react; npm run dev"

Start-Sleep -Seconds 3

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host "   Servers Started Successfully!" -ForegroundColor Green
Write-Host "============================================`n" -ForegroundColor Cyan

Write-Host "Backend API:  " -NoNewline -ForegroundColor Yellow
Write-Host "http://127.0.0.1:8000" -ForegroundColor White
Write-Host "API Docs:     " -NoNewline -ForegroundColor Yellow
Write-Host "http://127.0.0.1:8000/docs" -ForegroundColor White
Write-Host "Frontend:     " -NoNewline -ForegroundColor Yellow
Write-Host "http://localhost:3000" -ForegroundColor White
Write-Host "Chatbot:      " -NoNewline -ForegroundColor Yellow
Write-Host "http://localhost:3000/chatbot" -ForegroundColor White

Write-Host "`nPress any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

