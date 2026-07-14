const express = require('express');
const router = express.Router();
const { db, saveDatabase } = require('../db');
const { getUserFromReq } = require('./auth');

router.get('/wishlist', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  const userWishlistIds = db.wishlist[user.id] || [];
  const items = db.products.filter((p) => userWishlistIds.includes(p.id));
  res.json(items);
});

router.post('/wishlist/toggle', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Not authenticated' });
  const { productId } = req.body;
  if (!db.wishlist[user.id]) db.wishlist[user.id] = [];
  const idx = db.wishlist[user.id].indexOf(productId);
  if (idx > -1) {
    db.wishlist[user.id].splice(idx, 1);
  } else {
    db.wishlist[user.id].push(productId);
  }
  saveDatabase(db);
  res.json({ success: true, wishlistIds: db.wishlist[user.id] });
});

router.get('/messages', (req, res) => {
  const user = getUserFromReq(req);
  const { peerId } = req.query;
  let msgs = db.messages || [];
  if (user && peerId) {
    msgs = msgs.filter(m =>
      (m.senderId === user.id && m.recipientId === peerId) ||
      (m.senderId === peerId && m.recipientId === user.id)
    );
  } else if (peerId) {
    // Demo/unauthenticated — return canned messages for any peer
    msgs = db.messages.filter(m => m.recipientId === peerId || m.senderId === peerId).slice(0, 10);
  }
  res.json(msgs);
});

router.post('/messages', (req, res) => {
  const user = getUserFromReq(req);
  const { recipientId, text } = req.body;
  if (!text || !text.trim()) return res.status(400).json({ error: 'Message text required' });
  const newMsg = {
    id: `msg_${Date.now()}`,
    senderId: user ? user.id : 'guest',
    senderName: user ? user.name : 'You',
    recipientId: recipientId || 'peer',
    text: text.trim(),
    createdAt: new Date().toISOString()
  };
  if (!db.messages) db.messages = [];
  db.messages.push(newMsg);
  saveDatabase(db);
  res.status(201).json(newMsg);
});

module.exports = router;
