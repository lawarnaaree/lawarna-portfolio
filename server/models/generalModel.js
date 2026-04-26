import pool from '../config/db.js';

export const generalModel = {
  // About
  getAbout: async () => {
    const [rows] = await pool.query('SELECT * FROM about_info LIMIT 1');
    return rows[0];
  },
  updateAbout: async (data) => {
    const fields = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = Object.values(data);
    await pool.query(`UPDATE about_info SET ${fields}`, values);
  },

  // Contact
  createContact: async (data) => {
    const { name, email, phone, subject, message } = data;
    await pool.query(
      'INSERT INTO contacts (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, subject, message]
    );
  },
  getContacts: async () => {
    const [rows] = await pool.query('SELECT * FROM contacts ORDER BY created_at DESC');
    return rows;
  },
  updateContactStatus: async (id, status) => {
    // status is expected to be 'read' or 'unread'
    await pool.query('UPDATE contacts SET status = ? WHERE id = ?', [status, id]);
  },
  deleteContact: async (id) => {
    await pool.query('DELETE FROM contacts WHERE id = ?', [id]);
  },

  // Settings
  getSettings: async () => {
    const [rows] = await pool.query('SELECT * FROM site_settings');
    const settings = {};
    rows.forEach(row => { settings[row.setting_key] = row.setting_value; });
    return settings;
  },
  updateSetting: async (key, value) => {
    await pool.query(
      'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
      [key, value, value]
    );
  }
};
