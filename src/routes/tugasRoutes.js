import express from 'express';
import {
  getAllTugas,
  createTugas,
  getTugasById,
  updateTugas,
  deleteTugas
} from '../controller/tugasController.js';
import { verifyToken, allowRoles } from '../middleware/authMiddleware.js';
import { getTugasByDosen, getTugasForMahasiswa } from '../controller/tugasController.js';
const router = express.Router();

router.get('/dosen', verifyToken, allowRoles('dosen'), getTugasByDosen);
router.get('/mahasiswa', verifyToken, allowRoles('mahasiswa'), getTugasForMahasiswa);
router.get('/', verifyToken, allowRoles('admin', 'dosen'), getAllTugas);
router.post('/', verifyToken, allowRoles('dosen'), createTugas);
router.get('/:id', verifyToken, allowRoles('admin', 'dosen', 'mahasiswa'), getTugasById);
router.put('/:id', verifyToken, allowRoles('dosen'), updateTugas)     // ✅ endpoint update
router.delete('/:id', verifyToken, allowRoles('dosen'), deleteTugas)  // ✅ endpoint delete
export default router;
