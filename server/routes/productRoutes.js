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

    const trimmedName = typeof name === 'string' ? name.trim() : '';
    const numericPrice = Number(price);

    if (!trimmedName) {
      return res.status(400).json({ success: false, message: 'Product Name is required.' });
    }

    if (price === undefined || price === null || price === '' || isNaN(numericPrice) || numericPrice < 0) {
      return res.status(400).json({ success: false, message: 'A valid numeric Selling Price is required.' });
    }

    const trimmedCategory = typeof category === 'string' ? category.trim() : 'Aluminium Ladders';
    const computedCategoryId = categoryId || trimmedCategory.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const generatedId = (req.body.id && typeof req.body.id === 'string' && req.body.id.trim()) 
      ? req.body.id.trim() 
      : ('prod-' + Date.now());

    // Sanitize images array
    const validImages = Array.isArray(images) && images.length > 0 
      ? images.filter(img => typeof img === 'string' && img.trim().length > 0)
      : ['/images/hero_ladder.jpg'];

    const newProduct = await Product.create({
      id: generatedId,
      name: trimmedName,
      category: trimmedCategory,
      categoryId: computedCategoryId || 'aluminium',
      price: numericPrice,
      originalPrice: originalPrice && !isNaN(Number(originalPrice)) ? Number(originalPrice) : Math.round(numericPrice * 1.2),
      rating: 5.0,
      reviewsCount: 0,
      stock: stock || 'In Stock',
      featured: Boolean(featured),
      isNewProduct: Boolean(isNewProduct),
      material: material || 'Heavy Aluminium Alloy',
      height: height || '12 ft',
      steps: steps && !isNaN(Number(steps)) ? Number(steps) : 6,
      weightCapacity: weightCapacity || '150 kg',
      productWeight: productWeight || '10 kg',
      foldable: foldable !== undefined ? Boolean(foldable) : true,
      usage: usage || 'Industrial & Household',
      warranty: warranty || '5 Years Warranty',
      certification: certification || 'ISO 9001 Certified',
      images: validImages.length > 0 ? validImages : ['/images/hero_ladder.jpg'],
      description: description || '',
      features: Array.isArray(features) ? features : [],
      safetyInfo: Array.isArray(safetyInfo) ? safetyInfo : [],
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

    if (updateData.price !== undefined && updateData.price !== '') {
      const p = Number(updateData.price);
      if (!isNaN(p)) updateData.price = p;
    }
    if (updateData.originalPrice !== undefined && updateData.originalPrice !== '') {
      const op = Number(updateData.originalPrice);
      if (!isNaN(op)) updateData.originalPrice = op;
    }
    if (updateData.steps !== undefined && updateData.steps !== '') {
      const s = Number(updateData.steps);
      if (!isNaN(s)) updateData.steps = s;
    }
    if (Array.isArray(updateData.images)) {
      updateData.images = updateData.images.filter(img => typeof img === 'string' && img.trim().length > 0);
      if (updateData.images.length === 0) {
        updateData.images = ['/images/hero_ladder.jpg'];
      }
    }

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
