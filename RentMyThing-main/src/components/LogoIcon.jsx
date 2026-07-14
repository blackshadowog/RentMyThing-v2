import React from 'react';

export default function LogoIcon({ size = 42, className = '', style = {} }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 120 120"
      width={size}
      height={size}
      className={className}
      style={{
        flexShrink: 0,
        filter: 'drop-shadow(0 4px 12px rgba(234, 88, 12, 0.28))',
        ...style
      }}
    >
      <defs>
        <linearGradient id="rmtBgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="50%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#090d16" />
        </linearGradient>

        <linearGradient id="rmtCoralGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff7a59" />
          <stop offset="50%" stopColor="#ea580c" />
          <stop offset="100%" stopColor="#c2410c" />
        </linearGradient>

        <linearGradient id="rmtAmberGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fbbf24" />
        </linearGradient>

        <linearGradient id="rmtBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 122, 89, 0.5)" />
          <stop offset="100%" stopColor="rgba(245, 158, 11, 0.2)" />
        </linearGradient>
      </defs>

      {/* Sleek Dark Obsidian Glass Squircle Base */}
      <rect
        x="6"
        y="6"
        width="108"
        height="108"
        rx="28"
        fill="url(#rmtBgGrad)"
        stroke="url(#rmtBorderGrad)"
        strokeWidth="2.5"
      />

      {/* Dynamic Campus Sharing 'R' Emblem */}
      <g>
        <path
          d="M 38 32 C 38 29.8 39.8 28 42 28 L 68 28 C 83.5 28 94 37.5 94 50 C 94 60 86.5 68 74.5 70.8 L 88.6 86.8 C 90.2 88.6 88.9 91.5 86.5 91.5 L 75.2 91.5 C 73.8 91.5 72.5 90.9 71.6 89.8 L 57.8 72 L 48 72 L 48 88 C 48 90.2 46.2 92 44 92 L 42 92 C 39.8 92 38 90.2 38 88 Z M 48 38 L 48 62 L 67 62 C 75.5 62 82 57 82 50 C 82 43 75.5 38 67 38 Z"
          fill="url(#rmtCoralGrad)"
        />

        {/* Orbit Sharing Arch Accent */}
        <path
          d="M 32 64 C 32 46.3 46.3 32 64 32"
          fill="none"
          stroke="url(#rmtAmberGrad)"
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.95"
        />

        {/* Campus Verified Spark Node */}
        <circle cx="84" cy="36" r="5.5" fill="url(#rmtAmberGrad)" />
      </g>
    </svg>
  );
}
