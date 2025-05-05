import mongoose from 'mongoose';

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a product description']
    },
    price: {
      type: Number,
      required: [true, 'Please add a product price'],
      default: 0
    },
    category: {
      type: String,
      required: [true, 'Please add a product category'],
      enum: ['Electronics', 'Books', 'Clothing', 'Food', 'Other']
    },
    inStock: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Add index for better query performance
productSchema.index({ name: 1, category: 1 });

const Product = mongoose.model('Product', productSchema);

export default Product;