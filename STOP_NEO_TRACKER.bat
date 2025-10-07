@echo off
REM ============================================
REM NASA NEO TRACKER - Stop All Servers
REM Stops Backend (Django) + Frontend (React)
REM ============================================

title NASA NEO TRACKER - Stop Servers
color 0C

echo.
echo  ========================================
echo   NASA NEO TRACKER - Stop Servers
echo  ========================================
echo.

REM ============================================
REM Stop Node.js processes (React Frontend)
REM ============================================
echo [1/2] Stopping React Frontend (Port 3000)...
taskkill /F /IM node.exe >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✓ Frontend stopped
) else (
    echo   ℹ No frontend process found
)
echo.

REM ============================================
REM Stop Python processes (Django Backend)
REM ============================================
echo [2/2] Stopping Django Backend (Port 8000)...
for /f "tokens=5" %%a in ('netstat -aon ^| find ":8000" ^| find "LISTENING"') do (
    taskkill /F /PID %%a >nul 2>&1
    echo   ✓ Backend stopped (PID: %%a)
)

REM Double-check by closing any remaining Python processes
taskkill /F /IM python.exe >nul 2>&1

echo.
echo ========================================
echo   ALL SERVERS STOPPED
echo ========================================
echo.
echo   Both frontend and backend have been
echo   shut down successfully.
echo.
echo   To restart, run: START_NEO_TRACKER.bat
echo.
pause
