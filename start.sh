#!/bin/bash

# Kill any existing instances
pkill -f "node server.js" 2>/dev/null
pkill -f "vite" 2>/dev/null
sleep 1

# Get local IP
IP=$(ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "unknown")

# Start backend
node server.js &

# Start frontend
cd "$(dirname "$0")/client"
npm run dev > /tmp/vite.log 2>&1 &
sleep 3

# Get actual port vite chose (in case 5173 was taken)
PORT=$(grep -o 'http://localhost:[0-9]*' /tmp/vite.log | head -1 | grep -o '[0-9]*$')
PORT=${PORT:-5173}

echo ""
echo "========================================"
echo "  🎨 Themed Hue's is running!"
echo "========================================"
echo ""
echo "  On this computer:  http://localhost:$PORT"
echo "  On your phone:     http://$IP:$PORT"
echo ""
echo "  Share the phone URL with everyone"
echo "  on the same Wi-Fi to play together."
echo ""
echo "  Press Ctrl+C to stop."
echo "========================================"

wait
