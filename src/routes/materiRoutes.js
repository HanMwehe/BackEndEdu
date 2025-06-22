import express from 'express';
import {
  getAllMateri,
  createMateri,
  getMateriById,
  getMateriByTema,
} from '../controller/materiController.js';
import { verifyToken, allowRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, allowRoles('admin', 'dosen', 'mahasiswa'), getAllMateri);
router.post('/', verifyToken, allowRoles('dosen'), createMateri);
router.get('/:id', verifyToken, allowRoles('admin', 'dosen', 'mahasiswa'), getMateriById);
router.get('/by-tema/:id', verifyToken, allowRoles('admin', 'dosen', 'mahasiswa'), getMateriByTema)

export default router;
