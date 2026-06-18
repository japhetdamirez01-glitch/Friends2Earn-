/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Search, Radio, User, Coins, Gem, Zap, Check, AlertCircle, Shield, Menu } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  user: UserProfile;
  adminBalance: number;
  onOpenActiveDrawer: () => void;
  onSearchChange: (query: string, category: string) => void;
  onLogout: () => void;
  onSelectTab: (tab: 'feed' | 'farm' | 'vip' | 'wallet') => void;
  activeTab: string;
}

export default function Header({
  user,
  adminBalance,
  onOpenActiveDrawer,
  onSearchChange,
  onLogout,
  onSelectTab,
  activeTab,
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'people' | 'videos' | 'photos'>('all');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isRateSafe, setIsRateSafe] = useState(true);
  const [cachePulse, setCachePulse] = useState(false);

  // Debouncing the database listeners for header parameter variables to prevent Base44Error
  useEffect(() => {
    const handler = setTimeout(() => {
      onSearchChange(searchQuery, selectedCategory);
      setCachePulse(true);
      const pulseTimeout = setTimeout(() => setCachePulse(false), 800);
      return () => clearTimeout(pulseTimeout);
    }, 400); // 400ms debounce buffer

    return () => clearTimeout(handler);
  }, [searchQuery, selectedCategory]);

  const triggerImmediateSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(searchQuery, selectedCategory);
    setShowSuggestions(false);
  };

  return (
    <header className="w-full bg-slate-900 border-b border-slate-800 sticky top-0 z-40 px-4 py-3 selection:bg-emerald-500/20">
      {/* Row 1: Identity, Wallets, Livestreams Tracker & Dynamic Status Pulse Metric */}
      <div className="flex items-center justify-between gap-2 md:gap-4 flex-wrap pb-2">
        {/* Left: Brand Identity & Admin Status Indicator */}
        <div className="flex items-center gap-2">
          <div 
            onClick={() => onSelectTab('feed')}
            className="cursor-pointer"
          >
            <h1 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-1">
              F<span className="text-emerald-400">2</span>E
              {user.isAdmin && (
                <span className="text-[10px] font-mono font-bold bg-blue-500/10 border border-blue-500/30 text-blue-400 px-1.5 py-0.5 rounded flex items-center gap-0.5">
                  <Shield className="w-2.5 h-2.5" />
                  Admin
                </span>
              )}
            </h1>
            <p className="text-[9px] text-slate-500 font-bold tracking-widest uppercase">Friends2Earn</p>
          </div>
        </div>

        {/* Center-Right: Core Points and Gems Multi-Currency Pill */}
        <div className="flex items-center gap-1.5">
          {/* Points Pill (₱25k = PH1) */}
          <div 
            onClick={() => onSelectTab('wallet')}
            className={`cursor-pointer flex items-center gap-1 bg-slate-950 px-2 py-1.5 rounded-xl border transition-all ${
              activeTab === 'wallet' ? 'border-emerald-500/50 bg-slate-900' : 'border-slate-800 hover:border-slate-700'
            }`}
            title="Points (25,000 Points = ₱1.00 PHP)"
          >
            <div className="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[10px] text-slate-950 font-bold font-mono">
              P
            </div>
            <div className="text-right">
              <p className="text-[11px] font-bold font-mono text-white leading-none">
                {user.pointsBalance.toLocaleString()}
              </p>
              <p className="text-[8px] text-amber-500 font-semibold font-mono leading-none mt-0.5">
                ₱{(user.pointsBalance / 25000).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Gems Pill (100 Gems = ₱1.00 PHP) */}
          <div 
            onClick={() => onSelectTab('wallet')}
            className={`cursor-pointer flex items-center gap-1 bg-slate-950 px-2 py-1.5 rounded-xl border transition-all ${
              activeTab === 'wallet' ? 'border-emerald-500/50 bg-slate-900' : 'border-slate-800 hover:border-slate-700'
            }`}
            title="Gems (100 Gems = ₱1.00 PHP)"
          >
            <Gem className="w-3.5 h-3.5 text-blue-400 fill-blue-500/20" />
            <div className="text-right">
              <p className="text-[11px] font-bold font-mono text-white leading-none">
                {user.gemsBalance.toLocaleString()}
              </p>
              <p className="text-[8px] text-blue-400 font-semibold font-mono leading-none mt-0.5">
                ₱{(user.gemsBalance / 100).toFixed(2)}
              </p>
            </div>
          </div>

          {/* VIP Pass Label if active */}
          {user.isVip && (
            <span className="text-[9px] font-extrabold tracking-wider bg-indigo-500 text-white uppercase px-1.5 py-1 rounded-md animate-pulse">
              VIP
            </span>
          )}
        </div>

        {/* Rightmost actions: Live Connection Metric Widget & Account Controls */}
        <div className="flex items-center gap-1.5">
          {/* Live Connection Metric Widget (Pulse active network indicator) */}
          <button
            onClick={onOpenActiveDrawer}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-950 hover:bg-slate-850 text-slate-300 border border-slate-800 hover:border-slate-700 rounded-xl transition-all"
            title="Open Active Friends Network"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse relative block">
              <span className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-75"></span>
            </span>
            <span className="text-xs font-bold font-mono text-emerald-400">1,240 Online</span>
          </button>

          {/* User Avatar & Logout Dropdown */}
          <button
            onClick={onLogout}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30 text-slate-300 flex items-center justify-center font-bold text-xs shadow-inner border border-slate-700 transition-all select-none"
            title="Logout of current profile"
          >
            {user.fullName[0].toUpperCase()}
          </button>
        </div>
      </div>

      {/* Row 2: 100% Full-Width Universal Discovery Search Bar with categories */}
      <div className="mt-2.5 pt-2 border-t border-slate-850 flex flex-col gap-2">
        <form onSubmit={triggerImmediateSearch} className="relative w-full">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="f2e-discovery-search"
            type="text"
            placeholder="Search People, #Friends2Earn hashtag, Videos, and Live Crops..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-24 py-2.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />

          {/* Quick Rate-limit safe Indicator */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[9px] text-slate-400 select-none">
            <span className={`w-1 h-1 rounded-full ${cachePulse ? 'bg-amber-400 scale-125' : 'bg-emerald-500'} transition-all`} />
            <span>{cachePulse ? 'Buffer sync' : 'Rate limit safe'}</span>
          </div>
        </form>

        {/* Discovery Multi-category suggestion tray (People, Photos, Videos, Contextual matches) */}
        {showSuggestions && searchQuery.length > 0 && (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-xl animate-fade-in text-xs space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-800/80">
              <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-500">
                Discovery Suggestion Category
              </span>
              <button
                type="button"
                onClick={() => setShowSuggestions(false)}
                className="text-[10px] text-emerald-400 hover:underline"
              >
                Hide Suggestions
              </button>
            </div>

            <div className="grid grid-cols-4 gap-1">
              {(['all', 'people', 'videos', 'photos'] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`py-1.5 px-2 rounded-lg text-center font-semibold capitalize text-xs transition-colors ${
                    selectedCategory === cat
                      ? 'bg-emerald-500 text-slate-950'
                      : 'bg-slate-950 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Simulated Live Results matching */}
            <div className="pt-1.5 space-y-1">
              <p className="text-[10px] text-slate-400 font-mono">
                Matching filter: "{searchQuery}" under <span className="text-emerald-400 uppercase">{selectedCategory}</span>
              </p>
              <div className="p-2 bg-slate-950/80 rounded border border-slate-850/50 flex items-center justify-between text-[11px] text-slate-300">
                <span>⚡ Yielding 5 simulated matching entities index</span>
                <span className="text-[9px] text-slate-500">Snapshot Debounced</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
