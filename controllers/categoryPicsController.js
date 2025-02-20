import pool from '../config/database.js';
import { clearCache } from '../utils/cache.js';

// Kategori adına göre resim getir
export const getCategoryPic = async (req, res) => {
  try {
    const { categoryName } = req.params;
    const result = await pool.query(
      'SELECT * FROM category_pics WHERE category_name = $1',
      [categoryName]
    );
    
    if (result.rows.length === 0) {
      // Default base64 resmi burada tanımlayabilirsiniz
      return res.json({ 
        base64_image: 'default_base64_string_here',
        mime_type: 'image/jpeg' 
      });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error in getCategoryPic:', error);
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
    const { category_name, base64_image, mime_type } = req.body;
    
    if (!base64_image || !mime_type) {
      return res.status(400).json({ error: 'base64_image ve mime_type zorunludur' });
    }

    const result = await pool.query(
      'INSERT INTO category_pics (category_name, base64_image, mime_type) VALUES ($1, $2, $3) RETURNING *',
      [category_name, base64_image, mime_type]
    );

    await clearCache('/api/category-pics');
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Category pic güncelle
export const updateCategoryPic = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_name, base64_image, mime_type } = req.body;
    
    const result = await pool.query(
      'UPDATE category_pics SET category_name = $1, base64_image = $2, mime_type = $3 WHERE id = $4 RETURNING *',
      [category_name, base64_image, mime_type, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category pic not found' });
    }

    await clearCache('/api/category-pics');
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
    await clearCache('/api/category-pics');
    
    res.json({ message: 'Category pic deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 