"use client";

import React from 'react';
import {
  X,
  Server,
  Zap,
  ArrowRight,
  ShieldCheck,
  Activity,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { SFU_ARCHITECTURE_DETAILS } from '@/lib/livekit';

interface SfuInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  serverUrl?: string;
  roomId: string;
  participantCount: number;
}

export default function SfuInfoModal({
  isOpen,
  onClose,
  serverUrl,
  roomId,
  participantCount,
}: SfuInfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl bg-neutral-900 border border-white/20 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 text-white">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">SFU Architecture</h2>
              <p className="text-xs text-white/60">Selective Forwarding Unit • LiveKit Engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm">
          {/* Real-time Session State */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs text-white/50 mb-1">Room ID</div>
              <div className="font-mono font-medium text-white text-xs truncate">{roomId}</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs text-white/50 mb-1">Active Peers</div>
              <div className="font-semibold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {participantCount} connected
              </div>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="text-xs text-white/50 mb-1">SFU Server</div>
              <div className="font-mono font-medium text-orange-400 text-xs truncate">
                {serverUrl || 'LiveKit Server'}
              </div>
            </div>
          </div>

          {/* Topology Visualizer */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/10">
            <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-400" />
              Stream Routing Topology
            </h3>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 px-2">
              {/* Client Box */}
              <div className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/15 w-full sm:w-1/3 text-center">
                <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xs mb-1">
                  YOU
                </div>
                <div className="text-xs font-medium text-white">Your Client</div>
                <div className="text-[10px] text-emerald-400 mt-1">1 Upload Stream (O(1))</div>
              </div>

              {/* Arrow */}
              <div className="hidden sm:flex flex-col items-center text-white/40 text-xs">
                <span>RTP Media</span>
                <ArrowRight className="w-5 h-5 text-orange-400 my-1 animate-pulse" />
                <span className="text-[10px] text-white/50">Zero Re-encode</span>
              </div>

              {/* Central SFU */}
              <div className="flex flex-col items-center p-3.5 rounded-xl bg-gradient-to-b from-orange-500/20 to-neutral-800 border border-orange-500/40 w-full sm:w-1/3 text-center relative shadow-lg">
                <div className="absolute -top-2 bg-orange-500 text-black text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full">
                  SFU Server
                </div>
                <Server className="w-8 h-8 text-orange-400 mt-1 mb-1" />
                <div className="text-xs font-semibold text-white">LiveKit SFU</div>
                <div className="text-[10px] text-white/60 mt-0.5">Selective Routing</div>
              </div>

              {/* Arrow */}
              <div className="hidden sm:flex flex-col items-center text-white/40 text-xs">
                <span>Distribute</span>
                <ArrowRight className="w-5 h-5 text-emerald-400 my-1 animate-pulse" />
                <span className="text-[10px] text-white/50">Subscribers</span>
              </div>

              {/* Other Peers */}
              <div className="flex flex-col items-center p-3 rounded-xl bg-white/5 border border-white/15 w-full sm:w-1/3 text-center">
                <div className="w-9 h-9 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs mb-1">
                  N
                </div>
                <div className="text-xs font-medium text-white">Participants</div>
                <div className="text-[10px] text-blue-300 mt-1">Selective Downlinks</div>
              </div>
            </div>
          </div>

          {/* Why SFU vs Mesh vs MCU */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              Why SFU Architecture?
            </h3>
            <p className="text-xs text-white/80 leading-relaxed">
              {SFU_ARCHITECTURE_DETAILS.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
              {SFU_ARCHITECTURE_DETAILS.benefits.map((benefit, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 p-2.5 rounded-lg bg-white/5 border border-white/10 text-xs text-white/80"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end px-6 py-4 border-t border-white/10 bg-white/5">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white text-black font-semibold text-xs hover:bg-neutral-200 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}
