#!/usr/bin/env bash
set -euo pipefail

echo "=== Wager Tracker Install ==="
echo ""

# Check prereqs
command -v node >/dev/null 2>&1 || { echo "Error: Node.js 22+ required. Install from https://nodejs.org"; exit 1; }
NODE_VER=$(node -v | cut -d. -f1 | tr -d v)
if [ "$NODE_VER" -lt 22 ]; then
  echo "Error: Node.js 22+ required (found $(node -v))"
  exit 1
fi

command -v npm >/dev/null 2>&1 || { echo "Error: npm required"; exit 1; }

echo "[1/4] Installing dependencies..."
npm ci --silent

echo "[2/4] Generating Prisma client..."
npx prisma generate --no-hints 2>/dev/null

echo "[3/4] Setting up database..."
npx prisma migrate dev --name init --skip-seed 2>/dev/null || npx prisma migrate deploy 2>/dev/null

echo "[4/4] Building production bundle..."
npm run build

echo ""
echo "=== Install complete ==="
echo ""
echo "Start development server:  npm run dev"
echo "Start production server:   npm start"
echo "Open browser:              http://localhost:4317"
echo ""
echo "Need demo data? Run:       npm run seed"
