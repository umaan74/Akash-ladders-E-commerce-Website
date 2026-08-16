import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, Phone, Search, Heart, ShoppingBag, 
  Menu, X, Scale, Layers, ChevronRight, MessageSquare,
  User, Lock, LogOut
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import { useAuth } from '../context/AuthContext';
import SearchModal from './SearchModal';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const navigate = useNavigate();

  const { getCartItemCount } = useCart();
  const { getWishlistCount } = useWishlist();
  const { getCompareCount } = useCompare();
  const { isLoggedIn, isAdmin, logout, user } = useAuth();

  const cartCount = getCartItemCount();
  const wishlistCount = getWishlistCount();
  const compareCount = getCompareCount();

  const activeStyle = "text-amber-500 font-semibold border-b-2 border-amber-500 pb-1";
  const inactiveStyle = "text-slate-300 hover:text-white transition-colors duration-200 pb-1";

  return (
    <>
      {/* Top Notification Bar */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-amber-400 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              ISO 9001:2015 & EN131 Certified Manufacturer
            </span>
            <span className="hidden md:inline text-slate-500">|</span>
            <span className="hidden md:inline text-slate-400">
              Direct Factory Supply & Custom Manufacturing
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a 
              href="tel:8898133393" 
              className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>Contact: <strong className="text-white">Imran Rauf Khan</strong> (+91 8898133393)</span>
            </a>
            <span className="text-slate-600">|</span>
            <a 
              href="https://wa.me/918898133393?text=Hello%20Akash%20Ladders,%20I%20have%20an%20inquiry." 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Inquiry</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 bg-gradient-to-br from-amber-500 to-amber-600 rounded-lg flex items-center justify-center shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                <Layers className="w-6 h-6 text-slate-950 font-bold" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xl sm:text-2xl font-black tracking-tight text-white font-sans">
                    AKASH
                  </span>
                  <span className="text-xl sm:text-2xl font-black text-amber-500">
                    LADDERS
                  </span>
                </div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold -mt-1">
                  Strong • Safe • Reliable
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm tracking-wide">
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

            {/* Header Action Icons */}
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Search Button */}
              <button 
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-full transition-colors relative"
                title="Search Ladders"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Compare Icon */}
              <Link 
                to="/compare" 
                className="p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-full transition-colors relative hidden sm:flex items-center"
                title="Compare Products"
              >
                <Scale className="w-5 h-5" />
                {compareCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                    {compareCount}
                  </span>
                )}
              </Link>

              {/* Wishlist Icon */}
              <Link 
                to="/wishlist" 
                className="p-2 text-slate-300 hover:text-amber-400 hover:bg-slate-800 rounded-full transition-colors relative"
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
                className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 px-3.5 py-2 rounded-lg font-bold text-xs sm:text-sm shadow-lg shadow-amber-500/20 transition-all transform hover:-translate-y-0.5"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-slate-950" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-slate-950 text-amber-400 text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline">Cart</span>
              </Link>

              {/* Auth Portal Button */}
              {isLoggedIn ? (
                <div className="flex items-center gap-2">
                  {isAdmin ? (
                    <Link
                      to="/admin/dashboard"
                      className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-xs font-bold transition-all"
                      title="Admin Order Portal"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span className="hidden lg:inline">Admin Dashboard</span>
                    </Link>
                  ) : (
                    <Link
                      to="/customer/dashboard"
                      className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all"
                      title="Customer Dashboard"
                    >
                      <User className="w-4 h-4 text-amber-400" />
                      <span className="hidden lg:inline">{user?.name ? user.name : 'My Orders'}</span>
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-full transition-colors text-xs font-semibold"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-bold transition-all"
                >
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span className="hidden sm:inline">Sign In</span>
                </Link>
              )}

              {/* Mobile Hamburger Menu Toggle */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-slate-800"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900 border-b border-slate-800 px-4 pt-3 pb-6 space-y-3">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-200 hover:text-amber-400 border-b border-slate-800/50"
            >
              Home
            </Link>
            <Link 
              to="/products" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-200 hover:text-amber-400 border-b border-slate-800/50"
            >
              All Products & Catalog
            </Link>
            <Link 
              to="/compare" 
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-base font-medium text-slate-200 hover:text-amber-400 border-b border-slate-800/50"
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
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between py-2 text-base font-medium text-slate-200 hover:text-amber-400 border-b border-slate-800/50"
            >
              <span>Wishlist</span>
              {wishlistCount > 0 && (
                <span className="bg-rose-500 text-white font-bold text-xs px-2 py-0.5 rounded-full">
                  {wishlistCount}
                </span>
              )}
            </Link>
            <Link 
              to="/about" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-200 hover:text-amber-400 border-b border-slate-800/50"
            >
              About Akash Ladders
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-medium text-slate-200 hover:text-amber-400 border-b border-slate-800/50"
            >
              Contact Us
            </Link>

            {isLoggedIn ? (
              isAdmin ? (
                <Link
                  to="/admin/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2.5 px-3 bg-amber-500/10 text-amber-400 font-bold text-sm rounded-xl border border-amber-400/20"
                >
                  <ShieldCheck className="w-4 h-4" /> Admin Order Dashboard
                </Link>
              ) : (
                <Link
                  to="/customer/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2 py-2.5 px-3 bg-slate-800 text-white font-bold text-sm rounded-xl border border-slate-700"
                >
                  <User className="w-4 h-4 text-amber-400" /> Customer Order Dashboard
                </Link>
              )
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-2.5 px-3 bg-slate-800 text-amber-400 font-bold text-sm rounded-xl border border-slate-700"
              >
                <Lock className="w-4 h-4" /> Sign In / Register
              </Link>
            )}

            <div className="pt-2">
              <a 
                href="tel:8898133393"
                className="w-full flex items-center justify-center gap-2 bg-slate-800 text-amber-400 font-bold py-2.5 rounded-lg text-sm border border-slate-700"
              >
                <Phone className="w-4 h-4" />
                Call Sales: 8898133393
              </a>
            </div>
          </div>
        )}
      </header>

      {/* Search Modal */}
      {searchModalOpen && (
        <SearchModal onClose={() => setSearchModalOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
