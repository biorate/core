import { Redis } from 'ioredis';

const METHODS = [
  // Strings
  'get',
  'set',
  'del',
  'mget',
  'setex',
  'setnx',
  'setrange',
  'getrange',
  'incr',
  'incrby',
  'incrbyfloat',
  'decr',
  'decrby',
  'append',
  'strlen',
  'getdel',
  'getset',
  'mset',
  'msetnx',
  'psetex',

  // Hashes
  'hget',
  'hset',
  'hdel',
  'hmget',
  'hmset',
  'hgetall',
  'hkeys',
  'hvals',
  'hexists',
  'hlen',
  'hincrby',
  'hincrbyfloat',
  'hsetnx',
  'hstrlen',

  // Lists
  'lpush',
  'rpush',
  'lpop',
  'rpop',
  'lrange',
  'llen',
  'lindex',
  'lset',
  'lrem',
  'ltrim',
  'linsert',
  'lpushx',
  'rpushx',
  'rpoplpush',
  'brpop',
  'blpop',
  'brpoplpush',

  // Sets
  'sadd',
  'srem',
  'smembers',
  'sismember',
  'scard',
  'srandmember',
  'spop',
  'smove',
  'sdiff',
  'sdiffstore',
  'sinter',
  'sinterstore',
  'sunion',
  'sunionstore',

  // Sorted Sets
  'zadd',
  'zrem',
  'zrange',
  'zrevrange',
  'zcard',
  'zscore',
  'zrank',
  'zrevrank',
  'zincrby',
  'zcount',
  'zlexcount',
  'zremrangebyrank',
  'zremrangebyscore',
  'zremrangebylex',
  'zrevrangebyscore',
  'zrangebyscore',
  'zrangebylex',
  'zrevrangebylex',
  'zunionstore',
  'zinterstore',

  // Keys
  'expire',
  'expireat',
  'ttl',
  'pttl',
  'persist',
  'exists',
  'type',
  'rename',
  'renamenx',
  'unlink',
  'dump',
  'restore',

  // Server
  'flushdb',
  'dbsize',
  'info',
  'time',
  'bgsave',
  'lastsave',
] as const;

/**
 * Monkey-patch every listed Redis command with graceful degradation.
 * On failure a warning is logged and `null` is returned instead of throwing.
 */
export function gracefulDegradation(redis: Redis): void {
  const target = redis as unknown as Record<
    string,
    (...args: unknown[]) => Promise<unknown>
  >;
  for (const method of METHODS) {
    const original = target[method];
    target[method] = async function (...args: unknown[]) {
      try {
        return await original.apply(this, args);
      } catch (e: unknown) {
        console.warn(`[Redis] ${method} failed: ${(e as Error)?.message}`);
        return null;
      }
    };
  }
}
