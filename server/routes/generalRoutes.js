import express from 'express';
import { 
  getAbout, updateAbout, submitContact, getMessages, updateMessage, deleteMessage, getSettings, updateSetting 
} from '../controllers/generalController.js';
import { protect } from '../middlewares/authMiddleware.js';
import { contactLimiter, apiReadLimiter } from '../middlewares/rateLimiter.js';

const router = express.Router();

router.get('/about', apiReadLimiter, getAbout);
router.put('/about', protect, updateAbout);

router.post('/contact', contactLimiter, submitContact);
router.get('/messages', protect, getMessages);
router.put('/messages/:id', protect, updateMessage);
router.delete('/messages/:id', protect, deleteMessage);

router.get('/settings', getSettings);
router.put('/settings', protect, updateSetting);
export default router;
