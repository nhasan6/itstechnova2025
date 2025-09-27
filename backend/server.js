const express = require('express');
const dotenv = require('dotenv').config();

// console.log('MONGO_URI loaded:', process.env.MONGO_URI);


const connectDB = require('./config/db');

// Import routes
const piggyBankRoutes = require('./routes/PiggyBankRoutes');
const TransactionRoutes = require('./routes/TransactionRoutes');

const app = express();

connectDB();

// Middleware to parse JSON body
app.use(express.json());

// test route
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// custom routes
app.use('/api/piggybanks', piggyBankRoutes);
app.use('/api/transactions', TransactionRoutes);




const port = process.env.PORT || 3000;

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});