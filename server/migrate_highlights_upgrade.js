import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'lawarna_portfolio'
});

async function migrate() {
  try {
    console.log('Starting highlights upgrade migration...');

    // 1. Create highlight_items table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS highlight_items (
        id INT PRIMARY KEY AUTO_INCREMENT,
        highlight_id INT NOT NULL,
        media_url VARCHAR(255) NOT NULL,
        media_type ENUM('image', 'video') DEFAULT 'image',
        caption TEXT,
        order_index INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (highlight_id) REFERENCES lifestyle_highlights(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ highlight_items table created');

    console.log('\n✅ Highlights Upgrade Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
