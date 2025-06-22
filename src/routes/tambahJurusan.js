import express from 'express'
import {
  getAllJurusan,
  createJurusan,
  getJurusanById,
  // updateJurusan,
  // deleteJurusan,
} from '../controller/jurusanController.js'

const router = express.Router()

// Semua jurusan
router.get('/', getAllJurusan)

// Tambah jurusan (admin only)
router.post('/', createJurusan)

// Detail satu jurusan
router.get('/:id', getJurusanById)

// (Optional) Update jurusan
// router.put('/:id', updateJurusan)

// (Optional) Hapus jurusan
// router.delete('/:id', deleteJurusan)

export default router
