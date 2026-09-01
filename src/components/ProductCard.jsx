import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, Scale, ShoppingBag, Eye, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';

const ProductCard = ({ product }) => {
  const [addedToast, setAddedToast] = useState(false);
  const navigate = useNavigate();

  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();

  if (!product) return null;

  const productId = product.id || product._id || '';
  const inWishlist = isInWishlist(productId);
  const inCompare = isInCompare(productId);

  const priceNum = Number(product.price) || 0;
  const origPriceNum = Number(product.originalPrice) || 0;
  const discountPercent = (origPriceNum > priceNum && origPriceNum > 0)
    ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100)
    : 0;

  const displayImage = (Array.isArray(product.images) && product.images.length > 0 && product.images[0])
    ? product.images[0]
    : '/images/hero_ladder.jpg';

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
    <div className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 rounded-2xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 flex flex-col justify-between relative">
      
      {/* Top Image Container */}
      <div className="relative aspect-4/3 bg-slate-100 dark:bg-slate-950 overflow-hidden cursor-pointer" onClick={() => navigate(`/products/${productId}`)}>
        
        <img
          src={displayImage}
          alt={product.name || 'Ladder'}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/images/hero_ladder.jpg';
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {discountPercent > 0 && (
            <span className="bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black text-xs px-2.5 py-1 rounded-md shadow-md">
              {discountPercent}% OFF
            </span>
          )}
          {product.isNewProduct && (
            <span className="bg-cyan-600 text-white font-bold text-[10px] uppercase px-2 py-0.5 rounded shadow">
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
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-rose-500 hover:bg-white dark:hover:bg-slate-800'
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
                : 'bg-white/80 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 hover:text-amber-500 hover:bg-white dark:hover:bg-slate-800'
            }`}
            title={inCompare ? "Remove from Compare" : "Compare Ladder"}
          >
            <Scale className="w-4 h-4" />
          </button>

        </div>

        {/* Category Pill Over Image Bottom */}
        <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border border-slate-200 dark:border-slate-700/60 px-2.5 py-1 rounded-md text-[11px] font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
          {product.category || 'Ladders'}
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Rating & Stock */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            <div className="flex items-center gap-1 text-amber-500 font-semibold">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span>{product.rating ?? 5}</span>
              <span className="text-slate-400 dark:text-slate-500 text-[11px]">({product.reviewsCount ?? 0})</span>
            </div>
            <span className={`text-[11px] font-bold ${
              product.stock === 'In Stock' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'
            }`}>
              {product.stock || 'In Stock'}
            </span>
          </div>

          {/* Product Name */}
          <Link 
            to={`/products/${productId}`}
            className="block text-base font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors line-clamp-2 leading-snug"
          >
            {product.name}
          </Link>

          {/* Specifications Pills */}
          <div className="mt-2.5 flex flex-wrap gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
            {product.height && (
              <span className="bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/50">
                Height: {product.height}
              </span>
            )}
            {product.weightCapacity && (
              <span className="bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/50">
                Load: {product.weightCapacity}
              </span>
            )}
            {product.material && (
              <span className="bg-slate-100 dark:bg-slate-800/80 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700/50">
                {product.material}
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Row */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 flex items-center justify-between gap-2">
          
          <div>
            <div className="text-xl font-extrabold text-slate-900 dark:text-white">
              ₹{priceNum.toLocaleString('en-IN')}
            </div>
            {origPriceNum > priceNum && (
              <div className="text-xs text-slate-400 dark:text-slate-500 line-through">
                ₹{origPriceNum.toLocaleString('en-IN')}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/products/${productId}`}
              className="p-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-xl transition-colors"
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
