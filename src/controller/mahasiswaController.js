import Mahasiswa from '../models/Mahasiswa.js';
import User from '../models/User.js';
import bcrypt from 'bcrypt';

export const getAllMahasiswa = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.find().populate('user_id', 'username role');
    res.json(mahasiswa);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data mahasiswa' });
  }
};

export const getMahasiswaById = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.findById(req.params.id).populate('user_id', 'username role');
    if (!mahasiswa) return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
    res.json(mahasiswa);
  } catch (err) {
    res.status(500).json({ message: 'Gagal mengambil data mahasiswa' });
  }
};

export const createMahasiswa = async (req, res) => {
  const { username, password, name, nim, fakultas } = req.body;
  try {
    // cek duplikat username
    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: 'Username sudah digunakan' });

    // bikin akun user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      password: hashedPassword,
      role: 'mahasiswa',
      created_at: new Date(),
    });
    const savedUser = await newUser.save();

    // bikin data mahasiswa
    const newMahasiswa = new Mahasiswa({
      user_id: savedUser._id,
      name,
      nim,
      fakultas,
      created_at: new Date(),
    });

    await newMahasiswa.save();
    res.status(201).json({ message: 'Mahasiswa berhasil dibuat', mahasiswa: newMahasiswa });
  } catch (err) {
    res.status(500).json({ message: 'Gagal tambah mahasiswa', error: err.message });
  }
};

export const updateMahasiswa = async (req, res) => {
  try {
    const updated = await Mahasiswa.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Gagal update mahasiswa' });
  }
};

export const deleteMahasiswa = async (req, res) => {
  try {
    const mahasiswa = await Mahasiswa.findById(req.params.id);
    if (!mahasiswa) return res.status(404).json({ message: 'Mahasiswa tidak ditemukan' });

    // hapus user yang terkait
    await User.findByIdAndDelete(mahasiswa.user_id);

    // hapus mahasiswa
    await Mahasiswa.findByIdAndDelete(req.params.id);

    res.json({ message: 'Mahasiswa dihapus' });
  } catch (err) {
    res.status(500).json({ message: 'Gagal hapus mahasiswa' });
  }
};
