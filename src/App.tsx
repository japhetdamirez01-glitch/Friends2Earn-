/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, Post, Transaction, FarmState } from './types';
import OTPAuth from './components/OTPAuth';
import Header from './components/Header';
import ActiveDrawer from './components/ActiveDrawer';
import FeedSection from './components/FeedSection';
import FarmGame from './components/FarmGame';
import VIPStore from './components/VIPStore';
import WalletLedger from './components/WalletLedger';
import LuckyUFO from './components/LuckyUFO';
import { Radio, Users, Sprout, Sparkles, Trophy, Plus, Shield } from 'lucide-react';

// Seeding standard initial posts for layout beauty
const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    authorName: 'Kenji Tan',
    authorUsername: 'Kenji Tan',
    content: 'Just harvested my Level 3 Golden Fruit! Managed to yield 36,000 Points and 75 Gems directly converting to GCash. Love the #Friends2Earn crop multipliers! 🌾💰',
    type: 'text',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likes: 24,
    shares: 4,
    hasRewardedOwner: true,
  },
  {
    id: 'post-2',
    authorName: 'Rochelle Castro',
    authorUsername: 'Rochelle Castro',
    content: 'Loving the interactive isometric farm mechanics here! Built my grid sapling. Click support below to water my crop and get +600 points mutual payout!',
    type: 'photo',
    mediaUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=800&auto=format&fit=crop&q=60',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    likes: 42,
    shares: 8,
    hasRewardedOwner: true,
  }
];

// Seeding sample transaction ledgers
const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx-seed-1',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    type: 'admin_treasury',
    amountPoints: 100000000,
    amountGems: 10000,
    description: 'Master Treasury block initialization drop',
    sender: 'System Server',
    receiver: 'Japhet Damirez'
  },
  {
    id: 'tx-seed-2',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    type: 'farm_harvest',
    amountPoints: 24000,
    amountGems: 50,
    description: 'Level 2 Golden Crop Harvest completed',
    sender: 'Golden Grid',
    receiver: 'You'
  }
];

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    const cached = localStorage.getItem('f2e_user');
    return cached ? JSON.parse(cached) : null;
  });

  const [adminBalance, setAdminBalance] = useState<number>(() => {
    const cached = localStorage.getItem('f2e_admin_treasury');
    // Treasury starts with exactly 10 Billion points allocation block
    return cached ? parseInt(cached, 10) : 10000000000;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const cached = localStorage.getItem('f2e_posts');
    return cached ? JSON.parse(cached) : INITIAL_POSTS;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const cached = localStorage.getItem('f2e_transactions');
    return cached ? JSON.parse(cached) : INITIAL_TRANSACTIONS;
  });

  const [farmState, setFarmState] = useState<FarmState>(() => {
    const cached = localStorage.getItem('f2e_farm');
    return cached ? JSON.parse(cached) : {
      treeLevel: 1,
      treeExp: 20,
      lastHarvestTime: null,
      activeCareActionsCount: 0,
      hasChicken: false,
      chickenLastFed: null,
      chickenEggReadyAt: null,
      chickenCollectedEggsCount: 0
    };
  });

  const [activeTab, setActiveTab] = useState<'feed' | 'farm' | 'vip' | 'wallet'>('feed');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');

  // Persistence triggers
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('f2e_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('f2e_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('f2e_admin_treasury', adminBalance.toString());
  }, [adminBalance]);

  useEffect(() => {
    localStorage.setItem('f2e_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('f2e_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('f2e_farm', JSON.stringify(farmState));
  }, [farmState]);

  // Auth logins
  const handleLoginSuccess = (profile: UserProfile) => {
    setCurrentUser(profile);
    setActiveTab('feed');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('f2e_user');
  };

  // Helper function to append to transaction ledger
  const recordTransaction = (
    points: number,
    gems: number,
    desc: string,
    type: Transaction['type'],
    php?: number
  ) => {
    const newTx: Transaction = {
      id: `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toISOString(),
      type,
      amountPoints: points,
      amountGems: gems,
      amountPHP: php,
      description: desc,
      sender: points < 0 || gems < 0 ? 'Your Wallet' : 'Admin Japhet Pool',
      receiver: points < 0 || gems < 0 ? 'System Registry' : 'Your Wallet',
    };

    setTransactions((prev) => [newTx, ...prev]);

    // Apply currency shifts to user state
    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        pointsBalance: Math.max(0, prev.pointsBalance + points),
        gemsBalance: Math.max(0, prev.gemsBalance + gems),
      };
    });
  };

  // Automated Post Payout (The 5K Rule) & hashtag trigger
  const handlePostCreated = (content: string, type: 'text' | 'photo' | 'video', media?: string) => {
    if (!currentUser) return;

    // Deduct 5,000 points from Admin Japhet Damirez treasury balance block
    setAdminBalance((prev) => Math.max(0, prev - 5000));

    // Award +5,000 points to user instantly
    let earnedPoints = 5000;
    let desc = 'Automated Post Payout incentive (The 5K Rule)';

    // Check hashtag trigger: If a user post contains the exact string '#Friends2Earn', auto-credit +100 points
    const matchesHashtag = content.includes('#Friends2Earn');
    if (matchesHashtag) {
      earnedPoints += 100;
      desc = 'Automated Post Payout (5K Rule) & #Friends2Earn hashtag double trigger credit';
    }

    // Insert post to stream
    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorName: currentUser.fullName,
      authorUsername: currentUser.username,
      content,
      type,
      mediaUrl: media,
      createdAt: new Date().toISOString(),
      likes: 0,
      shares: 0,
      hasRewardedOwner: true,
    };

    setPosts((prev) => [newPost, ...prev]);

    // Record Ledger Shifts
    recordTransaction(
      earnedPoints,
      0,
      desc,
      matchesHashtag ? 'hashtag_payout' : 'post_payout',
      earnedPoints / 25000
    );
  };

  // Share Tray Incentive: Awards +10 points automatically
  const handleShareIncentive = (postId: string, platform: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          return { ...p, shares: p.shares + 1 };
        }
        return p;
      })
    );

    recordTransaction(10, 0, `Cross-platform social app share tray incentive via ${platform}`, 'share_bonus', 10 / 25000);
  };

  // Lucky Flying Object payload collection
  const handleCollectLuckyPoints = (amount: number, typeName: string) => {
    recordTransaction(amount, 0, `Captured Lucky Flying Object payload (${typeName})`, 'ufo_reward', amount / 25000);
  };

  // Purchase fertilizer or items helper to subtract points
  const handleDeductPoints = (amount: number): boolean => {
    if (!currentUser || currentUser.pointsBalance < amount) return false;
    // Handled in recordTransaction helper with a negative value
    return true;
  };

  // Grant VIP days from Store
  const handleGrantVip = (days: number, pointCost: number) => {
    if (pointCost > 0) {
      recordTransaction(-pointCost, 0, `Purchased VIP Adblocker ${days}-Day Pass`, 'vip_purchase', 0);
    }
    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        isVip: true,
        vipDaysRemaining: (prev.vipDaysRemaining || 0) + days,
      };
    });
  };

  // Invite Milestone Chest & Spin Tickets increment mechanics
  const handleAddInvite = () => {
    if (!currentUser) return;

    setCurrentUser((prev) => {
      if (!prev) return null;
      const nextInvites = prev.inviteCount + 1;
      
      // Gem Milestone Chest conversion tracking based on scale in section 4
      let awardedGems = 0;
      let milestoneDescription = '';

      if (nextInvites === 1) {
        awardedGems = 100;
        milestoneDescription = '1 Invite milestone Gem chest chest unlock';
      } else if (nextInvites === 10) {
        awardedGems = 1000;
        milestoneDescription = '10 Invites milestone Gem chest chest unlock';
      } else if (nextInvites === 50) {
        awardedGems = 5000;
        milestoneDescription = '50 Invites milestone Gem chest chest unlock';
      } else if (nextInvites === 100) {
        awardedGems = 10000;
        milestoneDescription = '100 Invites milestone Gem chest chest unlock';
      } else if (nextInvites === 500) {
        awardedGems = 50000;
        milestoneDescription = '500 Invites milestone Gem chest chest unlock';
      } else if (nextInvites === 1000) {
        awardedGems = 100000;
        milestoneDescription = '1,000 Invites milestone Gem chest chest unlock';
      }

      // Reaching invite milestone volumes triggers immediate +10,000 points system gift in section 4
      let milestonePointsBonus = 0;
      if (nextInvites % 5 === 0) {
        milestonePointsBonus = 10000;
      }

      setTimeout(() => {
        if (awardedGems > 0) {
          recordTransaction(milestonePointsBonus, awardedGems, milestoneDescription, 'gem_milestone', awardedGems / 100);
        } else if (milestonePointsBonus > 0) {
          recordTransaction(milestonePointsBonus, 0, 'Triggered invite network milestone volume system gift (+10,000 Pts)', 'referral_bonus');
        } else {
          // Standard invite reward
          recordTransaction(1000, 5, 'Simulated verified companion friend invite registration completed', 'referral_bonus');
        }
      }, 10);

      return {
        ...prev,
        inviteCount: nextInvites,
        spinTickets: prev.spinTickets + 1, // each verified invite hands 1 spin ticket
      };
    });
  };

  // Cash Wheel spin win
  const handleSpinWheel = (pointsReward: number, cashReward: number, description: string) => {
    setCurrentUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        spinTickets: Math.max(0, prev.spinTickets - 1),
      };
    });
    recordTransaction(pointsReward, 0, description, 'spin_win', cashReward);
  };

  // Injection by Admin Japhet
  const handleInjectTreasuryPoints = (amount: number) => {
    setAdminBalance((prev) => prev + amount);
    recordTransaction(amount, 0, 'Admin authorized Treasury Master allocation liquidity drop', 'admin_treasury');
  };

  // Cash-out withdrawal request disburse
  const handleCashout = (pointsToDeduct: number) => {
    recordTransaction(-pointsToDeduct, 0, `Submitted cashout withdrawal request (Enqueued disbursement)`, 'cashout', -(pointsToDeduct / 25000));
  };

  // Universal search filters
  const handleSearchChange = (query: string, category: string) => {
    setSearchQuery(query);
    setSearchCategory(category);
  };

  // Filter posts to show search matches
  const filteredPosts = posts.filter((post) => {
    if (!searchQuery) return true;
    const contentMatches = post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const authorMatches = post.authorName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (searchCategory === 'videos') return post.type === 'video' && (contentMatches || authorMatches);
    if (searchCategory === 'photos') return post.type === 'photo' && (contentMatches || authorMatches);
    
    return contentMatches || authorMatches;
  });

  // Visited Care Support action trigger (Waters crop on current node profile)
  const handlePeerVisitationWater = () => {
    setFarmState((prev) => {
      const nextExp = prev.treeExp + 30; // waters peers tree trigger adds EXP
      const leveledUp = nextExp >= prev.treeLevel * 100;
      return {
        ...prev,
        treeExp: leveledUp ? nextExp - prev.treeLevel * 100 : nextExp,
        treeLevel: leveledUp ? prev.treeLevel + 1 : prev.treeLevel,
      };
    });
    recordTransaction(600, 2, 'Friends support crop hydration accelerator (+600 points & +2 gems)', 'farm_harvest');
    setIsDrawerOpen(false);
  };

  // If not logged in, prompt verified OTP code module
  if (!currentUser || !currentUser.isLoggedIn) {
    return <OTPAuth onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      
      {/* Universal Two-Row Composition Header */}
      <Header
        user={currentUser}
        adminBalance={adminBalance}
        onOpenActiveDrawer={() => setIsDrawerOpen(true)}
        onSearchChange={handleSearchChange}
        onLogout={handleLogout}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setSearchQuery(''); // reset search query on tab shift
        }}
        activeTab={activeTab}
      />

      {/* Main Content Node Grid Layout */}
      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full">
        
        {/* Ad Blocker Status Notification Banner */}
        <div className="mb-4 bg-slate-900 border border-slate-800 rounded-2xl p-3 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${currentUser.isVip ? 'bg-indigo-400' : 'bg-amber-400'} animate-pulse`} />
            <p className="font-semibold text-slate-300 select-none">
              {currentUser.isVip
                ? `🏆 Active Premium VIP status (SUPPRESSED ads). Total multiplier enabled.`
                : '💡 Basic Account Mode. Banner ads active. Double your claims below!'}
            </p>
          </div>
          {!currentUser.isVip && (
            <button
              onClick={() => setActiveTab('vip')}
              className="text-[10px] font-black uppercase text-indigo-400 hover:text-indigo-300 bg-indigo-505/10 bg-indigo-950/40 border border-indigo-500/20 px-2.5 py-1 rounded"
            >
              Suppress Ads
            </button>
          )}
        </div>

        {/* Dynamic Navigation Tabs */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 mb-6 bg-slate-900 p-1 rounded-2xl border border-slate-850 max-w-md mx-auto">
          <button
            onClick={() => { setActiveTab('feed'); setSearchQuery(''); }}
            className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              activeTab === 'feed'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-4 h-4" />
            Feed stream
          </button>
          <button
            onClick={() => { setActiveTab('farm'); setSearchQuery(''); }}
            className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              activeTab === 'farm'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sprout className="w-4 h-4" />
            Golden Farm
          </button>
          <button
            onClick={() => { setActiveTab('vip'); setSearchQuery(''); }}
            className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              activeTab === 'vip'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            VIP & Spins
          </button>
          <button
            onClick={() => { setActiveTab('wallet'); setSearchQuery(''); }}
            className={`py-2 px-1 text-center rounded-xl text-xs font-bold transition-all flex flex-col items-center gap-1 ${
              activeTab === 'wallet'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Trophy className="w-4 h-4" />
            Disburse
          </button>
        </div>

        {/* Tab view containers */}
        <div className="container mx-auto">
          {activeTab === 'feed' && (
            <FeedSection
              userUsername={currentUser.username}
              userName={currentUser.fullName}
              adminBalance={adminBalance}
              onPostCreated={handlePostCreated}
              posts={filteredPosts}
              onShareIncentive={handleShareIncentive}
            />
          )}

          {activeTab === 'farm' && (
            <FarmGame
              farm={farmState}
              pointsBalance={currentUser.pointsBalance}
              gemsBalance={currentUser.gemsBalance}
              isVip={currentUser.isVip}
              onUpdateFarm={setFarmState}
              onRecordTransaction={recordTransaction}
              onDeductPoints={handleDeductPoints}
            />
          )}

          {activeTab === 'vip' && (
            <VIPStore
              user={currentUser}
              adminBalance={adminBalance}
              onGrantVip={handleGrantVip}
              onAddInvite={handleAddInvite}
              onSpinWheel={handleSpinWheel}
              onInjectTreasuryPoints={handleInjectTreasuryPoints}
              onRecordTransaction={recordTransaction}
            />
          )}

          {activeTab === 'wallet' && (
            <WalletLedger
              user={currentUser}
              transactions={transactions}
              onCashout={handleCashout}
            />
          )}
        </div>
      </main>

      {/* Toggled Friends active Drawer widget */}
      <ActiveDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onSendGift={handlePeerVisitationWater}
      />

      {/* Floating Lucky Space alert Object */}
      <LuckyUFO onCollectPoints={handleCollectLuckyPoints} />
    </div>
  );
}
