import redisClient from '../config/redis.js';

// Cache'den veri al
export const getCache = async (key) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Cache get error:', error);
    return null;
  }
};

// Cache'e veri kaydet
export const setCache = async (key, data, duration = 300) => {
  try {
    await redisClient.setEx(key, duration, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Cache set error:', error);
    return false;
  }
};

// Cache'den veri sil
export const clearCache = async (pattern) => {
  try {
    const keys = await redisClient.keys(`cache:${pattern}*`);
    if (keys.length > 0) {
      await redisClient.del(keys);
      console.log(`🗑️ Cache cleared for pattern: ${pattern}`);
    }
    return true;
  } catch (error) {
    console.error('Cache clear error:', error);
    return false;
  }
};

// Cache middleware
export const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    try {
      if (!redisClient.isReady) {
        console.error('❌ Redis client not ready');
        return next();
      }

      const key = `cache:${req.originalUrl}`;
      console.log('🔍 Checking cache for key:', key);

      const cachedData = await getCache(key);
      if (cachedData) {
        console.log('✅ Serving from cache:', key);
        return res.json(cachedData);
      }

      console.log('⚡ Cache miss, fetching fresh data');

      // Orijinal json metodunu sakla
      const originalJson = res.json;
      res.json = function(data) {
        // Veriyi cache'e kaydet
        setCache(key, data, duration)
          .then(() => console.log('💾 Data cached successfully'))
          .catch(err => console.error('❌ Cache save error:', err));

        // Orijinal json metodunu çağır
        return originalJson.call(this, data);
      };

      next();
    } catch (error) {
      console.error('❌ Cache middleware error:', error);
      next();
    }
  };
}; 