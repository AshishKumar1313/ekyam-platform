import express from 'express';
import {
  getMyCollaborations,
  updateCollaborationStatus,
} from '../controllers/collaborationController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/mine', protect, getMyCollaborations);
router.patch('/:id', protect, updateCollaborationStatus);

export default router;
