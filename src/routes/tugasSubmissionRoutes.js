import express from 'express';
import {
  submitTugas,
  getAllSubmissions,
  getSubmissionById,
  updateSubmission,
  getMySubmissions,
  getSubmissionsByTugas,
  getTugasForMahasiswa
} from '../controller/tugasSubmissionController.js';
import { verifyToken, allowRoles } from '../middleware/authMiddleware.js';

const router = express.Router();
// 🔥 Spesifik duluan
router.get('/mahasiswa/belum-dikerjakan', verifyToken, allowRoles('mahasiswa'), getTugasForMahasiswa);
router.get('/mine', verifyToken, allowRoles('mahasiswa'), getMySubmissions);
router.get('/tugas/:tugas_id', verifyToken, allowRoles('dosen'), getSubmissionsByTugas);

// Baru yang umum
router.get('/', verifyToken, allowRoles('admin', 'dosen'), getAllSubmissions);
router.get('/:id', verifyToken, allowRoles('admin', 'dosen'), getSubmissionById);
router.put('/:id', verifyToken, allowRoles('dosen'), updateSubmission);

// Submit tugas
router.post('/', verifyToken, allowRoles('mahasiswa'), submitTugas);

export default router;
