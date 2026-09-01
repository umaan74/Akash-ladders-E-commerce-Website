import { io } from 'socket.io-client';

const API_BASE = 'http://localhost:5000/api';
const SOCKET_URL = 'http://localhost:5000';

async function runRealtimeSyncTests() {
  console.log('================================================================');
  console.log('⚡ Starting Akash Ladders Cross-Device Real-Time Synchronization Test');
  console.log('================================================================');

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

  // 1. Health Check
  await test('Backend Health & Socket.IO Status (/api/health)', async () => {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    if (data.status !== 'online' || !data.realtime) {
      throw new Error(`Health status unexpected: ${JSON.stringify(data)}`);
    }
    console.log(`   └ Backend Online, Real-Time: "${data.realtime}"`);
  });

  // 2. Admin Authentication
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
    console.log(`   └ Admin Authenticated: "${data.user.name}"`);
  });

  // 3. Connect Multiple Simulated Client Devices (PC, Mobile, Tablet)
  let pcClient = null;
  let mobileClient = null;
  let tabletClient = null;

  await test('Simulate Connecting Multiple Devices (PC, Mobile, Tablet)', async () => {
    const connectClient = (deviceName) => {
      return new Promise((resolve, reject) => {
        const socket = io(SOCKET_URL, {
          transports: ['websocket', 'polling'],
          timeout: 5000,
        });

        socket.on('connect', () => {
          console.log(`   └ [Device: ${deviceName}] Connected with Socket ID: ${socket.id}`);
          resolve(socket);
        });

        socket.on('connect_error', (err) => {
          reject(new Error(`[Device: ${deviceName}] Connection failed: ${err.message}`));
        });
      });
    };

    pcClient = await connectClient('PC Browser');
    mobileClient = await connectClient('Mobile Browser');
    tabletClient = await connectClient('Tablet Browser');

    if (!pcClient.connected || !mobileClient.connected || !tabletClient.connected) {
      throw new Error('One or more devices failed to connect via Socket.IO');
    }
  });

  // 4. TEST SCENARIO 1: Mobile Adds Product -> PC & Tablet receive "productCreated" in real time
  let createdProductId = null;
  await test('TEST 1: Mobile creates product -> PC & Tablet receive "productCreated" without refreshing', async () => {
    const newProductPayload = {
      name: 'Cross-Device Sync Heavy Duty Scaffold 20ft',
      category: 'Industrial Ladders',
      categoryId: 'industrial',
      price: 24500,
      originalPrice: 29999,
      stock: 'In Stock',
      material: 'Aircraft Aluminium & Carbon Joints',
      height: '20 ft',
      steps: 10,
      weightCapacity: '250 kg',
      usage: 'Heavy Construction & Warehousing',
      description: 'Tested for instant multi-device real-time sync without page reloads.',
      images: ['/images/hero_ladder.jpg'],
    };

    // Prepare event listeners on PC and Tablet BEFORE sending the POST request
    const pcPromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('PC Client timed out waiting for productCreated')), 5000);
      pcClient.once('productCreated', (data) => {
        clearTimeout(timer);
        resolve(data);
      });
    });

    const tabletPromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Tablet Client timed out waiting for productCreated')), 5000);
      tabletClient.once('productCreated', (data) => {
        clearTimeout(timer);
        resolve(data);
      });
    });

    // Mobile Admin issues POST request to create product
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify(newProductPayload),
    });
    const resData = await res.json();
    if (!resData.success || !resData.product) {
      throw new Error(`Product creation failed: ${resData.message}`);
    }
    createdProductId = resData.product.id || resData.product._id;

    // Await real-time broadcast reception on PC and Tablet
    const [pcEventData, tabletEventData] = await Promise.all([pcPromise, tabletPromise]);

    if (!pcEventData.product || pcEventData.product.name !== newProductPayload.name) {
      throw new Error('PC Client received invalid product payload in real-time');
    }
    if (!tabletEventData.product || tabletEventData.product.name !== newProductPayload.name) {
      throw new Error('Tablet Client received invalid product payload in real-time');
    }

    console.log(`   └ [PC] Real-time received "productCreated": "${pcEventData.product.name}" (ID: ${pcEventData.product.id})`);
    console.log(`   └ [Tablet] Real-time received "productCreated": "${tabletEventData.product.name}" (ID: ${tabletEventData.product.id})`);
  });

  // 5. TEST SCENARIO 2: PC Edits Product -> Mobile & Tablet receive "productUpdated" in real time
  await test('TEST 2: PC updates product -> Mobile & Tablet receive "productUpdated" without refreshing', async () => {
    if (!createdProductId) throw new Error('No product ID to update');

    // Prepare event listeners on Mobile and Tablet
    const mobilePromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Mobile Client timed out waiting for productUpdated')), 5000);
      mobileClient.once('productUpdated', (data) => {
        clearTimeout(timer);
        resolve(data);
      });
    });

    const tabletPromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Tablet Client timed out waiting for productUpdated')), 5000);
      tabletClient.once('productUpdated', (data) => {
        clearTimeout(timer);
        resolve(data);
      });
    });

    // PC Admin issues PUT request to update price & stock
    const res = await fetch(`${API_BASE}/products/${createdProductId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`,
      },
      body: JSON.stringify({
        price: 26999,
        stock: 'Limited Stock',
      }),
    });
    const resData = await res.json();
    if (!resData.success || !resData.product) {
      throw new Error(`Product update failed: ${resData.message}`);
    }

    // Await real-time broadcast reception on Mobile and Tablet
    const [mobileEventData, tabletEventData] = await Promise.all([mobilePromise, tabletPromise]);

    if (!mobileEventData.product || mobileEventData.product.price !== 26999) {
      throw new Error('Mobile Client failed to receive updated price in real-time');
    }
    if (!tabletEventData.product || tabletEventData.product.price !== 26999) {
      throw new Error('Tablet Client failed to receive updated price in real-time');
    }

    console.log(`   └ [Mobile] Real-time received "productUpdated": New Price ₹${mobileEventData.product.price}, Stock "${mobileEventData.product.stock}"`);
    console.log(`   └ [Tablet] Real-time received "productUpdated": New Price ₹${tabletEventData.product.price}, Stock "${tabletEventData.product.stock}"`);
  });

  // 6. TEST SCENARIO 3: Mobile Deletes Product -> PC & Tablet receive "productDeleted" in real time
  await test('TEST 3: Mobile deletes product -> PC & Tablet receive "productDeleted" without refreshing', async () => {
    if (!createdProductId) throw new Error('No product ID to delete');

    // Prepare event listeners on PC and Tablet
    const pcPromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('PC Client timed out waiting for productDeleted')), 5000);
      pcClient.once('productDeleted', (data) => {
        clearTimeout(timer);
        resolve(data);
      });
    });

    const tabletPromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('Tablet Client timed out waiting for productDeleted')), 5000);
      tabletClient.once('productDeleted', (data) => {
        clearTimeout(timer);
        resolve(data);
      });
    });

    // Mobile Admin issues DELETE request
    const res = await fetch(`${API_BASE}/products/${createdProductId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
      },
    });
    const resData = await res.json();
    if (!resData.success) {
      throw new Error(`Product deletion failed: ${resData.message}`);
    }

    // Await real-time broadcast reception on PC and Tablet
    const [pcEventData, tabletEventData] = await Promise.all([pcPromise, tabletPromise]);

    if ((pcEventData.id !== createdProductId && pcEventData.productId !== createdProductId)) {
      throw new Error('PC Client received wrong deleted product ID');
    }
    if ((tabletEventData.id !== createdProductId && tabletEventData.productId !== createdProductId)) {
      throw new Error('Tablet Client received wrong deleted product ID');
    }

    console.log(`   └ [PC] Real-time received "productDeleted" for ID: ${pcEventData.id}`);
    console.log(`   └ [Tablet] Real-time received "productDeleted" for ID: ${tabletEventData.id}`);
  });

  // 7. TEST SCENARIO 4: Network Disconnect & Reconnect Resilience
  await test('TEST 4: Disconnect/reconnect network resilience & automatic re-synchronization', async () => {
    // Manually disconnect PC Client
    pcClient.disconnect();
    if (pcClient.connected) throw new Error('Client should be disconnected');
    console.log('   └ [PC] Successfully disconnected from socket server');

    // Reconnect PC Client
    await new Promise((resolve, reject) => {
      pcClient.connect();
      pcClient.once('connect', () => {
        console.log(`   └ [PC] Successfully reconnected with new Socket ID: ${pcClient.id}`);
        resolve();
      });
      setTimeout(() => reject(new Error('Reconnection timed out')), 5000);
    });

    // Verify PC Client is active and healthy
    if (!pcClient.connected) throw new Error('PC Client failed to restore active connection');
  });

  // Clean up socket connections
  if (pcClient) pcClient.disconnect();
  if (mobileClient) mobileClient.disconnect();
  if (tabletClient) tabletClient.disconnect();

  console.log('================================================================');
  console.log(`🎉 Cross-Device Sync Verification Complete: ${passed}/${total} Tests Passed Successfully!`);
  console.log('================================================================');
}

runRealtimeSyncTests();
