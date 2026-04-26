import express from 'express';
import { 
  getProjects, getProject, addProject, updateProject, deleteProject 
} from '../controllers/projectsController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { upload } from '../middlewares/uploadMiddleware.js';
import { apiReadLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.route('/')
  .get(apiReadLimiter, getProjects)
  .post(protect, upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'media', maxCount: 5 }
  ]), addProject);

router.route('/:id')
  .get(apiReadLimiter, getProject)
  .put(protect, upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'media', maxCount: 5 }
  ]), updateProject)
  .delete(protect, deleteProject);

export default router;