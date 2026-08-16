import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Ensure reliable Node.js SRV DNS resolution on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore fallback error
}
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;

  if (!mongoUri) {
    console.error('[MongoDB Error] MONGODB_URI environment variable is missing in .env');
    return null;
  }

  try {
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB Atlas] Connected successfully to Database: "${conn.connection.name}" at host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB Atlas Error] Failed to connect to MongoDB Atlas (${error.message}). Please check credentials/network in .env.`);
    return null;
  }
};

export default connectDB;
