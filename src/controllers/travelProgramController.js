import asyncHandler from 'express-async-handler';
import TravelProgram from '../models/travelProgram.js';
import Image from '../models/imageModel.js';
import ApiError from '../utils/apiError.js';
import { transliterate } from '../utils/transliterate.js';
import MapData from '../models/mapModel.js';
import { newMapData, newTravelProgramDefault } from '../constants/placeholders.js';

// Get travel program by name
const getTravelProgramByName = asyncHandler(async (req, res) => {
  const { name } = req.params;

  if (!name) throw new ApiError(400, 'Program name is required');

  const program = await TravelProgram.findOne({ name_eng: name }).populate([
    'bgImages',
    'thirdPageMap',
    'fourthPageDay.gallery',
  ]);

  if (!program) throw new ApiError(404, 'Travel program not found1');

  res.status(200).json({
    success: true,
    data: program,
  });
});

// Get travel program by ID
const getTravelProgramById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const program = await TravelProgram.findById(id).populate([
    'bgImages',
    'thirdPageMap',
    'fourthPageDay.gallery',
  ]);

  if (!program) throw new ApiError(404, 'Travel program not found2');

  res.status(200).json({
    success: true,
    data: program,
  });
});

// Create travel program template
const createTemplate = asyncHandler(async (req, res) => {
  const { name } = req.body;

  if (!name) throw new ApiError(400, 'Program name is required');

  // Check if program with this name already exists
  const existingProgram = await TravelProgram.findOne({ name });
  if (existingProgram) throw new ApiError(400, 'Program with this name already exists');

  const name_eng = transliterate(name);

  // Check if program with this name_eng already exists
  const existingProgramEng = await TravelProgram.findOne({ name_eng });
  if (existingProgramEng) throw new ApiError(400, 'Program with this English name already exists');

  const manager = req.user.email;
  console.log('file-travelProgramController.js manager:', manager);
  const program = new TravelProgram(newTravelProgramDefault(name, name_eng, manager));
  const mapData = new MapData(newMapData);

  program.thirdPageMap = mapData._id;

  await Promise.all([program.save(), mapData.save()]);

  res.status(201).json({
    success: true,
    data: program,
  });
});

// Get all travel programs
const getAllTravelPrograms = asyncHandler(async (req, res) => {
  const programs = await TravelProgram.find({});

  if (!programs) throw new ApiError(404, 'No travel programs found');

  res.status(200).json({
    success: true,
    data: programs,
  });
});

// Add image to travel program's bgImages
const addImageToBgImages = asyncHandler(async (req, res) => {
  const { programName, imageId, imageNumber } = req.body;
  if (!programName || !imageId) throw new ApiError(400, 'Program name and image ID are required');

  // Check if both program and image exist
  const [program, image] = await Promise.all([
    TravelProgram.findOne({ name_eng: programName }),
    Image.findById(imageId),
  ]);

  if (!program) throw new ApiError(404, 'Travel program not found3');

  if (!image) throw new ApiError(404, 'Image not found');

  // If imageNumber is provided, validate it
  if (imageNumber !== undefined) {
    if (imageNumber < 0) throw new ApiError(400, 'Image number cannot be negative');

    // Ensure the array is long enough
    while (program.bgImages.length < imageNumber) {
      program.bgImages.push(null);
    }
    // Insert image at specified position
    program.bgImages[imageNumber] = imageId;
  } else {
    // If no position specified, add to the end
    program.bgImages.push(imageId);
  }

  await program.save();

  // Return updated program with populated bgImages
  const updatedProgram = await TravelProgram.findById(program._id).populate('bgImages');

  if (!updatedProgram) throw new ApiError(500, 'Failed to retrieve updated program');

  res.status(200).json({
    success: true,
    data: {
      message: 'Image added to bgImages successfully',
      program: updatedProgram,
    },
  });
});

const addImagesToGallery = asyncHandler(async (req, res) => {
  const { programId, imageIds } = req.body;

  if (!programId || !Array.isArray(imageIds)) {
    throw new ApiError(400, 'Program ID and image IDs array are required');
  }

  // Проверяем существование программы
  const program = await TravelProgram.findById(programId);
  if (!program) {
    throw new ApiError(404, 'Travel program not found');
  }

  // Проверяем существование всех изображений
  const images = await Image.find({ _id: { $in: imageIds } });
  if (images.length !== imageIds.length) {
    throw new ApiError(404, 'One or more images not found');
  }

  // Добавляем новые изображения в галерею
  const currentGallery = program.fourthPageDay.gallery;
  const newImageIds = imageIds.filter(
    id => !currentGallery.map(({ _id }) => _id.toString()).includes(id),
  );
  program.fourthPageDay.gallery = [...currentGallery, ...newImageIds];

  // Сохраняем изменения
  await program.save();

  // Возвращаем обновленную программу с заполненными данными изображений
  const updatedProgram = await TravelProgram.findById(programId).populate('fourthPageDay.gallery');

  res.status(200).json({
    success: true,
    data: {
      message: 'Images added to gallery successfully',
      fourthPageDay: updatedProgram.fourthPageDay,
    },
  });
});

// Delete travel program
const deleteTravelProgram = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const program = await TravelProgram.findById(id);

  if (!program) throw new ApiError(404, 'Travel program not found4');

  await program.deleteOne();

  res.status(200).json({
    success: true,
    data: {
      message: 'Travel program deleted successfully',
    },
  });
});

const updateFirstPage = asyncHandler(async (req, res) => {
  const { title, subtitle, footer } = req.body;
  let travelProgram = await TravelProgram.findOne({ name_eng: req.params.id });

  if (!travelProgram)
    throw new ApiError(404, `Travel program not found with id of ${req.params.id}`);

  travelProgram.firstPage = {
    title,
    subtitle,
    footer,
  };
  await travelProgram.save();

  res.status(200).json({
    success: true,
    data: travelProgram.firstPage,
  });
});

const updateReviewDay = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { dayIndex } = req.params;
  const { day, activity, numOfDay } = req.body;

  const travelProgram = await TravelProgram.findById(id);

  if (!travelProgram) throw new ApiError(404, `Travel program not found with id of ${id}`);

  if (!travelProgram.secondPageTables?.routeDetailsTable?.review)
    throw new ApiError(404, 'Review data not found');

  const reviewData = travelProgram.secondPageTables.routeDetailsTable.review;

  reviewData[dayIndex] = {
    day: day || reviewData[dayIndex].day,
    numOfDay: Number(numOfDay) || reviewData[dayIndex].numOfDay,
    activity: activity || reviewData[dayIndex].activity,
  };

  await travelProgram.save();

  res.status(200).json({
    success: true,
    data: reviewData[dayIndex],
  });
});

const deleteReviewDay = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { dayIndex } = req.params;

  const travelProgram = await TravelProgram.findById(id);

  if (!travelProgram) throw new ApiError(404, `Travel program not found with id of ${id}`);

  if (!travelProgram.secondPageTables?.routeDetailsTable?.review)
    throw new ApiError(404, 'Review data not found');

  const reviewData = travelProgram.secondPageTables.routeDetailsTable.review;

  if (dayIndex >= reviewData.length) {
    throw new ApiError(400, 'Day index out of bounds');
  }

  // Удаляем день из массива
  reviewData.splice(dayIndex, 1);
  await travelProgram.save();

  res.status(200).json({
    success: true,
    data: reviewData,
  });
});

const reorderReviewDays = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { fromIndex, toIndex } = req.body;

  const travelProgram = await TravelProgram.findById(id);

  if (!travelProgram) throw new ApiError(404, `Travel program not found with id of ${id}`);

  if (!travelProgram.secondPageTables?.routeDetailsTable?.review)
    throw new ApiError(404, 'Review data not found');

  const reviewData = travelProgram.secondPageTables.routeDetailsTable.review;

  if (fromIndex >= reviewData.length || toIndex >= reviewData.length) {
    throw new ApiError(400, 'Day index out of bounds');
  }

  // Перемещаем день
  const [movedDay] = reviewData.splice(fromIndex, 1);
  reviewData.splice(toIndex, 0, movedDay);

  // Обновляем номера дней
  reviewData.forEach((day, index) => {
    day.numOfDay = index + 1;
  });

  await travelProgram.save();

  res.status(200).json({
    success: true,
    data: reviewData,
  });
});

const updateAccommodationRow = asyncHandler(async (req, res) => {
  const { id, rowIndex } = req.params;
  const updatedRow = req.body; // { period, hotelName, details, numOfNights }

  const program = await TravelProgram.findById(id);
  if (!program) throw new ApiError(404, 'TravelProgram not found');

  if (!program.secondPageTables || !Array.isArray(program.secondPageTables.accommodation))
    throw new ApiError(400, `Accommodation not found with id of ${id}`);

  program.secondPageTables.accommodation[rowIndex] = updatedRow;
  await program.save();

  res.json({ data: program.secondPageTables.accommodation[rowIndex], success: true });
});

const deleteAccommodationRow = asyncHandler(async (req, res) => {
  const { id, rowIndex } = req.params;

  const program = await TravelProgram.findById(id);
  if (!program) throw new ApiError(404, 'TravelProgram not found');

  if (!program.secondPageTables || !Array.isArray(program.secondPageTables.accommodation))
    throw new ApiError(400, `Accommodation not found with id of ${id}`);

  // Удаляем строку из массива
  program.secondPageTables.accommodation.splice(rowIndex, 1);
  await program.save();

  res.json({
    success: true,
    data: program.secondPageTables.accommodation,
  });
});

// Update gallery
const updateGallery = asyncHandler(async (req, res) => {
  const { programId, imageIds } = req.body;
  console.log('file-travelProgramController.js req.body:', req.body);

  if (!programId || !imageIds) {
    throw new ApiError(400, 'Program ID and gallery are required');
  }

  const program = await TravelProgram.findById(programId);
  if (!program) {
    throw new ApiError(404, 'Travel program not found');
  }

  // Обновляем галерею
  program.fourthPageDay.gallery = imageIds;

  await program.save();

  // Возвращаем обновленную программу с заполненной галереей
  const updatedProgram = await TravelProgram.findById(programId).populate('fourthPageDay.gallery');

  res.status(200).json({
    success: true,
    data: {
      message: 'Gallery updated successfully',
      fourthPageDay: updatedProgram.fourthPageDay,
    },
  });
});

const updateDaySection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { dayIndex } = req.params;
  const updatedDayData = req.body;

  const program = await TravelProgram.findById(id);
  if (!program) throw new ApiError(404, 'TravelProgram not found');

  if (!program.fourthPageDay || !Array.isArray(program.fourthPageDay.daysData)) {
    throw new ApiError(400, 'Days data not found');
  }

  if (dayIndex >= program.fourthPageDay.daysData.length) {
    throw new ApiError(400, 'Day index out of bounds');
  }

  // Обновляем данные дня
  program.fourthPageDay.daysData[dayIndex] = updatedDayData;
  await program.save();

  res.status(200).json({
    success: true,
    data: program.fourthPageDay.daysData[dayIndex],
  });
});

const addDaySection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const newDayData = req.body;

  const program = await TravelProgram.findById(id);
  if (!program) throw new ApiError(404, 'TravelProgram not found');

  if (!program.fourthPageDay) {
    program.fourthPageDay = { gallery: [], daysData: [] };
  }

  if (!Array.isArray(program.fourthPageDay.daysData)) {
    program.fourthPageDay.daysData = [];
  }

  // Добавляем новый день
  program.fourthPageDay.daysData.push(newDayData);
  await program.save();

  res.status(201).json({
    success: true,
    data: newDayData,
  });
});

const deleteDaySection = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { dayIndex } = req.params;

  const program = await TravelProgram.findById(id);
  if (!program) throw new ApiError(404, 'TravelProgram not found');

  if (!program.fourthPageDay || !Array.isArray(program.fourthPageDay.daysData)) {
    throw new ApiError(400, 'Days data not found');
  }

  if (dayIndex >= program.fourthPageDay.daysData.length) {
    throw new ApiError(400, 'Day index out of bounds');
  }

  // Удаляем день из массива
  program.fourthPageDay.daysData.splice(dayIndex, 1);
  await program.save();

  res.status(200).json({
    success: true,
    data: program.fourthPageDay.daysData,
  });
});

export default {
  addImageToBgImages,
  addImagesToGallery,
  getAllTravelPrograms,
  createTemplate,
  getTravelProgramById,
  getTravelProgramByName,
  deleteTravelProgram,
  updateFirstPage,
  updateReviewDay,
  deleteReviewDay,
  updateAccommodationRow,
  deleteAccommodationRow,
  updateGallery,
  updateDaySection,
  addDaySection,
  deleteDaySection,
  reorderReviewDays,
};
