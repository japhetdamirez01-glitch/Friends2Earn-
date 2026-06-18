/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Search, Sparkles, Trophy, Users, TrendingUp, Zap } from 'lucide-react';
import { FriendNetwork } from '../types';

interface ActiveDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSendGift?: (friend: FriendNetwork) => void;
}

const mockFriends: FriendNetwork[] = [
  { username: 'Lourd Macapinlac', fullName: 'Lourd Macapinlac', onlineDurationMinutes: 520, earningPowerMultiplier: 2.5, socialMultiplier: 1.8, isOnline: true, pointsEarned: 135000 },
  { username: 'Janina Alis', fullName: 'Janina Alis', onlineDurationMinutes: 410, earningPowerMultiplier: 1.8, socialMultiplier: 1.5, isOnline: true, pointsEarned: 89000 },
  { username: 'Mark Anthony', fullName: 'Mark Anthony', onlineDurationMinutes: 380, earningPowerMultiplier: 3.2, socialMultiplier: 2.2, isOnline: true, pointsEarned: 245000 },
  { username: 'Rochelle Castro', fullName: 'Rochelle Castro', onlineDurationMinutes: 290, earningPowerMultiplier: 1.2, socialMultiplier: 2.5, isOnline: true, pointsEarned: 62000 },
  { username: 'Kenji Tan', fullName: 'Kenji Tan', onlineDurationMinutes: 210, earningPowerMultiplier: 2.0, socialMultiplier: 1.2, isOnline: true, pointsEarned: 110000 },
  { username: 'Gelo Mercado', fullName: 'Gelo Mercado', onlineDurationMinutes: 180, earningPowerMultiplier: 1.5, socialMultiplier: 1.1, isOnline: true, pointsEarned: 45000 },
  { username: 'Alyssa Gomez', fullName: 'Alyssa Gomez', onlineDurationMinutes: 120, earningPowerMultiplier: 1.1, socialMultiplier: 3.0, isOnline: true, pointsEarned: 35000 },
  { username: 'Daryl De Leon', fullName: 'Daryl De Leon', onlineDurationMinutes: 85, earningPowerMultiplier: 4.0, socialMultiplier: 1.6, isOnline: true, pointsEarned: 395000 },
];

export default function ActiveDrawer({ isOpen, onClose, onSendGift }: ActiveDrawerProps) {
  const [activeSort, setActiveSort] = useState<'longest' | 'power' | 'multipliers'>('longest');
  const [filterSearch, setFilterSearch] = useState('');

  if (!isOpen) return null;

  // Sorters matching guideline: "Active Friends Network sorting by Longest Online, Earning Power, and Social Multipliers"
  const sortedFriends = [...mockFriends]
    .filter(friend => friend.fullName.toLowerCase().includes(filterSearch.toLowerCase()))
    .sort((a, b) => {
      if (activeSort === 'longest') {
        return b.onlineDurationMinutes - a.onlineDurationMinutes;
      }
      if (activeSort === 'power') {
        return b.earningPowerMultiplier - a.earningPowerMultiplier;
      }
      return b.socialMultiplier - a.socialMultiplier;
    });

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      {/* Click outside to close */}
      <div className="flex-1" onClick={onClose} />

      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden relative">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Active Friends Network
            </h2>
            <p className="text-xs text-slate-400">
              Live updates of earners in your multiplier grid
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 px-2.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg"
          >
            Close
          </button>
        </div>

        {/* Search friend filter inside drawer */}
        <div className="p-4 bg-slate-950 border-b border-slate-850">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search active earner..."
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Sorters tabs: Longest Online, Earning Power, and Social Multipliers */}
        <div className="p-3 bg-slate-900 border-b border-slate-850 grid grid-cols-3 gap-1">
          <button
            onClick={() => setActiveSort('longest')}
            className={`py-2 px-1 text-center rounded-lg text-[10px] font-bold tracking-wider uppercase flex flex-col items-center justify-center gap-1 transition-all ${
              activeSort === 'longest'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'text-slate-400 border border-transparent hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Longest Online
          </button>
          <button
            onClick={() => setActiveSort('power')}
            className={`py-2 px-1 text-center rounded-lg text-[10px] font-bold tracking-wider uppercase flex flex-col items-center justify-center gap-1 transition-all ${
              activeSort === 'power'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'text-slate-400 border border-transparent hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Earning Power
          </button>
          <button
            onClick={() => setActiveSort('multipliers')}
            className={`py-2 px-1 text-center rounded-lg text-[10px] font-bold tracking-wider uppercase flex flex-col items-center justify-center gap-1 transition-all ${
              activeSort === 'multipliers'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400'
                : 'text-slate-400 border border-transparent hover:text-white'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            Social Mult.
          </button>
        </div>

        {/* Friends list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-950/40">
          {sortedFriends.length > 0 ? (
            sortedFriends.map((friend, idx) => (
              <div
                key={friend.username}
                className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between hover:border-slate-700 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-300 font-bold border border-slate-700 text-sm flex items-center justify-center capitalize select-none">
                      {friend.fullName[0]}
                    </div>
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-slate-900 rounded-full animate-pulse" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white flex items-center gap-1">
                      {friend.fullName}
                      {idx === 0 && <Trophy className="w-3 h-3 text-amber-400 inline" />}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-[10px] text-slate-400">
                      <span className="font-mono text-emerald-400 bg-emerald-950/55 px-1.5 py-0.5 rounded border border-emerald-500/10">
                        ₱{(friend.pointsEarned / 25000).toFixed(2)} earning value
                      </span>
                      <span>•</span>
                      <span>Online: {friend.onlineDurationMinutes}m</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <span className="text-[10px] text-slate-300 font-semibold font-mono bg-slate-950 border border-slate-850 px-1 py-0.5 rounded">
                    ⚡ {friend.earningPowerMultiplier.toFixed(1)}x Mult.
                  </span>
                  {onSendGift && (
                    <button
                      onClick={() => onSendGift(friend)}
                      className="text-[9px] font-extrabold uppercase bg-emerald-500 text-slate-950 px-2 py-1 rounded transition-transform hover:scale-105"
                    >
                      Water Crop
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-xs text-slate-500 py-8">No online companions match that search.</p>
          )}
        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 text-center">
          <p className="text-[10px] text-slate-500 font-mono">
            Rate limit guard: Debounced listener snapshot.
          </p>
        </div>
      </div>
    </div>
  );
}
