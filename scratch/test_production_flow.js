const RENDER_BACKEND_URL = 'https://akash-ladders-backend.onrender.com/api';

async function testProductionFlow() {
  console.log('================================================================');
  console.log('🧪 Part C: Image Investigation & Cross-Device Production Verification');
  console.log('================================================================');

  // 1. Admin Login on Render Production Backend
  console.log('\n--- 1. Authenticating Admin on Render Backend ---');
  const loginRes = await fetch(`${RENDER_BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@akashladders.com', password: 'admin123' }),
  });
  const loginData = await loginRes.json();
  if (!loginData.token) {
    console.error('Admin login failed:', loginData);
    return;
  }
  const token = loginData.token;
  console.log(`✅ Admin Authenticated on Render: "${loginData.user.name}"`);

  // 2. Create TEST PRODUCT A (WITHOUT IMAGE)
  console.log('\n--- 2. Creating TEST PRODUCT A (NO IMAGE) on Render ---');
  const prodARes = await fetch(`${RENDER_BACKEND_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'MOBILE TEST NO IMAGE',
      category: 'Aluminium Ladders',
      categoryId: 'aluminium',
      price: 100,
      originalPrice: 150,
      stock: 'In Stock',
      material: 'Aluminium',
      height: '6 ft',
      steps: 4,
      weightCapacity: '150 kg',
      usage: 'Testing',
      description: 'Test product without image',
      images: [],
    }),
  });
  const prodAData = await prodARes.json();
  console.log('Product A Creation Response:', { success: prodAData.success, id: prodAData.product?.id, name: prodAData.product?.name });
  const prodAId = prodAData.product?.id || prodAData.product?._id;

  // 3. Create TEST PRODUCT B (WITH BASE64 IMAGE)
  console.log('\n--- 3. Creating TEST PRODUCT B (WITH BASE64 IMAGE) on Render ---');
  const sampleBase64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
  const prodBRes = await fetch(`${RENDER_BACKEND_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      name: 'MOBILE TEST WITH IMAGE',
      category: 'Telescopic Ladders',
      categoryId: 'telescopic',
      price: 250,
      originalPrice: 300,
      stock: 'In Stock',
      material: 'Aluminium Alloy',
      height: '10 ft',
      steps: 8,
      weightCapacity: '150 kg',
      usage: 'Testing',
      description: 'Test product with image',
      images: [sampleBase64Image],
    }),
  });
  const prodBData = await prodBRes.json();
  console.log('Product B Creation Response:', { success: prodBData.success, id: prodBData.product?.id, name: prodBData.product?.name });
  const prodBId = prodBData.product?.id || prodBData.product?._id;

  // 4. Fetch All Products from Render GET /api/products
  console.log('\n--- 4. Fetching GET /api/products from Render Backend ---');
  const getRes = await fetch(`${RENDER_BACKEND_URL}/products`);
  const getData = await getRes.json();
  console.log(`HTTP Status: ${getRes.status}, Total Products: ${getData.count}`);

  const foundA = getData.products?.find(p => p.id === prodAId || p.name === 'MOBILE TEST NO IMAGE');
  const foundB = getData.products?.find(p => p.id === prodBId || p.name === 'MOBILE TEST WITH IMAGE');

  console.log('Product A (No Image) in GET response:', foundA ? `FOUND (ID: ${foundA.id}, Images: ${foundA.images?.length})` : 'NOT FOUND');
  console.log('Product B (With Image) in GET response:', foundB ? `FOUND (ID: ${foundB.id}, Images: ${foundB.images?.length})` : 'NOT FOUND');

  // 5. Cleanup Test Products
  console.log('\n--- 5. Cleaning Up Test Products ---');
  if (prodAId) {
    await fetch(`${RENDER_BACKEND_URL}/products/${prodAId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    console.log(`Deleted Product A (${prodAId})`);
  }
  if (prodBId) {
    await fetch(`${RENDER_BACKEND_URL}/products/${prodBId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    console.log(`Deleted Product B (${prodBId})`);
  }

  console.log('\n================================================================');
  console.log('✅ Part C Test Complete!');
  console.log('================================================================');
}

testProductionFlow();
