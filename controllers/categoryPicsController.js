import pool from '../config/database.js';
import { clearCache } from '../utils/cache.js';

export const getCategoryPic = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const result = await pool.query(
      'SELECT * FROM category_pics WHERE category_name = $1',
      [categoryName]
    );
    
    if (result.rows.length === 0) {
      return res.json({ image_url: '/images/categories/default.jpg' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error in getCategoryPic:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getAllCategoryPics = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM category_pics');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Tüm category pics'leri getir
export const getCategoryPics = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM category_pics ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Yeni category pic ekle
export const createCategoryPic = async (req, res) => {
  try {
    const { category_name, image_url } = req.body;
    
    const result = await pool.query(
      'INSERT INTO category_pics (category_name, image_url) VALUES ($1, $2) RETURNING *',
      [category_name, image_url]
    );

    // Cache'i temizle
    await clearCache('/api/category-pics/public');
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Category pic güncelle
export const updateCategoryPic = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, image_url } = req.body;
    
    const result = await pool.query(
      'UPDATE category_pics SET category_name = $1, image_url = $2 WHERE id = $3 RETURNING *',
      [category_name, image_url, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category pic not found' });
    }

    // Cache'i temizle
    await clearCache('/api/category-pics/public');
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Category pic sil
export const deleteCategoryPic = async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      'DELETE FROM category_pics WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category pic not found' });
    }

    // Cache'i temizle
    await clearCache('/api/category-pics/public');
    
    res.json({ message: 'Category pic deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 