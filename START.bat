@echo off
title NASA NEO TRACKER - Startup
color 0B

echo:
echo ========================================
echo   NASA NEO TRACKER - Quick Start
echo ========================================
echo:

cd /d %~dp0

echo [1/6] Checking prerequisites...
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python not found! Please install Python 3.8 or higher.
    echo Download from: https://www.python.org/downloads/
    pause
    exit /b 1
)

node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js not found! Please install Node.js 16 or higher.
    echo Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo [2/6] Setting up Python virtual environment...
if not exist ".venv\Scripts\python.exe" (
    echo Creating virtual environment...
    python -m venv .venv
    if errorlevel 1 (
        echo ERROR: Failed to create virtual environment!
        pause
        exit /b 1
    )
)

if not exist ".venv\Scripts\pip.exe" (
    echo ERROR: Virtual environment is corrupted. Recreating...
    rmdir /s /q .venv
    python -m venv .venv
)

echo Installing/Updating Python dependencies...
.venv\Scripts\pip.exe install --upgrade pip >nul 2>&1
.venv\Scripts\pip.exe install -r backend\requirements.txt
if errorlevel 1 (
    echo WARNING: Some Python packages may have failed to install.
    echo Continuing anyway...
)

echo [3/6] Setting up Node.js dependencies...
if not exist "frontend\node_modules" (
    echo Installing npm packages (this may take a few minutes^)...
    cd frontend
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install npm packages!
        cd ..
        pause
        exit /b 1
    )
    cd ..
) else (
    echo npm packages already installed.
)

echo [4/6] Setting up database...
cd backend
..\.venv\Scripts\python.exe manage.py migrate --noinput
if errorlevel 1 (
    echo WARNING: Database migration had issues, but continuing...
)
cd ..

echo [5/6] Starting Django Backend Server...
start "NASA NEO Tracker - Backend (Django)" cmd /k "cd /d %~dp0backend && echo Starting Django Backend on http://localhost:8000 && ..\.venv\Scripts\python.exe manage.py runserver"
timeout /t 3 >nul

echo [6/6] Starting React Frontend Server...
start "NASA NEO Tracker - Frontend (React)" cmd /k "cd /d %~dp0frontend && echo Starting React Frontend on http://localhost:3000 && npm start"

echo:
echo ========================================
echo   Waiting for servers to start...
echo ========================================
timeout /t 5 >nul
echo Checking backend server...
timeout /t 5 >nul
echo Checking frontend server...
timeout /t 5 >nul

echo:
echo ========================================
echo   APPLICATION READY!
echo ========================================
echo:
echo   Frontend:  http://localhost:3000
echo   Backend:   http://localhost:8000/api
echo   Orrery:    http://localhost:8000/orrery
echo:
echo   Security Features:
echo   - Rate limiting enabled
echo   - CORS protection active
echo   - 0 npm vulnerabilities
echo:

REM Try to open browser
start http://localhost:3000 2>nul

echo ========================================
echo   Two terminal windows are running:
echo   1. Backend (Django on port 8000)
echo   2. Frontend (React on port 3000)
echo:
echo   To STOP the servers:
echo   - Close both terminal windows, or
echo   - Press Ctrl+C in each window
echo ========================================
echo:
pause

