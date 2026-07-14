import React from 'react';

export default function Logo({ size = 'md', showTagline = true }) {
  const cfg = {
    sm: { svgH: 32, svgW: 32, textSize: '15px', tagSize: '9px' },
    md: { svgH: 38, svgW: 38, textSize: '17px', tagSize: '10px' },
    lg: { svgH: 48, svgW: 48, textSize: '22px', tagSize: '11px' },
  }[size] || { svgH: 38, svgW: 38, textSize: '17px', tagSize: '10px' };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', userSelect: 'none' }}>
      {/* Wordmark icon — clean geometric R loop */}
      <svg width={cfg.svgH} height={cfg.svgW} viewBox="0 0 48 48" fill="none">
        <rect width="48" height="48" rx="14" fill="#e8472a" />
        {/* Circular arrows representing peer exchange */}
        <path d="M14 18C18 11 30 11 36 17C39 20 39 26 36 29" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5"/>
        <path d="M34 36C30 43 18 43 12 37C9 34 9 28 12 25" stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5"/>
        {/* Arrow tips */}
        <path d="M34 28L36 29.5L33 32.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 26L12 24.5L15 21.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        {/* R letterform */}
        <path d="M18 16V32M18 16H26C28.8 16 31 18.2 31 21C31 23.8 28.8 26 26 26H18M26 26L31 32" stroke="white" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <span style={{
          fontFamily: "'Fraunces', serif",
          fontSize: cfg.textSize,
          fontWeight: 700,
          letterSpacing: '-0.025em',
          color: 'var(--ink)',
          lineHeight: 1,
        }}>
          RentMyThing
          <span style={{
            marginLeft: '6px',
            fontSize: '10px',
            fontFamily: "'Inter', sans-serif",
            fontWeight: 700,
            color: 'var(--coral)',
            letterSpacing: '0',
          }}>🇮🇳</span>
        </span>
        {showTagline && (
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: cfg.tagSize,
            fontWeight: 600,
            color: 'var(--ink-faint)',
            letterSpacing: '0.07em',
            textTransform: 'uppercase',
          }}>
            Campus Peer Rental
          </span>
        )}
      </div>
    </div>
  );
}
