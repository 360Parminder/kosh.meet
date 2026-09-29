"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Keyboard,
  Video,
  Plus,
  Link as LinkIcon,
  Calendar,
  HelpCircle,
  Settings,
  Grip,
} from 'lucide-react';

interface MeetTopNavProps {
  onStartInstant: () => void;
  onCreateLater: () => void;
  onSchedule: () => void;
  onOpenSettings: () => void;
  onOpenUpgrade: () => void;
  onJoinCode: (code: string) => void;
}

export default function MeetTopNav({
  onStartInstant,
  onCreateLater,
  onSchedule,
  onOpenSettings,
  onOpenUpgrade,
  onJoinCode,
}: MeetTopNavProps) {
  const [code, setCode] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleJoinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim()) {
      onJoinCode(code.trim());
    }
  };

  return (
    <header className="h-16 w-full px-4 md:px-6 flex items-center justify-between border-b border-[#e1e3e1] bg-white text-[#1f1f1f] shrink-0 sticky top-0 z-30">
      {/* Left: Google Meet Logo & Wordmark */}
      <div className="flex items-center gap-3">
        <Link href="/" className="flex items-center gap-2.5 no-underline group select-none">
          {/* Authentic Google Meet Camera Icon */}
          <div className="w-10 h-8 flex items-center justify-center relative">
            <svg viewBox="0 0 87.3 78" className="w-9 h-8">
              <path
                d="m43.7 0c-8.9 0-16.1 7.2-16.1 16.1v4.7l16.1 12 16.1-12v-4.7c0-8.9-7.2-16.1-16.1-16.1z"
                fill="#00832d"
              />
              <path
                d="m43.7 32.8-16.1-12v26.9l16.1 12 16.1-12v-26.9z"
                fill="#0066da"
              />
              <path
                d="m27.6 47.7v14.2c0 8.9 7.2 16.1 16.1 16.1s16.1-7.2 16.1-16.1v-14.2l-16.1 12z"
                fill="#e53935"
              />
              <path
                d="m59.8 20.8 27.5-20.8v78l-27.5-20.8z"
                fill="#ffb700"
              />
            </svg>
          </div>

          <span className="text-[21px] font-normal tracking-tight text-[#444746] font-sans">
            Google <span className="font-normal text-[#1f1f1f]">Meet</span>
          </span>
        </Link>
      </div>

      {/* Center: Search / Code Pill & New Meeting Button */}
      <div className="flex items-center gap-3 flex-1 max-w-xl mx-4 sm:mx-8 justify-center">
        {/* Code / Link Input Pill */}
        <form
          onSubmit={handleJoinSubmit}
          className="flex items-center bg-[#f0f4f9] hover:bg-[#e9eef6] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#0b57d0] focus-within:shadow-md transition-all rounded-full h-11 px-4 flex-1 max-w-md border border-transparent focus-within:border-transparent"
        >
          <Keyboard className="w-5 h-5 text-[#5f6368] mr-2.5 shrink-0" />
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter a code or link"
            className="w-full bg-transparent border-none outline-none text-[#1f1f1f] placeholder-[#747775] text-sm font-normal"
          />
          <button
            type="submit"
            disabled={!code.trim()}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ml-1 shrink-0 ${
              code.trim()
                ? 'bg-[#0b57d0] text-white hover:bg-[#0842a0] cursor-pointer shadow-xs'
                : 'text-[#8e918f] cursor-default bg-transparent'
            }`}
          >
            Join
          </button>
        </form>

        {/* Mint Green "+ New" Button & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsDropdownOpen((prev) => !prev)}
            className="h-11 px-4 bg-[#c2e7d6] hover:bg-[#b0d8c4] active:bg-[#a0cbb5] text-[#002116] rounded-full font-medium text-sm flex items-center gap-2 transition-all shadow-xs cursor-pointer select-none"
          >
            <div className="relative flex items-center justify-center">
              <Video className="w-4 h-4 fill-current text-[#002116]" />
              <Plus className="w-2.5 h-2.5 absolute -top-1 -right-1.5 stroke-[3]" />
            </div>
            <span>New</span>
          </button>

          {/* Google Meet Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute left-0 sm:right-0 sm:left-auto top-13 w-64 bg-white rounded-2xl shadow-xl border border-[#e1e3e1] py-2 z-50 animate-fade-in text-[#1f1f1f]">
              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  onCreateLater();
                }}
                className="w-full px-4 py-3 flex items-center gap-3.5 hover:bg-[#f0f4f9] text-left transition-colors cursor-pointer"
              >
                <LinkIcon className="w-5 h-5 text-[#444746]" />
                <span className="text-sm font-normal text-[#1f1f1f]">Create a meeting for later</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  onStartInstant();
                }}
                className="w-full px-4 py-3 flex items-center gap-3.5 hover:bg-[#f0f4f9] text-left transition-colors cursor-pointer"
              >
                <div className="relative flex items-center justify-center">
                  <Video className="w-5 h-5 text-[#444746]" />
                  <Plus className="w-3 h-3 text-[#444746] absolute -top-1 -right-1" />
                </div>
                <span className="text-sm font-normal text-[#1f1f1f]">Start an instant meeting</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  onSchedule();
                }}
                className="w-full px-4 py-3 flex items-center gap-3.5 hover:bg-[#f0f4f9] text-left transition-colors cursor-pointer"
              >
                <Calendar className="w-5 h-5 text-[#444746]" />
                <span className="text-sm font-normal text-[#1f1f1f]">Schedule in Calendar</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Right: Actions, Upgrade Button & Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Help Circle */}
        <button
          type="button"
          onClick={() => alert('Kosh Meet: Powered by SFU WebRTC architecture for low latency.')}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#f0f4f9] hover:text-[#1f1f1f] transition-colors"
          title="Support & Feedback"
        >
          <HelpCircle className="w-5 h-5" />
        </button>

        {/* Settings Icon */}
        <button
          type="button"
          onClick={onOpenSettings}
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#f0f4f9] hover:text-[#1f1f1f] transition-colors"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        {/* Upgrade Pill Button */}
        <button
          type="button"
          onClick={onOpenUpgrade}
          className="bg-[#d3e3fd] hover:bg-[#c2d7fc] active:bg-[#b1cbfb] text-[#041e49] text-sm font-medium px-4 py-2 rounded-full transition-colors ml-1 hidden sm:flex items-center cursor-pointer"
        >
          Upgrade
        </button>

        {/* Google Apps 9-Dot Menu */}
        <button
          type="button"
          className="w-10 h-10 rounded-full flex items-center justify-center text-[#5f6368] hover:bg-[#f0f4f9] hover:text-[#1f1f1f] transition-colors"
          title="Google apps"
        >
          <Grip className="w-5 h-5" />
        </button>

        {/* User Profile Avatar */}
        <div className="ml-1">
          <div
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#3e2723] to-[#5d4037] border border-white shadow-xs flex items-center justify-center text-white font-semibold text-sm cursor-pointer select-none ring-2 ring-transparent hover:ring-[#d3e3fd]"
            title="Google Account"
          >
            P
          </div>
        </div>
      </div>
    </header>
  );
}
