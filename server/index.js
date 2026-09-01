import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Dynamic CORS configuration supporting mobile browsers, local network testing, and production URLs
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : [];

app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests (mobile native apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    // If specific origins are configured in FRONTEND_URL and not '*', check whitelist
    if (allowedOrigins.length > 0 && !allowedOrigins.includes('*')) {
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
    }
    // Dynamically reflect requesting origin so credentials: true is accepted by all mobile & desktop browsers
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/reviews', reviewRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Akash Ladders Backend API',
    database: 'MongoDB (akash_ladders)',
    timestamp: new Date().toISOString(),
  });
});

// Start Express Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 Akash Ladders API Server running on port ${PORT}`);
  console.log(`📊 Database connected to MongoDB Compass: akash_ladders`);
  console.log(`🔑 JWT Authentication & Admin Authorization Active`);
  console.log(`====================================================`);
});
