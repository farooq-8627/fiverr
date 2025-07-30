// Simple in-memory cache for client-side data
class ClientCache {
  private cache = new Map<
    string,
    { data: any; timestamp: number; ttl: number }
  >();

  set(key: string, data: any, ttlMs: number = 5 * 60 * 1000) {
    // 5 minutes default
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlMs,
    });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    const isExpired = Date.now() - entry.timestamp > entry.ttl;
    if (isExpired) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  delete(key: string) {
    this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  // Invalidate cache entries by pattern
  invalidatePattern(pattern: string) {
    const keysToDelete: string[] = [];
    this.cache.forEach((_, key) => {
      if (key.includes(pattern)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach((key) => this.cache.delete(key));
  }
}

export const clientCache = new ClientCache();

// Cache key generators
export const cacheKeys = {
  user: (username: string) => `user:${username}`,
  userProfiles: (userId: string) => `userProfiles:${userId}`,
  agentProfile: (profileId: string) => `agentProfile:${profileId}`,
  clientProfile: (profileId: string) => `clientProfile:${profileId}`,
  posts: (type: string = "all") => `posts:${type}`,
  companies: () => "companies:list",
  agents: () => "agents:list",
  clients: () => "clients:list",
};

// Cache invalidation helpers
export const invalidateUserCache = (username: string) => {
  clientCache.invalidatePattern(`user:${username}`);
  clientCache.invalidatePattern(`userProfiles:`);
};

export const invalidatePostsCache = () => {
  clientCache.invalidatePattern("posts:");
};
