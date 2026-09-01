const RENDER_BACKEND_URL = 'https://akash-ladders-backend.onrender.com';
const LOCAL_BACKEND_URL = 'http://localhost:5000';

async function testBackend() {
  console.log('====================================================');
  console.log('🔍 Comparing Local Backend vs Render Production Backend');
  console.log('====================================================');

  // 1. Test Local Backend
  console.log('\n--- 1. Testing LOCAL Backend (http://localhost:5000) ---');
  try {
    const localHealthRes = await fetch(`${LOCAL_BACKEND_URL}/api/health`);
    const localHealthData = await localHealthRes.json();
    console.log('Local /api/health:', localHealthData);
  } catch (err) {
    console.error('Local /api/health failed:', err.message);
  }

  try {
    const localProdRes = await fetch(`${LOCAL_BACKEND_URL}/api/products`);
    const localProdData = await localProdRes.json();
    console.log(`Local Products count: ${localProdData.count}`);
    console.log('Local Product names/IDs:', localProdData.products?.map(p => ({ id: p.id || p._id, name: p.name })));
  } catch (err) {
    console.error('Local /api/products failed:', err.message);
  }

  // 2. Test Render Production Backend
  console.log('\n--- 2. Testing RENDER Production Backend (https://akash-ladders-backend.onrender.com) ---');
  try {
    const renderHealthRes = await fetch(`${RENDER_BACKEND_URL}/api/health`, { timeout: 15000 });
    const renderHealthData = await renderHealthRes.json();
    console.log('Render /api/health:', renderHealthData);
  } catch (err) {
    console.error('Render /api/health failed:', err.message);
  }

  try {
    const renderProdRes = await fetch(`${RENDER_BACKEND_URL}/api/products`, { timeout: 15000 });
    const renderProdData = await renderProdRes.json();
    console.log(`Render Products count: ${renderProdData.count}`);
    console.log('Render Product names/IDs:', renderProdData.products?.map(p => ({ id: p.id || p._id, name: p.name })));
  } catch (err) {
    console.error('Render /api/products failed:', err.message);
  }
}

testBackend();
