import pool from '../config/db.js';

export const projectsModel = {
  getAll: async (status = 'published') => {
    let query = `
      SELECT p.*, GROUP_CONCAT(DISTINCT t.name) as tags 
      FROM projects p 
      LEFT JOIN project_tag_map ptm ON p.id = ptm.project_id 
      LEFT JOIN project_tags t ON ptm.tag_id = t.id
    `;
    
    let params = [];
    if (status !== 'all') {
      query += ' WHERE p.status = ?';
      params.push(status);
    }
    
    query += ' GROUP BY p.id ORDER BY p.display_order ASC, p.created_at DESC';
    
    const [rows] = await pool.query(query, params);
    
    // Convert tags string to array
    return rows.map(row => ({
      ...row,
      tags: row.tags ? row.tags.split(',') : []
    }));
  },

  getOne: async (slugOrId) => {
    // 1. Get project and tags
    const query = `
      SELECT p.*, GROUP_CONCAT(DISTINCT t.name) as tags 
      FROM projects p 
      LEFT JOIN project_tag_map ptm ON p.id = ptm.project_id 
      LEFT JOIN project_tags t ON ptm.tag_id = t.id
      WHERE ${isNaN(slugOrId) ? 'p.slug' : 'p.id'} = ?
      GROUP BY p.id
    `;
    const [rows] = await pool.query(query, [slugOrId]);
    
    if (!rows[0]) return null;
    
    const project = rows[0];
    project.tags = project.tags ? project.tags.split(',') : [];

    // 2. Get media
    const [media] = await pool.query('SELECT media_url, media_type FROM project_media WHERE project_id = ? ORDER BY display_order ASC', [project.id]);
    project.media = media;
    
    return project;
  },

  create: async (data) => {
    const { 
      title, slug, short_description, long_description, thumbnail, 
      cover_image, live_url, github_url, status, is_featured, display_order, project_date,
      tags, media // Extract tags and media
    } = data;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const query = `
        INSERT INTO projects (
          title, slug, short_description, long_description, thumbnail, 
          cover_image, live_url, github_url, status, is_featured, display_order, project_date
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await connection.query(query, [
        title, slug, short_description, long_description, thumbnail, 
        cover_image, live_url, github_url, status || 'draft', is_featured || false, display_order || 0, project_date
      ]);

      const projectId = result.insertId;

      // Handle tags
      if (tags && tags.length > 0) {
        const tagList = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
        for (const tagName of tagList) {
          let [tagRows] = await connection.query('SELECT id FROM project_tags WHERE name = ?', [tagName]);
          let tagId;
          if (tagRows.length === 0) {
            const [tagResult] = await connection.query('INSERT INTO project_tags (name) VALUES (?)', [tagName]);
            tagId = tagResult.insertId;
          } else {
            tagId = tagRows[0].id;
          }
          await connection.query('INSERT INTO project_tag_map (project_id, tag_id) VALUES (?, ?)', [projectId, tagId]);
        }
      }

      // Handle media
      if (media && media.length > 0) {
        for (let i = 0; i < media.length; i++) {
          await connection.query(
            'INSERT INTO project_media (project_id, media_url, display_order) VALUES (?, ?, ?)',
            [projectId, media[i], i]
          );
        }
      }

      await connection.commit();
      return projectId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  update: async (id, data) => {
    // Specifically extract all non-column fields to prevent SQL errors
    const { tags, media, existing_media, ...projectData } = data;

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      let success = false;

      // Update project table - only if there are valid columns left
      if (Object.keys(projectData).length > 0) {
        const fields = Object.keys(projectData).map(key => `${key} = ?`).join(', ');
        const values = Object.values(projectData);
        const query = `UPDATE projects SET ${fields} WHERE id = ?`;
        const [result] = await connection.query(query, [...values, id]);
        success = result.affectedRows > 0;
      }

      // Sync tags
      if (tags !== undefined) {
        await connection.query('DELETE FROM project_tag_map WHERE project_id = ?', [id]);
        const tagList = Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []);
        for (const tagName of tagList) {
          let [tagRows] = await connection.query('SELECT id FROM project_tags WHERE name = ?', [tagName]);
          let tagId;
          if (tagRows.length === 0) {
            const [tagResult] = await connection.query('INSERT INTO project_tags (name) VALUES (?)', [tagName]);
            tagId = tagResult.insertId;
          } else {
            tagId = tagRows[0].id;
          }
          await connection.query('INSERT INTO project_tag_map (project_id, tag_id) VALUES (?, ?)', [id, tagId]);
        }
        success = true;
      }

      // Sync media (simple replace for now)
      if (media !== undefined) {
        await connection.query('DELETE FROM project_media WHERE project_id = ?', [id]);
        if (media.length > 0) {
          for (let i = 0; i < media.length; i++) {
            await connection.query(
              'INSERT INTO project_media (project_id, media_url, display_order) VALUES (?, ?, ?)',
              [id, media[i], i]
            );
          }
        }
        success = true;
      }

      await connection.commit();
      return success;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  },

  delete: async (id) => {
    const [result] = await pool.query('DELETE FROM projects WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
};