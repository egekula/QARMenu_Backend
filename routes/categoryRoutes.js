import express from 'express';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { cacheMiddleware } from '../middleware/cacheMiddleware.js';

const router = express.Router();

// Public routes with cache
router.get('/public', cacheMiddleware(60), getCategories); // 1 dakika cache

// Protected routes
router.get('/', authenticateAdmin, getCategories);
router.post('/', authenticateAdmin, createCategory);
router.put('/:id', authenticateAdmin, updateCategory);
router.delete('/:id', authenticateAdmin, deleteCategory);

export default router; 