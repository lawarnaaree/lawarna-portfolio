import { lifestyleModel } from '../models/lifestyleModel.js';

// Highlights
export const getHighlights = async (req, res, next) => {
  try {
    const data = await lifestyleModel.getHighlights();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const addHighlight = async (req, res, next) => {
  try {
    const id = await lifestyleModel.createHighlight(req.body);
    res.status(201).json({ success: true, data: { id, ...req.body } });
  } catch (error) {
    next(error);
  }
};

export const deleteHighlight = async (req, res, next) => {
  try {
    await lifestyleModel.deleteHighlight(req.params.id);
    res.status(200).json({ success: true, message: 'Highlight deleted' });
  } catch (error) {
    next(error);
  }
};

// Posts
export const getPosts = async (req, res, next) => {
  try {
    const data = await lifestyleModel.getPosts();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const addPost = async (req, res, next) => {
  try {
    const id = await lifestyleModel.createPost(req.body);
    res.status(201).json({ success: true, data: { id, ...req.body } });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  try {
    await lifestyleModel.deletePost(req.params.id);
    res.status(200).json({ success: true, message: 'Post deleted' });
  } catch (error) {
    next(error);
  }
};
