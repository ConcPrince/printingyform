// api/contact.js
import nodemailer from 'nodemailer';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { isEmail } from 'validator';

dotenv.config();  // Load environment variables from .env file

// Set up the mail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,  // Your email used for SMTP
    pass: process.env.SMTP_PASS,  // Your email password for SMTP
  },
});

// Default function to handle requests
export default async function handler(req, res) {
  // Use middleware for CORS and JSON parsing
  await new Promise(resolve => cors()(req, res, resolve));
  await new Promise(resolve => bodyParser.json()(req, res, resolve));

  const { method } = req;

  // Handle GET request for /api/contact to test if server is working
  if (method === 'GET') {
    return res.status(200).send('Server is running, ready to handle POST requests on /api/contact');
  }

  // Handle POST request for /api/contact
  if (method === 'POST') {
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
  } else {
    return res.status(405).end(); // Method Not Allowed
  }
}