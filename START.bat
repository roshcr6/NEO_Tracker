@echo off
title NASA NEO TRACKER
color 0B

echo:
echo ========================================
echo   NASA NEO TRACKER - Quick Start
echo ========================================
echo:

cd /d %~dp0

echo Checking prerequisites...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found!
    pause
    exit /b 1
)

node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found!
    pause
    exit /b 1
)

if not exist ".venv\Scripts\python.exe" (
    echo Creating virtual environment...
    python -m venv .venv
    .venv\Scripts\pip.exe install -r backend\requirements.txt
)

if not exist "frontend\node_modules" (
    echo Installing npm packages...
    cd frontend
    call npm install
    cd ..
)

echo Setting up database...
cd backend
..\.venv\Scripts\python.exe manage.py migrate --noinput >nul 2>&1
cd ..

echo Starting Django Backend...
start "NASA Backend" cmd /k "cd /d %~dp0backend && ..\.venv\Scripts\python.exe manage.py runserver"
timeout /t 3 >nul

echo Starting React Frontend...
start "NASA Frontend" cmd /k "cd /d %~dp0frontend && npm start"

echo:
echo Waiting for servers to start...
timeout /t 15 >nul

echo:
echo ========================================
echo   APPLICATION READY!
echo ========================================
echo:
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:8000/api
echo   Orrery:    http://localhost:8000/orrery
echo:

start http://localhost:3000

echo Two terminal windows are running.
echo Close them or press Ctrl+C to stop.
echo:
pause
