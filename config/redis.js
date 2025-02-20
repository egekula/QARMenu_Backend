import { createClient } from 'redis'
import dotenv from 'dotenv'

dotenv.config()

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
    keepAlive: 5000
  },
  retry_strategy: function(options) {
    if (options.error && options.error.code === 'ECONNREFUSED') {
      return new Error('Redis sunucusu reddetti');
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      return new Error('Retry time exhausted');
    }
    if (options.attempt > 10) {
      return undefined;
    }
    return Math.min(options.attempt * 100, 3000);
  }
})

// Bağlantıyı başlat
const connectRedis = async () => {
  try {
    await redisClient.connect()
    console.log('✅ Redis connection established')
  } catch (err) {
    console.error('❌ Redis connection failed:', err)
    // Bağlantı hatası durumunda yeniden deneme
    setTimeout(connectRedis, 5000)
  }
}

// İlk bağlantıyı başlat
connectRedis()

// Bağlantı hatası dinleyicisi
redisClient.on('error', (err) => {
  console.error('Redis Error:', err)
})

// Yeniden bağlantı dinleyicisi
redisClient.on('reconnecting', () => {
  console.log('Redis reconnecting...')
})

// Bağlantı başarılı dinleyicisi
redisClient.on('connect', () => {
  console.log('Redis connected')
})

export default redisClient 