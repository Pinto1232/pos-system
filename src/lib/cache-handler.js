// eslint-disable-next-line @typescript-eslint/no-require-imports
const { IncrementalCache } = require('next/dist/server/lib/incremental-cache');

class OptimizedCacheHandler extends IncrementalCache {
  constructor(options) {
    super(options);
    this.cacheHitCount = 0;
    this.cacheMissCount = 0;
    this.cacheSize = new Map();
  }

  async get(key, kind) {
    const startTime = Date.now();

    try {
      const result = await super.get(key, kind);
      const duration = Date.now() - startTime;

      if (result) {
        this.cacheHitCount++;
        this.logCacheEvent('HIT', key, kind, duration);
      } else {
        this.cacheMissCount++;
        this.logCacheEvent('MISS', key, kind, duration);
      }

      return result;
    } catch (error) {
      console.error('Cache get error:', error);
      this.cacheMissCount++;
      return null;
    }
  }

  async set(key, data, kind) {
    const startTime = Date.now();

    try {
      await super.set(key, data, kind);
      const duration = Date.now() - startTime;

      this.cacheSize.set(key, data ? JSON.stringify(data).length : 0);

      this.logCacheEvent('SET', key, kind, duration);
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  async revalidateTag(tag) {
    const startTime = Date.now();

    try {
      await super.revalidateTag(tag);
      const duration = Date.now() - startTime;

      console.log(`[Cache] Revalidated tag: ${tag} (${duration}ms)`);
    } catch (error) {
      console.error('Cache revalidate error:', error);
    }
  }

  logCacheEvent(event, key, kind, duration) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Cache] ${event} - ${kind}:${key} (${duration}ms)`);
    }

    if (process.env.NODE_ENV === 'production' && event === 'MISS') {
      console.warn(`[Cache] MISS - ${kind}:${key} (${duration}ms)`);
    }
  }

  getCacheStats() {
    const totalRequests = this.cacheHitCount + this.cacheMissCount;
    const hitRatio =
      totalRequests > 0 ? (this.cacheHitCount / totalRequests) * 100 : 0;
    const totalSize = Array.from(this.cacheSize.values()).reduce(
      (sum, size) => sum + size,
      0
    );

    return {
      hits: this.cacheHitCount,
      misses: this.cacheMissCount,
      hitRatio: hitRatio.toFixed(2) + '%',
      totalSize: Math.round(totalSize / 1024) + 'KB',
      entries: this.cacheSize.size,
    };
  }
}

module.exports = OptimizedCacheHandler;
