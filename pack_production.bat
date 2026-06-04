@echo off
setlocal

echo ======================================================
echo   RESERVATION SYSTEM - PRODUCTION PACKAGER (ZIP)
echo ======================================================

:: 1. Copy built Angular files to Server/wwwroot
echo [*] Copying frontend files to Server/wwwroot...
if exist "Server\wwwroot" rd /s /q "Server\wwwroot"
mkdir "Server\wwwroot"

if exist "App\dist\reservation-system-app\browser" (
    xcopy /s /e /y "App\dist\reservation-system-app\browser\*.*" "Server\wwwroot\"
) else (
    xcopy /s /e /y "App\dist\reservation-system-app\*.*" "Server\wwwroot\"
)

:: 2. Publish .NET API
echo [*] Publishing Backend (.NET)...
cd Server
dotnet publish -c Release -o ..\Publish
cd ..

:: 3. Zip Publish folder to backend.zip
echo [*] Zipping Publish folder contents to backend.zip...
if exist "backend.zip" del /f /q "backend.zip"
powershell -Command "Compress-Archive -Path Publish\* -DestinationPath backend.zip -Force"

echo.
echo ======================================================
echo   PACKAGING SUCCESSFUL!
echo   Your ready-to-upload file: backend.zip
echo ======================================================
pause
