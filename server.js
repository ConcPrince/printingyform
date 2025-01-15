// server.js
import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file

const app = express();
const port = 4000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());  // Parse JSON bodies

// SMTP Setup using Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use another email service (e.g., SendGrid, Mailgun)
  auth: {
    user: process.env.SMTP_USER,  // Your SMTP email (from .env file)
    pass: process.env.SMTP_PASS,  // Your SMTP password (from .env file)
  },
});

// Handle GET request for /contact to test if server is working
app.get('/contact', (req, res) => {
  res.send('Server is running, ready to handle POST requests on /contact');
});

// Handle POST request for /contact (your original route)
app.post('/contact', (req, res) => {
  const { name, email, phone, message } = req.body;

  // Validation (Optional)
  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const mailOptions = {
    from: email,
    to: process.env.RECEIVER_EMAIL,  // Use the receiver email (from .env file)
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
      console.log(error);
      return res.status(500).json({ message: 'Failed to send message. Please try again later.' });
    } else {
      console.log('Email sent: ' + info.response);
      return res.status(200).json({ message: 'Your message has been sent successfully!' });
    }
  });
});

// Start Server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
