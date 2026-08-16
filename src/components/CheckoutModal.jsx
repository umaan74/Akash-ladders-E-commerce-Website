import React, { useState } from 'react';
import { X, CheckCircle2, Truck, ShieldCheck, User, Phone, Mail, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CheckoutModal = ({ onClose }) => {
  const { cart, getCartSubtotal, clearCart } = useCart();
  const { user, createOrder } = useAuth();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    address: user?.address || '',
    city: user?.city || '',
    pincode: user?.pincode || '',
    paymentMethod: 'cod'
  });

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const subtotal = getCartSubtotal();
  const gst = Math.round(subtotal * 0.18);
  const shipping = subtotal > 5000 ? 0 : 499;
  const total = subtotal + gst + shipping;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const orderData = {
      customerDetails: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        pincode: formData.pincode,
      },
      items: cart.map(item => ({
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        image: item.product.images?.[0] || item.product.image || '',
      })),
      subtotal,
      gst,
      shipping,
      total,
      paymentMethod: formData.paymentMethod,
    };

    const created = await createOrder(orderData);
    setOrderId(created?.orderId || ('AK-' + Math.floor(100000 + Math.random() * 900000)));
    setOrderPlaced(true);
    setSubmitting(false);
    clearCart();
  };

  if (orderPlaced) {
    return (
      <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-center space-y-6 animate-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100 shadow-2xl">
          <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center text-emerald-500 mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
              Order Confirmed
            </span>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-3">Thank You for Your Order!</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
              Your order ID is <strong className="text-amber-600 dark:text-amber-400">{orderId}</strong>
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-left text-xs space-y-2 text-slate-700 dark:text-slate-300">
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-slate-500 dark:text-slate-400">Customer Name:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formData.name}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-slate-500 dark:text-slate-400">Phone:</span>
              <span className="font-semibold text-slate-900 dark:text-white">{formData.phone}</span>
            </div>
            <div className="flex justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
              <span className="text-slate-500 dark:text-slate-400">Delivery Address:</span>
              <span className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">{formData.address}, {formData.city}</span>
            </div>
            <div className="flex justify-between pt-1 font-bold text-sm text-slate-900 dark:text-white">
              <span>Total Paid:</span>
              <span className="text-amber-600 dark:text-amber-400">₹{total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400">
            Our dispatch coordinator <strong className="text-slate-900 dark:text-white">Akash Ladders Sales Team (+91 8898133393)</strong> will contact you shortly to confirm freight dispatch details.
          </p>

          <button
            onClick={onClose}
            className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 transition-transform active:scale-95"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full my-8 overflow-hidden shadow-2xl text-slate-900 dark:text-slate-100">
        
        {/* Header */}
        <div className="p-5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">Akash Ladders — Direct Dispatch Checkout</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmitOrder} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Customer Details Column */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <User className="w-4 h-4" /> Customer & Delivery Details
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Delivery Address</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <textarea
                  name="address"
                  rows={2}
                  required
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">City</label>
                <input
                  type="text"
                  name="city"
                  required
                  value={formData.city}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">PIN Code</label>
                <input
                  type="text"
                  name="pincode"
                  required
                  value={formData.pincode}
                  onChange={handleChange}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Order Breakdown & Payment Column */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <h3 className="text-sm font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-2">
                <Truck className="w-4 h-4" /> Order Summary
              </h3>

              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs text-slate-700 dark:text-slate-300 max-h-40 overflow-y-auto">
                {cart.map(item => (
                  <div key={item.product.id} className="flex justify-between items-center py-1 border-b border-slate-200 dark:border-slate-900 last:border-0">
                    <span className="truncate max-w-[180px] text-slate-900 dark:text-white font-medium">{item.product.name}</span>
                    <span className="text-slate-500 dark:text-slate-400">x{item.quantity}</span>
                    <span className="text-amber-600 dark:text-amber-400 font-bold">₹{(item.product.price * item.quantity).toLocaleString('en-IN')}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 border-t border-slate-200 dark:border-slate-800 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900 dark:text-white font-medium">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>GST (18%)</span>
                  <span className="text-slate-900 dark:text-white font-medium">₹{gst.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Freight Delivery</span>
                  <span className={shipping === 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-900 dark:text-white'}>
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-slate-900 dark:text-white pt-2 border-t border-slate-200 dark:border-slate-800">
                  <span>Total Amount</span>
                  <span className="text-amber-600 dark:text-amber-400">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'cod', label: 'Cash on Delivery' },
                    { id: 'upi', label: 'UPI / QR Code' },
                    { id: 'bank', label: 'NEFT / RTGS' }
                  ].map(m => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: m.id })}
                      className={`p-2 rounded-xl border text-center text-xs font-semibold transition-all ${
                        formData.paymentMethod === m.id
                          ? 'border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 transition-transform active:scale-95 text-base disabled:opacity-50"
            >
              {submitting ? 'Submitting Order to MongoDB...' : 'Confirm Order & Place Dispatch Request'}
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};

export default CheckoutModal;
