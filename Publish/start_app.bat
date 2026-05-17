@echo off
setlocal
title Reservation System - Local App

:: --- Configuration ---
set "EXE_NAME=ReservationSystem_backend.exe"
set "PORT=5265"

echo ======================================================
echo   RESERVATION SYSTEM - STARTING...
echo ======================================================

:: Check if the executable exists
if not exist "%EXE_NAME%" (
    echo [!] Error: %EXE_NAME% not found in this folder.
    echo Please run 'build_desktop.bat' first.
    pause
    exit /b 1
)

:: Start the application in the background
echo [*] Launching Application Server...
start "" /B "%EXE_NAME%" --urls "http://localhost:%PORT%"

:: Wait a few seconds for the server to start
echo [*] Waiting for server initialization...
timeout /t 5 /nobreak > nul

:: Open the browser to the application
echo [*] Opening User Interface...
explorer "http://localhost:%PORT%"

echo.
echo [OK] Application is running! 
echo Keep this window open while using the app.
echo To close, press CTRL+C or close this window.
echo ======================================================
:: Keep the window alive to prevent the server from dying immediately if it's tied to the shell
pause > nul
