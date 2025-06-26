import mongoose from 'mongoose';

const hotelsListSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    hotels: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel',
        required: true,
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    metadata: {
      totalHotels: {
        type: Number,
        default: 0,
      },
      lastUpdated: {
        type: Date,
        default: Date.now,
      },
    },
  },
  {
    timestamps: true,
  },
);

// Middleware для автоматического обновления количества отелей
hotelsListSchema.pre('save', function (next) {
  this.metadata.totalHotels = this.hotels.length;
  this.metadata.lastUpdated = new Date();
  next();
});

// Виртуальное поле для получения количества отелей
hotelsListSchema.virtual('hotelCount').get(function () {
  return this.hotels.length;
});

// Метод для добавления отеля в список
hotelsListSchema.methods.addHotel = function (hotelId) {
  if (!this.hotels.includes(hotelId)) {
    this.hotels.push(hotelId);
    return this.save();
  }
  return Promise.resolve(this);
};

// Метод для удаления отеля из списка
hotelsListSchema.methods.removeHotel = function (hotelId) {
  this.hotels = this.hotels.filter(id => !id.equals(hotelId));
  return this.save();
};

// Метод для проверки, содержит ли список определенный отель
hotelsListSchema.methods.containsHotel = function (hotelId) {
  return this.hotels.some(id => id.equals(hotelId));
};

// Статический метод для поиска активных списков
hotelsListSchema.statics.findActive = function () {
  return this.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
};

// Статический метод для поиска списков с отелями
hotelsListSchema.statics.findWithHotels = function (query = {}) {
  return this.find(query)
    .populate({
      path: 'hotels',
      select: 'name country region mainImage coordinates',
      populate: {
        path: 'mainImage',
        select: 'path filename',
      },
    })
    .sort({ sortOrder: 1, createdAt: -1 });
};

const HotelsList = mongoose.model('HotelsList', hotelsListSchema);
export default HotelsList;
