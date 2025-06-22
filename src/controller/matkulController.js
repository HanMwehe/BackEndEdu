import Matkul from '../models/Matkul.js';
import Tema from '../models/Tema.js';

export const getAllMatkul = async (req, res) => {
  try {
    const data = await Matkul.find().populate('tema_id', 'title');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMatkul = async (req, res) => {
  try {
    const { tema_id, name } = req.body;

    // Validasi tema
    const tema = await Tema.findById(tema_id);
    if (!tema) return res.status(404).json({ error: 'Tema tidak ditemukan' });

    const matkul = new Matkul({ tema_id, name });
    await matkul.save();

    res.status(201).json({ message: 'Matkul created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getMatkulById = async (req, res) => {
  try {
    const matkul = await Matkul.findById(req.params.id).populate('tema_id', 'title');
    if (!matkul) return res.status(404).json({ error: 'Matkul tidak ditemukan' });
    res.json(matkul);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
