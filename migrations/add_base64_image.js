import pool from '../config/database.js';

const migration = async () => {
  try {
    // Önce mevcut tabloyu yedekle
    await pool.query(`
      CREATE TABLE category_pics_backup AS 
      SELECT * FROM category_pics;
    `);

    // Mevcut tabloyu düzenle
    await pool.query(`
      ALTER TABLE category_pics 
      ADD COLUMN base64_image TEXT,
      ADD COLUMN mime_type VARCHAR(50);
    `);

    console.log('✅ Migration başarılı: base64_image ve mime_type kolonları eklendi');

  } catch (error) {
    console.error('❌ Migration hatası:', error);
    
    // Hata durumunda geri al
    try {
      await pool.query('DROP TABLE IF EXISTS category_pics_backup;');
    } catch (rollbackError) {
      console.error('Rollback hatası:', rollbackError);
    }
  }
};

migration(); 