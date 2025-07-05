import RestaurantsList from '../models/restaurantsListModel.js';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiError.js';

// Получить все списки ресторанов
const getAllRestaurantsLists = asyncHandler(async (req, res) => {
  const withRestaurants = req.query.withRestaurants === 'true';
  const lists = withRestaurants
    ? await RestaurantsList.findWithRestaurants()
    : await RestaurantsList.find();
  res.status(200).json({ success: true, data: lists });
});

// Получить один список ресторанов по id
const getRestaurantsListById = asyncHandler(async (req, res) => {
  const { fullData } = req.query;
  const { id } = req.params;
  const populateQuery =
    fullData === 'true'
      ? {
          path: 'restaurants',
          populate: {
            path: ['titleImage', 'gallery'],
            select: 'path filename',
          },
        }
      : {
          path: 'restaurants',
          select: 'name country city region titleImage coordinates',
          populate: {
            path: 'titleImage',
            select: 'path filename',
          },
        };
  const list = await RestaurantsList.findById(id).populate(populateQuery);
  if (!list) throw new ApiError(404, 'Restaurants list not found');
  res.status(200).json({ success: true, data: list });
});

//return this.find(query)
//     .populate({
//       path: 'restaurants',
//       select: 'name country city region titleImage coordinates',
//       populate: {
//         path: 'titleImage',
//         select: 'path filename',
//       },
//     })
//     .sort({ sortOrder: 1, createdAt: -1 });

// Создать список ресторанов
const createRestaurantsList = asyncHandler(async (req, res) => {
  const { name, description, restaurants, sortOrder } = req.body;
  if (!name) throw new ApiError(400, 'Name is required');
  const list = await RestaurantsList.create({ name, description, restaurants, sortOrder });
  res.status(201).json({ success: true, data: list });
});

// Обновить список ресторанов
const updateRestaurantsList = asyncHandler(async (req, res) => {
  const updateData = {};
  const allowedFields = ['name', 'description', 'restaurants', 'isActive', 'sortOrder'];
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });
  const list = await RestaurantsList.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!list) throw new ApiError(404, 'Restaurants list not found');
  res.status(200).json({ success: true, data: list });
});

// Удалить список ресторанов
const deleteRestaurantsList = asyncHandler(async (req, res) => {
  const list = await RestaurantsList.findByIdAndDelete(req.params.id);
  if (!list) throw new ApiError(404, 'Restaurants list not found');
  res.status(200).json({ success: true, message: 'Restaurants list deleted' });
});

// Добавить ресторан в список
const addRestaurantToList = asyncHandler(async (req, res) => {
  const { listId, restaurantId } = req.params;
  const list = await RestaurantsList.findById(listId);
  if (!list) throw new ApiError(404, 'Restaurants list not found');
  await list.addRestaurant(restaurantId);
  res.status(200).json({ success: true, data: list });
});

// Удалить ресторан из списка
const removeRestaurantFromList = asyncHandler(async (req, res) => {
  const { listId, restaurantId } = req.params;
  const list = await RestaurantsList.findById(listId);
  if (!list) throw new ApiError(404, 'Restaurants list not found');
  await list.removeRestaurant(restaurantId);
  res.status(200).json({ success: true, data: list });
});

export default {
  getAllRestaurantsLists,
  getRestaurantsListById,
  createRestaurantsList,
  updateRestaurantsList,
  deleteRestaurantsList,
  addRestaurantToList,
  removeRestaurantFromList,
};
