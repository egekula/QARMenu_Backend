import pool from '../config/database.js';

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