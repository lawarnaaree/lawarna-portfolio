import express from 'express';
import { 
  getJourney, addJourneyEntry, updateJourneyEntry, deleteJourneyEntry 
} from '../controllers/journeyController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getJourney)
  .post(protect, addJourneyEntry);

router.route('/:id')
  .put(protect, updateJourneyEntry)
  .delete(protect, deleteJourneyEntry);

export default router;
