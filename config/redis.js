import { createClient } from 'redis'
import dotenv from 'dotenv'

dotenv.config()

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    reconnectStrategy: (retries) => {
      console.log(`⚡ Redis reconnection attempt: ${retries}`)
      return Math.min(retries * 100, 3000)
    }
  }
})

redisClient.on('connect', () => {
  console.log('✅ Redis connected')
})

redisClient.on('ready', () => {
  console.log('✅ Redis ready to use')
})

redisClient.on('error', (err) => {
  console.error('❌ Redis error:', err)
})

redisClient.on('reconnecting', () => {
  console.log('⚡ Redis reconnecting...')
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

connectRedis()

export default redisClient 