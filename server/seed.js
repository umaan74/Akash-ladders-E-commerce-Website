import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Order from './models/Order.js';
import Product from './models/Product.js';
import { products } from '../src/data/products.js';

import dns from 'dns';
dotenv.config();

// Fix Node.js DNS SRV lookup issues on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // Ignore fallback error
}
if (dns.setDefaultResultOrder) {
  dns.setDefaultResultOrder('ipv4first');
}

const MONGO_URI = process.env.MONGODB_URI || process.env.MONGO_URI;

const seedDB = async () => {
  try {
    console.log(`Connecting to MongoDB at ${MONGO_URI}...`);
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB successfully for database seeding!');

    // 1. Seed Products Collection
    console.log('Seeding Products collection in MongoDB...');
    await Product.deleteMany({}); // Refresh products to match products.js
    const seededProducts = await Product.insertMany(products);
    console.log(`✅ Successfully seeded ${seededProducts.length} Products into "products" collection in MongoDB Compass!`);

    // 2. Seed Admin User
    const adminEmail = 'admin@akashladders.com';
    let adminUser = await User.findOne({ email: adminEmail });
    
    if (!adminUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('admin123', salt);

      adminUser = await User.create({
        name: 'Akash Ladders Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        phone: '9820098200',
        address: 'Headquarters Building, Industrial Estate',
        city: 'Mumbai',
        pincode: '400093',
      });
      console.log('✅ Created Admin Account: admin@akashladders.com (Password: admin123)');
    } else {
      console.log('ℹ️ Admin Account already exists.');
    }

    // 3. Seed Customer User
    const customerEmail = 'customer@example.com';
    let customerUser = await User.findOne({ email: customerEmail });

    if (!customerUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('customer123', salt);

      customerUser = await User.create({
        name: 'Imran Rauf Khan',
        email: customerEmail,
        password: hashedPassword,
        role: 'customer',
        phone: '8898133393',
        address: 'Industrial Plot 42, Marol MIDC, Andheri East',
        city: 'Mumbai',
        pincode: '400093',
      });
      console.log('✅ Created Customer Account: customer@example.com (Password: customer123)');
    } else {
      console.log('ℹ️ Customer Account already exists.');
    }

    // 4. Seed Sample Orders if empty
    const orderCount = await Order.countDocuments();
    if (orderCount === 0) {
      const sampleOrders = [
        {
          orderId: 'AK-849201',
          customerId: customerUser._id,
          customerDetails: {
            name: customerUser.name,
            email: customerUser.email,
            phone: customerUser.phone,
            address: customerUser.address,
            city: customerUser.city,
            pincode: customerUser.pincode,
          },
          items: [
            {
              id: 'ind-heavy-01',
              name: 'Industrial Heavy-Duty Aluminum Extension Ladder 32ft',
              price: 18500,
              quantity: 2,
              image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600'
            },
            {
              id: 'step-st-02',
              name: 'Pro-Series Steel Step Stool 4-Step with Safety Grip',
              price: 4200,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1508873696983-2df515122519?auto=format&fit=crop&q=80&w=600'
            }
          ],
          subtotal: 41200,
          gst: 7416,
          shipping: 0,
          total: 48616,
          paymentMethod: 'cod',
          status: 'Processing',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2)
        },
        {
          orderId: 'AK-910482',
          customerId: customerUser._id,
          customerDetails: {
            name: customerUser.name,
            email: customerUser.email,
            phone: customerUser.phone,
            address: customerUser.address,
            city: customerUser.city,
            pincode: customerUser.pincode,
          },
          items: [
            {
              id: 'multi-fold-03',
              name: 'Multi-Purpose Articulated Folding Ladder 16-in-1 20ft',
              price: 12900,
              quantity: 1,
              image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=600'
            }
          ],
          subtotal: 12900,
          gst: 2322,
          shipping: 0,
          total: 15222,
          paymentMethod: 'upi',
          status: 'Shipped',
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000 * 5)
        }
      ];

      await Order.insertMany(sampleOrders);
      console.log('✅ Seeded Sample Orders into "orders" collection in MongoDB!');
    } else {
      console.log(`ℹ️ ${orderCount} Orders already exist in MongoDB.`);
    }

    console.log('Database Seeding Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding Failed:', error);
    process.exit(1);
  }
};

seedDB();
