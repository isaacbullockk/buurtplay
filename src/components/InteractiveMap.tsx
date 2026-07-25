/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AMSTERDAM_LOCATIONS } from '../data';
import { LocationInfo } from '../types';
import { MapPin, Info, Users, Compass, Flame, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InteractiveMapProps {
  locations: LocationInfo[];
  selectedCity: string;
  selectedLocation: LocationInfo | null;
  onSelectLocation: (loc: LocationInfo | null) => void;
  activeEventsCount: Record<string, number>;
}

export default function InteractiveMap({ locations, selectedCity, selectedLocation, onSelectLocation, activeEventsCount }: InteractiveMapProps) {
  const [hoveredLoc, setHoveredLoc] = useState<LocationInfo | null>(null);

  // Approximate relative mapping for locations onto our stylized SVG Canvas (600x350)
  const getLocationCoords = (loc: LocationInfo) => {
    // Default coordinate map fallback for Amsterdam to preserve existing pixel-perfect design
    if (selectedCity.toLowerCase() === 'amsterdam') {
      switch (loc.name) {
        case 'Museumplein 3x3 Court': return { x: 280, y: 190 };
        case 'Oosterpark Playgrounds': return { x: 380, y: 160 };
        case 'Bijlmer Sportpark Courts': return { x: 450, y: 280 };
        case 'Westerpark Skate & Play': return { x: 210, y: 110 };
        case 'Rembrandtpark Courts': return { x: 160, y: 180 };
        case 'Kraaiennest Sport Cage': return { x: 510, y: 250 };
      }
    }

    if (!locations || locations.length === 0) {
      return { x: 300, y: 175 };
    }

    // Dynamic bounding-box grid mapping
    const lats = locations.map(l => l.lat || 0);
    const lngs = locations.map(l => l.lng || 0);
    let minLat = Math.min(...lats);
    let maxLat = Math.max(...lats);
    let minLng = Math.min(...lngs);
    let maxLng = Math.max(...lngs);

    if (maxLat === minLat) { maxLat += 0.01; minLat -= 0.01; }
    if (maxLng === minLng) { maxLng += 0.01; minLng -= 0.01; }

    const pctX = ((loc.lng || 0) - minLng) / (maxLng - minLng);
    const pctY = 1 - (((loc.lat || 0) - minLat) / (maxLat - minLat));

    // Pad coordinate spacing to fit gracefully on our 600x350 slate canvas
    const x = 80 + pctX * (600 - 160);
    const y = 60 + pctY * (350 - 120);

    return { x, y };
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4 text-left" id="interactive-map-panel">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-display font-bold text-slate-900 text-base">
            {selectedCity} Interactive Court Map
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Tap a local hotspot to filter active games & sports containers.
          </p>
        </div>
        
        {selectedLocation && (
          <button
            onClick={() => onSelectLocation(null)}
            className="text-[10px] font-bold text-orange-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-lg transition"
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Styled Interactive SVG Canvas */}
      <div className="relative w-full aspect-[600/350] bg-slate-950 rounded-2xl overflow-hidden border border-slate-900 group shadow-inner">
        {/* Abstract vector grid lines representing streets */}
        <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 600 350">
          <line x1="50" y1="0" x2="100" y2="350" stroke="white" strokeWidth="1" />
          <line x1="180" y1="0" x2="220" y2="350" stroke="white" strokeWidth="1" />
          <line x1="320" y1="0" x2="290" y2="350" stroke="white" strokeWidth="1" />
          <line x1="480" y1="0" x2="420" y2="350" stroke="white" strokeWidth="1" />
          
          <line x1="0" y1="80" x2="600" y2="100" stroke="white" strokeWidth="1" />
          <line x1="0" y1="180" x2="600" y2="160" stroke="white" strokeWidth="1" />
          <line x1="0" y1="260" x2="600" y2="280" stroke="white" strokeWidth="1" />
          
          {/* Broad canal paths (curves) */}
          <path d="M 0,150 Q 250,50 350,220 T 600,100" fill="none" stroke="white" strokeWidth="16" className="opacity-20" />
          <path d="M 100,0 Q 300,180 500,350" fill="none" stroke="white" strokeWidth="8" className="opacity-15" />
        </svg>

        {/* Neighborhood Overlay labels - adaptive or preset */}
        {selectedCity.toLowerCase() === 'amsterdam' ? (
          <>
            <div className="absolute top-4 left-6 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Noord</div>
            <div className="absolute bottom-6 left-12 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Nieuw-West</div>
            <div className="absolute bottom-6 right-20 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Zuidoost</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] font-mono font-bold text-slate-600 uppercase tracking-widest">Center</div>
          </>
        ) : (
          <>
            <div className="absolute top-4 left-6 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Zone North</div>
            <div className="absolute bottom-6 left-12 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Zone West</div>
            <div className="absolute bottom-6 right-20 text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest">Zone East</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[11px] font-mono font-bold text-slate-600 uppercase tracking-widest">{selectedCity} Hub</div>
          </>
        )}

        {/* Hotspots layer */}
        {locations.map((loc) => {
          const { x, y } = getLocationCoords(loc);
          const isSelected = selectedLocation?.name === loc.name;
          const isHovered = hoveredLoc?.name === loc.name;
          const count = activeEventsCount[loc.name] || 0;

          return (
            <div
              key={loc.name}
              style={{ left: `${(x / 600) * 100}%`, top: `${(y / 350) * 100}%` }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
              onMouseEnter={() => setHoveredLoc(loc)}
              onMouseLeave={() => setHoveredLoc(null)}
              onClick={() => onSelectLocation(isSelected ? null : loc)}
            >
              <div className="relative cursor-pointer">
                {/* Ping rings */}
                <span className={`absolute -inset-2.5 rounded-full ${isSelected ? 'bg-orange-500/30' : 'bg-orange-500/10'} animate-ping opacity-75`}></span>
                
                {/* Core dot */}
                <motion.div
                  animate={{
                    scale: isSelected ? 1.25 : isHovered ? 1.15 : 1,
                  }}
                  className={`w-6 h-6 rounded-full flex items-center justify-center border-2 shadow-lg transition-all ${
                    isSelected 
                      ? 'bg-orange-500 border-white text-white' 
                      : 'bg-slate-900 border-orange-500 text-orange-400'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                </motion.div>

                {/* Micro tooltip label count */}
                {count > 0 && (
                  <span className="absolute -top-2.5 -right-2.5 bg-orange-600 text-white font-mono text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-white">
                    {count}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Dynamic Tooltip on Hover */}
        <AnimatePresence>
          {(hoveredLoc || selectedLocation) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-4 left-4 right-4 bg-slate-900/95 border border-slate-800 text-white p-3 rounded-xl backdrop-blur-md flex items-center justify-between"
            >
              <div>
                <h4 className="text-xs font-bold font-display">
                  {hoveredLoc ? hoveredLoc.name : selectedLocation?.name}
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {hoveredLoc ? hoveredLoc.address : selectedLocation?.address}
                </p>
              </div>
              <div className="flex items-center space-x-2 text-[10px] bg-slate-800/80 px-2 py-1 rounded border border-slate-700 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse"></span>
                <span>{activeEventsCount[hoveredLoc ? hoveredLoc.name : selectedLocation!.name] || 0} active games</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Map legend and feedback text */}
      <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 flex justify-between items-center text-xs">
        <span className="text-slate-500 flex items-center">
          <Info className="w-4 h-4 text-slate-400 mr-2 flex-shrink-0" />
          Filter: {selectedLocation ? <strong className="text-orange-600 ml-1">{selectedLocation.name}</strong> : 'Showing all areas'}
        </span>
        {selectedLocation && (
          <button 
            onClick={() => onSelectLocation(null)}
            className="text-[10px] text-slate-400 hover:text-slate-600 font-bold underline"
          >
            Show All
          </button>
        )}
      </div>
    </div>
  );
}
