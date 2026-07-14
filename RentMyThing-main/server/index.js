require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const { router: authRoutes } = require('./routes/auth');
const productRoutes = require('./routes/products');
const bookingRoutes = require('./routes/bookings');
const socialRoutes = require('./routes/social');
const adminRoutes = require('./routes/admin');
const aiRoutes = require('./routes/ai');
const requestRoutes = require('./routes/requests');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api', socialRoutes); // /api/wishlist, /api/messages
app.use('/api/admin', adminRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/requests', requestRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Serve static frontend build (dist) in production unified deployment
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Express 5 compatible catch-all handler for React SPA routing & status page
app.use((req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API route not found' });
  }
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>RentMyThing India · API Status</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f8fafc; color: #0f172a; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
          .card { background: white; padding: 40px; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); max-width: 500px; text-align: center; border: 1px solid #e2e8f0; }
          h1 { font-size: 24px; margin-bottom: 12px; color: #16a34a; }
          p { color: #475569; line-height: 1.6; }
          code { background: #f1f5f9; padding: 4px 8px; border-radius: 6px; font-weight: bold; color: #0f172a; }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>🚀 RentMyThing API Server is Live!</h1>
          <p>Your backend server and AI Fraud Detection routes are running perfectly.</p>
          <p>To serve your React frontend here automatically, ensure your Render <strong>Build Command</strong> is set to:</p>
          <p><code>npm install && npm run build</code></p>
        </div>
      </body>
    </html>
  `);
});

app.listen(PORT, () => {
  console.log(`RentMyThing AI Backend + Unified Web Server running on port ${PORT}`);
});
