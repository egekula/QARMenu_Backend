import pool from '../config/database.js';

const updateCategoryPics = async () => {
  try {
    // Önce temp tabloyu temizle (eğer varsa)
    await pool.query('DROP TABLE IF EXISTS category_pics_temp');

    // Geçici tablo oluştur
    await pool.query(`
      CREATE TABLE category_pics_temp (
        id SERIAL PRIMARY KEY,
        category_name VARCHAR(255) NOT NULL,
        image_url TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Mevcut verileri geçici tabloya kopyala
    // base64_image'ı image_url olarak kullan
    await pool.query(`
      INSERT INTO category_pics_temp (category_name, image_url, created_at)
      SELECT category_name, base64_image, created_at
      FROM category_pics
    `);

    // Eski tabloyu sil
    await pool.query('DROP TABLE IF EXISTS category_pics CASCADE');

    // Geçici tabloyu yeniden adlandır
    await pool.query('ALTER TABLE category_pics_temp RENAME TO category_pics');

    console.log('✅ Category pics tablosu başarıyla güncellendi');
  } catch (error) {
    console.error('❌ Migration hatası:', error);
    // Hata detayını göster
    if (error.detail) {
      console.error('Hata detayı:', error.detail);
    }
  } finally {
    await pool.end();
  }
};

updateCategoryPics(); 