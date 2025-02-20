import pool from '../config/database.js';

const migration = async () => {
  try {
    // Önce eski backup tablosunu sil
    await pool.query(`DROP TABLE IF EXISTS category_pics_backup;`);

    // Yeni backup oluştur
    await pool.query(`
      CREATE TABLE category_pics_backup AS 
      SELECT * FROM category_pics;
    `);

    // Mevcut kolonları güncelle
    await pool.query(`
      ALTER TABLE category_pics 
      DROP COLUMN IF EXISTS image_url CASCADE,
      ADD COLUMN IF NOT EXISTS base64_image TEXT,
      ADD COLUMN IF NOT EXISTS mime_type VARCHAR(50) DEFAULT 'image/jpeg';
    `);

    console.log('✅ Migration başarılı: Tablo yapısı güncellendi');

  } catch (error) {
    console.error('❌ Migration hatası:', error);
    console.error('Hata detayı:', error.detail || error.message);
  } finally {
    // Bağlantıyı kapat
    await pool.end();
  }
};

// Migration'ı çalıştır
migration()
  .then(() => console.log('Migration tamamlandı'))
  .catch(err => console.error('Migration başarısız:', err)); 