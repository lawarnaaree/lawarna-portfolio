import pool from '../config/db.js';

export const authModel = {
  findByEmail: async (email) => {
    const [rows] = await pool.query(
      'SELECT * FROM admins WHERE email = ?',
      [email]
    );
    return rows[0];
  },

  findById: async (id) => {
    const [rows] = await pool.query(
      'SELECT id, name, email, avatar_url, last_login FROM admins WHERE id = ?',
      [id]
    );
    return rows[0];
  },

  updateLastLogin: async (id) => {
    await pool.query(
      'UPDATE admins SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
      [id]
    );
  }
};