#!/bin/bash

# --- Configuration ---
PROJECT_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$PROJECT_ROOT/App"
SERVER_DIR="$PROJECT_ROOT/Server"
PUBLISH_DIR="$PROJECT_ROOT/Publish"

# Default configuration to development for local running, but allow overriding
CONFIG=${1:-development}

echo "======================================================"
echo "  RESERVATION SYSTEM - LOCAL DESKTOP BUILDER (MAC)"
echo "  Configuration: $CONFIG"
echo "======================================================"

# 1. Build Angular
echo "[*] Building Frontend (Angular 19)..."
cd "$APP_DIR" || exit 1
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "[!] NPM install failed!"
    exit 1
fi

npx ng build --configuration "$CONFIG"
if [ $? -ne 0 ]; then
    echo "[!] Angular build failed!"
    exit 1
fi

# 2. Clean/Prepare Server wwwroot
echo "[*] Preparing Server wwwroot..."
rm -rf "$SERVER_DIR/wwwroot"
mkdir -p "$SERVER_DIR/wwwroot"

# 3. Copy Angular build to Server wwwroot
echo "[*] Copying frontend to server..."
if [ -d "$APP_DIR/dist/reservation-system-app/browser" ]; then
    cp -R "$APP_DIR/dist/reservation-system-app/browser/"* "$SERVER_DIR/wwwroot/"
else
    cp -R "$APP_DIR/dist/reservation-system-app/"* "$SERVER_DIR/wwwroot/"
fi

# 4. Success message
echo ""
echo "======================================================"
echo "  BUILD SUCCESSFUL!"
echo "  Frontend copied to Server/wwwroot."
echo "  You can now run: dotnet run --project Server"
echo "======================================================"
