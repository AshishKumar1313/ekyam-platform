import express from 'express';
import {
  getStats,
  getAllUsers,
  deleteUser,
  getAllResources,
  getAllProjects,
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, admin);

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.get('/resources', getAllResources);
router.get('/projects', getAllProjects);

export default router;
