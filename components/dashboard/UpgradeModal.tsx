"use client";

import React from 'react';
import { X, Check, Sparkles, Zap, Shield, HardDrive, Video } from 'lucide-react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function UpgradeModal({ isOpen, onClose }: UpgradeModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in text-[#1f1f1f]">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#e1e3e1]">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-blue-500 p-0.5 flex items-center justify-center">
              <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#0b57d0]" />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-normal text-[#1f1f1f]">Kosh Pro • 2 TB Plan</h2>
              <p className="text-xs text-[#444746]">Unlock premium Kosh Meet video capabilities</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#444746] hover:bg-[#f0f4f9] hover:text-[#1f1f1f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature List */}
        <div className="space-y-3.5 my-6">
          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#f0f4f9]/70">
            <Video className="w-5 h-5 text-[#0b57d0] shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-[#1f1f1f]">Longer group video calls</div>
              <div className="text-xs text-[#444746]">Host group video calls for up to 24 hours with zero interruptions.</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#f0f4f9]/70">
            <Zap className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-[#1f1f1f]">AI Noise Cancellation</div>
              <div className="text-xs text-[#444746]">Intelligently filters out dogs barking, typing, and background construction noise.</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#f0f4f9]/70">
            <HardDrive className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-[#1f1f1f]">2 TB Cloud Storage & Recordings</div>
              <div className="text-xs text-[#444746]">Record meetings directly to Kosh Drive with automated AI transcripts.</div>
            </div>
          </div>

          <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#f0f4f9]/70">
            <Shield className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-[#1f1f1f]">Enterprise Grade SFU Security</div>
              <div className="text-xs text-[#444746]">End-to-end encrypted selective forwarding with 1080p full HD streaming.</div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#e1e3e1]">
          <div className="text-xs text-[#444746]">
            Starting at <span className="font-semibold text-[#1f1f1f] text-sm">$9.99/mo</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-medium text-[#444746] hover:bg-[#f0f4f9]"
            >
              Maybe later
            </button>
            <button
              onClick={() => {
                alert('Plan exploration activated!');
                onClose();
              }}
              className="px-6 py-2.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-sm font-medium transition-colors shadow-xs"
            >
              Get started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
