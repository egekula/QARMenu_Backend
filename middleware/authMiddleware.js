import jwt from 'jsonwebtoken';
import pool from '../config/database.js';

export const authenticateAdmin = async (req, res, next) => {
  try {
    // Token kontrolü
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Yetkilendirme başarısız' });
    }

    const token = authHeader.split(' ')[1];
    
    // Token doğrulama
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Admin kontrolü
    const admin = await pool.query(
      'SELECT id, username, email, restaurant_id, role FROM admins WHERE id = $1',
      [decoded.id]
    );

    if (admin.rows.length === 0) {
      return res.status(401).json({ error: 'Geçersiz token' });
    }

    // Hesap kilitli mi kontrolü
    if (admin.rows[0].account_locked) {
      return res.status(403).json({ error: 'Hesabınız kilitlendi' });
    }

    // Role kontrolü
    if (admin.rows[0].role !== 'admin') {
      return res.status(403).json({ error: 'Yetkisiz erişim' });
    }

    // Request'e admin bilgisini ekle
    req.admin = admin.rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Geçersiz token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token süresi doldu' });
    }
    res.status(500).json({ error: 'Sunucu hatası' });
  }
}; 