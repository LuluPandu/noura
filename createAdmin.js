require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Admin = require('./models/Admin');

const username = 'shreya_the_admin'; // change this
const plainPassword = 'sonusoodtypeshi27'; // change this

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await Admin.findOne({ username });
    if (existing) {
      console.log('⚠️ Admin already exists with this username.');
      return process.exit();
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);
    const admin = new Admin({ username, password: hashedPassword });
    await admin.save();

    console.log('✅ Admin created successfully!');
    process.exit();
  } catch (err) {
    console.log('❌ Error:', err);
    process.exit();
  }
}

createAdmin();