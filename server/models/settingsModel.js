import pool from '../config/db.js';

export const settingsModel = {
  getAllSettings: async () => {
    const [rows] = await pool.query('SELECT setting_key, setting_value FROM site_settings');
    // Convert to a flat object
    return rows.reduce((acc, row) => {
      acc[row.setting_key] = row.setting_value;
      return acc;
    }, {});
  },

  updateSettings: async (settingsObj) => {
    const entries = Object.entries(settingsObj);
    if (entries.length === 0) return;

    // Use a transaction for multiple updates
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      for (const [key, value] of entries) {
        await conn.query(
          'INSERT INTO site_settings (setting_key, setting_value) VALUES (?, ?) ON DUPLICATE KEY UPDATE setting_value = ?',
          [key, value, value]
        );
      }
      await conn.commit();
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }
};
