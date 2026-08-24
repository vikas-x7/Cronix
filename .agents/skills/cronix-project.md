# Cronix Project Context

## Overview

Cronix is a self-hosted cron job scheduling and monitoring platform. It allows users to schedule HTTP requests via cron expressions or trigger them via webhooks.

## Architecture

- Turborepo monorepo with pnpm workspaces
- Frontend: Next.js 16 (App Router) in `apps/web`
- Backend: NestJS 11 in `apps/server`
- Database: PostgreSQL with Prisma 7 in `packages/database`
- Queue: BullMQ with Redis for job execution

## Key Patterns

### Frontend Module Structure

Every feature follows this structure:

```
src/modules/<feature>/
├── components/     # UI components
├── hooks/          # React hooks (use-*.ts)
├── api/            # API client functions (*.api.ts)
├── store/          # Zustand stores
├── types/          # TypeScript types (*.types.ts)
└── index.ts        # Barrel exports
```

Page files in `app/(dashboard)/` are thin wrappers.

### Styling Rules

- Tailwind CSS only, no CSS modules
- Dark theme with neutral-950 backgrounds
- Accent color: #DF5BCC
- Small dense UI: text-[13px], text-[12px], text-[11px]
- Negative letter-spacing: tracking-[-0.5px]
- Rounded: rounded-[3px] buttons, rounded-[5px] cards

### Backend Patterns

- Controllers handle HTTP requests
- Services contain business logic
- Guards protect routes (jwt-auth.guard.ts)
- DTOs validated with class-validator

## Commands

```bash
pnpm dev              # Start all apps
pnpm build            # Build all
pnpm lint             # Lint all
pnpm --filter web dev # Frontend only
pnpm --filter server dev # Backend only
```
