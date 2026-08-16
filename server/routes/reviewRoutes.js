import express from 'express';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Helper function to recalculate and update Product rating & reviewsCount in MongoDB
const updateProductRatingSummary = async (productId) => {
  try {
    const reviews = await Review.find({ productId });
    const count = reviews.length;
    const avgRating = count > 0 
      ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / count).toFixed(1))
      : 5.0;

    await Product.findOneAndUpdate(
      { $or: [{ id: productId }, { _id: productId }] },
      { rating: avgRating, reviewsCount: count }
    );
  } catch (error) {
    console.error('Error updating product rating summary:', error);
  }
};

// @route   GET /api/reviews/product/:productId
// @desc    Get all genuine customer reviews for a product
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await Review.find({ productId }).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    console.error('Fetch Product Reviews Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/reviews
// @desc    Add or update customer review & rating (Protected: Authenticated Users Only)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { productId, rating, title, comment } = req.body;
    const userId = req.user.id;
    const userName = req.user.name;
    const userEmail = req.user.email;

    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Product ID, rating (1-5 stars), and review comment are required.' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5 stars.' });
    }

    // Check if user already reviewed this product
    let review = await Review.findOne({ productId, userId });

    if (review) {
      // Update existing review
      review.rating = rating;
      review.title = title || review.title;
      review.comment = comment;
      review.createdAt = new Date();
      await review.save();
    } else {
      // Create new genuine review
      review = await Review.create({
        productId,
        userId,
        userName,
        userEmail,
        rating,
        title: title || '',
        comment,
      });
    }

    // Recalculate and update product rating in MongoDB
    await updateProductRatingSummary(productId);

    res.status(201).json({
      success: true,
      message: 'Thank you for your rating & review!',
      review,
    });
  } catch (error) {
    console.error('Submit Review Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error submitting review' });
  }
});

// @route   GET /api/reviews
// @desc    Get all reviews across store for Admin Moderation (Protected: Admin Only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const reviews = await Review.find({}).sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    console.error('Fetch All Reviews Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete/Moderate a review (Protected: Admin or Review Author Only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    // Check if requester is Admin or author of review
    if (req.user.role !== 'admin' && review.userId.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied. You can only delete your own reviews.' });
    }

    const productId = review.productId;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate product rating in MongoDB
    await updateProductRatingSummary(productId);

    res.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete Review Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
