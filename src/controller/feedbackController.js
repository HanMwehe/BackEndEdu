import Feedback from '../models/Feedback.js';
import Mahasiswa from '../models/Mahasiswa.js';
import Dosen from '../models/Dosen.js';

export const createFeedback = async (req, res) => {
  try {
    const { mahasiswa_id, dosen_id, comments } = req.body;

    const mahasiswa = await Mahasiswa.findById(mahasiswa_id);
    if (!mahasiswa) return res.status(404).json({ error: 'Mahasiswa tidak ditemukan' });

    const dosen = await Dosen.findById(dosen_id);
    if (!dosen) return res.status(404).json({ error: 'Dosen tidak ditemukan' });

    const feedback = new Feedback({
      mahasiswa_id,
      dosen_id,
      comments,
      created_at: new Date(),
    });

    await feedback.save();
    res.status(201).json({ message: 'Feedback terkirim' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await Feedback.find()
      .populate('mahasiswa_id', 'name nim')
      .populate('dosen_id', 'name nip');
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .populate('mahasiswa_id', 'name nim')
      .populate('dosen_id', 'name nip');
    if (!feedback) return res.status(404).json({ error: 'Feedback tidak ditemukan' });
    res.json(feedback);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
