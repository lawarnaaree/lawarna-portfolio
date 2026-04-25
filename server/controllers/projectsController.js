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
    const success = await projectsModel.update(req.params.id, req.body);
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