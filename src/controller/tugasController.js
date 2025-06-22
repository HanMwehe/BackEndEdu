import Tugas from '../models/Tugas.js';
import Materi from '../models/Materi.js';
import Mahasiswa from '../models/Mahasiswa.js';
import Jurusan from '../models/Jurusan.js';
import Tema from '../models/Tema.js';
import TugasSubmission from '../models/TugasSubmission.js'
import Dosen from '../models/Dosen.js';
export const getAllTugas = async (req, res) => {
  try {
    const data = await Tugas.find().populate('materi_id', 'title');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const createTugas = async (req, res) => {
  try {
    const { materi_id, description, due_date, questions } = req.body; // ✅ tambahkan "questions"

    const materi = await Materi.findById(materi_id);
    if (!materi) return res.status(404).json({ error: 'Materi tidak ditemukan' });

    const tugas = new Tugas({
      materi_id,
      description,
      due_date,
      questions, // ✅ simpan questions juga ke DB
    });
    await tugas.save();

    res.status(201).json({ message: 'Tugas created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const getTugasById = async (req, res) => {
  try {
    const tugas = await Tugas.findById(req.params.id).populate('materi_id', 'title');
    if (!tugas) return res.status(404).json({ error: 'Tugas tidak ditemukan' });
    res.json(tugas);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// getTugasForMahasiswa
// getTugasForMahasiswa
export const getTugasForMahasiswa = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.findOne({ user_id: req.user.id });
    if (!mahasiswa) return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });

    const temaIdList = await Jurusan.find({
      name: { $regex: new RegExp(`^${mahasiswa.fakultas}$`, 'i') }
    }).distinct('tema_id');

    if (!temaIdList.length) return res.status(404).json({ message: 'Tidak ada tema untuk jurusan ini' });

    const materiIdList = await Materi.find({ tema_id: { $in: temaIdList } }).distinct('_id');

    const semuaTugas = await Tugas.find({ materi_id: { $in: materiIdList } })
      .populate('materi_id', 'title')
      .sort({ created_at: -1 });

    // Ambil tugas yang sudah dinilai (bukan cuma submit)
    const tugasYangSudahDinilai = await TugasSubmission.find({
      mahasiswa_id: mahasiswa._id,
      status: 'graded'
    }).distinct('tugas_id');

    const tugasBelumDikerjakan = semuaTugas.filter(
      (tugas) => !tugasYangSudahDinilai.includes(tugas._id.toString())
    );

    res.json(tugasBelumDikerjakan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// getTugasByDosen (hanya tugas dari dosen login)
export const getTugasByDosen = async (req, res) => {
  try {
    const dosenId = req.user.dosen_id;

    // Cari semua materi milik dosen itu
    const materiDosen = await Materi.find({ tema_id: { $in: await Tema.find({ dosen_id: dosenId }).distinct('_id') } }).distinct('_id');

    const tugas = await Tugas.find({ materi_id: { $in: materiDosen } })
      .populate('materi_id', 'title')
      .sort({ created_at: -1 });

    res.json(tugas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update tugas
export const updateTugas = async (req, res) => {
  try {
    const { id } = req.params
    const updated = await Tugas.findByIdAndUpdate(id, req.body, { new: true })
    if (!updated) return res.status(404).json({ error: 'Tugas tidak ditemukan' })
    res.json({ message: 'Tugas berhasil diupdate', tugas: updated })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Hapus tugas
export const deleteTugas = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Tugas.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ error: 'Tugas tidak ditemukan' })
    res.json({ message: 'Tugas berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


