import Hotel from '../models/hotelModel.js';
import HotelsList from '../models/hotelsListModel.js';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiError.js';

// Получить все отели
const getAllHotels = asyncHandler(async (req, res) => {
  const hotels = await Hotel.find().populate([
    'mainImage',
    'hotelInfo.gallery',
    'roomInfo.gallery',
  ]);
  res.status(200).json({ success: true, data: hotels });
});

// Получить один отель по id
const getHotelById = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findById(req.params.id).populate([
    'mainImage',
    'hotelInfo.gallery',
    'roomInfo.gallery',
  ]);
  if (!hotel) throw new ApiError(404, 'Hotel not found');
  res.status(200).json({ success: true, data: hotel });
});

const getHotelByName = asyncHandler(async (req, res) => {
  const hotel = await Hotel.findOne({ name_eng: req.params.name }).populate([
    'mainImage',
    'hotelInfo.gallery',
    'roomInfo.gallery',
  ]);
  if (!hotel) throw new ApiError(404, 'Hotel not found');
  res.status(200).json({ success: true, data: hotel });
});

// Создать отель
const createHotel = asyncHandler(async (req, res) => {
  const { name, country, city, region } = req.body;
  if (!name || !country || !city) throw new ApiError(400, 'All fields are required');
  const hotel = new Hotel({ name, country, city, region, manager: req.user.email });
  await hotel.save();
  res.status(201).json({ success: true, data: hotel });
});

// Обновить отель
const updateHotel = asyncHandler(async (req, res) => {
  const updateData = {};

  // Список полей, которые могут быть обновлены
  const allowedFields = [
    'name',
    'country',
    'city',
    'region',
    'link',
    'address',
    'hotelInfo',
    'roomInfo',
    'pros',
    'shortInfo',
    'coordinates',
    'mainImage',
  ];

  // Проверяем каждое поле и добавляем его в updateData только если оно есть в req.body
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const hotel = await Hotel.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate(['mainImage', 'hotelInfo.gallery', 'roomInfo.gallery']);

  if (!hotel) throw new ApiError(404, 'Hotel not found');
  res.status(200).json({ success: true, data: hotel });
});

const updateMainImage = asyncHandler(async (req, res) => {
  const { hotelId, imageId } = req.body;

  if (!hotelId || !imageId) {
    throw new ApiError(400, 'Hotel ID and Image ID are required');
  }

  const hotel = await Hotel.findByIdAndUpdate(
    hotelId,
    { mainImage: imageId },
    { new: true, runValidators: true },
  ).populate(['mainImage', 'hotelInfo.gallery', 'roomInfo.gallery']);

  if (!hotel) {
    throw new ApiError(404, 'Hotel not found');
  }

  res.status(200).json({
    success: true,
    data: hotel,
  });
});

// Удалить отель
const deleteHotel = asyncHandler(async (req, res) => {
  const hotelId = req.params.id;

  // Проверяем, есть ли отель в каких-либо списках отелей
  const hotelsList = await HotelsList.findOne({
    hotels: { $in: [hotelId] },
  });

  if (hotelsList) {
    throw new ApiError(
      400,
      `Не могу удалить отель, так как он используется в списке ${hotelsList.name}`,
    );
  }

  const hotel = await Hotel.findByIdAndDelete(hotelId);
  if (!hotel) throw new ApiError(404, 'Hotel not found');
  res.status(200).json({ success: true, message: 'Hotel deleted' });
});

// Обновить галерею отеля
const updateGallery = asyncHandler(async (req, res) => {
  const { hotelId, galleryType, imageIds } = req.body;

  if (!hotelId || !galleryType || !Array.isArray(imageIds))
    throw new ApiError(400, 'Hotel ID, gallery type and image IDs array are required');

  const hotel = await Hotel.findById(hotelId).lean();

  // Проверяем, что galleryType соответствует ожидаемым значениям
  if (!['hotelInfo.gallery', 'roomInfo.gallery'].includes(galleryType)) {
    throw new ApiError(400, 'Invalid gallery type');
  }

  // Получаем текущую галерею
  const currentGallery =
    galleryType === 'hotelInfo.gallery' ? hotel.hotelInfo.gallery : hotel.roomInfo.gallery;

  // Фильтруем новые изображения, исключая те, которые уже есть в галерее
  const newImageIds = imageIds.filter(
    id => !currentGallery.map(({ _id }) => _id.toString()).includes(id),
  );
  // Создаем объект для обновления
  const updateData = {};
  if (galleryType === 'hotelInfo.gallery') {
    updateData['hotelInfo.gallery'] = [...currentGallery, ...newImageIds];
  } else {
    updateData['roomInfo.gallery'] = [...currentGallery, ...newImageIds];
  }

  const updatedHotel = await Hotel.findByIdAndUpdate(
    hotelId,
    { $set: updateData },
    { new: true, runValidators: true },
  ).populate(['mainImage', 'hotelInfo.gallery', 'roomInfo.gallery']);

  res.status(200).json({
    success: true,
    data: updatedHotel,
  });
});

export default {
  getAllHotels,
  getHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  updateMainImage,
  updateGallery,
  getHotelByName,
};
