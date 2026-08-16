import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, Phone, Mail, MapPin, Clock, ShieldCheck, 
  Award, CheckCircle2, MessageSquare, ArrowUpRight 
} from 'lucide-react';
import { categories } from '../data/products';

const Footer = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 4-Column Footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-slate-950 font-bold">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-black tracking-tight text-white">AKASH </span>
                <span className="text-xl font-black text-amber-500">LADDERS</span>
                <p className="text-[9px] uppercase tracking-widest text-slate-400 font-bold">Strong • Safe • Reliable</p>
              </div>
            </Link>

            <p className="text-xs text-slate-400 leading-relaxed">
              India's premier manufacturer of industrial, commercial, and household ladders. Certified EN131 European standard quality with aircraft-grade aluminium and non-conductive fiberglass.
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-amber-500" />
                <span>ISO 9001:2015 Quality Management</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Award className="w-4 h-4 text-amber-500" />
                <span>EN131 European Safety Compliant</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Quick Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" /> Home Landing Page
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" /> All Ladders Catalog
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" /> Product Comparison
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" /> Wishlist & Saved Models
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" /> Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" /> About Akash Ladders
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" /> Contact & Map Location
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Ladder Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Ladder Categories</h4>
            <ul className="space-y-2.5 text-xs">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link 
                    to={`/products?category=${encodeURIComponent(c.name)}`}
                    className="hover:text-amber-400 transition-colors flex items-center justify-between"
                  >
                    <span>{c.name}</span>
                    <span className="text-[10px] bg-slate-900 px-1.5 py-0.5 rounded text-slate-500">
                      {c.count}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Factory Information */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Contact Sales Office</h4>
            
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-white">Imran Rauf Khan</p>
                  <a href="tel:8898133393" className="text-amber-400 hover:underline">
                    +91 8898133393
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <a href="mailto:info@akashladders.com" className="hover:text-white">
                  info@akashladders.com
                </a>
              </div>

              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Akash Ladder Works, Marol Industrial Estate, Andheri East, Mumbai, Maharashtra 400093</span>
              </div>

              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Mon - Sat: 9:00 AM - 7:00 PM</span>
              </div>
            </div>

            <a
              href="https://wa.me/918898133393?text=Hello%20Imran%20Khan,%20I%20have%20an%20inquiry%20regarding%20Akash%20Ladders."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-all"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Direct WhatsApp Inquiry</span>
            </a>
          </div>

        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Akash Ladders Manufacturing Co. All Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span>Safety Certified</span>
            <span>•</span>
            <span>Heavy Load Tested</span>
            <span>•</span>
            <span>Pan India Freight Supply</span>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
