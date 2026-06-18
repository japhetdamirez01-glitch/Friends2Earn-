/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Transaction {
  id: string;
  timestamp: string;
  type: 'post_payout' | 'hashtag_payout' | 'share_bonus' | 'ufo_reward' | 'referral_bonus' | 'spin_win' | 'gem_milestone' | 'farm_harvest' | 'chicken_feed' | 'chicken_egg' | 'vip_purchase' | 'cashout' | 'admin_treasury';
  amountPoints: number;
  amountGems: number;
  amountPHP?: number;
  description: string;
  sender: string;
  receiver: string;
}

export interface UserProfile {
  username: string;
  fullName: string;
  mobileNumber: string;
  isLoggedIn: boolean;
  isAdmin: boolean;
  pointsBalance: number;
  gemsBalance: number;
  spinTickets: number;
  inviteCount: number;
  vipDaysRemaining: number;
  isVip: boolean;
  lastCareTime?: string;
}

export interface Post {
  id: string;
  authorUsername: string;
  authorName: string;
  content: string;
  type: 'text' | 'photo' | 'video';
  mediaUrl?: string;
  createdAt: string;
  likes: number;
  shares: number;
  hasRewardedOwner: boolean;
}

export interface FarmState {
  treeLevel: number;
  treeExp: number;
  lastHarvestTime: string | null; // Is 12 Hours Cycle
  activeCareActionsCount: number; // Accelerates harvest timer
  hasChicken: boolean;
  chickenLastFed: string | null;
  chickenEggReadyAt: string | null;
  chickenCollectedEggsCount: number;
}

export interface FriendNetwork {
  username: string;
  fullName: string;
  onlineDurationMinutes: number;
  earningPowerMultiplier: number;
  socialMultiplier: number;
  isOnline: boolean;
  pointsEarned: number;
}
