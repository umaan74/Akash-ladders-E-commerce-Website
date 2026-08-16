import fetch from 'node-fetch'; // Or native fetch in Node 18+

const RENDER_BACKEND_URL = 'https://akash-ladders-backend.onrender.com';

async function testBackend() {
  console.log('Testing Render Backend at:', RENDER_BACKEND_URL);

  // 1. Health check
  try {
    const healthRes = await fetch(`${RENDER_BACKEND_URL}/api/health`);
    console.log('GET /api/health status:', healthRes.status);
    const healthData = await healthRes.json();
    console.log('Health response:', healthData);
  } catch (err) {
    console.error('Health check failed:', err.message);
  }

  // 2. GET /api/products
  try {
    const prodRes = await fetch(`${RENDER_BACKEND_URL}/api/products`);
    console.log('GET /api/products status:', prodRes.status);
    const prodData = await prodRes.json();
    console.log('Products count:', prodData.count);
  } catch (err) {
    console.error('GET /api/products failed:', err.message);
  }
}

testBackend();
