import Tema from '../models/Tema.js';
import Dosen from '../models/Dosen.js';
import Mahasiswa from '../models/Mahasiswa.js';
import Jurusan from '../models/Jurusan.js';

export const getAllTema = async (req, res) => {
  try {
    const userRole = req.user.role;

    if (userRole === "dosen") {
      const dosen = await Dosen.findOne({ user_id: req.user.id });
      if (!dosen || !dosen.jurusan) {
        return res.status(404).json({ error: "Dosen atau jurusan tidak ditemukan" });
      }

      const data = await Tema.find({ jurusan: dosen.jurusan }) // ✅ pakai ObjectId
        .populate("dosen_id", "name")
        .populate("jurusan", "name");

      return res.json(data);
    }

    if (userRole === "admin") {
      const data = await Tema.find()
        .populate("dosen_id", "name")
        .populate("jurusan", "name");

      return res.json(data);
    }

    return res.status(403).json({ message: "Akses ditolak: role tidak diizinkan" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// /controller/temaController.js ✅ FORMAT JURUSAN SUDAH BENAR
export const createTema = async (req, res) => {
  try {
    const { title, description } = req.body;

    const dosen = await Dosen.findOne({ user_id: req.user.id });
    if (!dosen || !dosen.jurusan) {
      return res.status(404).json({ error: 'Dosen atau jurusan tidak ditemukan' });
    }

    const tema = new Tema({
      dosen_id: dosen._id,
      title,
      description,
      jurusan: dosen.jurusan, // ✅ sekarang ObjectId
    });

    await tema.save();
    res.status(201).json({ message: 'Tema created', tema });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export const getTemaById = async (req, res) => {
  try {
    const tema = await Tema.findById(req.params.id).populate('dosen_id', 'name');
    if (!tema) return res.status(404).json({ error: 'Tema tidak ditemukan' });
    res.json(tema);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Ambil semua tema untuk mahasiswa (tanpa dosen_id dan _id)
export const getTemaForMahasiswa = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.findOne({ user_id: req.user.id });
    if (!mahasiswa) return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });

    const jurusan = await Jurusan.findById(mahasiswa.jurusan_id);
if (!jurusan) return res.status(404).json({ message: 'Jurusan tidak ditemukan' });

const tema = await Tema.find({ jurusan: jurusan._id }, 'title description created_at');
res.json(tema);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil tema', error: err.message });
  }
};
