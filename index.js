import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import menuRoutes from './routes/menuRoutes.js';
import restaurantRoutes from './routes/restaurantRoutes.js';
import modelRoutes from './routes/modelRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { authenticateAdmin } from './middleware/authMiddleware.js';
import { swaggerUi, specs } from './config/swagger.js';
import categoryRoutes from './routes/categoryRoutes.js';
import categoryPicsRoutes from './routes/categoryPicsRoutes.js';
import redisClient from './config/redis.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Public Routes (no authentication needed)
app.use('/api/restaurants', restaurantRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/category-pics', categoryPicsRoutes);

// Protected Routes (authentication needed)
app.use('/api/admin', adminRoutes);
app.use('/api/models', authenticateAdmin, modelRoutes);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Redis bağlantı durumunu kontrol et
redisClient.on('connect', () => {
  console.log('✅ Redis bağlantısı başarılı')
})

redisClient.on('error', (err) => {
  console.log('❌ Redis bağlantı hatası:', err)
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});