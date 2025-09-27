const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));


// Test route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});