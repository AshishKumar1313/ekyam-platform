import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';

dotenv.config();

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);

  const email = 'admin@ekyam.com';
  const exists = await User.findOne({ email });

  if (exists) {
    exists.role = 'admin';
    exists.isVerified = true;
    await exists.save();
    console.log('Admin role updated for', email);
  } else {
    await User.create({
      name: 'EKYAM Admin',
      email,
      password: 'admin123',
      community: 'Platform',
      role: 'admin',
      isVerified: true,
    });
    console.log('Admin created:', email, '/ password: admin123');
  }

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
