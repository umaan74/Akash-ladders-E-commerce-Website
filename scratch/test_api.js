const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('===================================================');
  console.log('🚀 Starting Akash Ladders Comprehensive API & Mobile Flow Verification');
  console.log('===================================================');
  let passed = 0;
  let total = 0;

  async function test(name, fn) {
    total++;
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ [FAIL] ${name}: ${err.message}`);
    }
  }

  // 1. Health check
  await test('Backend Health Endpoint (/api/health)', async () => {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    if (data.status !== 'online') throw new Error('Status not online');
  });

  // 2. Test Mobile Browser Cross-Origin Preflight & CORS Headers
  await test('CORS Preflight from Mobile Origin with Credentials', async () => {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://192.168.1.105:5173',
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type, Authorization',
      },
    });
    const allowOrigin = res.headers.get('access-control-allow-origin');
    const allowCredentials = res.headers.get('access-control-allow-credentials');
    if (allowOrigin === '*') {
      throw new Error('Access-Control-Allow-Origin is wildcard "*", which is invalid with credentials!');
    }
    if (allowOrigin !== 'http://192.168.1.105:5173') {
      throw new Error(`Expected origin reflection http://192.168.1.105:5173, got ${allowOrigin}`);
    }
    if (allowCredentials !== 'true') {
      throw new Error(`Expected access-control-allow-credentials to be true`);
    }
    console.log(`   └ Reflected Origin: ${allowOrigin}, Credentials: ${allowCredentials}`);
  });

  // 3. Admin Authentication
  let adminToken = null;
  await test('Admin Authentication (/api/auth/login)', async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@akashladders.com', password: 'admin123' }),
    });
    const data = await res.json();
    if (!data.token || data.user.role !== 'admin') throw new Error('Failed admin login');
    adminToken = data.token;
    console.log(`   └ Admin Authenticated: "${data.user.name}" (${data.user.email})`);
  });

  // 4. Create Product as Admin (Testing Mobile-style Upload Payload)
  let createdProductId = null;
  const testProductData = {
    name: 'Mobile Verification Heavy Duty Ladder 16ft',
    category: 'Aluminium Ladders',
    categoryId: 'aluminium',
    price: 14500,
    originalPrice: 19999,
    stock: 'In Stock',
    material: 'High-Grade Aluminium Alloy',
    height: '16 ft',
    steps: 8,
    weightCapacity: '180 kg',
    usage: 'Industrial & Domestic',
    warranty: '5 Years Warranty',
    description: 'Special verified model for mobile browser compatibility testing.',
    images: ['data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP...mockbase64image...'],
  };

  await test('Admin Product Creation (/api/products)', async () => {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
        'Origin': 'http://192.168.1.105:5173',
      },
      body: JSON.stringify(testProductData),
    });
    const data = await res.json();
    if (!data.success || !data.product) throw new Error(data.message || 'Failed creating product');
    createdProductId = data.product.id || data.product._id;
    console.log(`   └ Created Product: "${data.product.name}" with ID: ${createdProductId}`);
  });

  // 5. Verify Newly Created Product is Fetchable
  await test('Fetch Created Product Details (/api/products/:id)', async () => {
    if (!createdProductId) throw new Error('No product ID to query');
    const res = await fetch(`${API_BASE}/products/${createdProductId}`);
    const data = await res.json();
    if (!data.success || !data.product) throw new Error('Product not found in database');
    if (data.product.name !== testProductData.name) {
      throw new Error(`Name mismatch: expected "${testProductData.name}", got "${data.product.name}"`);
    }
    console.log(`   └ Verified Database Document: "${data.product.name}", Price: ₹${data.product.price}`);
  });

  // 6. Update Product as Admin
  await test('Admin Product Update (/api/products/:id)', async () => {
    if (!createdProductId) throw new Error('No product ID to update');
    const res = await fetch(`${API_BASE}/products/${createdProductId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        price: 15999,
        stock: 'Limited Stock',
      }),
    });
    const data = await res.json();
    if (!data.success || data.product.price !== 15999 || data.product.stock !== 'Limited Stock') {
      throw new Error(data.message || 'Update failed');
    }
    console.log(`   └ Updated Price to ₹${data.product.price}, Stock to "${data.product.stock}"`);
  });

  // 7. Test Security: Reject Unauthenticated Product Creation
  await test('Security: Reject Unauthenticated Product Creation', async () => {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Hacker Ladder', price: 100, category: 'Aluminium' }),
    });
    const data = await res.json();
    if (res.status !== 401 || data.success === true) {
      throw new Error('Unauthenticated request should have returned 401 Unauthorized');
    }
    console.log(`   └ Correctly rejected with 401: "${data.message}"`);
  });

  // 8. Delete Created Product (Clean up)
  await test('Admin Product Deletion (/api/products/:id)', async () => {
    if (!createdProductId) throw new Error('No product ID to delete');
    const res = await fetch(`${API_BASE}/products/${createdProductId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    const data = await res.json();
    if (!data.success) throw new Error(data.message || 'Failed deleting product');
    console.log(`   └ Cleaned up test product`);
  });

  console.log(`===================================================`);
  console.log(`🎉 Test Results Summary: ${passed}/${total} API Tests Passed Successfully!`);
  console.log(`===================================================`);
}

runTests();
