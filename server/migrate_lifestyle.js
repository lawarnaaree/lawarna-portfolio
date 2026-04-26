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
    await pool.query(`
      CREATE TABLE IF NOT EXISTS post_likes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        post_id INT NOT NULL,
        fingerprint VARCHAR(64) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY unique_like (post_id, fingerprint),
        FOREIGN KEY (post_id) REFERENCES lifestyle_posts(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ post_likes table created');

    await pool.query(`
      CREATE TABLE IF NOT EXISTS post_comments (
        id INT PRIMARY KEY AUTO_INCREMENT,
        post_id INT NOT NULL,
        name VARCHAR(100) NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (post_id) REFERENCES lifestyle_posts(id) ON DELETE CASCADE
      )
    `);
    console.log('✓ post_comments table created');

    // Add media_type to highlights for video support
    try {
      await pool.query(`ALTER TABLE lifestyle_highlights ADD COLUMN media_type ENUM('image','video') DEFAULT 'image' AFTER cover_image`);
      console.log('✓ media_type column added to lifestyle_highlights');
    } catch (e) {
      if (e.code === 'ER_DUP_FIELDNAME') {
        console.log('✓ media_type column already exists in lifestyle_highlights');
      } else {
        throw e;
      }
    }

    console.log('\n✅ Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

migrate();
