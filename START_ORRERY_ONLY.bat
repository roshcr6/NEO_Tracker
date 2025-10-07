@echo off
REM ============================================
REM NASA LIVE ORRERY - Backend Only Launcher
REM Starts Django Backend with NASA Orrery
REM ============================================

title NASA Live Orrery Launcher
color 0E

echo.
echo  ========================================
echo   NASA LIVE ORRERY - Quick Start
echo  ========================================
echo.
echo   Starting Backend with Orrery...
echo.

cd /d "%~dp0"

REM ============================================
REM Check if Python exists
REM ============================================
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python not found!
    echo Please install Python 3.11+ from: https://www.python.org/
    pause
    exit /b 1
)

REM ============================================
REM Check if virtual environment exists
REM ============================================
if not exist ".venv\Scripts\python.exe" (
    echo [WARNING] Virtual environment not found!
    echo Creating virtual environment...
    python -m venv .venv
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create virtual environment!
        pause
        exit /b 1
    )
    echo Installing backend dependencies...
    .venv\Scripts\pip.exe install -r backend\requirements.txt
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies!
        pause
        exit /b 1
    )
)

REM ============================================
REM Run database migrations
REM ============================================
echo [1/2] Setting up database...
cd backend
..\\.venv\Scripts\python.exe manage.py migrate --noinput >nul 2>&1
cd ..
echo   ✓ Database ready
echo.

REM ============================================
REM Start Backend Server (Port 8000)
REM ============================================
echo [2/2] Starting Django Backend (Port 8000)...
start "NASA Orrery Backend (Port 8000)" cmd /k "cd /d "%~dp0backend" && ..\\.venv\Scripts\python.exe manage.py runserver"
timeout /t 3 /nobreak >nul
echo   ✓ Backend running
echo.

REM ============================================
REM Wait for server to initialize
REM ============================================
echo Waiting for server to start...
timeout /t 5 /nobreak >nul

REM ============================================
REM Open browser to Orrery
REM ============================================
echo ========================================
echo   NASA LIVE ORRERY READY!
echo ========================================
echo.
echo   Orrery:    http://localhost:8000/orrery/
echo   Backend:   http://localhost:8000/api/
echo   Admin:     http://localhost:8000/admin/
echo.
echo   Opening NASA Live Orrery...
echo.

start http://localhost:8000/orrery/

echo ========================================
echo   SERVER IS RUNNING
echo ========================================
echo.
echo   Backend terminal window opened.
echo.
echo   To STOP the server:
echo   • Close the backend terminal window
echo   • Or press Ctrl+C in that window
echo   • Or run: STOP_NEO_TRACKER.bat
echo.
echo   This window can be closed safely.
echo.
echo   Enjoy the Solar System! 🌍🪐☄️
echo.
pause
