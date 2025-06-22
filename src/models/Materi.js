import mongoose from 'mongoose'

const MateriSchema = new mongoose.Schema({
  title: String,
  content: String,
  tema_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tema',
    required: true,
  },
  dosen_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Ganti sesuai nama model dosen kamu
    required: false,
  },
})

export default mongoose.model('Materi', MateriSchema)
