import React from 'react';
import { Filter, RotateCcw, ChevronDown, Check } from 'lucide-react';
import { categories } from '../data/products';

const FilterSidebar = ({
  selectedCategory,
  setSelectedCategory,
  selectedMaterial,
  setSelectedMaterial,
  selectedHeightRange,
  setSelectedHeightRange,
  selectedUsage,
  setSelectedUsage,
  maxPrice,
  setMaxPrice,
  onResetFilters
}) => {
  const materials = ["All", "Aluminium Alloy (6063-T6)", "Anodized Aluminium Alloy", "Fiberglass (FRP Non-Conductive)", "Reinforced Heavy Steel & Aluminium Alloy", "Stainless Steel 316 / Heavy FRP"];
  const heightRanges = ["All", "Up to 6 ft", "6 ft - 12 ft", "12 ft - 24 ft", "24 ft+"];
  const usages = ["All", "Domestic & Household", "Domestic & Commercial", "Commercial & Office", "Commercial & Industrial", "Industrial & Electrical", "Industrial & Construction", "Warehouse & Assembly Plants"];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <Filter className="w-4 h-4 text-amber-500" />
          <span>Filter Ladders</span>
        </div>
        <button
          onClick={onResetFilters}
          className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-semibold"
        >
          <RotateCcw className="w-3 h-3" /> Reset
        </button>
      </div>

      {/* Filter 1: Category */}
      <div className="space-y-2">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Category</label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            onClick={() => setSelectedCategory('All')}
            className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
              selectedCategory === 'All'
                ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === 'All' && <Check className="w-3.5 h-3.5" />}
          </button>

          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.name)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                selectedCategory === c.name
                  ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{c.name}</span>
              {selectedCategory === c.name && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Filter 2: Max Price Range */}
      <div className="space-y-2 border-t border-slate-800/80 pt-4">
        <div className="flex justify-between items-center text-xs font-bold">
          <span className="uppercase tracking-wider text-slate-400">Max Price</span>
          <span className="text-amber-400 font-extrabold text-sm">₹{maxPrice.toLocaleString('en-IN')}</span>
        </div>
        <input
          type="range"
          min="2000"
          max="40000"
          step="1000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-amber-500 bg-slate-800 rounded-lg cursor-pointer h-2"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-bold">
          <span>₹2,000</span>
          <span>₹40,000</span>
        </div>
      </div>

      {/* Filter 3: Material */}
      <div className="space-y-2 border-t border-slate-800/80 pt-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Material Type</label>
        <div className="space-y-1">
          {materials.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMaterial(m)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium truncate flex items-center justify-between transition-colors ${
                selectedMaterial === m
                  ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="truncate">{m}</span>
              {selectedMaterial === m && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

      {/* Filter 4: Height Range */}
      <div className="space-y-2 border-t border-slate-800/80 pt-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Height Reach</label>
        <div className="space-y-1">
          {heightRanges.map((h) => (
            <button
              key={h}
              onClick={() => setSelectedHeightRange(h)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                selectedHeightRange === h
                  ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span>{h}</span>
              {selectedHeightRange === h && <Check className="w-3.5 h-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Filter 5: Suitable Usage */}
      <div className="space-y-2 border-t border-slate-800/80 pt-4">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Usage Environment</label>
        <div className="space-y-1">
          {usages.map((u) => (
            <button
              key={u}
              onClick={() => setSelectedUsage(u)}
              className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium truncate flex items-center justify-between transition-colors ${
                selectedUsage === u
                  ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <span className="truncate">{u}</span>
              {selectedUsage === u && <Check className="w-3.5 h-3.5 shrink-0" />}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default FilterSidebar;
