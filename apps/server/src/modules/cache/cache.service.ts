import { Injectable, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private redis: Redis;

  constructor() {
    this.redis = new Redis({
      host: process.env.UPSTASH_REDIS_HOST,
      port: 6379,
      password: process.env.UPSTASH_REDIS_TOKEN,
      tls: {},
      retryStrategy: (times) => Math.min(times * 50, 2000),
      maxRetriesPerRequest: 3,
    });
  }

  async get(key: string): Promise<string | null> {
    return this.redis.get(key);
  }

  async set(key: string, value: string, ttlSeconds: number): Promise<void> {
    await this.redis.set(key, value, 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.redis.del(key);
  }

  onModuleDestroy() {
    this.redis.disconnect();
  }
}
