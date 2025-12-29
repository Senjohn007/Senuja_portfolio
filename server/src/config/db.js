// /server/src/config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env');
    }

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // options mostly optional in latest Mongoose, but fine to keep
    });

    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1); // Exit process if DB connection fails
  }
};

module.exports = connectDB;
