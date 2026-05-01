import express from 'express';
import { 
  getHighlights, getHighlight, addHighlight, updateHighlight, deleteHighlight,
  addHighlightItem, deleteHighlightItem,
  getPosts, getPost, addPost, updatePost, deletePost,
  likePost, unlikePost, getLikedPosts,
  getComments, addComment, deleteComment
} from '../controllers/lifestyleController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { apiReadLimiter, contactLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

// Highlights
router.get('/highlights', apiReadLimiter, getHighlights);
router.get('/highlights/single/:id', apiReadLimiter, getHighlight);
router.post('/highlights', protect, upload.single('cover_image'), addHighlight);
router.put('/highlights/:id', protect, upload.single('cover_image'), updateHighlight);
router.delete('/highlights/:id', protect, deleteHighlight);

// Highlight Items
router.post('/highlights/:highlight_id/items', protect, upload.single('media'), addHighlightItem);
router.delete('/highlights/items/:itemId', protect, deleteHighlightItem);

// Posts
router.get('/posts', apiReadLimiter, getPosts);
router.get('/posts/:id', apiReadLimiter, getPost);
router.post('/posts', protect, upload.single('media'), addPost);
router.put('/posts/:id', protect, upload.single('media'), updatePost);
router.delete('/posts/:id', protect, deletePost);

// Likes (public, rate-limited)
router.get('/likes', apiReadLimiter, getLikedPosts);
router.post('/posts/:id/like', contactLimiter, likePost);
router.delete('/posts/:id/like', contactLimiter, unlikePost);

// Comments (public post, admin delete)
router.get('/posts/:id/comments', apiReadLimiter, getComments);
router.post('/posts/:id/comments', contactLimiter, addComment);
router.delete('/comments/:id', protect, deleteComment);

export default router;
