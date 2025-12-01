import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { PrismaClient } from "../../generated/prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = (): PrismaClient => {
  
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    
    
    max: parseInt(process.env.DATABASE_POOL_SIZE || "20"),      
    min: parseInt(process.env.DATABASE_POOL_MIN || "2"),        
    
    
    idleTimeoutMillis: 30000,           
    connectionTimeoutMillis: 10000,     
    
    
    allowExitOnIdle: false,            
    
    
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000, 
  });

  
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle database client', err);
    
  });

  pool.on('connect', (client) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('New database connection established');
    }
  });

  pool.on('remove', (client) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Database connection removed from pool');
    }
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
};

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") {
  globalThis.prisma = prisma;
}


const gracefulShutdown = async () => {
  console.log('Shutting down gracefully...');
  try {
    await prisma.$disconnect();
    console.log('Database connections closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};


process.on('beforeExit', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);   
process.on('SIGTERM', gracefulShutdown);  
process.on('SIGUSR2', gracefulShutdown);  