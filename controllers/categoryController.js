import pool from '../config/database.js';
import { clearCache } from '../middleware/cacheMiddleware.js';

export const getCategories = async (req, res) => {
  try {
    const { restaurant_id } = req.query;
    const result = await pool.query(
      'SELECT * FROM categories WHERE restaurant_id = $1 ORDER BY name',
      [restaurant_id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, restaurant_id } = req.body;
    const result = await pool.query(
      'INSERT INTO categories (name, restaurant_id) VALUES ($1, $2) RETURNING *',
      [name, restaurant_id]
    );
    
    // Cache'i temizle
    await clearCache(`/api/categories/public?restaurant_id=${restaurant_id}`);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, restaurant_id } = req.body;
    
    // Verify ownership
    const checkResult = await pool.query(
      'SELECT * FROM categories WHERE id = $1 AND restaurant_id = $2',
      [id, restaurant_id]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to update this category' });
    }
    
    const result = await pool.query(
      'UPDATE categories SET name = $1 WHERE id = $2 AND restaurant_id = $3 RETURNING *',
      [name, id, restaurant_id]
    );
    
    // Cache'i temizle
    await clearCache(`/api/categories/public?restaurant_id=${restaurant_id}`);
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { restaurant_id } = req.query;
    
    // Verify ownership
    const checkResult = await pool.query(
      'SELECT * FROM categories WHERE id = $1 AND restaurant_id = $2',
      [id, restaurant_id]
    );
    
    if (checkResult.rows.length === 0) {
      return res.status(403).json({ message: 'Not authorized to delete this category' });
    }
    
    // Set category_id to null for all menu items using this category
    await pool.query(
      'UPDATE menu_items SET category_id = NULL WHERE category_id = $1',
      [id]
    );
    
    // Delete the category
    await pool.query(
      'DELETE FROM categories WHERE id = $1 AND restaurant_id = $2',
      [id, restaurant_id]
    );
    
    // Cache'i temizle
    await clearCache(`/api/categories/public?restaurant_id=${restaurant_id}`);
    
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 