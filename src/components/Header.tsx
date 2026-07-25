/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Compass, Box, Users, Flame, MapPin, Settings, TrendingUp, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import ShareSocialModal from './ShareSocialModal';

interface HeaderProps {
  activeTab: 'explore' | 'gear' | 'catalysts' | 'console' | 'investor';
  setActiveTab: (tab: 'explore' | 'gear' | 'catalysts' | 'console' | 'investor') => void;
  userStats: {
    name: string;
    avatarUrl: string;
    points: number;
    streak: number;
    joinedTodayCount: number;
  };
  selectedCity: string;
  onSelectCity: (city: string) => void;
  availableCities: string[];
  onAddCustomCity: (city: string) => void;
}

export default function Header({ 
  activeTab, 
  setActiveTab, 
  userStats, 
  selectedCity, 
  onSelectCity, 
  availableCities, 
  onAddCustomCity 
}: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-sm" id="main-header">
      <ShareSocialModal 
        isOpen={isShareOpen} 
        onClose={() => setIsShareOpen(false)} 
        selectedCity={selectedCity} 
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo Section */}
          <div className="flex items-center space-x-3">
            <motion.div 
              whileHover={{ rotate: [0, -10, 15, 0], scale: 1.1, y: [0, -4, 0] }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-amber-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/20 relative overflow-hidden"
              id="app-logo"
            >
              <svg 
                viewBox="0 0 100 100" 
                className="w-7 h-7 filter drop-shadow-sm select-none" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Playful smiling sports ball design */}
                {/* Ball grooves/texture */}
                <path d="M15 50C35 40 65 40 85 50" stroke="rgba(255,255,255,0.3)" strokeWidth="6" strokeLinecap="round" />
                <path d="M20 75C40 65 60 65 80 75" stroke="rgba(255,255,255,0.2)" strokeWidth="4" strokeLinecap="round" />
                <path d="M20 25C40 35 60 35 80 25" stroke="rgba(255,255,255,0.2)" strokeWidth="4" strokeLinecap="round" />
                
                {/* Playful eyes */}
                <circle cx="35" cy="42" r="7" fill="white" />
                <circle cx="35" cy="40" r="3" fill="#0f172a" />
                <circle cx="65" cy="42" r="7" fill="white" />
                <circle cx="65" cy="40" r="3" fill="#0f172a" />
                
                {/* Happy wide smile */}
                <path 
                  d="M32 58C32 58 45 74 68 58" 
                  stroke="white" 
                  strokeWidth="8" 
                  strokeLinecap="round" 
                  fill="none" 
                />
                
                {/* Cute rosy cheeks */}
                <circle cx="24" cy="52" r="5" fill="#f43f5e" opacity="0.6" />
                <circle cx="76" cy="52" r="5" fill="#f43f5e" opacity="0.6" />
                
                {/* Little shine spot on the top right */}
                <circle cx="75" cy="22" r="4" fill="white" opacity="0.6" />
              </svg>
            </motion.div>
            <div className="text-left">
              <h1 className="font-display text-xl font-bold text-slate-900 tracking-tight leading-none">BuurtPlay</h1>
              
              {/* Dynamic City Selector Dropdown */}
              <div className="flex items-center space-x-1 mt-1 text-xs">
                <MapPin className="w-3.5 h-3.5 text-orange-500 flex-shrink-0" />
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '__add_custom__') {
                      const newCity = prompt('No cap, what city are you launching BuurtPlay in?');
                      if (newCity && newCity.trim()) {
                        onAddCustomCity(newCity.trim());
                      }
                    } else {
                      onSelectCity(val);
                    }
                  }}
                  className="bg-transparent font-semibold text-slate-700 hover:text-orange-600 focus:outline-none cursor-pointer border-none p-0 pr-4 text-xs h-auto w-auto focus:ring-0"
                  id="city-selector-dropdown"
                >
                  {availableCities.map(city => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                  <option value="__add_custom__" className="text-orange-600 font-bold bg-orange-50">
                    ➕ Add Custom City...
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex space-x-1" id="desktop-nav">
            <button
              onClick={() => setActiveTab('explore')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'explore'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              id="tab-btn-explore"
            >
              <Compass className="w-4 h-4" />
              <span>{t('navExplore')}</span>
            </button>
            <button
              onClick={() => setActiveTab('gear')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'gear'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              id="tab-btn-gear"
            >
              <Box className="w-4 h-4" />
              <span>{t('navGear')}</span>
            </button>
            <button
              onClick={() => setActiveTab('catalysts')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'catalysts'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              id="tab-btn-catalysts"
            >
              <Users className="w-4 h-4" />
              <span>{t('navCatalysts')}</span>
            </button>
            <button
              onClick={() => setActiveTab('console')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                activeTab === 'console'
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`}
              id="tab-btn-console"
            >
              <Settings className="w-4 h-4 animate-spin-slow" />
              <span>{t('navConsole')}</span>
            </button>
            <button
              onClick={() => setActiveTab('investor')}
              className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 border border-orange-200/50 ${
                activeTab === 'investor'
                  ? 'bg-gradient-to-r from-slate-900 to-orange-950 text-white shadow-sm border-transparent'
                  : 'text-orange-700 bg-orange-50/50 hover:bg-orange-50 hover:text-orange-950'
              }`}
              id="tab-btn-investor"
            >
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span className="font-bold">{t('navInvestor')}</span>
            </button>
          </nav>

          {/* User Profile & Gamification Stats */}
          <div className="flex items-center space-x-4" id="user-stats-panel">
            {/* Language Switcher & Share Kit */}
            <div className="flex items-center space-x-2 border-r border-slate-100 pr-3 mr-1">
              <button
                onClick={() => setIsShareOpen(true)}
                className="flex items-center space-x-1.5 px-2.5 h-8 rounded-lg text-xs font-bold bg-orange-500 text-white hover:bg-orange-600 transition-all duration-150 shadow-sm"
                title="Share BuurtPlay social media menu & messages"
                id="share-kit-header-btn"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Share Kit</span>
              </button>
              <button
                onClick={() => setLanguage(language === 'en' ? 'nl' : 'en')}
                className="flex items-center justify-center w-12 h-8 rounded-lg text-xs font-bold bg-slate-50 border border-slate-200 text-slate-700 hover:bg-slate-100 transition-all duration-150"
                title={language === 'en' ? "Wissel naar Nederlands" : "Switch to English"}
                id="language-toggle-btn"
              >
                <span>{language === 'en' ? '🇬🇧 EN' : '🇳🇱 NL'}</span>
              </button>
            </div>

            <div className="hidden lg:flex items-center space-x-3 text-right">
              <div>
                <p className="text-xs text-slate-400 font-medium font-mono">{t('streakLabel')}</p>
                <div className="flex items-center space-x-2 mt-0.5 justify-end">
                  <span className="flex items-center text-orange-600 font-semibold text-xs bg-orange-50 px-2 py-0.5 rounded-full border border-orange-100">
                    <Flame className="w-3.5 h-3.5 mr-0.5 fill-orange-500 text-orange-500" />
                    {t('streakCount', { streak: userStats.streak })}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full" title="Earn aura by joining events and sharing gear!">
                    {t('auraPoints', { points: userStats.points })}
                  </span>
                </div>
              </div>
            </div>

            {/* Avatar */}
            <div className="flex items-center space-x-2 border-l border-slate-100 pl-4">
              <img
                src={userStats.avatarUrl}
                alt={userStats.name}
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-full border-2 border-orange-500 object-cover"
                id="user-avatar"
              />
              <div className="hidden sm:block">
                <p className="text-xs font-bold text-slate-900">{userStats.name}</p>
                <p className="text-[10px] text-green-600 font-semibold flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 animate-pulse"></span>
                  {t('activeNow')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="md:hidden flex justify-around border-t border-slate-100 py-3" id="mobile-nav">
          <button
            onClick={() => setActiveTab('explore')}
            className={`flex flex-col items-center space-y-1 text-xs font-semibold ${
              activeTab === 'explore' ? 'text-orange-600' : 'text-slate-500'
            }`}
            id="mobile-tab-btn-explore"
          >
            <Compass className="w-5 h-5" />
            <span>{language === 'en' ? 'Explore' : 'Ontdek'}</span>
          </button>
          <button
            onClick={() => setActiveTab('gear')}
            className={`flex flex-col items-center space-y-1 text-xs font-semibold ${
              activeTab === 'gear' ? 'text-orange-600' : 'text-slate-500'
            }`}
            id="mobile-tab-btn-gear"
          >
            <Box className="w-5 h-5" />
            <span>{language === 'en' ? 'Gear' : 'Spullen'}</span>
          </button>
          <button
            onClick={() => setActiveTab('catalysts')}
            className={`flex flex-col items-center space-y-1 text-xs font-semibold ${
              activeTab === 'catalysts' ? 'text-orange-600' : 'text-slate-500'
            }`}
            id="mobile-tab-btn-catalysts"
          >
            <Users className="w-5 h-5" />
            <span>Catalysts</span>
          </button>
          <button
            onClick={() => setActiveTab('console')}
            className={`flex flex-col items-center space-y-1 text-xs font-semibold ${
              activeTab === 'console' ? 'text-orange-600' : 'text-slate-500'
            }`}
            id="mobile-tab-btn-console"
          >
            <Settings className="w-5 h-5" />
            <span>Console</span>
          </button>
          <button
            onClick={() => setActiveTab('investor')}
            className={`flex flex-col items-center space-y-1 text-xs font-semibold ${
              activeTab === 'investor' ? 'text-orange-600 font-bold' : 'text-slate-500'
            }`}
            id="mobile-tab-btn-investor"
          >
            <TrendingUp className="w-5 h-5 text-orange-500" />
            <span>Pitch</span>
          </button>
        </div>

      </div>
    </header>
  );
}
