// server/utils/sendEmail.js
const nodemailer = require('nodemailer');
require('dotenv').config();
const fs = require('fs');

const sendEmail = async (data) => {
  try {
    // ✅ Debug: Log environment variables
    console.log('📧 EMAIL_USER:', process.env.EMAIL_USER ? '✅ Set' : '❌ Missing');
    console.log('📧 EMAIL_PASS:', process.env.EMAIL_PASS ? '✅ Set' : '❌ Missing');
    console.log('📧 RECEIVER_EMAIL:', process.env.RECEIVER_EMAIL);

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      throw new Error('Email credentials are missing. Check .env file or Render variables.');
    }

    // ✅ Check if resume exists
    if (!fs.existsSync(data.resumePath)) {
      throw new Error(`Resume file not found: ${data.resumePath}`);
    }

    // ✅ Create transporter
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      debug: true,
      logger: true
    });

    const mailOptions = {
      from: `"Cinematic Careers" <${process.env.EMAIL_USER}>`,
      to: process.env.RECEIVER_EMAIL,
      subject: `[Job App] ${data.role} - ${data.name}`,
      html: `
        <h2>New Job Application</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Date of Birth:</strong> ${data.dob}</p>
        <h3>Emergency Contact</h3>
        <p><strong>Name:</strong> ${data.emergencyName}</p>
        <p><strong>Phone:</strong> ${data.emergencyPhone}</p>
        <p><strong>Role:</strong> ${data.role}</p>
        <p><strong>Experience:</strong> ${data.experience}</p>
        <p><strong>Availability:</strong> ${data.availability}</p>
      `,
      attachments: [
        {
          filename: data.resumeName,
          path: data.resumePath
        }
      ]
    };

    await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
  } catch (err) {
    console.error('❌ EMAIL ERROR:', err.message || err);
    throw err;
  }
};

module.exports = sendEmail;