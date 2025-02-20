import express from 'express';
import { getCategoryPics, createCategoryPic, updateCategoryPic, deleteCategoryPic } from '../controllers/categoryPicsController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { cacheMiddleware } from '../middleware/cacheMiddleware.js';

const router = express.Router();

// Public routes - 5 dakika cache
router.get('/public', cacheMiddleware(300), getCategoryPics);

// Protected routes
router.post('/', authenticateAdmin, createCategoryPic);
router.put('/:id', authenticateAdmin, updateCategoryPic);
router.delete('/:id', authenticateAdmin, deleteCategoryPic);

export default router; 