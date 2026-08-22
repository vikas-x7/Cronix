# AGENTS.md

Guide for AI coding agents working on this repository.

## Project Overview

Cronix is a self-hosted cron job scheduling and monitoring platform. Turborepo monorepo with Next.js frontend and NestJS backend.

## Repository Structure

```
cronix/
├── apps/
│   ├── web/           # Next.js 16 frontend (App Router)
│   └── server/        # NestJS 11 backend
├── packages/
│   └── database/      # Prisma schema and migrations
├── .github/           # GitHub templates and workflows
└── turbo.json         # Turborepo config
```

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS 4, Zustand, TanStack Query
- **Backend**: NestJS 11, Prisma 7, BullMQ, Redis, Passport.js
- **Database**: PostgreSQL 16
- **Package Manager**: pnpm (workspaces)
- **Language**: TypeScript 5 throughout

## Key Conventions

### File Naming

- Components: `kebab-case.tsx` (e.g., `job-detail.tsx`)
- Hooks: `use-*.ts` (e.g., `use-auth.ts`)
- Types: `*.types.ts` (e.g., `job.types.ts`)
- API files: `*.api.ts`

### Module Pattern (Frontend)

Each feature lives in `apps/web/src/modules/<feature>/`:

```
modules/
├── auth/
│   ├── components/
│   ├── hooks/
│   ├── api/
│   ├── store/
│   ├── types/
│   └── index.ts       # Barrel exports
├── jobs/
├── executions/
├── workspaces/
├── dashboard/
├── documentation/
└── settings/
```

Page files in `app/(dashboard)/` are thin wrappers that import from modules.

### Component Style

- Use `'use client'` directive for client components
- Tailwind only, no CSS modules or styled-components
- Dark theme: `bg-neutral-950`, `bg-[#0D0D0D]`, `bg-[#1F1F1F]`
- Accent color: `#DF5BCC`
- Font sizes: `text-[13px]` primary, `text-[12px]` labels, `text-[11px]` badges
- Rounded: `rounded-[3px]` buttons/inputs, `rounded-[5px]` cards/modals
- Negative letter-spacing: `tracking-[-0.5px]`, `tracking-[-1px]`

### API Pattern (Backend)

- Controllers in `apps/server/src/`
- Services handle business logic
- Guards for auth (`jwt-auth.guard.ts`)
- Use class-validator for DTOs

### Git Conventions

- Commit format: `feat:`, `fix:`, `docs:`, `refactor:`, `chore:`
- Branch naming: `feat/`, `fix/`, `chore/`

## Common Tasks

### Adding a new page

1. Create module in `src/modules/<name>/`
2. Add components, hooks, types as needed
3. Export from `index.ts`
4. Create thin `page.tsx` in `app/(dashboard)/<name>/`

### Adding an API endpoint

1. Create controller/service in `apps/server/src/`
2. Add Prisma schema changes if needed
3. Run `pnpm --filter database db:migrate`

### Running Development

```bash
pnpm dev          # Start all apps
pnpm build        # Build all
pnpm lint         # Lint all
```

## Environment Variables

- Frontend: `NEXT_PUBLIC_API_URL`
- Backend: See `apps/server/example.env`
- Database: See `packages/database/.env.example`

## Important Notes

- Never commit `.env` files
- Frontend and backend run on separate ports (3000 and 3001)
- Redis required for BullMQ job queues
- PostgreSQL required for Prisma ORM
