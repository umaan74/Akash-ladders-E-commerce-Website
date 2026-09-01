import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, 
  ShieldCheck, Truck, Check 
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import CheckoutModal from '../components/CheckoutModal';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart, getCartSubtotal } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  const subtotal = getCartSubtotal();
  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const subtotalAfterDiscount = subtotal - discountAmount;
  const gst = Math.round(subtotalAfterDiscount * 0.18);
  const shipping = subtotalAfterDiscount > 5000 || subtotalAfterDiscount === 0 ? 0 : 499;
  const grandTotal = subtotalAfterDiscount + gst + shipping;

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'AKASH10') {
      setDiscountPercent(10);
      setCouponApplied(true);
      setCouponError('');
    } else {
      setCouponError('Invalid coupon code. Try "AKASH10" for 10% off.');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6 text-slate-900 dark:text-white">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center text-amber-500 mx-auto">
          <ShoppingBag className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black">Your Shopping Cart is Empty</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
          Explore our range of industrial, step, and telescopic ladders certified to European safety standards.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-xl shadow-xl hover:from-amber-600 transition-all"
        >
          <span>Explore All Ladders</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8 text-slate-900 dark:text-slate-100">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-6 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-amber-500">Checkout Cart</span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Shopping Cart ({cart.length} Items)</h1>
        </div>
        <button
          onClick={clearCart}
          className="text-xs text-rose-500 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
        >
          <Trash2 className="w-3.5 h-3.5" /> Clear Cart
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-4">
          {cart.map((item) => {
            if (!item || !item.product) return null;
            const itemProd = item.product;
            const itemProdId = itemProd.id || itemProd._id;
            const itemPrice = Number(itemProd.price || 0);
            const itemImage = (Array.isArray(itemProd.images) && itemProd.images.length > 0) ? itemProd.images[0] : '/images/hero_ladder.jpg';

            return (
              <div 
                key={itemProdId}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 sm:p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 transition-colors hover:border-slate-300 dark:hover:border-slate-700 shadow-sm"
              >
                {/* Product Thumbnail & Details */}
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <img
                    src={itemImage}
                    alt={itemProd.name || 'Ladder'}
                    className="w-20 h-20 object-cover rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shrink-0"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/images/hero_ladder.jpg';
                    }}
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                      {itemProd.category || 'Ladders'}
                    </span>
                    <Link 
                      to={`/products/${itemProdId}`}
                      className="block text-slate-900 dark:text-white font-bold text-sm sm:text-base hover:text-amber-500 transition-colors truncate max-w-xs mt-1"
                    >
                      {itemProd.name}
                    </Link>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {itemProd.material || 'Aluminium'} • {itemProd.height || 'Standard'}
                    </p>
                    <p className="text-amber-600 dark:text-amber-400 font-bold text-sm mt-1 sm:hidden">
                      ₹{itemPrice.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* Quantity Selector, Price & Delete */}
                <div className="flex items-center justify-between w-full sm:w-auto gap-6 border-t sm:border-t-0 border-slate-200 dark:border-slate-800/80 pt-3 sm:pt-0">
                  
                  {/* Quantity modifier */}
                  <div className="flex items-center bg-slate-100 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-1">
                    <button
                      onClick={() => updateQuantity(itemProdId, item.quantity - 1)}
                      className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 font-bold text-xs text-slate-900 dark:text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(itemProdId, item.quantity + 1)}
                      className="p-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Subtotal Item Price */}
                  <div className="text-right hidden sm:block">
                    <div className="text-slate-900 dark:text-white font-bold text-base">
                      ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-slate-400 dark:text-slate-500">
                      ₹{itemPrice.toLocaleString('en-IN')} each
                    </div>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCart(itemProdId)}
                    className="p-2 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                </div>

              </div>
            );
          })}

          <div className="pt-2 flex justify-between items-center">
            <Link to="/products" className="text-xs text-amber-600 dark:text-amber-400 hover:underline font-bold">
              &larr; Continue Shopping
            </Link>
          </div>
        </div>

        {/* Right Column: Order Summary Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-3xl space-y-5 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" /> Order Summary
            </h3>

            {/* Price Calculations */}
            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 border-t border-b border-slate-200 dark:border-slate-800 py-4">
              <div className="flex justify-between">
                <span>Cart Subtotal</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                  <span>Promo Discount ({discountPercent}%)</span>
                  <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>GST (18%)</span>
                <span className="font-bold text-slate-900 dark:text-white">₹{gst.toLocaleString('en-IN')}</span>
              </div>

              <div className="flex justify-between">
                <span>Freight Logistics Shipping</span>
                <span className={shipping === 0 ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'font-bold text-slate-900 dark:text-white'}>
                  {shipping === 0 ? 'FREE Freight' : `₹${shipping}`}
                </span>
              </div>

              <div className="flex justify-between items-baseline pt-2 text-base font-extrabold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800/80">
                <span>Total Amount</span>
                <span className="text-amber-600 dark:text-amber-400 text-xl">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Promo Code Form */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Have a Promo Code? (Try "AKASH10")
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Enter code"
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white uppercase font-bold focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-amber-600 dark:text-amber-400 font-bold rounded-xl text-xs border border-slate-300 dark:border-slate-700"
                >
                  Apply
                </button>
              </div>
              {couponApplied && (
                <p className="text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> 10% Discount Applied Successfully!
                </p>
              )}
              {couponError && <p className="text-rose-500 text-xs">{couponError}</p>}
            </form>

            {/* Checkout Button */}
            <button
              onClick={() => setCheckoutModalOpen(true)}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-xl shadow-amber-500/20 text-base transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Delivery Guarantee */}
            <div className="text-[11px] text-slate-500 dark:text-slate-400 text-center space-y-1 pt-2">
              <p className="flex items-center justify-center gap-1 text-slate-700 dark:text-slate-300">
                <Truck className="w-3.5 h-3.5 text-amber-500" /> Direct Freight Dispatch Across India
              </p>
              <p>Pan-India Delivery within 3-5 Business Days</p>
            </div>
          </div>
        </div>

      </div>

      {/* Checkout Dialog Modal */}
      {checkoutModalOpen && (
        <CheckoutModal onClose={() => setCheckoutModalOpen(false)} />
      )}

    </div>
  );
};

export default Cart;
