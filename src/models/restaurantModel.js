import mongoose from 'mongoose';
import { transliterate } from '../utils/transliterate.js';

const restaurantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    name_eng: {
      type: String,
      trim: true,
      unique: true,
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    region: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    cookDescription: {
      type: String,
      trim: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      validate: {
        validator: arr => Array.isArray(arr) && arr.length === 2,
        message: 'Coordinates must be an array of two numbers [lng, lat]',
      },
      default: [0, 0],
    },
    titleImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
    },
    gallery: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Image',
      },
    ],
    manager: {
      type: String,
      trim: true,
    },
    stars: {
      type: Number,
      min: 0,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Stars must be an integer',
      },
    },
    shortInfo: [
      {
        type: String,
        trim: true,
        _id: true,
      },
    ],
  },
  {
    timestamps: true,
  },
);

restaurantSchema.pre('save', function (next) {
  if (this.isModified('name')) this.name_eng = transliterate(this.name);
  next();
});

restaurantSchema.pre('findOneAndUpdate', function (next) {
  const update = this.getUpdate();
  if (update.name) update.name_eng = transliterate(update.name);
  next();
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
