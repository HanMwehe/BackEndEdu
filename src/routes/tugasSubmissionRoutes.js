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

// Mahasiswa submit atau update tugas
router.post('/', verifyToken, allowRoles('mahasiswa'), submitTugas);
router.get('/mahasiswa/belum-dikerjakan', verifyToken, allowRoles('mahasiswa'), getTugasForMahasiswa);
// Mahasiswa lihat semua tugas yang dia submit
router.get('/mine', verifyToken, allowRoles('mahasiswa'), getMySubmissions);

// Dosen/Admin lihat semua submission
router.get('/', verifyToken, allowRoles('admin', 'dosen'), getAllSubmissions);

// Dosen lihat semua submission berdasarkan tugas tertentu
router.get('/tugas/:tugas_id', verifyToken, allowRoles('dosen'), getSubmissionsByTugas);

// Admin/Dosen lihat detail satu submission berdasarkan ID
router.get('/:id', verifyToken, allowRoles('admin', 'dosen'), getSubmissionById);

// Dosen kasih nilai dan feedback
router.put('/:id', verifyToken, allowRoles('dosen'), updateSubmission);

export default router;
