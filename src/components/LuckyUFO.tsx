/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Gift, Zap, HelpCircle } from 'lucide-react';

interface LuckyUFOProps {
  onCollectPoints: (amount: number, typeName: string) => void;
}

export default function LuckyUFO({ onCollectPoints }: LuckyUFOProps) {
  const [visible, setVisible] = useState(false);
  const [posX, setPosX] = useState(10);
  const [posY, setPosY] = useState(20);
  const [ufoType, setUfoType] = useState<'ufo' | 'chicken'>('ufo');
  const [lastNotification, setLastNotification] = useState<string>('');

  useEffect(() => {
    // Attempt to spawn every 45 to 60 seconds
    const interval = setInterval(() => {
      if (!visible) {
        setUfoType(Math.random() > 0.5 ? 'ufo' : 'chicken');
        // Random layout positions
        setPosX(Math.floor(Math.random() * 70) + 10);
        setPosY(Math.floor(Math.random() * 50) + 20);
        setVisible(true);

        // Auto disable after 15 seconds if unclicked
        setTimeout(() => {
          setVisible(false);
        }, 15000);
      }
    }, 45000);

    return () => clearInterval(interval);
  }, [visible]);

  const handleGrabPoints = () => {
    // Lucky variance distribution yields points from 10 points to 500 points based on liquidity modifiers
    const pointsAllocated = Math.floor(Math.random() * 490) + 10;
    onCollectPoints(pointsAllocated, ufoType === 'ufo' ? 'Lucky Space UFO' : 'Cosmic Flying Chicken');
    setVisible(false);
    setLastNotification(`Grabbed! +${pointsAllocated} points collected from floating ${ufoType}!`);
    setTimeout(() => setLastNotification(''), 4000);
  };

  // Immediate manual spawn for sandbox testing
  const forceSpawn = () => {
    if (visible) return;
    setUfoType(Math.random() > 0.5 ? 'ufo' : 'chicken');
    setPosX(Math.floor(Math.random() * 70) + 10);
    setPosY(Math.floor(Math.random() * 50) + 20);
    setVisible(true);
  };

  return (
    <>
      {/* Floating element container */}
      {visible && (
        <div
          onClick={handleGrabPoints}
          className="fixed z-50 cursor-pointer select-none animate-bounce flex flex-col items-center gap-1 group"
          style={{
            left: `${posX}%`,
            top: `${posY}%`,
            transition: 'all 2s ease-in-out',
          }}
          title="Click to grab points reward payload!"
        >
          {/* Pulsing indicator tag */}
          <span className="bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.5 rounded-full shadow-lg border border-slate-950 animate-pulse whitespace-nowrap">
            🎁 GRAB REWARD!
          </span>

          {ufoType === 'ufo' ? (
            <div className="w-16 h-10 bg-slate-900 border-2 border-emerald-500 rounded-full flex flex-col items-center justify-center relative shadow-2xl overflow-hidden group-hover:scale-110 transition-transform">
              <div className="w-6 h-4 bg-sky-300 rounded-t-full absolute top-1" /> {/* dome */}
              <div className="w-full h-1 bg-emerald-400 absolute bottom-3" /> {/* belt */}
              {/* glowing lights */}
              <span className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-amber-450 bg-amber-400 animate-ping inline-block" />
              <span className="text-[10px] font-bold text-white z-10 font-mono">F2E</span>
            </div>
          ) : (
            <div className="w-14 h-12 bg-amber-400 rounded-full border-2 border-slate-950 shadow-2xl flex items-center justify-center relative group-hover:scale-110 transition-transform">
              <div className="w-2.5 h-2.5 bg-red-500 rounded-full absolute -top-1" /> {/* comb */}
              <span className="text-sm">🐔</span>
              {/* wings */}
              <div className="w-3 h-2 bg-amber-500 rounded-full absolute bottom-1 right-1 transform rotate-12" />
            </div>
          )}
        </div>
      )}

      {/* Persistent helper banner to force spawn or explain the feature */}
      <div className="fixed bottom-3 left-4 z-40 bg-slate-900/90 backdrop-blur-md border border-slate-800 p-2 text-[10px] rounded-xl shadow-lg flex items-center gap-2 select-none select-none">
        <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
        <span className="text-slate-350">Lucky Flying Objects:</span>
        <button
          onClick={forceSpawn}
          disabled={visible}
          className="bg-slate-950 hover:bg-slate-800 border border-slate-800 px-2 py-0.5 rounded-lg text-emerald-400 font-bold disabled:opacity-50"
        >
          Spawn Asset
        </button>

        {lastNotification && (
          <span className="text-[10px] text-amber-400 font-bold ml-1 animate-pulse">
            {lastNotification}
          </span>
        )}
      </div>
    </>
  );
}
