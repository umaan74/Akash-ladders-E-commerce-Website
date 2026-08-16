import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, Maximize2, ChevronUp, ArrowUpRight, 
  MoveVertical, ShieldAlert, Box, Wrench, ArrowRight 
} from 'lucide-react';

const iconMap = {
  Layers: Layers,
  Maximize2: Maximize2,
  ChevronUp: ChevronUp,
  ArrowUpRight: ArrowUpRight,
  MoveVertical: MoveVertical,
  ShieldAlert: ShieldAlert,
  Box: Box,
  Wrench: Wrench
};

const CategoryCard = ({ category }) => {
  const IconComponent = iconMap[category.icon] || Layers;

  return (
    <Link 
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-500/50 p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 shadow-sm hover:shadow-xl hover:shadow-amber-500/5 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all duration-300">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-full">
            {category.badge}
          </span>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors">
          {category.name}
        </h3>
        
        <p className="text-slate-600 dark:text-slate-400 text-xs mt-2 line-clamp-2 leading-relaxed">
          {category.description}
        </p>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/60 flex items-center justify-between text-xs font-semibold text-slate-600 dark:text-slate-300 group-hover:text-amber-500">
        <span>{category.count} Models Available</span>
        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
};

export default CategoryCard;
