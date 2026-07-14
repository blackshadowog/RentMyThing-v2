const express = require('express');
const router = express.Router();
const { db, saveDatabase } = require('../db');
const { sendRealEmailOTP, sendRealSmsOTP } = require('../utils/notifier');

// In-memory OTP storage for email & mobile verification
const otpStore = {};
const mobileOtpStore = {};

const getUserFromReq = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  return db.users.find((u) => u.id === token || u.email.toLowerCase() === token.toLowerCase()) || null;
};

const cleanDigits = (str = '') => str.replace(/\D/g, '').slice(-10);

// Send Email Verification OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email address is required' });
  }
  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email.toLowerCase()] = {
    otp: generatedOtp,
    expires: Date.now() + 10 * 60 * 1000
  };
  
  // Deliver real live OTP email via Nodemailer/SMTP
  const emailRes = await Promise.race([
    sendRealEmailOTP(email, generatedOtp),
    new Promise((resolve) => setTimeout(() => resolve({ sent: false, reason: 'SMTP handshake timeout (>15s)' }), 15000))
  ]);

  res.json({
    success: true,
    message: `Verification code sent to ${email}`,
    devOtpCode: generatedOtp,
    delivery: emailRes
  });
});

// Verify Email Verification OTP
router.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP code are required' });
  }
  const record = otpStore[email.toLowerCase()];
  if (!record || record.expires < Date.now()) {
    return res.status(400).json({ error: 'Verification OTP has expired or is invalid. Please request a new code.' });
  }
  if (record.otp !== otp.trim()) {
    return res.status(400).json({ error: 'Incorrect 6-digit OTP code. Please check and try again.' });
  }
  delete otpStore[email.toLowerCase()];
  res.json({ success: true, verified: true });
});

// Send Mobile OTP Verification
router.post('/send-mobile-otp', async (req, res) => {
  const { phone } = req.body;
  const cleanPhone = cleanDigits(phone);
  if (!cleanPhone || cleanPhone.length < 10) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
  }

  // Check uniqueness: ensure no existing account already uses this mobile number
  const existingPhoneUser = db.users.find((u) => cleanDigits(u.phone) === cleanPhone);
  if (existingPhoneUser) {
    return res.status(409).json({
      error: 'An account with this mobile number already exists! Please Sign In instead.'
    });
  }

  const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
  mobileOtpStore[cleanPhone] = {
    otp: generatedOtp,
    expires: Date.now() + 10 * 60 * 1000
  };
  
  // Deliver real SMS/WhatsApp OTP
  const smsRes = await Promise.race([
    sendRealSmsOTP(cleanPhone, generatedOtp),
    new Promise((resolve) => setTimeout(() => resolve({ sent: false, reason: 'Fast2SMS gateway timeout (>15s)' }), 15000))
  ]);

  res.json({
    success: true,
    message: `6-digit verification code sent to mobile +91 ${cleanPhone}`,
    devMobileOtpCode: generatedOtp,
    delivery: smsRes
  });
});

// Verify Mobile OTP
router.post('/verify-mobile-otp', (req, res) => {
  const { phone, otp } = req.body;
  const cleanPhone = cleanDigits(phone);
  if (!cleanPhone || !otp) {
    return res.status(400).json({ error: 'Mobile number and OTP code are required' });
  }
  const record = mobileOtpStore[cleanPhone];
  if (!record || record.expires < Date.now()) {
    return res.status(400).json({ error: 'Mobile OTP has expired or is invalid.' });
  }
  if (record.otp !== otp.trim()) {
    return res.status(400).json({ error: 'Incorrect 6-digit mobile OTP code.' });
  }
  delete mobileOtpStore[cleanPhone];
  res.json({ success: true, mobileVerified: true });
});

router.post('/login', (req, res) => {
  const { email } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === (email || '').toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'Student account not found. Please click Create Campus Account to sign up.' });
  }
  res.json({ token: user.id, user });
});

router.post('/register', (req, res) => {
  const { email, name, college, hostel, phone, otpVerified, mobileVerified } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Email and Full Name are required' });
  }

  const cleanPhone = cleanDigits(phone);
  if (!cleanPhone || cleanPhone.length < 10) {
    return res.status(400).json({ error: 'Please enter a valid 10-digit mobile number.' });
  }

  // ENFORCE TRIPLE UNIQUENESS (No duplicate email OR duplicate mobile number)
  const existingEmailUser = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existingEmailUser) {
    return res.status(409).json({
      error: 'An account with this email address already exists! Please switch to Sign In.'
    });
  }

  const existingPhoneUser = db.users.find((u) => cleanDigits(u.phone) === cleanPhone);
  if (existingPhoneUser) {
    return res.status(409).json({
      error: 'An account with this mobile number already exists! Please use a different number or Sign In.'
    });
  }

  const user = {
    id: `user_${Date.now()}`,
    email: email.toLowerCase(),
    name: name.trim(),
    role: 'STUDENT',
    college: college || 'Campus Student',
    hostel: hostel || 'Hostel Room',
    phone: cleanPhone,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    isVerified: true,
    verificationIdType: otpVerified ? 'Dual OTP Verified Student Member' : 'Verified Campus Network Member',
    rating: 5.0,
    completedRentals: 0,
    joinedDate: new Date().toISOString().split('T')[0]
  };
  db.users.push(user);
  saveDatabase(db);
  res.status(201).json({ token: user.id, user });
});

// Google Authentication Endpoint with Profile Completion & Uniqueness Protection
router.post('/google', (req, res) => {
  const { email, name, avatar, college, hostel, phone, googleId } = req.body;
  if (!email) return res.status(400).json({ error: 'Google email required' });

  let user = db.users.find((u) =>
    u.email.toLowerCase() === email.toLowerCase() ||
    (googleId && u.googleId === googleId)
  );

  if (user) {
    const hasDetails = user.college &&
      user.phone &&
      user.college !== 'Indian University Campus' &&
      !user.hostel?.includes('Hostel / Residence') &&
      !user.phone?.includes('00000');

    return res.json({
      token: user.id,
      user,
      needsCompletion: !hasDetails
    });
  }

  // If first time Google Sign Up, check if phone provided already exists on another account
  const cleanPhone = cleanDigits(phone);
  if (cleanPhone && cleanPhone.length === 10) {
    const existingPhoneUser = db.users.find((u) => cleanDigits(u.phone) === cleanPhone);
    if (existingPhoneUser) {
      return res.status(409).json({
        error: 'An account with this mobile number already exists!'
      });
    }
  }

  user = {
    id: `user_g_${Date.now()}`,
    googleId: googleId || `g_${email.toLowerCase()}`,
    email: email.toLowerCase(),
    name: name || email.split('@')[0],
    role: 'STUDENT',
    college: college || '',
    hostel: hostel || '',
    phone: cleanPhone || '',
    avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(email)}`,
    isVerified: true,
    verificationIdType: 'Google SSO Verified Student',
    rating: 5.0,
    completedRentals: 0,
    joinedDate: new Date().toISOString().split('T')[0]
  };
  db.users.push(user);
  saveDatabase(db);
  res.json({ token: user.id, user, needsCompletion: true });
});

router.get('/me', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  res.json(user);
});

router.put('/profile', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  const { name, college, hostel, phone } = req.body;
  if (name) user.name = name;
  if (college) user.college = college;
  if (hostel) user.hostel = hostel;
  if (phone) {
    const cleanPhone = cleanDigits(phone);
    const conflict = db.users.find((u) => u.id !== user.id && cleanDigits(u.phone) === cleanPhone);
    if (conflict) {
      return res.status(409).json({ error: 'Mobile number already linked to another account.' });
    }
    user.phone = cleanPhone;
  }
  saveDatabase(db);
  res.json(user);
});

module.exports = { router, getUserFromReq };
