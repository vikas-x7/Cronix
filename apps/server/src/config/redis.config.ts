export interface RedisConnectionOptions {
  host: string;
  port: number;
  password?: string;
  tls?: {};
}

export function getRedisConfig(): RedisConnectionOptions {
  const upstashHost = process.env.UPSTASH_REDIS_HOST;
  const upstashToken = process.env.UPSTASH_REDIS_TOKEN;

  if (upstashHost && upstashToken) {
    return {
      host: upstashHost,
      port: 6379,
      password: upstashToken,
      tls: {},
    };
  }

  const localHost = process.env.REDIS_HOST;
  const localPort = process.env.REDIS_PORT;

  if (localHost && localPort) {
    return {
      host: localHost,
      port: parseInt(localPort),
    };
  }

  throw new Error(
    'Redis config missing: set REDIS_HOST+REDIS_PORT for local, or UPSTASH_REDIS_HOST+UPSTASH_REDIS_TOKEN for Upstash',
  );
}
