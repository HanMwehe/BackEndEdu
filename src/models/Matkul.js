import mongoose from 'mongoose';

const matkulSchema = new mongoose.Schema({
  tema_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tema', required: true },
  name: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

export default mongoose.model('Matkul', matkulSchema);
