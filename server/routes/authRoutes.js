import express from 'express';
import { loginAdmin, getMe } from '../controllers/authController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { authLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.post('/login', authLimiter, loginAdmin);
router.get('/me', protect, getMe);

export default router;