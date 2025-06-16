import asyncHandler from 'express-async-handler';
import Country from '../models/countriesModel.js';
import ApiError from '../utils/apiError.js';

// Get all countries
const getAllCountries = asyncHandler(async (req, res) => {
  const countries = await Country.find().lean();

  if (!countries) throw new ApiError(404, 'No countries found');

  res.status(200).json({
    success: true,
    data: countries,
  });
});

// Get country by ID
const getCountry = asyncHandler(async (req, res) => {
  const country = await Country.findById(req.params.id).lean();
  if (!country) throw new ApiError(404, 'Country not found');

  res.status(200).json({
    success: true,
    data: country,
  });
});

// Create new country
const createCountry = asyncHandler(async (req, res) => {
  const country = await Country.create(req.body);

  res.status(201).json({
    success: true,
    data: country,
  });
});

// Update country
const updateCountry = asyncHandler(async (req, res) => {
  const country = await Country.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!country) throw new ApiError(404, 'Country not found');

  res.status(200).json({
    success: true,
    data: country,
  });
});

// Delete country
const deleteCountry = asyncHandler(async (req, res) => {
  const country = await Country.findById(req.params.id);

  if (!country) throw new ApiError(404, 'Country not found');

  await country.deleteOne();

  res.status(200).json({
    success: true,
    data: {
      message: 'Country deleted successfully',
    },
  });
});

export { getAllCountries, getCountry, createCountry, updateCountry, deleteCountry };
