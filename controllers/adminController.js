import pool from '../config/database.js';
import { generateToken, hashPassword, comparePassword } from '../utils/auth.js';

export const registerAdmin = async (req, res) => {
  try {
    // Sadece gerekli alanları al
    const { username, password, email } = req.body;
    
    // Input validasyonu
    if (!username || !password || !email) {
      return res.status(400).json({ error: 'Tüm alanlar zorunludur' });
    }

    // Email formatı kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Geçersiz email formatı' });
    }

    // Kullanıcı adı ve email benzersizlik kontrolü
    const existingUser = await pool.query(
      'SELECT * FROM admins WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Bu kullanıcı adı veya email zaten kullanımda' 
      });
    }

    // Şifre güvenlik kontrolü
    if (password.length < 8) {
      return res.status(400).json({ 
        error: 'Şifre en az 8 karakter olmalıdır' 
      });
    }

    // Şifreyi hashle
    const hashedPassword = await hashPassword(password);

    // Sadece izin verilen alanları kaydet
    const result = await pool.query(
      `INSERT INTO admins (username, password_hash, email, role) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, username, email, role`,
      [username, hashedPassword, email, 'admin']
    );

    // JWT token oluştur
    const token = generateToken({
      id: result.rows[0].id,
      username: result.rows[0].username,
      role: result.rows[0].role
    });

    res.status(201).json({
      message: 'Admin başarıyla oluşturuldu',
      token,
      admin: {
        id: result.rows[0].id,
        username: result.rows[0].username,
        email: result.rows[0].email,
        role: result.rows[0].role
      }
    });

  } catch (error) {
    console.error('Register error:', error); // Hatayı konsola yazdır
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