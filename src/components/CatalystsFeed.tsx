/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Catalyst, LocationInfo, SportEvent } from '../types';
import { 
  Users, 
  Sparkles, 
  Award, 
  ArrowRight, 
  QrCode, 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Download, 
  CheckCircle, 
  RotateCw, 
  Info, 
  MapPin, 
  CheckCircle2, 
  FileText, 
  Zap, 
  ChevronRight,
  Sparkle,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CatalystsFeedProps {
  catalysts: Catalyst[];
  locations: LocationInfo[];
  events: SportEvent[];
  selectedCity: string;
  onSelectCatalyst: (catalystName: string) => void;
  onAddLocation?: (location: LocationInfo) => Promise<void>;
}

export default function CatalystsFeed({ 
  catalysts, 
  locations, 
  events, 
  selectedCity, 
  onSelectCatalyst,
  onAddLocation
}: CatalystsFeedProps) {
  // Tabs: 'stars' (Verified street champions) or 'gemeente' (Municipal Funding & QR node claims)
  const [activeSubTab, setActiveSubTab] = useState<'stars' | 'gemeente'>('stars');

  // Municipal Portal States
  const [selectedLocation, setSelectedLocation] = useState<LocationInfo | null>(null);
  const [selectedCatalyst, setSelectedCatalyst] = useState<Catalyst | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [isScanSuccess, setIsScanSuccess] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  // Register New Playground State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCourtName, setNewCourtName] = useState('');
  const [newCourtArea, setNewCourtArea] = useState('');
  const [newCourtAddress, setNewCourtAddress] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  // Set default selection on load
  useEffect(() => {
    if (locations.length > 0 && !selectedLocation) {
      setSelectedLocation(locations[0]);
    }
    if (catalysts.length > 0 && !selectedCatalyst) {
      setSelectedCatalyst(catalysts[0]);
    }
  }, [locations, catalysts]);

  // Set random verification code when location changes
  useEffect(() => {
    if (selectedLocation) {
      const randHash = Math.random().toString(36).substring(2, 8).toUpperCase();
      const code = `BP-${selectedCity.substring(0, 3).toUpperCase()}-${randHash}`;
      setVerificationCode(code);
      setIsScanSuccess(false);
      setScanProgress(0);
    }
  }, [selectedLocation, selectedCity]);

  // Handle simulated inspector scan
  const handleSimulateScan = () => {
    if (isScanning) return;
    setIsScanning(true);
    setScanProgress(0);
    setIsScanSuccess(false);

    const interval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsScanning(false);
            setIsScanSuccess(true);
          }, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 80);
  };

  // Compute stats for selected location
  const locationEvents = events.filter(
    (e) => e.location.name.toLowerCase() === (selectedLocation?.name || '').toLowerCase()
  );
  
  const uniquePlayers = Array.from(
    new Set(locationEvents.flatMap((e) => e.joinedPlayers.map((p) => p.id)))
  ).length;

  const totalSessions = locationEvents.length;

  // Subsidy calculations: Base funding of 150 + 50 per scheduled session + 10 per RSVP player
  const baseFunding = 150;
  const sessionBonus = totalSessions * 50;
  const participantBonus = uniquePlayers * 10;
  const calculatedBudget = baseFunding + sessionBonus + participantBonus;

  // Dynamic QR Code Generator (17x17 pixel grid based on location name string hashing)
  const generateQrGrid = (input: string) => {
    const size = 17;
    const grid = Array(size).fill(0).map(() => Array(size).fill(false));
    
    // Top-Left corner finder pattern
    for (let r = 0; r < 5; r++) {
      for (let c = 0; c < 5; c++) {
        if (r === 0 || r === 4 || c === 0 || c === 4 || (r === 2 && c === 2)) {
          grid[r][c] = true;
        }
      }
    }
    // Top-Right corner finder pattern
    for (let r = 0; r < 5; r++) {
      for (let c = size - 5; c < size; c++) {
        const cc = c - (size - 5);
        if (r === 0 || r === 4 || cc === 0 || cc === 4 || (r === 2 && cc === 2)) {
          grid[r][c] = true;
        }
      }
    }
    // Bottom-Left corner finder pattern
    for (let r = size - 5; r < size; r++) {
      const rr = r - (size - 5);
      for (let c = 0; c < 5; c++) {
        if (rr === 0 || rr === 4 || c === 0 || c === 4 || (rr === 2 && c === 2)) {
          grid[r][c] = true;
        }
      }
    }

    // Populate remaining pixels with deterministic noise based on location string hash
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0;
    }

    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        // Skip corner finder zones (plus safe quiet borders around them)
        if (r < 6 && c < 6) continue;
        if (r < 6 && c > size - 7) continue;
        if (r > size - 7 && c < 6) continue;
        
        // Skip center logo zone
        if (r >= 7 && r <= 9 && c >= 7 && c <= 9) continue;
        
        const seed = Math.sin(hash + r * 17 + c * 29) * 10000;
        grid[r][c] = (seed - Math.floor(seed)) > 0.45;
      }
    }
    
    return grid;
  };

  const qrGrid = generateQrGrid(selectedLocation?.name || 'Amsterdam Court');

  return (
    <div className="space-y-6 text-left" id="catalysts-root">
      {/* Intro section */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 relative overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-slate-800/25 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] uppercase tracking-wider bg-orange-500/20 text-orange-400 font-bold border border-orange-500/30">
                <Award className="w-3.5 h-3.5" />
                <span>Verified street organizers & city ambassadors</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-display font-extrabold tracking-tight mt-2">
                Aura Catalysts & Municipal Program
              </h2>
              <p className="text-slate-300 text-xs md:text-sm max-w-2xl mt-1">
                Explore verified Amsterdam play directors keeping neighborhood dynamics immaculate, or see how we report court utilization and crowd density directly to <strong className="text-white">De Gemeente</strong>.
              </p>
            </div>
            
            {/* Horizontal sub-tabs selector */}
            <div className="bg-slate-800 p-1 rounded-xl flex border border-slate-700">
              <button
                onClick={() => setActiveSubTab('stars')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activeSubTab === 'stars'
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Street Catalysts
              </button>
              <button
                onClick={() => setActiveSubTab('gemeente')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1 ${
                  activeSubTab === 'gemeente'
                    ? 'bg-orange-500 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Gemeente Activity Portal</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* SUB-TAB 1: VERIFIED STREET STARS */}
        {activeSubTab === 'stars' && (
          <motion.div
            key="street-stars-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {catalysts.map((catalyst) => (
              <motion.div
                key={catalyst.id}
                whileHover={{ y: -3 }}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col h-full text-left"
                id={`catalyst-card-${catalyst.id}`}
              >
                {/* Header row */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative">
                    <img 
                      src={catalyst.avatarUrl} 
                      alt={catalyst.name} 
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-full border-2 border-orange-500 object-cover" 
                    />
                    <span className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full p-0.5">
                      <Sparkles className="w-3 h-3 fill-white" />
                    </span>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-base text-slate-900 leading-tight">
                      {catalyst.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {catalyst.role}
                    </p>
                  </div>
                </div>

                {/* Reach stats */}
                <div className="flex items-center space-x-3 bg-slate-50 border border-slate-100 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 mb-4">
                  <span className="font-bold text-orange-600 bg-orange-50 border border-orange-100 px-1.5 py-0.5 rounded">
                    AURA STAR 🌟
                  </span>
                  <span>•</span>
                  <span className="flex items-center font-medium">
                    <Users className="w-3.5 h-3.5 text-slate-400 mr-1" />
                    {catalyst.reach} Squad
                  </span>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-600 leading-relaxed mb-5 flex-1">
                  {catalyst.bio}
                </p>

                {/* Core topics / badges */}
                <div className="space-y-3 pt-4 border-t border-slate-50">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Expertise Topics</p>
                  <div className="flex flex-wrap gap-1.5">
                    {catalyst.topics.map((topic, i) => (
                      <span 
                        key={i} 
                        className="text-[10px] font-semibold bg-slate-50 border border-slate-200 text-slate-700 px-2 py-0.5 rounded"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => onSelectCatalyst(catalyst.name)}
                    className="w-full mt-3 flex items-center justify-between text-xs font-bold text-orange-600 bg-orange-50/50 hover:bg-orange-50 border border-orange-100 py-2.5 px-4 rounded-xl transition"
                  >
                    <span>Filter their side quests ({catalyst.eventsHosted} sessions)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* SUB-TAB 2: GEMEENTE GRANT PORTAL & QR SYSTEM */}
        {activeSubTab === 'gemeente' && (
          <motion.div
            key="gemeente-portal-panel"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start"
          >
            {/* Left side: Guide & Funding Calculator (2 cols) */}
            <div className="lg:col-span-2 space-y-6">
              {/* How it works educational card */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center space-x-2 pb-2 border-b border-slate-100">
                  <Building2 className="w-5 h-5 text-orange-500" />
                  <h3 className="font-display font-bold text-slate-900 text-base">
                    Court Occupancy & Activity Reporting (Gemeente Monitor)
                  </h3>
                </div>
                
                <p className="text-xs text-slate-600 leading-relaxed">
                  Municipalities ("De Gemeente") actively track sports court utilization to allocate maintenance, gear, and budget support. By scanning the verified court QR codes or checking in, players and sports directors register crowd density metrics in real-time, keeping the city informed of how active and popular the spot is.
                </p>

                {/* Steps workflow visual */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-1">
                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-extrabold font-mono">1</div>
                    <p className="text-xs font-bold text-slate-800">Start Session / Game</p>
                    <p className="text-[10px] text-slate-500">Play sports and gather local athletes at the playground.</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-1">
                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-extrabold font-mono">2</div>
                    <p className="text-xs font-bold text-slate-800">Report Crowd Density</p>
                    <p className="text-[10px] text-slate-500">Scan court QR code to report active participation and court load.</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl space-y-1">
                    <div className="w-6 h-6 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-extrabold font-mono">3</div>
                    <p className="text-xs font-bold text-slate-800">Support & Resource</p>
                    <p className="text-[10px] text-slate-500">De Gemeente gets notified of high activity and prioritizes maintenance.</p>
                  </div>
                </div>
              </div>

              {/* Dynamic Subsidy Estimator */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-5">
                <h3 className="font-display font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                  <TrendingUp className="w-4.5 h-4.5 text-orange-500" />
                  <span>Interactive Grant Calculator</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Select Court Location */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Select Sports Court / Node
                    </label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      value={selectedLocation ? selectedLocation.name : ''}
                      onChange={(e) => {
                        const found = locations.find(loc => loc.name === e.target.value);
                        if (found) setSelectedLocation(found);
                      }}
                    >
                      {locations.map((loc, index) => (
                        <option key={index} value={loc.name}>
                          📍 {loc.name} ({loc.area})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Select Claiming Catalyst */}
                  <div className="space-y-1.5 text-left">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      Lead Catalyst claiming
                    </label>
                    <select
                      className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl p-3 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                      value={selectedCatalyst ? selectedCatalyst.name : ''}
                      onChange={(e) => {
                        const found = catalysts.find(c => c.name === e.target.value);
                        if (found) setSelectedCatalyst(found);
                      }}
                    >
                      {catalysts.map((c) => (
                        <option key={c.id} value={c.name}>
                          👑 {c.name} ({c.role.split(' ')[0]})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Selected Node Status Grid */}
                {selectedLocation && (
                  <div className="p-4 bg-orange-50/40 rounded-2xl border border-orange-100/50 grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div className="text-left space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Weekly Run Sessions</span>
                      <p className="text-base font-mono font-extrabold text-slate-800">
                        {totalSessions} <span className="text-xs text-orange-600 font-bold font-sans">scheduled</span>
                      </p>
                    </div>
                    
                    <div className="text-left space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Verified Attendees</span>
                      <p className="text-base font-mono font-extrabold text-slate-800">
                        {uniquePlayers} <span className="text-xs text-orange-600 font-bold font-sans">players</span>
                      </p>
                    </div>

                    <div className="text-left space-y-0.5 col-span-2 sm:col-span-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Activity Status</span>
                      <div>
                        {totalSessions > 0 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                            High Occupancy 🔥
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                            Needs Activity Log
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Subsidie calculation breakdown */}
                <div className="border-t border-slate-100 pt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-500">
                    <span>Base Court Utilization Value</span>
                    <span className="font-mono font-medium">€{baseFunding}.00 base</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Play Session Density Multiplier (€50 × {totalSessions} events)</span>
                    <span className="font-mono font-medium">+ €{sessionBonus}.00 bonus</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Local Player Attendance Index (€10 × {uniquePlayers} checked-in)</span>
                    <span className="font-mono font-medium">+ €{participantBonus}.00 index</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-dashed border-slate-150">
                    <span className="flex items-center">
                      Estimated Monthly Community Resource Weight 📊
                    </span>
                    <span className="font-mono text-orange-600">€{calculatedBudget}.00 weight</span>
                  </div>
                </div>
              </div>

              {/* Register New Playground Section */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-orange-500" />
                    <div className="text-left">
                      <h3 className="font-display font-bold text-slate-900 text-sm">
                        Register New Community Court or Playground
                      </h3>
                      <p className="text-[10px] text-slate-500">
                        Map a new sports venue within {selectedCity} for catalysts and local players
                      </p>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => {
                      setShowAddForm(!showAddForm);
                      setSubmitSuccess(false);
                      setSubmitError('');
                    }}
                    id="btn-toggle-add-court-form"
                    className="text-xs font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100/80 px-3 py-1.5 rounded-xl transition-all border border-orange-100 whitespace-nowrap"
                  >
                    {showAddForm ? 'Close Form' : 'Register Court'}
                  </button>
                </div>

                {showAddForm && (
                  <form 
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!newCourtName.trim()) {
                        setSubmitError('Please enter a valid playground or court name.');
                        return;
                      }
                      if (!newCourtArea.trim()) {
                        setSubmitError('Please specify the neighborhood or area (e.g. Centrum, Oud-West).');
                        return;
                      }
                      if (!newCourtAddress.trim()) {
                        setSubmitError('Please provide the physical address.');
                        return;
                      }

                      setIsSubmitting(true);
                      setSubmitError('');
                      
                      try {
                        // Calculate coordinates with small random offsets relative to base
                        let baseLat = 52.3676;
                        let baseLng = 4.9041;
                        if (locations.length > 0) {
                          const lats = locations.map(l => l.lat);
                          const lngs = locations.map(l => l.lng);
                          baseLat = lats.reduce((sum, val) => sum + val, 0) / lats.length;
                          baseLng = lngs.reduce((sum, val) => sum + val, 0) / lngs.length;
                        }

                        const jitterLat = (Math.random() - 0.5) * 0.015;
                        const jitterLng = (Math.random() - 0.5) * 0.015;

                        const newLoc: LocationInfo = {
                          name: newCourtName.trim(),
                          area: newCourtArea.trim(),
                          address: newCourtAddress.trim(),
                          city: selectedCity,
                          lat: Number((baseLat + jitterLat).toFixed(4)),
                          lng: Number((baseLng + jitterLng).toFixed(4))
                        };

                        if (onAddLocation) {
                          await onAddLocation(newLoc);
                        }
                        
                        setSubmitSuccess(true);
                        setNewCourtName('');
                        setNewCourtArea('');
                        setNewCourtAddress('');
                      } catch (err: any) {
                        setSubmitError('Failed to register court. Please check connection and try again.');
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                    className="space-y-4 pt-3 border-t border-slate-50 text-left"
                    id="register-court-form"
                  >
                    {submitSuccess && (
                      <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 flex items-start space-x-2 animate-fade-in">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold">Playground Successfully Registered! 🎉</p>
                          <p className="text-[10px] text-emerald-700 mt-0.5">
                            The new court has been mapped in {selectedCity} and is instantly active on the Interactive Map!
                          </p>
                        </div>
                      </div>
                    )}

                    {submitError && (
                      <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl text-xs text-rose-800 font-medium">
                        ⚠️ {submitError}
                      </div>
                    )}

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name input */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">
                          Court / Playground Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={newCourtName}
                          onChange={(e) => setNewCourtName(e.target.value)}
                          placeholder="e.g. Sarphatipark East Hoop"
                          className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-orange-500/50 rounded-xl p-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                        />
                      </div>

                      {/* Area/Neighborhood */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">
                          Neighborhood / Area *
                        </label>
                        <input
                          type="text"
                          required
                          value={newCourtArea}
                          onChange={(e) => setNewCourtArea(e.target.value)}
                          placeholder="e.g. Oud-Zuid, Kreuzberg, Soho"
                          className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-orange-500/50 rounded-xl p-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                        />
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase">
                        Physical Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={newCourtAddress}
                        onChange={(e) => setNewCourtAddress(e.target.value)}
                        placeholder="e.g. Sarphatipark, 1073 CZ Amsterdam"
                        className="w-full bg-slate-50 hover:bg-slate-50/80 focus:bg-white border border-slate-200 focus:border-orange-500/50 rounded-xl p-2.5 text-xs font-medium text-slate-700 focus:outline-none focus:ring-4 focus:ring-orange-500/5 transition-all"
                      />
                    </div>

                    <div className="pt-2 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-50/50 border border-slate-100 p-3 rounded-xl gap-2">
                      <span className="text-[10px] text-slate-400 font-medium">
                        * Mapped inside city <strong className="text-slate-600 font-bold">{selectedCity}</strong>. Coordinates will be safely randomized around the activity center.
                      </span>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        id="btn-submit-playground"
                        className="w-full sm:w-auto inline-flex items-center justify-center space-x-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow transition disabled:opacity-50 whitespace-nowrap"
                      >
                        {isSubmitting ? (
                          <>
                            <RotateCw className="w-3.5 h-3.5 animate-spin" />
                            <span>Registering...</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Playground</span>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right side: Dynamic QR Code Sign & Simulated Scanner (1 col) */}
            <div className="lg:col-span-1 space-y-6">
              {/* QR Node Sign Container */}
              <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col items-center text-center relative overflow-hidden">
                <span className="absolute top-2 right-2 bg-slate-900 text-[8px] font-mono font-bold text-white px-2 py-0.5 rounded uppercase tracking-wider border border-slate-800">
                  GEMEENTE VERIFIED
                </span>
                
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-2">
                  <QrCode className="w-6 h-6" />
                </div>
                
                <h4 className="font-display font-extrabold text-slate-900 text-sm">
                  Official Verification Node
                </h4>
                <p className="text-[10px] text-slate-500 uppercase font-mono mt-0.5">
                  ID: {verificationCode}
                </p>

                {/* Interactive Dynamic QR SVG Frame */}
                <div className="my-6 relative p-4 bg-slate-50 rounded-2xl border border-slate-150 shadow-inner group">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-40 h-40 select-none filter transition group-hover:scale-102"
                  >
                    {/* Quiet zone boundary */}
                    <rect x="0" y="0" width="100" height="100" fill="transparent" />
                    
                    {/* Render the hashed QR grid */}
                    {qrGrid.map((row, r) => 
                      row.map((active, c) => {
                        if (!active) return null;
                        const pixelSize = 100 / 17;
                        return (
                          <rect
                            key={`qr-${r}-${c}`}
                            x={c * pixelSize}
                            y={r * pixelSize}
                            width={pixelSize + 0.1} // overlap slightly to prevent hairline white gaps
                            height={pixelSize + 0.1}
                            fill="#0f172a"
                            rx={0.6} // beautiful rounded QR blocks (premium style)
                          />
                        );
                      })
                    )}

                    {/* Central brand mark logo */}
                    <rect x="38" y="38" width="24" height="24" fill="white" rx="4" />
                    <circle cx="50" cy="50" r="8" fill="#f97316" />
                    <circle cx="48" cy="48" r="1.5" fill="white" />
                    <path 
                      d="M45 53 C45 53 48 57 55 53" 
                      stroke="white" 
                      strokeWidth="1.2" 
                      strokeLinecap="round" 
                      fill="none" 
                    />
                  </svg>

                  {/* Simulated Scanner Laser line overlay */}
                  {isScanning && (
                    <motion.div
                      initial={{ top: '0%' }}
                      animate={{ top: '100%' }}
                      transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 right-0 h-1.5 bg-orange-500 shadow-lg shadow-orange-500/50 pointer-events-none"
                    />
                  )}
                </div>

                <div className="space-y-1.5 w-full text-left">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Court Location:</span>
                    <strong className="text-slate-800 truncate max-w-[140px]" title={selectedLocation?.name}>
                      {selectedLocation ? selectedLocation.name : 'Unknown'}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Claiming Ambassador:</span>
                    <strong className="text-slate-800">{selectedCatalyst ? selectedCatalyst.name : 'Jinan Vyent'}</strong>
                  </div>
                </div>

                {/* Audit trigger button */}
                <div className="w-full mt-4 pt-4 border-t border-slate-100 space-y-3">
                  <button
                    onClick={handleSimulateScan}
                    disabled={isScanning}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    {isScanning ? (
                      <>
                        <RotateCw className="w-4 h-4 animate-spin text-orange-400" />
                        <span>Simulating Crowd Scan ({scanProgress}%)</span>
                      </>
                    ) : (
                      <>
                        <Building2 className="w-4 h-4 text-orange-400" />
                        <span>Simulate Crowd Check-in</span>
                      </>
                    )}
                  </button>

                  <p className="text-[9px] text-slate-400 leading-relaxed text-center">
                    Players and neighborhood ambassadors scan this QR sign to register their presence, updating De Gemeente on the active crowd density of the playground.
                  </p>
                </div>
              </div>

              {/* Scan feedback notification overlay/panel */}
              <AnimatePresence>
                {isScanSuccess && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15 }}
                    className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-left space-y-2 shadow-sm"
                  >
                    <div className="flex items-start space-x-2.5">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100 mt-0.5 flex-shrink-0" />
                      <div className="space-y-0.5">
                        <h5 className="text-xs font-bold text-slate-900">
                          Activity Density Reported! 📈
                        </h5>
                        <p className="text-[11px] text-slate-600 leading-relaxed">
                          The playground check-in code <strong>{verificationCode}</strong> at <strong>{selectedLocation?.name}</strong> has been registered. The city's occupancy indexes are now updated.
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-emerald-600/10 rounded-xl p-2 px-3 text-emerald-800 text-[10px] font-mono font-bold flex justify-between items-center">
                      <span>MUNICIPAL REPORT STATUS:</span>
                      <span className="text-emerald-700">HIGH ACTIVITY LOGGED & FILED</span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
