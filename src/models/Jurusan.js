import mongoose from 'mongoose';

const jurusanSchema = new mongoose.Schema({
  tema_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tema', required: true },
  name: { type: String, required: true }
});

export default mongoose.model('Jurusan', jurusanSchema);
