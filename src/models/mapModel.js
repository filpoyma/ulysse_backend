import mongoose from 'mongoose';

const logisticsSchema = mongoose.Schema(
  {
    city: { type: String, required: true },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: arr => Array.isArray(arr) && arr.length === 2,
        message: 'Coordinates must be an array of two numbers [lng, lat]',
      },
    },
    markerColor: { type: String },
    hotel: { type: String },
    sourceListIcon: { type: String },
    sourceMapIcon: { type: String },
    routeType: { type: String },
    time: { type: String },
    distance: { type: String },
  },
  {
    timestamps: true,
  },
);

const mapSchema = mongoose.Schema(
  {
    logistics: [logisticsSchema],
    mapCenter: {
      type: [Number], // [longitude, latitude]
      required: true,
      validate: {
        validator: arr => Array.isArray(arr) && arr.length === 2,
        message: 'Coordinates must be an array of two numbers [lng, lat]',
      },
    },
    zoom: { type: Number, default: 6 },
  },
  {
    timestamps: true,
  },
);

const MapData = mongoose.model('Map', mapSchema);

export default MapData;
