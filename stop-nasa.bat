@echo off
REM ============================================
REM NASA NEO TRACKER - Server Stopper
REM Stops all Node.js and Python servers
REM ============================================

echo.
echo ========================================
echo    NASA NEO TRACKER - Stopping...
echo ========================================
echo.

echo [1/2] Stopping Node.js (React Frontend)...
taskkill /F /IM node.exe /T >nul 2>&1
if %errorlevel% equ 0 (
    echo   - Frontend stopped successfully
) else (
    echo   - No Node.js processes found
)
echo.

echo [2/2] Stopping Python (Django Backend)...
taskkill /F /IM python.exe /T >nul 2>&1
if %errorlevel% equ 0 (
    echo   - Backend stopped successfully
) else (
    echo   - No Python processes found
)
echo.

echo ========================================
echo    ALL SERVERS STOPPED!
echo ========================================
echo.
pause
