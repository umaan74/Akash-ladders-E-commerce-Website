import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  categoryId: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
  },
  rating: {
    type: Number,
    default: 5.0,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  stock: {
    type: String,
    default: 'In Stock',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  isNewProduct: {
    type: Boolean,
    default: false,
  },
  material: {
    type: String,
  },
  height: {
    type: String,
  },
  steps: {
    type: Number,
  },
  weightCapacity: {
    type: String,
  },
  productWeight: {
    type: String,
  },
  foldable: {
    type: Boolean,
    default: true,
  },
  usage: {
    type: String,
  },
  warranty: {
    type: String,
  },
  certification: {
    type: String,
  },
  images: [String],
  description: {
    type: String,
  },
  features: [String],
  safetyInfo: [String],
}, {
  timestamps: true,
});

const Product = mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
