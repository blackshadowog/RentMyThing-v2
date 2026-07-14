import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Plus, Package, Calendar, Heart, Shield, CheckCircle, Key, Edit3, LogOut, Save } from 'lucide-react';
import { api } from '../api';
import ProductCard from './ProductCard';

const TABS = [
  { id: 'listings', label: 'My Gear Listings', icon: Package },
  { id: 'bookings', label: 'My Rentals & Borrowed', icon: Calendar },
  { id: 'wishlist', label: 'Saved Wishlist', icon: Heart },
  { id: 'verification', label: 'Campus ID & Verification', icon: Shield },
];

export default function Dashboard({ user, onViewChange, onSelectProduct, onUpdateUser, onLogout, onOpenDirectChat }) {
  const [activeTab, setActiveTab] = useState('listings');
  const [myListings, setMyListings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  // OTP handover verification modal state
  const [otpBookingId, setOtpBookingId] = useState(null);
  const [otpInput, setOtpInput] = useState('');
  const [otpType, setOtpType] = useState('pickup');

  // Real campus verification editing state
  const [isEditingVerification, setIsEditingVerification] = useState(false);
  const [editCollege, setEditCollege] = useState(user?.college || '');
  const [editHostel, setEditHostel] = useState(user?.hostel || '');
  const [editPhone, setEditPhone] = useState(user?.phone || '');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // OTP verification when changing mobile number in Dashboard
  const [phoneChangeOtpStep, setPhoneChangeOtpStep] = useState(false);
  const [phoneChangeOtpInput, setPhoneChangeOtpInput] = useState('');

  const fetchData = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [productsRes, bookingsRes, wishlistRes] = await Promise.all([
        api.getProducts().catch(() => ({ products: [] })),
        api.getBookings().catch(() => ({ bookings: [] })),
        api.getWishlist().catch(() => ({ wishlist: [] })),
      ]);

      const allProducts = productsRes.products || [];
      const mine = allProducts.filter(p => p.ownerEmail === user.email || p.owner === user.name);
      setMyListings(mine);

      const allBookings = bookingsRes.bookings || [];
      setMyBookings(allBookings.filter(b => b.borrowerEmail === user.email || b.ownerEmail === user.email));
      setWishlist(wishlistRes.wishlist || []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchData();
    if (user) {
      setEditCollege(user.college || '');
      setEditHostel(user.hostel || '');
      setEditPhone(user.phone || '');
    }
  }, [fetchData, user]);

  const handleSaveVerification = async (e) => {
    e.preventDefault();
    const cleanNewPhone = editPhone.replace(/\D/g, '');
    const cleanOldPhone = (user.phone || '').replace(/\D/g, '');

    // If phone changed, verify new phone with OTP first
    if (cleanNewPhone && cleanNewPhone !== cleanOldPhone) {
      try {
        await api.sendMobileOtp(cleanNewPhone);
        setPhoneChangeOtpStep(true);
      } catch (err) {
        alert('Could not send verification code: ' + (err.message || 'Mobile number already exists.'));
      }
      return;
    }

    await completeUpdateDetails();
  };

  const completeUpdateDetails = async () => {
    const updatedUser = {
      ...user,
      college: editCollege.trim() || user.college,
      hostel: editHostel.trim() || user.hostel,
      phone: editPhone.trim() || user.phone,
    };
    localStorage.setItem('rt_user', JSON.stringify(updatedUser));
    try {
      await api.updateProfile({
        college: editCollege.trim(),
        hostel: editHostel.trim(),
        phone: editPhone.trim(),
      });
    } catch (e) {
      console.error('Backend profile sync error:', e);
    }
    onUpdateUser?.(updatedUser);
    setIsEditingVerification(false);
    setPhoneChangeOtpStep(false);
    setPhoneChangeOtpInput('');
    setSaveSuccessMsg('✓ Campus verification details saved successfully!');
    setTimeout(() => setSaveSuccessMsg(''), 4000);
  };

  const handleVerifyPhoneChange = async (e) => {
    e.preventDefault();
    const cleanNewPhone = editPhone.replace(/\D/g, '');
    try {
      await api.verifyMobileOtp(cleanNewPhone, phoneChangeOtpInput);
      await completeUpdateDetails();
    } catch (err) {
      alert('Verification failed: ' + (err.message || 'Invalid OTP code.'));
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpInput || !otpBookingId) return;
    try {
      if (otpType === 'pickup') {
        await api.verifyPickupOtp(otpBookingId, otpInput);
      } else {
        await api.verifyReturnOtp(otpBookingId, otpInput);
      }
      setOtpBookingId(null);
      setOtpInput('');
      fetchData();
    } catch (err) {
      alert('Verification failed: ' + err.message);
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ paddingTop: 80, paddingBottom: 120, textAlign: 'center' }}>
        <h2 className="display-md">Please Sign In</h2>
        <p className="body-md" style={{ marginTop: 12 }}>You need to be logged in to view your campus dashboard.</p>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--surface-2)', minHeight: 'calc(100vh - 68px)', paddingBottom: 96 }}>
      {/* Profile Header Banner */}
      <div style={{ background: 'var(--surface)', borderBottom: '1px solid var(--border)', paddingTop: 48, paddingBottom: 40 }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{
                width: 68, height: 68, borderRadius: 20,
                background: 'var(--coral)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Fraunces', serif", fontSize: 30, fontWeight: 700,
                boxShadow: 'var(--shadow-sm)',
              }}>
                {user.name?.[0]?.toUpperCase() || 'S'}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <h1 style={{ fontSize: 28, margin: 0 }}>{user.name}</h1>
                  <span className="badge badge-green">
                    <ShieldCheck size={12} /> Verified Campus ID
                  </span>
                </div>
                <p className="body-md" style={{ marginTop: 4 }}>
                  {user.college || 'Indian Campus Student'} · {user.hostel || 'Hostel Room'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => onViewChange('list')} className="btn btn-primary">
                <Plus size={15} /> List New Gear (₹)
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('rt_user');
                  localStorage.removeItem('rt_token');
                  onLogout?.();
                  onViewChange('home');
                }}
                className="btn btn-secondary"
                style={{ color: '#dc2626', borderColor: '#fca5a5' }}
              >
                <LogOut size={15} /> Log Out
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div style={{ display: 'flex', gap: 8, marginTop: 32, overflowX: 'auto' }} className="scrollbar-none">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '10px 18px',
                  borderRadius: 12,
                  border: 'none',
                  background: activeTab === id ? 'var(--coral)' : 'transparent',
                  color: activeTab === id ? '#fff' : 'var(--ink-soft)',
                  fontWeight: activeTab === id ? 600 : 500,
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Contents */}
      <div className="container" style={{ marginTop: 36 }}>
        {saveSuccessMsg && (
          <div style={{
            background: '#ecfdf5', color: '#16a34a', border: '1px solid #bbf7d0',
            padding: '12px 18px', borderRadius: 12, fontSize: 14, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 8
          }}>
            <CheckCircle size={18} />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <p className="body-md">Loading your campus dashboard...</p>
          </div>
        ) : activeTab === 'listings' ? (
          <div>
            {myListings.length === 0 ? (
              <div className="card" style={{ padding: 48, textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
                <Package size={40} color="var(--ink-muted)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: 18 }}>No gear listed yet</h3>
                <p className="body-md" style={{ marginTop: 6, marginBottom: 20 }}>Share idle gear on campus to earn extra passive pocket money.</p>
                <button onClick={() => onViewChange('list')} className="btn btn-primary">List Your First Item</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
                {myListings.map(p => (
                  <ProductCard key={p.id} product={p} onSelectProduct={onSelectProduct} />
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'bookings' ? (
          <div>
            {myBookings.length === 0 ? (
              <div className="card" style={{ padding: 48, textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
                <Calendar size={40} color="var(--ink-muted)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: 18 }}>No rentals or requests yet</h3>
                <p className="body-md" style={{ marginTop: 6, marginBottom: 20 }}>Browse available gear from verified students across your campus.</p>
                <button onClick={() => onViewChange('search')} className="btn btn-primary">Explore Campus Gear</button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {myBookings.map(b => (
                  <div key={b.id} className="card" style={{ padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div>
                      <span className="badge badge-coral" style={{ marginBottom: 8 }}>{b.status?.toUpperCase() || 'CONFIRMED'}</span>
                      <h4 style={{ fontSize: 18, margin: '4px 0' }}>{b.productTitle || 'Campus Rental Item'}</h4>
                      <p className="body-sm">
                        {b.startDate} to {b.endDate} · Total: ₹{b.totalPrice || 450}
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => onOpenDirectChat?.(b.ownerId || 'user_1', b.ownerName || 'Lender Student', `Rental: ${b.productTitle || 'Gear'}`)}
                        className="btn btn-secondary btn-sm"
                        style={{ borderColor: 'var(--coral)', color: 'var(--coral)' }}
                      >
                        💬 Student Chat
                      </button>
                      <button
                        onClick={() => {
                          setOtpBookingId(b.id);
                          setOtpType('pickup');
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        <Key size={14} /> Enter 4-Digit Handover OTP
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === 'wishlist' ? (
          <div>
            {wishlist.length === 0 ? (
              <div className="card" style={{ padding: 48, textAlign: 'center', maxWidth: 480, margin: '0 auto' }}>
                <Heart size={40} color="var(--ink-muted)" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: 18 }}>Your wishlist is empty</h3>
                <p className="body-md" style={{ marginTop: 6, marginBottom: 20 }}>Click the heart icon on any gear item to save it for later.</p>
                <button onClick={() => onViewChange('search')} className="btn btn-primary">Browse Gear</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 24 }}>
                {wishlist.map(p => (
                  <ProductCard key={p.id} product={p} onSelectProduct={onSelectProduct} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="card" style={{ padding: 32, maxWidth: 620 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h3 style={{ fontSize: 20, margin: 0 }}>Campus Verification Details</h3>
              {!isEditingVerification && (
                <button
                  onClick={() => setIsEditingVerification(true)}
                  className="btn btn-secondary btn-sm"
                  style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <Edit3 size={14} />
                  <span>Update Details</span>
                </button>
              )}
            </div>

            {isEditingVerification ? (
              <form onSubmit={handleSaveVerification} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 6 }}>Registered Email</label>
                  <input type="text" disabled value={user.email} className="input" style={{ background: 'var(--surface-2)', color: 'var(--ink-muted)' }} />
                </div>

                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 6 }}>College / University</label>
                  <input
                    type="text"
                    required
                    value={editCollege}
                    onChange={e => setEditCollege(e.target.value)}
                    placeholder="e.g., IIT Delhi, BITS Pilani, VIT Vellore..."
                    className="input"
                  />
                </div>

                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 6 }}>Hostel Block & Room Number</label>
                  <input
                    type="text"
                    required
                    value={editHostel}
                    onChange={e => setEditHostel(e.target.value)}
                    placeholder="e.g., Karakoram Hostel, Room 214"
                    className="input"
                  />
                </div>

                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 6 }}>Mobile Number</label>
                  <input
                    type="text"
                    required
                    value={editPhone}
                    onChange={e => setEditPhone(e.target.value)}
                    placeholder="9876543210"
                    className="input"
                  />
                </div>

                {phoneChangeOtpStep ? (
                  <div style={{ background: 'var(--surface-2)', padding: 14, borderRadius: 12 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>
                      Enter 6-digit verification code sent to +91 {editPhone}
                    </p>
                    <input
                      type="text"
                      maxLength={6}
                      value={phoneChangeOtpInput}
                      onChange={e => setPhoneChangeOtpInput(e.target.value)}
                      placeholder="6-digit OTP code"
                      className="input"
                      style={{ textAlign: 'center', fontSize: 18, letterSpacing: '0.15em', fontWeight: 700, marginBottom: 12 }}
                    />
                    <div style={{ display: 'flex', gap: 10 }}>
                      <button
                        type="button"
                        onClick={() => setPhoneChangeOtpStep(false)}
                        className="btn btn-secondary"
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        Back
                      </button>
                      <button
                        type="button"
                        onClick={handleVerifyPhoneChange}
                        className="btn btn-primary"
                        style={{ flex: 1, justifyContent: 'center' }}
                      >
                        Verify & Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                    <button type="button" onClick={() => setIsEditingVerification(false)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>
                      <Save size={15} /> Save Details
                    </button>
                  </div>
                )}
              </form>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <span className="label">Registered Email</span>
                  <p style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{user.email}</p>
                </div>
                <div>
                  <span className="label">Campus / University</span>
                  <p style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{user.college || 'Not set yet'}</p>
                </div>
                <div>
                  <span className="label">Hostel & Room</span>
                  <p style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{user.hostel || 'Not set yet'}</p>
                </div>
                <div>
                  <span className="label">Verified Phone</span>
                  <p style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{user.phone || 'Not set yet'}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* OTP Verification Modal */}
      {otpBookingId && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 1000,
          background: 'rgba(15,17,23,0.5)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div className="card" style={{ width: '100%', maxWidth: 400, padding: 28, background: 'var(--surface)' }}>
            <h3 style={{ fontSize: 20, marginBottom: 8 }}>Verify Handover OTP</h3>
            <p className="body-sm" style={{ marginBottom: 20 }}>
              Enter the 4-digit code provided by the other student at pickup/return.
            </p>
            <input
              type="text"
              maxLength={4}
              value={otpInput}
              onChange={e => setOtpInput(e.target.value)}
              placeholder="e.g. 8492"
              className="input"
              style={{ textAlign: 'center', fontSize: 24, letterSpacing: '0.3em', fontFamily: "'Fraunces', serif", marginBottom: 20 }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setOtpBookingId(null)} className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>Cancel</button>
              <button onClick={handleVerifyOtp} className="btn btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Verify OTP</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
