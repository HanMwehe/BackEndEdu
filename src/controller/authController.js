import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import Mahasiswa from '../models/Mahasiswa.js';
import Dosen from '../models/Dosen.js';

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid password' });

    let extraPayload = {};

    if (user.role === 'mahasiswa') {
      const mahasiswa = await Mahasiswa.findOne({ user_id: user._id });
      if (!mahasiswa) return res.status(404).json({ error: 'Mahasiswa tidak ditemukan' });
      extraPayload.mahasiswa_id = mahasiswa._id;
    }

    if (user.role === 'dosen') {
      const dosen = await Dosen.findOne({ user_id: user._id });
      if (!dosen) return res.status(404).json({ error: 'Dosen tidak ditemukan' });
      extraPayload.dosen_id = dosen._id;
    }

    const token = generateToken({
      id: user._id,
      role: user.role,
      ...extraPayload,
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashed = await bcrypt.hash(password, 10);

    const user = new User({ username, password: hashed, role });
    await user.save();

    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
