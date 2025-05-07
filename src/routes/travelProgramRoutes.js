import express from 'express';
import { addImageToBgImages, getAllTravelPrograms, createTemplate, getTravelProgramById, getTravelProgramByName, deleteTravelProgram } from '../controllers/travelProgramController.js';

const router = express.Router();

// Get all travel programs
router.get('/', getAllTravelPrograms);

// Get travel program by ID
router.get('/:id', getTravelProgramById);

// Get travel program by name
router.get('/name/:name', getTravelProgramByName);

// Create travel program template
router.post('/template', createTemplate);

// Add image to travel program's bgImages
router.post('/bg-image/', addImageToBgImages);

// Delete travel program
router.delete('/:id', deleteTravelProgram);

export default router;