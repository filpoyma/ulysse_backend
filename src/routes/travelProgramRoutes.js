import express from 'express';
import {
  addImageToBgImages,
  getAllTravelPrograms,
  createTemplate,
  getTravelProgramById,
  getTravelProgramByName,
  deleteTravelProgram,
  updateFirstPage,
  updateReviewDay,
  updateAccommodationRow,
  deleteAccommodationRow,
} from '../controllers/travelProgramController.js';

const router = express.Router();

// Get all travel programs
router.get('/', getAllTravelPrograms);

// Get travel program by name
router.get('/name/:name', getTravelProgramByName);

// Create travel program template
router.post('/template', createTemplate);

// Add image to travel program's bgImages
router.post('/bg-image', addImageToBgImages);

router.delete('/:id', deleteTravelProgram);
router.get('/:id', getTravelProgramById);

// Update travel program first page
router.put('/:id/first-page', updateFirstPage);

// Update travel program review day
router.put('/:id/review-day/:dayIndex', updateReviewDay);

router.put('/:id/accommodation/:rowIndex', updateAccommodationRow);
router.delete('/:id/accommodation/:rowIndex', deleteAccommodationRow);

export default router;
