// /src/controllers/dosenController.js
import bcrypt from 'bcrypt';
// /src/controllers/dosenController.js
import Dosen from '../models/Dosen.js';
import User from '../models/User.js';
import Jurusan from '../models/Jurusan.js';
export const getAllDosen = async (req, res) => {
  try {
    const dosen = await Dosen.find()
  .populate('user_id', 'username role')
  .populate('jurusan', 'name') // <-- ini penting

    res.json(dosen);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data dosen' });
  }
};

export const getDosenById = async (req, res) => {
  try {
    const dosen = await Dosen.findById(req.params.id).populate('user_id', 'username role');
    if (!dosen) return res.status(404).json({ message: 'Dosen tidak ditemukan' });
    res.json(dosen);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data dosen' });
  }
};

export const createDosen = async (req, res) => {
  const { username, password, name, nip, jurusan } = req.body;

  // Validasi input wajib
  if (!username || !password || !name || !nip || !jurusan) {
    return res.status(400).json({ message: 'Semua field wajib diisi' });
  }

  // Validasi kosong string (trim)
  if (
    username.trim() === '' ||
    password.trim() === '' ||
    name.trim() === '' ||
    nip.trim() === '' ||
    jurusan.trim() === ''
  ) {
    return res.status(400).json({ message: 'Field tidak boleh kosong' });
  }

  try {
    // Cek username unik
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }

    // Cek NIP unik
    const existingNip = await Dosen.findOne({ nip });
    if (existingNip) {
      return res.status(400).json({ message: 'NIP sudah digunakan' });
    }

    // (Opsional) Cek jurusan ID valid
    const jurusanExists = await Jurusan.findById(jurusan);
    if (!jurusanExists) {
      return res.status(404).json({ message: 'Jurusan tidak ditemukan' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat user baru
    const newUser = new User({
      username: username.trim(),
      password: hashedPassword,
      role: 'dosen',
      created_at: new Date(),
    });
    await newUser.save();

    // Buat dosen baru
    const newDosen = new Dosen({
      user_id: newUser._id,
      name: name.trim(),
      nip: nip.trim(),
jurusan: jurusan.trim(), // <- simpan sebagai ObjectId string
      created_at: new Date(),
    });
    await newDosen.save();

    res.status(201).json({ message: 'Dosen berhasil ditambahkan' });
  } catch (err) {
    console.error('Error creating dosen:', err);
    res.status(500).json({
      message: 'Gagal menambahkan dosen',
      error: err.message,
    });
  }
};

export const updateDosen = async (req, res) => {
  try {
    const updated = await Dosen.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Dosen tidak ditemukan' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengupdate dosen' });
  }
};

export const deleteDosen = async (req, res) => {
  try {
    const deleted = await Dosen.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Dosen tidak ditemukan' });
    res.json({ message: 'Dosen dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal menghapus dosen' });
  }
};
