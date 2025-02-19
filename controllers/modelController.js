import pool from '../config/database.js';

export const getModel = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'SELECT * FROM menu_item_models WHERE id = $1',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadModel = async (req, res) => {
  try {
    const { restaurant_id, menu_item_id, model_url, thumbnail_url } = req.body;
    
    // Verify that the menu item belongs to the restaurant
    const menuItemCheck = await pool.query(
      'SELECT id FROM menu_items WHERE id = $1 AND restaurant_id = $2',
      [menu_item_id, restaurant_id]
    );
    
    if (menuItemCheck.rows.length === 0) {
      return res.status(400).json({ 
        message: 'Menu item does not belong to this restaurant' 
      });
    }

    // Insert or update the model
    const result = await pool.query(
      `INSERT INTO menu_item_models 
       (restaurant_id, menu_item_id, model_url, thumbnail_url) 
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (restaurant_id, menu_item_id) 
       DO UPDATE SET 
         model_url = EXCLUDED.model_url,
         thumbnail_url = EXCLUDED.thumbnail_url,
         is_active = true
       RETURNING *`,
      [restaurant_id, menu_item_id, model_url, thumbnail_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateModel = async (req, res) => {
  try {
    const { id } = req.params;
    const { model_url, thumbnail_url, is_active } = req.body;
    
    const result = await pool.query(
      `UPDATE menu_item_models 
       SET model_url = COALESCE($1, model_url),
           thumbnail_url = COALESCE($2, thumbnail_url),
           is_active = COALESCE($3, is_active)
       WHERE id = $4 
       RETURNING *`,
      [model_url, thumbnail_url, is_active, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteModel = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      'DELETE FROM menu_item_models WHERE id = $1 RETURNING *',
      [id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Model not found' });
    }
    
    res.json({ message: 'Model deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 