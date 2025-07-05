import Restaurant from '../models/restaurantModel.js';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiError.js';

// Получить все рестораны
const getAllRestaurants = asyncHandler(async (req, res) => {
  const restaurants = await Restaurant.find({}).populate(['gallery', 'titleImage']).lean();
  res.status(200).json({ success: true, data: restaurants });
});

// Получить один ресторан по id
const getRestaurantById = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id).populate(['gallery', 'titleImage']);

  if (!restaurant) throw new ApiError(404, 'Restaurant not found');
  res.status(200).json({ success: true, data: restaurant });
});

// Получить один ресторан по name_eng
const getRestaurantByName = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findOne({ name_eng: req.params.name }).populate([
    'gallery',
    'titleImage',
  ]);

  if (!restaurant) throw new ApiError(404, 'Restaurant not found');
  res.status(200).json({ success: true, data: restaurant });
});

// Создать ресторан
const createRestaurant = asyncHandler(async (req, res) => {
  const { name, country, city, region, manager, stars } = req.body;
  if (!name || !country || !city || !manager || !stars) {
    throw new ApiError(400, 'All fields are required');
  }
  const restaurant = new Restaurant({ name, country, city, region, manager, stars });
  await restaurant.save();
  res.status(201).json({ success: true, data: restaurant });
});

// Обновить ресторан
const updateRestaurant = asyncHandler(async (req, res) => {
  const updateData = {};

  // Список полей, которые могут быть обновлены
  const allowedFields = [
    'name',
    'country',
    'city',
    'region',
    'link',
    'address',
    'description',
    'coordinates',
    'gallery',
    'manager',
    'stars',
    'titleImage',
    'shortInfo',
    'cookDescription',
  ];

  // Проверяем каждое поле и добавляем его в updateData только если оно есть в req.body
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const restaurant = await Restaurant.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate(['gallery', 'titleImage']);
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');
  res.status(200).json({ success: true, data: restaurant });
});

// Удалить ресторан
const deleteRestaurant = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
  if (!restaurant) throw new ApiError(404, 'Restaurant not found');
  res.status(200).json({ success: true, message: 'Restaurant deleted' });
});

// Обновить главное изображение ресторана
const updateTitleImage = asyncHandler(async (req, res) => {
  const { restaurantId, imageId } = req.body;

  if (!restaurantId || !imageId) {
    throw new ApiError(400, 'Restaurant ID and Image ID are required');
  }

  const restaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    { titleImage: imageId },
    { new: true, runValidators: true },
  ).populate(['gallery', 'titleImage']);

  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }

  res.status(200).json({
    success: true,
    data: restaurant,
  });
});

// Обновить галерею ресторана
const updateGallery = asyncHandler(async (req, res) => {
  const { restaurantId, imageIds } = req.body;

  if (!restaurantId || !Array.isArray(imageIds))
    throw new ApiError(400, 'Restaurant ID and image IDs array are required');

  const restaurant = await Restaurant.findById(restaurantId).lean();

  if (!restaurant) {
    throw new ApiError(404, 'Restaurant not found');
  }

  // Получаем текущую галерею
  const currentGallery = restaurant.gallery || [];

  // Фильтруем новые изображения, исключая те, которые уже есть в галерее
  const newImageIds = imageIds.filter(
    id => !currentGallery.map(({ _id }) => _id.toString()).includes(id),
  );

  const updatedRestaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    { $set: { gallery: [...currentGallery, ...newImageIds] } },
    { new: true, runValidators: true },
  ).populate(['gallery', 'titleImage']);

  res.status(200).json({
    success: true,
    data: updatedRestaurant,
  });
});

export default {
  getAllRestaurants,
  getRestaurantById,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  updateTitleImage,
  updateGallery,
  getRestaurantByName,
};
