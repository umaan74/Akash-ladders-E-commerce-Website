import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, ChevronRight, Layers, Star } from 'lucide-react';
import { useProducts } from '../context/ProductContext';

const SearchModal = ({ onClose }) => {
  const { products } = useProducts();
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    inputRef.current?.focus();
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filteredProducts = searchTerm.trim() === '' ? [] : products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectProduct = (productId) => {
    navigate(`/products/${productId}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-start justify-center pt-16 px-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in fade-in duration-200 text-slate-900 dark:text-slate-100">
        
        {/* Search Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 bg-slate-50 dark:bg-slate-950">
          <Search className="w-5 h-5 text-amber-500" />
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search ladders by name, material, height, or category..."
            className="flex-1 bg-transparent text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none text-base sm:text-lg"
          />
          <button 
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Content */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
          {searchTerm.trim() === '' ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
              <Layers className="w-10 h-10 text-slate-400 dark:text-slate-600 mx-auto mb-2 opacity-50" />
              <p>Type to search across step ladders, telescopic, extension & custom ladders.</p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {['Telescopic', 'Step Ladders', 'Fiberglass', '6ft', 'Platform'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSearchTerm(tag)}
                    className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-amber-500/20 hover:text-amber-500 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full border border-slate-200 dark:border-slate-700 transition-colors font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-8 text-slate-500 dark:text-slate-400 text-sm">
              <p>No ladders found matching "<strong className="text-slate-900 dark:text-white">{searchTerm}</strong>"</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try searching for 'Aluminium', '12ft', or 'Step'</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p className="text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-bold px-1">
                Matching Ladders ({filteredProducts.length})
              </p>
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => handleSelectProduct(product.id)}
                  className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700/50 cursor-pointer transition-all hover:scale-[1.01] group"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-14 h-14 object-cover rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                        {product.category}
                      </span>
                      <div className="flex items-center text-amber-500 text-xs font-semibold">
                        <Star className="w-3 h-3 fill-current mr-0.5" />
                        {product.rating}
                      </div>
                    </div>
                    <h4 className="text-slate-900 dark:text-white text-sm font-semibold truncate group-hover:text-amber-500 transition-colors mt-0.5">
                      {product.name}
                    </h4>
                    <p className="text-slate-500 dark:text-slate-400 text-xs">
                      {product.material} • {product.height}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-amber-600 dark:text-amber-400 font-bold text-base">
                      ₹{product.price.toLocaleString('en-IN')}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 ml-auto group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 flex justify-between items-center">
          <span>Press ESC to exit</span>
          <button 
            onClick={() => {
              navigate('/products');
              onClose();
            }}
            className="text-amber-600 dark:text-amber-400 hover:underline font-semibold"
          >
            View Full Product Catalog &rarr;
          </button>
        </div>

      </div>
    </div>
  );
};

export default SearchModal;
