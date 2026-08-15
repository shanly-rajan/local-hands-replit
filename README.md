# Local Hands

> Trusted local services, recommended by your community.

Local Hands is a two-sided community services marketplace connecting residents who need help with verified local service providers — plumbers, tutors, cleaners, electricians, and more. Residents post jobs; providers express interest; the community builds trust through ratings and reviews.

Supports **South Africa (ZAR)**, **USA (USD)**, and **India (INR)** with location filtering scoped to country → city → community.

---

## Live Preview

[https://6afaccb3-4b3d-45f8-8ecc-2b0e1a797a17-00-2fa4u1u298xv2.kirk.replit.dev](https://6afaccb3-4b3d-45f8-8ecc-2b0e1a797a17-00-2fa4u1u298xv2.kirk.replit.dev)

---

## Features

### For Residents
- **Browse providers** — search, filter by category, sort by rating / value score / newest, verified-only toggle
- **Post a job** — describe what you need, set a budget (fixed, range, or open), pick urgency
- **Hire a provider** — review expressions of interest and select the right person
- **Save favourites** — bookmark providers for quick access later

### For Providers
- **Public profile** — business name, tagline, categories, star rating, review count, value score
- **Contact details** — phone and email visible to anyone (verified providers only)
- **Express interest** — respond to open jobs with an estimate

### For the Community
- **Home dashboard** — location-scoped stats, featured providers, recent jobs, community ads
- **Community Sponsors** — local businesses advertised with full-bleed photography cards
- **Location selector** — country / city / suburb picker in the nav bar (desktop and mobile)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Vite + TypeScript |
| Styling | Tailwind CSS + shadcn/ui (Radix UI) |
| API | Express + TypeScript |
| Database | PostgreSQL + Drizzle ORM |
| API contract | OpenAPI 3.1 → Orval → Zod schemas + React Query hooks |
| Monorepo | pnpm workspaces |

---

## Architecture

```
artifacts/
  community-marketplace/   # React + Vite frontend (port $PORT, path /)
  api-server/              # Express API (port 8080, prefix /api)

lib/
  db/                      # Drizzle schema, migrations, seed data
  api-spec/                # openapi.yaml + Orval codegen script
  api-client-react/        # Generated Zod types + React Query hooks
```

The OpenAPI YAML is the single source of truth. Running `pnpm codegen` in `lib/api-spec` regenerates all Zod schemas and React Query hooks from the spec — keeping the frontend and backend in sync automatically.

---

## Getting Started

### Prerequisites
- Node.js 20+
- pnpm 9+
- PostgreSQL (provided automatically on Replit)

### Install dependencies

```bash
pnpm install
```

### Environment variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `SESSION_SECRET` | Secret for session signing |

On Replit these are managed as Secrets and injected automatically.

### Run the database migrations and seed

```bash
pnpm --filter @workspace/db run migrate
pnpm --filter @workspace/db run seed
```

### Start development servers

Both servers start automatically via Replit Workflows. To start them manually:

```bash
# API server
pnpm --filter @workspace/api-server run dev

# Frontend
pnpm --filter @workspace/community-marketplace run dev
```

### Regenerate API client (after editing openapi.yaml)

```bash
pnpm --filter @workspace/api-spec run codegen
```

> **Note:** After codegen, restart the `community-marketplace: web` workflow to clear Vite's HMR cache.

---

## Project Structure

```
artifacts/
  api-server/
    src/
      routes/          # Express route handlers
        home.ts        # Home summary (location-scoped)
        providers.ts   # Provider list + detail
        jobs.ts        # Job CRUD + interest + hire
        meta.ts        # Countries / cities / categories
        ads.ts         # Advertisements
        favorites.ts   # Saved providers
  community-marketplace/
    src/
      pages/
        home.tsx
        providers/     # List + [id] detail
        jobs/          # List + [id] detail + new
        saved.tsx
        ads.tsx
      components/
        layout/        # Navbar, Footer, BottomNav, Layout
        ui/            # shadcn/ui primitives
      context/
        LocationContext.tsx   # Country / city / community state

lib/
  db/src/
    schema/            # Drizzle table definitions
    seed.ts            # Demo data (30 providers, 29 jobs, 7 ads)
  api-spec/
    openapi.yaml       # API contract
    orval.config.ts    # Codegen configuration
  api-client-react/    # Generated — do not edit directly
```

---

## Known Quirks

- **Orval + Zod v4** — Orval generates `from 'zod'` imports; the codegen script includes a `sed` step to rewrite them to `from 'zod/v4'`. Do not remove it.
- **Orval `allOf` intersection** — Zod's `.and()` strips unknown keys during `.parse()`. Provider detail routes return the raw payload directly rather than parsing through the generated schema to avoid silently dropping fields.
- **HMR after codegen** — Vite's file watcher sees codegen's delete-and-rewrite as a module removal and can enter a broken state. Restart the frontend workflow after every codegen run.

---

## Seed Data

The database is pre-seeded with realistic demo data:

| Entity | Count |
|---|---|
| Countries | 3 (South Africa, USA, India) |
| Cities | 9 |
| Communities / Suburbs | 27 |
| Service categories | 25 |
| Providers | 30 (mix of verified and pending) |
| Jobs | 29 |
| Advertisements | 7 |

---

## Roadmap

- [ ] User authentication (residents and providers own their data)
- [ ] Provider self-registration and onboarding flow
- [ ] Review submission by authenticated users
- [ ] Native mobile app (Expo)
- [ ] Payment / booking integration

---

## License

MIT
