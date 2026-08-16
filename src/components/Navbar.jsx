import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, Phone, Search, Heart, ShoppingBag, 
  Menu, X, Scale, Layers, ChevronDown, ChevronUp, MessageSquare,
  User, Lock, LogOut, Sun, Moon, Grid, ArrowRight
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { categories } from '../data/products';
import SearchModal from './SearchModal';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesAccordionOpen, setCategoriesAccordionOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { getCartItemCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { getCompareCount } = useCompare();
  const { isLoggedIn, isAdmin, logout, user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const cartCount = getCartItemCount();
  const wishlistCount = getWishlistCount();
  const compareCount = getCompareCount();

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Auto-close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const activeStyle = "text-amber-500 font-bold border-b-2 border-amber-500 pb-1 transition-all";
  const inactiveStyle = "text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-white transition-colors duration-200 pb-1";

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleCategoryClick = (categoryName) => {
    closeMobileMenu();
    navigate(`/products?category=${encodeURIComponent(categoryName)}`);
  };

  return (
    <>
      {/* Top Notification & Certification Bar */}
      <div className="bg-slate-100 dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-[10px] sm:text-xs py-1.5 px-3 sm:px-4 border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-1 sm:gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap justify-center sm:justify-start">
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
              ISO 9001:2015 & EN131 Certified Manufacturer
            </span>
            <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="hidden md:inline text-slate-600 dark:text-slate-400">
              Direct Factory Supply & Custom Manufacturing
            </span>
          </div>

          <div className="flex items-center gap-3 flex-wrap justify-center sm:justify-end">
            <a 
              href="tel:8898133393" 
              className="flex items-center gap-1 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3 h-3 text-amber-500 shrink-0" />
              <span>Imran Rauf Khan (+91 8898133393)</span>
            </a>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-700">|</span>
            <a 
              href="https://wa.me/918898133393?text=Hello%20Akash%20Ladders,%20I%20have%20an%20inquiry." 
              target="_blank" 
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5 shrink-0" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm dark:shadow-xl transition-colors">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
            
            {/* Compact Responsive Branding Logo */}
            <Link to="/" className="flex items-center gap-1.5 sm:gap-3 group min-w-0 shrink">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
                <Layers className="w-4 h-4 sm:w-5 sm:h-5 text-slate-950 font-bold" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1 leading-tight">
                  <span className="text-sm sm:text-xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
                    AKASH
                  </span>
                  <span className="text-sm sm:text-xl font-black text-amber-500">
                    LADDERS
                  </span>
                </div>
                <p className="text-[9px] sm:text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold -mt-0.5 hidden xs:block truncate">
                  Strong • Safe • Reliable
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide font-medium">
              <NavLink to="/" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
                Home
              </NavLink>
              <NavLink to="/products" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
                All Ladders
              </NavLink>
              <NavLink to="/compare" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
                Compare Ladders
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
                About Us
              </NavLink>
              <NavLink to="/contact" className={({ isActive }) => isActive ? activeStyle : inactiveStyle}>
                Contact
              </NavLink>
            </nav>

            {/* Header Action Icons (Compact & Responsive) */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
              
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors shrink-0"
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                aria-label="Toggle Dark/Light Theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                ) : (
                  <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-700" />
                )}
              </button>

              {/* Search Button */}
              <button 
                onClick={() => setSearchModalOpen(true)}
                className="p-1.5 sm:p-2 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative shrink-0"
                title="Search Ladders"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Compare Icon (Desktop/Tablet) */}
              <Link 
                to="/compare" 
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative hidden md:flex items-center shrink-0"
                title="Compare Products"
              >
                <Scale className="w-5 h-5" />
                {compareCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {compareCount}
                  </span>
                )}
              </Link>

              {/* Wishlist Icon (Desktop/Tablet) */}
              <Link 
                to="/wishlist" 
                className="p-2 text-slate-600 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors relative hidden md:flex items-center shrink-0"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Button */}
              <Link 
                to="/cart" 
                className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-lg font-bold text-xs sm:text-sm shadow-md shadow-amber-500/20 transition-all shrink-0"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-slate-950" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-slate-950 text-amber-400 text-[9px] sm:text-[10px] w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Cart</span>
              </Link>

              {/* Auth Portal Button (Desktop/Tablet) */}
              {isLoggedIn ? (
                <div className="hidden md:flex items-center gap-2 shrink-0">
                  {isAdmin ? (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold transition-all"
                      title="Admin Order Portal"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span className="hidden lg:inline">Admin Dashboard</span>
                    </Link>
                  ) : (
                    <Link
                      to="/customer/dashboard"
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold transition-all"
                      title="Customer Dashboard"
                    >
                      <User className="w-4 h-4 text-amber-500" />
                      <span className="hidden lg:inline">{user?.name ? user.name : 'My Orders'}</span>
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="p-2 text-slate-500 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors text-xs font-semibold"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-bold transition-all shrink-0"
                >
                  <Lock className="w-4 h-4 text-amber-500" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Mobile Hamburger Menu Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-1.5 sm:p-2 text-slate-700 dark:text-slate-300 hover:text-amber-500 rounded-lg bg-slate-100 dark:bg-slate-800 transition-colors shrink-0"
                aria-label="Toggle Mobile Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
              </button>

            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer / Slide-Over Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex justify-end">
          {/* Backdrop Overlay */}
          <div 
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
            onClick={closeMobileMenu}
          />

          {/* Drawer Container (Strict Max Width 85vw to prevent horizontal scrollbar) */}
          <div className="relative w-[280px] sm:w-[340px] max-w-[85vw] bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 h-full shadow-2xl z-50 flex flex-col overflow-y-auto border-l border-slate-200 dark:border-slate-800 transition-colors">
            
            {/* Mobile Header Bar */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
              <Link to="/" onClick={closeMobileMenu} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center text-slate-950 font-bold shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-black text-sm tracking-tight text-slate-900 dark:text-white">AKASH </span>
                  <span className="font-black text-sm text-amber-500">LADDERS</span>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                {/* Theme Toggle Button inside Mobile Drawer Header */}
                <button
                  onClick={toggleTheme}
                  className="p-1.5 text-slate-600 dark:text-slate-300 hover:text-amber-500 bg-slate-200 dark:bg-slate-800 rounded-lg transition-colors"
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                </button>
                <button 
                  onClick={closeMobileMenu}
                  className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-200 dark:bg-slate-800 rounded-lg"
                  aria-label="Close Mobile Menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Drawer Body Links */}
            <div className="flex-1 px-4 py-5 space-y-6">
              
              {/* Main Navigation Links */}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-2">
                  Main Navigation
                </p>
                <div className="space-y-1">
                  <Link 
                    to="/" 
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                  >
                    <span>Home</span>
                  </Link>

                  <Link 
                    to="/products" 
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                  >
                    <span>All Ladders & Catalog</span>
                  </Link>

                  <Link 
                    to="/compare" 
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                  >
                    <span>Compare Ladders</span>
                    {compareCount > 0 && (
                      <span className="bg-amber-500 text-slate-950 font-bold text-xs px-2 py-0.5 rounded-full">
                        {compareCount}
                      </span>
                    )}
                  </Link>

                  <Link 
                    to="/wishlist" 
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                  >
                    <span>Wishlist</span>
                    {wishlistCount > 0 && (
                      <span className="bg-rose-500 text-white font-bold text-xs px-2 py-0.5 rounded-full">
                        {wishlistCount}
                      </span>
                    )}
                  </Link>

                  <Link 
                    to="/cart" 
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                  >
                    <span>Shopping Cart</span>
                    {cartCount > 0 && (
                      <span className="bg-amber-500 text-slate-950 font-bold text-xs px-2 py-0.5 rounded-full">
                        {cartCount}
                      </span>
                    )}
                  </Link>

                  <Link 
                    to="/about" 
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                  >
                    <span>About Us</span>
                  </Link>

                  <Link 
                    to="/contact" 
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                  >
                    <span>Contact Us</span>
                  </Link>
                </div>
              </div>

              {/* Ladder Categories Collapsible Accordion */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <button
                  onClick={() => setCategoriesAccordionOpen(!categoriesAccordionOpen)}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 transition-all"
                >
                  <div className="flex items-center gap-2">
                    <Grid className="w-4 h-4 text-amber-500" />
                    <span>Ladder Categories</span>
                  </div>
                  {categoriesAccordionOpen ? (
                    <ChevronUp className="w-4 h-4 text-amber-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-amber-500" />
                  )}
                </button>

                {categoriesAccordionOpen && (
                  <div className="mt-2 pl-3 pr-1 space-y-1 border-l-2 border-amber-500/30 ml-3 py-1">
                    {categories.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryClick(cat.name)}
                        className="w-full flex items-center justify-between text-xs py-2 px-2.5 rounded-md text-slate-700 dark:text-slate-300 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 text-left font-medium transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded">
                          {cat.count} models
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Account Portal Links */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2 px-2">
                  Account & Dashboard
                </p>

                {isLoggedIn ? (
                  <div className="space-y-2">
                    {isAdmin ? (
                      <Link
                        to="/admin/dashboard"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-2 py-2.5 px-3 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold text-sm rounded-xl border border-amber-500/30"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        <span>Admin Order Portal</span>
                      </Link>
                    ) : (
                      <Link
                        to="/customer/dashboard"
                        onClick={closeMobileMenu}
                        className="flex items-center gap-2 py-2.5 px-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm rounded-xl border border-slate-300 dark:border-slate-700"
                      >
                        <User className="w-4 h-4 text-amber-500" />
                        <span>Customer Dashboard ({user?.name})</span>
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); closeMobileMenu(); }}
                      className="w-full flex items-center gap-2 py-2.5 px-3 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold text-sm rounded-xl border border-rose-500/30 hover:bg-rose-500 hover:text-white transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    onClick={closeMobileMenu}
                    className="flex items-center justify-between py-2.5 px-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-sm rounded-xl border border-slate-300 dark:border-slate-700"
                  >
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-amber-500" />
                      <span>Sign In / Register</span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </Link>
                )}
              </div>

              {/* Quick Contact & WhatsApp Shortcut */}
              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2">
                <a 
                  href="tel:8898133393"
                  className="w-full flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold py-2.5 rounded-lg text-xs border border-slate-300 dark:border-slate-700 hover:border-amber-500 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-500" />
                  <span>Call Sales: +91 8898133393</span>
                </a>

                <a 
                  href="https://wa.me/918898133393?text=Hello%20Akash%20Ladders,%20I%20have%20an%20inquiry." 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold py-2.5 rounded-lg text-xs border border-emerald-500/30 hover:bg-emerald-500 hover:text-white dark:hover:text-slate-950 transition-all"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Sales Team</span>
                </a>
              </div>

            </div>

            {/* Mobile Drawer Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-center text-[10px] text-slate-500">
              © {new Date().getFullYear()} Akash Ladders Mfg Co.
            </div>

          </div>
        </div>
      )}

      {/* Search Modal */}
      {searchModalOpen && (
        <SearchModal onClose={() => setSearchModalOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
