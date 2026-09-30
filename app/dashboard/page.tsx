"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Video,
  Plus,
  Clock,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';
import MeetTopNav from '@/components/dashboard/MeetTopNav';
import MeetSidebar from '@/components/dashboard/MeetSidebar';
import MeetingEmptyIllustration from '@/components/dashboard/MeetingEmptyIllustration';
import MeetingLinkModal from '@/components/dashboard/MeetingLinkModal';
import ScheduleMeetingModal, { ScheduledMeeting } from '@/components/dashboard/ScheduleMeetingModal';
import UpgradeModal from '@/components/dashboard/UpgradeModal';
import SettingsModal from '@/components/dashboard/SettingsModal';
import { generateRoomId } from '@/lib/livekit';

interface WeekDayItem {
  name: string; // "MON", "TUE", etc.
  dayNumber: number; // 28, 29, 30, 1, etc.
  dateKey: string; // "2026-09-29"
  fullLabel: string; // "Tue 29 Sept"
}

export default function DashboardPage() {
  const router = useRouter();

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'meetings' | 'calls'>('meetings');

  // Calendar week offset (0 = current week, -1 = last week, 1 = next week)
  const [weekOffset, setWeekOffset] = useState(0);

  // Selected date key
  const [selectedDateKey, setSelectedDateKey] = useState<string>('2026-09-29');

  // Modals state
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [createdRoomId, setCreatedRoomId] = useState('');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Authentication state
  const [currentUser, setCurrentUser] = useState<{ id: string; name: string; email: string; avatar?: string } | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Scheduled meetings
  const [meetings, setMeetings] = useState<ScheduledMeeting[]>([]);
  const [copiedMeetingId, setCopiedMeetingId] = useState<string | null>(null);

  // Verify authentication on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.authenticated && data.user) {
          if (typeof window !== 'undefined') {
            localStorage.setItem('kosh_meet_user', JSON.stringify(data.user));
            localStorage.setItem('kosh_meet_username', data.user.name || data.user.username);
          }
          setCurrentUser(data.user);
          setAuthLoading(false);
          return;
        }
      } catch (e) {
        console.warn('Auth check deferred:', e);
      }

      // Check localStorage fallback
      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('kosh_meet_user');
        if (saved) {
          try {
            setCurrentUser(JSON.parse(saved));
            setAuthLoading(false);
            return;
          } catch (e) {}
        }
      }

      // If neither, redirect to login
      router.push('/login');
    }

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {}
    if (typeof window !== 'undefined') {
      localStorage.removeItem('kosh_meet_user');
    }
    router.push('/login');
  };

  // Load saved meetings on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('kosh_meet_scheduled');
      if (saved) {
        try {
          setMeetings(JSON.parse(saved));
        } catch (e) {
          console.error('Failed to parse scheduled meetings:', e);
        }
      }
    }
  }, []);

  // Save meetings to localStorage
  const saveMeetings = (updated: ScheduledMeeting[]) => {
    setMeetings(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('kosh_meet_scheduled', JSON.stringify(updated));
    }
  };

  // Generate current week days based on base date Tuesday Sep 29, 2026 + weekOffset
  const getWeekDays = (offset: number): WeekDayItem[] => {
    // Reference date: Tue Sep 29, 2026
    const baseDate = new Date(2026, 8, 29); // Month is 0-indexed (8 = September)
    const baseDayOfWeek = baseDate.getDay(); // 2 for Tuesday

    // Find Monday of the base week
    const monday = new Date(baseDate);
    monday.setDate(baseDate.getDate() - (baseDayOfWeek === 0 ? 6 : baseDayOfWeek - 1) + offset * 7);

    const weekDays: WeekDayItem[] = [];
    const dayNames = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const fullDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 0; i < 7; i++) {
      const current = new Date(monday);
      current.setDate(monday.getDate() + i);

      const dayNumber = current.getDate();
      const monthIndex = current.getMonth();
      const year = current.getFullYear();
      const dateKey = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(dayNumber).padStart(2, '0')}`;
      const fullLabel = `${fullDayNames[current.getDay()]} ${dayNumber} ${monthNames[monthIndex]}`;

      weekDays.push({
        name: dayNames[i],
        dayNumber,
        dateKey,
        fullLabel,
      });
    }

    return weekDays;
  };

  const currentWeekDays = getWeekDays(weekOffset);
  const selectedDayObj = currentWeekDays.find((d) => d.dateKey === selectedDateKey) || currentWeekDays[1] || currentWeekDays[0];

  // Load meetings from Prisma backend (with localStorage cache fallback)
  useEffect(() => {
    let isMounted = true;
    async function fetchMeetings() {
      try {
        const res = await fetch(`/api/meetings?dateKey=${selectedDayObj.dateKey}`);
        const data = await res.json();
        if (isMounted && data.success && Array.isArray(data.meetings)) {
          const mapped: ScheduledMeeting[] = data.meetings.map((m: {
            id: string;
            title: string;
            dateKey: string;
            startTime: string;
            endTime: string;
            roomCode: string;
          }) => ({
            id: m.id,
            title: m.title,
            dateKey: m.dateKey,
            startTime: m.startTime,
            endTime: m.endTime,
            roomId: m.roomCode,
          }));

          setMeetings((prev) => {
            // Keep any other days and update selected day
            const otherDays = prev.filter((item) => item.dateKey !== selectedDayObj.dateKey);
            return [...otherDays, ...mapped];
          });
        }
      } catch (err) {
        console.warn('Prisma API fetch deferred, using cached meetings:', err);
      }
    }

    fetchMeetings();
    return () => {
      isMounted = false;
    };
  }, [selectedDayObj.dateKey]);

  // Actions
  const handleStartInstant = async () => {
    const newRoomId = generateRoomId();
    try {
      await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Instant Meeting',
          roomCode: newRoomId,
          type: 'INSTANT',
          dateKey: selectedDayObj.dateKey,
        }),
      });
    } catch (e) {
      console.warn('Instant meeting DB sync deferred:', e);
    }
    router.push(`/room/${newRoomId}`);
  };

  const handleCreateLater = async () => {
    const newRoomId = generateRoomId();
    setCreatedRoomId(newRoomId);
    setIsLinkModalOpen(true);
    try {
      await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Meeting for Later',
          roomCode: newRoomId,
          type: 'LATER',
          dateKey: selectedDayObj.dateKey,
        }),
      });
    } catch (e) {
      console.warn('Meeting for later DB sync deferred:', e);
    }
  };

  const handleSchedule = () => {
    setIsScheduleModalOpen(true);
  };

  const handleJoinCode = (rawCode: string) => {
    let clean = rawCode.trim();
    if (clean.includes('/room/')) {
      const parts = clean.split('/room/');
      clean = parts[parts.length - 1];
    }
    router.push(`/room/${clean}`);
  };

  const handleSaveScheduled = async (newMtg: ScheduledMeeting) => {
    // Optimistic UI update
    const updated = [...meetings, newMtg];
    saveMeetings(updated);

    try {
      const res = await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newMtg.title,
          roomCode: newMtg.roomId,
          dateKey: newMtg.dateKey,
          startTime: newMtg.startTime,
          endTime: newMtg.endTime,
          type: 'SCHEDULED',
        }),
      });
      const data = await res.json();
      if (data.success && data.meeting) {
        // Update with server ID
        setMeetings((prev) =>
          prev.map((m) => (m.id === newMtg.id ? { ...m, id: data.meeting.id } : m))
        );
      }
    } catch (e) {
      console.warn('Meeting save to Prisma deferred:', e);
    }
  };

  const handleDeleteMeeting = async (id: string) => {
    // Optimistic UI update
    const updated = meetings.filter((m) => m.id !== id);
    saveMeetings(updated);

    try {
      await fetch(`/api/meetings/${id}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Meeting delete in Prisma deferred:', e);
    }
  };

  const handleCopyMeetingLink = (roomId: string, id: string) => {
    if (typeof window !== 'undefined') {
      const link = `${window.location.origin}/room/${roomId}`;
      navigator.clipboard.writeText(link);
      setCopiedMeetingId(id);
      setTimeout(() => setCopiedMeetingId(null), 2000);
    }
  };

  // Filter meetings for the selected day
  const meetingsForSelectedDay = meetings.filter((m) => m.dateKey === selectedDayObj.dateKey);

  return (
    <div className="relative z-50 min-h-screen w-full bg-white text-[#1f1f1f] flex flex-col font-sans select-none antialiased">
      {/* Modals */}
      <MeetingLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        roomId={createdRoomId}
      />
      <ScheduleMeetingModal
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        selectedDateKey={selectedDayObj.dateKey}
        onSaveMeeting={handleSaveScheduled}
      />
      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />

      {/* Top Navigation Bar */}
      <MeetTopNav
        onStartInstant={handleStartInstant}
        onCreateLater={handleCreateLater}
        onSchedule={handleSchedule}
        onOpenSettings={() => setIsSettingsModalOpen(true)}
        onOpenUpgrade={() => setIsUpgradeModalOpen(true)}
        onJoinCode={handleJoinCode}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Meetings / Calls) */}
        <MeetSidebar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Center Content Body */}
        <main className="flex-1 overflow-y-auto px-6 sm:px-10 lg:px-16 py-6 md:py-8 flex flex-col max-w-6xl mx-auto w-full">
          {activeTab === 'meetings' ? (
            <>
              {/* Row 1: Date Title & Calendar Strip */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                {/* Left: Date Title */}
                <div className="flex items-center gap-2 text-[#1f1f1f]">
                  <h1 className="text-xl sm:text-2xl font-normal tracking-tight">
                    {selectedDayObj.fullLabel}
                  </h1>
                  <button
                    type="button"
                    onClick={() => setIsScheduleModalOpen(true)}
                    className="p-1 rounded-full text-[#444746] hover:bg-[#f0f4f9] hover:text-[#1f1f1f] transition-colors"
                    title="Open calendar picker"
                  >
                    <CalendarIcon className="w-5 h-5" />
                  </button>
                </div>

                {/* Right: Weekday Navigation Strip */}
                <div className="flex items-center gap-1 sm:gap-2">
                  {/* Previous Week Chevron */}
                  <button
                    type="button"
                    onClick={() => setWeekOffset((prev) => prev - 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#444746] hover:bg-[#f0f4f9] transition-colors"
                    title="Previous week"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {/* Day Columns */}
                  <div className="flex items-center gap-1">
                    {currentWeekDays.map((day) => {
                      const isSelected = day.dateKey === selectedDayObj.dateKey;
                      return (
                        <button
                          key={day.dateKey}
                          type="button"
                          onClick={() => setSelectedDateKey(day.dateKey)}
                          className={`flex flex-col items-center justify-center min-w-10 sm:min-w-12 py-1 px-1.5 rounded-full sm:rounded-2xl transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#c2e7ff] text-[#001d35] font-semibold'
                              : 'text-[#444746] hover:bg-[#f0f4f9]'
                          }`}
                        >
                          <span className="text-[10px] sm:text-[11px] font-medium tracking-wider">
                            {day.name}
                          </span>
                          <span
                            className={`text-sm sm:text-base mt-0.5 ${
                              isSelected ? 'font-bold text-[#001d35]' : 'font-normal text-[#1f1f1f]'
                            }`}
                          >
                            {day.dayNumber}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Next Week Chevron */}
                  <button
                    type="button"
                    onClick={() => setWeekOffset((prev) => prev + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[#444746] hover:bg-[#f0f4f9] transition-colors"
                    title="Next week"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Row 2: Premium Meet Features Promo Banner */}
              <div className="w-full border border-[#e1e3e1] rounded-2xl p-4 sm:p-5 bg-white shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                {/* Left: Pro badge & text */}
                <div className="flex items-center gap-3.5">
                  {/* Pro Circle Icon */}
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-yellow-400 via-red-500 to-blue-500 p-0.5 flex items-center justify-center shrink-0">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[#0b57d0] font-bold text-xs">
                      <Sparkles className="w-4 h-4" />
                    </div>
                  </div>

                  <div>
                    <h2 className="text-sm font-semibold text-[#1f1f1f]">
                      Unlock premium Kosh Meet features
                    </h2>
                    <p className="text-xs text-[#444746] mt-0.5">
                      Enjoy longer group video calls, noise cancellation and more with a Kosh Pro plan.
                    </p>
                  </div>
                </div>

                {/* Right: Explore Plan Link */}
                <button
                  type="button"
                  onClick={() => setIsUpgradeModalOpen(true)}
                  className="text-xs sm:text-sm font-medium text-[#0b57d0] hover:text-[#0842a0] hover:underline self-start sm:self-auto cursor-pointer shrink-0"
                >
                  Explore plan
                </button>
              </div>

              {/* Row 3: Main Schedule Content (Empty State or Scheduled Cards) */}
              {meetingsForSelectedDay.length === 0 ? (
                /* Empty State (Exact match to screenshot) */
                <div className="flex-1 flex flex-col items-center justify-center py-8 sm:py-14 text-center">
                  {/* Vector Illustration */}
                  <div className="mb-4">
                    <MeetingEmptyIllustration />
                  </div>

                  {/* Title & Subtitle */}
                  <h2 className="text-2xl sm:text-[28px] font-normal text-[#1f1f1f] tracking-tight">
                    No meetings scheduled for today
                  </h2>
                  <p className="text-sm text-[#444746] mt-2 mb-7 font-normal">
                    Schedule a meeting or enjoy the free time
                  </p>

                  {/* Mint Green "+ New" Button */}
                  <div className="relative group">
                    <button
                      type="button"
                      onClick={() => setIsScheduleModalOpen(true)}
                      className="h-11 px-6 bg-[#c2e7d6] hover:bg-[#b0d8c4] active:bg-[#a0cbb5] text-[#002116] rounded-full font-medium text-sm flex items-center gap-2 transition-all shadow-xs cursor-pointer select-none"
                    >
                      <div className="relative flex items-center justify-center">
                        <Video className="w-4 h-4 fill-current text-[#002116]" />
                        <Plus className="w-2.5 h-2.5 absolute -top-1 -right-1.5 stroke-[3]" />
                      </div>
                      <span>New</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Scheduled Meetings List */
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-semibold text-[#1f1f1f]">
                      Scheduled Calls ({meetingsForSelectedDay.length})
                    </h3>
                    <button
                      onClick={() => setIsScheduleModalOpen(true)}
                      className="text-xs text-[#0b57d0] hover:underline flex items-center gap-1 font-medium"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Add another meeting
                    </button>
                  </div>

                  {meetingsForSelectedDay.map((mtg) => (
                    <div
                      key={mtg.id}
                      className="p-4 sm:p-5 rounded-2xl border border-[#e1e3e1] bg-white hover:border-[#c2e7ff] hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-xl bg-[#c2e7ff] text-[#001d35] shrink-0">
                          <Video className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-base font-semibold text-[#1f1f1f]">{mtg.title}</h4>
                          <div className="flex items-center gap-3 text-xs text-[#444746] mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-[#0b57d0]" />
                              {mtg.startTime} - {mtg.endTime}
                            </span>
                            <span>•</span>
                            <span className="font-mono text-[#5f6368]">Room: {mtg.roomId}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-center">
                        <button
                          onClick={() => handleCopyMeetingLink(mtg.roomId, mtg.id)}
                          className="p-2 rounded-lg text-[#444746] hover:bg-[#f0f4f9] hover:text-[#0b57d0] transition-colors"
                          title="Copy meeting link"
                        >
                          {copiedMeetingId === mtg.id ? (
                            <Check className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleDeleteMeeting(mtg.id)}
                          className="p-2 rounded-lg text-[#444746] hover:bg-red-50 hover:text-red-600 transition-colors"
                          title="Delete meeting"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/room/${mtg.roomId}`)}
                          className="px-5 py-2 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                        >
                          <span>Join</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Calls Tab Content */
            <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
              <div className="w-16 h-16 rounded-full bg-[#c2e7ff] text-[#001d35] flex items-center justify-center mb-4">
                <Video className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-normal text-[#1f1f1f]">No recent direct calls</h2>
              <p className="text-sm text-[#444746] mt-1 mb-6 max-w-sm">
                Start a video call with anyone using an instant room link powered by SFU WebRTC.
              </p>
              <button
                type="button"
                onClick={handleStartInstant}
                className="px-6 py-2.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-sm font-medium transition-colors shadow-xs"
              >
                Start an instant call
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
