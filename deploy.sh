#!/bin/bash
# ==============================================================================
# Automated Deploy Script: Local Mac -> GitHub -> Remote VPS Server
# ==============================================================================

SERVER_IP="2.24.115.165"
SERVER_USER="root"
SERVER_PATH="/root/ReservationSystem"

COMMIT_MSG="${1:-Update project changes}"

echo "🚀 [1/3] Committing and pushing local changes to GitHub..."
git add .
git commit -m "$COMMIT_MSG" || true
git push origin main

echo "🌐 [2/3] Connecting to VPS ($SERVER_IP) and updating containers..."
ssh "$SERVER_USER@$SERVER_IP" << EOF
  cd $SERVER_PATH
  echo "📥 Pulling latest changes from GitHub..."
  git pull origin main
  
  echo "🐳 Rebuilding and starting Docker containers on Port 80..."
  PORT=80 docker-compose up -d --build
  
  echo "✅ Server update completed successfully!"
EOF

echo "🎉 [3/3] Deployment finished! Your live app is available at: http://$SERVER_IP"
