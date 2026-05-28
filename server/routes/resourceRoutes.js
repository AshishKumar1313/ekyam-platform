import express from 'express';
import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  deleteResource,
  requestResource,
} from '../controllers/resourceController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getResources);
router.get('/:id', getResourceById);
router.post('/', protect, createResource);
router.put('/:id', protect, updateResource);
router.delete('/:id', protect, deleteResource);
router.post('/:id/request', protect, requestResource);

export default router;
