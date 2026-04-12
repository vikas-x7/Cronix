# Cronix

Cronix is a full-stack cron job scheduling platform that lets users automate, monitor, and manage scheduled tasks across multiple platforms.

<img src="https://res.cloudinary.com/dyv9kenuj/image/upload/q_auto/f_auto/v1775958405/Screenshot_from_2026-04-12_07-14-50_swgy8m.png" alt="Dashboard" width="full"/>

## Features

- Create and manage cron jobs with custom schedules
- Real-time dashboard with execution monitoring
- Automatic retry on failed webhook deliveries
- Full execution history and error logs
- Secure authentication with GitHub and Google OAuth
- Isolated job environments per user
- Responsive UI

## Tech Stack

**Frontend**

- Next.js
- Tailwind CSS
- TanStack React Query
- Zustand
- Axios
- Zod Validation

**Backend**

- Next.js API Routes
- Prisma ORM
- PostgreSQL
- NextAuth.js
- Zod Validation
- Trigger.dev
- Cron Parser

## Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/cronix.git
cd cronix
```

## Environment Variables

Create a `.env` file in the root directory and add the following variables:

```env
DATABASE_URL=""

GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

NEXTAUTH_SECRET=""
TRIGGER_SECRET_KEY=""

DATABASE_POOL_SIZE=20
DATABASE_POOL_MIN=2

NODE_ENV=production
```

## Install Dependencies

```bash
bun install
```

## Run Database Migrations

```bash
bunx prisma generate
bunx prisma migrate dev
```

## Run the Development Server

```bash
bun run dev
```

## Run Trigger.dev Worker

```bash
bun run trigger
```

## Build for Production

```bash
bun run build
bun run start
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

This project is licensed under the MIT License.
