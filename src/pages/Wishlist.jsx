import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product, 1);
    removeFromWishlist(product.id);
  };

  if (wishlist.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6 text-slate-900 dark:text-white">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center text-rose-500 mx-auto">
          <Heart className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black">Your Wishlist is Empty</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
          Save your favorite step, telescopic, or industrial ladders to review or order later.
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
      
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-amber-500">Saved Items</span>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Your Saved Wishlist ({wishlist.length})</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div key={product.id} className="relative flex flex-col justify-between">
            <ProductCard product={product} />
            <div className="mt-2 flex gap-2">
              <button
                onClick={() => handleMoveToCart(product)}
                className="flex-1 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 shadow-md transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Move to Cart
              </button>
              <button
                onClick={() => removeFromWishlist(product.id)}
                className="p-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-rose-500 rounded-xl transition-colors shadow-sm"
                title="Remove from Wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Wishlist;
