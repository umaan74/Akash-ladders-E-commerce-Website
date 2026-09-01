import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as fallbackProducts, categories as initialCategories } from '../data/products';
import { useAuth } from './AuthContext';
import { API_BASE_URL } from '../config/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(fallbackProducts);
  const [categories] = useState(initialCategories);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token } = useAuth();

  // Helper to reliably retrieve token from state or localStorage
  const getAuthToken = () => {
    return token || localStorage.getItem('akash_token') || localStorage.getItem('token') || '';
  };

  // Helper to safely parse JSON responses and avoid SyntaxError: Unexpected token '<'
  const parseJsonResponse = async (res) => {
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await res.json();
    }
    const text = await res.text();
    throw new Error(text || `Server error (${res.status}). Please verify server is running or re-login.`);
  };

  // Fetch products live from MongoDB backend API (/api/products)
  const fetchLiveProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`);
      const data = await parseJsonResponse(res);
      if (res.ok && data.success && Array.isArray(data.products) && data.products.length > 0) {
        setProducts(data.products);
        setError(null);
      } else {
        setProducts(fallbackProducts);
      }
    } catch (err) {
      console.warn('Could not connect to MongoDB API server for live products, using fallback data:', err.message);
      setProducts(fallbackProducts);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveProducts();
  }, []);

  // Get product by ID
  const getProductById = (id) => {
    return products.find(p => p.id === id || p._id === id) || products[0];
  };

  // ADMIN: Add New Product
  const addProduct = async (productData) => {
    try {
      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error('Admin authorization token not found. Please log in to your Admin account.');
      }

      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await parseJsonResponse(res);
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to add product');
      }

      await fetchLiveProducts();
      return { success: true, message: data.message, product: data.product };
    } catch (err) {
      console.error('ProductContext addProduct Error:', err);
      return { success: false, message: err.message || 'Error creating product' };
    }
  };

  // ADMIN: Update Product
  const updateProduct = async (id, productData) => {
    try {
      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error('Admin authorization token not found. Please log in to your Admin account.');
      }

      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(productData),
      });

      const data = await parseJsonResponse(res);
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to update product');
      }

      await fetchLiveProducts();
      return { success: true, message: data.message, product: data.product };
    } catch (err) {
      console.error('ProductContext updateProduct Error:', err);
      return { success: false, message: err.message || 'Error updating product' };
    }
  };

  // ADMIN: Delete Product
  const deleteProduct = async (id) => {
    try {
      const authToken = getAuthToken();
      if (!authToken) {
        throw new Error('Admin authorization token not found. Please log in to your Admin account.');
      }

      const res = await fetch(`${API_BASE_URL}/api/products/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      const data = await parseJsonResponse(res);
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete product');
      }

      await fetchLiveProducts();
      return { success: true, message: data.message };
    } catch (err) {
      console.error('ProductContext deleteProduct Error:', err);
      return { success: false, message: err.message || 'Error deleting product' };
    }
  };

  // CUSTOMER: Submit Rating & Review
  const submitReview = async (reviewData) => {
    try {
      const authToken = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(reviewData),
      });

      const data = await parseJsonResponse(res);
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to submit review');
      }

      await fetchLiveProducts();
      return { success: true, message: data.message, review: data.review };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  // Fetch reviews for a specific product
  const fetchProductReviews = async (productId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/reviews/product/${productId}`);
      const data = await parseJsonResponse(res);
      if (res.ok && data.success) {
        return data.reviews;
      }
    } catch (err) {
      console.warn('Could not fetch reviews:', err.message);
    }
    return [];
  };

  // ADMIN: Fetch all store reviews for moderation
  const fetchAllReviews = async () => {
    try {
      const authToken = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/api/reviews`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await parseJsonResponse(res);
      if (res.ok && data.success) {
        return data.reviews;
      }
    } catch (err) {
      console.warn('Could not fetch all reviews:', err.message);
    }
    return [];
  };

  // ADMIN / AUTHOR: Delete review
  const deleteReview = async (reviewId) => {
    try {
      const authToken = getAuthToken();
      const res = await fetch(`${API_BASE_URL}/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await parseJsonResponse(res);
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Failed to delete review');
      }

      await fetchLiveProducts();
      return { success: true, message: data.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories,
        loading,
        error,
        refreshProducts: fetchLiveProducts,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        submitReview,
        fetchProductReviews,
        fetchAllReviews,
        deleteReview,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
