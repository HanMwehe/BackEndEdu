import mongoose from 'mongoose';

const tugasSubmissionSchema = new mongoose.Schema({
  tugas_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Tugas', required: true },
  mahasiswa_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Mahasiswa', required: true },
  answer_text: { type: String }, // legacy, bisa dipakai untuk satu jawaban saja
  answers: [
    {
      question_text: { type: String, required: true },
      answer_text: { type: String, required: true }
    }
  ],
  grade: { type: Number },
  feedback: { type: String },
  submitted_at: { type: Date, default: Date.now },
  status: { type: String, enum: ['submitted', 'graded'], default: 'submitted' },
});

export default mongoose.model('TugasSubmission', tugasSubmissionSchema);
