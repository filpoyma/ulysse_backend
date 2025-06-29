import mongoose from 'mongoose';

const hotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
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

const Hotel = mongoose.model('Hotel', hotelSchema);
export default Hotel;
