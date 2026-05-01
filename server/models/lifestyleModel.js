import pool from '../config/db.js';

export const lifestyleModel = {
  // ═══════════════════════════════════════════
  // HIGHLIGHTS
  // ═══════════════════════════════════════════
  getHighlights: async () => {
    // Fetch all highlights
    const [highlights] = await pool.query('SELECT * FROM lifestyle_highlights ORDER BY display_order ASC');
    
    // Fetch all items for these highlights
    if (highlights.length === 0) return [];
    
    const [items] = await pool.query('SELECT * FROM highlight_items ORDER BY highlight_id, order_index ASC');
    
    // Group items by highlight_id
    const itemsMap = items.reduce((acc, item) => {
      if (!acc[item.highlight_id]) acc[item.highlight_id] = [];
      acc[item.highlight_id].push(item);
      return acc;
    }, {});
    
    // Attach items to highlights
    return highlights.map(hl => ({
      ...hl,
      items: itemsMap[hl.id] || []
    }));
  },
  getHighlight: async (id) => {
    const [rows] = await pool.query('SELECT * FROM lifestyle_highlights WHERE id = ?', [id]);
    if (rows.length === 0) return null;
    
    const [items] = await pool.query('SELECT * FROM highlight_items WHERE highlight_id = ? ORDER BY order_index ASC', [id]);
    return { ...rows[0], items };
  },
  createHighlight: async (data) => {
    const { title, cover_image, media_type, display_order } = data;
    const [result] = await pool.query(
      'INSERT INTO lifestyle_highlights (title, cover_image, media_type, display_order) VALUES (?, ?, ?, ?)',
      [title, cover_image, media_type || 'image', display_order || 0]
    );
    return result.insertId;
  },
  updateHighlight: async (id, data) => {
    const { title, cover_image, media_type, display_order } = data;
    const fields = [];
    const values = [];
    if (title !== undefined) { fields.push('title = ?'); values.push(title); }
    if (cover_image !== undefined) { fields.push('cover_image = ?'); values.push(cover_image); }
    if (media_type !== undefined) { fields.push('media_type = ?'); values.push(media_type); }
    if (display_order !== undefined) { fields.push('display_order = ?'); values.push(parseInt(display_order, 10)); }
    if (fields.length === 0) return;
    values.push(id);
    await pool.query(`UPDATE lifestyle_highlights SET ${fields.join(', ')} WHERE id = ?`, values);
  },
  deleteHighlight: async (id) => {
    const [result] = await pool.query('DELETE FROM lifestyle_highlights WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // ═══════════════════════════════════════════
  // HIGHLIGHT ITEMS
  // ═══════════════════════════════════════════
  addHighlightItem: async (data) => {
    const { highlight_id, media_url, media_type, caption, order_index } = data;
    const [result] = await pool.query(
      'INSERT INTO highlight_items (highlight_id, media_url, media_type, caption, order_index) VALUES (?, ?, ?, ?, ?)',
      [highlight_id, media_url, media_type || 'image', caption, order_index || 0]
    );
    return result.insertId;
  },
  deleteHighlightItem: async (id) => {
    const [result] = await pool.query('DELETE FROM highlight_items WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // ═══════════════════════════════════════════
  // POSTS
  // ═══════════════════════════════════════════
  getPosts: async () => {
    const [rows] = await pool.query('SELECT * FROM lifestyle_posts ORDER BY posted_at DESC, created_at DESC');
    return rows;
  },
  getPost: async (id) => {
    const [rows] = await pool.query('SELECT * FROM lifestyle_posts WHERE id = ?', [id]);
    return rows[0];
  },
  createPost: async (data) => {
    const { media_url, media_type, caption, location, is_reel, posted_at } = data;
    const [result] = await pool.query(
      `INSERT INTO lifestyle_posts (media_url, media_type, caption, location, likes, comments, is_reel, posted_at)
       VALUES (?, ?, ?, ?, 0, 0, ?, ?)`,
      [media_url, media_type || 'image', caption, location, is_reel || false, posted_at || new Date()]
    );
    return result.insertId;
  },
  updatePost: async (id, data) => {
    const { caption, location, media_type, is_reel, media_url } = data;
    const fields = [];
    const values = [];
    if (caption !== undefined) { fields.push('caption = ?'); values.push(caption); }
    if (location !== undefined) { fields.push('location = ?'); values.push(location); }
    if (media_type !== undefined) { fields.push('media_type = ?'); values.push(media_type); }
    if (is_reel !== undefined) { fields.push('is_reel = ?'); values.push(is_reel); }
    if (media_url !== undefined) { fields.push('media_url = ?'); values.push(media_url); }
    if (fields.length === 0) return;
    values.push(id);
    await pool.query(`UPDATE lifestyle_posts SET ${fields.join(', ')} WHERE id = ?`, values);
  },
  deletePost: async (id) => {
    const [result] = await pool.query('DELETE FROM lifestyle_posts WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  // ═══════════════════════════════════════════
  // LIKES — Fingerprint-based deduplication
  // ═══════════════════════════════════════════
  checkLike: async (postId, fingerprint) => {
    const [rows] = await pool.query(
      'SELECT id FROM post_likes WHERE post_id = ? AND fingerprint = ?',
      [postId, fingerprint]
    );
    return rows.length > 0;
  },
  likePost: async (postId, fingerprint) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      await conn.query(
        'INSERT INTO post_likes (post_id, fingerprint) VALUES (?, ?)',
        [postId, fingerprint]
      );
      await conn.query(
        'UPDATE lifestyle_posts SET likes = likes + 1 WHERE id = ?',
        [postId]
      );
      await conn.commit();
      const [rows] = await conn.query('SELECT likes FROM lifestyle_posts WHERE id = ?', [postId]);
      return rows[0]?.likes || 0;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },
  unlikePost: async (postId, fingerprint) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [result] = await conn.query(
        'DELETE FROM post_likes WHERE post_id = ? AND fingerprint = ?',
        [postId, fingerprint]
      );
      if (result.affectedRows > 0) {
        await conn.query(
          'UPDATE lifestyle_posts SET likes = GREATEST(likes - 1, 0) WHERE id = ?',
          [postId]
        );
      }
      await conn.commit();
      const [rows] = await conn.query('SELECT likes FROM lifestyle_posts WHERE id = ?', [postId]);
      return rows[0]?.likes || 0;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },
  getLikedPostIds: async (fingerprint) => {
    const [rows] = await pool.query(
      'SELECT post_id FROM post_likes WHERE fingerprint = ?',
      [fingerprint]
    );
    return rows.map(r => r.post_id);
  },

  // ═══════════════════════════════════════════
  // COMMENTS
  // ═══════════════════════════════════════════
  getComments: async (postId) => {
    const [rows] = await pool.query(
      'SELECT * FROM post_comments WHERE post_id = ? ORDER BY created_at DESC',
      [postId]
    );
    return rows;
  },
  addComment: async (postId, name, comment) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [result] = await conn.query(
        'INSERT INTO post_comments (post_id, name, comment) VALUES (?, ?, ?)',
        [postId, name, comment]
      );
      await conn.query(
        'UPDATE lifestyle_posts SET comments = comments + 1 WHERE id = ?',
        [postId]
      );
      await conn.commit();
      // Return the full comment
      const [rows] = await conn.query('SELECT * FROM post_comments WHERE id = ?', [result.insertId]);
      return rows[0];
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  },
  deleteComment: async (id) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      // Get the post_id before deleting
      const [rows] = await conn.query('SELECT post_id FROM post_comments WHERE id = ?', [id]);
      if (rows.length === 0) return false;
      await conn.query('DELETE FROM post_comments WHERE id = ?', [id]);
      await conn.query(
        'UPDATE lifestyle_posts SET comments = GREATEST(comments - 1, 0) WHERE id = ?',
        [rows[0].post_id]
      );
      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
};
