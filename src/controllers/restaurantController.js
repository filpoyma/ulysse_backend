import Restaurant from '../models/restaurantModel.js';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiError.js';

// Получить все рестораны
const getAllRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find();
  res.status(200).json({ success: true, data: restaurants });
});

// Получить один ресторан по id
const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');
  res.status(200).json({ success: true, data: restaurant });
});

// Создать ресторан
const createRestaurant = asyncHandler(async (req, res) => {
  const { name, country, city, region, manager, stars } = req.body;
  if (!name || !country || !city || !region || !manager || !stars) {
    throw new ApiError(400, 'All fields are required');
  }
  const restaurant = await Restaurant.create({ name, country, city, region, manager, stars });
  res.status(201).json({ success: true, data: restaurant });
});

// Обновить ресторан
const updateRestaurant = asyncHandler(async (req, res) => {
  const { name, country, city, region, manager, stars } = req.body;
  const restaurant = await Restaurant.findByIdAndUpdate(
    req.params.id,
    { name, country, city, region, manager, stars },
    { new: true, runValidators: true }
  );
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');
  res.status(200).json({ success: true, data: restaurant });
});

// Удалить ресторан
const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');
  res.status(200).json({ success: true, message: 'Restaurant deleted' });
});

export default {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
}; 