"use client";

import React, { useState } from 'react';
import { X, Copy, Check, Video, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface MeetingLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  roomId: string;
}

export default function MeetingLinkModal({ isOpen, onClose, roomId }: MeetingLinkModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const meetingUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/room/${roomId}`
    : `https://meet.kosh.com/room/${roomId}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(meetingUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in text-[#1f1f1f]">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#e1e3e1] flex flex-col">
        {/* Top Header */}
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-xl font-normal text-[#1f1f1f] leading-snug">
            Here&apos;s the link to your meeting
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#444746] hover:bg-[#f0f4f9] hover:text-[#1f1f1f] transition-colors -mr-1 -mt-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Explanatory text */}
        <p className="text-sm text-[#444746] leading-relaxed mb-6 font-normal">
          Copy this link and send it to people you want to meet with. Be sure to save it so you can use it later, too.
        </p>

        {/* Link Box */}
        <div className="flex items-center justify-between bg-[#f0f4f9] rounded-xl px-4 py-3.5 mb-6 border border-transparent hover:border-[#c2e7ff] transition-all">
          <span className="text-sm font-normal text-[#1f1f1f] truncate mr-2 select-all font-mono">
            {meetingUrl}
          </span>
          <button
            onClick={handleCopy}
            className="p-2 rounded-lg hover:bg-white text-[#444746] hover:text-[#0b57d0] transition-colors shrink-0"
            title="Copy link"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
          </button>
        </div>

        {copied && (
          <div className="mb-4 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl flex items-center gap-1.5 animate-fade-in">
            <Check className="w-4 h-4" />
            <span>Meeting link copied to clipboard</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <Link
            href={`/room/${roomId}`}
            className="text-[#0b57d0] hover:text-[#0842a0] text-sm font-medium flex items-center gap-1.5 no-underline hover:underline"
          >
            <Video className="w-4 h-4" />
            <span>Join now</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-sm font-medium transition-colors shadow-xs"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
