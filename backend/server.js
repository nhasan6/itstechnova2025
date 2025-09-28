
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();

// console.log('MONGO_URI loaded:', process.env.MONGO_URI);

const connectDB = require('./config/db');

// Import routes
const GeminiRoutes = require('./routes/GeminiRoutes.js');
const piggyBankRoutes = require('./routes/PiggyBankRoutes');
const TransactionRoutes = require('./routes/TransactionRoutes');


const app = express();

connectDB();

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins for development - restrict in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware to parse JSON body
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// custom routes
app.use('/api/piggybanks', piggyBankRoutes);
app.use('/api/transactions', TransactionRoutes);
app.use('/api/ai', GeminiRoutes);


// sets port to the one configured in .env file, unless that variable doesn't exist. Then port 3000 is the fallback/default
const port = process.env.PORT || 3000;

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});