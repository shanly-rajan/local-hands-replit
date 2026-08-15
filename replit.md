# NeighbourWorks — Community Services Marketplace

A two-sided marketplace connecting residents with trusted local service providers across South Africa (ZAR), the United States (USD), and India (INR).

## Overview
- **Frontend**: React + Vite at `artifacts/community-marketplace` (wouter routes: /, /providers, /providers/:id, /jobs, /jobs/new, /jobs/:id, /saved, /ads). Design: "Saffron & Indigo" — Outfit + DM Sans typography.
- **Backend**: Shared Express api-server at `artifacts/api-server` (`/api` base). Routes: meta, home, providers, reviews, jobs, interests, select, status, ads, favorites.
- **DB**: PostgreSQL + Drizzle, schema in `lib/db/src/schema/` (geo, categories, providers, jobs, ads).
- **API contract**: `lib/api-spec/openapi.yaml` → Orval codegen (zod + react-query hooks).
- **Seed data**: `scripts/src/seed-marketplace.ts` (idempotent; 38 providers, ~195 reviews, 27 jobs, 22 interests, 7 ads across 3 countries).

## Key domain logic
- **Community Value Score (0-100)**: weighted rating composite (quality 30%, overall 25%, price 20%, reliability 15%, professionalism 10%) shrunk toward neutral with confidence n/(n+4). Computed server-side in `artifacts/api-server/src/lib/marketplace.ts`.
- **Job lifecycle**: open → providers_interested → provider_selected → in_progress → completed → reviewed (plus cancelled/expired/disputed). Transitions enforced in `routes/jobs.ts`.
- **No auth yet**: demo mode — jobs created via UI get `isMine: true`; favorites are global. Auth is a planned follow-up.
- Currency always rendered per-item via `currencySymbol` from the item's country.

## User preferences
(none recorded yet)
