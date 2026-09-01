import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { 
  ShieldCheck, Package, Clock, CheckCircle2, Search, RefreshCw, Eye, DollarSign, 
  Plus, Edit3, Trash2, Star, AlertCircle, X, Image as ImageIcon, Link as LinkIcon, Upload, Loader2
} from 'lucide-react';

const PRESET_IMAGES = [
  { label: 'Hero Ladder', url: '/images/hero_ladder.jpg' },
  { label: 'Fiberglass Extension', url: '/images/fiberglass_extension.jpg' },
  { label: 'Scaffolding Tower', url: '/images/scaffolding_tower.jpg' },
  { label: 'Step Ladder Pro', url: '/images/stepladder_pro.jpg' },
  { label: 'Telescopic Ladder', url: '/images/telescopic_ladder.jpg' },
  { label: 'Platform Ladder', url: '/images/platform_ladder.jpg' },
];

const AdminDashboard = () => {
  const { getAdminOrders, updateOrderStatus } = useAuth();
  const { 
    products, addProduct, updateProduct, deleteProduct, 
    fetchAllReviews, deleteReview, refreshProducts, socketConnected 
  } = useProducts();

  const [activeAdminTab, setActiveAdminTab] = useState('orders'); // 'orders' | 'products' | 'reviews'

  // ORDERS STATE
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    pendingCount: 0,
    processingCount: 0,
    shippedCount: 0,
    deliveredCount: 0,
    cancelledCount: 0,
  });
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [notification, setNotification] = useState('');

  // PRODUCTS STATE
  const [productSearch, setProductSearch] = useState('');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null = Add, object = Edit
  const [newImageUrl, setNewImageUrl] = useState('');
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    category: 'Aluminium Ladders',
    categoryId: 'aluminium',
    price: '',
    originalPrice: '',
    stock: 'In Stock',
    material: 'Heavy Duty Aluminium Alloy',
    height: '12 ft',
    steps: 6,
    weightCapacity: '150 kg',
    usage: 'Industrial & Commercial',
    warranty: '5 Years Warranty',
    description: '',
    images: ['/images/hero_ladder.jpg'],
  });
  const [deleteProductConfirm, setDeleteProductConfirm] = useState(null);

  // REVIEWS STATE
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Load Orders
  const loadOrderData = async () => {
    setLoadingOrders(true);
    const data = await getAdminOrders(statusFilter, searchQuery);
    if (data) {
      setOrders(data.orders || []);
      setStats(data.stats || {});
    }
    setLoadingOrders(false);
  };

  // Load Reviews
  const loadReviewData = async () => {
    setLoadingReviews(true);
    const revs = await fetchAllReviews();
    setReviews(revs || []);
    setLoadingReviews(false);
  };

  useEffect(() => {
    if (activeAdminTab === 'orders') {
      loadOrderData();
    } else if (activeAdminTab === 'reviews') {
      loadReviewData();
    }
  }, [activeAdminTab, statusFilter, searchQuery]);

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    const res = await updateOrderStatus(orderId, newStatus);
    if (res.success) {
      showNotification(`Order ${orderId} updated to "${newStatus}"`);
      loadOrderData();
    }
    setUpdatingId(null);
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 4000);
  };

  // IMAGE MANAGEMENT HANDLERS
  const handleAddImage = (urlToAdd) => {
    const url = urlToAdd || newImageUrl.trim();
    if (!url) return;
    if (productFormData.images.includes(url)) {
      alert('This image URL is already in the gallery list.');
      return;
    }
    setProductFormData(prev => ({
      ...prev,
      images: [...prev.images, url],
    }));
    setNewImageUrl('');
  };

  // CLIENT-SIDE CANVAS IMAGE COMPRESSION (Handles high-res mobile camera photos & formats)
  const compressImageFile = (file, maxWidth = 1200, maxHeight = 1200, quality = 0.82) => {
    return new Promise((resolve, reject) => {
      // If SVG format, keep raw
      if (file.type === 'image/svg+xml') {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          let { width, height } = img;

          // Scale down maintaining aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          // Fill white background for transparent PNG/WebP conversions
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, width, height);
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to optimized JPEG data URL (~100-250KB for fast mobile transmission)
          const dataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(dataUrl);
        };
        img.onerror = () => {
          // Fallback to raw data URL if canvas rendering fails
          resolve(event.target.result);
        };
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // DEVICE FILE UPLOAD HANDLER (Mobile & Desktop compatible)
  const handleDeviceFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const optimizedDataUrl = await compressImageFile(file, 1200, 1200, 0.82);
      if (optimizedDataUrl) {
        handleAddImage(optimizedDataUrl);
      }
    } catch (err) {
      console.error('Error processing device image upload:', err);
      alert('Could not process selected image file. Please try another image.');
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      e.target.value = ''; // Reset file input
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    if (productFormData.images.length <= 1) {
      alert('Product must have at least one image.');
      return;
    }
    setProductFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // PRODUCT CRUD HANDLERS
  const handleOpenAddProduct = () => {
    setEditingProduct(null);
    setNewImageUrl('');
    setProductFormData({
      name: '',
      category: 'Aluminium Ladders',
      categoryId: 'aluminium',
      price: '',
      originalPrice: '',
      stock: 'In Stock',
      material: 'Heavy Duty Aluminium Alloy',
      height: '12 ft',
      steps: 6,
      weightCapacity: '150 kg',
      usage: 'Industrial & Commercial',
      warranty: '5 Years Warranty',
      description: '',
      images: ['/images/hero_ladder.jpg'],
    });
    setProductModalOpen(true);
  };

  const handleOpenEditProduct = (prod) => {
    setEditingProduct(prod);
    setNewImageUrl('');
    setProductFormData({
      name: prod.name || '',
      category: prod.category || 'Aluminium Ladders',
      categoryId: prod.categoryId || (prod.category ? prod.category.toLowerCase().replace(/\s+/g, '-') : 'aluminium'),
      price: prod.price !== undefined ? prod.price : '',
      originalPrice: prod.originalPrice !== undefined ? prod.originalPrice : '',
      stock: prod.stock || 'In Stock',
      material: prod.material || '',
      height: prod.height || '',
      steps: prod.steps || 6,
      weightCapacity: prod.weightCapacity || '',
      usage: prod.usage || '',
      warranty: prod.warranty || '',
      description: prod.description || '',
      images: prod.images && prod.images.length > 0 ? [...prod.images] : ['/images/hero_ladder.jpg'],
    });
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const cleanName = productFormData.name?.trim();
    const cleanPrice = productFormData.price;

    if (!cleanName) {
      alert('Please provide a valid product name.');
      return;
    }

    if (cleanPrice === '' || cleanPrice === null || isNaN(Number(cleanPrice)) || Number(cleanPrice) < 0) {
      alert('Please provide a valid numeric selling price.');
      return;
    }

    if (!productFormData.images || productFormData.images.length === 0) {
      alert('Product must contain at least one image.');
      return;
    }

    setSavingProduct(true);
    const targetId = editingProduct ? (editingProduct.id || editingProduct._id) : null;

    const payload = {
      ...productFormData,
      name: cleanName,
      price: Number(cleanPrice),
      originalPrice: productFormData.originalPrice && !isNaN(Number(productFormData.originalPrice)) 
        ? Number(productFormData.originalPrice) 
        : Math.round(Number(cleanPrice) * 1.2),
      steps: productFormData.steps && !isNaN(Number(productFormData.steps)) 
        ? Number(productFormData.steps) 
        : 6,
    };

    try {
      if (editingProduct && targetId) {
        // Edit / Update Existing Product
        const res = await updateProduct(targetId, payload);
        if (res.success) {
          showNotification(`Product "${cleanName}" updated successfully in MongoDB database!`);
          setProductModalOpen(false);
          refreshProducts();
        } else {
          alert('Update Failed: ' + (res.message || 'Server error'));
        }
      } else {
        // Add New Product
        const res = await addProduct(payload);
        if (res.success) {
          showNotification(`New product "${cleanName}" added to MongoDB database!`);
          setProductModalOpen(false);
          refreshProducts();
        } else {
          alert('Add Failed: ' + (res.message || 'Server error'));
        }
      }
    } catch (err) {
      alert('Product Operation Failed: ' + (err.message || 'Network error'));
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (prodId) => {
    const res = await deleteProduct(prodId);
    if (res.success) {
      showNotification('Product removed from MongoDB database.');
      setDeleteProductConfirm(null);
      refreshProducts();
    } else {
      alert('Delete Failed: ' + res.message);
    }
  };

  // REVIEW MODERATION HANDLER
  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this customer review? The product average rating will recalculate.')) {
      const res = await deleteReview(reviewId);
      if (res.success) {
        showNotification('Review deleted and product rating recalculated.');
        loadReviewData();
        refreshProducts();
      } else {
        alert(res.message);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30';
      case 'Processing': return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30';
      case 'Shipped': return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30';
      case 'Delivered': return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';
      case 'Cancelled': return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/30';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const filteredProductsList = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    (p.id && p.id.toLowerCase().includes(productSearch.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8 text-slate-900 dark:text-slate-100">
      
      {/* Admin Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-sm dark:shadow-2xl">
        <div className="absolute -left-12 -top-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                JWT Authorized Admin Portal
              </span>
              <span className={`text-xs px-2.5 py-0.5 rounded-full border font-semibold flex items-center gap-1.5 ${
                socketConnected 
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                  : 'text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${socketConnected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                <span>{socketConnected ? 'Real-Time Sync Active' : 'Connecting Real-Time...'}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">Akash Ladders Admin Control Center</h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">Manage customer order dispatches, products database, prices, images, and review moderation</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="z-10 flex items-center gap-2 bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 w-full md:w-auto overflow-x-auto">
          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeAdminTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Order Dispatches
          </button>
          <button
            onClick={() => setActiveAdminTab('products')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeAdminTab === 'products'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Manage Products ({products.length})
          </button>
          <button
            onClick={() => setActiveAdminTab('reviews')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeAdminTab === 'reviews'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Review Moderation
          </button>
        </div>
      </div>

      {notification && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-600 dark:text-emerald-400 text-sm font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* =================================================== */}
      {/* TAB 1: ORDER DISPATCHES */}
      {/* =================================================== */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-8">
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-sm">
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Total Gross Sales</span>
                <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">₹{stats.totalRevenue?.toLocaleString('en-IN')}</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Across all order fulfillments</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-sm">
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Total Orders</span>
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500">
                  <Package className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalOrders}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">{stats.deliveredCount} Delivered • {stats.shippedCount} In Transit</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-sm">
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Pending Dispatches</span>
                <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-amber-600 dark:text-amber-400">{stats.pendingCount + stats.processingCount}</p>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Requires warehouse fulfillment</p>
            </div>

            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-sm">
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400 text-xs font-semibold">
                <span>Completed Deliveries</span>
                <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center text-emerald-500">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{stats.deliveredCount}</p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Successfully delivered to client</p>
            </div>
          </div>

          {/* Filter and Search Bar */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search Order ID, Customer, Phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto scrollbar-none">
              {[
                { id: 'all', label: 'All' },
                { id: 'Pending', label: 'Pending' },
                { id: 'Processing', label: 'Processing' },
                { id: 'Shipped', label: 'Shipped' },
                { id: 'Delivered', label: 'Delivered' },
                { id: 'Cancelled', label: 'Cancelled' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    statusFilter === f.id
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Order Management Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Order ID & Date</th>
                    <th className="p-4">Customer Details</th>
                    <th className="p-4">Items</th>
                    <th className="p-4">Total Price</th>
                    <th className="p-4">Status & Action</th>
                    <th className="p-4 text-center">Inspect</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
                  {loadingOrders ? (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-slate-400">Loading database orders...</td>
                    </tr>
                  ) : orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-slate-400">No orders match the selected filter.</td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order._id || order.orderId} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors">
                        <td className="p-4 font-mono">
                          <span className="font-bold text-amber-600 dark:text-amber-400 text-sm">{order.orderId}</span>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </td>

                        <td className="p-4">
                          <p className="font-bold text-slate-900 dark:text-white text-sm">{order.customerDetails?.name || 'N/A'}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">{order.customerDetails?.phone || ''} • {order.customerDetails?.email || ''}</p>
                          <p className="text-slate-400 dark:text-slate-500 text-[11px] truncate max-w-[200px]">{order.customerDetails?.address}, {order.customerDetails?.city}</p>
                        </td>

                        <td className="p-4">
                          <span className="font-bold text-slate-900 dark:text-white">{order.items?.length || 0} Products</span>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate max-w-[180px]">
                            {order.items?.map(i => `${i.name} (x${i.quantity})`).join(', ')}
                          </p>
                        </td>

                        <td className="p-4 font-extrabold text-slate-900 dark:text-white text-sm">
                          ₹{order.total?.toLocaleString('en-IN')}
                        </td>

                        <td className="p-4">
                          <select
                            value={order.status}
                            disabled={updatingId === (order._id || order.orderId)}
                            onChange={(e) => handleStatusChange(order._id || order.orderId, e.target.value)}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold focus:outline-none cursor-pointer ${getStatusColor(order.status)}`}
                          >
                            <option value="Pending" className="bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400">Pending</option>
                            <option value="Processing" className="bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400">Processing</option>
                            <option value="Shipped" className="bg-white dark:bg-slate-900 text-purple-600 dark:text-purple-400">Shipped</option>
                            <option value="Delivered" className="bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400">Delivered</option>
                            <option value="Cancelled" className="bg-white dark:bg-slate-900 text-rose-600 dark:text-rose-400">Cancelled</option>
                          </select>
                        </td>

                        <td className="p-4 text-center">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 border border-slate-300 dark:border-slate-800 rounded-xl"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================== */}
      {/* TAB 2: PRODUCT CATALOG MANAGEMENT */}
      {/* =================================================== */}
      {activeAdminTab === 'products' && (
        <div className="space-y-6">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl shadow-sm">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search Product Name, Category, ID..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              onClick={handleOpenAddProduct}
              className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> Add New Ladder Product
            </button>
          </div>

          {/* Product Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Product Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Selling Price</th>
                    <th className="p-4">Stock Status</th>
                    <th className="p-4">Images ({(products || []).reduce((sum, p) => sum + (Array.isArray(p?.images) ? p.images.length : 0), 0)})</th>
                    <th className="p-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
                  {filteredProductsList.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="p-12 text-center text-slate-400">No products found matching criteria.</td>
                    </tr>
                  ) : (
                    filteredProductsList.map(prod => (
                      <tr key={prod.id || prod._id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <img 
                              src={prod.images?.[0] || '/images/hero_ladder.jpg'} 
                              alt={prod.name || 'Product'} 
                              className="w-12 h-12 rounded-xl object-cover border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950" 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/images/hero_ladder.jpg';
                              }}
                            />
                            <div>
                              <p className="font-bold text-slate-900 dark:text-white text-sm">{prod.name}</p>
                              <span className="text-[11px] font-mono text-amber-600 dark:text-amber-400">ID: {prod.id}</span>
                            </div>
                          </div>
                        </td>

                        <td className="p-4 font-semibold text-slate-700 dark:text-slate-300">
                          {prod.category}
                        </td>

                        <td className="p-4">
                          <p className="font-extrabold text-slate-900 dark:text-white text-sm">₹{Number(prod.price || 0).toLocaleString('en-IN')}</p>
                          {Number(prod.originalPrice) > Number(prod.price) && (
                            <p className="line-through text-slate-400 text-[11px]">₹{Number(prod.originalPrice || 0).toLocaleString('en-IN')}</p>
                          )}
                        </td>

                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            prod.stock === 'In Stock' 
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                              : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
                          }`}>
                            {prod.stock || 'In Stock'}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1">
                            {prod.images?.slice(0, 3).map((img, idx) => (
                              <img 
                                key={idx} 
                                src={img} 
                                alt="" 
                                className="w-7 h-7 rounded-lg object-cover border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-950" 
                              />
                            ))}
                            {prod.images?.length > 3 && (
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-1.5 py-0.5 rounded-md border border-slate-200 dark:border-slate-800">
                                +{prod.images.length - 3}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="p-4 text-center">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="px-3 py-1.5 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 border border-slate-300 dark:border-slate-800 rounded-xl font-bold flex items-center gap-1"
                              title="Edit Details, Price & Images"
                            >
                              <Edit3 className="w-3.5 h-3.5" /> Edit
                            </button>

                            <button
                              onClick={() => setDeleteProductConfirm(prod)}
                              className="p-2 bg-slate-100 dark:bg-slate-950 hover:bg-rose-500/20 text-slate-500 dark:text-slate-400 hover:text-rose-500 border border-slate-300 dark:border-slate-800 rounded-xl"
                              title="Delete Product from Database"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================== */}
      {/* TAB 3: CUSTOMER REVIEWS MODERATION */}
      {/* =================================================== */}
      {activeAdminTab === 'reviews' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Genuine Customer Reviews</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Reviews submitted by authenticated customers. Deleting a review automatically updates the target product's rating in MongoDB.</p>
            </div>
            <button
              onClick={loadReviewData}
              className="px-3.5 py-2 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 border border-slate-300 dark:border-slate-800 rounded-xl text-xs font-bold flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingReviews ? 'animate-spin' : ''}`} /> Refresh Reviews
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm dark:shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                    <th className="p-4">Customer</th>
                    <th className="p-4">Product ID</th>
                    <th className="p-4">Rating</th>
                    <th className="p-4">Review Comment</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-center">Moderate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800/60 text-slate-700 dark:text-slate-200">
                  {loadingReviews ? (
                    <tr><td colSpan="6" className="p-12 text-center text-slate-400">Loading reviews...</td></tr>
                  ) : reviews.length === 0 ? (
                    <tr><td colSpan="6" className="p-12 text-center text-slate-400">No customer reviews recorded in database yet.</td></tr>
                  ) : (
                    reviews.map(rev => (
                      <tr key={rev._id} className="hover:bg-slate-50 dark:hover:bg-slate-950/50 transition-colors">
                        <td className="p-4 font-bold text-slate-900 dark:text-white">
                          {rev.userName}
                          <span className="block text-[11px] text-slate-500 font-normal">{rev.userEmail}</span>
                        </td>

                        <td className="p-4 font-mono text-amber-600 dark:text-amber-400 font-bold">
                          {rev.productId}
                        </td>

                        <td className="p-4">
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                            <span>{rev.rating} / 5</span>
                          </div>
                        </td>

                        <td className="p-4 max-w-xs">
                          {rev.title && <p className="font-bold text-slate-900 dark:text-white">{rev.title}</p>}
                          <p className="text-slate-600 dark:text-slate-300 text-xs italic">"{rev.comment}"</p>
                        </td>

                        <td className="p-4 text-slate-400 dark:text-slate-500 text-[11px]">
                          {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>

                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleDeleteReview(rev._id)}
                            className="p-2 bg-slate-100 dark:bg-slate-950 hover:bg-rose-500/20 text-slate-500 dark:text-slate-400 hover:text-rose-500 border border-slate-300 dark:border-slate-800 rounded-xl"
                            title="Delete / Moderate Review"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* =================================================== */}
      {/* MODAL: ADD / EDIT PRODUCT */}
      {/* =================================================== */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl max-w-3xl w-full max-h-[92dvh] sm:max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3 sm:px-6 sm:py-4 shrink-0 bg-white dark:bg-slate-900">
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 min-w-0">
                <Edit3 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 shrink-0" />
                <span className="truncate">{editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Ladder Product'}</span>
              </h3>
              <button 
                type="button"
                onClick={() => setProductModalOpen(false)} 
                className="p-1.5 sm:p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0 touch-manipulation"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="flex flex-col flex-1 overflow-hidden min-h-0">
              
              {/* Scrollable Form Body */}
              <div className="overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 space-y-4 sm:space-y-5 text-xs flex-1 overscroll-contain">
                
                {/* Product Basic Details */}
                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productFormData.name}
                    onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                    placeholder="e.g. Industrial Heavy-Duty Aluminum Ladder 24ft"
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Category</label>
                    <select
                      value={productFormData.category}
                      onChange={(e) => setProductFormData({ 
                        ...productFormData, 
                        category: e.target.value,
                        categoryId: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                      })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                    >
                      <option value="Aluminium Ladders">Aluminium Ladders</option>
                      <option value="Folding Ladders">Folding Ladders</option>
                      <option value="Step Ladders">Step Ladders</option>
                      <option value="Extension Ladders">Extension Ladders</option>
                      <option value="Telescopic Ladders">Telescopic Ladders</option>
                      <option value="Industrial Ladders">Industrial Ladders</option>
                      <option value="Customized Ladders">Customized Ladders</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Stock Status</label>
                    <select
                      value={productFormData.stock}
                      onChange={(e) => setProductFormData({ ...productFormData, stock: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-bold text-amber-600 dark:text-amber-400 cursor-pointer"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Limited Stock">Limited Stock</option>
                      <option value="Made to Order">Made to Order</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Selling Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={productFormData.price}
                      onChange={(e) => setProductFormData({ ...productFormData, price: e.target.value })}
                      placeholder="e.g. 18500"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-sm text-slate-900 dark:text-white font-extrabold focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Original Price / MRP (₹)</label>
                    <input
                      type="number"
                      min="0"
                      value={productFormData.originalPrice}
                      onChange={(e) => setProductFormData({ ...productFormData, originalPrice: e.target.value })}
                      placeholder="e.g. 24999"
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3.5 py-2.5 sm:py-2 text-base sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                {/* IMAGE MANAGEMENT SECTION */}
                <div className="bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                    <label className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4" /> Product Image Gallery ({productFormData.images?.length || 0})
                    </label>
                    
                    {/* DEVICE FILE UPLOAD BUTTON (Mobile Camera & Gallery Optimized) */}
                    <div>
                      <input 
                        ref={fileInputRef}
                        id="device-image-upload"
                        type="file" 
                        accept="image/png, image/jpeg, image/webp, image/gif, image/*" 
                        onChange={handleDeviceFileUpload} 
                        className="sr-only"
                        tabIndex={-1}
                        aria-hidden="true"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploadingImage}
                        className="w-full sm:w-auto px-3.5 py-2.5 sm:py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 border border-amber-500/40 text-amber-600 dark:text-amber-400 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95 disabled:opacity-60 cursor-pointer min-h-[40px] touch-manipulation"
                      >
                        {uploadingImage ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
                            <span>Optimizing Image...</span>
                          </>
                        ) : (
                          <>
                            <Upload className="w-4 h-4 text-amber-500" />
                            <span>Upload Image from Device</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Current Image Thumbnails */}
                  <div className="flex flex-wrap gap-2 sm:gap-2.5">
                    {productFormData.images?.map((img, idx) => (
                      <div key={idx} className="relative group w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-1 shrink-0">
                        <img src={img} alt={`Product thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 bg-rose-600 text-white w-5 h-5 rounded-md flex items-center justify-center opacity-90 hover:opacity-100 transition-opacity shadow-sm touch-manipulation"
                          title="Remove Image"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Add Image URL Input */}
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <div className="relative flex-1 min-w-0">
                      <LinkIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3.5 sm:top-3" />
                      <input
                        type="text"
                        value={newImageUrl}
                        onChange={(e) => setNewImageUrl(e.target.value)}
                        placeholder="Paste image URL (/images/... or https://...)"
                        className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2.5 sm:py-2 text-base sm:text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleAddImage()}
                      className="w-full sm:w-auto px-4 py-2.5 sm:py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 cursor-pointer active:scale-95 transition-all shrink-0 touch-manipulation"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add URL
                    </button>
                  </div>

                  {/* Preset Image Quick Selector */}
                  <div className="pt-1">
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-semibold block mb-1.5">Quick Select Catalog Preset Images:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_IMAGES.map((preset, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAddImage(preset.url)}
                          className="px-2.5 py-1.5 sm:py-1 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs sm:text-[11px] transition-colors cursor-pointer active:scale-95 touch-manipulation"
                        >
                          + {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Material Composition</label>
                    <input
                      type="text"
                      value={productFormData.material}
                      onChange={(e) => setProductFormData({ ...productFormData, material: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 sm:py-2 text-base sm:text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Max Height</label>
                    <input
                      type="text"
                      value={productFormData.height}
                      onChange={(e) => setProductFormData({ ...productFormData, height: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 sm:py-2 text-base sm:text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Weight Load Capacity</label>
                    <input
                      type="text"
                      value={productFormData.weightCapacity}
                      onChange={(e) => setProductFormData({ ...productFormData, weightCapacity: e.target.value })}
                      className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2.5 sm:py-2 text-base sm:text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Product Description</label>
                  <textarea
                    rows={3}
                    value={productFormData.description}
                    onChange={(e) => setProductFormData({ ...productFormData, description: e.target.value })}
                    placeholder="Describe ladder engineering, safety locks, and industrial certifications..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-base sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none"
                  />
                </div>

              </div>

              {/* Sticky / Fixed Footer Buttons (Always Accessible on Mobile) */}
              <div className="px-4 py-3 sm:px-6 sm:py-4 bg-slate-50 dark:bg-slate-950 flex items-center justify-end gap-2.5 sm:gap-3 border-t border-slate-200 dark:border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => setProductModalOpen(false)}
                  className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white rounded-xl font-bold text-xs sm:text-sm transition-colors cursor-pointer text-center touch-manipulation"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct || uploadingImage}
                  className="flex-1 sm:flex-initial px-5 sm:px-7 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 disabled:opacity-50 text-xs sm:text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 touch-manipulation"
                >
                  {savingProduct ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Saving...</span>
                    </>
                  ) : editingProduct ? (
                    'Save & Update'
                  ) : (
                    'Add Product'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =================================================== */}
      {/* MODAL: DELETE CONFIRMATION */}
      {/* =================================================== */}
      {deleteProductConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-hidden">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl max-w-sm sm:max-w-md w-full p-5 sm:p-6 text-center space-y-4 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
            <div className="w-12 h-12 bg-rose-500/20 text-rose-500 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">Delete Product?</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white">{deleteProductConfirm.name}</strong> from MongoDB? This action cannot be undone.
            </p>
            <div className="flex gap-2.5 sm:gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteProductConfirm(null)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDeleteProduct(deleteProductConfirm.id || deleteProductConfirm._id)}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-rose-600/20 active:scale-95 transition-all"
              >
                Delete from DB
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================== */}
      {/* ORDER INSPECTION MODAL */}
      {/* =================================================== */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl max-w-2xl w-full max-h-[92dvh] sm:max-h-[88vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 px-4 py-3 sm:px-6 sm:py-4 shrink-0 bg-white dark:bg-slate-900">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-amber-500">Admin Order Inspection</span>
                <h3 className="text-base sm:text-xl font-black text-slate-900 dark:text-white mt-0.5 truncate">Order {selectedOrder.orderId}</h3>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedOrder(null)} 
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800 font-bold shrink-0 touch-manipulation"
              >
                Close
              </button>
            </div>

            <div className="overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 space-y-4 sm:space-y-6 text-xs flex-1 overscroll-contain">
              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 font-semibold block">Customer Name</span>
                  <span className="text-slate-900 dark:text-white font-bold text-sm">{selectedOrder.customerDetails?.name}</span>
                </div>
                <div>
                  <span className="text-slate-500 font-semibold block">Phone</span>
                  <span className="text-slate-900 dark:text-white font-bold">{selectedOrder.customerDetails?.phone}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-500 font-semibold block">Delivery Address</span>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    {selectedOrder.customerDetails?.address}, {selectedOrder.customerDetails?.city} - {selectedOrder.customerDetails?.pincode}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Itemized Breakdown</h4>
                <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-900">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs gap-2">
                      <div className="flex items-center gap-3 min-w-0">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-10 h-10 rounded object-cover shrink-0" />
                        )}
                        <div className="min-w-0">
                          <p className="text-slate-900 dark:text-white font-bold truncate">{item.name}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-[11px]">Qty: {item.quantity} × ₹{item.price?.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                      <span className="text-amber-600 dark:text-amber-400 font-bold text-xs sm:text-sm shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-slate-950 p-3.5 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                <div className="flex justify-between"><span>Subtotal</span><span>₹{selectedOrder.subtotal?.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between"><span>GST (18%)</span><span>₹{selectedOrder.gst?.toLocaleString('en-IN')}</span></div>
                <div className="flex justify-between text-sm font-bold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Revenue</span>
                  <span className="text-amber-600 dark:text-amber-400">₹{selectedOrder.total?.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
