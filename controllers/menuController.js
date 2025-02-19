import pool from '../config/database.js';
import { clearCache } from '../middleware/cacheMiddleware.js';

export const getAllMenuItems = async (req, res) => {
  try {
    const { restaurant_id } = req.query;
    const result = await pool.query(
      `SELECT m.*, c.name as category_name 
       FROM menu_items m 
       LEFT JOIN categories c ON m.category_id = c.id 
       WHERE m.restaurant_id = $1 
       ORDER BY m.id`,
      [restaurant_id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching menu items:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM menu_items WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const { name, description, price, category_id, restaurant_id } = req.body;
    const result = await pool.query(
      'INSERT INTO menu_items (name, description, price, category_id, restaurant_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, category_id, restaurant_id]
    );

    // Public menü cache'ini temizle
    await clearCache(`/api/menu/public?restaurant_id=${restaurant_id}`);
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category_id, restaurant_id } = req.body;
    
    const result = await pool.query(
      'UPDATE menu_items SET name = $1, description = $2, price = $3, category_id = $4 WHERE id = $5 AND restaurant_id = $6 RETURNING *',
      [name, description, price, category_id, id, restaurant_id]
    );

    // Public menü cache'ini temizle
    await clearCache(`/api/menu/public?restaurant_id=${restaurant_id}`);
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { restaurant_id } = req.query;
    
    await pool.query('DELETE FROM menu_items WHERE id = $1 AND restaurant_id = $2', [id, restaurant_id]);

    // Public menü cache'ini temizle
    await clearCache(`/api/menu/public?restaurant_id=${restaurant_id}`);
    
    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 