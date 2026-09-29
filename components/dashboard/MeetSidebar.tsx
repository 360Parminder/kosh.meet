"use client";

import React from 'react';
import { Calendar, Phone } from 'lucide-react';

interface MeetSidebarProps {
  activeTab: 'meetings' | 'calls';
  onTabChange: (tab: 'meetings' | 'calls') => void;
}

export default function MeetSidebar({ activeTab, onTabChange }: MeetSidebarProps) {
  return (
    <aside className="w-20 sm:w-24 shrink-0 bg-white border-r border-[#e1e3e1] flex flex-col items-center py-4 select-none">
      <div className="flex flex-col items-center gap-6 w-full px-2">
        {/* Meetings Tab */}
        <button
          type="button"
          onClick={() => onTabChange('meetings')}
          className="flex flex-col items-center gap-1 group w-full cursor-pointer"
        >
          <div
            className={`w-14 h-8 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'meetings'
                ? 'bg-[#c2e7ff] text-[#001d35]'
                : 'text-[#444746] group-hover:bg-[#f0f4f9]'
            }`}
          >
            <Calendar className="w-5 h-5" />
          </div>
          <span
            className={`text-[12px] font-medium transition-colors ${
              activeTab === 'meetings' ? 'text-[#001d35] font-semibold' : 'text-[#444746]'
            }`}
          >
            Meetings
          </span>
        </button>

        {/* Calls Tab */}
        <button
          type="button"
          onClick={() => onTabChange('calls')}
          className="flex flex-col items-center gap-1 group w-full cursor-pointer"
        >
          <div
            className={`w-14 h-8 rounded-full flex items-center justify-center transition-all ${
              activeTab === 'calls'
                ? 'bg-[#c2e7ff] text-[#001d35]'
                : 'text-[#444746] group-hover:bg-[#f0f4f9]'
            }`}
          >
            <Phone className="w-5 h-5" />
          </div>
          <span
            className={`text-[12px] font-medium transition-colors ${
              activeTab === 'calls' ? 'text-[#001d35] font-semibold' : 'text-[#444746]'
            }`}
          >
            Calls
          </span>
        </button>
      </div>
    </aside>
  );
}
