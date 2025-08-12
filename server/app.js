// server/app.js
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');

const app = express();

// ✅ Log current directory and .env status
console.log('📁 Server running from:', __dirname);
console.log('📄 Loading .env from:', path.join(__dirname, '.env'));

// ✅ Check if .env file exists
const fs = require('fs');
if (fs.existsSync(path.join(__dirname, '.env'))) {
  console.log('✅ .env file found');
} else {
  console.error('❌ .env file NOT found at:', path.join(__dirname, '.env'));
}

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
  const indexPath = path.join(__dirname, '../index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      console.error('🚫 Failed to serve index.html:', err.message);
      res.status(404).send('Page not found');
    } else {
      console.log('✅ Served index.html');
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`🔧 API: http://localhost:${PORT}/api/applications`);
  console.log('📧 EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
  console.log('📧 RECEIVER_EMAIL:', process.env.RECEIVER_EMAIL || 'undefined');
});