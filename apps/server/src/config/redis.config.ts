export interface RedisConnectionOptions {
  host: string;
  port: number;
  password?: string;
  tls?: {};
}

function tryParseRedisUrl(url: string): RedisConnectionOptions | null {
  try {
    const parsed = new URL(url);
    const protocol = parsed.protocol;

    if (!['redis:', 'rediss:'].includes(protocol)) return null;

    return {
      host: parsed.hostname,
      port: parsed.port
        ? parseInt(parsed.port)
        : protocol === 'rediss:'
          ? 6379
          : 6379,
      password: parsed.password || undefined,
      tls: protocol === 'rediss:' ? {} : undefined,
    };
  } catch {
    return null;
  }
}

export function getRedisConfig(): RedisConnectionOptions {
  const redisUrl = process.env.REDIS_URL;

  if (redisUrl) {
    const parsed = tryParseRedisUrl(redisUrl);
    if (parsed) return parsed;
  }

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
    'Redis config missing: set REDIS_URL, or REDIS_HOST+REDIS_PORT for local, or UPSTASH_REDIS_HOST+UPSTASH_REDIS_TOKEN for Upstash',
  );
}
