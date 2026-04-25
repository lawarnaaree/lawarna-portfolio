import express from 'express';
import { loginAdmin, getMe } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/login', loginAdmin);
router.get('/me', protect, getMe);

export default router;