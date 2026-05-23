# Wager Tracker

Track dares, bets, and challenges with friends. Create wagers, submit proof, vote on outcomes.

## Quick Start

```bash
# install deps
npm ci

# start dev server (port 4317)
npm run dev

# create production build
npm run build
npm start
```

Open <http://localhost:4317> in browser.

## Tech Stack

- **Frontend**: SvelteKit, Tailwind CSS
- **Backend**: SvelteKit API routes
- **Database**: SQLite (dev) / Dolt (prod)
- **Auth**: Lucia (sessions) or JWT
- **ORM**: Prisma

## Features

- Create and manage wagers
- Submit proof (links, files)
- Vote system with thresholds
- Real-time updates (SSE)
- User accounts & profiles
- Audit trail (via Dolt)
- Mobile-responsive UI

## Docs

- [PRD](./docs/prd.html) — Full product requirements
- [Architecture](./docs/architecture.html) — System design
- [API Reference](./docs/api.html) — Endpoints
- [Development](./docs/development.html) — Contributing guide

## Project Status

MVP → v1.0 in progress. See issues for current tasks.

## License

MIT