import express from 'express';
import mapController from '../controllers/mapController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Update logistics for a travel program
router.put('/:programId/logistics', protect, mapController.updateLogistics);

export default router; 