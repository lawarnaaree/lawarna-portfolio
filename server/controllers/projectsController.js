import { projectsModel } from '../models/projectsModel.js';
import slugify from 'slugify';

export const getProjects = async (req, res, next) => {
  try {
    const { status } = req.query;
    const projects = await projectsModel.getAll(status);
    res.status(200).json({ success: true, count: projects.length, data: projects });
  } catch (error) {
    next(error);
  }
};

export const getProject = async (req, res, next) => {
  try {
    const project = await projectsModel.getOne(req.params.id);
    if (!project) {
      res.status(404);
      throw new Error('Project not found');
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
};

export const addProject = async (req, res, next) => {
  try {
    const data = { ...req.body };
    
    // Handle Files
    if (req.files) {
      if (req.files.thumbnail) {
        data.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
      }
      if (req.files.media) {
        data.media = req.files.media.map(file => `/uploads/${file.filename}`);
      }
    }

    // Convert string booleans/numbers from FormData
    if (data.is_featured === 'true' || data.is_featured === '1') data.is_featured = true;
    if (data.is_featured === 'false' || data.is_featured === '0') data.is_featured = false;
    if (data.display_order) data.display_order = parseInt(data.display_order, 10);

    if (!data.slug && data.title) {
      data.slug = slugify(data.title, { lower: true, strict: true });
    }

    const id = await projectsModel.create(data);
    res.status(201).json({
      success: true,
      message: 'Project added successfully',
      data: { id, ...data }
    });
  } catch (error) {
    next(error);
  }
};

export const updateProject = async (req, res, next) => {
  try {
    const data = { ...req.body };

    // Handle Files
    if (req.files) {
      if (req.files.thumbnail) {
        data.thumbnail = `/uploads/${req.files.thumbnail[0].filename}`;
      }
      
      const newMedia = req.files.media ? req.files.media.map(file => `/uploads/${file.filename}`) : [];
      const existingMedia = req.body.existing_media || [];
      
      // If media files are uploaded OR existing_media is provided (even if empty)
      // we want to sync the media gallery.
      if (req.files.media || req.body.existing_media !== undefined) {
        data.media = [...(Array.isArray(existingMedia) ? existingMedia : [existingMedia]), ...newMedia];
      }
    } else if (req.body.existing_media !== undefined) {
      // No new files, but maybe some existing media were removed
      const existingMedia = req.body.existing_media || [];
      data.media = Array.isArray(existingMedia) ? existingMedia : [existingMedia];
    }

    // Convert string booleans/numbers from FormData
    if (data.is_featured === 'true' || data.is_featured === '1') data.is_featured = true;
    if (data.is_featured === 'false' || data.is_featured === '0') data.is_featured = false;
    if (data.display_order) data.display_order = parseInt(data.display_order, 10);

    const success = await projectsModel.update(req.params.id, data);
    if (!success) {
      res.status(404);
      throw new Error('Project not found or no changes made');
    }
    res.status(200).json({ success: true, message: 'Project updated successfully' });
  } catch (error) {
    next(error);
  }
};

export const deleteProject = async (req, res, next) => {
  try {
    const success = await projectsModel.delete(req.params.id);
    if (!success) {
      res.status(404);
      throw new Error('Project not found');
    }
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};