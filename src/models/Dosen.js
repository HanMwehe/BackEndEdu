import mongoose from 'mongoose';


const dosenSchema = new mongoose.Schema({
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
  nip: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  departemen: {
    type: String,
    trim: true, // 🟢 DIBIARKAN TANPA required
  },
  jurusan: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Jurusan',
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
})


dosenSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  },
});

export default mongoose.model('Dosen', dosenSchema);
