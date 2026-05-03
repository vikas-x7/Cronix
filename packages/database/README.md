# Database Package

Shared database package using Prisma ORM.

## Setup

1. Copy `example.env` to `.env` and configure your `DATABASE_URL`
2. Define your schema in `prisma/schema.prisma`
3. Generate Prisma Client: `pnpm prisma generate`
4. Apply migrations: `pnpm prisma migrate deploy`

## Scripts

- `pnpm prisma generate` - Generate Prisma Client from schema
- `pnpm prisma migrate dev` - Generate and apply migrations (development)
- `pnpm prisma migrate deploy` - Apply migrations (production)
- `pnpm prisma db push` - Push schema without migrations (dev only)
- `pnpm prisma studio` - Open Prisma Studio
- `pnpm prisma db seed` - Run seed script

## Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma Schema Reference](https://www.prisma.io/docs/orm/prisma-schema/overview)
- [Prisma Client Queries](https://www.prisma.io/docs/orm/prisma-client/queries)
