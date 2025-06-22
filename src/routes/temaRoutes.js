import express from 'express';
import {
  getAllTema,
  createTema,
  getTemaById,
  getTemaForMahasiswa
} from '../controller/temaController.js';
import { verifyToken, allowRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/mahasiswa', verifyToken, getTemaForMahasiswa);
router.get('/', verifyToken, allowRoles('admin', 'dosen', 'mahasiswa'), getAllTema);
router.post('/', verifyToken, allowRoles('dosen'), createTema);
router.get('/:id', verifyToken, allowRoles('admin', 'dosen', 'mahasiswa'), getTemaById);
export default router;
