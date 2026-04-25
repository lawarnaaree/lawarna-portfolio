import pool from '../config/db.js';

export const projectsModel = {
  getAll: async (status = 'published') => {
    const query = status === 'all' 
      ? 'SELECT * FROM projects ORDER BY display_order ASC, created_at DESC'
      : 'SELECT * FROM projects WHERE status = ? ORDER BY display_order ASC, created_at DESC';
    
    const params = status === 'all' ? [] : [status];
    const [rows] = await pool.query(query, params);
    return rows;
  },

  getOne: async (slugOrId) => {
    const query = isNaN(slugOrId) 
      ? 'SELECT * FROM projects WHERE slug = ?'
      : 'SELECT * FROM projects WHERE id = ?';
    const [rows] = await pool.query(query, [slugOrId]);
    return rows[0];
  },

  create: async (data) => {
    const { 
      title, slug, short_description, long_description, thumbnail, 
      cover_image, live_url, github_url, status, is_featured, display_order, project_date 
    } = data;

    const query = `
      INSERT INTO projects (
        title, slug, short_description, long_description, thumbnail, 
        cover_image, live_url, github_url, status, is_featured, display_order, project_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(query, [
      title, slug, short_description, long_description, thumbnail, 
      cover_image, live_url, github_url, status || 'draft', is_featured || false, display_order || 0, project_date
    ]);

    return result.insertId;
  },

  update: async (id, data) => {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    
    const query = `UPDATE projects SET ${fields} WHERE id = ?`;
    const [result] = await pool.query(query, [...values, id]);
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};