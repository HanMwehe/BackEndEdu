import Materi from '../models/Materi.js';
import Tema from '../models/Tema.js';
import Dosen from '../models/Dosen.js'; // ⬅️ PENTING

// Get semua materi milik dosen yang login
export const getAllMateri = async (req, res) => {
  try {
    const dosen = await Dosen.findOne({ user_id: req.user.id });
    if (!dosen) return res.status(404).json({ message: 'Dosen tidak ditemukan' });

    const temaList = await Tema.find({ dosen_id: dosen._id }).select('_id');
    const temaIds = temaList.map(t => t._id);

    const materi = await Materi.find({ tema_id: { $in: temaIds } }).populate('tema_id', 'title');
    res.json(materi);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buat materi baru
export const createMateri = async (req, res) => {
  try {
    const { tema_id, title, content } = req.body;

    const tema = await Tema.findById(tema_id);
    if (!tema) return res.status(404).json({ error: 'Tema tidak ditemukan' });

    const materi = new Materi({
      tema_id,
      title,
      content,
    });
    await materi.save();

    res.status(201).json({ message: 'Materi created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get materi by ID
export const getMateriById = async (req, res) => {
  try {
    const materi = await Materi.findById(req.params.id).populate('tema_id', 'title');
    if (!materi) return res.status(404).json({ error: 'Materi tidak ditemukan' });
    res.json(materi);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get semua materi berdasarkan tema ID
export const getMateriByTema = async (req, res) => {
  try {
    const materi = await Materi.find({ tema_id: req.params.id }).populate("tema_id", "title");
    res.json(materi);
  } catch (error) {
    res.status(500).json({ message: "Gagal mengambil materi", error: error.message });
  }
};
