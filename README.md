<div align="center">

# Cronix

**A self-hosted cron job and event automation platform schedule, trigger, and monitor HTTP jobs with ease.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs)](https://nextjs.org)
[![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?logo=nestjs&logoColor=white)](https://nestjs.com)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](#license)

</div>

---

## About the Project

**Cronix** is a self-hosted automation platform for scheduling and monitoring HTTP requests via cron jobs or webhook triggers. Built as a Turborepo monorepo with a Next.js frontend and NestJS backend, it provides a clean dashboard to manage workspaces, configure jobs, track execution history, and receive failure notifications via email.

Designed for **developers and DevOps** who need a lightweight, self-hostable alternative to services like cron-job.org or EasyCron — with full control over their data and infrastructure.

## Features

- **Cron-based scheduling** with validated cron expressions and quick presets (minute, hourly, daily, weekly, monthly).
- **Webhook-triggered jobs** with unique tokens and URLs for on-demand execution.
- **Workspace organization** — group jobs into workspaces with per-user ownership isolation.
- **Execution tracking** with detailed logs, HTTP status codes, duration, retry attempts, and trigger types.
- **Dashboard & analytics** — total/active/paused job counts, 24-hour success rate, upcoming jobs, and recent executions.
- **Email notifications** on job failure via Resend, configurable per job.
- **OAuth authentication** — login with Google or GitHub (JWT access + refresh tokens in httpOnly cookies).
- **Rate limiting & security** — Helmet.js headers, CORS, Redis-backed rate limiting, input validation.
- **Automatic cleanup** — nightly purge of old logs (7 days) and executions (30 days).
- **Dark-themed UI** with responsive sidebar, animated transitions, and toast notifications.

## Tech Stack

### Monorepo

| Layer           | Technology                                                  |
| --------------- | ----------------------------------------------------------- |
| Monorepo Tool   | [Turborepo](https://turbo.build)                            |
| Package Manager | [pnpm](https://pnpm.io) (workspaces)                        |
| Language        | [TypeScript 5](https://www.typescriptlang.org) (throughout) |

### Frontend (`apps/web`)

| Layer            | Technology                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------- |
| Framework        | [Next.js 16](https://nextjs.org) (App Router)                                                |
| UI               | [React 19](https://react.dev) · [Tailwind CSS 4](https://tailwindcss.com)                    |
| State Management | [Zustand](https://zustand-demo.pmnd.rs) · [TanStack React Query](https://tanstack.com/query) |
| Forms            | [React Hook Form](https://react-hook-form.com) + [Zod](https://zod.dev)                      |
| Animations       | [Framer Motion](https://www.framer.com/motion)                                               |
| HTTP Client      | [Axios](https://axios-http.com) (with auto token refresh)                                    |

### Backend (`apps/server`)

| Layer          | Technology                                                                 |
| -------------- | -------------------------------------------------------------------------- |
| Framework      | [NestJS 11](https://nestjs.com) (Express)                                  |
| ORM            | [Prisma 7](https://www.prisma.io) (PostgreSQL driver adapter)              |
| Queue          | [BullMQ](https://docs.bullmq.io) (Redis-backed)                            |
| Authentication | [Passport.js](http://www.passportjs.org) (JWT, Google OAuth, GitHub OAuth) |
| Email          | [Resend](https://resend.com)                                               |
| Security       | [Helmet](https://helmetjs.github.io) · Redis-backed rate limiting          |

### Database

| Layer    | Technology                               |
| -------- | ---------------------------------------- |
| Database | [PostgreSQL](https://www.postgresql.org) |
| ORM      | [Prisma 7](https://www.prisma.io)        |

## Getting Started

### Prerequisites

- **Node.js** 20+
- **PostgreSQL** running locally or remotely
- **Redis** running locally or remotely (Upstash recommended)
- **pnpm** 9+

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/cronix.git
cd cronix

# 2. Install dependencies
pnpm install

# 3. Set up environment variables
cp apps/server/example.env apps/server/.env
cp packages/database/.env.example packages/database/.env
# Edit the .env files with your configuration

# 4. Generate Prisma client
pnpm --filter database db:generate

# 5. Apply database migrations
pnpm --filter database db:migrate

# 6. Start all apps in development mode
pnpm dev
```

The frontend runs on [http://localhost:3000](http://localhost:3000) and the API on [http://localhost:3001](http://localhost:3001).

### Environment Variables

#### Server (`apps/server/.env`)

| Variable               | Required | Description                              |
| ---------------------- | -------- | ---------------------------------------- |
| `NODE_ENV`             | No       | `development`, `production`, or `test`   |
| `PORT`                 | No       | Server port (default: `3001`)            |
| `ALLOWED_ORIGINS`      | **Yes**  | Comma-separated CORS origins             |
| `JWT_SECRET`           | **Yes**  | Min 32 chars, used for JWT signing       |
| `GOOGLE_CLIENT_ID`     | **Yes**  | Google OAuth client ID                   |
| `GOOGLE_CLIENT_SECRET` | **Yes**  | Google OAuth client secret               |
| `GITHUB_CLIENT_ID`     | **Yes**  | GitHub OAuth client ID                   |
| `GITHUB_CLIENT_SECRET` | **Yes**  | GitHub OAuth client secret               |
| `UPSTASH_REDIS_HOST`   | **Yes**  | Redis host (Upstash)                     |
| `UPSTASH_REDIS_TOKEN`  | **Yes**  | Redis password/token                     |
| `RESEND_API_KEY`       | No       | Resend API key for failure notifications |

#### Database (`packages/database/.env`)

| Variable            | Required | Description                          |
| ------------------- | -------- | ------------------------------------ |
| `DATABASE_URL`      | **Yes**  | PostgreSQL connection string         |
| `DATABASE_POOL_MIN` | No       | Min pool connections (default: `0`)  |
| `DATABASE_POOL_MAX` | No       | Max pool connections (default: `10`) |

#### Frontend (`apps/web/.env`)

| Variable              | Required | Description                                            |
| --------------------- | -------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL` | **Yes**  | Backend API URL (e.g., `http://localhost:3001/api/v1`) |

See [example.env](apps/server/example.env) and [.env.example](packages/database/.env.example) as templates.

## Available Scripts

### Root (via Turborepo)

| Script             | Description                        |
| ------------------ | ---------------------------------- |
| `pnpm dev`         | Start all apps in development mode |
| `pnpm build`       | Build all apps and packages        |
| `pnpm lint`        | Lint all apps and packages         |
| `pnpm format`      | Format code with Prettier          |
| `pnpm check-types` | Type-check all apps and packages   |

### Frontend (`apps/web`)

| Script       | Description                           |
| ------------ | ------------------------------------- |
| `pnpm dev`   | Start Next.js dev server on port 3000 |
| `pnpm build` | Build Next.js production bundle       |
| `pnpm start` | Start production server               |
| `pnpm lint`  | Run ESLint                            |

### Backend (`apps/server`)

| Script          | Description                             |
| --------------- | --------------------------------------- |
| `pnpm dev`      | Start NestJS dev server with watch mode |
| `pnpm build`    | Build for production                    |
| `pnpm start`    | Start production server                 |
| `pnpm test`     | Run unit tests                          |
| `pnpm test:e2e` | Run end-to-end tests                    |
| `pnpm lint`     | Run ESLint with auto-fix                |

### Database (`packages/database`)

| Script                   | Description                        |
| ------------------------ | ---------------------------------- |
| `pnpm db:generate`       | Generate Prisma client from schema |
| `pnpm db:migrate`        | Create and apply dev migrations    |
| `pnpm db:migrate:deploy` | Apply migrations in production     |
| `pnpm db:push`           | Push schema without migrations     |
| `pnpm db:studio`         | Open Prisma Studio GUI             |
| `pnpm db:seed`           | Run seed script                    |

## Project Structure

```
cronix/
├── apps/
│   ├── web/                              # Next.js 16 frontend
│   │   ├── app/                          # App Router pages
│   │   │   ├── (dashboard)/              # Protected dashboard routes
│   │   │   │   ├── dashboard/            # Overview stats
│   │   │   │   ├── jobs/                 # Job management
│   │   │   │   ├── executions/           # Execution history
│   │   │   │   ├── workspaces/           # Workspace management
│   │   │   │   ├── webhooks/             # Webhook info
│   │   │   │   └── settings/             # User settings
│   │   │   ├── auth/callback/            # OAuth callback handler
│   │   │   ├── login/                    # Login page
│   │   │   └── page.tsx                  # Landing page
│   │   └── src/
│   │       ├── modules/                  # Feature modules
│   │       │   ├── auth/                 # Auth store, hook, API
│   │       │   ├── dashboard/            # Stats, recent executions
│   │       │   ├── jobs/                 # Job table, form, actions
│   │       │   ├── executions/           # Execution table, log viewer
│   │       │   ├── workspaces/           # Workspace cards, modal
│   │       │   └── landing/              # Landing page sections
│   │       └── shared/                   # Shared components & utils
│   │
│   └── server/                           # NestJS 11 backend
│       └── src/
│           ├── auth/                     # JWT, Google, GitHub strategies
│           ├── modules/
│           │   ├── jobs/                 # CRUD, pause/resume, run now
│           │   ├── executions/           # List, detail, logs
│           │   ├── workspaces/           # CRUD with ownership
│           │   ├── scheduler/            # Cron scheduling + cleanup
│           │   ├── queue/                # BullMQ producer + processor
│           │   ├── dashboard/            # Stats endpoint
│           │   ├── notifications/        # Email via Resend
│           │   └── webhooks/             # Webhook trigger endpoint
│           ├── common/                   # Filters, interceptors
│           └── config/                   # Env validation, security
│
├── packages/
│   ├── database/                         # Shared Prisma package
│   │   ├── prisma/schema.prisma          # Data model
│   │   └── src/                          # Env validation, client
│   ├── eslint-config/                    # Shared ESLint configs
│   └── typescript-config/                # Shared TS configs
│
├── turbo.json                            # Turborepo pipeline
└── package.json                          # Root scripts
```

## Deployment

The application is designed to be deployed as two separate services (frontend + backend) with a shared PostgreSQL and Redis instance.

1. Provision a **PostgreSQL** database (Neon, Supabase, Railway, etc.).
2. Provision a **Redis** instance (Upstash recommended for serverless).
3. Configure all environment variables for production.
4. Run `pnpm --filter database db:migrate:deploy` to apply migrations.
5. Build and deploy the backend (`apps/server`) and frontend (`apps/web`) separately.

### Database Models

| Model       | Description                                   |
| ----------- | --------------------------------------------- |
| `User`      | User accounts with OAuth profile data         |
| `Account`   | OAuth provider links (Google, GitHub)         |
| `Space`     | Workspaces that contain jobs                  |
| `Job`       | Scheduled (cron) or event (webhook) jobs      |
| `Execution` | Job execution records with status and metrics |
| `Log`       | Detailed log entries per execution            |

## Contributing

Contributions are welcome! Please follow the existing code conventions and commit style (conventional commits via commitlint).

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

## License

Distributed under the **MIT** license. See `LICENSE` for more information.

---

<div align="center">

_"Cronix" is not affiliated with any third-party cron service. Built with ❤️ using Next.js, NestJS, and Prisma._

</div>
