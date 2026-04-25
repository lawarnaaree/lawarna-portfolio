import pool from '../config/db.js';

export const lifestyleModel = {
  // Highlights
  getHighlights: async () => {
    const [rows] = await pool.query('SELECT * FROM lifestyle_highlights ORDER BY display_order ASC');
    return rows;
  },
  createHighlight: async (data) => {
    const { title, cover_image, display_order } = data;
    const [result] = await pool.query(
      'INSERT INTO lifestyle_highlights (title, cover_image, display_order) VALUES (?, ?, ?)',
      [title, cover_image, display_order || 0]
    );
    return result.insertId;
  },
  deleteHighlight: async (id) => {
    const [result] = await pool.query('DELETE FROM lifestyle_highlights WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // Posts
  getPosts: async () => {
    const [rows] = await pool.query('SELECT * FROM lifestyle_posts ORDER BY posted_at DESC, created_at DESC');
    return rows;
  },
  createPost: async (data) => {
    const { media_url, media_type, caption, location, likes, comments, is_reel, posted_at } = data;
    const query = `
      INSERT INTO lifestyle_posts (media_url, media_type, caption, location, likes, comments, is_reel, posted_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      media_url, media_type || 'image', caption, location, likes || 0, comments || 0, is_reel || false, posted_at
    ]);
    return result.insertId;
  },
  deletePost: async (id) => {
    const [result] = await pool.query('DELETE FROM lifestyle_posts WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};
