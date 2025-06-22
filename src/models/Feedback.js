import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  mahasiswa_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Mahasiswa', required: true },
  dosen_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Dosen', required: true },
  comments: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Feedback', feedbackSchema);
