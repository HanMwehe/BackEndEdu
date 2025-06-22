import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['uraian', 'pilihan_ganda'],
    required: true
  },
  question_text: {
    type: String,
    required: true
  },
  choices: [String], // Optional: hanya untuk pilihan ganda
  correct_answer: String // Optional: untuk pilihan ganda
});

const tugasSchema = new mongoose.Schema({
  materi_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Materi',
    required: true
  },
  description: String,
  due_date: Date,
  questions: [questionSchema], // ← Tambahin ini bro
  created_at: {
    type: Date,
    default: Date.now
  }
});

const Tugas = mongoose.model('Tugas', tugasSchema);
export default Tugas;
