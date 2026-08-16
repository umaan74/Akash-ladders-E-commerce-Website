import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, X, Layers, RotateCcw } from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import ProductCard from '../components/ProductCard';
import FilterSidebar from '../components/FilterSidebar';

const Products = () => {
  const { products } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [selectedHeightRange, setSelectedHeightRange] = useState('All');
  const [selectedUsage, setSelectedUsage] = useState('All');
  const [maxPrice, setMaxPrice] = useState(40000);
  const [sortBy, setSortBy] = useState('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('All');
    setSelectedMaterial('All');
    setSelectedHeightRange('All');
    setSelectedUsage('All');
    setMaxPrice(40000);
    setSortBy('popular');
    setSearchParams({});
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Search
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesCat = product.category.toLowerCase().includes(query);
        const matchesMat = product.material.toLowerCase().includes(query);
        if (!matchesName && !matchesCat && !matchesMat) return false;
      }

      // Category
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      // Material
      if (selectedMaterial !== 'All' && product.material !== selectedMaterial) {
        return false;
      }

      // Usage
      if (selectedUsage !== 'All' && product.usage !== selectedUsage) {
        return false;
      }

      // Price
      if (product.price > maxPrice) {
        return false;
      }

      // Height
      if (selectedHeightRange !== 'All') {
        const heightVal = parseInt(product.height) || 0;
        if (selectedHeightRange === 'Up to 6 ft' && heightVal > 6) return false;
        if (selectedHeightRange === '6 ft - 12 ft' && (heightVal < 6 || heightVal > 12)) return false;
        if (selectedHeightRange === '12 ft - 24 ft' && (heightVal < 12 || heightVal > 24)) return false;
        if (selectedHeightRange === '24 ft+' && heightVal < 24) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      if (sortBy === 'popular') return b.rating - a.rating;
      return 0;
    });
  }, [products, searchTerm, selectedCategory, selectedMaterial, selectedHeightRange, selectedUsage, maxPrice, sortBy]);

  const activeFilterCount = (selectedCategory !== 'All' ? 1 : 0) + 
                            (selectedMaterial !== 'All' ? 1 : 0) + 
                            (selectedHeightRange !== 'All' ? 1 : 0) + 
                            (selectedUsage !== 'All' ? 1 : 0) + 
                            (maxPrice < 40000 ? 1 : 0) + 
                            (searchTerm !== '' ? 1 : 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8 text-slate-900 dark:text-slate-100">
      
      {/* Page Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-3 relative overflow-hidden shadow-sm">
        <div className="relative z-10">
          <span className="text-xs uppercase tracking-widest font-bold text-amber-500">Catalog & Product Search</span>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">Akash Ladders Collection</h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-2xl">
            Explore our complete inventory of industrial extension ladders, telescopic ladders, fiberglass electrical ladders, and multi-purpose step platforms.
          </p>
        </div>
      </div>

      {/* Main Grid & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Desktop Sidebar */}
        <div className="hidden lg:block lg:col-span-3">
          <FilterSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedMaterial={selectedMaterial}
            setSelectedMaterial={setSelectedMaterial}
            selectedHeightRange={selectedHeightRange}
            setSelectedHeightRange={setSelectedHeightRange}
            selectedUsage={selectedUsage}
            setSelectedUsage={setSelectedUsage}
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            onResetFilters={handleResetFilters}
          />
        </div>

        {/* Right Product Grid Area */}
        <div className="lg:col-span-9 space-y-6">
          
          {/* Controls Bar: Search, Mobile Filter Toggle, Sort */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            
            {/* Search Input */}
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search ladders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700"
              >
                <SlidersHorizontal className="w-4 h-4 text-amber-500" />
                <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
              </button>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-slate-400 hidden sm:block" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500"
                >
                  <option value="popular">Sort: Most Popular</option>
                  <option value="price-low">Sort: Price (Low to High)</option>
                  <option value="price-high">Sort: Price (High to Low)</option>
                  <option value="newest">Sort: Newest Models</option>
                </select>
              </div>

            </div>

          </div>

          {/* Active Filter Chips */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-slate-500 font-bold uppercase text-[10px]">Active Filters:</span>
              
              {selectedCategory !== 'All' && (
                <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                  Category: {selectedCategory}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedCategory('All')} />
                </span>
              )}

              {selectedMaterial !== 'All' && (
                <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                  Material: {selectedMaterial}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedMaterial('All')} />
                </span>
              )}

              {selectedHeightRange !== 'All' && (
                <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                  Height: {selectedHeightRange}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedHeightRange('All')} />
                </span>
              )}

              {selectedUsage !== 'All' && (
                <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                  Usage: {selectedUsage}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedUsage('All')} />
                </span>
              )}

              {maxPrice < 40000 && (
                <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 px-2.5 py-1 rounded-full flex items-center gap-1 font-semibold">
                  Under ₹{maxPrice.toLocaleString('en-IN')}
                  <X className="w-3 h-3 cursor-pointer" onClick={() => setMaxPrice(40000)} />
                </span>
              )}

              <button
                onClick={handleResetFilters}
                className="text-slate-500 hover:text-slate-900 dark:hover:text-white underline text-xs font-semibold ml-2"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 px-1">
            <span>Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> ladder models</span>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center space-y-4 shadow-sm">
              <Layers className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto opacity-40" />
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Ladders Match Your Search</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs max-w-sm mx-auto">
                Try expanding your price slider or clearing specific material and height filters.
              </p>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>

      </div>

      {/* Mobile Filter Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex justify-end">
          <div className="bg-white dark:bg-slate-900 w-full max-w-xs h-full p-5 overflow-y-auto space-y-6 shadow-2xl text-slate-900 dark:text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Filter Ladders</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <FilterSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedMaterial={selectedMaterial}
              setSelectedMaterial={setSelectedMaterial}
              selectedHeightRange={selectedHeightRange}
              setSelectedHeightRange={setSelectedHeightRange}
              selectedUsage={selectedUsage}
              setSelectedUsage={setSelectedUsage}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              onResetFilters={handleResetFilters}
            />

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-amber-500 text-slate-950 font-bold rounded-xl text-sm"
            >
              Apply Filters ({filteredProducts.length} Results)
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;
