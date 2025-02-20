import express from 'express';
import { registerAdmin, loginAdmin, refreshToken } from '../controllers/adminController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Admin:
 *       type: object
 *       required:
 *         - username
 *         - password
 *         - email
 *       properties:
 *         username:
 *           type: string
 *           example: "admin"
 *         password:
 *           type: string
 *           example: "securepassword123"
 *         email:
 *           type: string
 *           example: "admin@example.com"
 */

/**
 * @swagger
 * /api/admin:
 *   get:
 *     summary: Test endpoint for admin route
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Admin route is working
 */
router.get('/', (req, res) => {
  res.json({ message: 'Admin API is working' });
});

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Login for admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
router.post('/login', loginAdmin);

/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Register new admin
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *               - email
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Admin registered successfully
 */
router.post('/register', registerAdmin);

/**
 * @swagger
 * /api/admin/refresh-token:
 *   post:
 *     summary: Refresh JWT token
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token refreshed successfully
 */
router.post('/refresh-token', authenticateAdmin, refreshToken);

export default router; 