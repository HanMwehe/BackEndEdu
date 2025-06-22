import Jurusan from '../models/Jurusan.js'
import Tema from '../models/Tema.js'

// Get all jurusan
export const getAllJurusan = async (req, res) => {
  try {
    const data = await Jurusan.find().populate('tema_id', 'title')
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Get jurusan by ID
export const getJurusanById = async (req, res) => {
  try {
    const jurusan = await Jurusan.findById(req.params.id).populate('tema_id', 'title')
    if (!jurusan) return res.status(404).json({ error: 'Jurusan tidak ditemukan' })
    res.json(jurusan)
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Create jurusan
export const createJurusan = async (req, res) => {
  try {
    const { tema_id, name } = req.body
    if (!tema_id || !name) return res.status(400).json({ error: 'Tema dan nama jurusan wajib diisi' })

    const tema = await Tema.findById(tema_id)
    if (!tema) return res.status(404).json({ error: 'Tema tidak ditemukan' })

    const jurusan = new Jurusan({ tema_id, name })
    await jurusan.save()

    res.status(201).json({ message: 'Jurusan berhasil ditambahkan', jurusan })
  } catch (err) {
    res.status(400).json({ error: err.message })
  }
}

// Update jurusan
export const updateJurusan = async (req, res) => {
  try {
    const { tema_id, name } = req.body
    const { id } = req.params

    const tema = await Tema.findById(tema_id)
    if (!tema) return res.status(404).json({ error: 'Tema tidak ditemukan' })

    const updated = await Jurusan.findByIdAndUpdate(id, { tema_id, name }, { new: true })
    if (!updated) return res.status(404).json({ error: 'Jurusan tidak ditemukan' })

    res.json({ message: 'Jurusan berhasil diupdate', jurusan: updated })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

// Delete jurusan
export const deleteJurusan = async (req, res) => {
  try {
    const deleted = await Jurusan.findByIdAndDelete(req.params.id)
    if (!deleted) return res.status(404).json({ error: 'Jurusan tidak ditemukan' })
    res.json({ message: 'Jurusan berhasil dihapus' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}
