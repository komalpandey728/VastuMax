const mongoose = require('mongoose');
const config = require('../config');

const connectDB = async () => {
  if (!config.mongoUri) {
    console.warn('⚠️  MONGODB_URI not set. Running without database connection.');
    return;
  }

  try {
    const conn = await mongoose.connect(config.mongoUri);
    console.log(`✅ MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    if (config.env === 'production') {
      process.exit(1);
    }
  }
};

module.exports = connectDB;
