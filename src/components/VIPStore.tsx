/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Sparkles, Gem, Ticket, Gift, Users, Award, Zap, AlertTriangle, Play, HelpCircle } from 'lucide-react';
import { UserProfile, Transaction } from '../types';

interface VIPStoreProps {
  user: UserProfile;
  adminBalance: number;
  onGrantVip: (days: number, pointCost: number) => void;
  onAddInvite: () => void;
  onSpinWheel: (pointsReward: number, cashReward: number, description: string) => void;
  onInjectTreasuryPoints: (amount: number) => void;
  onRecordTransaction: (points: number, gems: number, desc: string, type: Transaction['type'], php?: number) => void;
}

export default function VIPStore({
  user,
  adminBalance,
  onGrantVip,
  onAddInvite,
  onSpinWheel,
  onInjectTreasuryPoints,
  onRecordTransaction,
}: VIPStoreProps) {
  const [spinFeedback, setSpinFeedback] = useState<string>('');
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [adminPointsInput, setAdminPointsInput] = useState<string>('50000000'); // 50 million treasury injection by default
  const [showAdminTips, setShowAdminTips] = useState<boolean>(false);

  const handleBuyVip1DayPoints = () => {
    // 50,000 Points = ₱2.00 PHP value deduction
    if (user.pointsBalance < 50000) {
      setSpinFeedback('Insufficient points! You need at least 50,000 Points to buy a 1-Day Pass.');
      return;
    }
    onGrantVip(1, 50000);
    setSpinFeedback('VIP 1-Day Pass successfully activated! Banner ads are now locked.');
    setTimeout(() => setSpinFeedback(''), 4500);
  };

  const handleBuyVip1DayPiso = () => {
    // Simulates a real Piso micropayment of ₱2.00 PHP
    onGrantVip(1, 0); // No points cost, simulates payment authorization
    onRecordTransaction(0, 0, 'Purchased VIP 1-Day Pass via Piso Micro-payment (₱2.00 PHP)', 'vip_purchase', -2.00);
    setSpinFeedback('Piso Micropayment validated! VIP 1-Day Pass successfully activated.');
    setTimeout(() => setSpinFeedback(''), 4500);
  };

  const handleBuyVip1WeekPiso = () => {
    // 1-Week Pass is Piso transaction exclusive (simulated ₱10.00 PHP micro-charge)
    onGrantVip(7, 0); // No points cost
    onRecordTransaction(0, 0, 'Purchased VIP 1-Week Pass via Piso Billing Service (₱10.00 PHP)', 'vip_purchase', -10.00);
    setSpinFeedback('Piso Carrier verification received! VIP 1-Week Pass activated!');
    setTimeout(() => setSpinFeedback(''), 4500);
  };

  const spinCashWheel = () => {
    if (user.spinTickets <= 0) {
      setSpinFeedback('No spin tickets remaining! Invite more friends to earn spins.');
      return;
    }

    setIsSpinning(true);
    setSpinFeedback('Spinning the Piso wheel...');

    setTimeout(() => {
      // cash wheel yielding random distributions from ₱1.00 PHP up to ₱10.00 PHP
      const randomPHP = Math.floor(Math.random() * 10) + 1; // 1 to 10 PHP
      const convertedPoints = randomPHP * 25000; // 25,000 Points = ₱1.00 PHP

      onSpinWheel(convertedPoints, randomPHP, `Won ₱${randomPHP.toFixed(2)} PHP from cash wheel spin ticket`);
      setIsSpinning(false);
      setSpinFeedback(`JACKPOT! You won ₱${randomPHP.toFixed(2)} PHP! Brand new +${convertedPoints.toLocaleString()} Points credited to your balance!`);
      setTimeout(() => setSpinFeedback(''), 5000);
    }, 1800);
  };

  // Gem milestones scales matching section 4 blueprint
  const getGemMilestoneStatus = (invitesRequired: number) => {
    return user.inviteCount >= invitesRequired;
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 selection:bg-emerald-500/20">
      {/* Visual Header */}
      <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="inline-flex py-1 px-3 rounded-full border border-indigo-500/20 bg-indigo-505/5 text-indigo-400 font-mono text-xs items-center gap-1.5 mb-2 select-none">
            <Sparkles className="w-3 h-3 animate-ping" />
            VIP & Inviter Rewards Node
          </span>
          <h2 className="text-xl font-black text-white">VIP Club Pass & Invite Center</h2>
          <p className="text-xs text-slate-400">
            Adblock subscriptions, verified invite spin tickets, and the Gem Chest scale.
          </p>
        </div>

        {/* Invite Generator Sandbox Button */}
        <button
          onClick={onAddInvite}
          className="px-4 py-2 bg-indigo-600 hover:bg-slate-700 hover:text-white text-indigo-100 font-bold rounded-xl text-xs transition-transform active:scale-98 flex items-center gap-1.5"
        >
          <Users className="w-4 h-4 text-emerald-300" />
          Simulate Friend Invite (+1)
        </button>
      </div>

      {/* VIP Passes Marketplace */}
      <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl shadow-lg">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          VIP Adblock Marketplace
        </h3>
        <p className="text-xs text-slate-400 mb-4">
          Lock intercept banner ads and unlock automatic task doubles without video constraints.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Option 1: 1-Day Points Pass */}
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-white uppercase font-mono">1-Day VIP Pass</p>
              <p className="text-[10px] text-indigo-400 font-semibold mt-1">Paid in Points</p>
              <p className="text-xs text-slate-400 mt-2">
                Deducts points instantly from balance to unlock full ad suppression for 24 hours.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-900 space-y-2">
              <div className="text-base font-black font-mono text-white">50,000 Points</div>
              <button
                onClick={handleBuyVip1DayPoints}
                className="w-full py-2 bg-slate-900 hover:bg-slate-800 border border-indigo-500/20 text-indigo-400 hover:text-indigo-300 font-extrabold text-xs rounded-xl transition-all"
              >
                Utilize Points balance
              </button>
            </div>
          </div>

          {/* Option 2: 1-Day Piso Pass */}
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-white uppercase font-mono">1-Day VIP Pass</p>
              <p className="text-[10px] text-emerald-400 font-semibold mt-1">Simulated Piso Payment</p>
              <p className="text-xs text-slate-400 mt-2">
                Simulates real-world mobile billing integration to unlock VIP without points deduction.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-900 space-y-2">
              <div className="text-base font-black font-mono text-white">₱2.00 PHP</div>
              <button
                onClick={handleBuyVip1DayPiso}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all"
              >
                Simulate Micropayment
              </button>
            </div>
          </div>

          {/* Option 3: 1-Week Piso Pass (Exclusively PHP payment only) */}
          <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-white uppercase font-mono">1-Week Premium Pass</p>
              <p className="text-[10px] text-amber-500 font-semibold mt-1">Piso Carrier Exclusive</p>
              <p className="text-xs text-slate-400 mt-2">
                Sustained 7-day VIP tier level with extra spin multipliers on water crops crops.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-900 space-y-2">
              <div className="text-base font-black font-mono text-white">₱10.00 PHP</div>
              <button
                onClick={handleBuyVip1WeekPiso}
                className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl transition-all"
              >
                Simulate Weekly Pass
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Piso Cash Spin Wheel & Invite Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Cash Wheel Ticket Burner */}
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl shadow-lg flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5 mb-1">
              <Ticket className="w-4 h-4 text-emerald-400" />
              Piso Cash Wheel Spin ticket
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Verified invites award 1 spin ticket. Turn are yield payouts from ₱1.00 PHP to ₱10.00 PHP.
            </p>

            <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl text-center space-y-3 relative overflow-hidden">
              <p className="text-[11px] font-mono tracking-wider uppercase text-slate-500">Tickets Wallet Balance</p>
              <div className="text-3xl font-black font-mono text-white flex items-center justify-center gap-1">
                <span>🎫</span>
                <span>{user.spinTickets} Ticket{user.spinTickets !== 1 && 's'}</span>
              </div>

              {/* Graphical Circular Wheel mock */}
              <div className="relative w-32 h-32 mx-auto rounded-full border-4 border-slate-800 bg-slate-900 flex items-center justify-center overflow-hidden">
                <div className={`absolute inset-0 border-r border-slate-850 transform duration-1000 ${isSpinning ? 'animate-spin' : ''}`} style={{
                  backgroundImage: 'conic-gradient(#10b981 0% 25%, #3b82f6 25% 50%, #f59e0b 50% 75%, #ef4444 75% 100%)'
                }} />
                <div className="absolute w-24 h-24 rounded-full bg-slate-950 flex items-center justify-center text-[10px] font-bold text-slate-200">
                  {isSpinning ? 'SPINNING...' : '₱1.00 - ₱10.00'}
                </div>
              </div>

              <button
                onClick={spinCashWheel}
                disabled={user.spinTickets <= 0 || isSpinning}
                className={`w-full py-2.5 rounded-xl text-xs font-extrabold transition-all transform active:scale-97 ${
                  user.spinTickets > 0 && !isSpinning
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-500 cursor-not-allowed border border-slate-850'
                }`}
              >
                {isSpinning ? 'Waiting for verified drop...' : 'Pull Spin Ticket Trigger'}
              </button>
            </div>
          </div>
        </div>

        {/* Invite Scales Gem Chest Tracker */}
        <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl shadow-lg">
          <h3 className="text-base font-bold text-white flex items-center gap-1.5 mb-1">
            <Gift className="w-4 h-4 text-blue-400" />
            Gem Milestone Chests Tracking
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Invite milestones convert directly to Gem currency payloads:
          </p>

          <div className="space-y-2.5">
            {[
              { invites: 1, gems: 100, money: '₱1.00' },
              { invites: 10, gems: 1000, money: '₱10.00' },
              { invites: 50, gems: 5000, money: '₱50.00' },
              { invites: 100, gems: 10000, money: '₱100.00' },
              { invites: 500, gems: 50000, money: '₱500.00' },
              { invites: 1000, gems: 100000, money: '₱1,000.00' },
            ].map((milestone) => {
              const reached = getGemMilestoneStatus(milestone.invites);
              return (
                <div
                  key={milestone.invites}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    reached
                      ? 'bg-emerald-950/20 border-emerald-500/20 text-white font-semibold'
                      : 'bg-slate-950/80 border-slate-850/60 text-slate-450'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-900 border border-slate-800 flex items-center justify-center">
                      {reached ? '✅' : '🔒'}
                    </span>
                    <span className={reached ? 'text-slate-200' : 'text-slate-500'}>
                      {milestone.invites} Invite{milestone.invites !== 1 && 's'} Milestone
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`font-mono text-[11px] ${reached ? 'text-blue-400 font-bold' : 'text-slate-500'}`}>
                      {milestone.gems.toLocaleString()} Gems
                    </span>
                    <span className="text-[10px] text-slate-500 font-bold">({milestone.money})</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Admin Treasury Control Section */}
      <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl shadow-xl">
        <div className="flex items-center justify-between pb-3 border-b border-slate-850 mb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              Administrative Treasury Gate (Japhet Damirez Controller)
            </h3>
            <p className="text-xs text-slate-400">
              Exclusive pool operations reserved for the authorized host profile matching exact authentication criteria.
            </p>
          </div>
          <button
            onClick={() => setShowAdminTips(!showAdminTips)}
            className="text-[10px] font-mono text-slate-400 hover:underline"
          >
            {showAdminTips ? 'Hide constraints' : 'View parameters'}
          </button>
        </div>

        {user.isAdmin ? (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950 rounded-2xl border border-slate-850 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-[10px] font-mono tracking-wider uppercase text-slate-500">Japhet Damirez Treasury Balance</p>
                <p className="text-2xl font-black font-mono text-emerald-450 tracking-tight text-emerald-400 mt-1">
                  {adminBalance.toLocaleString()} Pts
                </p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                  Locked points balance modifier representing exactly 10 Billion base allocation units.
                </p>
              </div>

              <div className="flex flex-col justify-center space-y-2">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-semibold uppercase">Inject liquidity Points Drop</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={adminPointsInput}
                      onChange={(e) => setAdminPointsInput(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-blue-500"
                    />
                    <button
                      onClick={() => {
                        const amount = parseInt(adminPointsInput, 10);
                        if (isNaN(amount) || amount <= 0) return;
                        onInjectTreasuryPoints(amount);
                        setSpinFeedback(`Admin Action authorized: Injected ${amount.toLocaleString()} points drop.`);
                        setTimeout(() => setSpinFeedback(''), 4000);
                      }}
                      className="px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg transition-colors"
                    >
                      Authorize Injection
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {showAdminTips && (
              <div className="p-3.5 bg-blue-950/20 border border-blue-500/20 text-xs text-slate-350 rounded-xl leading-relaxed space-y-1 select-text">
                <p className="font-semibold text-blue-400">Core Software Architect Rules enforcement:</p>
                <p>• Points modifier hard-locked at 25,000 Points = ₱1.00 PHP.</p>
                <p>• Automated Post Payout (The 5K Rule) automatically pulls 5,000 points from this admin treasury node and distributes directly to any active poster.</p>
                <p>• Minimum cash-out withdrawal limits enforced at exactly ₱50.00 PHP (1,250,000 pts balance base floor criteria).</p>
              </div>
            )}
          </div>
        ) : (
          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-850 flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
            <div className="text-xs">
              <p className="font-bold text-white">Access Key Denied</p>
              <p className="text-slate-400 mt-0.5">
                Your currently authenticated profile is standard. Control panel is only visible during active login of username <span className="text-blue-400 font-bold">"Japhet Damirez"</span>. Set Facebook display name to japhet damirez in login mock to view.
              </p>
            </div>
          </div>
        )}

        {spinFeedback && (
          <div className="mt-4 p-3 bg-slate-950 border border-slate-850 rounded-xl text-center text-xs font-bold text-indigo-400 animate-pulse">
            {spinFeedback}
          </div>
        )}
      </div>
    </div>
  );
}
