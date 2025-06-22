import mongoose from 'mongoose';

const temaSchema = new mongoose.Schema({
  dosen_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Dosen', required: true },
  title: { type: String, required: true },
  description: { type: String },
  jurusan: { type: mongoose.Schema.Types.ObjectId, ref: 'Jurusan', required: true }, // ✅ pakai ObjectId
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Tema', temaSchema);
