import pool from '../config/db.js';

export const journeyModel = {
  getAll: async () => {
    const [rows] = await pool.query('SELECT * FROM journey_entries ORDER BY start_date DESC');
    return rows;
  },

  create: async (data) => {
    const { title, company, role, start_date, end_date, is_current, description, type } = data;
    const query = `
      INSERT INTO journey_entries (title, company, role, start_date, end_date, is_current, description, type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await pool.query(query, [
      title, company, role, start_date, end_date, is_current || false, description, type || 'work'
    ]);
    return result.insertId;
  },

  update: async (id, data) => {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    const query = `UPDATE journey_entries SET ${fields} WHERE id = ?`;
    const [result] = await pool.query(query, [...values, id]);
    return result.affectedRows > 0;
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM journey_entries WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};
