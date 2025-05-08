import express from 'express';
import restaurantController from '../controllers/restaurantController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Получить все рестораны
router.get('/', restaurantController.getAllRestaurants);

// Получить один ресторан по id
router.get('/:id', restaurantController.getRestaurantById);

// Создать ресторан
router.post('/', protect, restaurantController.createRestaurant);

// Обновить ресторан
router.put('/:id', protect, restaurantController.updateRestaurant);

// Удалить ресторан
router.delete('/:id', protect, restaurantController.deleteRestaurant);

export default router; 