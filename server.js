import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { isEmail } from 'validator';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000; // Default port to 3000 if not specified
const BASE_URL = process.env.BASE_URL || `http://localhost:${port}`;

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(bodyParser.json()); // Parse JSON bodies

// Nodemailer Transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Root Route: Respond with a message on "/"
app.get('/', (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /`);
  res.send('Server is up and running! Use /api/contact to send messages.');
});

// Test Route for `/api/contact`
app.get('/api/contact', (req, res) => {
  console.log(`[${new Date().toISOString()}] GET /api/contact`);
  res.send('Server is running, ready to handle POST requests on /api/contact');
});

// Contact Form Submission Endpoint at `/api/contact`
app.post('/api/contact', (req, res) => {
  console.log(`[${new Date().toISOString()}] POST /api/contact`);
  
  try {
    const { name, email, phone, message } = req.body;

    // Validation
    if (!name || !email || !phone || !message) {
      console.error('Validation failed: Missing required fields');
      return res.status(400).json({ error: 'All fields are required.' });
    }

    if (!isEmail(email)) {
      console.error('Validation failed: Invalid email format');
      return res.status(400).json({ error: 'Invalid email format.' });
    }

    // Email Options
    const mailOptions = {
      from: email,
      to: process.env.RECEIVER_EMAIL,
      subject: 'New Contact Form Submission',
      text: `
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
        Message: ${message}
      `,
    };

    // Send Email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res.status(500).json({ error: 'Failed to send message. Please try again later.' });
      } else {
        console.log('Email sent successfully:', info.response);
        return res.status(200).json({ message: 'Your message has been sent successfully!' });
      }
    });
  } catch (err) {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`[${new Date().toISOString()}] Server is running on ${BASE_URL}`);
});
