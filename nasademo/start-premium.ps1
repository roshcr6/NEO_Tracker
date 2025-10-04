#!/usr/bin/env pwsh
# Premium Animation Quick Start Script

Write-Host "🎨 Starting NASA Demo with Premium Animations..." -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "frontend")) {
    Write-Host "❌ Error: Please run this script from d:\nasademo" -ForegroundColor Red
    exit 1
}

# Start Backend
Write-Host "🚀 Starting Django Backend..." -ForegroundColor Green
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd backend; python manage.py runserver"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend
Write-Host "⚛️  Starting React Frontend..." -ForegroundColor Blue
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd frontend; npm start"

Write-Host ""
Write-Host "✅ Servers starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📱 Frontend: http://localhost:3000" -ForegroundColor Cyan
Write-Host "🔧 Backend:  http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎯 Test these premium features:" -ForegroundColor Yellow
Write-Host "   1. Hover over buttons (magnetic effect)" -ForegroundColor White
Write-Host "   2. Click buttons (ripple effect)" -ForegroundColor White
Write-Host "   3. Scroll down (parallax + fade)" -ForegroundColor White
Write-Host "   4. Hover over stats (scale + glow)" -ForegroundColor White
Write-Host "   5. Navigate pages (smooth transitions)" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Magenta
Write-Host "   - PREMIUM_ANIMATIONS_GUIDE.md" -ForegroundColor White
Write-Host "   - ANIMATION_TESTING_GUIDE.md" -ForegroundColor White
Write-Host "   - ANIMATION_IMPLEMENTATION_SUMMARY.md" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C in each terminal to stop servers" -ForegroundColor Gray
