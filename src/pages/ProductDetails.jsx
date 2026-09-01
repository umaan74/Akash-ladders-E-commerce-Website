import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, ShoppingBag, Check, ShieldCheck, 
  MessageSquare, Award, AlertTriangle, Plus, Minus, Zap,
  Send, CheckCircle2, Lock, Trash2
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import CheckoutModal from '../components/CheckoutModal';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn, isAdmin } = useAuth();
  const { products, getProductById, fetchProductReviews, submitReview, deleteReview } = useProducts();

  const product = getProductById(id);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);

  // Reviews state
  const [productReviews, setProductReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  const { addToCart } = useCart();

  const priceNum = Number(product?.price) || 0;
  const origPriceNum = Number(product?.originalPrice) || 0;
  const discountPercent = (origPriceNum > priceNum && origPriceNum > 0)
    ? Math.round(((origPriceNum - priceNum) / origPriceNum) * 100)
    : 0;

  const productImages = (Array.isArray(product?.images) && product.images.length > 0)
    ? product.images
    : ['/images/hero_ladder.jpg'];

  // Load genuine customer reviews from MongoDB
  const loadReviews = async () => {
    if (product?.id) {
      setLoadingReviews(true);
      const revs = await fetchProductReviews(product.id);
      setProductReviews(revs || []);
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [id, product?.id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Product Not Found</h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">The ladder model you are looking for does not exist in our catalog.</p>
        <Link to="/products" className="inline-block px-6 py-2.5 bg-amber-500 text-slate-950 font-bold rounded-xl text-xs">
          Back to Product Catalog
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    setCheckoutModalOpen(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    if (!reviewComment.trim()) {
      alert('Please enter your review feedback.');
      return;
    }

    setSubmittingReview(true);
    setReviewMessage('');

    const res = await submitReview({
      productId: product.id,
      rating: reviewRating,
      title: reviewTitle,
      comment: reviewComment,
    });

    if (res.success) {
      setReviewMessage('Thank you! Your rating & review has been saved in MongoDB.');
      setReviewTitle('');
      setReviewComment('');
      loadReviews();
    } else {
      setReviewMessage('Error: ' + res.message);
    }
    setSubmittingReview(false);
  };

  const handleDeleteReview = async (reviewId) => {
    if (window.confirm('Delete your review?')) {
      const res = await deleteReview(reviewId);
      if (res.success) {
        loadReviews();
      } else {
        alert(res.message);
      }
    }
  };

  const whatsappMessage = `Hello Imran Rauf Khan / Akash Ladders, I would like to inquire about: ${product.name} (Model ID: ${product.id}). Please send availability and freight quote to my location.`;
  const whatsappUrl = `https://wa.me/918898133393?text=${encodeURIComponent(whatsappMessage)}`;

  const relatedProducts = products
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 text-slate-900 dark:text-slate-100">
      
      {/* Toast Notification */}
      {addedToast && (
        <div className="fixed top-20 right-6 z-50 bg-emerald-500 text-slate-950 font-bold px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-5 h-5" /> Added to cart successfully!
        </div>
      )}

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-amber-500 transition-colors">Home</Link>
        <span>/</span>
        <Link to="/products" className="hover:text-amber-500 transition-colors">Ladders Catalog</Link>
        <span>/</span>
        <span className="text-slate-900 dark:text-slate-200 font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left: Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden aspect-[4/3] flex items-center justify-center p-6 group shadow-sm">
            <img 
              src={productImages[activeImageIndex] || productImages[0]} 
              alt={product.name || 'Ladder'}
              className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/images/hero_ladder.jpg';
              }}
            />
            
            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
              {product.featured && (
                <span className="px-3 py-1 bg-amber-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider rounded-full shadow-lg">
                  Industrial Heavy Duty
                </span>
              )}
              {discountPercent > 0 && (
                <span className="px-3 py-1 bg-emerald-500 text-slate-950 font-extrabold text-[10px] uppercase tracking-wider rounded-full shadow-lg">
                  Save {discountPercent}%
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {productImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {productImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 bg-white dark:bg-slate-900 p-1 ${
                    activeImageIndex === idx ? 'border-amber-500 shadow-lg shadow-amber-500/20' : 'border-slate-200 dark:border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Info & Actions */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs uppercase tracking-widest font-extrabold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
                {product.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">ID: {product.id}</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white leading-tight">{product.name}</h1>
            
            {/* Rating Summary */}
            <div className="flex items-center gap-3 text-xs pt-1">
              <div className="flex items-center gap-1 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20 text-amber-600 dark:text-amber-400 font-bold">
                <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                <span>{product.rating} / 5.0</span>
              </div>
              <span className="text-slate-600 dark:text-slate-400 font-medium">
                ({product.reviewsCount} Customer Reviews in Database)
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ISO 9001 Tested
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 space-y-3 shadow-sm">
            <div className="flex items-baseline gap-4">
              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-lg text-slate-400 dark:text-slate-500 line-through font-bold">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                Inclusive of all Taxes & Shipping
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              ⚡ Factory direct wholesale pricing from Akash Scaffolding & Industrial Ladders.
            </p>
          </div>

          {/* Specifications Snapshot */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-sm">
              <span className="text-slate-500 font-semibold block text-[11px]">Material</span>
              <span className="text-slate-900 dark:text-slate-200 font-bold">{product.material}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-sm">
              <span className="text-slate-500 font-semibold block text-[11px]">Max Height</span>
              <span className="text-slate-900 dark:text-slate-200 font-bold">{product.height}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-sm">
              <span className="text-slate-500 font-semibold block text-[11px]">Load Capacity</span>
              <span className="text-slate-900 dark:text-slate-200 font-bold">{product.weightCapacity}</span>
            </div>
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Quantity:</span>
              <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-slate-950 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-extrabold text-slate-900 dark:text-white text-sm">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-xl bg-white dark:bg-slate-950 flex items-center justify-center text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className="w-full py-4 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 border border-amber-500/40 text-amber-600 dark:text-amber-400 font-extrabold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98"
              >
                <ShoppingBag className="w-5 h-5" /> Add to Cart
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition-all active:scale-98"
              >
                <Zap className="w-5 h-5 fill-slate-950" /> Buy Now
              </button>
            </div>
          </div>

          {/* Direct WhatsApp Quote Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold rounded-2xl text-xs flex items-center justify-center gap-2 transition-all"
          >
            <MessageSquare className="w-4 h-4" /> Direct WhatsApp Inquiry with Founder (Imran Khan)
          </a>

        </div>

      </div>

      {/* Detailed Specifications Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-4 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            Detailed Technical Specifications
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <tbody>
                {[
                  { label: "Material Composition", val: product.material },
                  { label: "Maximum Working Height", val: product.height },
                  { label: "Number of Steps / Rungs", val: `${product.steps} Heavy-Duty Rungs` },
                  { label: "Weight Load Capacity", val: product.weightCapacity },
                  { label: "Product Self Weight", val: product.productWeight },
                  { label: "Foldable / Collapsible", val: product.foldable ? "Yes (Foldable / Compact Storage)" : "Non-Foldable Rigid Frame" },
                  { label: "Recommended Application", val: product.usage },
                  { label: "Safety Standard Certification", val: product.certification },
                  { label: "Factory Warranty", val: product.warranty }
                ].map((row, idx) => (
                  <tr key={idx} className="border-b border-slate-200 dark:border-slate-800/60 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-950/40">
                    <td className="py-3 px-3 font-semibold text-slate-500 dark:text-slate-400 w-1/3">{row.label}</td>
                    <td className="py-3 px-3 font-bold text-slate-900 dark:text-white">{row.val}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6 shadow-sm">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" /> Key Features & Engineering
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {product.features?.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-base font-bold text-amber-600 dark:text-amber-400 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" /> Mandatory Safety Information
            </h3>
            <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
              {product.safetyInfo?.map((info, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0 mt-1.5" />
                  <span>{info}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* REVIEWS & RATINGS SECTION */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-8 shadow-sm">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Star className="w-6 h-6 text-amber-500 fill-amber-500" /> Genuine Customer Ratings & Reviews
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1">Stored in MongoDB database collection. Only authenticated customers can rate and review.</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-950 px-5 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <span className="text-3xl font-black text-slate-900 dark:text-white">{product.rating}</span>
            <div className="text-xs">
              <div className="flex items-center text-amber-500">
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} className={`w-3.5 h-3.5 ${star <= Math.round(product.rating) ? 'fill-amber-500' : 'text-slate-300 dark:text-slate-700'}`} />
                ))}
              </div>
              <span className="text-slate-500 dark:text-slate-400 font-semibold">{product.reviewsCount} Total Reviews</span>
            </div>
          </div>
        </div>

        {/* Review Form or Auth Prompt */}
        <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-amber-500" /> Rate & Review This Product
          </h3>

          {!isLoggedIn ? (
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
              <div className="flex items-center gap-3 text-amber-700 dark:text-amber-300">
                <Lock className="w-5 h-5 shrink-0" />
                <span>Please sign in to your registered customer account to submit a rating and review for this product. Anonymous reviews are disabled.</span>
              </div>
              <Link
                to="/login"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs shrink-0 shadow-md"
              >
                Sign In to Review
              </Link>
            </div>
          ) : (
            <form onSubmit={handleReviewSubmit} className="space-y-4 text-xs">
              
              {reviewMessage && (
                <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> {reviewMessage}
                </div>
              )}

              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-700 dark:text-slate-300">Your Rating:</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 transition-transform hover:scale-125 focus:outline-none"
                    >
                      <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-amber-500 text-amber-500' : 'text-slate-300 dark:text-slate-700'}`} />
                    </button>
                  ))}
                </div>
                <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">({reviewRating} / 5 Stars)</span>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Review Title (Optional)</label>
                <input
                  type="text"
                  value={reviewTitle}
                  onChange={(e) => setReviewTitle(e.target.value)}
                  placeholder="e.g. Extremely sturdy build quality, delivered fast!"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1 font-semibold">Detailed Review Feedback *</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your experience regarding heavy duty capacity, lock security, or delivery..."
                  className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-500/20 flex items-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" /> {submittingReview ? 'Submitting to MongoDB...' : 'Post Review'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Existing Reviews List */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Customer Feedback & Verified Experience ({productReviews.length})
          </h3>

          {loadingReviews ? (
            <p className="text-xs text-slate-500">Loading reviews from MongoDB database...</p>
          ) : productReviews.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 text-xs">
              No customer reviews submitted for this ladder yet. Be the first registered customer to post a review!
            </div>
          ) : (
            <div className="space-y-3">
              {productReviews.map((rev) => (
                <div key={rev._id} className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                        {rev.userName?.[0]?.toUpperCase() || 'C'}
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 dark:text-white">{rev.userName}</span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 ml-2">Verified Customer</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-slate-500">
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      {(isAdmin || (user && user.id === rev.userId)) && (
                        <button
                          onClick={() => handleDeleteReview(rev._id)}
                          className="text-slate-400 hover:text-red-500 p-1"
                          title="Delete Review"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-500' : 'text-slate-300 dark:text-slate-800'}`} />
                    ))}
                  </div>

                  {rev.title && <p className="font-bold text-slate-900 dark:text-white">{rev.title}</p>}
                  <p className="text-slate-700 dark:text-slate-300 italic">"{rev.comment}"</p>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Related Ladders */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">Related Safety Ladders</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutModalOpen && (
        <CheckoutModal onClose={() => setCheckoutModalOpen(false)} />
      )}

    </div>
  );
};

export default ProductDetails;
