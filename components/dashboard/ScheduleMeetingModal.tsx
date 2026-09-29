"use client";

import React, { useState } from 'react';
import { X, Calendar as CalendarIcon, Clock, Video } from 'lucide-react';
import { generateRoomId } from '@/lib/livekit';

export interface ScheduledMeeting {
  id: string;
  title: string;
  dateKey: string; // YYYY-MM-DD
  startTime: string;
  endTime: string;
  roomId: string;
}

interface ScheduleMeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDateKey: string;
  onSaveMeeting: (meeting: ScheduledMeeting) => void;
}

export default function ScheduleMeetingModal({
  isOpen,
  onClose,
  selectedDateKey,
  onSaveMeeting,
}: ScheduleMeetingModalProps) {
  const [title, setTitle] = useState('');
  const [dateKey, setDateKey] = useState(selectedDateKey);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('10:30');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = title.trim() || 'Team Sync';
    const newMeeting: ScheduledMeeting = {
      id: `mtg_${Date.now()}`,
      title: finalTitle,
      dateKey,
      startTime,
      endTime,
      roomId: generateRoomId(),
    };
    onSaveMeeting(newMeeting);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in text-[#1f1f1f]">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-[#e1e3e1]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#e1e3e1] mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#c2e7ff] text-[#001d35]">
              <CalendarIcon className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-normal text-[#1f1f1f]">Schedule a meeting</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#444746] hover:bg-[#f0f4f9] hover:text-[#1f1f1f] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-[#444746] mb-1.5">
              Meeting Title
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Weekly Standup, Project Review"
              className="w-full bg-[#f0f4f9] focus:bg-white border border-transparent focus:border-[#0b57d0] rounded-xl px-4 py-3 text-sm text-[#1f1f1f] placeholder-[#747775] outline-none transition-all"
            />
          </div>

          {/* Date Picker */}
          <div>
            <label className="block text-xs font-medium text-[#444746] mb-1.5">
              Date
            </label>
            <input
              type="date"
              required
              value={dateKey}
              onChange={(e) => setDateKey(e.target.value)}
              className="w-full bg-[#f0f4f9] focus:bg-white border border-transparent focus:border-[#0b57d0] rounded-xl px-4 py-2.5 text-sm text-[#1f1f1f] outline-none transition-all"
            />
          </div>

          {/* Time Row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-[#444746] mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Start Time
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-[#f0f4f9] focus:bg-white border border-transparent focus:border-[#0b57d0] rounded-xl px-4 py-2.5 text-sm text-[#1f1f1f] outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-[#444746] mb-1.5 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" /> End Time
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-[#f0f4f9] focus:bg-white border border-transparent focus:border-[#0b57d0] rounded-xl px-4 py-2.5 text-sm text-[#1f1f1f] outline-none transition-all"
              />
            </div>
          </div>

          {/* SFU Call Note */}
          <div className="p-3 rounded-xl bg-[#c2e7d6]/40 border border-[#c2e7d6] flex items-center gap-2.5 text-xs text-[#004d40]">
            <Video className="w-4 h-4 shrink-0 text-[#004d40]" />
            <span>A unique SFU meeting room link will automatically be generated for this call.</span>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full text-sm font-medium text-[#444746] hover:bg-[#f0f4f9] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-sm font-medium transition-colors shadow-xs"
            >
              Save meeting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
