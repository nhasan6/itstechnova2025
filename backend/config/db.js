const mongoose = require('mongoose');

// obtains connection string from the env. file 
const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB Atlas connected!');
    } catch (error) {
        console.error('MongoDB connected failed:', error.message);
        process.exit(1) 
    }
};

module.exports = connectDB;