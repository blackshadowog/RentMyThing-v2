import React, { useState } from 'react';
import { X, ShieldCheck, ArrowRight, Key, MapPin, CheckCircle, ShieldAlert, Mail, Smartphone, Save } from 'lucide-react';
import { api } from '../api';
import { triggerGoogleSignIn } from '../googleAuth';
import LogoIcon from './LogoIcon';

export default function AuthModal({ onClose, onSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [college, setCollege] = useState('');
  const [hostel, setHostel] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [deliveryNotice, setDeliveryNotice] = useState('');
  
  // Geolocation auto-detect state
  const [detectingLoc, setDetectingLoc] = useState(false);
  const [locSuccessMessage, setLocSuccessMessage] = useState('');

  // Email & Mobile OTP Verification Step state
  const [otpStep, setOtpStep] = useState(false);
  const [emailOtpInput, setEmailOtpInput] = useState('');
  const [mobileOtpInput, setMobileOtpInput] = useState('');
  const [devEmailCode, setDevEmailCode] = useState('');
  const [devSmsCode, setDevSmsCode] = useState('');

  // Google Sign-In Profile Completion Step state
  const [googleCompletionStep, setGoogleCompletionStep] = useState(false);
  const [googleUserTemp, setGoogleUserTemp] = useState(null);
  const [googleMobileOtpSent, setGoogleMobileOtpSent] = useState(false);
  const [googleMobileOtpInput, setGoogleMobileOtpInput] = useState('');

  const indianCampusesList = [
    'IIT Delhi - Hauz Khas Campus, New Delhi',
    'IIT Bombay - Powai Campus, Mumbai',
    'IIT Madras - Adyar Campus, Chennai',
    'IIT Kanpur - Kalyanpur Campus, Kanpur',
    'IIT Kharagpur - Kharagpur Campus, West Bengal',
    'IIT Roorkee - Roorkee Campus, Uttarakhand',
    'IIT Guwahati - North Guwahati Campus, Assam',
    'IIT Hyderabad - Kandi Campus, Telangana',
    'BITS Pilani - Vidya Vihar Campus, Rajasthan',
    'BITS Pilani - Goa Campus, Zuarinagar',
    'BITS Pilani - Hyderabad Campus, Jawaharnagar',
    'IIM Ahmedabad - Vastrapur Campus, Gujarat',
    'IIM Bangalore - Bannerghatta Campus, Karnataka',
    'IIM Calcutta - Joka Campus, Kolkata',
    'Delhi University - North Campus, New Delhi',
    'Delhi University - South Campus, New Delhi',
    'VIT Vellore - Katpadi Main Campus, Tamil Nadu',
    'SRM Institute of Science and Technology - Kattankulathur Campus',
    'Manipal Academy of Higher Education - Manipal Campus',
    'Amity University - Noida Main Campus, Uttar Pradesh',
    'IIIT Hyderabad - Gachibowli Campus, Telangana',
    'NIT Trichy - Tiruchirappalli Campus, Tamil Nadu',
    'NIT Surathkal - Srinivasnagar Campus, Karnataka',
    'NIT Warangal - Hanamkonda Campus, Telangana',
    'Jadavpur University - Main Campus, Kolkata',
    'Thapar Institute of Engineering and Technology - Patiala Campus',
    'Anna University - Guindy Campus, Chennai',
    'Pune University (Savitribai Phule Pune University)',
    'Mumbai University - Kalina Campus, Mumbai',
    'IISc Bangalore - Malleshwaram Campus, Karnataka',
    'Lovely Professional University (LPU) - Phagwara Campus',
    'Chandigarh University - Gharuan Campus, Punjab',
  ];

  const handleAutoDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setDetectingLoc(true);
    setError('');
    setLocSuccessMessage('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`
          );
          const data = await response.json();
          const addr = data.address || {};
          const city = addr.city || addr.town || addr.suburb || addr.state_district || addr.state || 'India';
          const detectedCampus = addr.university || addr.college || `${city} University Campus`;
          const detectedArea = `${addr.suburb || addr.neighbourhood || city}, Room/Hostel`;

          setCollege(detectedCampus);
          setHostel(detectedArea);
          setLocSuccessMessage(`📍 Detected Campus location: ${detectedCampus} (${city})`);
        } catch (err) {
          setError('Could not reverse geocode coordinates. Please enter your college name manually.');
        } finally {
          setDetectingLoc(false);
        }
      },
      (err) => {
        setDetectingLoc(false);
        setError('Location access denied. Please type your college or university manually.');
      },
      { timeout: 10000 }
    );
  };

  const handleSendOtps = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      setLoading(false);
      return;
    }

    try {
      const emailRes = await api.sendOtp(email);
      const smsRes = await api.sendMobileOtp(phone);
      setDevEmailCode(emailRes?.devOtpCode || '');
      setDevSmsCode(smsRes?.devMobileOtpCode || '');
      setOtpStep(true);

      const notes = [];
      if (emailRes?.delivery && !emailRes.delivery.sent) {
        notes.push(`Email Notice: ${emailRes.delivery.reason || 'Check SMTP settings'}`);
      }
      if (smsRes?.delivery && !smsRes.delivery.sent) {
        notes.push(`SMS Notice: ${smsRes.delivery.reason || 'Check Fast2SMS balance/key'}`);
      }
      if (notes.length > 0) {
        setDeliveryNotice(notes.join(' | '));
      } else {
        setDeliveryNotice('');
      }
    } catch (err) {
      setError(err.message || 'Failed to send verification codes. Check if account already exists.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyDualOtpAndRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.verifyOtp(email, emailOtpInput);
      await api.verifyMobileOtp(phone, mobileOtpInput);

      const res = await api.register({
        email,
        name,
        college,
        hostel,
        phone,
        otpVerified: true,
        mobileVerified: true
      });
      onSuccess(res.user);
    } catch (err) {
      setError(err.message || 'OTP verification failed. Please check both codes.');
    } finally {
      setLoading(false);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.login(email);
      onSuccess(res.user);
    } catch (err) {
      setError(err.message || 'Login failed. Account not found.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (googleUser) => {
    setGoogleLoading(true);
    setError('');
    try {
      const res = await api.googleAuth({
        email: googleUser.email,
        name: googleUser.name,
        avatar: googleUser.picture || googleUser.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${googleUser.email}`,
        googleId: googleUser.sub || googleUser.email,
      });

      if (res.needsCompletion || !res.user.college || !res.user.phone) {
        setGoogleUserTemp(res.user);
        setCollege(res.user.college || '');
        setHostel(res.user.hostel || '');
        setPhone(res.user.phone || '');
        setGoogleCompletionStep(true);
        setGoogleMobileOtpSent(false);
        setGoogleLoading(false);
        return;
      }

      onSuccess(res.user);
    } catch (err) {
      setError('Google sign-in failed: ' + err.message);
      setGoogleLoading(false);
    }
  };

  const handleSaveGoogleCompletion = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const cleanPhone = phone.replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      setLoading(false);
      return;
    }
    if (!college.trim()) {
      setError('Please enter your College or University name.');
      setLoading(false);
      return;
    }

    try {
      if (!googleMobileOtpSent) {
        // Step 1: Send Mobile OTP code to verify mobile number before completing Google account
        await api.sendMobileOtp(cleanPhone);
        setGoogleMobileOtpSent(true);
        setLoading(false);
        return;
      }

      // Step 2: Verify Mobile OTP
      await api.verifyMobileOtp(cleanPhone, googleMobileOtpInput);

      const updatedUser = {
        ...googleUserTemp,
        college: college.trim(),
        hostel: hostel.trim(),
        phone: cleanPhone,
      };
      localStorage.setItem('rt_user', JSON.stringify(updatedUser));
      try {
        await api.updateProfile({
          college: college.trim(),
          hostel: hostel.trim(),
          phone: cleanPhone,
        });
      } catch (e) {}
      onSuccess(updatedUser);
    } catch (err) {
      setError(err.message || 'Verification failed. Mobile number may already exist on another account.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleClick = () => {
    setGoogleLoading(true);
    setError('');
    triggerGoogleSignIn(
      handleGoogleSuccess,
      (err) => {
        setGoogleLoading(false);
      }
    );
  };

  const handleFastLogin = async (testEmail) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.login(testEmail);
      onSuccess(res.user);
    } catch (err) {
      setError('Login failed. Check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1100,
      background: 'rgba(15,17,23,0.5)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
    }} className="anim-in">
      <div className="card" style={{
        width: '100%', maxWidth: 480, maxHeight: '92vh', overflowY: 'auto',
        padding: 32, position: 'relative', background: 'var(--surface)',
      }}>
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-muted)' }}
        >
          <X size={20} />
        </button>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <LogoIcon size={68} style={{ margin: '0 auto 12px' }} />
          <h2 style={{ fontSize: 24, marginBottom: 6 }}>
            {googleCompletionStep
              ? 'Complete Your Student Profile'
              : isLogin
              ? 'Sign In to Campus'
              : 'Create Campus Account'}
          </h2>
          <p className="body-sm">
            {googleCompletionStep
              ? 'Please provide your campus details & verify mobile number.'
              : isLogin
              ? 'Welcome back! Sign in to continue.'
              : 'Strict 1-Account Policy: Email, Google ID & Mobile are uniquely verified.'}
          </p>
        </div>

        {error && (
          <div className="badge badge-coral" style={{ width: '100%', padding: 12, marginBottom: 16, borderRadius: 12 }}>
            {error}
          </div>
        )}

        {locSuccessMessage && (
          <div style={{
            background: '#ecfdf5', color: '#16a34a', border: '1px solid #bbf7d0',
            padding: '10px 14px', borderRadius: 10, fontSize: 13, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8
          }}>
            <CheckCircle size={16} />
            <span>{locSuccessMessage}</span>
          </div>
        )}

        {googleCompletionStep ? (
          /* GOOGLE SIGN-IN PROFILE COMPLETION & MOBILE OTP STEP */
          <form onSubmit={handleSaveGoogleCompletion} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ background: 'var(--surface-2)', padding: 12, borderRadius: 10, fontSize: 13, color: 'var(--ink)' }}>
              <strong>Google Account:</strong> {googleUserTemp?.email}
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <label className="label">College / University</label>
                <button
                  type="button"
                  onClick={handleAutoDetectLocation}
                  disabled={detectingLoc || googleMobileOtpSent}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--coral)', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4
                  }}
                >
                  <MapPin size={14} />
                  <span>{detectingLoc ? 'Detecting Campus...' : 'Auto-Detect My Campus'}</span>
                </button>
              </div>
              <input
                type="text"
                list="indian-campuses-datalist"
                required
                disabled={googleMobileOtpSent}
                value={college}
                onChange={e => setCollege(e.target.value)}
                placeholder="Type your College or University name..."
                className="input"
                autoComplete="organization"
              />
              <datalist id="indian-campuses-datalist">
                {indianCampusesList.map(c => <option key={c} value={c} />)}
              </datalist>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: 4 }}>Hostel & Room</label>
                <input
                  type="text"
                  required
                  disabled={googleMobileOtpSent}
                  value={hostel}
                  onChange={e => setHostel(e.target.value)}
                  placeholder="Hostel Block, Room"
                  className="input"
                  autoComplete="address-line1"
                />
              </div>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: 4 }}>Mobile Number (10 Digits)</label>
                <input
                  type="text"
                  required
                  disabled={googleMobileOtpSent}
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="9876543210"
                  className="input"
                  autoComplete="tel"
                />
              </div>
            </div>

            {googleMobileOtpSent && (
              <div style={{ background: 'var(--surface-2)', padding: 14, borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <Smartphone size={18} color="var(--coral)" />
                  <span style={{ fontSize: 13, fontWeight: 700 }}>Mobile OTP sent to +91 {phone}</span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={googleMobileOtpInput}
                  onChange={e => setGoogleMobileOtpInput(e.target.value)}
                  placeholder="Enter 6-digit Mobile OTP"
                  className="input"
                  style={{ textAlign: 'center', fontSize: 18, letterSpacing: '0.15em', fontWeight: 700 }}
                />
              </div>
            )}

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
              <Save size={16} />
              <span>
                {loading
                  ? 'Verifying...'
                  : googleMobileOtpSent
                  ? 'Verify Mobile OTP & Complete Account'
                  : 'Next: Verify Mobile Number'}
              </span>
            </button>
          </form>
        ) : isLogin ? (
          /* LOGIN FORM */
          <>
            <div style={{ marginBottom: 20 }}>
              <button
                onClick={handleGoogleClick}
                disabled={googleLoading}
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{googleLoading ? 'Connecting Google Account...' : 'Sign in with Google'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span className="label" style={{ fontSize: 10 }}>or email address</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: 4 }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@college.ac.in or gmail.com"
                  className="input"
                  autoComplete="email"
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                <span>{loading ? 'Signing In...' : 'Sign In to Marketplace'}</span>
                {!loading && <ArrowRight size={15} />}
              </button>
            </form>
          </>
        ) : !otpStep ? (
          /* REGISTRATION STEP 1: CLEAN USER DETAILS */
          <>
            <div style={{ marginBottom: 20 }}>
              <button
                onClick={handleGoogleClick}
                disabled={googleLoading}
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%', justifyContent: 'center', padding: '13px' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>{googleLoading ? 'Connecting Google Account...' : 'Sign up with Google'}</span>
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '18px 0' }}>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
              <span className="label" style={{ fontSize: 10 }}>or email address</span>
              <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
            </div>

            <form onSubmit={handleSendOtps} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div>
                <label className="label" style={{ display: 'block', marginBottom: 4 }}>Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@college.ac.in or gmail.com"
                  className="input"
                  autoComplete="email"
                />
              </div>

              <div>
                <label className="label" style={{ display: 'block', marginBottom: 4 }}>Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="input"
                  autoComplete="name"
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                  <label className="label">College / University</label>
                  <button
                    type="button"
                    onClick={handleAutoDetectLocation}
                    disabled={detectingLoc}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: 'var(--coral)', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4
                    }}
                  >
                    <MapPin size={14} />
                    <span>{detectingLoc ? 'Detecting Campus...' : 'Auto-Detect My Campus'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  list="indian-campuses-datalist"
                  required
                  value={college}
                  onChange={e => setCollege(e.target.value)}
                  placeholder="Type your College or University name..."
                  className="input"
                  autoComplete="organization"
                />
                <datalist id="indian-campuses-datalist">
                  {indianCampusesList.map(c => <option key={c} value={c} />)}
                </datalist>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 4 }}>Hostel & Room</label>
                  <input
                    type="text"
                    required
                    value={hostel}
                    onChange={e => setHostel(e.target.value)}
                    placeholder="Hostel Block, Room"
                    className="input"
                    autoComplete="address-line1"
                  />
                </div>
                <div>
                  <label className="label" style={{ display: 'block', marginBottom: 4 }}>Mobile Number (10 Digits)</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="9876543210"
                    className="input"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }}>
                <span>{loading ? 'Sending Verification Codes...' : 'Next: Verify Email & Mobile'}</span>
                {!loading && <ArrowRight size={15} />}
              </button>
            </form>
          </>
        ) : (
          /* REGISTRATION STEP 2: DUAL EMAIL & MOBILE OTP VERIFICATION */
          <form onSubmit={handleVerifyDualOtpAndRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {deliveryNotice && (
              <div style={{
                background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a',
                padding: '10px 14px', borderRadius: 10, fontSize: 12, lineHeight: 1.4
              }}>
                <div style={{ marginBottom: 8 }}>
                  <strong>Delivery Diagnostics:</strong> {deliveryNotice}
                </div>
                {(devEmailCode || devSmsCode) && (
                  <button
                    type="button"
                    onClick={() => {
                      if (devEmailCode) setEmailOtpInput(devEmailCode);
                      if (devSmsCode) setMobileOtpInput(devSmsCode);
                    }}
                    style={{
                      background: '#f59e0b', color: '#fff', border: 'none',
                      padding: '6px 12px', borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    ⚡ Auto-Fill Testing OTPs (Bypass Free Tier Block)
                  </button>
                )}
              </div>
            )}
            <div style={{ background: 'var(--surface-2)', padding: 14, borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Mail size={18} color="var(--coral)" />
                <span style={{ fontSize: 13, fontWeight: 700 }}>Email OTP sent to {email}</span>
              </div>
              <input
                type="text"
                maxLength={6}
                required
                value={emailOtpInput}
                onChange={e => setEmailOtpInput(e.target.value)}
                placeholder="Enter 6-digit Email OTP"
                className="input"
                style={{ textAlign: 'center', fontSize: 18, letterSpacing: '0.15em', fontWeight: 700 }}
              />
            </div>

            <div style={{ background: 'var(--surface-2)', padding: 14, borderRadius: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <Smartphone size={18} color="var(--coral)" />
                <span style={{ fontSize: 13, fontWeight: 700 }}>Mobile OTP sent to +91 {phone}</span>
              </div>
              <input
                type="text"
                maxLength={6}
                required
                value={mobileOtpInput}
                onChange={e => setMobileOtpInput(e.target.value)}
                placeholder="Enter 6-digit Mobile OTP"
                className="input"
                style={{ textAlign: 'center', fontSize: 18, letterSpacing: '0.15em', fontWeight: 700 }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <CheckCircle size={16} />
              <span>{loading ? 'Verifying Both OTPs...' : 'Complete Verification & Create Account'}</span>
            </button>

            <button
              type="button"
              onClick={() => setOtpStep(false)}
              className="btn btn-ghost"
              style={{ width: '100%', justifyContent: 'center', fontSize: 13 }}
            >
              ← Back to Edit Details
            </button>
          </form>
        )}

        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setLocSuccessMessage('');
              setOtpStep(false);
              setGoogleCompletionStep(false);
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600, color: 'var(--coral)' }}
          >
            {isLogin ? 'New to RentMyThing? Create verified account →' : 'Already registered? Sign in →'}
          </button>
        </div>

        {/* Quick test profiles */}
        <div className="card-flat" style={{ padding: 16, marginTop: 20 }}>
          <p className="label" style={{ marginBottom: 10 }}>⚡ Quick Test Profiles</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { email: 'aravind.sharma@iitd.ac.in', name: 'Aravind (IITD Host)' },
              { email: 'priya.nair@iitb.ac.in', name: 'Priya (IITB Borrower)' },
              { email: 'rohan.verma@pilani.bits-pilani.ac.in', name: 'Rohan (BITS Pilani)' },
              { email: 'admin@rentmything.in', name: 'Admin Control' },
            ].map(({ email: e, name: n }) => (
              <button
                key={e}
                type="button"
                onClick={() => handleFastLogin(e)}
                style={{
                  padding: '8px 10px', borderRadius: 10, border: '1px solid var(--border)',
                  background: 'var(--surface)', textAlign: 'left', cursor: 'pointer',
                }}
              >
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink)', display: 'block' }}>{n}</span>
                <span style={{ fontSize: 10, color: 'var(--ink-muted)' }}>{e.split('@')[0]}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
