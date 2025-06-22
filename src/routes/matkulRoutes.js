import express from 'express';
import {
  getAllMatkul,
  createMatkul,
  getMatkulById,
} from '../controller/matkulController.js';
import { verifyToken, allowRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', verifyToken, allowRoles('admin', 'dosen'), getAllMatkul);
router.post('/', verifyToken, allowRoles('dosen'), createMatkul);
router.get('/:id', verifyToken, allowRoles('admin', 'dosen'), getMatkulById);

export default router;
