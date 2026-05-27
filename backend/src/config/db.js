const mongoose = require('mongoose');
require('dotenv').config();

async function connectDB() {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/second-school-classes';
    mongoose.set('strictQuery', true);
    await mongoose.connect(uri);
    // eslint-disable-next-line no-console
    console.log('MongoDB connected');
}

module.exports = { connectDB };

