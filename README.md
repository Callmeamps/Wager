<picture>
  <source media="(prefers-color-scheme: dark)" srcset="https://img.shields.io/badge/Wager-4f46e5?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iMTIgMiAyIDcgMTIgMTIgMjIgNyAxMiAyIi8+PHBvbHlsaW5lIHBvaW50cz0iMiA3IDIgMTIgMTIgMTcgMjIgMTIgMjIgNyIvPjxwb2x5bGluZSBwb2ludHM9IjIgMTIgMiAxNyAxMiAyMiAyMiAxNyAyMiAxMiIvPjwvc3ZnPg=="/>
  <img src="https://img.shields.io/badge/Wager-4f46e5?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBvbHlsaW5lIHBvaW50cz0iMTIgMiAyIDcgMTIgMTIgMjIgNyAxMiAyIi8+PHBvbHlsaW5lIHBvaW50cz0iMiA3IDIgMTIgMTIgMTcgMjIgMTIgMjIgNyIvPjxwb2x5bGluZSBwb2ludHM9IjIgMTIgMiAxNyAxMiAyMiAyMiAxNyAyMiAxMiIvPjwvc3ZnPg==" alt="Wager"/>
</picture>

# Wager — Track dares, bets & challenges with friends

**Make a bet. Prove it. Let your friends decide.**

Wager is a social accountability app for dares, bets, and challenges. Create a wager with friends, submit proof when it's done, and let the group vote to settle it. Built for runners, gym buddies, pizza-baking rivals, and anyone who turns life into a game.

---

## 🚀 Quick Start

```bash
# One-command install
bash scripts/install.sh

# Or step by step
npm ci
npx prisma generate
npx prisma migrate dev --name init
npm run build
npm start
```

Open **http://localhost:4317** in your browser.

### Seeding demo data

```bash
npm run seed
# Login: alice@example.com / password123
```

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🎯 **Create wagers** | Title, description, stake, deadline, participants |
| 📸 **Submit proof** | Photo, video, Strava link — anything with a URL |
| 🗳️ **Vote on outcomes** | Friends vote valid/invalid. Auto-resolves when all votes in |
| 🔐 **User accounts** | Register/login with email + password. JWT cookie sessions |
| 📱 **Responsive UI** | Mobile-first design with Tailwind CSS |
| 🗄️ **Versioned data** | Built-in audit trail via Dolt (MySQL-compatible, dev only) |
| 🔒 **Security** | Rate limiting, CORS, CSP headers, bcrypt passwords |
| 🐳 **Docker ready** | Dockerfile + docker-compose for self-hosting |

---

## 🏗️ Tech Stack

```
Frontend:  SvelteKit 5 + Tailwind CSS 3
Backend:   SvelteKit API routes
Database:  SQLite (local) / Dolt MySQL (optional)
Auth:      JWT cookies + bcrypt
ORM:       Prisma 5
```

---

## 📖 Documentation

| Guide | Description |
|-------|-------------|
| [📋 Quick Start Guide](./docs/quickstart.html) | Get running in 5 minutes |
| [🏠 Self-Hosting Guide](./docs/self-hosting.html) | Docker, Railway, Vercel deploy |
| [🔧 API Reference](./docs/api.html) | All REST endpoints |
| [🏛️ Architecture](./docs/architecture.html) | System design & data model |
| [🤝 Contributing](./docs/contributing.html) | How to contribute |
| [📐 Development Guide](./docs/development.html) | Setup, coding standards, testing |
| [📝 PRD](./docs/prd.html) | Original product requirements |
| [📣 Marketing](./docs/marketing.html) | Story Brand soundbites, messaging |

---

## 🐳 Docker

```bash
docker-compose build
docker-compose up -d
# Open http://localhost:4317
```

## 🚂 Deployment

- **Railway**: Connect GitHub repo → set build command `npm run build` → start command `npx prisma migrate deploy && npm start` → add env vars
- **Render**: Same pattern as Railway
- **Vercel**: Use external DB (Dolt/Supabase). SQLite won't persist.

See [self-hosting guide](./docs/self-hosting.html) for details.

---

## 📄 License

MIT © 2025 Wager Contributors

---

*Built with friends, for friends. Loser buys dinner.* 🥩
