const express = require('express');
const router = express.Router();
const { db, saveDatabase } = require('../db');
const { getUserFromReq } = require('./auth');

// Haversine formula to compute distance in kilometers
function getDistanceKm(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Earth radius km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

router.get('/', (req, res) => {
  const { category, search, college, userLat, userLng } = req.query;
  let filtered = [...db.products];

  if (category && category !== 'All') {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.college.toLowerCase().includes(q)
    );
  }

  if (college && college !== 'All Campuses') {
    filtered = filtered.filter((p) => p.college.toLowerCase().includes(college.toLowerCase()));
  }

  // Attach distanceInKm if userLat & userLng provided
  if (userLat && userLng) {
    const lat = Number(userLat);
    const lng = Number(userLng);
    filtered = filtered.map((item) => ({
      ...item,
      distanceInKm: getDistanceKm(lat, lng, item.lat, item.lng)
    }));
    // Sort nearest first
    filtered.sort((a, b) => (a.distanceInKm || 999) - (b.distanceInKm || 999));
  }

  res.json(filtered);
});

router.get('/nearby', (req, res) => {
  const { lat, lng, radius = 50, category } = req.query;
  let filtered = [...db.products];
  if (category && category !== 'All') {
    filtered = filtered.filter((p) => p.category.toLowerCase() === category.toLowerCase());
  }
  if (lat && lng) {
    filtered = filtered.map((item) => ({
      ...item,
      distanceInKm: getDistanceKm(Number(lat), Number(lng), item.lat, item.lng)
    }));
  }
  res.json(filtered);
});

router.get('/:id', (req, res) => {
  const item = db.products.find((p) => p.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Product not found' });
  res.json(item);
});

router.post('/', (req, res) => {
  const user = getUserFromReq(req);
  if (!user) return res.status(401).json({ error: 'Authentication required' });

  const { title, description, category, condition, rentPricePerDay, deposit, images, college, hostel, lat, lng } = req.body;
  const newProduct = {
    id: `prod_in_${Date.now()}`,
    title,
    description,
    category,
    condition: condition || 'Like New',
    rentPricePerDay: Number(rentPricePerDay),
    deposit: Number(deposit || 0),
    images: images || ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'],
    college: college || user.college,
    hostel: hostel || user.hostel,
    availability: true,
    ownerId: user.id,
    ownerName: user.name,
    ownerRating: user.rating || 5.0,
    ownerPhone: user.phone || '+91 98000 00000',
    ownerEmail: user.email,
    lat: lat ? Number(lat) : 28.5450 + (Math.random() - 0.5) * 0.01,
    lng: lng ? Number(lng) : 77.1926 + (Math.random() - 0.5) * 0.01,
    fraudScore: Number(rentPricePerDay) < 30 ? 7 : 1,
    fraudReasons: Number(rentPricePerDay) < 30 ? ['Price significantly below Indian campus category benchmark'] : []
  };

  db.products.unshift(newProduct);
  saveDatabase(db);
  res.status(201).json(newProduct);
});

router.put('/:id', (req, res) => {
  const item = db.products.find((p) => p.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Not found' });
  Object.assign(item, req.body);
  saveDatabase(db);
  res.json(item);
});

router.delete('/:id', (req, res) => {
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'Not found' });
  db.products.splice(index, 1);
  saveDatabase(db);
  res.json({ success: true });
});

module.exports = router;
