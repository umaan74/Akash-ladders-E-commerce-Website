const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('===================================================');
  console.log('🚀 Starting Akash Ladders API Integration Verification');
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

  // 2. Fetch Products
  let sampleProduct = null;
  await test('Fetch All Products (/api/products)', async () => {
    const res = await fetch(`${API_BASE}/products`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.products) || data.products.length === 0) {
      throw new Error('No products returned or success false');
    }
    sampleProduct = data.products[0];
    console.log(`   └ Products Count: ${data.count}, First Product: "${sampleProduct.name}" (ID: ${sampleProduct.id})`);
  });

  // 3. Fetch Single Product
  await test('Fetch Single Product Details (/api/products/:id)', async () => {
    if (!sampleProduct) throw new Error('No product ID to query');
    const res = await fetch(`${API_BASE}/products/${sampleProduct.id}`);
    const data = await res.json();
    if (!data.success || data.product.id !== sampleProduct.id) {
      throw new Error('Mismatch in returned product');
    }
    console.log(`   └ Product Price: ₹${data.product.price}, Stock: ${data.product.stock}`);
  });

  // 4. Customer Login
  let customerToken = null;
  await test('Customer Authentication (/api/auth/login)', async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'customer@example.com', password: 'customer123' })
    });
    const data = await res.json();
    if (!data.token || data.user.role !== 'customer') throw new Error('Failed customer login');
    customerToken = data.token;
    console.log(`   └ Customer Authenticated: "${data.user.name}" (${data.user.email})`);
  });

  // 5. Admin Login
  let adminToken = null;
  await test('Admin Authentication (/api/auth/login)', async () => {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@akashladders.com', password: 'admin123' })
    });
    const data = await res.json();
    if (!data.token || data.user.role !== 'admin') throw new Error('Failed admin login');
    adminToken = data.token;
    console.log(`   └ Admin Authenticated: "${data.user.name}" (${data.user.email})`);
  });

  // 6. Fetch Customer Orders
  await test('Fetch Customer Orders (/api/orders/my-orders)', async () => {
    const res = await fetch(`${API_BASE}/orders/my-orders`, {
      headers: { 'Authorization': `Bearer ${customerToken}` }
    });
    const data = await res.json();
    if (!data.success || !Array.isArray(data.orders)) throw new Error('Expected array of customer orders');
    console.log(`   └ Customer Order Count: ${data.count}`);
  });

  // 7. Fetch All Orders (Admin)
  await test('Fetch Admin Orders (/api/orders)', async () => {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!data.success || !Array.isArray(data.orders)) throw new Error('Expected array of admin orders');
    console.log(`   └ Admin Total Orders: ${data.count}, Revenue: ₹${data.stats?.totalRevenue}`);
  });

  // 8. Fetch Product Reviews
  await test('Fetch Product Reviews (/api/reviews/product/:id)', async () => {
    if (!sampleProduct) throw new Error('No product ID');
    const res = await fetch(`${API_BASE}/reviews/product/${sampleProduct.id}`);
    const data = await res.json();
    if (!data.success || !Array.isArray(data.reviews)) throw new Error('Expected array of reviews');
    console.log(`   └ Reviews Count for ${sampleProduct.id}: ${data.count}`);
  });

  // 9. Submit a Customer Review & Rating
  let createdReviewId = null;
  await test('Submit Review & Rating (/api/reviews)', async () => {
    const res = await fetch(`${API_BASE}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${customerToken}`
      },
      body: JSON.stringify({
        productId: sampleProduct.id,
        rating: 5,
        title: 'Outstanding Quality & Sturdy Build!',
        comment: 'We used this extension ladder for facility maintenance. Excellent stability and top-tier finish.'
      })
    });
    const data = await res.json();
    if (!data.success || !data.review) throw new Error(data.message || 'Failed submitting review');
    createdReviewId = data.review._id;
    console.log(`   └ Submitted 5-star Review for "${sampleProduct.name}"`);
  });

  // 10. Verify Admin Fetch All Reviews
  await test('Admin Fetch All Store Reviews (/api/reviews)', async () => {
    const res = await fetch(`${API_BASE}/reviews`, {
      headers: { 'Authorization': `Bearer ${adminToken}` }
    });
    const data = await res.json();
    if (!data.success || !Array.isArray(data.reviews)) throw new Error('Expected array of store reviews');
    console.log(`   └ Total Store Reviews Moderated: ${data.count}`);
  });

  console.log(`===================================================`);
  console.log(`🎉 Test Results Summary: ${passed}/${total} API Tests Passed Successfully!`);
  console.log(`===================================================`);
}

runTests();
