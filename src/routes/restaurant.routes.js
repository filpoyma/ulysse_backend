import express from 'express';
import restaurantController from '../controllers/restaurantController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Получить все рестораны
router.get('/', restaurantController.getAllRestaurants);

// Создать ресторан
router.post('/', protect, restaurantController.createRestaurant);

// Копировать ресторан
router.post('/copy', protect, restaurantController.copyRestaurant);

// Обновить главное изображение ресторана
router.put('/update-title-image', protect, restaurantController.updateTitleImage);

// Обновить галерею ресторана
router.put('/update-gallery', protect, restaurantController.updateGallery);

// Получить один ресторан по id
router.get('/:id', restaurantController.getRestaurantById);

// Получить один ресторан по name_eng
router.get('/name/:name', restaurantController.getRestaurantByName);

// Обновить ресторан
router.put('/:id', protect, restaurantController.updateRestaurant);

// Удалить ресторан
router.delete('/:id', protect, restaurantController.deleteRestaurant);

export default router;
