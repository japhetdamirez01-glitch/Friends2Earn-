/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Coins, Gem, ArrowDownToLine, Receipt, Clock, Sparkles, LogOut, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';
import { UserProfile, Transaction } from '../types';

interface WalletLedgerProps {
  user: UserProfile;
  transactions: Transaction[];
  onCashout: (pointsToCashout: number) => void;
}

export default function WalletLedger({ user, transactions, onCashout }: WalletLedgerProps) {
  const [pointsInput, setPointsInput] = useState<string>('1250050'); // Default at floor for testing
  const [feedback, setFeedback] = useState<string>('');
  const [gcashNumber, setGcashNumber] = useState<string>('');

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();

    const amount = parseInt(pointsInput, 10);
    if (isNaN(amount) || amount <= 0) {
      setFeedback('Please input a valid amount of points to withdraw.');
      return;
    }

    // Minimum Cash-out Constraint: Allowed withdrawal threshold set to a floor of exactly ₱50.00 PHP (1.25M pts)
    if (amount < 1250000) {
      setFeedback('Failed: Allowed withdrawal threshold set to a floor of exactly ₱50.00 PHP (Requires 1,250,000 Points minimum).');
      return;
    }

    if (user.pointsBalance < amount) {
      setFeedback('Failed: Insufficient points wallet balance for this cash-out value.');
      return;
    }

    if (!gcashNumber || gcashNumber.length < 10) {
      setFeedback('Failed: Please specify a valid GCash / PayMaya Mobile Number.');
      return;
    }

    onCashout(amount);
    setFeedback(`Success! Enqueued cashout request for ₱${(amount / 25000).toFixed(2)} PHP to GCash ${gcashNumber}.`);
    setTimeout(() => setFeedback(''), 5500);
  };

  const getTransactionBadgeStyle = (type: Transaction['type']) => {
    switch (type) {
      case 'post_payout':
      case 'hashtag_payout':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      case 'farm_harvest':
      case 'chicken_egg':
        return 'bg-amber-550/10 text-amber-500 border border-amber-550/20';
      case 'vip_purchase':
      case 'cashout':
        return 'bg-red-500/10 text-red-500 border border-red-500/20';
      default:
        return 'bg-slate-800 text-slate-300';
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 selection:bg-emerald-500/20">
      {/* Economy Overview Statistics cards with conversion lock numbers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Points currency block */}
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-3xl relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400">
              Core Points Balance
            </span>
            <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-slate-950 font-black text-xs font-mono">
              P
            </div>
          </div>
          <p className="text-2xl font-black font-mono text-white">
            {user.pointsBalance.toLocaleString()}
          </p>
          <div className="pt-2 border-t border-slate-850 mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Locked Rate:</span>
            <span className="font-bold text-amber-400 font-mono">25,000 Pts = ₱1.00 PHP</span>
          </div>
          <div className="bg-emerald-950/20 border border-emerald-500/10 text-[10px] text-emerald-400 font-semibold px-2 py-1.5 rounded-xl text-center mt-3 font-mono">
            Philippine Value Equivalent: ₱{(user.pointsBalance / 25000).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PHP
          </div>
        </div>

        {/* Gems secondary block */}
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-3xl relative overflow-hidden shadow-md">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-blue-400">
              Secondary Gem Balance
            </span>
            <Gem className="w-4 h-4 text-blue-400 fill-blue-500/10" />
          </div>
          <p className="text-2xl font-black font-mono text-white">
            {user.gemsBalance.toLocaleString()}
          </p>
          <div className="pt-2 border-t border-slate-850 mt-3 flex items-center justify-between text-[11px] text-slate-400">
            <span>Locked Rate:</span>
            <span className="font-bold text-blue-400 font-mono">100 Gems = ₱1.00 PHP</span>
          </div>
          <div className="bg-blue-950/20 border border-blue-500/10 text-[10px] text-blue-400 font-semibold px-2 py-1.5 rounded-xl text-center mt-3 font-mono">
            Philippine Value Equivalent: ₱{(user.gemsBalance / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PHP
          </div>
        </div>

        {/* Aggregate Piso Cash Equivalent */}
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-3xl relative overflow-hidden shadow-md flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-purple-400">
              Total Combined Earnings Value
            </span>
            <p className="text-3xl font-black font-mono text-emerald-400 tracking-tight mt-1">
              ₱{((user.pointsBalance / 25000) + (user.gemsBalance / 100)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} PHP
            </p>
          </div>
          <div className="bg-purple-950/20 border border-purple-500/10 text-[9px] text-purple-300 px-2.0 py-1.5 rounded-xl text-center mt-3 font-mono">
            All user incentives draw directly from the Admin Japhet balance block asset.
          </div>
        </div>
      </div>

      {/* Cash-out withdrawal request panel */}
      <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl shadow-lg">
        <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
          <ArrowDownToLine className="w-4 h-4 text-emerald-400" />
          GCash/PayMaya Withdrawal Floor Matrix
        </h3>
        <p className="text-xs text-slate-400 mb-4 font-medium">
          Deduct points to request cashout payout. Minimum cash-out withdrawal allowed floor set to exactly ₱50.00 PHP (1,250,000 Points).
        </p>

        <form onSubmit={handleWithdraw} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400">
                Amount of Points to Deduct
              </label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="Minimum: 1,250,000"
                  value={pointsInput}
                  onChange={(e) => setPointsInput(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold font-mono">
                  ₱{(parseInt(pointsInput || '0', 10) / 25000).toLocaleString(undefined, { maximumFractionDigits: 2 })} PHP
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400">
                Recipient GCash / PayMaya Number
              </label>
              <input
                type="tel"
                placeholder="09171234567"
                value={gcashNumber}
                onChange={(e) => setGcashNumber(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                maxLength={11}
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
            <div className="flex items-center gap-2 text-[10px] text-slate-500">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>Constraint check: {user.pointsBalance >= 1250000 ? '🟢 Balance floor eligible' : '🔴 Balance below floor'}</span>
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition-transform active:scale-98 shadow-md"
            >
              Request GCash disbursement payout
            </button>
          </div>
        </form>

        {feedback && (
          <div className={`mt-4 p-3 rounded-xl text-center text-xs font-bold leading-relaxed border ${
            feedback.includes('Success')
              ? 'bg-emerald-950/40 border-emerald-500/20 text-emerald-400 animate-pulse'
              : 'bg-red-950/40 border-red-500/20 text-red-400'
          }`}>
            {feedback}
          </div>
        )}
      </div>

      {/* Universal Ledger Tracking component (dedicated collection) */}
      <div className="bg-slate-900 border border-slate-850 p-6 rounded-3xl shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-850 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-1.5">
              <Receipt className="w-4.5 h-4.5 text-blue-400" />
              Universal Ledger Tracking History
            </h3>
            <p className="text-xs text-slate-400">
              Real-time audit record of activity shifts, farming crop harvests, and payout withdrawal disburse checkpoints.
            </p>
          </div>
          <span className="text-[9.5px] font-mono bg-slate-950 border border-slate-850 px-2 py-0.5 rounded text-slate-500 font-bold select-none">
            Supabase DB collection (Simulated Sync)
          </span>
        </div>

        <div className="space-y-2.5 overflow-y-auto max-h-[300px] pr-1">
          {transactions.length > 0 ? (
            transactions.map((tx) => (
              <div
                key={tx.id}
                className="p-3 bg-slate-950/70 border border-slate-850 rounded-xl hover:border-slate-800 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-2.5 text-xs"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-slate-900 rounded-lg text-slate-400 font-semibold font-mono border border-slate-800 shrink-0">
                    {tx.type[0].toUpperCase() + tx.type.slice(1, 3)}
                  </div>
                  <div>
                    <h4 className="font-semibold text-white select-text">{tx.description}</h4>
                    <p className="text-[10px] text-slate-500 font-medium font-mono mt-0.5">
                      Sender: {tx.sender} • Receiver: {tx.receiver} • {new Date(tx.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1 font-mono shrink-0">
                  {tx.amountPoints !== 0 && (
                    <span className={`text-[11px] font-bold ${tx.amountPoints > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {tx.amountPoints > 0 ? '+' : ''}{tx.amountPoints.toLocaleString()} Points
                    </span>
                  )}
                  {tx.amountGems !== 0 && (
                    <span className={`text-[11px] font-bold ${tx.amountGems > 0 ? 'text-blue-400' : 'text-slate-500'}`}>
                      {tx.amountGems > 0 ? '+' : ''}{tx.amountGems.toLocaleString()} Gems
                    </span>
                  )}
                  {tx.amountPHP !== undefined && tx.amountPHP !== 0 && (
                    <span className={`text-[10px] font-bold text-slate-300`}>
                      {tx.amountPHP > 0 ? '+' : ''}₱{tx.amountPHP.toFixed(2)} PHP
                    </span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-xs text-slate-500 py-8">Your transaction ledger is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
}
