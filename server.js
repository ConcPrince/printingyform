// Import necessary modules
const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');
const compression = require('compression');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create an Express app
const app = express();

// Use middlewares
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(morgan('combined')); // Log HTTP requests
app.use(compression()); // Compress response bodies
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data

// Serve static files from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Simple route for the homepage
app.get('/', (req, res) => {
  res.send('Welcome to the backend!');
});

// Example API route (GET)
app.get('/api/data', (req, res) => {
  res.json({ message: 'This is your data.' });
});

// Example API route (POST)
app.post('/api/data', (req, res) => {
  const { userData } = req.body;
  // Process data and send response
  res.json({ message: 'Data received', data: userData });
});

// Catch-all route for handling undefined routes (404)
app.use((req, res, next) => {
  res.status(404).send('Not Found');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Set up server to listen on a specific port (process.env.PORT or 3000)
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
