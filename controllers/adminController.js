import pool from '../config/database.js';
import { generateToken, hashPassword, comparePassword } from '../utils/auth.js';
import bcrypt from 'bcrypt';

export const registerAdmin = async (req, res) => {
  try {
    const { username, password, email } = req.body;

    // Input validasyonu
    if (!username || !password || !email) {
      return res.status(400).json({ 
        error: 'Kullanıcı adı, şifre ve email zorunludur' 
      });
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Geçersiz email formatı' 
      });
    }

    // Kullanıcı adı veya email zaten var mı kontrolü
    const userExists = await pool.query(
      'SELECT * FROM admins WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Bu kullanıcı adı veya email zaten kullanımda' 
      });
    }

    // Şifreyi hashle
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Yeni admin oluştur
    const result = await pool.query(
      `INSERT INTO admins (username, password_hash, email, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, username, email, role`,
      [username, password_hash, email, 'admin']
    );

    res.status(201).json({
      message: 'Admin başarıyla kaydedildi',
      admin: result.rows[0]
    });

  } catch (error) {
    console.error('Register error:', error); // Hata detayını logla
    res.status(500).json({ 
      error: 'Sunucu hatası',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Input validasyonu
    if (!username || !password) {
      return res.status(400).json({ error: 'Kullanıcı adı ve şifre zorunludur' });
    }

    // Kullanıcıyı bul
    const result = await pool.query(
      'SELECT admins.*, restaurants.id as restaurant_id FROM admins LEFT JOIN restaurants ON admins.restaurant_id = restaurants.id WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    }

    const admin = result.rows[0];

    // Şifre kontrolü - password_hash kullan
    const isValidPassword = await comparePassword(password, admin.password_hash);
    if (!isValidPassword) {
      console.log('Şifre eşleşmedi:', {
        givenPassword: password,
        hashedPassword: admin.password_hash
      });
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    }

    // JWT token oluştur
    const token = generateToken({
      id: admin.id,
      username: admin.username,
      restaurant_id: admin.restaurant_id,
      role: admin.role
    });

    // Hassas bilgileri çıkar
    delete admin.password_hash;

    res.json({ 
      message: 'Giriş başarılı',
      token, 
      admin: {
        id: admin.id,
        username: admin.username,
        email: admin.email,
        restaurant_id: admin.restaurant_id,
        role: admin.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Sunucu hatası',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Token yenileme fonksiyonu
export const refreshToken = async (req, res) => {
  try {
    const admin = req.admin; // middleware'den gelen admin bilgisi
    const newToken = generateToken(admin);
    
    res.json({ 
      token: newToken,
      admin: {
        id: admin.id,
        username: admin.username,
        restaurant_id: admin.restaurant_id
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}; 