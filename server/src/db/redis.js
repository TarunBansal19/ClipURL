const Redis = require("ioredis");

let redisClient;
let redisUnavailableLogged = false;

const getRedisClient = () => {
  if (!redisClient) {
    redisClient = new Redis(process.env.REDIS_URL, {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false,
      retryStrategy: () => null,
      connectTimeout: 1500
    });

    redisClient.on("error", () => {
      if (process.env.NODE_ENV !== "test" && !redisUnavailableLogged) {
        redisUnavailableLogged = true;
        console.warn("Redis unavailable. Continuing without cache.");
      }
    });
  }

  return redisClient;
};

const connectRedis = async () => {
  try {
    const client = getRedisClient();
    if (client.status !== "ready") {
      await Promise.race([
        client.connect(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Redis connect timeout")), 1500)
        )
      ]);
    }
    return client;
  } catch {
    return null;
  }
};

const cacheGet = async (key) => {
  const client = await connectRedis();
  if (!client) return null;
  try {
    return await client.get(key);
  } catch {
    return null;
  }
};

const cacheSet = async (key, value, ttlSeconds) => {
  const client = await connectRedis();
  if (!client) return false;
  try {
    await client.set(key, value, "EX", ttlSeconds);
    return true;
  } catch {
    return false;
  }
};

const cacheDel = async (key) => {
  const client = await connectRedis();
  if (!client) return false;
  try {
    await client.del(key);
    return true;
  } catch {
    return false;
  }
};

module.exports = { getRedisClient, connectRedis, cacheGet, cacheSet, cacheDel };
