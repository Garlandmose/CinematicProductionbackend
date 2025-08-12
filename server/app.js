// server/app.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();

// ✅ Middleware
app.use(cors({ origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Serve static files from project root (where index.html, css/, js/, images/ are)
app.use(express.static(path.join(__dirname, '..')));

// ✅ API Routes
const applicationRoutes = require('./routes/applications');
app.use('/api/applications', applicationRoutes);

// ✅ Fallback: All non-API routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'), (err) => {
    if (err) {
      console.error('File not found:', err.message);
      res.status(404).send('Page not found');
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api/applications`);
});