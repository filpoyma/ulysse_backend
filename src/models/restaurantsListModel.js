import mongoose from 'mongoose';

const restaurantsListSchema = new mongoose.Schema(
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
    restaurants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
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
      totalRestaurants: {
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

restaurantsListSchema.pre('save', function (next) {
  this.metadata.totalRestaurants = this.restaurants.length;
  this.metadata.lastUpdated = new Date();
  next();
});

restaurantsListSchema.virtual('restaurantCount').get(function () {
  return this.restaurants.length;
});

restaurantsListSchema.methods.addRestaurant = function (restaurantId) {
  if (!this.restaurants.includes(restaurantId)) {
    this.restaurants.push(restaurantId);
    return this.save();
  }
  return Promise.resolve(this);
};

restaurantsListSchema.methods.removeRestaurant = function (restaurantId) {
  this.restaurants = this.restaurants.filter(id => !id.equals(restaurantId));
  return this.save();
};

restaurantsListSchema.methods.containsRestaurant = function (restaurantId) {
  return this.restaurants.some(id => id.equals(restaurantId));
};

restaurantsListSchema.statics.findActive = function () {
  return this.find({ isActive: true }).sort({ sortOrder: 1, createdAt: -1 });
};

restaurantsListSchema.statics.findWithRestaurants = function (query = {}) {
  return this.find(query)
    .populate({
      path: 'restaurants',
      select: 'name country city region titleImage coordinates',
      populate: {
        path: 'titleImage',
        select: 'path filename',
      },
    })
    .sort({ sortOrder: 1, createdAt: -1 });
};

const RestaurantsList = mongoose.model('RestaurantsList', restaurantsListSchema);
export default RestaurantsList; 