# Database Package

Shared database package using Prisma ORM.

## Setup

1. Copy `.env.example` to `.env` and configure your `DATABASE_URL`
2. Define your schema in `prisma/schema.prisma`
3. Generate Prisma Client: `pnpm db:generate`
4. Apply migrations locally: `pnpm db:migrate`
5. Apply migrations in production: `pnpm db:migrate:deploy`

## Scripts

- `pnpm build` - Generate Prisma Client and compile TypeScript
- `pnpm check-types` - Generate Prisma Client and type-check without output
- `pnpm db:generate` - Generate Prisma Client from schema
- `pnpm db:migrate` - Generate and apply migrations in development
- `pnpm db:migrate:deploy` - Apply committed migrations in production
- `pnpm db:migrate:status` - Check migration drift/status
- `pnpm db:push` - Push schema without migrations (dev only)
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:seed` - Run seed script

## Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/orm/prisma-schema/overview)
- [Prisma Client Queries](https://www.prisma.io/docs/orm/prisma-client/queries)
