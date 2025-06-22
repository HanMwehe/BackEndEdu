import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
dotenv.config(); // ini juga oke kalau .env di folder yang sama dengan tempat kamu running `node`

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existingAdmin = await User.findOne({ username: 'admin' });
    if (existingAdmin) {
      console.log('⚠️ Admin sudah ada.');
      return process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('admin123', 10);

    const newAdmin = new User({
      username: 'admin',
      password: hashedPassword,
      role: 'admin',
      created_at: new Date(),
    });

    await newAdmin.save();
    console.log('✅ Admin berhasil dibuat!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Gagal buat admin:', err.message);
    process.exit(1);
  }
};

seedAdmin();
