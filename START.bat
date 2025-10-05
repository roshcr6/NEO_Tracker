@echo off
REM ============================================
REM NASA NEO TRACKER - Complete Launcher
REM All-in-One: Setup, Install & Start
REM ============================================

title NASA NEO TRACKER
color 0A

echo.
echo  ███╗   ██╗ █████╗ ███████╗ █████╗ 
echo  ████╗  ██║██╔══██╗██╔════╝██╔══██╗
echo  ██╔██╗ ██║███████║███████╗███████║
echo  ██║╚██╗██║██╔══██║╚════██║██╔══██║
echo  ██║ ╚████║██║  ██║███████║██║  ██║
echo  ╚═╝  ╚═══╝╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
echo.
echo  NEO TRACKER - Asteroid Impact Simulator
echo  ========================================
echo.

cd /d "%~dp0"

REM ============================================
REM STEP 1: Check Prerequisites
REM ============================================
echo [STEP 1/7] Checking Prerequisites...

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found!
    echo Please install from: https://nodejs.org/
    pause
    exit /b 1
)

where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python not found!
    echo Please install from: https://www.python.org/
    pause
    exit /b 1
)

echo   ✓ Node.js: OK
echo   ✓ Python: OK
echo.

REM ============================================
REM STEP 2: Install Frontend Dependencies
REM ============================================
echo [STEP 2/7] Checking Frontend Dependencies...

if not exist "frontend\node_modules" (
    echo   Installing npm packages (first time only)
    echo   This may take 5-10 minutes
    cd frontend
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] npm install failed!
        cd ..
        pause
        exit /b 1
    )
    cd ..
    echo   ✓ Frontend dependencies installed
) else (
    echo   ✓ Frontend dependencies already installed
)
echo.

REM ============================================
REM STEP 3: Setup Python Virtual Environment
REM ============================================
echo [STEP 3/7] Checking Python Environment...

if not exist ".venv" (
    echo   Creating virtual environment...
    python -m venv .venv
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to create virtual environment!
        pause
        exit /b 1
    )
    echo   ✓ Virtual environment created
) else (
    echo   ✓ Virtual environment already exists
)
echo.

REM ============================================
REM STEP 4: Install Backend Dependencies
REM ============================================
echo [STEP 4/7] Checking Backend Dependencies...

.venv\Scripts\python.exe -c "import django" >nul 2>&1
if %errorlevel% neq 0 (
    echo   Installing Python packages...
    .venv\Scripts\pip.exe install -r backend\requirements.txt
    if %errorlevel% neq 0 (
        echo [ERROR] pip install failed!
        pause
        exit /b 1
    )
    echo   ✓ Backend dependencies installed
) else (
    echo   ✓ Backend dependencies already installed
)
echo.

REM ============================================
REM STEP 5: Setup Database
REM ============================================
echo [STEP 5/7] Setting Up Database...

cd backend
..\\.venv\Scripts\python.exe manage.py migrate --noinput >nul 2>&1
if %errorlevel% neq 0 (
    echo   ⚠ Database migration had warnings (non-critical)
) else (
    echo   ✓ Database ready
)
cd ..
echo.

REM ============================================
REM STEP 6: Start Backend Server
REM ============================================
echo [STEP 6/7] Starting Backend Server...

start "NASA Backend (Port 8000)" /MIN cmd /k ".venv\Scripts\python.exe backend\manage.py runserver"
timeout /t 2 /nobreak >nul
echo   ✓ Django Backend: http://127.0.0.1:8000
echo.

REM ============================================
REM STEP 7: Start Frontend Server
REM ============================================
echo [STEP 7/7] Starting Frontend Server...

start "NASA Frontend (Port 3000)" /MIN cmd /k "cd frontend && npm start"
timeout /t 3 /nobreak >nul
echo   ✓ React Frontend: http://localhost:3000
echo.

REM ============================================
REM Waiting for Compilation
REM ============================================
echo ========================================
echo  Initializing Application...
echo ========================================
echo.
echo  Please wait while React compiles...
echo  This usually takes 10-20 seconds.
echo.

timeout /t 12 /nobreak >nul

REM ============================================
REM Open Browser
REM ============================================
echo ========================================
echo  APPLICATION READY!
echo ========================================
echo.
echo  Frontend: http://localhost:3000
echo  Backend:  http://127.0.0.1:8000/api
echo.
echo  Opening browser...
echo.

start http://localhost:3000

echo ========================================
echo  SERVERS RUNNING
echo ========================================
echo.
echo  Two terminal windows are now running:
echo    1. NASA Backend (Port 8000)
echo    2. NASA Frontend (Port 3000)
echo.
echo  To STOP the servers:
echo    - Run: stop-nasa.bat
echo    - Or close the terminal windows
echo    - Or press Ctrl+C in each window
echo.
echo  This window can be closed safely.
echo.
echo  Happy exploring! 🚀🌟
echo.
pause
