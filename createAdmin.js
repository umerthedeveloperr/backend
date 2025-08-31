require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ticketing';

async function createAdmin() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Mongo connected');

    const email = 'admin@example.com';      // Change to your desired email
    const password = 'admin123';            // Change to your desired password

    const existing = await Admin.findOne({ email });
    if (existing) {
      console.log('⚠️ Admin already exists');
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const admin = new Admin({ email, passwordHash });
    await admin.save();

    console.log('✅ Admin created successfully!');
    console.log(`Email: ${email}`);
    console.log(`Password: ${password}`);
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

createAdmin();
