import express from 'express';
import * as countryController from '../controllers/countryController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router
  .route('/')
  .get(countryController.getAllCountries)
  .post(protect, countryController.createCountry);

router
  .route('/:id')
  .get(countryController.getCountry)
  .patch(protect, countryController.updateCountry)
  .delete(protect, countryController.deleteCountry);

export default router;
