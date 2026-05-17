@echo off
setlocal

:: --- Configuration ---
set "PROJECT_ROOT=%~dp0"
set "APP_DIR=%PROJECT_ROOT%App"
set "SERVER_DIR=%PROJECT_ROOT%Server"
set "PUBLISH_DIR=%PROJECT_ROOT%Publish"

echo ======================================================
echo   RESERVATION SYSTEM - LOCAL DESKTOP BUILDER
echo ======================================================

:: 1. Build Angular
echo [*] Building Frontend (Angular 19)...
cd /d "%APP_DIR%"
call npm install --legacy-peer-deps
if %ERRORLEVEL% neq 0 (
    echo [!] NPM install failed!
    pause
    exit /b %ERRORLEVEL%
)
call npx ng build --configuration production
if %ERRORLEVEL% neq 0 (
    echo [!] Angular build failed!
    pause
    exit /b %ERRORLEVEL%
)

:: 2. Clean/Prepare Server wwwroot
echo [*] Preparing Server wwwroot...
if exist "%SERVER_DIR%\wwwroot" rd /s /q "%SERVER_DIR%\wwwroot"
mkdir "%SERVER_DIR%\wwwroot"

:: 3. Copy Angular build to Server wwwroot
:: Note: Angular 19 might output to dist/reservation-system-app/browser
echo [*] Copying frontend to server...
if exist "%APP_DIR%\dist\reservation-system-app\browser" (
    xcopy /s /e /y "%APP_DIR%\dist\reservation-system-app\browser\*.*" "%SERVER_DIR%\wwwroot\"
) else (
    xcopy /s /e /y "%APP_DIR%\dist\reservation-system-app\*.*" "%SERVER_DIR%\wwwroot\"
)

:: 4. Publish .NET App
echo [*] Publishing Backend (.NET 8/10)...
cd /d "%SERVER_DIR%"
dotnet publish -c Release -o "%PUBLISH_DIR%"
if %ERRORLEVEL% neq 0 (
    echo [!] .NET publish failed!
    pause
    exit /b %ERRORLEVEL%
)

:: 5. Copy launcher to Publish folder
echo [*] Copying launcher to Publish folder...
copy /y "%PROJECT_ROOT%start_app.bat" "%PUBLISH_DIR%\"

echo.
echo ======================================================
echo   BUILD SUCCESSFUL!
echo   Location: %PUBLISH_DIR%
echo   Run 'start_app.bat' to launch.
echo ======================================================
pause
