/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Droplet, Sparkles, Sprout, ShieldAlert, Zap, Clock, User, Award, HelpCircle, Gamepad2, Info } from 'lucide-react';
import { FarmState, Transaction } from '../types';

interface FarmGameProps {
  farm: FarmState;
  pointsBalance: number;
  gemsBalance: number;
  isVip: boolean;
  onUpdateFarm: (updater: (prev: FarmState) => FarmState) => void;
  onRecordTransaction: (points: number, gems: number, desc: string, type: Transaction['type'], php?: number) => void;
  onDeductPoints: (amount: number) => boolean;
}

export default function FarmGame({
  farm,
  pointsBalance,
  gemsBalance,
  isVip,
  onUpdateFarm,
  onRecordTransaction,
  onDeductPoints,
}: FarmGameProps) {
  const [careTimer, setCareTimer] = useState<number>(0); // countdown in seconds for watering/fertilize throttling
  const [feedback, setFeedback] = useState<string>('');
  const [chickenEggCountdown, setChickenEggCountdown] = useState<number>(0);
  const [simulatedCycleHoursLeft, setSimulatedCycleHoursLeft] = useState<number>(12); // start default 12-Hour Production Cycle
  const [peerWateredToday, setPeerWateredToday] = useState<boolean>(false);

  // Core 12-hour simulation cycle tick
  useEffect(() => {
    const timer = setInterval(() => {
      setSimulatedCycleHoursLeft((prev) => {
        if (prev <= 0.1) {
          return 12; // Auto restart cycle after harvest
        }
        return Math.max(0, prev - 0.2); // Count down slowly
      });
    }, 10000); // represents time lapse

    return () => clearInterval(timer);
  }, []);

  // Chicken egg countdown simulation
  useEffect(() => {
    let eggTimer: NodeJS.Timeout;
    if (farm.hasChicken && farm.chickenLastFed && chickenEggCountdown > 0) {
      eggTimer = setInterval(() => {
        setChickenEggCountdown((prev) => Math.max(0, prev - 1));
      }, 1000);
    }
    return () => clearInterval(eggTimer);
  }, [farm.hasChicken, farm.chickenLastFed, chickenEggCountdown]);

  // Accelerates Crop Production duration whenever care action processes
  const accelerateTimer = (hours: number) => {
    setSimulatedCycleHoursLeft((prev) => Math.max(0, prev - hours));
  };

  const handleWater = () => {
    if (careTimer > 0) {
      setFeedback('Tree is already hydrated! Wait for soil to dry.');
      return;
    }

    onUpdateFarm((prev) => {
      const nextExp = prev.treeExp + 15;
      const leveledUp = nextExp >= prev.treeLevel * 100;
      return {
        ...prev,
        treeExp: leveledUp ? nextExp - prev.treeLevel * 100 : nextExp,
        treeLevel: leveledUp ? prev.treeLevel + 1 : prev.treeLevel,
        activeCareActionsCount: prev.activeCareActionsCount + 1,
      };
    });

    accelerateTimer(1.5); // caring reduces the default timer
    onRecordTransaction(250, 0, 'Watered Golden F2E Crop Tree (+15 EXP)', 'farm_harvest', 0);
    setCareTimer(10); // 10 seconds simulation lock
    setFeedback('Tree watered successfully! Crop countdown decreased by 1.5 Hours. Received +250 Points!');
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleFertilize = () => {
    // Requires a small cost of 500 points to buy fertilizer
    if (pointsBalance < 500) {
      setFeedback('Insufficient points balance! Fertilizer costs 500 Points.');
      return;
    }

    const deducted = onDeductPoints(500);
    if (!deducted) return;

    onUpdateFarm((prev) => {
      const nextExp = prev.treeExp + 45;
      const leveledUp = nextExp >= prev.treeLevel * 100;
      return {
        ...prev,
        treeExp: leveledUp ? nextExp - prev.treeLevel * 100 : nextExp,
        treeLevel: leveledUp ? prev.treeLevel + 1 : prev.treeLevel,
        activeCareActionsCount: prev.activeCareActionsCount + 2,
      };
    });

    accelerateTimer(3.5); // caring reduces the default timer
    onRecordTransaction(-500, 0, 'Purchased Organic Fertilizer for Crop Tree (-500 Points)', 'farm_harvest', 0);
    setFeedback('Fertilizer applied! Tree is thriving! Exp +45, production timer reduced by 3.5 Hours.');
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleWatchAdSpeedup = () => {
    // Watches incentivized video ad to boost tree development
    setFeedback('Loading incentivized ad player...');
    setTimeout(() => {
      onUpdateFarm((prev) => {
        const nextExp = prev.treeExp + 60;
        const leveledUp = nextExp >= prev.treeLevel * 100;
        return {
          ...prev,
          treeExp: leveledUp ? nextExp - prev.treeLevel * 100 : nextExp,
          treeLevel: leveledUp ? prev.treeLevel + 1 : prev.treeLevel,
        };
      });
      accelerateTimer(4.5);
      onRecordTransaction(1200, 0, 'Watched Ads speedup payload (+1,200 Points, +60 EXP)', 'farm_harvest', 0);
      setFeedback('Ad watched! Double care reward activated. Tree timer accelerated by 4.5 Hours!');
      setTimeout(() => setFeedback(''), 4500);
    }, 1500);
  };

  const handleHarvestFruit = () => {
    if (simulatedCycleHoursLeft > 0) {
      setFeedback(`Golden F2E fruit is not mature yet! Keep caring to lower the remaining ${simulatedCycleHoursLeft.toFixed(1)} hours.`);
      return;
    }

    const rewardPoints = farm.treeLevel * 12000;
    const rewardGems = farm.treeLevel * 25;

    onUpdateFarm((prev) => ({
      ...prev,
      lastHarvestTime: new Date().toISOString(),
      activeCareActionsCount: 0,
    }));

    setSimulatedCycleHoursLeft(12); // reset to default timer
    onRecordTransaction(rewardPoints, rewardGems, `Harvested Level ${farm.treeLevel} Fruit Crops!`, 'farm_harvest', 0);
    setFeedback(`Harvested! Credited +${rewardPoints.toLocaleString()} Points and +${rewardGems} Gems (₱${(rewardGems/100).toFixed(2)}) to your wallet!`);
    setTimeout(() => setFeedback(''), 5000);
  };

  const handleBuyChicken = () => {
    // Requirres real Piso balance, represents a micromarket asset
    // We simulate using user points balance or gems.
    if (pointsBalance < 5000) {
      setFeedback('Piso Chicken costs 5,000 Points (₱0.20 Equivalent)! Earn more points to recruit.');
      return;
    }

    const deducted = onDeductPoints(5000);
    if (!deducted) return;

    onUpdateFarm((prev) => ({
      ...prev,
      hasChicken: true,
      chickenLastFed: null,
      chickenEggReadyAt: null,
    }));

    onRecordTransaction(-5000, 0, 'Acquired Livestocks Piso Chicken! (-5,000 Pts)', 'chicken_feed', 0.20);
    setFeedback('Congratulations! You acquired a laying Piso Chicken. Feed it to produce points eggs!');
    setTimeout(() => setFeedback(''), 4500);
  };

  const handleFeedChicken = () => {
    if (!farm.hasChicken) return;
    if (chickenEggCountdown > 0) {
      setFeedback('Piso Chicken is already digestable. Egg is currently maturing!');
      return;
    }

    onUpdateFarm((prev) => ({
      ...prev,
      chickenLastFed: new Date().toISOString(),
    }));

    setChickenEggCountdown(20); // 20 seconds mock interval for laying egg
    onRecordTransaction(-120, 0, 'Fed Livestocks Piso Chicken (-120 Pts)', 'chicken_feed', 0);
    setFeedback('Chicken is fed and cozy! It is incubating eggs... Ready in 20 seconds.');
    setTimeout(() => setFeedback(''), 4000);
  };

  const handleCollectEgg = () => {
    if (chickenEggCountdown > 0 || !farm.chickenLastFed) return;

    onUpdateFarm((prev) => ({
      ...prev,
      chickenLastFed: null,
      chickenCollectedEggsCount: prev.chickenCollectedEggsCount + 1,
    }));

    const rewardPts = 2800;
    onRecordTransaction(rewardPts, 0, 'Harvested Golden Chicken Egg (+2,800 Pts)', 'chicken_egg', 0);
    setFeedback(`Egg collected! Received +${rewardPts.toLocaleString()} Points instantly! Feed again.`);
    setTimeout(() => setFeedback(''), 4000);
  };

  const handlePeerCare = () => {
    if (peerWateredToday) {
      setFeedback('You already helped water a friends tree today (24h cooldown).');
      return;
    }

    onUpdateFarm((prev) => {
      const nextExp = prev.treeExp + 30;
      const leveledUp = nextExp >= prev.treeLevel * 100;
      return {
        ...prev,
        treeExp: leveledUp ? nextExp - prev.treeLevel * 100 : nextExp,
        treeLevel: leveledUp ? prev.treeLevel + 1 : prev.treeLevel,
      };
    });

    accelerateTimer(3.0); // visitation care cuts 3 hours!
    onRecordTransaction(600, 2, 'Friends support crop event contribution (+600 Pts, 2 Gems)', 'farm_harvest', 0);
    setPeerWateredToday(true);
    setFeedback('Support logged! Watered peers golden tree. Received +600 points & +2 gems multiplier! Growth countdown reduced by 3 Hours.');
    setTimeout(() => setFeedback(''), 4500);
  };

  // Cooldown effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (careTimer > 0) {
      interval = setInterval(() => {
        setCareTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [careTimer]);

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 selection:bg-emerald-500/20">
      {/* Dynamic 2D Isometric Interactive Canvas Box */}
      <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
        <div className="absolute top-4 right-4 z-10 flex items-center gap-1 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-emerald-400 select-none">
          <Gamepad2 className="w-3.5 h-3.5" />
          <span className="font-mono text-[10px] uppercase font-bold tracking-wider">Active Farm Engine v1.0</span>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-black text-white flex items-center gap-2">
            <Sprout className="w-5 h-5 text-emerald-400" />
            Cozy Golden Crops Grid
          </h2>
          <p className="text-xs text-slate-400">
            Care for your tree, fertilize raw nodes, farm golden fruits every 12-Hour Production Cycle.
          </p>
        </div>

        {/* The Graphical Farming Stage */}
        <div className="w-full h-64 bg-slate-950 rounded-2xl relative border border-slate-850 overflow-hidden flex items-center justify-center">
          {/* Subtle isometric grid backlines */}
          <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
            backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)',
            backgroundSize: '24px 24px'
          }} />

          {/* Interactive elements relative layout simulating isometric 2.5D view */}
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            
            {/* 3D Grass Platform vector */}
            <div className="absolute bottom-12 w-64 h-32 bg-slate-900 border border-slate-800 rounded-[50%] transform rotate-x-60 flex items-center justify-center shadow-2xl">
              <div className="w-56 h-24 bg-emerald-950/35 border border-emerald-550/20 rounded-[50%] flex items-center justify-center">
                <div className="w-36 h-12 bg-emerald-900/40 rounded-[50%] animate-pulse" />
              </div>
            </div>

            {/* Tree Evolution visuals based on levels */}
            <div className="absolute bottom-20 z-10 flex flex-col items-center transition-all duration-1000">
              {/* Floating Exp tags */}
              <div className="absolute -top-8 bg-slate-900 border border-slate-800 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full shadow-lg flex items-center gap-1 select-none animate-bounce">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Lv. {farm.treeLevel} ({farm.treeExp}%)</span>
              </div>

              {/* Rendering different visual graphics depending on user tree Level */}
              {farm.treeLevel === 1 ? (
                // Sprout level
                <div className="w-16 h-16 flex items-center justify-center relative animate-pulse">
                  <div className="absolute w-12 h-12 bg-emerald-500/20 rounded-full blur-md" />
                  <div className="w-1.5 h-10 bg-emerald-750 rounded-b-lg relative">
                    <div className="absolute -left-3 top-2 w-4 h-2 bg-emerald-400 rounded-full transform -rotate-45" />
                    <div className="absolute -right-3 top-4 w-4 h-2 bg-emerald-400 rounded-full transform rotate-45" />
                  </div>
                </div>
              ) : farm.treeLevel < 5 ? (
                // Sapling level
                <div className="w-24 h-24 flex items-center justify-center relative">
                  <div className="absolute w-20 h-20 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />
                  {/* Stem */}
                  <div className="w-3.5 h-14 bg-amber-800 rounded-b-lg relative flex justify-center">
                    {/* Leafy crowns */}
                    <div className="absolute -top-8 w-16 h-12 bg-emerald-600 rounded-full" />
                    <div className="absolute -top-11 w-10 h-10 bg-emerald-500 rounded-full" />
                    {/* Side branches */}
                    <div className="absolute -left-6 top-2 w-8 h-2 bg-amber-800 rounded-sm transform -rotate-30">
                      <div className="absolute -top-2 left-2 w-4 h-4 bg-emerald-600 rounded-full" />
                    </div>
                  </div>
                </div>
              ) : (
                // Master points tree
                <div className="w-36 h-36 flex items-center justify-center relative">
                  <div className="absolute w-32 h-32 bg-amber-400/10 rounded-full blur-3xl animate-pulse" />
                  {/* Thick Wood trunk */}
                  <div className="w-5 h-20 bg-amber-900 rounded-b-xl relative flex justify-center">
                    {/* Majestic golden crop leaves */}
                    <div className="absolute -top-14 w-28 h-20 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg" />
                    <div className="absolute -top-22 w-20 h-16 bg-emerald-500 rounded-full opacity-90 shadow-lg" />
                    <div className="absolute -top-26 w-14 h-12 bg-emerald-400 rounded-full opacity-80" />

                    {/* Glowing Points Fruits */}
                    <div className="absolute -top-8 -left-6 w-3.5 h-3.5 bg-amber-400 rounded-full animate-ping opacity-75" />
                    <div className="absolute -top-8 -left-6 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center text-[7px] text-slate-900 font-extrabold font-mono shadow-md border border-white">
                      ₱
                    </div>
                    <div className="absolute -top-3 right-6 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center text-[7px] text-slate-900 font-extrabold font-mono shadow-md border border-white">
                      ₱
                    </div>
                    <div className="absolute -top-14 left-4 w-3.5 h-3.5 bg-amber-400 rounded-full flex items-center justify-center text-[7px] text-slate-900 font-extrabold font-mono shadow-md border border-white">
                      ₱
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Simulated roam Chicken if purchased */}
            {farm.hasChicken && (
              <div className="absolute bottom-10 right-16 z-20 animate-bounce cursor-pointer" title="Roam Piso Chicken">
                <div className="relative">
                  {/* Egg Ready Balloon indicator */}
                  {chickenEggCountdown === 0 && farm.chickenLastFed && (
                    <div 
                      onClick={handleCollectEgg}
                      className="absolute -top-12 -left-4 bg-amber-400 hover:bg-amber-300 border border-slate-900 text-slate-950 font-black font-mono text-[9px] px-2 py-1 rounded-full shadow-lg flex items-center gap-1 animate-pulse"
                    >
                      <span>🥚 EGG READY</span>
                    </div>
                  )}

                  {/* Red/Yellow Pixel Chicken */}
                  <div className="w-9 h-8 bg-amber-500 rounded-xl relative border border-amber-600 shadow-lg flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-red-650 rounded-full absolute -top-1 left-1.5" /> {/* Comb */}
                    <div className="w-2 h-2 bg-slate-950 rounded-full absolute top-2.5 left-2" /> {/* Eye */}
                    <div className="w-3 h-2 bg-amber-400 rounded-sm absolute top-3.5 -left-1" /> {/* Beak */}
                    <div className="w-3 h-3 bg-amber-600 rounded-full absolute bottom-1 right-1" /> {/* Tail */}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 12-Hour Cycle harvest controls panel */}
        <div className="mt-4 p-4 bg-slate-950 rounded-2xl border border-slate-850 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-emerald-400">
              <Clock className="w-5 h-5 animate-spin duration-3000" />
            </div>
            <div>
              <p className="text-xs font-bold text-white flex items-center gap-1.5">
                12-Hour Production Cycle State
              </p>
              <div className="flex items-center gap-2 mt-0.5 mt-1">
                {/* Visual timing bar indicator */}
                <div className="w-32 bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full transition-all duration-1000" 
                    style={{ width: `${((12 - simulatedCycleHoursLeft) / 12) * 100}%` }}
                  />
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {simulatedCycleHoursLeft > 0 ? `${simulatedCycleHoursLeft.toFixed(1)}h Remaining` : 'MATURE! HARVEST NOW'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleHarvestFruit}
            disabled={simulatedCycleHoursLeft > 0}
            className={`px-5 py-2.5 rounded-xl text-xs font-extrabold tracking-wide transition-all ${
              simulatedCycleHoursLeft <= 0
                ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md animate-pulse'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800/80'
            }`}
          >
            Harvest Golden Fruits crops
          </button>
        </div>

        {/* Dynamic Actions Dashboard */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={handleWater}
            disabled={careTimer > 0}
            className={`p-3 rounded-2xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center ${
              careTimer > 0
                ? 'bg-slate-950/20 border-slate-900 text-slate-600 cursor-not-allowed'
                : 'bg-slate-950 border-slate-800 hover:border-emerald-500/30 text-emerald-400'
            }`}
          >
            <Droplet className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-bold">Water Crop</span>
            <span className="text-[9px] text-slate-400 font-semibold font-mono">
              {careTimer > 0 ? `Ready in ${careTimer}s` : 'FREE +15 EXP'}
            </span>
          </button>

          <button
            onClick={handleFertilize}
            className="p-3 bg-slate-950 border border-slate-800 hover:border-emerald-500/30 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center text-amber-500 transition-all"
          >
            <Sprout className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-bold">Organic Fertilizer</span>
            <span className="text-[9px] text-slate-400 font-semibold font-mono">Cost: 500 Pts • +45 EXP</span>
          </button>

          <button
            onClick={handleWatchAdSpeedup}
            className="p-3 bg-slate-950 border border-slate-800 hover:border-indigo-500/30 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center text-indigo-400 transition-all"
          >
            <Zap className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold">Watch Video Ad</span>
            <span className="text-[9px] text-slate-400 font-semibold font-mono">+60 EXP • Accelerates 4.5h</span>
          </button>

          <button
            onClick={handlePeerCare}
            className="p-3 bg-slate-950 border border-slate-800 hover:border-rose-500/30 rounded-2xl flex flex-col items-center justify-center gap-1.5 text-center text-rose-450 transition-all"
          >
            <User className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold">Water Peer Crop</span>
            <span className="text-[9px] text-slate-400 font-semibold font-mono">Once/24h • Accelerate 3.0h</span>
          </button>
        </div>

        {feedback && (
          <div className="mt-4 p-3 bg-slate-950 border border-slate-850 rounded-xl text-center text-xs font-bold text-white flex items-center justify-center gap-1.5 animate-bounce">
            <Info className="w-4 h-4 text-emerald-400" />
            <span>{feedback}</span>
          </div>
        )}
      </div>

      {/* Livestock Engine Details */}
      <div className="bg-slate-900 border border-slate-850 rounded-3xl p-6 shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-850 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-1.5">
              <span>🐔</span>
              Active Livestock Barn
            </h3>
            <p className="text-xs text-slate-400 font-medium">
              Acquire Piso-purchased chicken asset to harvest eggs laying automatic point distributions.
            </p>
          </div>
        </div>

        {!farm.hasChicken ? (
          <div className="p-8 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center text-center">
            <span className="text-4xl mb-3">🥚</span>
            <h4 className="text-xs font-bold text-white">Barn is currently empty</h4>
            <p className="text-[11px] text-slate-500 max-w-sm mt-1">
              Livestock Chicken asset transforms points eggs every maturations feed interval cycle.
            </p>
            <button
              onClick={handleBuyChicken}
              className="mt-4 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs transition-transform active:scale-98 shadow-md"
            >
              Acquire Chicken (5,000 Points / ₱0.20 Equivalent)
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Panel */}
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-center flex flex-col justify-center">
              <span className="text-3xl mb-1">🐔</span>
              <p className="text-xs font-bold text-white">Piso Chicken Breed</p>
              <p className="text-[10px] text-emerald-400 font-semibold mt-1">Status: Active & Maturing</p>
              <p className="text-[10px] text-slate-500 font-mono mt-1">Eggs Collected: {farm.chickenCollectedEggsCount}</p>
            </div>

            {/* Actions Panel */}
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-center flex flex-col justify-center gap-2">
              <button
                onClick={handleFeedChicken}
                disabled={chickenEggCountdown > 0}
                className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all ${
                  chickenEggCountdown > 0
                    ? 'bg-slate-900 text-slate-500 border border-slate-850'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-md'
                }`}
              >
                Feed Chicken (-120 Pts)
              </button>
              <p className="text-[10px] text-slate-400 font-medium">
                Feeding is required to start the golden egg countdown.
              </p>
            </div>

            {/* Eggs Incubation Tracker */}
            <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-center flex flex-col justify-center font-mono">
              <p className="text-[10px] uppercase tracking-wider font-extrabold text-slate-500">Egg laying status</p>
              {chickenEggCountdown > 0 ? (
                <div className="mt-2 space-y-1">
                  <span className="text-xl font-black text-amber-400 animate-pulse">{chickenEggCountdown}s</span>
                  <p className="text-[9px] text-slate-450">Incubation Cycle</p>
                </div>
              ) : farm.chickenLastFed ? (
                <button
                  onClick={handleCollectEgg}
                  className="mt-2 py-2 px-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs rounded-xl shadow-md animate-bounce"
                >
                  🥚 COLLECT EGG
                </button>
              ) : (
                <p className="text-xs text-slate-400 mt-2 font-medium">Needs feed input to initialize cycle</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
