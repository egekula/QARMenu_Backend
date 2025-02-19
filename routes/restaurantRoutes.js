import express from 'express';
import { getAllRestaurants, getRestaurant, createRestaurant, updateRestaurant, deleteRestaurant, getRestaurantBySlug } from '../controllers/restaurantController.js';
import { authenticateAdmin } from '../middleware/authMiddleware.js';
import { cacheMiddleware } from '../middleware/cacheMiddleware.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Restaurant:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *           type: integer
 *           description: Auto-generated ID
 *         name:
 *           type: string
 *           example: "Burger Palace"
 *           description: Restaurant name
 *         address:
 *           type: string
 *           example: "123 Main Street, City"
 *           description: Restaurant address
 *         contact_number:
 *           type: string
 *           example: "+1 234-567-8900"
 *           description: Contact phone number
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Creation timestamp
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

/**
 * @swagger
 * /api/restaurants:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Returns all restaurants
 *     tags: [Restaurants]
 *     responses:
 *       200:
 *         description: List of restaurants
 *       401:
 *         description: Not authenticated
 */
router.get('/', authenticateAdmin, getAllRestaurants);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   get:
 *     summary: Get restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurant details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Restaurant not found
 */
router.get('/:id', authenticateAdmin, getRestaurant);

/**
 * @swagger
 * /api/restaurants:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Create a new restaurant
 *     tags: [Restaurants]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Burger Palace"
 *               address:
 *                 type: string
 *                 example: "123 Main Street, City"
 *               contact_number:
 *                 type: string
 *                 example: "+1 234-567-8900"
 *     responses:
 *       201:
 *         description: Restaurant created successfully
 */
router.post('/', authenticateAdmin, createRestaurant);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   put:
 *     summary: Update restaurant by ID
 *     tags: [Restaurants]
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
 *             $ref: '#/components/schemas/Restaurant'
 *     responses:
 *       200:
 *         description: Restaurant updated successfully
 *       404:
 *         description: Restaurant not found
 */
router.put('/:id', authenticateAdmin, updateRestaurant);

/**
 * @swagger
 * /api/restaurants/{id}:
 *   delete:
 *     summary: Delete restaurant by ID
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Restaurant deleted successfully
 *       404:
 *         description: Restaurant not found
 */
router.delete('/:id', authenticateAdmin, deleteRestaurant);

/**
 * @swagger
 * /api/restaurants/by-slug/{slug}:
 *   get:
 *     summary: Get restaurant by slug
 *     tags: [Restaurants]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Restaurant details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Restaurant'
 *       404:
 *         description: Restaurant not found
 */
router.get('/by-slug/:slug', cacheMiddleware(60), getRestaurantBySlug);

export default router; 