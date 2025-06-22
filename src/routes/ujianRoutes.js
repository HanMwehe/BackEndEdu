import express from 'express';
import {
  getAllUjian,
  createUjian,
  getUjianById,
  updateUjian,
} from '../controller/ujianController.js';
import { verifyToken, allowRoles } from '../middleware/authMiddleware.js';
import { getUjianByDosen, getUjianForMahasiswa } from '../controller/ujianController.js';
const router = express.Router();

router.get('/dosen', verifyToken, allowRoles('dosen'), getUjianByDosen);
router.get('/mahasiswa', verifyToken, allowRoles('mahasiswa'), getUjianForMahasiswa);
router.get('/', verifyToken, allowRoles('admin', 'dosen'), getAllUjian);
router.post('/', verifyToken, allowRoles('dosen'), createUjian);
router.get('/:id', verifyToken, allowRoles('admin', 'dosen', 'mahasiswa'), getUjianById);
router.put('/:id', verifyToken, allowRoles('dosen'), updateUjian)     // ✅ endpoint update
export default router;
