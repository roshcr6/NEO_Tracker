@echo off
title NASA NEO TRACKER - Stop Servers
color 0C

echo:
echo ========================================
echo   NASA NEO TRACKER - Stop Servers
echo ========================================
echo:

cd /d %~dp0

echo Stopping all Python processes (Django)...
taskkill /F /IM python.exe 2>nul
if errorlevel 1 (
    echo No Python processes found.
) else (
    echo Django backend stopped.
)

echo:
echo Stopping all Node processes (React)...
taskkill /F /IM node.exe 2>nul
if errorlevel 1 (
    echo No Node processes found.
) else (
    echo React frontend stopped.
)

echo:
echo ========================================
echo   All servers stopped!
echo ========================================
echo:
pause
