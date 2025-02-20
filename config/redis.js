import { createClient } from 'redis'
import dotenv from 'dotenv'

dotenv.config()

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
    connectTimeout: 10000,
    keepAlive: 5000,
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.log('❌ Redis bağlantı denemesi maksimum sayıya ulaştı');
        return false;
      }
      return Math.min(retries * 1000, 10000);
    }
  },
  legacyMode: false
})

// Bağlantıyı başlat
const connectRedis = async () => {
  try {
    await redisClient.connect()
    console.log('✅ Redis connection established')
  } catch (err) {
    console.error('❌ Redis connection failed:', err)
  }
}

// İlk bağlantıyı başlat
connectRedis().catch(console.error)

// Hata yönetimi
redisClient.on('error', (err) => {
  console.error('Redis Error:', err)
})

redisClient.on('ready', () => {
  console.log('✅ Redis is ready')
})

redisClient.on('reconnecting', () => {
  console.log('⏳ Redis reconnecting...')
})

redisClient.on('end', () => {
  console.log('❌ Redis connection ended')
})

process.on('SIGINT', () => {
  redisClient.quit()
  process.exit()
})

export default redisClient 