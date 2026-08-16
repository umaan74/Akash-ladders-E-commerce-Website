import express from 'express';
import Order from '../models/Order.js';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';

const router = express.Router();

// Helper to generate custom order ID (e.g., AK-749210)
const generateOrderId = () => 'AK-' + Math.floor(100000 + Math.random() * 900000);

// @route   POST /api/orders
// @desc    Create a new dispatch order
router.post('/', async (req, res) => {
  try {
    const { customerDetails, items, subtotal, gst, shipping, total, paymentMethod, userId } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Cannot place an order with an empty cart.' });
    }

    const newOrder = await Order.create({
      orderId: generateOrderId(),
      customerId: userId || req.user?.id || null,
      customerDetails,
      items,
      subtotal,
      gst,
      shipping,
      total,
      paymentMethod: paymentMethod || 'cod',
      status: 'Pending',
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: newOrder,
    });
  } catch (error) {
    console.error('Create Order Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error placing order' });
  }
});

// @route   GET /api/orders/my-orders
// @desc    Get customer's order history
router.get('/my-orders', verifyToken, async (req, res) => {
  try {
    // Find orders by customerId or email
    const orders = await Order.find({
      $or: [
        { customerId: req.user.id },
        { 'customerDetails.email': req.user.email.toLowerCase() }
      ]
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    console.error('Fetch My Orders Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/orders
// @desc    Get all orders for Admin Dashboard (Protected: Admin Only)
router.get('/', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status, search } = req.query;

    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { orderId: searchRegex },
        { 'customerDetails.name': searchRegex },
        { 'customerDetails.email': searchRegex },
        { 'customerDetails.phone': searchRegex }
      ];
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    // Calculate Summary Stats
    const allOrders = await Order.find({});
    const stats = {
      totalOrders: allOrders.length,
      totalRevenue: allOrders.reduce((acc, curr) => acc + (curr.total || 0), 0),
      pendingCount: allOrders.filter(o => o.status === 'Pending').length,
      processingCount: allOrders.filter(o => o.status === 'Processing').length,
      shippedCount: allOrders.filter(o => o.status === 'Shipped').length,
      deliveredCount: allOrders.filter(o => o.status === 'Delivered').length,
      cancelledCount: allOrders.filter(o => o.status === 'Cancelled').length,
    };

    res.json({
      success: true,
      stats,
      count: orders.length,
      orders,
    });
  } catch (error) {
    console.error('Fetch All Orders Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   PATCH /api/orders/:id/status
// @desc    Update order status (Protected: Admin Only)
router.patch('/:id/status', verifyToken, verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({
      success: true,
      message: `Order status updated to "${status}"`,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('Update Order Status Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;
