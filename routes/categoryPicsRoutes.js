import express from 'express';
import { getCategoryPic, getAllCategoryPics } from '../controllers/categoryPicsController.js';

const router = express.Router();

router.get('/', getAllCategoryPics);
router.get('/:categoryName', getCategoryPic);

export default router; 