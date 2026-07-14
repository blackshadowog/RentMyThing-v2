const express = require('express');
const router = express.Router();
const { db, saveDatabase } = require('../db');
const { getUserFromReq } = require('./auth');

router.get('/', (req, res) => {
  res.json(db.requests);
});

router.post('/', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  const { title, description, category, budget, duration, pickupDate } = req.body;
  const newReq = {
    id: `req_in_${Date.now()}`,
    userId: user.id,
    userName: user.name,
    userCollege: user.college,
    userHostel: user.hostel,
    title,
    description,
    category,
    budget: Number(budget),
    duration: Number(duration || 1),
    pickupDate,
    status: 'OPEN',
    offersCount: 0,
    createdAt: new Date().toISOString()
  };
  db.requests.unshift(newReq);
  saveDatabase(db);
  res.status(201).json(newReq);
});

router.post('/:id/offer', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  const { price, message } = req.body;
  const reqItem = db.requests.find((r) => r.id === req.params.id);
  if (reqItem) {
    reqItem.offersCount = (reqItem.offersCount || 0) + 1;
  }
  const offer = {
    id: `off_in_${Date.now()}`,
    requestId: req.params.id,
    ownerId: user.id,
    ownerName: user.name,
    price: Number(price),
    message,
    status: 'PENDING',
    createdAt: new Date().toISOString()
  };
  db.requestOffers.push(offer);
  saveDatabase(db);
  res.status(201).json(offer);
});

router.get('/my-requests', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  const myReqs = db.requests.filter((r) => r.userId === user.id);
  res.json(myReqs);
});

module.exports = router;
