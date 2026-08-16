import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, ArrowRight, Award, CheckCircle2, Truck, 
  Phone, Star, Layers, Scale, Sparkles, Building2, ChevronRight, MessageSquare 
} from 'lucide-react';
import { testimonials, safetyCertifications } from '../data/products';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';

const iconMap = {
  Award: Award,
  Truck: Truck,
  Building2: Building2,
  ShieldCheck: ShieldCheck,
  CheckCircle2: CheckCircle2,
  Scale: Scale,
  Sparkles: Sparkles
};

const Home = () => {
  const { products, categories } = useProducts();
  const featuredProducts = products.filter(p => p.featured);

  return (
    <div className="space-y-20 pb-16">
      
      {/* Hero Section */}
      <section className="relative bg-slate-950 overflow-hidden pt-12 pb-20 border-b border-slate-800">
        
        {/* Decorative Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Headline & Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-400">
                <ShieldCheck className="w-4 h-4" />
                <span>India's Leading Certified Ladder Manufacturer</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none">
                Reach Higher with <br />
                <span className="bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 bg-clip-text text-transparent">
                  Strength & Safety
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                Akash Ladders manufactures industrial-grade aluminium, telescopic, fiberglass, and customized ladders built to EN131 European safety standards. Rated for maximum load capacity and heavy-duty durability.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/products"
                  className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 text-base transition-all transform hover:-translate-y-0.5"
                >
                  <span>Explore All Ladders</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  to="/contact"
                  className="w-full sm:w-auto px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2 text-base transition-all"
                >
                  <Phone className="w-5 h-5 text-amber-400" />
                  <span>Contact Sales</span>
                </Link>
              </div>

              {/* Quick Trust Badges */}
              <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-left">
                <div>
                  <div className="text-lg sm:text-2xl font-black text-white">EN131</div>
                  <div className="text-xs text-slate-400">Safety Certified</div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-black text-white">350 KG</div>
                  <div className="text-xs text-slate-400">Tested Load Margin</div>
                </div>
                <div>
                  <div className="text-lg sm:text-2xl font-black text-amber-400">5-10 YRS</div>
                  <div className="text-xs text-slate-400">Factory Warranty</div>
                </div>
              </div>

            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-amber-500/10 group">
                <img
                  src="/images/hero_ladder.jpg"
                  alt="Akash Industrial Ladder"
                  className="w-full h-[440px] object-cover group-hover:scale-105 transition-transform duration-700"
                />
                
                {/* Floating Glassmorphic Overlay Card */}
                <div className="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 p-4 rounded-2xl flex items-center justify-between shadow-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Akash Titan Series</h4>
                      <p className="text-slate-400 text-xs">Aircraft Alloy 6063-T6</p>
                    </div>
                  </div>
                  <Link 
                    to="/products"
                    className="text-xs font-bold text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-lg border border-amber-400/20 hover:bg-amber-400 hover:text-slate-950 transition-all"
                  >
                    View Models
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Safety & Quality Highlights Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {safetyCertifications.map((item, index) => {
            const IconComp = iconMap[item.icon] || ShieldCheck;
            return (
              <div 
                key={index}
                className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex items-start gap-4 hover:border-amber-500/40 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500 shrink-0">
                  <IconComp className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-sm">{item.title}</h4>
                  <p className="text-slate-400 text-xs mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Product Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-amber-500">Explore Range</span>
            <h2 className="text-3xl font-black text-white mt-1">Product Categories</h2>
            <p className="text-slate-400 text-sm mt-1">Ladders engineered for household, commercial, electrical, and industrial tasks.</p>
          </div>
          <Link 
            to="/products" 
            className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-sm hover:underline"
          >
            <span>View All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>

      {/* Featured Ladders Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest font-bold text-amber-500">Top Choices</span>
            <h2 className="text-3xl font-black text-white mt-1">Featured Ladders</h2>
            <p className="text-slate-400 text-sm mt-1">Best-selling safety ladders trusted by professionals across India.</p>
          </div>
          <Link 
            to="/products" 
            className="inline-flex items-center gap-1.5 text-amber-400 font-bold text-sm hover:underline"
          >
            <span>Browse All Ladders ({products.length})</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((prod) => (
            <ProductCard key={prod.id} product={prod} />
          ))}
        </div>
      </section>

      {/* Why Choose Akash Ladders */}
      <section className="bg-slate-900 border-y border-slate-800 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <span className="text-xs uppercase tracking-widest font-bold text-amber-500">Engineering Excellence</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                Why Professionals Choose <br />
                <span className="text-amber-500">Akash Ladders</span>
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                For over 28 years, Akash Ladders has pioneered safety innovation in access equipment. Every ladder undergoes rigorous static load testing, side deflection analysis, and joint fatigue testing.
              </p>

              <div className="space-y-4 pt-2">
                {[
                  { title: "6063-T6 Aircraft Grade Alloy", desc: "Highest strength-to-weight ratio ensuring zero flex under heavy industrial loads." },
                  { title: "Non-Slip Molded Rubber Feet", desc: "Scratch-resistant heavy-duty floor shoes providing maximum ground traction." },
                  { title: "Smart-Lock Articulated Hinges", desc: "Automatic heavy steel joint locks engineered for 50,000+ cycle durability." },
                  { title: "Pan-India Freight Logistics", desc: "Direct factory shipping to construction sites, commercial setups, and doorsteps." }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">{item.title}</h4>
                      <p className="text-slate-400 text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

            </div>

            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
                <div className="text-4xl font-black text-amber-500">28+</div>
                <div className="text-white font-bold text-sm">Years Experience</div>
                <div className="text-slate-400 text-xs">Ladder Manufacturing</div>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
                <div className="text-4xl font-black text-white">500k+</div>
                <div className="text-white font-bold text-sm">Ladders Sold</div>
                <div className="text-slate-400 text-xs">Across Pan-India</div>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
                <div className="text-4xl font-black text-white">100%</div>
                <div className="text-white font-bold text-sm">EN131 Compliant</div>
                <div className="text-slate-400 text-xs">Safety Inspected</div>
              </div>
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 text-center space-y-2">
                <div className="text-4xl font-black text-amber-500">350kg</div>
                <div className="text-white font-bold text-sm">Max Load Margin</div>
                <div className="text-slate-400 text-xs">Heavy Industrial Rating</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-500">Trusted Feedback</span>
          <h2 className="text-3xl font-black text-white mt-1">What Our Customers Say</h2>
          <p className="text-slate-400 text-sm mt-1">From site engineers to home owners, discover why customers rely on Akash Ladders.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.id} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed italic">"{t.content}"</p>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <div>
                  <h4 className="text-white font-bold text-sm">{t.name}</h4>
                  <p className="text-slate-400 text-xs">{t.role}</p>
                </div>
                <span className="text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                  {t.city}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-orange-600 rounded-3xl p-8 sm:p-12 text-slate-950 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-3xl space-y-4">
            <span className="bg-slate-950 text-amber-400 text-xs font-black uppercase px-3 py-1 rounded-full">
              Custom Industrial Manufacturing
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">
              Need Customized Ladders or Bulk Corporate Orders?
            </h2>
            <p className="text-slate-950 font-medium text-sm sm:text-base leading-relaxed">
              We fabricate specialized tank ladders, scaffolding podiums, and non-conductive fiberglass structures to your exact blueprint measurements. Contact Sales Head <strong className="underline">Imran Rauf Khan</strong> today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <a
                href="tel:8898133393"
                className="px-6 py-3.5 bg-slate-950 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-xl hover:bg-slate-900 transition-colors"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>Call Sales: 8898133393</span>
              </a>

              <a
                href="https://wa.me/918898133393?text=Hello%20Imran%20Rauf%20Khan,%20I%20need%20a%20bulk%20quote%20for%20Akash%20Ladders."
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3.5 bg-white text-slate-950 font-bold rounded-xl flex items-center justify-center gap-2 text-sm shadow-xl hover:bg-slate-100 transition-colors"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>WhatsApp Quote Request</span>
              </a>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
