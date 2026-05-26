#!/usr/bin/env bash
set -euo pipefail

echo "=== Wager Tracker Deploy ==="
echo ""
echo "Options:"
echo "  1) Docker Compose (local/self-host)"
echo "  2) Railway"
echo "  3) Render"
echo "  4) Vercel"
echo ""
read -rp "Choose deploy target [1-4]: " TARGET

case "$TARGET" in
  1)
    echo ""
    echo "=== Docker Compose Self-Host ==="
    echo ""
    echo "Prerequisites: Docker + docker-compose"
    echo ""
    echo "Steps:"
    echo "  docker-compose build"
    echo "  docker-compose up -d"
    echo ""
    echo "App runs at http://localhost:4317"
    echo ""
    echo "Set these env vars in docker-compose.yml or .env:"
    echo "  DATABASE_URL=\"file:./prisma/data/wagers.db\""
    echo "  JWT_SECRET=<generate: openssl rand -base64 32>"
    echo "  NODE_ENV=production"
    echo "  ALLOWED_ORIGINS=\"https://yourdomain.com\""
    ;;
  2)
    echo ""
    echo "=== Railway Deploy ==="
    echo ""
    echo "1. Push code to GitHub"
    echo "2. Create Railway service -> connect repo"
    echo "3. Build command:  npm run build"
    echo "4. Start command:  npx prisma migrate deploy && npm start"
    echo "5. Add env vars:  DATABASE_URL, JWT_SECRET, NODE_ENV=production"
    echo "6. Deploy"
    ;;
  3)
    echo ""
    echo "=== Render Deploy ==="
    echo ""
    echo "1. Push code to GitHub"
    echo "2. Create Web Service -> connect repo"
    echo "3. Runtime: Node"
    echo "4. Build command: npm ci && npm run build"
    echo "5. Start command: npx prisma migrate deploy && npm start"
    echo "6. Add env vars:  DATABASE_URL, JWT_SECRET, NODE_ENV=production"
    ;;
  4)
    echo ""
    echo "=== Vercel Deploy ==="
    echo ""
    echo "Note: Uses adapter-auto. SQLite file DB won't persist on Vercel."
    echo "Use external DB (Postgres/Dolt) for production."
    echo ""
    echo "1. npx vercel init wager"
    echo "2. Set env vars in Vercel dashboard"
    echo "3. git push -> Vercel auto-deploys"
    ;;
  *)
    echo "Invalid option"
    exit 1
    ;;
esac
