import Ujian from '../models/Ujian.js';
import Materi from '../models/Materi.js';
import Mahasiswa from '../models/Mahasiswa.js';
import Jurusan from '../models/Jurusan.js';
import Tema from '../models/Tema.js';
import UjianSubmission from '../models/UjianSubmission.js'
import Dosen from '../models/Dosen.js';
export const getAllUjian = async (req, res) => {
  try {
    const data = await Ujian.find().populate('materi_id', 'title');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const createUjian = async (req, res) => {
  try {
    const { materi_id, description, due_date, questions } = req.body;

    const materi = await Materi.findById(materi_id);
    if (!materi) return res.status(404).json({ error: 'Materi tidak ditemukan' });

    const ujian = new Ujian({
      materi_id,
      description,
      due_date,
      questions,
    });
    await ujian.save();

    res.status(201).json({ message: 'Ujian created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


export const getUjianById = async (req, res) => {
  try {
    const ujianData = await Ujian.findById(req.params.id).populate('materi_id', 'title');
    if (!ujianData) return res.status(404).json({ error: 'Ujian tidak ditemukan' });
    res.json(ujianData);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};

// getUjianForMahasiswa
// getUjianForMahasiswa
export const getUjianForMahasiswa = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.findOne({ user_id: req.user.id });
    if (!mahasiswa) return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });

    const temaIdList = await Jurusan.find({
      name: { $regex: new RegExp(`^${mahasiswa.fakultas}$`, 'i') }
    }).distinct('tema_id');

    if (!temaIdList.length) return res.status(404).json({ message: 'Tidak ada tema untuk jurusan ini' });

    const materiIdList = await Materi.find({ tema_id: { $in: temaIdList } }).distinct('_id');

    const semuaUjian = await Ujian.find({ materi_id: { $in: materiIdList } })
      .populate('materi_id', 'title')
      .sort({ created_at: -1 });

    // Ambil Ujian yang sudah dinilai (bukan cuma submit)
    const UjianYangSudahDinilai = await UjianSubmission.find({
      mahasiswa_id: mahasiswa._id,
      status: 'graded'
    }).distinct('Ujian_id');

    const UjianBelumDikerjakan = semuaUjian.filter(
      (Ujian) => !UjianYangSudahDinilai.includes(Ujian._id.toString())
    );

    res.json(UjianBelumDikerjakan);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// getUjianByDosen (hanya Ujian dari dosen login)
export const getUjianByDosen = async (req, res) => {
  try {
    const dosenId = req.user.dosen_id;

    // Ambil semua materi dari dosen ini
    const temaIds = await Tema.find({ dosen_id: dosenId }).distinct('_id');
    const materiDosen = await Materi.find({ tema_id: { $in: temaIds } }).distinct('_id');

    const ujianList = await Ujian.find({ materi_id: { $in: materiDosen } })
      .populate('materi_id', 'title')
      .sort({ created_at: -1 });

    res.json(ujianList);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

// Update Ujian
export const updateUjian = async (req, res) => {
  try {
    const { id } = req.params
    const updated = await Ujian.findByIdAndUpdate(id, req.body, { new: true })
    if (!updated) return res.status(404).json({ error: 'Ujian tidak ditemukan' })
    res.json({ message: 'Ujian berhasil diupdate', Ujian: updated })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Hapus Ujian
export const deleteUjian = async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Ujian.findByIdAndDelete(id)
    if (!deleted) return res.status(404).json({ error: 'Ujian tidak ditemukan' })
    res.json({ message: 'Ujian berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}


