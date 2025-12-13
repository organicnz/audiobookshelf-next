import { Redis } from '@upstash/redis';

// Initialize Redis. 
// Ensure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are set in your .env
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://mock-url.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'mock-token',
});

// Helper to wrap cache logic
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    return await redis.get(key);
  } catch (e) {
    console.warn('Redis get failed', e);
    return null;
  }
}

export async function setCached(key: string, value: any, ttlSeconds: number = 3600) {
  try {
    await redis.set(key, value, { ex: ttlSeconds });
  } catch (e) {
    console.warn('Redis set failed', e);
  }
}