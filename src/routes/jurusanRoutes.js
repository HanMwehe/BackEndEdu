import express from 'express'
import {
  getAllJurusan,
  getJurusanById,
  createJurusan,
  updateJurusan,
  deleteJurusan,
} from '../controller/jurusanController.js'
import { verifyToken, isAdmin } from '../middleware/authMiddleware.js'

const router = express.Router()

router.get('/', verifyToken, getAllJurusan)
router.get('/:id', verifyToken, getJurusanById)
router.post('/', verifyToken, isAdmin, createJurusan)
router.put('/:id', verifyToken, isAdmin, updateJurusan)
router.delete('/:id', verifyToken, isAdmin, deleteJurusan)

export default router
