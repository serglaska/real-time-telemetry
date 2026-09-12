#!/usr/bin/env bash
# Runs the mock MAVLink backend and the Vite frontend together, Ctrl+C stops both.
set -euo pipefail
cd "$(dirname "$0")/.."

BACKEND_DIR="backend"
FRONTEND_DIR="frontend"

if [ ! -d "$BACKEND_DIR/.venv" ]; then
  echo "==> Setting up backend virtualenv..."
  python3 -m venv "$BACKEND_DIR/.venv"
  "$BACKEND_DIR/.venv/bin/pip" install --quiet -r "$BACKEND_DIR/requirements.txt"
fi

if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
  echo "==> Installing frontend dependencies..."
  npm install --prefix "$FRONTEND_DIR"
fi

(cd "$BACKEND_DIR" && exec .venv/bin/python -m telemetry_mock) &
BACKEND_PID=$!

(cd "$FRONTEND_DIR" && exec npm run dev) &
FRONTEND_PID=$!

trap 'kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null' EXIT INT TERM

wait
