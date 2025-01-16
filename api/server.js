// server.js
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { isEmail } from 'validator'; // Add proper validation package

dotenv.config();  // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3000;  // Use PORT from environment or default to 3000

// Change to use the actual production URL
const BASE_URL = process.env.BASE_URL || `http://localhost:${port}`;

// Middlewares
app.use(cors());
app.use(bodyParser.json());  // Parse JSON bodies

// SMTP Setup using Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.SMTP_USER,  
    pass: process.env.SMTP_PASS,  
  },
});

// Handle GET request for /contact to test if server is working
app.get('/contact', (req, res) => {
  res.send('Server is running, ready to handle POST requests on /contact');
});

// Handle POST request for /contact
app.post('/contact', (req, res) => {
  const { name, email, phone, message } = req.body;

  // Validation
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  if (!isEmail(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

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
      return res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    } else {
      console.log('Email sent: ' + info.response);
      return res.status(200).json({ message: 'Your message has been sent successfully!' });
    }
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on ${BASE_URL}`);
});