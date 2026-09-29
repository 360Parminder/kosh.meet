"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Video,
  Plus,
  ArrowRight,
  Server,
  Zap,
  ShieldCheck,
  Radio,
  Copy,
  Check,
  Layers,
} from 'lucide-react';
import { generateRoomId, SFU_ARCHITECTURE_DETAILS } from '@/lib/livekit';

export default function Dashboard() {
  const router = useRouter();
  const [joinCode, setJoinCode] = useState('');
  const [copiedPersonal, setCopiedPersonal] = useState(false);

  const personalRoomId = 'kosh-my-room';

  const handleStartInstant = () => {
    const newRoomId = generateRoomId();
    router.push(`/room/${newRoomId}`);
  };

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    let cleaned = joinCode.trim();
    if (!cleaned) return;

    // Handle full URL pasted (e.g. http://localhost:3000/room/abc-xyz)
    if (cleaned.includes('/room/')) {
      const parts = cleaned.split('/room/');
      cleaned = parts[parts.length - 1];
    }

    router.push(`/room/${cleaned}`);
  };

  const handleCopyPersonal = () => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/room/${personalRoomId}`;
      navigator.clipboard.writeText(url);
      setCopiedPersonal(true);
      setTimeout(() => setCopiedPersonal(false), 2000);
    }
  };

  return (
    <div className="container mx-auto px-6" style={{ paddingTop: '7rem', minHeight: '85vh', paddingBottom: '4rem' }}>
      {/* Dashboard Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold border border-orange-500/30 flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-orange-400 animate-pulse" />
              SFU WebRTC Engine
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Meeting Dashboard
          </h1>
          <p className="text-white/70 text-sm sm:text-base mt-1">
            Ultra-low latency audio & video powered by Selective Forwarding Unit architecture.
          </p>
        </div>

        {/* Start Instant Meeting Button */}
        <button
          onClick={handleStartInstant}
          className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold px-6 py-3.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-orange-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer self-start md:self-auto text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Instant Meeting</span>
        </button>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
        {/* Quick Action: Join with Code */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 bg-black/40 border border-white/15">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Join a Meeting</h2>
              <p className="text-xs text-white/60">Enter a room code or meeting link to connect</p>
            </div>
          </div>

          <form onSubmit={handleJoinByCode} className="space-y-3">
            <div className="relative">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                placeholder="e.g. abc-defg-hij or paste room link"
                className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm font-medium pr-28"
              />
              <button
                type="submit"
                disabled={!joinCode.trim()}
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 rounded-lg bg-white text-black font-semibold text-xs hover:bg-neutral-200 disabled:opacity-40 transition-all flex items-center gap-1 cursor-pointer"
              >
                <span>Join</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>

          {/* Personal Meeting Room Link */}
          <div className="mt-6 pt-5 border-t border-white/10 flex items-center justify-between text-xs">
            <div className="text-white/70">
              <div className="font-semibold text-white">Personal Meeting Room</div>
              <div className="font-mono text-white/50 text-[11px] truncate">{personalRoomId}</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyPersonal}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors"
                title="Copy personal link"
              >
                {copiedPersonal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => router.push(`/room/${personalRoomId}`)}
                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors"
              >
                Start
              </button>
            </div>
          </div>
        </div>

        {/* SFU Architecture Snapshot */}
        <div className="lg:col-span-6 glass-panel rounded-2xl p-6 bg-black/40 border border-white/15">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">SFU Architecture Status</h2>
              <p className="text-xs text-white/60">LiveKit Selective Forwarding Unit</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/80">
                <Layers className="w-4 h-4 text-orange-400" />
                <span>Media Routing Topology</span>
              </div>
              <span className="font-semibold text-emerald-400">Single Uplink (O(1))</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/80">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Transcoding Overhead</span>
              </div>
              <span className="font-semibold text-white">Zero (Packet Forwarding)</span>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2 text-white/80">
                <ShieldCheck className="w-4 h-4 text-blue-400" />
                <span>Signaling & Cryptography</span>
              </div>
              <span className="font-semibold text-white">JWT Access Grants</span>
            </div>
          </div>

          <p className="mt-4 text-[11px] text-white/60 leading-relaxed">
            {SFU_ARCHITECTURE_DETAILS.description}
          </p>
        </div>
      </div>

      {/* Architecture Highlights Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-orange-400" /> Scalable Calls
          </h3>
          <p className="text-xs text-white/70">
            Unlike peer-to-peer mesh which crashes beyond 4 users, SFU smoothly handles 50+ participants.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-emerald-400" /> Adaptive Simulcast
          </h3>
          <p className="text-xs text-white/70">
            Dynamically sends multiple video resolutions so users on weak connections still receive smooth video.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-xl bg-white/5 border border-white/10">
          <h3 className="text-sm font-semibold text-white mb-1 flex items-center gap-1.5">
            <Server className="w-4 h-4 text-amber-400" /> Flexible Backend
          </h3>
          <p className="text-xs text-white/70">
            Ready to connect to LiveKit Cloud or a self-hosted Docker container in 1 line of config.
          </p>
        </div>
      </div>
    </div>
  );
}
