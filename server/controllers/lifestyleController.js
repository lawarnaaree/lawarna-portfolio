import { lifestyleModel } from '../models/lifestyleModel.js';

// ═══════════════════════════════════════════
// HIGHLIGHTS
// ═══════════════════════════════════════════
export const getHighlights = async (req, res, next) => {
  try {
    const data = await lifestyleModel.getHighlights();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getHighlight = async (req, res, next) => {
  try {
    const { id } = req.params;
    console.log(`Fetching highlight with ID: ${id}`);
    
    // Explicitly parse ID as integer to be safe
    const highlightId = parseInt(id, 10);
    if (isNaN(highlightId)) {
      res.status(400);
      throw new Error('Invalid highlight ID');
    }

    const data = await lifestyleModel.getHighlight(highlightId);
    if (!data) {
      console.warn(`Highlight not found for ID: ${highlightId}`);
      res.status(404);
      throw new Error('Highlight not found');
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const addHighlight = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.cover_image = `/uploads/${req.file.filename}`;
    }
    if (data.display_order) data.display_order = parseInt(data.display_order, 10);

    const id = await lifestyleModel.createHighlight(data);
    res.status(201).json({ success: true, data: { id, ...data } });
  } catch (error) {
    next(error);
  }
};

export const updateHighlight = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.cover_image = `/uploads/${req.file.filename}`;
    }
    if (data.display_order) data.display_order = parseInt(data.display_order, 10);
    await lifestyleModel.updateHighlight(req.params.id, data);
    res.status(200).json({ success: true, message: 'Highlight updated' });
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

// ═══════════════════════════════════════════
// HIGHLIGHT ITEMS
// ═══════════════════════════════════════════
export const addHighlightItem = async (req, res, next) => {
  try {
    const { highlight_id } = req.params;
    const data = { ...req.body, highlight_id };
    if (req.file) {
      data.media_url = `/uploads/${req.file.filename}`;
    }
    if (data.order_index) data.order_index = parseInt(data.order_index, 10);

    const id = await lifestyleModel.addHighlightItem(data);
    res.status(201).json({ success: true, data: { id, ...data } });
  } catch (error) {
    next(error);
  }
};

export const deleteHighlightItem = async (req, res, next) => {
  try {
    await lifestyleModel.deleteHighlightItem(req.params.itemId);
    res.status(200).json({ success: true, message: 'Highlight item deleted' });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════
// POSTS
// ═══════════════════════════════════════════
export const getPosts = async (req, res, next) => {
  try {
    const data = await lifestyleModel.getPosts();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const getPost = async (req, res, next) => {
  try {
    const data = await lifestyleModel.getPost(req.params.id);
    if (!data) {
      res.status(404);
      throw new Error('Post not found');
    }
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const addPost = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.media_url = `/uploads/${req.file.filename}`;
    }
    if (data.is_reel === 'true' || data.is_reel === '1') data.is_reel = true;
    if (data.is_reel === 'false' || data.is_reel === '0') data.is_reel = false;

    const id = await lifestyleModel.createPost(data);
    res.status(201).json({ success: true, data: { id, ...data } });
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.media_url = `/uploads/${req.file.filename}`;
    }
    if (data.is_reel === 'true' || data.is_reel === '1') data.is_reel = true;
    if (data.is_reel === 'false' || data.is_reel === '0') data.is_reel = false;

    await lifestyleModel.updatePost(req.params.id, data);
    res.status(200).json({ success: true, message: 'Post updated' });
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

// ═══════════════════════════════════════════
// LIKES — Fingerprint-based
// ═══════════════════════════════════════════
export const likePost = async (req, res, next) => {
  try {
    const { fingerprint } = req.body;
    if (!fingerprint) {
      res.status(400);
      throw new Error('Fingerprint is required');
    }
    const likes = await lifestyleModel.likePost(req.params.id, fingerprint);
    res.status(200).json({ success: true, data: { likes, liked: true } });
  } catch (error) {
    // Duplicate like — silently return current count
    if (error.code === 'ER_DUP_ENTRY') {
      const post = await lifestyleModel.getPost(req.params.id);
      return res.status(200).json({ success: true, data: { likes: post?.likes || 0, liked: true } });
    }
    next(error);
  }
};

export const unlikePost = async (req, res, next) => {
  try {
    const { fingerprint } = req.body;
    if (!fingerprint) {
      res.status(400);
      throw new Error('Fingerprint is required');
    }
    const likes = await lifestyleModel.unlikePost(req.params.id, fingerprint);
    res.status(200).json({ success: true, data: { likes, liked: false } });
  } catch (error) {
    next(error);
  }
};

export const getLikedPosts = async (req, res, next) => {
  try {
    const { fingerprint } = req.query;
    if (!fingerprint) {
      return res.status(200).json({ success: true, data: [] });
    }
    const likedIds = await lifestyleModel.getLikedPostIds(fingerprint);
    res.status(200).json({ success: true, data: likedIds });
  } catch (error) {
    next(error);
  }
};

// ═══════════════════════════════════════════
// COMMENTS
// ═══════════════════════════════════════════
export const getComments = async (req, res, next) => {
  try {
    const data = await lifestyleModel.getComments(req.params.id);
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const { name, comment } = req.body;
    if (!name || !comment) {
      res.status(400);
      throw new Error('Name and comment are required');
    }
    const data = await lifestyleModel.addComment(req.params.id, name.trim(), comment.trim());
    res.status(201).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const deleteComment = async (req, res, next) => {
  try {
    await lifestyleModel.deleteComment(req.params.id);
    res.status(200).json({ success: true, message: 'Comment deleted' });
  } catch (error) {
    next(error);
  }
};
