// /src/models/User.js

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'dosen', 'mahasiswa'],
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// Auto-increment ID manual (karena MongoDB nggak punya integer id secara default)
userSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password; // jangan tampilkan password
  },
});

export default mongoose.model('User', userSchema);
