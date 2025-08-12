// server/routes/applications.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sendEmail = require('../utils/sendEmail');

// ✅ Ensure uploads folder exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Created uploads folder:', uploadDir);
}

// ✅ Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.pdf', '.doc', '.docx'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error(`Invalid file type: ${ext}. Only PDF, DOC, DOCX allowed.`));
    }
  }
});

// ✅ POST /api/applications
router.post('/', upload.single('resume'), async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      dob,
      emergencyName,
      emergencyPhone,
      role,
      experience,
      availability
    } = req.body;
    const resume = req.file;

    // 🔴 Validation
    if (!name || !email || !role || !resume) {
      return res.status(400).json({
        message: 'Missing required fields: name, email, role, or resume.'
      });
    }

    // ✅ Send email with all data
    await sendEmail({
      name,
      email,
      phone: phone || 'Not provided',
      address: address || 'Not provided',
      dob: dob || 'Not provided',
      emergencyName: emergencyName || 'Not provided',
      emergencyPhone: emergencyPhone || 'Not provided',
      role,
      experience: experience || 'None',
      availability: availability || 'Not specified',
      resumePath: resume.path,
      resumeName: resume.originalname
    });

    console.log(`✅ Application received for ${name} - ${role}`);
    return res.status(200).json({
      message: 'Application submitted successfully!'
    });

  } catch (err) {
    console.error('💥 Server Error:', err.message || err);
    return res.status(500).json({
      message: 'Server error: Could not process application.'
    });
  }
});

module.exports = router;