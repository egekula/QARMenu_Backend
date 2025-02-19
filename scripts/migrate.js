import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // .env dosyasını yükle

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  try {
    const sql = fs.readFileSync(
      path.join(__dirname, '../database/migrations/all_migrations.sql'),
      'utf8'
    );
    
    await pool.query(sql);
    console.log('Migration başarılı!');
  } catch (error) {
    console.error('Migration hatası:', error);
  } finally {
    await pool.end();
  }
}

migrate(); 