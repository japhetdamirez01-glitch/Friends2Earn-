/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone, Shield, Facebook, CheckCircle2, User, HelpCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface OTPAuthProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export default function OTPAuth({ onLoginSuccess }: OTPAuthProps) {
  const [mobileNumber, setMobileNumber] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [useFacebook, setUseFacebook] = useState(false);
  const [step, setStep] = useState<'input' | 'otp'>('input');
  const [otpCode, setOtpCode] = useState('');
  const [error, setError] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!useFacebook && (!mobileNumber || mobileNumber.length < 10)) {
      setError('Please enter a valid mobile number.');
      return;
    }
    if (useFacebook && !displayName) {
      setError('Please enter a Facebook name.');
      return;
    }

    setIsSending(true);
    setError('');

    setTimeout(() => {
      setIsSending(false);
      setStep('otp');
    }, 1200);
  };

  const handleVerifyOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode.length !== 6) {
      setError('Verification code must be exactly 6 digits.');
      return;
    }

    // Creating initial simulated database profile
    const nameToUse = useFacebook ? displayName : `User${mobileNumber.slice(-4)}`;
    const isJaphet = nameToUse.toLowerCase().trim() === 'japhet damirez' || mobileNumber === '09123456789' || displayName === 'Japhet Damirez';

    const mockProfile: UserProfile = {
      username: isJaphet ? 'Japhet Damirez' : nameToUse,
      fullName: isJaphet ? 'Japhet Damirez' : nameToUse,
      mobileNumber: useFacebook ? '+63 [FB Connected]' : `+63 ${mobileNumber}`,
      isLoggedIn: true,
      isAdmin: isJaphet,
      pointsBalance: isJaphet ? 1000000 : 25000, // standard welcome points
      gemsBalance: isJaphet ? 5000 : 100, // standard gems
      spinTickets: 1,
      inviteCount: 0,
      vipDaysRemaining: 0,
      isVip: false,
    };

    onLoginSuccess(mockProfile);
  };

  const autofillAdmin = () => {
    setUseFacebook(true);
    setDisplayName('Japhet Damirez');
    setError('');
  };

  const autofillUser = () => {
    setUseFacebook(false);
    setMobileNumber('9187654321');
    setDisplayName('');
    setError('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 selection:bg-emerald-500/30 selection:text-emerald-300">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        {/* Absolute Background Accent Glows */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="text-center mb-8">
          <div className="inline-flex py-1 px-3 rounded-full border border-emerald-500/20 bg-emerald-505/5 text-emerald-400 font-mono text-xs items-center gap-1.5 mb-3 select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Philippine Earning Network
          </div>
          <h1 className="text-3xl font-sans tracking-tight font-extrabold text-white">
            Friends<span className="text-emerald-400">2</span>Earn
          </h1>
          <p className="text-slate-400 text-sm mt-1.5">
            Connect, grow crops, level-up trees, and cash out rewards instantly. 
          </p>
        </div>

        {step === 'input' ? (
          <form onSubmit={handleSendOTP} className="space-y-5">
            {/* Toggle Mode */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => { setUseFacebook(false); setError(''); }}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  !useFacebook
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Phone className="w-3.5 h-3.5" />
                Mobile Number
              </button>
              <button
                type="button"
                onClick={() => { setUseFacebook(true); setError(''); }}
                className={`py-2 px-3 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  useFacebook
                    ? 'bg-slate-800 text-blue-400 shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Facebook className="w-3.5 h-3.5" />
                Facebook Link
              </button>
            </div>

            {useFacebook ? (
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  Your Display Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Japhet Damirez or custom name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-slate-200 placeholder-slate-500 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  Philippine Mobile Number
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-semibold select-none">
                    +63
                  </span>
                  <input
                    type="tel"
                    placeholder="912 345 6789"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-14 pr-4 py-3 text-slate-200 placeholder-slate-500 text-sm font-mono focus:outline-none focus:border-emerald-500 transition-colors tracking-widest text-lg"
                    maxLength={10}
                  />
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isSending}
              className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all ${
                useFacebook
                  ? 'bg-blue-600 hover:bg-blue-500 active:scale-98 text-white'
                  : 'bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950'
              }`}
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  {useFacebook ? 'Authenticate via Facebook' : 'Request OTP Code'}
                </>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-5">
            <div className="text-center p-4 bg-slate-950/50 rounded-2xl border border-slate-800/80">
              <p className="text-slate-400 text-xs">
                We've sent a 6-digit confirmation key to:
              </p>
              <p className="text-white text-sm font-semibold font-mono mt-1">
                {useFacebook ? 'Facebook Link' : `+63 ${mobileNumber}`}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300">
                Enter One-Time Password (OTP)
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="000000"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center bg-slate-950 border border-slate-800 rounded-xl py-3.5 text-white placeholder-slate-600 font-mono text-2xl tracking-[0.5em] focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-950/40 border border-red-500/20 text-red-400 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => { setStep('input'); setOtpCode(''); }}
                className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-transform active:scale-98"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-bold transition-transform active:scale-98 flex items-center justify-center gap-1"
              >
                <CheckCircle2 className="w-4 h-4" />
                Verify & Login
              </button>
            </div>
          </form>
        )}

        {/* Quick Demo Assist Banners */}
        <div className="mt-8 border-t border-slate-850 pt-5 text-center">
          <p className="text-[10px] font-mono tracking-wider uppercase text-slate-500 font-medium mb-3">
            Quick Architecture Sandbox Controls
          </p>
          <div className="flex justify-center gap-2">
            <button
              onClick={autofillAdmin}
              className="text-[11px] bg-slate-950 hover:bg-slate-800 border border-slate-800 text-blue-400 font-medium px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              Login as Japhet Damirez (Admin Profile)
            </button>
            <button
              onClick={autofillUser}
              className="text-[11px] bg-slate-950 hover:bg-slate-800 border border-slate-800 text-emerald-400 font-medium px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5" />
              Standard User
            </button>
          </div>
          <p className="text-[10px] text-slate-500 mt-2 flex items-center justify-center gap-1 select-none">
            <HelpCircle className="w-3 h-3 text-slate-600" />
            Admin Account assignment is bound to username "Japhet Damirez".
          </p>
        </div>
      </div>
    </div>
  );
}
