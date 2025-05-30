import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema(
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
      required: true,
      trim: true,
    },
    region: {
      type: String,

      trim: true,
    },
    manager: {
      type: String,

      trim: true,
    },
    stars: {
      type: Number,

      min: 1,
      max: 5,
      validate: {
        validator: Number.isInteger,
        message: 'Stars must be an integer',
      },
    },
    titleImage: { type: String },
    gallery: [String],
  },
  {
    timestamps: true,
  },
);

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

export default Restaurant;
