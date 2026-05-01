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
    console.log('🚀 Starting Production Migration...');

    // 1. Lifestyle Posts
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lifestyle_posts (
        id INT PRIMARY KEY AUTO_INCREMENT,
        media_url VARCHAR(255) NOT NULL,
        media_type ENUM('image', 'video') DEFAULT 'image',
        caption TEXT,
        location VARCHAR(100),
        likes INT DEFAULT 0,
        comments INT DEFAULT 0,
        is_reel TINYINT(1) DEFAULT 0,
        posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ lifestyle_posts table checked');

    // 2. Lifestyle Highlights
    await pool.query(`
      CREATE TABLE IF NOT EXISTS lifestyle_highlights (
        id INT PRIMARY KEY AUTO_INCREMENT,
        title VARCHAR(100) NOT NULL,
        cover_image VARCHAR(255) NOT NULL,
        media_type ENUM('image', 'video') DEFAULT 'image',
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ lifestyle_highlights table checked');

    // 3. Highlight Items (Stories)
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
    console.log('✓ highlight_items table checked');

    // 4. Post Likes
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
    console.log('✓ post_likes table checked');

    // 5. Post Comments
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
    console.log('✓ post_comments table checked');

    // 6. Ensure columns exist (for existing tables)
    const [columns] = await pool.query('SHOW COLUMNS FROM lifestyle_highlights LIKE "media_type"');
    if (columns.length === 0) {
      await pool.query(`ALTER TABLE lifestyle_highlights ADD COLUMN media_type ENUM('image','video') DEFAULT 'image' AFTER cover_image`);
      console.log('✓ media_type column added to lifestyle_highlights');
    }

    console.log('\n✅ Production Database Migration Complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

migrate();
