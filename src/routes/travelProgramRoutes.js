import express from 'express';
import travelProgramController from '../controllers/travelProgramController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all travel programs
router.get('/', travelProgramController.getAllTravelPrograms);

// Get travel program by name
router.get('/name/:name', travelProgramController.getTravelProgramByName);

// Create travel program template
router.post('/template', protect, travelProgramController.createTemplate);

// Add image to travel program's bgImages
router.post('/bg-image', protect, travelProgramController.addImageToBgImages);

router
  .route('/:id')
  .get(travelProgramController.getTravelProgramById)
  .delete(protect, travelProgramController.deleteTravelProgram);

// Update travel program first page
router.put('/:id/first-page', protect, travelProgramController.updateFirstPage);

// Update travel program review day
router.put('/:id/review-day/:dayIndex', protect, travelProgramController.updateReviewDay);

router
  .route('/:id/accommodation/:rowIndex')
  .put(protect, travelProgramController.updateAccommodationRow)
  .delete(protect, travelProgramController.deleteAccommodationRow);

export default router;
