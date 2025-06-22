import express from 'express';
import {
  getAllUjian,
  createUjian,
  getUjianById,
  updateUjian,
  deleteUjian, // ✅ import
  getUjianByDosen,
  getUjianForMahasiswa,
} from '../controller/ujianController.js';
import { verifyToken, allowRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dosen', verifyToken, allowRoles('dosen'), getUjianByDosen);
router.get('/mahasiswa', verifyToken, allowRoles('mahasiswa'), getUjianForMahasiswa);
router.get('/', verifyToken, allowRoles('admin', 'dosen'), getAllUjian);
router.post('/', verifyToken, allowRoles('dosen'), createUjian);
router.get('/:id', verifyToken, allowRoles('admin', 'dosen', 'mahasiswa'), getUjianById);
router.put('/:id', verifyToken, allowRoles('dosen'), updateUjian);
router.delete('/:id', verifyToken, allowRoles('dosen'), deleteUjian); // ✅ ini dia

export default router;
