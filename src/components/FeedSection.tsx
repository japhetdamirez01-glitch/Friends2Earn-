/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Send, Image, Video, Share2, Heart, Award, Sparkles, Check, MessageSquare, ExternalLink } from 'lucide-react';
import { Post, Transaction } from '../types';

interface FeedSectionProps {
  userUsername: string;
  userName: string;
  adminBalance: number;
  onPostCreated: (postContent: string, postType: 'text' | 'photo' | 'video', mediaUrl?: string) => void;
  posts: Post[];
  onShareIncentive: (postId: string, platform: string) => void;
}

export default function FeedSection({
  userUsername,
  userName,
  adminBalance,
  onPostCreated,
  posts,
  onShareIncentive,
}: FeedSectionProps) {
  const [postContent, setPostContent] = useState('');
  const [postType, setPostType] = useState<'text' | 'photo' | 'video'>('text');
  const [mediaUrl, setMediaUrl] = useState('');
  const [showMediaInput, setShowMediaInput] = useState(false);
  const [activeShareTrayId, setActiveShareTrayId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSubmitPost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim()) return;

    onPostCreated(postContent, postType, mediaUrl || undefined);
    setPostContent('');
    setMediaUrl('');
    setShowMediaInput(false);
  };

  const handleShareClick = (postId: string, platform: string) => {
    onShareIncentive(postId, platform);
    setActiveShareTrayId(null);
    setCopiedId(postId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto selection:bg-emerald-500/20 pb-16">
      {/* Post Publisher Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
        <form onSubmit={handleSubmitPost} className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-850">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-xs font-bold text-slate-350">
                Create Earning Post (5K Rule Active)
              </span>
            </div>
            <div className="text-[10px] text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
              ₱0.20 Reward per post
            </div>
          </div>

          <textarea
            placeholder="Share what is on your mind... Use #Friends2Earn hashtag for +100 bonus points!"
            value={postContent}
            onChange={(e) => setPostContent(e.target.value)}
            className="w-full min-h-[80px] bg-slate-950 border border-slate-800/80 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
            rows={3}
          />

          {showMediaInput && (
            <div className="space-y-1 animate-fade-in">
              <label className="text-[10px] text-slate-400 font-semibold uppercase">Media URL Address</label>
              <input
                type="text"
                placeholder="https://images.unsplash.com/photo-..."
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          )}

          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setPostType('text');
                  setShowMediaInput(false);
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                  postType === 'text' && !showMediaInput
                    ? 'bg-slate-850 text-emerald-400 border border-slate-750'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Text
              </button>
              <button
                type="button"
                onClick={() => {
                  setPostType('photo');
                  setShowMediaInput(true);
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                  postType === 'photo'
                    ? 'bg-slate-850 text-emerald-400 border border-slate-755'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Image className="w-3.5 h-3.5" />
                Photo
              </button>
              <button
                type="button"
                onClick={() => {
                  setPostType('video');
                  setShowMediaInput(true);
                }}
                className={`py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1 ${
                  postType === 'video'
                    ? 'bg-slate-850 text-emerald-400 border border-slate-755'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                Video
              </button>
            </div>

            <button
              type="submit"
              disabled={!postContent.trim()}
              className="py-2 px-4 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1 transition-transform active:scale-98"
            >
              <Send className="w-3 h-3" />
              Publish Post
            </button>
          </div>
        </form>
      </div>

      {/* Feed Stream */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg hover:border-slate-750 transition-colors">
            {/* Header of Post */}
            <div className="p-4 flex items-center justify-between border-b border-slate-850">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-200 font-extrabold flex items-center justify-center text-xs border border-slate-700 select-none uppercase">
                  {post.authorName[0]}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                    {post.authorName}
                    <span className="text-[9px] font-mono bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-1.5 py-0.2 rounded font-normal">
                      Verified User
                    </span>
                  </h3>
                  <p className="text-[10px] text-slate-500 font-medium">
                    {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Active Earn Link
                  </p>
                </div>
              </div>

              {/* Instant 5K payout ticker label */}
              <div className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 bg-emerald-950/20 px-2.5 py-1 rounded-lg border border-emerald-500/10 hover:bg-emerald-950/50 transition-colors">
                <Award className="w-3.5 h-3.5 text-amber-400" />
                <span>+5,000 Points Paid</span>
              </div>
            </div>

            {/* Post Content */}
            <div className="p-4 space-y-3">
              <p className="text-xs text-slate-100 leading-relaxed whitespace-pre-wrap select-text">
                {post.content.split(' ').map((word, i) => {
                  if (word.startsWith('#')) {
                    return <span key={i} className="text-emerald-400 font-bold bg-emerald-950/30 px-1 rounded">{word} </span>;
                  }
                  return word + ' ';
                })}
              </p>

              {/* Photo Display */}
              {post.type === 'photo' && post.mediaUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950/80 max-h-80 flex items-center justify-center">
                  <img
                    referrerPolicy="no-referrer"
                    src={post.mediaUrl}
                    alt="Shared asset"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      // fallback for invalid user images
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1516259762381-22954d7d3ad2?w=800&auto=format&fit=crop&q=60';
                    }}
                  />
                </div>
              )}

              {/* Video Display */}
              {post.type === 'video' && post.mediaUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative aspect-video flex items-center justify-center">
                  {/* Interactive Video simulated card */}
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center">
                    <span className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-lg cursor-pointer flex items-center justify-center font-extrabold text-sm transition-transform hover:scale-105">
                      ▶
                    </span>
                  </div>
                  <img
                    referrerPolicy="no-referrer"
                    src={post.mediaUrl}
                    alt="Video thumbnail"
                    className="object-cover w-full h-full opacity-60"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1536240478700-b869070f9279?w=800&auto=format&fit=crop&q=60';
                    }}
                  />
                </div>
              )}
            </div>

            {/* Post Interactions Panel */}
            <div className="px-4 py-3 bg-slate-950 border-t border-slate-850 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => post.likes++}
                  className="hover:text-amber-400 flex items-center gap-1.5 font-semibold"
                >
                  <Heart className="w-4 h-4 text-slate-500 hover:text-amber-400 transition-colors" />
                  <span>{post.likes} Upvotes</span>
                </button>
                <div className="flex items-center gap-1.5 font-semibold">
                  <MessageSquare className="w-4 h-4 text-slate-500" />
                  <span>Comments disabled (VIP Safe)</span>
                </div>
              </div>

              {/* Share Drawer Trigger */}
              <div className="relative">
                <button
                  onClick={() => setActiveShareTrayId(activeShareTrayId === post.id ? null : post.id)}
                  className="hover:text-emerald-400 text-slate-300 flex items-center gap-1.5 font-bold bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl transition-all"
                >
                  <Share2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Share (+10 pts)</span>
                </button>

                {/* Simulated External Share Tray */}
                {activeShareTrayId === post.id && (
                  <div className="absolute right-0 bottom-full mb-2 z-50 w-52 bg-slate-900 border border-slate-850 rounded-xl p-2 shadow-2xl space-y-1 text-xs">
                    <p className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-500 px-2 py-1 border-b border-slate-850 mb-1">
                      Cross-Platform Share
                    </p>
                    <button
                      onClick={() => handleShareClick(post.id, 'Facebook')}
                      className="w-full text-left font-medium p-1.5 text-slate-200 hover:bg-slate-800 rounded flex items-center gap-1.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      Facebook Feed
                    </button>
                    <button
                      onClick={() => handleShareClick(post.id, 'Messenger')}
                      className="w-full text-left font-medium p-1.5 text-slate-200 hover:bg-slate-800 rounded flex items-center gap-1.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-500" />
                      Messenger Direct
                    </button>
                    <button
                      onClick={() => handleShareClick(post.id, 'Viber')}
                      className="w-full text-left font-medium p-1.5 text-slate-200 hover:bg-slate-800 rounded flex items-center gap-1.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-purple-500" />
                      Viber Group
                    </button>
                    <button
                      onClick={() => handleShareClick(post.id, 'Clipboard Link')}
                      className="w-full text-left font-semibold p-1.5 text-slate-250 hover:bg-slate-800 rounded flex items-center justify-between text-emerald-400"
                    >
                      <span className="flex items-center gap-1.5">
                        <ExternalLink className="w-3.5 h-3.5" />
                        Copy App Invitation
                      </span>
                    </button>
                  </div>
                )}

                {copiedId === post.id && (
                  <div className="absolute right-0 bottom-full mb-2 bg-emerald-500 text-slate-950 px-3 py-1 rounded-md font-bold text-[10px] shadow-lg animate-bounce duration-500">
                    Share Recorded! +10 Points Credited
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
