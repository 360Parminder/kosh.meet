"use client";

import React, { useState } from 'react';
import { X, Mic, Video, Server, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<'audio' | 'video' | 'sfu'>('audio');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in text-[#1f1f1f]">
      <div className="relative w-full max-w-xl bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#e1e3e1]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e1e3e1] mb-6">
          <h2 className="text-xl font-normal text-[#1f1f1f]">Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#444746] hover:bg-[#f0f4f9] hover:text-[#1f1f1f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-[#e1e3e1] pb-3 mb-6">
          <button
            onClick={() => setActiveTab('audio')}
            className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 transition-all ${
              activeTab === 'audio'
                ? 'bg-[#c2e7ff] text-[#001d35]'
                : 'text-[#444746] hover:bg-[#f0f4f9]'
            }`}
          >
            <Mic className="w-4 h-4" /> Audio
          </button>
          <button
            onClick={() => setActiveTab('video')}
            className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 transition-all ${
              activeTab === 'video'
                ? 'bg-[#c2e7ff] text-[#001d35]'
                : 'text-[#444746] hover:bg-[#f0f4f9]'
            }`}
          >
            <Video className="w-4 h-4" /> Video
          </button>
          <button
            onClick={() => setActiveTab('sfu')}
            className={`px-4 py-2 rounded-full text-xs font-medium flex items-center gap-2 transition-all ${
              activeTab === 'sfu'
                ? 'bg-[#c2e7ff] text-[#001d35]'
                : 'text-[#444746] hover:bg-[#f0f4f9]'
            }`}
          >
            <Server className="w-4 h-4" /> SFU Architecture
          </button>
        </div>

        {/* Tab Content */}
        <div className="min-h-[220px]">
          {activeTab === 'audio' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#444746] mb-1.5">Microphone</label>
                <select className="w-full bg-[#f0f4f9] border border-transparent focus:border-[#0b57d0] rounded-xl px-4 py-2.5 text-sm text-[#1f1f1f] outline-none">
                  <option>Default - Internal Microphone (Built-in)</option>
                  <option>Communications - Headset Audio</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#444746] mb-1.5">Speakers</label>
                <select className="w-full bg-[#f0f4f9] border border-transparent focus:border-[#0b57d0] rounded-xl px-4 py-2.5 text-sm text-[#1f1f1f] outline-none">
                  <option>Default - Internal Speakers (Built-in)</option>
                  <option>Headphones (Stereo)</option>
                </select>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Microphone & Speaker diagnostics normal</span>
              </div>
            </div>
          )}

          {activeTab === 'video' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#444746] mb-1.5">Camera</label>
                <select className="w-full bg-[#f0f4f9] border border-transparent focus:border-[#0b57d0] rounded-xl px-4 py-2.5 text-sm text-[#1f1f1f] outline-none">
                  <option>FaceTime HD Camera (Built-in)</option>
                  <option>Virtual Camera Device</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#444746] mb-1.5">Resolution</label>
                <select className="w-full bg-[#f0f4f9] border border-transparent focus:border-[#0b57d0] rounded-xl px-4 py-2.5 text-sm text-[#1f1f1f] outline-none">
                  <option>High Definition (720p)</option>
                  <option>Full HD (1080p) - SFU Simulcast</option>
                  <option>Standard Definition (360p)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'sfu' && (
            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-[#f0f4f9] border border-[#e1e3e1]">
                <div className="font-semibold text-[#1f1f1f] mb-1">Architecture Engine</div>
                <div className="text-[#444746]">LiveKit WebRTC Selective Forwarding Unit (SFU)</div>
              </div>
              <div className="p-3 rounded-xl bg-[#f0f4f9] border border-[#e1e3e1]">
                <div className="font-semibold text-[#1f1f1f] mb-1">Routing Strategy</div>
                <div className="text-[#444746]">Single uplink publish (O(1)), dynamic selective downlink distribution.</div>
              </div>
              <div className="p-3 rounded-xl bg-[#f0f4f9] border border-[#e1e3e1]">
                <div className="font-semibold text-[#1f1f1f] mb-1">Server Endpoint</div>
                <div className="font-mono text-[#0b57d0]">ws://127.0.0.1:7880 / LiveKit Cloud</div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-4 border-t border-[#e1e3e1] mt-6">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-sm font-medium transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
