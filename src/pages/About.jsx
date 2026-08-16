import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, Award, Building2, 
  Layers, Wrench 
} from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-16 pb-16 text-slate-900 dark:text-slate-100">
      
      {/* Hero Banner */}
      <section className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 py-16 text-center relative overflow-hidden transition-colors">
        <div className="max-w-4xl mx-auto px-4 space-y-4 relative z-10">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-500">Established 1998</span>
          <h1 className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white">About Akash Ladders</h1>
          <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Engineered for strength. Certified for safety. India's premier manufacturer of high-reach aluminium, telescopic, fiberglass, and customized industrial access solutions.
          </p>
        </div>
      </section>

      {/* Legacy & Mission Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <span className="text-xs uppercase tracking-widest font-bold text-amber-500">Our Story</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white leading-tight">
              28 Years of Uncompromising <br />
              <span className="text-amber-500">Safety & Engineering</span>
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Founded in 1998, Akash Ladders started with a single promise: to build access ladders that NEVER compromise on user safety. Today, our 45,000 sq.ft state-of-the-art manufacturing plant produces over 50,000 ladders annually, serving leading infrastructure builders, utility companies, commercial complexes, and homes pan-India.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
                <div className="text-amber-600 dark:text-amber-400 font-black text-xl">ISO 9001:2015</div>
                <div className="text-slate-900 dark:text-white font-bold text-xs">Quality System</div>
              </div>
              <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1 shadow-sm">
                <div className="text-amber-600 dark:text-amber-400 font-black text-xl">EN131 Standard</div>
                <div className="text-slate-900 dark:text-white font-bold text-xs">European Certified</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
              <img
                src="/images/hero_ladder.jpg"
                alt="Akash Factory Facility"
                className="w-full h-[400px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-wider">Manufacturing Unit • Mumbai</span>
                <h4 className="text-lg font-bold">Automated Extrusion & Load Testing Facility</h4>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Core Values Grid */}
      <section className="bg-slate-100 dark:bg-slate-900 border-y border-slate-200 dark:border-slate-800 py-16 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs uppercase tracking-widest font-bold text-amber-500">Core Principles</span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white mt-1">What Sets Akash Ladders Apart</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Every rung, rivet, and hinge is designed for maximum structural safety.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">100% Safety Certified</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                All ladder models strictly conform to EN131 European standards and ANSI safety requirements. Rated for up to 350kg static weight margin.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Aircraft Grade Alloy</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                We exclusively utilize 6063-T6 virgin aluminium alloy and pultruded non-conductive FRP fiberglass for electrical safety environments.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-500">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Tailor-Made Fabrication</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Our in-house design engineering team custom fabricates industrial tank ladders, vessel ladders, and mobile scaffolding platforms.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-10 rounded-3xl space-y-6 max-w-3xl mx-auto shadow-sm">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Ready to Upgrade Your Access Safety?</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm">Browse our full catalogue or talk directly with our sales team for bulk quotes.</p>
          <div className="flex justify-center gap-4">
            <Link
              to="/products"
              className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-sm transition-all"
            >
              Explore Catalog
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold rounded-xl text-sm border border-slate-300 dark:border-slate-700 transition-all"
            >
              Contact Sales Head
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default About;
