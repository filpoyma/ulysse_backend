import mongoose from 'mongoose';
import { transliterate } from '../utils/transliterate.js';

const hotelSchema = new mongoose.Schema(
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
      trim: true,
    },
    region: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      validate: {
        validator: arr => Array.isArray(arr) && arr.length === 2,
        message: 'Coordinates must be an array of two numbers [lng, lat]',
      },
      default: [0, 0],
    },
    mainImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Image',
    },
    hotelInfo: {
      gallery: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Image',
        },
      ],
      about: {
        type: String,
        trim: true,
        default: '',
      },
    },
    roomInfo: {
      gallery: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Image',
        },
      ],
      about: {
        type: String,
        trim: true,
        default: '',
      },
    },
    pros: [
      {
        type: String,
        trim: true,
        _id: true,
      },
    ],
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

hotelSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.name_eng = transliterate(this.name);
  }
  next();
});

hotelSchema.pre('findOneAndUpdate', function(next) {
  const update = this.getUpdate();
  if (update.name) {
    update.name_eng = transliterate(update.name);
  }
  next();
});

const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;
