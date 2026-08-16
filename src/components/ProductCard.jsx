import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Scale, ShoppingBag, Eye, Check, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';

const ProductCard = ({ product }) => {
  const [addedToast, setAddedToast] = useState(false);
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();

  const inWishlist = isInWishlist(product.id);
  const inCompare = isInCompare(product.id);

  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleToggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const handleToggleCompare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleCompare(product);
  };

  return (
    <div className="group bg-slate-900 border border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between relative">
      
      {/* Top Image Container */}
      <div className="relative aspect-4/3 bg-slate-950 overflow-hidden cursor-pointer" onClick={() => navigate(`/products/${product.id}`)}>
        
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs px-2.5 py-1 rounded-md shadow-md">
              {discountPercent}% OFF
            </span>
          )}
          {product.isNew && (
            <span className="bg-cyan-500 text-slate-950 font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow">
              New Model
            </span>
          )}
        </div>

        {/* Top Quick Actions (Wishlist & Compare) */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          
          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
              inWishlist 
                ? 'bg-rose-500 text-white' 
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title={inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
          </button>

          {/* Compare Button */}
          <button
            onClick={handleToggleCompare}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-md ${
              inCompare 
                ? 'bg-amber-500 text-slate-950 font-bold' 
                : 'bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
            title={inCompare ? "Remove from Compare" : "Compare Ladder"}
          >
            <Scale className="w-4 h-4" />
          </button>

        </div>

        {/* Category Pill Over Image Bottom */}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-700/60 px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-300">
          {product.category}
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Rating & Stock */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
            <div className="flex items-center gap-1 text-amber-400 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating}</span>
              <span className="text-slate-500 text-[11px]">({product.reviewsCount})</span>
            </div>
            <span className={`text-[11px] font-bold ${
              product.stock === 'In Stock' ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              {product.stock}
            </span>
          </div>

          {/* Product Name */}
          <Link 
            to={`/products/${product.id}`}
            className="block text-base font-bold text-white group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Specifications Pills */}
          <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] text-slate-300">
            <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
              Height: {product.height}
            </span>
            <span className="bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/50">
              Load: {product.weightCapacity}
            </span>
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
          
          <div>
            <div className="text-xl font-extrabold text-white">
              ₹{product.price.toLocaleString('en-IN')}
            </div>
            {product.originalPrice > product.price && (
              <div className="text-xs text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/products/${product.id}`}
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl transition-colors"
              title="View Specifications & Details"
            >
              <Eye className="w-4 h-4" />
            </Link>

            <button
              onClick={handleAddToCart}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all ${
                addedToast 
                  ? 'bg-emerald-500 text-slate-950' 
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 hover:shadow-amber-500/20'
              }`}
            >
              {addedToast ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductCard;
