import express from 'express';
import restaurantsListController from '../controllers/restaurantsListController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Получить все списки ресторанов
router.get('/', restaurantsListController.getAllRestaurantsLists);

// Получить один список ресторанов по id
router.get('/:id', restaurantsListController.getRestaurantsListById);

// Создать список ресторанов
router.post('/', protect, restaurantsListController.createRestaurantsList);

// Обновить список ресторанов
router.patch('/:id', protect, restaurantsListController.updateRestaurantsList);

// Удалить список ресторанов
router.delete('/:id', protect, restaurantsListController.deleteRestaurantsList);

// Добавить ресторан в список
router.post('/:listId/restaurants/:restaurantId', protect, restaurantsListController.addRestaurantToList);

// Удалить ресторан из списка
router.delete('/:listId/restaurants/:restaurantId', protect, restaurantsListController.removeRestaurantFromList);

export default router; 