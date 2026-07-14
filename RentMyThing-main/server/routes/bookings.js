const express = require('express');
const router = express.Router();
const { db, saveDatabase } = require('../db');
const { getUserFromReq } = require('./auth');

router.post('/', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });

  const { productId, startDate, endDate, totalPrice } = req.body;
  const product = db.products.find((p) => p.id === productId);
  if (!product) return res.status(404).json({ error: 'Product not found' });

  const owner = db.users.find((u) => u.id === product.ownerId) || {};

  const newBooking = {
    id: `book_in_${Date.now()}`,
    productId,
    productTitle: product.title,
    renterId: user.id,
    renterName: user.name,
    renterEmail: user.email,
    renterPhone: user.phone || '+91 98000 00000',
    renterHostel: user.hostel,
    ownerId: product.ownerId,
    ownerName: product.ownerName,
    ownerEmail: owner.email || product.ownerEmail,
    ownerPhone: owner.phone || product.ownerPhone || '+91 98000 00000',
    ownerHostel: product.hostel,
    startDate,
    endDate,
    totalPrice: Number(totalPrice),
    status: 'APPROVED',
    pickupCode: String(Math.floor(1000 + Math.random() * 9000)),
    returnCode: String(Math.floor(1000 + Math.random() * 9000)),
    createdAt: new Date().toISOString()
  };

  db.bookings.unshift(newBooking);
  saveDatabase(db);
  res.status(201).json(newBooking);
});

router.get('/my-rentals', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  const myRentals = db.bookings.filter((b) => b.renterId === user.id);
  res.json(myRentals);
});

router.get('/my-listings', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  const myListings = db.products.filter((p) => p.ownerId === user.id);
  res.json(myListings);
});

router.post('/:id/pickup', (req, res) => {
  const booking = db.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  booking.status = 'ACTIVE';
  saveDatabase(db);
  res.json(booking);
});

router.post('/:id/return', (req, res) => {
  const booking = db.bookings.find((b) => b.id === req.params.id);
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  booking.status = 'COMPLETED';
  saveDatabase(db);
  res.json(booking);
});

module.exports = router;
