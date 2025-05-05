import express from 'express';
import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'API is running',
    time: new Date().toISOString()
  });
});

// API routes
router.use('/users', userRoutes);
router.use('/products', productRoutes);

export default router;