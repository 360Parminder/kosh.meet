"use client";

import React from 'react';

export default function MeetingEmptyIllustration({ className = 'w-72 sm:w-80 h-auto' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 240"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Soft Pink Dome Gradient */}
        <linearGradient id="pinkDomeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FCE4EC" />
          <stop offset="100%" stopColor="#F48FB1" />
        </linearGradient>

        {/* Coffee Cup Gradient */}
        <linearGradient id="cupGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#FFEE58" />
          <stop offset="50%" stopColor="#FDD835" />
          <stop offset="100%" stopColor="#FBC02D" />
        </linearGradient>

        {/* Sun Gradient */}
        <linearGradient id="sunGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF59D" />
          <stop offset="100%" stopColor="#FDD835" />
        </linearGradient>

        {/* Tablet Gradient */}
        <linearGradient id="tabletGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FCE4EC" />
        </linearGradient>
      </defs>

      {/* Floating Sun Circle Top Right */}
      <circle cx="280" cy="46" r="14" fill="url(#sunGrad)" stroke="#1F1F1F" strokeWidth="2.5" />

      {/* Whimsical swoosh curves above cup and tablet */}
      <path
        d="M210 52 C225 36, 245 42, 252 64 C256 75, 268 76, 276 68"
        stroke="#1F1F1F"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />

      {/* Steam lines rising from the coffee cup */}
      <path
        d="M208 82 C204 74, 212 68, 206 60"
        stroke="#1F1F1F"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M196 90 C190 80, 198 72, 192 64"
        stroke="#1F1F1F"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />

      {/* Pink Pebble/Mound on the left */}
      <path
        d="M115 178 C115 138, 142 135, 150 178 Z"
        fill="url(#pinkDomeGrad)"
        stroke="#1F1F1F"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />

      {/* Tablet / Screen angled behind cup */}
      <g transform="rotate(8 275 140)">
        <rect
          x="230"
          y="95"
          width="74"
          height="80"
          rx="10"
          fill="url(#tabletGrad)"
          stroke="#F06292"
          strokeWidth="3.5"
        />
        <rect
          x="230"
          y="95"
          width="74"
          height="80"
          rx="10"
          stroke="#1F1F1F"
          strokeWidth="2.5"
          fill="none"
        />
        {/* Screen camera outline icon */}
        <path
          d="M255 127 C253.5 127, 252 128.5, 252 130 L252 142 C252 143.5, 253.5 145, 255 145 L268 145 C269.5 145, 271 143.5, 271 142 L271 130 C271 128.5, 269.5 127, 268 127 Z"
          stroke="#1F1F1F"
          strokeWidth="2.5"
          fill="#FFFFFF"
        />
        <path
          d="M271 133 L280 128 L280 144 L271 139 Z"
          stroke="#1F1F1F"
          strokeWidth="2.5"
          strokeLinejoin="round"
          fill="#FFFFFF"
        />
      </g>

      {/* Pencil leaning behind cup against tablet */}
      <g transform="rotate(-34 220 135)">
        {/* Pencil body */}
        <rect x="215" y="60" width="10" height="92" fill="#D4E157" stroke="#1F1F1F" strokeWidth="2.5" />
        <line x1="220" y1="60" x2="220" y2="152" stroke="#1F1F1F" strokeWidth="1.5" />
        {/* Sharpened tip */}
        <polygon points="215,60 220,44 225,60" fill="#FFF9C4" stroke="#1F1F1F" strokeWidth="2.5" strokeLinejoin="round" />
        {/* Graphite tip */}
        <polygon points="218,52 220,44 222,52" fill="#1F1F1F" />
      </g>

      {/* Coffee Cup in the front */}
      <g>
        {/* Cup Handle on Right */}
        <path
          d="M216 122 C230 122, 230 152, 215 152"
          stroke="#1F1F1F"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Cup Body */}
        <path
          d="M178 112 L220 112 C220 112, 222 165, 199 165 C176 165, 178 112, 178 112 Z"
          fill="url(#cupGrad)"
          stroke="#1F1F1F"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />

        {/* Cup Base */}
        <path
          d="M190 165 L208 165 L212 178 L186 178 Z"
          fill="url(#cupGrad)"
          stroke="#1F1F1F"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
      </g>

      {/* Grounding Base Line */}
      <line x1="110" y1="178" x2="295" y2="178" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
