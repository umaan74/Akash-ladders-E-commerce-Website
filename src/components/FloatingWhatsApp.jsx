import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

const FloatingWhatsApp = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const phone = "918898133393";
  const whatsappUrl = `https://wa.me/${phone}?text=Hello%20Akash%20Ladders,%20I%20am%20interested%20in%20your%20ladders.%20Please%20share%20catalog%20and%20pricing.`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2 group">
      
      {/* Speech Bubble Tooltip */}
      {showTooltip && (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-2xl shadow-2xl max-w-xs text-xs text-white relative animate-bounce-subtle hidden sm:block">
          <button
            onClick={() => setShowTooltip(false)}
            className="absolute top-1.5 right-1.5 text-slate-400 hover:text-white p-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-slate-950 text-xs shrink-0">
              IK
            </div>
            <div>
              <p className="font-bold text-emerald-400">Chat with Sales Head</p>
              <p className="text-[11px] text-slate-300">Imran Rauf Khan (+91 8898133393)</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-14 h-14 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-slate-950 rounded-full flex items-center justify-center shadow-2xl shadow-emerald-500/30 hover:scale-110 transition-all duration-300 relative group"
        title="Instant WhatsApp Support"
      >
        <MessageSquare className="w-7 h-7 fill-slate-950 text-slate-950" />
        
        {/* Glowing pulse ring */}
        <span className="absolute inset-0 rounded-full bg-emerald-400 opacity-75 animate-ping -z-10 pointer-events-none"></span>
      </a>

    </div>
  );
};

export default FloatingWhatsApp;
