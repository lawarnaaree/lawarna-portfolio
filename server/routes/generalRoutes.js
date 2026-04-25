import express from 'express';
import { 
  getAbout, updateAbout, submitContact, getMessages, getSettings, updateSetting 
} from '../controllers/generalController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/about', getAbout);
router.put('/about', protect, updateAbout);

router.post('/contact', submitContact);
router.get('/messages', protect, getMessages);

router.get('/settings', getSettings);
router.put('/settings', protect, updateSetting);

export default router;
