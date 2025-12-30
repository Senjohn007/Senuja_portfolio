require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const connectDB = require('../config/db'); // adjust path to your db.js

(async () => {
  try {
    await connectDB();

    const email = 'admin@example.com';
    const plainPassword = 'Admin@123';

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log('Admin already exists');
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const admin = await Admin.create({ email, passwordHash });
    console.log('Admin created:', admin.email);
    console.log('Password:', plainPassword);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
