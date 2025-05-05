import asyncHandler from 'express-async-handler';
import Product from '../models/productModel.js';
import ApiError from '../utils/apiError.js';

/**
 * @desc    Get all products
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = asyncHandler(async (req, res) => {
  // Set up pagination
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  
  // Create query object
  const queryObj = { ...req.query };
  
  // Fields to exclude from filtering
  const excludedFields = ['page', 'sort', 'limit', 'fields'];
  excludedFields.forEach(field => delete queryObj[field]);
  
  // Filter by category if provided
  const category = req.query.category;
  if (category) {
    queryObj.category = category;
  }
  
  // Filtering by price range
  if (req.query.minPrice || req.query.maxPrice) {
    queryObj.price = {};
    if (req.query.minPrice) queryObj.price.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) queryObj.price.$lte = Number(req.query.maxPrice);
  }
  
  // Get total count for pagination
  const total = await Product.countDocuments(queryObj);
  
  // Build query
  let query = Product.find(queryObj)
    .skip(startIndex)
    .limit(limit);
  
  // Add sorting if specified
  if (req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ');
    query = query.sort(sortBy);
  } else {
    query = query.sort('-createdAt');
  }
  
  // Execute query
  const products = await query;
  
  // Pagination result
  const pagination = {
    total,
    pages: Math.ceil(total / limit),
    page,
    limit
  };
  
  res.json({
    success: true,
    count: products.length,
    pagination,
    data: products
  });
});

/**
 * @desc    Get single product
 * @route   GET /api/products/:id
 * @access  Public
 */
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    res.json({
      success: true,
      data: product
    });
  } else {
    throw new ApiError(404, 'Product not found');
  }
});

/**
 * @desc    Create a product
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category } = req.body;
  
  const product = await Product.create({
    name,
    description,
    price,
    category,
    user: req.user._id
  });
  
  res.status(201).json({
    success: true,
    data: product
  });
});

/**
 * @desc    Update a product
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const { name, description, price, category, inStock } = req.body;
  
  const product = await Product.findById(req.params.id);
  
  if (product) {
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price !== undefined ? price : product.price;
    product.category = category || product.category;
    product.inStock = inStock !== undefined ? inStock : product.inStock;
    
    const updatedProduct = await product.save();
    
    res.json({
      success: true,
      data: updatedProduct
    });
  } else {
    throw new ApiError(404, 'Product not found');
  }
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  
  if (product) {
    await product.deleteOne();
    
    res.json({
      success: true,
      message: 'Product removed'
    });
  } else {
    throw new ApiError(404, 'Product not found');
  }
});