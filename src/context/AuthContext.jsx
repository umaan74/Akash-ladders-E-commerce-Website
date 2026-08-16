import React, { createContext, useContext, useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/api';

const AuthContext = createContext();

// Sample mock orders for fallback if database server is offline
const MOCK_SEED_ORDERS = [
  {
    _id: 'mock-ord-1',
    orderId: 'AK-849201',
    customerDetails: {
      name: 'Imran Rauf Khan',
      email: 'customer@example.com',
      phone: '8898133393',
      address: 'Industrial Plot 42, Marol MIDC, Andheri East',
      city: 'Mumbai',
      pincode: '400093',
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
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    _id: 'mock-ord-2',
    orderId: 'AK-910482',
    customerDetails: {
      name: 'Imran Rauf Khan',
      email: 'customer@example.com',
      phone: '8898133393',
      address: 'Industrial Plot 42, Marol MIDC, Andheri East',
      city: 'Mumbai',
      pincode: '400093',
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
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
  },
  {
    _id: 'mock-ord-3',
    orderId: 'AK-302194',
    customerDetails: {
      name: 'Imran Rauf Khan',
      email: 'customer@example.com',
      phone: '8898133393',
      address: 'Industrial Plot 42, Marol MIDC, Andheri East',
      city: 'Mumbai',
      pincode: '400093',
    },
    items: [
      {
        id: 'frp-dielectric-04',
        name: 'FRP Fiberglass Dielectric Electrical Safety Ladder 12ft',
        price: 16800,
        quantity: 3,
        image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=600'
      }
    ],
    subtotal: 50400,
    gst: 9072,
    shipping: 0,
    total: 59472,
    paymentMethod: 'bank',
    status: 'Delivered',
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('akash_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('akash_token') || null;
  });

  const [localOrders, setLocalOrders] = useState(() => {
    const saved = localStorage.getItem('akash_local_orders');
    return saved ? JSON.parse(saved) : MOCK_SEED_ORDERS;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('akash_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('akash_user');
    }
  }, [user]);

  useEffect(() => {
    if (token) {
      localStorage.setItem('akash_token', token);
    } else {
      localStorage.removeItem('akash_token');
    }
  }, [token]);

  useEffect(() => {
    localStorage.setItem('akash_local_orders', JSON.stringify(localOrders));
  }, [localOrders]);

  // Strict Database Login handler
  const login = async (email, password) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setLoading(false);
        return { success: false, message: data.message || 'Login failed. Account not found or invalid password.' };
      }

      setToken(data.token);
      setUser(data.user);
      setLoading(false);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Database Authentication Error:', error.message);
      setLoading(false);
      return { 
        success: false, 
        message: 'Could not connect to database server. Please ensure MongoDB & Express server are running.' 
      };
    }
  };

  // Strict Database Registration handler
  const register = async (formData) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        setLoading(false);
        return { success: false, message: data.message || 'Registration failed.' };
      }

      setToken(data.token);
      setUser(data.user);
      setLoading(false);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Database Registration Error:', error.message);
      setLoading(false);
      return { 
        success: false, 
        message: 'Could not connect to database server. Please ensure MongoDB & Express server are running.' 
      };
    }
  };

  // Logout handler
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('akash_user');
    localStorage.removeItem('akash_token');
  };

  // Fetch Customer Orders
  const getCustomerOrders = async () => {
    if (!token) return localOrders;
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data.success) {
        return data.orders;
      }
    } catch (err) {
      console.warn('Could not fetch from server API, using local orders:', err.message);
    }
    return localOrders;
  };

  // Fetch Admin Orders (Protected)
  const getAdminOrders = async (filterStatus = 'all', searchQuery = '') => {
    try {
      const queryParams = new URLSearchParams();
      if (filterStatus && filterStatus !== 'all') queryParams.append('status', filterStatus);
      if (searchQuery) queryParams.append('search', searchQuery);

      const res = await fetch(`${API_BASE_URL}/api/orders?${queryParams.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok && data.success) {
        return { orders: data.orders, stats: data.stats };
      }
    } catch (err) {
      console.warn('Could not fetch admin orders from API server, filtering local state:', err.message);
    }

    // Local fallback filtering
    let filtered = [...localOrders];
    if (filterStatus && filterStatus !== 'all') {
      filtered = filtered.filter(o => o.status === filterStatus);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        o => o.orderId.toLowerCase().includes(q) ||
             (o.customerDetails?.name || '').toLowerCase().includes(q) ||
             (o.customerDetails?.phone || '').includes(q)
      );
    }

    const stats = {
      totalOrders: localOrders.length,
      totalRevenue: localOrders.reduce((sum, o) => sum + (o.total || 0), 0),
      pendingCount: localOrders.filter(o => o.status === 'Pending').length,
      processingCount: localOrders.filter(o => o.status === 'Processing').length,
      shippedCount: localOrders.filter(o => o.status === 'Shipped').length,
      deliveredCount: localOrders.filter(o => o.status === 'Delivered').length,
      cancelledCount: localOrders.filter(o => o.status === 'Cancelled').length,
    };

    return { orders: filtered, stats };
  };

  // Admin Update Order Status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Also update localState
        setLocalOrders(prev =>
          prev.map(o => (o._id === orderId || o.orderId === orderId ? { ...o, status: newStatus } : o))
        );
        return { success: true, message: data.message };
      }
    } catch (err) {
      console.warn('API update failed, updating local state:', err.message);
    }

    // Local state fallback update
    setLocalOrders(prev =>
      prev.map(o => (o._id === orderId || o.orderId === orderId ? { ...o, status: newStatus } : o))
    );
    return { success: true, message: `Status updated to ${newStatus}` };
  };

  // Create Order
  const createOrder = async (orderData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          ...orderData,
          userId: user?._id || null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setLocalOrders(prev => [data.order, ...prev]);
        return data.order;
      }
    } catch (err) {
      console.warn('Backend API unavailable, saving locally:', err.message);
    }

    const fallbackOrder = {
      _id: 'loc-' + Date.now(),
      orderId: 'AK-' + Math.floor(100000 + Math.random() * 900000),
      customerId: user?._id || null,
      customerDetails: orderData.customerDetails,
      items: orderData.items,
      subtotal: orderData.subtotal,
      gst: orderData.gst,
      shipping: orderData.shipping,
      total: orderData.total,
      paymentMethod: orderData.paymentMethod,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };

    setLocalOrders(prev => [fallbackOrder, ...prev]);
    return fallbackOrder;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        getCustomerOrders,
        getAdminOrders,
        updateOrderStatus,
        createOrder,
        isAdmin: user?.role === 'admin',
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
