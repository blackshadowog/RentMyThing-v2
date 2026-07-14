import React, { useState, useEffect } from 'react';
import { ArrowRight, ShieldCheck, MapPin, Sparkles, TrendingUp, Users, Zap, Star, CheckCircle, ChevronRight } from 'lucide-react';
import RecommendationCarousel from './ai/RecommendationCarousel';
import BundleCard from './ai/BundleCard';
import { api } from '../api';

/* ── Inline stat counter ── */
function Stat({ value, label, suffix = '' }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <div className="stat-num">{value}{suffix}</div>
      <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 4, fontWeight: 500 }}>{label}</p>
    </div>
  );
}

/* ── How it works card ── */
function StepCard({ num, title, desc, delay }) {
  return (
    <div className="anim-up" style={{ animationDelay: `${delay}ms` }}>
      <div style={{
        display: 'flex', flexDirection: 'column', gap: 16,
        padding: '32px', height: '100%',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 24,
        transition: 'box-shadow 0.25s, transform 0.25s',
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-3px)'; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; e.currentTarget.style.transform = ''; }}
      >
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: 'var(--coral)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700,
        }}>
          {num}
        </div>
        <div>
          <h4 style={{ fontSize: 17, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>{title}</h4>
          <p className="body-md">{desc}</p>
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  { num: '1', title: 'Verify Campus Identity', desc: 'Register with your institutional email (@iitd.ac.in, @iitb.ac.in) or Google. Your student profile is linked to your campus node.' },
  { num: '2', title: 'Discover or List Gear', desc: 'Browse gear on the live map or list your unused cameras, laptops, and cycles. AI pricing shields protect every listing from scams.' },
  { num: '3', title: 'Book & Get OTP Code', desc: 'Confirm with one tap. A 4-digit pickup & return OTP is generated for secure hostel-to-hostel handovers.' },
  { num: '4', title: 'Earn ₹ INR. Build Reputation.', desc: 'Hosts earn guaranteed income. Borrowers build verified rental history. Both profiles grow more trusted with every deal.' },
];

const TRUST = ['Zero hidden fees', 'AI price fraud shield', 'Mutual ID transparency', '4s real-time chat', 'Hostel-verified pickup', 'Instant ₹ bookings'];

export default function HomePage({ onViewChange, onSelectProduct, onWishlistToggle, wishlistedIds = [] }) {
  const [forYou, setForYou] = useState([]);
  const [trending, setTrending] = useState([]);
  const [bundles, setBundles] = useState([]);

  useEffect(() => {
    Promise.all([api.getRecommendations('forYou'), api.getRecommendations('trending'), api.getBundles()])
      .then(([fy, tr, bd]) => { setForYou(fy || []); setTrending(tr || []); setBundles(bd || []); })
      .catch(console.error);
  }, []);

  return (
    <main>

      {/* ══════════════ HERO ══════════════ */}
      <section style={{ background: 'var(--surface)', paddingTop: 80, paddingBottom: 96, overflow: 'hidden', position: 'relative' }}>
        {/* Decorative background shape */}
        <div style={{
          position: 'absolute', top: -80, right: -120, width: 700, height: 700,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(232,71,42,0.07) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}
            className="hero-grid"
          >
            {/* Left: Content */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
              <div className="anim-up delay-0">
                <span className="badge badge-coral">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--coral)', animation: 'pulse-dot 2s infinite' }} />
                  Live on Indian Campuses · ₹ INR Pricing
                </span>
              </div>

              <h1 className="display anim-up delay-1">
                Borrow. Share.<br />
                <span style={{ color: 'var(--coral)', fontStyle: 'italic' }}>Earn on Campus.</span>
              </h1>

              <p className="body-lg anim-up delay-2" style={{ maxWidth: 440 }}>
                India's first verified peer-to-peer campus gear rental network. Rent cameras, laptops, cycles & gaming gear safely across IIT, BITS & IIM with neural fraud shielding.
              </p>

              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }} className="anim-up delay-3">
                <button onClick={() => onViewChange('search')} className="btn btn-primary btn-lg">
                  Explore Campus Gear
                  <ArrowRight size={16} />
                </button>
                <button onClick={() => onViewChange('list')} className="btn btn-secondary btn-lg">
                  List Your Gear
                </button>
              </div>

              {/* Trust chips */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }} className="anim-up delay-4">
                {TRUST.map(t => (
                  <span key={t} style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '5px 12px', borderRadius: 100,
                    background: 'var(--surface-2)', border: '1px solid var(--border)',
                    fontSize: 11, fontWeight: 600, color: 'var(--ink-soft)',
                  }}>
                    <CheckCircle size={11} color="var(--green)" strokeWidth={2.5} />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Hero Visual */}
            <div className="anim-up delay-2 hero-visual" style={{ position: 'relative' }}>
              {/* Main image */}
              <div style={{
                borderRadius: 28, overflow: 'hidden',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border)',
              }}>
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80"
                  alt="Students sharing gear on campus"
                  style={{ width: '100%', height: 460, objectFit: 'cover', display: 'block' }}
                />
              </div>

              {/* Floating cards */}
              <div style={{
                position: 'absolute', bottom: 28, left: -32,
                background: 'var(--surface)', borderRadius: 18,
                boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
                padding: '14px 18px',
                display: 'flex', alignItems: 'center', gap: 12,
                animation: 'float 5s ease-in-out infinite',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                  <img src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=100&q=80" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>Canon EOS R50 Camera</p>
                  <p style={{ fontSize: 11, color: 'var(--coral)', fontWeight: 700 }}>₹450/day · IIT Delhi</p>
                </div>
              </div>

              <div style={{
                position: 'absolute', top: 28, right: -28,
                background: 'var(--surface)', borderRadius: 18,
                boxShadow: 'var(--shadow-lg)', border: '1px solid var(--border)',
                padding: '14px 18px',
                display: 'flex', alignItems: 'center', gap: 10,
                animation: 'float 6s ease-in-out infinite 1s',
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10, background: 'var(--green-light)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                }}>
                  <ShieldCheck size={18} color="var(--green)" />
                </div>
                <div>
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', lineHeight: 1.3 }}>AI Verified Safe</p>
                  <p style={{ fontSize: 11, color: 'var(--ink-muted)', fontWeight: 500 }}>100% student IDs verified</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) {
            .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
            .hero-visual { display: none !important; }
          }
        `}</style>
      </section>

      {/* ══════════════ TICKER STRIP ══════════════ */}
      <div style={{ overflow: 'hidden', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--surface-2)', padding: '14px 0' }}>
        <div className="ticker-track" style={{ gap: 0 }}>
          {[...Array(2)].map((_, r) => (
            <div key={r} style={{ display: 'flex', gap: 40, paddingRight: 40, whiteSpace: 'nowrap', flexShrink: 0 }}>
              {['IIT Delhi', 'IIT Bombay', 'BITS Pilani', 'IIM Bangalore', 'IIT Madras', 'NIT Trichy', 'IIIT Hyderabad', 'VIT Vellore', 'Delhi University', 'IIT Kharagpur'].map(c => (
                <span key={c} style={{ fontSize: 12, fontWeight: 600, color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--coral)', flexShrink: 0, display: 'inline-block' }} />
                  {c}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════ STATS ══════════════ */}
      <section className="section-sm" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, alignItems: 'center' }} className="stats-grid">
            <Stat value="100" suffix="%" label="Verified student IDs" />
            <Stat value="₹0" label="Hidden fees. Ever." />
            <Stat value="50" suffix="+" label="Indian campuses" />
            <Stat value="4s" label="Real-time chat sync" />
          </div>
        </div>

        <style>{`
          @media (max-width: 640px) {
            .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 24px !important; }
          }
        `}</style>
      </section>

      {/* ══════════════ FEATURED GEAR ══════════════ */}
      {forYou.length > 0 && (
        <section className="section" style={{ background: 'var(--surface-2)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, gap: 16, flexWrap: 'wrap' }}>
              <div>
                <p className="eyebrow" style={{ marginBottom: 10 }}>AI-Curated Picks</p>
                <h2 className="display-md">Gear for Your Campus</h2>
              </div>
              <button onClick={() => onViewChange('search')} className="btn btn-secondary btn-sm">
                View all <ChevronRight size={14} />
              </button>
            </div>
            <RecommendationCarousel
              products={forYou}
              onSelectProduct={onSelectProduct}
              onWishlistToggle={onWishlistToggle}
              wishlistedIds={wishlistedIds}
            />
          </div>
        </section>
      )}

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section className="section" style={{ background: 'var(--surface)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <p className="eyebrow" style={{ marginBottom: 12 }}>Simple by Design</p>
            <h2 className="display-md">How RentMyThing Works</h2>
            <p className="prose-lead" style={{ maxWidth: 520, margin: '16px auto 0' }}>
              Four steps to start earning from your idle gear or borrow what you need.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }} className="steps-grid">
            {STEPS.map((s, i) => <StepCard key={s.num} {...s} delay={i * 80} />)}
          </div>
        </div>

        <style>{`
          @media (max-width: 900px) { .steps-grid { grid-template-columns: repeat(2, 1fr) !important; } }
          @media (max-width: 600px) { .steps-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ══════════════ AI SAFETY BAND ══════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #0f1117 0%, #1e1128 100%)',
        padding: '80px 0',
      }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="safety-grid">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <span className="eyebrow" style={{ color: '#fb923c' }}>Built-in Protection</span>
              <h2 style={{ fontFamily: "'Fraunces', serif", fontSize: 'clamp(28px, 3.5vw, 48px)', fontWeight: 700, color: '#fff', lineHeight: 1.1, letterSpacing: '-0.025em', margin: 0 }}>
                Zero scams. Real-time<br />AI price protection.
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                Every listing is screened against live Indian campus rental benchmarks. Our neural engine flags price gouging, unverified accounts, and suspicious advance payment demands — instantly.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                {['Hostel pickup verification', 'OTP handover codes', 'Price benchmark AI', 'Mutual student ID'].map(f => (
                  <span key={f} style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 14px', borderRadius: 100,
                    background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)',
                    fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)',
                  }}>
                    <CheckCircle size={12} color="#4ade80" strokeWidth={2.5} />
                    {f}
                  </span>
                ))}
              </div>
              <div>
                <button onClick={() => onViewChange('aifraud')} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                  padding: '12px 22px', borderRadius: 16, border: 'none',
                  background: 'var(--coral)', color: '#fff', fontSize: 13, fontWeight: 700,
                  cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                  boxShadow: '0 4px 16px rgba(232,71,42,0.4)',
                }}>
                  Try Live AI Fraud Scanner
                  <ArrowRight size={15} />
                </button>
              </div>
            </div>

            {/* Right: mock UI card */}
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 24, padding: 24, width: '100%', maxWidth: 400,
              }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>AI Audit Report</p>
                {[
                  { label: 'Price vs Benchmark', val: '✓ Within range', ok: true },
                  { label: 'Host Verification', val: '✓ IIT Student ID', ok: true },
                  { label: 'Advance Payment Req', val: '✗ Flagged', ok: false },
                  { label: 'Risk Score', val: '3 / 10 — Low Risk', ok: true },
                ].map(({ label, val, ok }) => (
                  <div key={label} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '12px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.07)',
                  }}>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', fontWeight: 500 }}>{label}</span>
                    <span style={{ fontSize: 12, fontWeight: 700, color: ok ? '#4ade80' : '#f87171' }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <style>{`
          @media (max-width: 768px) { .safety-grid { grid-template-columns: 1fr !important; } }
        `}</style>
      </section>

      {/* ══════════════ TRENDING GEAR ══════════════ */}
      {trending.length > 0 && (
        <section className="section" style={{ background: 'var(--surface)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <p className="eyebrow" style={{ marginBottom: 10 }}>Trending This Week</p>
                <h2 className="display-md">Hot on Campus</h2>
              </div>
              <button onClick={() => onViewChange('search')} className="btn btn-secondary btn-sm">
                Browse all <ChevronRight size={14} />
              </button>
            </div>
            <RecommendationCarousel
              products={trending}
              onSelectProduct={onSelectProduct}
              onWishlistToggle={onWishlistToggle}
              wishlistedIds={wishlistedIds}
            />
          </div>
        </section>
      )}

      {/* ══════════════ BUNDLES ══════════════ */}
      {bundles.length > 0 && (
        <section className="section" style={{ background: 'var(--surface-2)' }}>
          <div className="container">
            <div style={{ textAlign: 'center', marginBottom: 48 }}>
              <p className="eyebrow" style={{ marginBottom: 12 }}>Curated Kits</p>
              <h2 className="display-md">Smart Hackathon Bundles</h2>
              <p className="prose-lead" style={{ maxWidth: 500, margin: '14px auto 0' }}>
                Pre-matched gear combos designed for tech fests, inter-IIT events, and 36-hour hackathons — with bundle discounts in ₹.
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }} className="bundles-grid">
              {bundles.map((b, i) => (
                <div key={b.id} className="anim-up" style={{ animationDelay: `${i * 100}ms` }}>
                  <BundleCard bundle={b} onSelectBundle={() => onViewChange('search')} />
                </div>
              ))}
            </div>
          </div>
          <style>{`
            @media (max-width: 900px) { .bundles-grid { grid-template-columns: repeat(2, 1fr) !important; } }
            @media (max-width: 600px) { .bundles-grid { grid-template-columns: 1fr !important; } }
          `}</style>
        </section>
      )}

      {/* ══════════════ FINAL CTA ══════════════ */}
      <section style={{ background: 'var(--coral-light)', borderTop: '1px solid var(--coral-mid)', padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
          <p className="eyebrow">Start Today — Free</p>
          <h2 className="display-md" style={{ maxWidth: 560 }}>
            Your idle gear could be<br />
            <span style={{ color: 'var(--coral)', fontStyle: 'italic' }}>earning you ₹ right now.</span>
          </h2>
          <p className="prose-lead" style={{ maxWidth: 480 }}>
            Join thousands of verified students across India's top institutes who are already renting, earning, and building campus trust on RentMyThing.
          </p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={() => onViewChange('list')} className="btn btn-primary btn-lg">
              <span>+ List Your First Item</span>
              <ArrowRight size={16} />
            </button>
            <button onClick={() => onViewChange('search')} className="btn btn-secondary btn-lg">
              Browse Gear
            </button>
          </div>
        </div>
      </section>

    </main>
  );
}
