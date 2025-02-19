import redisClient from '../config/redis.js'

export const cacheMiddleware = (duration) => {
  return async (req, res, next) => {
    try {
      if (!redisClient.isReady) {
        console.error('❌ Redis client not ready')
        return next()
      }

      const key = `cache:${req.originalUrl}-${req.query.restaurant_id || ''}`
      console.log('🔍 Checking cache for key:', key)

      let cachedData
      try {
        cachedData = await redisClient.get(key)
        console.log('Cache check result:', {
          key,
          exists: !!cachedData,
          data: cachedData ? 'exists' : 'not found'
        })
      } catch (err) {
        console.error('❌ Redis get error:', err)
        return next()
      }

      if (cachedData) {
        console.log('✅ Serving from cache:', key)
        res.setHeader('Access-Control-Expose-Headers', 'X-Cache')
        res.setHeader('X-Cache', 'HIT')
        return res.json(JSON.parse(cachedData))
      }

      console.log('⚡ Cache miss, fetching fresh data')
      res.setHeader('Access-Control-Expose-Headers', 'X-Cache')
      res.setHeader('X-Cache', 'MISS')

      const originalJson = res.json
      res.json = async function(data) {
        try {
          console.log('💾 Caching data for key:', key)
          await redisClient.setEx(key, duration, JSON.stringify(data))
          console.log('✅ Successfully cached data')
        } catch (err) {
          console.error('❌ Redis set error:', err)
        }
        return originalJson.call(this, data)
      }

      next()
    } catch (error) {
      console.error('❌ Cache middleware error:', error)
      next()
    }
  }
}

export const clearCache = async (pattern) => {
  if (!redisClient.isReady) {
    console.error('❌ Redis client not ready for clearing cache')
    return
  }

  try {
    const keys = await redisClient.keys(`cache:${pattern}*`)
    console.log('🗑️ Attempting to clear cache for pattern:', pattern)
    
    if (keys.length > 0) {
      for (const key of keys) {
        await redisClient.del(key)
        console.log('✅ Cleared cache for key:', key)
      }
      console.log(`✅ Successfully cleared ${keys.length} cache entries`)
    } else {
      console.log('ℹ️ No cache entries found to clear')
    }
  } catch (error) {
    console.error('❌ Error clearing cache:', error)
  }
} 