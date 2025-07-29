import References from '../models/referencesModel.js';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/apiError.js';
import { transliterate } from '../utils/transliterate.js';

// Получить все справочники
const getAllReferences = asyncHandler(async (req, res) => {
  const references = await References.find().populate('titleImage');
  res.status(200).json({ success: true, data: references });
});

// Получить один справочник по id или name_eng
const getReferencesById = asyncHandler(async (req, res) => {
  const references =
    (await References.findOne({ name_eng: req.params.id }).populate('titleImage')) ||
    (await References.findById(req.params.id).populate('titleImage'));
  if (!references) throw new ApiError(404, 'References not found');
  res.status(200).json({ success: true, data: references });
});

// Создать справочник
const createReferences = asyncHandler(async (req, res) => {
  const { name, title, description, manager } = req.body;
  if (!name) throw new ApiError(400, 'Name is required');
  
  const references = new References({
    name,
    name_eng: transliterate(name),
    title: title || 'Заголовок',
    manager: req.user.email,
    description: description || 'Описание',
    listInfo: [
      { title: 'заголовок1', description: 'описание1' },
      { title: 'заголовок2', description: 'описание2' },
    ]
  });
  await references.save();
  res.status(201).json({ success: true, data: references });
});

// Обновить справочник
const updateReferences = asyncHandler(async (req, res) => {
  const updateData = {};

  // Список полей, которые могут быть обновлены
  const allowedFields = ['name', 'name_eng', 'title', 'description', 'manager', 'titleImage', 'listInfo'];

  // Проверяем каждое поле и добавляем его в updateData только если оно есть в req.body
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  });

  const references = await References.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  }).populate('titleImage');

  if (!references) throw new ApiError(404, 'References not found');
  res.status(200).json({ success: true, data: references });
});

// Удалить справочник
const deleteReferences = asyncHandler(async (req, res) => {
  const references = await References.findByIdAndDelete(req.params.id);
  if (!references) throw new ApiError(404, 'References not found');
  res.status(200).json({ success: true, message: 'References deleted' });
});

// Обновить главное изображение справочника
const updateTitleImage = asyncHandler(async (req, res) => {
  const { referencesId, imageId } = req.body;

  if (!referencesId || !imageId) {
    throw new ApiError(400, 'References ID and Image ID are required');
  }

  const references = await References.findByIdAndUpdate(
    referencesId,
    { titleImage: imageId },
    { new: true, runValidators: true },
  ).populate('titleImage');

  if (!references) {
    throw new ApiError(404, 'References not found');
  }

  res.status(200).json({
    success: true,
    data: references,
  });
});

export default {
  getAllReferences,
  getReferencesById,
  createReferences,
  updateReferences,
  deleteReferences,
  updateTitleImage,
}; 