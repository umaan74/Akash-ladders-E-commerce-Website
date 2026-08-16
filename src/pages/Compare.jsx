import React from 'react';
import { Link } from 'react-router-dom';
import { Scale, Trash2, ShoppingBag, ArrowRight, Check, X, ShieldCheck } from 'lucide-react';
import { useCompare } from '../context/CompareContext';
import { useCart } from '../context/CartContext';

const Compare = () => {
  const { compareItems, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  if (compareItems.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 bg-slate-900 border border-slate-800 rounded-full flex items-center justify-center text-amber-500 mx-auto">
          <Scale className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-black text-white">No Ladders Selected for Comparison</h2>
        <p className="text-slate-400 text-sm max-w-md mx-auto">
          Select up to 4 ladders from our catalog to compare height, weight load capacity, materials, and safety ratings side by side.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black rounded-xl shadow-xl hover:from-amber-600 transition-all"
        >
          <span>Browse Ladders Catalog</span>
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  const specRows = [
    { label: "Price", key: "price", render: (p) => <span className="text-amber-400 font-extrabold text-lg">₹{p.price.toLocaleString('en-IN')}</span> },
    { label: "Category", key: "category", render: (p) => <span className="font-semibold text-slate-300">{p.category}</span> },
    { label: "Material Composition", key: "material", render: (p) => <span className="text-white font-medium">{p.material}</span> },
    { label: "Maximum Reach Height", key: "height", render: (p) => <span className="text-white font-bold">{p.height}</span> },
    { label: "Number of Steps / Rungs", key: "steps", render: (p) => <span className="text-white font-bold">{p.steps} Rungs</span> },
    { label: "Weight Load Capacity", key: "weightCapacity", render: (p) => <span className="text-amber-400 font-bold">{p.weightCapacity}</span> },
    { label: "Product Self Weight", key: "productWeight", render: (p) => <span className="text-slate-300">{p.productWeight}</span> },
    { label: "Foldable / Collapsible", key: "foldable", render: (p) => p.foldable ? <span className="text-emerald-400 font-bold flex items-center gap-1"><Check className="w-4 h-4" /> Yes (Foldable)</span> : <span className="text-slate-400">Non-Foldable Rigid</span> },
    { label: "Recommended Application", key: "usage", render: (p) => <span className="text-slate-300">{p.usage}</span> },
    { label: "Safety Certification", key: "certification", render: (p) => <span className="text-white font-semibold">{p.certification}</span> },
    { label: "Warranty Period", key: "warranty", render: (p) => <span className="text-amber-400 font-semibold">{p.warranty}</span> }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-6 gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-bold text-amber-500">Specification Comparison Matrix</span>
          <h1 className="text-3xl font-black text-white">Compare Ladders ({compareItems.length} Selected)</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/products" className="text-xs text-amber-400 hover:underline font-bold">
            + Add More Ladders
          </Link>
          <button
            onClick={clearCompare}
            className="text-xs text-rose-400 hover:underline flex items-center gap-1 font-semibold"
          >
            <Trash2 className="w-3.5 h-3.5" /> Clear Comparison
          </button>
        </div>
      </div>

      {/* Responsive Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-x-auto shadow-2xl">
        <table className="w-full text-xs text-left border-collapse min-w-[700px]">
          
          {/* Header Row: Products */}
          <thead>
            <tr className="bg-slate-950 border-b border-slate-800">
              <th className="p-4 w-1/5 text-slate-400 font-bold uppercase tracking-wider text-[11px]">
                Product Features
              </th>
              {compareItems.map((p) => (
                <th key={p.id} className="p-4 w-1/5 border-l border-slate-800/80">
                  <div className="space-y-3 relative group">
                    <button
                      onClick={() => removeFromCompare(p.id)}
                      className="absolute top-0 right-0 p-1 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800"
                      title="Remove from compare"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <img
                      src={p.images[0]}
                      alt={p.name}
                      className="w-24 h-24 object-cover rounded-xl bg-slate-900 border border-slate-800 mx-auto"
                    />
                    <div className="text-center">
                      <Link 
                        to={`/products/${p.id}`}
                        className="text-sm font-bold text-white hover:text-amber-400 transition-colors line-clamp-2"
                      >
                        {p.name}
                      </Link>
                      <button
                        onClick={() => addToCart(p, 1)}
                        className="mt-3 w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-xl text-xs flex items-center justify-center gap-1 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Add to Cart
                      </button>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body Rows: Specs */}
          <tbody>
            {specRows.map((row, idx) => (
              <tr key={idx} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-950/40">
                <td className="p-4 font-bold text-slate-400 bg-slate-950/40">
                  {row.label}
                </td>
                {compareItems.map((p) => (
                  <td key={p.id} className="p-4 border-l border-slate-800/80">
                    {row.render(p)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default Compare;
