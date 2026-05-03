import React, { useState, useEffect } from 'react';
import { MapPin, ExternalLink, Navigation, Search } from 'lucide-react';

export default function PharmacyMap() {
  const [coords, setCoords] = useState<{ lat: number, lng: number } | null>(null);
  const [loading, setLoading] = useState(false);

  const openInGoogleMaps = () => {
    const url = coords 
      ? `https://www.google.com/maps/search/pharmacy/@${coords.lat},${coords.lng},15z`
      : `https://www.google.com/maps/search/pharmacies+near+me`;
    window.open(url, '_blank');
  };

  return (
    <div className="glass rounded-[3rem] p-10 mt-6 overflow-hidden relative group border-white/5 hover:border-neon-blue/30 transition-all duration-500">
      <div className="absolute top-0 right-0 p-12 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity">
        <MapPin className="w-40 h-40 text-neon-blue rotate-12" />
      </div>
      
      <div className="relative z-10 flex flex-col items-center text-center gap-8">
        <div className="p-6 bg-neon-blue rounded-[2rem] shadow-[0_0_30px_rgba(0,123,255,0.3)]">
          <MapPin className="w-10 h-10 text-white" />
        </div>
        <div>
          <h3 className="text-4xl font-black text-white tracking-tighter">Lab Locator</h3>
          <p className="text-neon-blue font-bold mt-3 uppercase tracking-widest text-xs opacity-80">Find nearby medical facilities</p>
        </div>
        
        <button 
          onClick={openInGoogleMaps}
          className="w-full mt-4 flex items-center justify-center gap-3 bg-neon-blue text-white p-6 rounded-[2rem] font-black text-xl shadow-2xl shadow-neon-blue/20 hover:scale-[1.02] active:scale-95 transition-all"
        >
          <Search className="w-7 h-7" />
          Scan Location
        </button>

        <div className="flex items-center gap-3 px-6 py-3 glass rounded-full border-white/5">
          <div className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
          <span className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-black">GPS Required</span>
        </div>
      </div>
    </div>
  );
}
