import React from 'react';
import { Heart, MapPin, ShieldCheck, Mail, Globe, Sparkles } from 'lucide-react';
import Logo from './Logo';

export default function Footer({ onViewChange }) {
  return (
    <footer style={{ background: 'var(--surface-2)', borderTop: '1px solid var(--border)', paddingTop: 64, paddingBottom: 40 }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }} className="footer-grid">
          {/* Col 1 */}
          <div>
            <div onClick={() => onViewChange?.('home')} style={{ display: 'inline-block' }}>
              <Logo size="md" showTagline={false} />
            </div>
            <p className="body-md" style={{ marginTop: 16, maxWidth: 320 }}>
              India's first verified peer-to-peer campus gear rental ecosystem. Borrow, share, and earn safely across IIT, BITS & IIM hostels.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 20 }}>
              <span className="badge badge-green">
                <ShieldCheck size={12} /> 100% Student Verified
              </span>
              <span className="badge badge-coral">
                <Sparkles size={12} /> Neural Fraud Guard
              </span>
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Marketplace
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Browse Gear (₹)', 'Live Campus Map', 'Student Demand Hub', 'AI Safety Center', 'Hackathon Bundles'].map((item, idx) => (
                <li key={item}>
                  <button
                    onClick={() => onViewChange?.(['search', 'map', 'requests', 'aifraud', 'search'][idx])}
                    style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontSize: 13, color: 'var(--ink-soft)', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--coral)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-soft)'}
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Indian Campuses
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['IIT Delhi', 'IIT Bombay', 'BITS Pilani', 'IIM Bangalore', 'IIT Madras'].map((c) => (
                <li key={c} style={{ fontSize: 13, color: 'var(--ink-soft)', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--coral)' }} />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 style={{ fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              Trust & Security
            </h4>
            <p className="body-sm">
              All transactions are protected by mutual student ID verification and OTP handover codes. Zero hidden charges.
            </p>
          </div>
        </div>

        <div className="divider" style={{ marginBottom: 24 }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <p className="body-sm">
            © {new Date().getFullYear()} RentMyThing India · Built for Indian campus communities 🇮🇳
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--ink-muted)' }}>
            <span>Crafted with</span>
            <Heart size={13} color="var(--coral)" fill="var(--coral)" />
            <span>for peer exchange</span>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .footer-grid { grid-template-columns: 1fr 1fr !important; } }
        @media (max-width: 600px) { .footer-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </footer>
  );
}
