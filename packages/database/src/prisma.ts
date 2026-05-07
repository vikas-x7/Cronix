import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

import { Prisma, PrismaClient } from '../generated/prisma/client.js';
import { env } from './env.js';

type PrismaClientInstance = InstanceType<typeof PrismaClient>;

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClientInstance;
  prismaPool?: pg.Pool;
  prismaShutdownRegistered?: boolean;
};

const logLevels: Prisma.LogLevel[] = env.DATABASE_LOG_QUERIES
  ? ['query', 'info', 'warn', 'error']
  : ['warn', 'error'];

const createPool = () =>
  new pg.Pool({
    connectionString: env.DATABASE_URL,
    min: env.DATABASE_POOL_MIN,
    max: env.DATABASE_POOL_MAX,
    idleTimeoutMillis: env.DATABASE_IDLE_TIMEOUT_MS,
    connectionTimeoutMillis: env.DATABASE_CONNECTION_TIMEOUT_MS,
    statement_timeout: env.DATABASE_STATEMENT_TIMEOUT_MS,
    query_timeout: env.DATABASE_QUERY_TIMEOUT_MS,
  });

const createPrismaClient = () => {
  const pool = globalForPrisma.prismaPool ?? createPool();
  globalForPrisma.prismaPool = pool;

  pool.on('error', (error) => {
    console.error('Unexpected database pool error:', error);
  });

  return new PrismaClient({
    adapter: new PrismaPg(pool, {
      disposeExternalPool: true,
      onPoolError: (error) => {
        console.error('Database pool error:', error);
      },
      onConnectionError: (error) => {
        console.error('Database connection error:', error);
      },
    }),
    errorFormat: 'minimal',
    log: logLevels,
    transactionOptions: {
      maxWait: env.DATABASE_TRANSACTION_MAX_WAIT_MS,
      timeout: env.DATABASE_TRANSACTION_TIMEOUT_MS,
    },
  });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export const disconnectDatabase = async () => {
  await prisma.$disconnect();
  globalForPrisma.prisma = undefined;
  globalForPrisma.prismaPool = undefined;
};

const registerShutdownHooks = () => {
  if (globalForPrisma.prismaShutdownRegistered) {
    return;
  }

  globalForPrisma.prismaShutdownRegistered = true;

  const shutdown = async (signal: NodeJS.Signals) => {
    try {
      await disconnectDatabase();
      process.exit(0);
    } catch (error) {
      console.error(
        `Failed to gracefully close database connection after ${signal}:`,
        error,
      );
      process.exit(1);
    }
  };

  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
  process.once('beforeExit', async () => {
    await disconnectDatabase();
  });
};

registerShutdownHooks();

export { Prisma, PrismaClient };
export type { PrismaClientInstance };
