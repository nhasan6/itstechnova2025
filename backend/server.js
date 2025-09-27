const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

connectDB();

// Middleware
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});
// add routes here

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});