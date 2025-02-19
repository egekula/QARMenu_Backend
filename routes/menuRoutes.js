import express from 'express';
import { getAllMenuItems, getMenuItem, createMenuItem, updateMenuItem, deleteMenuItem } from '../controllers/menuController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { cacheMiddleware } from '../middleware/cacheMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     MenuItem:
 *       type: object
 *       required:
 *         - restaurant_id
 *         - name
 *         - price
 *       properties:
 *         restaurant_id:
 *           type: integer
 *           example: 1
 *           description: ID of the restaurant this item belongs to
 *         name:
 *           type: string
 *           example: "Cheeseburger"
 *           description: Name of the menu item
 *         description:
 *           type: string
 *           example: "Juicy beef patty with melted cheese"
 *           description: Description of the menu item
 *         price:
 *           type: number
 *           format: float
 *           example: 12.99
 *           description: Price of the menu item
 *         category:
 *           type: string
 *           example: "Main Course"
 *           description: Category of the menu item
 */

/**
 * @swagger
 * /api/menu:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Returns all menu items
 *     tags: [Menu Items]
 *     parameters:
 *       - in: query
 *         name: restaurantId
 *         schema:
 *           type: integer
 *         description: Filter items by restaurant ID
 *     responses:
 *       200:
 *         description: List of menu items
 *       401:
 *         description: Not authenticated
 */
router.get('/public', cacheMiddleware(60), getAllMenuItems);

/**
 * @swagger
 * /api/menu/{id}:
 *   get:
 *     summary: Get menu item by ID
 *     tags: [Menu Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MenuItem'
 */
router.get('/:id', authenticateAdmin, getMenuItem);

/**
 * @swagger
 * /api/menu:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new menu item
 *     tags: [Menu Items]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurant_id
 *               - name
 *               - price
 *             properties:
 *               restaurant_id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "Cheeseburger"
 *               description:
 *                 type: string
 *                 example: "Juicy beef patty with melted cheese"
 *               price:
 *                 type: number
 *                 example: 12.99
 *               category:
 *                 type: string
 *                 example: "Main Course"
 *     responses:
 *       201:
 *         description: Menu item created successfully
 */
router.post('/', authenticateAdmin, createMenuItem);

/**
 * @swagger
 * /api/menu/{id}:
 *   put:
 *     summary: Update menu item by ID
 *     tags: [Menu Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MenuItem'
 *     responses:
 *       200:
 *         description: Menu item updated successfully
 */
router.put('/:id', authenticateAdmin, updateMenuItem);

/**
 * @swagger
 * /api/menu/{id}:
 *   delete:
 *     summary: Delete menu item by ID
 *     tags: [Menu Items]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Menu item deleted successfully
 */
router.delete('/:id', authenticateAdmin, deleteMenuItem);

// Protected routes (admin) - cache yok
router.get('/', authenticateAdmin, getAllMenuItems);

export default router; 