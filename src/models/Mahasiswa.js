// /src/models/Mahasiswa.js

import mongoose from 'mongoose';

const mahasiswaSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  nim: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  fakultas: {
    type: String,
    required: true,
    trim: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

mahasiswaSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model('Mahasiswa', mahasiswaSchema);
