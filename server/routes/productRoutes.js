import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Helper to construct safe Mongoose query for custom string id or ObjectId
const findProductQuery = (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ id: id }, { _id: id }] };
  }
  return { id: id };
};

// @route   GET /api/products
// @desc    Get all products from MongoDB database (with filtering & search)
router.get('/', async (req, res) => {
  try {
    const { category, search, featured } = req.query;
    let query = {};

    if (category && category !== 'all') {
      query.categoryId = category;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { category: searchRegex },
        { description: searchRegex },
        { material: searchRegex },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    console.error('Fetch Products Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/products/:id
// @desc    Get single product details by custom id or _id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne(findProductQuery(id));

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found in database.' });
    }

    res.json({ success: true, product });
  } catch (error) {
    console.error('Fetch Single Product Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/products
// @desc    Create a new product document in MongoDB (Protected: Admin Only)
router.post('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const {
      name,
      category,
      categoryId,
      price,
      originalPrice,
      stock,
      featured,
      isNewProduct,
      material,
      height,
      steps,
      weightCapacity,
      productWeight,
      foldable,
      usage,
      warranty,
      certification,
      images,
      description,
      features,
      safetyInfo,
    } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({ success: false, message: 'Product Name, Category, and Price are required.' });
    }

    const generatedId = 'prod-' + Date.now();

    const newProduct = await Product.create({
      id: req.body.id || generatedId,
      name,
      category: category || 'Aluminium Ladders',
      categoryId: categoryId || (category ? category.toLowerCase().replace(/\s+/g, '-') : 'aluminium'),
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : Math.round(Number(price) * 1.2),
      rating: 5.0,
      reviewsCount: 0,
      stock: stock || 'In Stock',
      featured: Boolean(featured),
      isNewProduct: Boolean(isNewProduct),
      material: material || 'Heavy Aluminium Alloy',
      height: height || '12 ft',
      steps: steps ? Number(steps) : 6,
      weightCapacity: weightCapacity || '150 kg',
      productWeight: productWeight || '10 kg',
      foldable: foldable !== undefined ? Boolean(foldable) : true,
      usage: usage || 'Industrial & Household',
      warranty: warranty || '5 Years Warranty',
      certification: certification || 'ISO 9001 Certified',
      images: images && images.length > 0 ? images : ['/images/hero_ladder.jpg'],
      description: description || '',
      features: features || [],
      safetyInfo: safetyInfo || [],
    });

    res.status(201).json({
      success: true,
      message: 'New Product created successfully in MongoDB database!',
      product: newProduct,
    });
  } catch (error) {
    console.error('Create Product Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error creating product' });
  }
});

// @route   PUT /api/products/:id
// @desc    Update an existing product details & prices in MongoDB (Protected: Admin Only)
router.put('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };

    if (updateData.price) updateData.price = Number(updateData.price);
    if (updateData.originalPrice) updateData.originalPrice = Number(updateData.originalPrice);
    if (updateData.steps) updateData.steps = Number(updateData.steps);

    const updatedProduct = await Product.findOneAndUpdate(
      findProductQuery(id),
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: `Product with ID "${id}" not found in database.` });
    }

    res.json({
      success: true,
      message: `Product "${updatedProduct.name}" updated successfully!`,
      product: updatedProduct,
    });
  } catch (error) {
    console.error('Update Product Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product from MongoDB database (Protected: Admin Only)
router.delete('/:id', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await Product.findOneAndDelete(findProductQuery(id));

    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: `Product with ID "${id}" not found in database.` });
    }

    res.json({
      success: true,
      message: `Product "${deletedProduct.name}" removed from MongoDB database!`,
    });
  } catch (error) {
    console.error('Delete Product Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
