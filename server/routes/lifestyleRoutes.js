import express from 'express';
import { 
  getHighlights, addHighlight, deleteHighlight,
  getPosts, addPost, deletePost
} from '../controllers/lifestyleController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/highlights', getHighlights);
router.post('/highlights', protect, addHighlight);
router.delete('/highlights/:id', protect, deleteHighlight);

router.get('/posts', getPosts);
router.post('/posts', protect, addPost);
router.delete('/posts/:id', protect, deletePost);

export default router;
