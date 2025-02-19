import pool from '../config/database.js';

export const getAllRestaurants = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM restaurants');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM restaurants WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createRestaurant = async (req, res) => {
  try {
    const { name, address, contact_number } = req.body;
    const result = await pool.query(
      'INSERT INTO restaurants (name, address, contact_number) VALUES ($1, $2, $3) RETURNING *',
      [name, address, contact_number]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, address, contact_number } = req.body;
    const result = await pool.query(
      'UPDATE restaurants SET name = $1, address = $2, contact_number = $3 WHERE id = $4 RETURNING *',
      [name, address, contact_number, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM restaurants WHERE id = $1 RETURNING *', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    res.json({ message: 'Restaurant deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRestaurantBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    console.log('Fetching restaurant with slug:', slug);

    // Decode the slug if it contains special characters
    const decodedSlug = decodeURIComponent(slug);
    
    const result = await pool.query(
      'SELECT * FROM restaurants WHERE slug = $1',
      [decodedSlug]
    );
    
    if (result.rows.length === 0) {
      console.log('No restaurant found with slug:', decodedSlug);
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    
    console.log('Found restaurant:', result.rows[0]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error in getRestaurantBySlug:', error);
    res.status(500).json({ error: error.message });
  }
}; 