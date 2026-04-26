import pool from '../config/db.js';

export const dashboardModel = {
  getStats: async () => {
    // 1. Projects Count
    const [projects] = await pool.query('SELECT COUNT(*) as count FROM projects');
    
    // 2. Messages Count (Total and Unread)
    const [messages] = await pool.query('SELECT COUNT(*) as total, SUM(CASE WHEN status = "unread" THEN 1 ELSE 0 END) as unread FROM contacts');
    
    // 3. Lifestyle Stats (Total posts, Total likes, Total comments)
    const [lifestyle] = await pool.query('SELECT COUNT(*) as total_posts, SUM(likes) as total_likes, SUM(comments) as total_comments FROM lifestyle_posts');
    
    // 4. Journey Count
    const [journey] = await pool.query('SELECT COUNT(*) as count FROM journey_entries');

    return {
      projects: projects[0].count,
      messages: {
        total: messages[0].total || 0,
        unread: messages[0].unread || 0
      },
      lifestyle: {
        posts: lifestyle[0].total_posts || 0,
        likes: lifestyle[0].total_likes || 0,
        comments: lifestyle[0].total_comments || 0
      },
      journey: journey[0].count
    };
  },

  getRecentActivity: async () => {
    // Combine recent entries from multiple tables
    const [projects] = await pool.query('SELECT id, "project" as type, title as label, created_at FROM projects ORDER BY created_at DESC LIMIT 5');
    const [messages] = await pool.query('SELECT id, "message" as type, name as label, created_at FROM contacts ORDER BY created_at DESC LIMIT 5');
    const [posts] = await pool.query('SELECT id, "post" as type, caption as label, created_at FROM lifestyle_posts ORDER BY created_at DESC LIMIT 5');

    const activity = [...projects, ...messages, ...posts]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 10);

    return activity;
  },

  getEngagementOverTime: async () => {
    // This is for a small chart - likes in the last 7 days
    const [rows] = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count 
      FROM post_likes 
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    return rows;
  }
};
