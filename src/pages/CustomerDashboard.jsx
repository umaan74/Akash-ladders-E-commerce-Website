import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Package, Clock, CheckCircle2, Truck, AlertCircle, Eye, User, ShoppingBag, X } from 'lucide-react';

const CustomerDashboard = () => {
  const { user, getCustomerOrders } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'profile'

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const data = await getCustomerOrders();
      setOrders(data);
      setLoading(false);
    };
    fetchOrders();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20"><Clock className="w-3.5 h-3.5" /> Order Placed</span>;
      case 'Processing':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"><Package className="w-3.5 h-3.5" /> Preparing Dispatch</span>;
      case 'Shipped':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20"><Truck className="w-3.5 h-3.5" /> In Freight Transit</span>;
      case 'Delivered':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"><CheckCircle2 className="w-3.5 h-3.5" /> Delivered</span>;
      case 'Cancelled':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20"><AlertCircle className="w-3.5 h-3.5" /> Cancelled</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">{status}</span>;
    }
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(o => o.status === statusFilter);

  const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const activeOrdersCount = orders.filter(o => o.status === 'Pending' || o.status === 'Processing' || o.status === 'Shipped').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8 text-slate-900 dark:text-slate-100">
      
      {/* Header Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden shadow-sm">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-2xl shadow-lg shadow-amber-500/20">
            {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                Customer Account
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">Welcome back, {user?.name}!</h1>
            <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-0.5">Manage your ladder orders and track freight dispatches</p>
          </div>
        </div>

        {/* Dashboard Nav Tabs */}
        <div className="flex items-center gap-2 z-10 w-full md:w-auto border-t md:border-t-0 border-slate-200 dark:border-slate-800 pt-4 md:pt-0">
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'orders'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            My Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'profile'
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
            }`}
          >
            Account Details
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Total Orders Placed</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">{orders.length}</p>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Active Dispatches</p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-400 mt-1">{activeOrdersCount}</p>
          </div>
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500">
            <Truck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">Total Procurement Spend</p>
            <p className="text-2xl font-black text-slate-900 dark:text-white mt-1">₹{totalSpent.toLocaleString('en-IN')}</p>
          </div>
          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* TAB CONTENT: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          
          {/* Status Filter Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: 'all', label: 'All Orders' },
              { id: 'Pending', label: 'Pending' },
              { id: 'Processing', label: 'Processing' },
              { id: 'Shipped', label: 'In Transit' },
              { id: 'Delivered', label: 'Delivered' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setStatusFilter(f.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === f.id
                    ? 'bg-amber-500 text-slate-950 font-bold'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center text-slate-500 dark:text-slate-400 text-sm">
              Loading order history...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-3 shadow-sm">
              <Package className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">No Orders Found</h3>
              <p className="text-slate-500 dark:text-slate-400 text-xs max-w-sm mx-auto">
                You haven't placed any industrial ladder dispatch orders matching this criteria yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map(order => (
                <div
                  key={order._id || order.orderId}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 hover:border-slate-300 dark:hover:border-slate-700 transition-all space-y-4 shadow-sm"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="text-base font-black text-amber-600 dark:text-amber-400">{order.orderId}</span>
                        {getStatusBadge(order.status)}
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 justify-between sm:justify-end">
                      <div className="text-right">
                        <p className="text-xs text-slate-500 dark:text-slate-400">Total Amount</p>
                        <p className="text-lg font-extrabold text-slate-900 dark:text-white">₹{order.total?.toLocaleString('en-IN')}</p>
                      </div>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3.5 py-2 bg-slate-50 dark:bg-slate-950 hover:bg-slate-100 dark:hover:bg-slate-800 text-amber-600 dark:text-amber-400 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-4 h-4" /> Track & Details
                      </button>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="flex items-center gap-3 overflow-x-auto py-1">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs shrink-0">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="w-8 h-8 rounded object-cover" />
                        )}
                        <span className="text-slate-900 dark:text-white font-medium truncate max-w-[150px]">{item.name}</span>
                        <span className="text-slate-500 dark:text-slate-400 font-bold">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      )}

      {/* TAB CONTENT: PROFILE */}
      {activeTab === 'profile' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 max-w-2xl shadow-sm">
          <h3 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-5 h-5 text-amber-500" /> Account Profile Details
          </h3>

          <div className="space-y-4 text-sm">
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Full Name</p>
                <p className="text-slate-900 dark:text-white font-bold text-base mt-0.5">{user?.name}</p>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-full font-semibold">
                JWT Authenticated Account
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400">Phone Number</p>
                <p className="text-slate-900 dark:text-white font-bold text-base mt-0.5">{user?.phone || 'Not provided'}</p>
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1">
              <p className="text-xs text-slate-500 dark:text-slate-400">Saved Shipping Address</p>
              <p className="text-slate-900 dark:text-white font-medium">{user?.address || 'Not provided'}</p>
              {user?.city && <p className="text-slate-500 dark:text-slate-400 text-xs">{user.city} {user.pincode ? `- ${user.pincode}` : ''}</p>}
            </div>
          </div>
        </div>
      )}

      {/* ORDER DETAILS TRACKING MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl space-y-6 p-6">
            
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-amber-500">Dispatch Order Tracking</span>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mt-1">Order {selectedOrder.orderId}</h3>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Status Timeline */}
            <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Freight Progress</p>
              <div className="grid grid-cols-4 gap-2 text-center text-xs">
                {['Pending', 'Processing', 'Shipped', 'Delivered'].map((st, i) => {
                  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
                  const currentIndex = statuses.indexOf(selectedOrder.status);
                  const isPassed = currentIndex >= i;
                  return (
                    <div key={st} className="space-y-1.5">
                      <div className={`h-2 rounded-full transition-all ${
                        isPassed ? 'bg-amber-500' : 'bg-slate-200 dark:bg-slate-800'
                      }`} />
                      <span className={`block font-semibold ${
                        isPassed ? 'text-slate-900 dark:text-white' : 'text-slate-400 dark:text-slate-600'
                      }`}>
                        {st}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Items */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Order Items</h4>
              <div className="bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 divide-y divide-slate-200 dark:divide-slate-900">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="p-3.5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img src={item.image} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="text-slate-900 dark:text-white font-bold">{item.name}</p>
                        <p className="text-slate-500 dark:text-slate-400">Qty: {item.quantity} x ₹{item.price?.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <span className="text-amber-600 dark:text-amber-400 font-extrabold">₹{(item.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price breakdown */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{selectedOrder.subtotal?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span>₹{selectedOrder.gst?.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                <span>Total Amount Paid</span>
                <span className="text-amber-600 dark:text-amber-400">₹{selectedOrder.total?.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl"
            >
              Close Tracking Details
            </button>

          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerDashboard;
