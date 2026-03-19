# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Assembly Profile Manager — a Next.js 14 (App Router) application that lets clients view and edit their profile fields through an Assembly (formerly Copilot) portal. Built with TypeScript, MUI v5, Prisma ORM, and deployed on Vercel with PostgreSQL.

## Commands

```bash
yarn dev              # Start dev server at localhost:3000
yarn build            # Production build
yarn lint:check       # ESLint check on src/ and test/
yarn lint:fix         # ESLint with auto-fix
yarn prettier:check   # Prettier format check
yarn prettier:fix     # Prettier auto-format
```

After changing `prisma/schema.prisma`:
```bash
npx prisma generate   # Regenerate Prisma client (also runs on postinstall)
npx prisma db push    # Push schema changes to database
```

No test suite is configured.

## Architecture

### Data Flow

1. **Portal embeds this app** with a token query parameter (JWT from Copilot/Assembly)
2. **Server component** (`app/page.tsx`) validates the token via `CopilotAPI`, fetches client/company/workspace data, and passes it to client components
3. **Client components** use `AppContext` (React Context) for UI state and `SWR` for client-side data fetching from internal API routes
4. **API routes** (`app/api/`) act as a backend: they call Copilot SDK for external data and Prisma for local DB (settings, field access permissions, profile update history)

### Key Layers

- **`src/utils/copilotApiUtils.ts`** — `CopilotAPI` class wrapping `copilot-node-sdk`. All Copilot API interactions go through this.
- **`src/context/index.tsx`** — `AppContext` holds global state: sidebar visibility, search, custom field access (read-only + mutable copies), settings, token, workspace.
- **`src/lib/db.ts`** — Prisma singleton pattern for serverless.
- **`src/types/common.ts`** — Core types with Zod schemas for API response validation.

### Database (Prisma + PostgreSQL)

Three models in `prisma/schema.prisma`:
- `CustomFieldAccess` — per-portal field-level VIEW/EDIT permissions
- `ClientProfileUpdates` — audit log of profile changes (stores full custom fields + changed fields as JSONB)
- `Setting` — per-portal JSON configuration

Uses `relationMode = "prisma"` for serverless compatibility. Connection string uses `POSTGRES_PRISMA_URL_HIGHER_CONNECTION_LIMIT`.

### Mutable/Immutable State Pattern

Settings and custom field access are stored as two copies in context: a read-only version (for diffing/reset) and a mutable version (for in-progress edits). See `customFieldAccess` vs `mutableCustomFieldAccess` and `settings` vs `mutableSettings` in AppContext.

## Code Conventions

- **Path alias**: `@/*` maps to `./src/*`
- **Prettier**: single quotes, trailing commas, 125 char line width
- **ESLint**: extends `next/core-web-vitals`, `react-hooks/exhaustive-deps` is disabled
- **Pre-commit hooks**: Husky runs `lint:fix` and `prettier:fix` on staged `.ts`/`.tsx` files
- **Styling**: MUI `sx` prop and `@emotion/styled` — no CSS modules or Tailwind
- **Branding**: "Assembly" (not "Copilot") in user-facing text; SDK references still use `copilot-node-sdk`

## Environment Setup

Copy `.env.example` to `.env.local`. Required variables:
- `COPILOT_API_KEY` — from the Assembly/Copilot dashboard
- `COPILOT_ENV` — `local` for test tokens, `production` for real tokens
- `POSTGRES_PRISMA_URL` and related DB vars — PostgreSQL connection strings
- `VERCEL_URL` / `VERCEL_ENV` — set to `localhost:3000` / `development` locally
