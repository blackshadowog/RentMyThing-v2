const express = require('express');
const router = express.Router();
const { db } = require('../db');

router.get('/stats', (req, res) => {
  const flagged = db.products.filter((p) => p.fraudScore >= 4).length;
  res.json({
    totalProducts: db.products.length,
    totalUsers: db.users.length,
    totalBookings: db.bookings.length,
    flaggedListings: flagged
  });
});

router.get('/reports', (req, res) => {
  res.json([
    { id: 'rep_in_1', productId: 'prod_in_4', reason: 'Verified Authentic IIT Delhi Listing', status: 'AUDITED_SAFE' }
  ]);
});

router.get('/users', (req, res) => {
  res.json(db.users);
});

module.exports = router;
