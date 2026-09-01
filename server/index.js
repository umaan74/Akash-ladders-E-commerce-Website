import http from 'http';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Server as SocketIOServer } from 'socket.io';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import productRoutes from './routes/productRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const httpServer = http.createServer(app);

// Dynamic CORS configuration supporting mobile browsers, local network testing, and production URLs
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : [];

const corsOriginHandler = (origin, callback) => {
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
};

app.use(cors({
  origin: corsOriginHandler,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  maxAge: 86400,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize Socket.IO Server for real-time cross-device synchronization
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: corsOriginHandler,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 30000,
  pingInterval: 10000,
});

// Attach io to Express application so route handlers can access req.app.get('io')
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`🔌 [Socket.IO] Client connected: ${socket.id} (Total active: ${io.engine.clientsCount})`);
  
  socket.on('disconnect', (reason) => {
    console.log(`🔌 [Socket.IO] Client disconnected: ${socket.id} (Reason: ${reason})`);
  });
});

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
    realtime: 'Socket.IO Active',
    clientsConnected: io.engine.clientsCount,
    timestamp: new Date().toISOString(),
  });
});

// Start HTTP Server with Socket.IO Attached
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 Akash Ladders API Server running on port ${PORT}`);
  console.log(`🔌 Socket.IO Real-Time Engine Active on port ${PORT}`);
  console.log(`📊 Database connected to MongoDB Compass: akash_ladders`);
  console.log(`🔑 JWT Authentication & Admin Authorization Active`);
  console.log(`====================================================`);
});
