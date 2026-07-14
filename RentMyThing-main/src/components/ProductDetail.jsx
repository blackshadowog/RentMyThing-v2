import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, MapPin, MessageSquare, Phone, Mail, UserCheck, Star, Calendar, CheckCircle } from 'lucide-react';
import FraudAlert from './ai/FraudAlert';
import { api } from '../api';

export default function ProductDetail({ product, user, onBack, onOpenAuthModal, onBookingSuccess, onOpenDirectChat, onRunSafetyAudit }) {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    const d = new Date(); d.setDate(d.getDate() + 4);
    return d.toISOString().split('T')[0];
  });
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  if (!product) return null;

  const days = Math.max(1, Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)));
  const totalRent = days * product.rentPricePerDay;
  const deposit = product.deposit || 500;

  const handleBooking = async () => {
    if (!user) { onOpenAuthModal(); return; }
    setBookingLoading(true);
    try {
      await api.createBooking({ productId: product.id, startDate, endDate, totalPrice: totalRent });
      setBookingSuccess(true);
      setTimeout(() => { if (onBookingSuccess) onBookingSuccess(); }, 2500);
    } catch (err) {
      alert('Booking failed: ' + err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: 32, paddingBottom: 96 }}>
      {/* Back button */}
      <button
        onClick={onBack}
        className="btn btn-ghost btn-sm"
        style={{ marginBottom: 24 }}
      >
        <ArrowLeft size={14} />
        Back to Directory
      </button>

      {/* AI Fraud Alert banner */}
      <FraudAlert product={product} />

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: 40, marginTop: 24 }} className="detail-grid">
        {/* Left: Product Images + Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {/* Main Hero Image */}
          <div style={{ borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border)', boxShadow: 'var(--shadow-md)', background: 'var(--surface-2)' }} className="ratio-16-9">
            <img src={product.images?.[0]} alt={product.title} className="img-cover" />
          </div>

          {/* Title & Description */}
          <div className="card" style={{ padding: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <span className="badge badge-coral">{product.category}</span>
              <span style={{ fontSize: 13, color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 500 }}>
                <MapPin size={14} color="var(--coral)" />
                {product.college}
              </span>
            </div>

            <h1 style={{ fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: 16 }}>{product.title}</h1>
            <p className="body-lg" style={{ marginBottom: 28 }}>{product.description}</p>

            {/* Host Mutual Transparency Card */}
            <div className="card-flat" style={{ padding: 24, background: 'var(--surface-2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16,
                  background: 'var(--coral)', color: '#fff',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700,
                }}>
                  {product.ownerName?.[0]?.toUpperCase() || 'H'}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h4 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ink)', margin: 0 }}>{product.ownerName}</h4>
                    <span className="badge badge-green">
                      <UserCheck size={11} /> Verified Indian Student
                    </span>
                  </div>
                  <p className="body-sm" style={{ marginTop: 2 }}>{product.college} · {product.hostel || 'Campus Hostel'}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />
                    ))}
                    <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', marginLeft: 4 }}>{product.ownerRating || 4.9}</span>
                  </div>
                </div>
              </div>

              {/* Host verified contacts */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Phone size={15} color="var(--green)" />
                  <div>
                    <span className="label" style={{ display: 'block', fontSize: 10 }}>Verified Phone</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{product.ownerPhone || '+91 98765 43210'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Mail size={15} color="var(--coral)" />
                  <div>
                    <span className="label" style={{ display: 'block', fontSize: 10 }}>Campus Email</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink)' }}>{product.ownerEmail || 'host@iitd.ac.in'}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 16 }}>
                <button
                  onClick={() => onOpenDirectChat?.(product.ownerId || 'user_iitd_1', product.ownerName || 'Aravind Sharma', product)}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  <MessageSquare size={15} color="var(--coral)" />
                  Open Verified Student Chat
                </button>
                <button
                  onClick={() => onRunSafetyAudit?.(product)}
                  className="btn btn-secondary"
                  style={{ width: '100%', justifyContent: 'center', borderColor: '#10b981', color: '#059669', background: '#ecfdf5' }}
                >
                  <ShieldCheck size={15} color="#10b981" />
                  Run AI Fraud & Safety Audit
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Booking Sticky Card */}
        <div>
          <div className="card" style={{ padding: 28, position: 'sticky', top: 96 }}>
            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '32px 12px' }} className="anim-scale">
                <CheckCircle size={48} color="var(--green)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: 20, marginBottom: 8 }}>Booking Request Confirmed!</h3>
                <p className="body-md">Your 4-digit OTP pickup verification code has been generated. View it in your dashboard.</p>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                  <div>
                    <span style={{ fontFamily: "'Fraunces', serif", fontSize: 36, fontWeight: 700, color: 'var(--ink)' }}>
                      ₹{product.rentPricePerDay}
                    </span>
                    <span style={{ fontSize: 14, color: 'var(--ink-muted)', fontWeight: 500 }}> / day</span>
                  </div>
                  <span className="badge badge-gray">Deposit: ₹{deposit}</span>
                </div>

                {/* Dates */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, margin: '24px 0' }}>
                  <label style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Select Rental Window
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <span className="label" style={{ display: 'block', marginBottom: 4 }}>Pickup Date</span>
                      <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="input" />
                    </div>
                    <div>
                      <span className="label" style={{ display: 'block', marginBottom: 4 }}>Return Date</span>
                      <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="input" />
                    </div>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="card-flat" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-soft)' }}>
                    <span>₹{product.rentPricePerDay} × {days} day(s)</span>
                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>₹{totalRent}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--ink-soft)' }}>
                    <span>Refundable Deposit</span>
                    <span style={{ fontWeight: 600, color: 'var(--ink)' }}>₹{deposit}</span>
                  </div>
                  <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: 'var(--ink)' }}>
                    <span>Total Due at Pickup</span>
                    <span style={{ color: 'var(--coral)' }}>₹{totalRent + deposit}</span>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={bookingLoading}
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center', padding: '14px' }}
                >
                  <Calendar size={16} />
                  {bookingLoading ? 'Requesting...' : `Request Booking (₹${totalRent})`}
                </button>

                <p style={{ fontSize: 12, color: 'var(--ink-muted)', textAlign: 'center', marginTop: 12 }}>
                  🔒 No payment processed until host verifies OTP
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) { .detail-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}
