import express from 'express';
import {
  getPublicStats,
  getCommunities,
  getFeaturedProjects,
} from '../controllers/publicController.js';

const router = express.Router();

router.get('/stats', getPublicStats);
router.get('/communities', getCommunities);
router.get('/featured-projects', getFeaturedProjects);

export default router;
