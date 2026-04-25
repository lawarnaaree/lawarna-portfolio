import express from 'express';
import { 
  getProjects, getProject, addProject, updateProject, deleteProject 
} from '../controllers/projectsController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getProjects)
  .post(protect, addProject);

router.route('/:id')
  .get(getProject)
  .put(protect, updateProject)
  .delete(protect, deleteProject);

export default router;