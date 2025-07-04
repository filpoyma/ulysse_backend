import express from 'express';
import authRoutes from './authRoutes.js';
import travelProgramRoutes from './travelProgramRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import hotelRoutes from './hotel.routes.js';
import hotelsListRoutes from './hotelsListRoutes.js';
import restaurantRoutes from './restaurant.routes.js';
import countryRoutes from './countryRoutes.js';
import mapRoutes from './mapRoutes.js';
import restaurantsListRoutes from './restaurantsListRoutes.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  console.log('origin:', req.get('origin'));
  console.log('host:', req.get('host'));
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    time: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/travel-program', travelProgramRoutes);
router.use('/upload', uploadRoutes);
router.use('/hotels', hotelRoutes);
router.use('/hotels-lists', hotelsListRoutes);
router.use('/restaurants', restaurantRoutes);
router.use('/countries', countryRoutes);
router.use('/map', mapRoutes);
router.use('/restaurants-lists', restaurantsListRoutes);

export default router;
