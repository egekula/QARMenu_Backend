import express from 'express';
import { getModel, uploadModel, updateModel, deleteModel } from '../controllers/modelController.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Model:
 *       type: object
 *       required:
 *         - restaurant_id
 *         - menu_item_id
 *         - model_url
 *       properties:
 *         restaurant_id:
 *           type: integer
 *           example: 1
 *           description: ID of the restaurant
 *         menu_item_id:
 *           type: integer
 *           example: 1
 *           description: ID of the menu item
 *         model_url:
 *           type: string
 *           example: "https://example.com/models/burger.glb"
 *           description: URL to the 3D model file
 *         thumbnail_url:
 *           type: string
 *           example: "https://example.com/thumbnails/burger.jpg"
 *           description: URL to the model thumbnail
 *         is_active:
 *           type: boolean
 *           example: true
 *           description: Whether the model is active
 */

/**
 * @swagger
 * /api/models/{id}:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     summary: Get model by ID
 *     tags: [Models]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Model details
 *       401:
 *         description: Not authenticated
 */
router.get('/:id', getModel);

/**
 * @swagger
 * /api/models:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     summary: Upload a new model
 *     tags: [Models]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - restaurant_id
 *               - menu_item_id
 *               - model_url
 *             properties:
 *               restaurant_id:
 *                 type: integer
 *                 example: 1
 *               menu_item_id:
 *                 type: integer
 *                 example: 1
 *               model_url:
 *                 type: string
 *                 example: "https://example.com/models/burger.glb"
 *               thumbnail_url:
 *                 type: string
 *                 example: "https://example.com/thumbnails/burger.jpg"
 *     responses:
 *       201:
 *         description: Model uploaded successfully
 */
router.post('/', uploadModel);

/**
 * @swagger
 * /api/models/{id}:
 *   put:
 *     security:
 *       - bearerAuth: []
 *     summary: Update model by ID
 *     tags: [Models]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               model_url:
 *                 type: string
 *                 example: "https://example.com/models/updated-burger.glb"
 *               thumbnail_url:
 *                 type: string
 *                 example: "https://example.com/thumbnails/updated-burger.jpg"
 *               is_active:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Model updated successfully
 */
router.put('/:id', updateModel);

/**
 * @swagger
 * /api/models/{id}:
 *   delete:
 *     summary: Delete model by ID
 *     tags: [Models]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Model deleted successfully
 */
router.delete('/:id', deleteModel);

export default router; 