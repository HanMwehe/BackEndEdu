import express from 'express';
import {
  submitUjian,
  getAllSubmissions,
  getSubmissionById,
  updateSubmission,
  getMySubmissions,
  getSubmissionsByUjian,
  getUjianForMahasiswa
} from '../controller/ujianSubmissionController.js';
import { verifyToken, allowRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

// Mahasiswa submit atau update Ujian
router.post('/', verifyToken, allowRoles('mahasiswa'), submitUjian);
router.get('/mahasiswa/belum-dikerjakan', verifyToken, allowRoles('mahasiswa'), getUjianForMahasiswa);
// Mahasiswa lihat semua Ujian yang dia submit
router.get('/mine', verifyToken, allowRoles('mahasiswa'), getMySubmissions);

// Dosen/Admin lihat semua submission
router.get('/', verifyToken, allowRoles('admin', 'dosen'), getAllSubmissions);

// Dosen lihat semua submission berdasarkan Ujian tertentu
router.get('/ujian/:ujian_id', verifyToken, allowRoles('dosen'), getSubmissionsByUjian);

// Admin/Dosen lihat detail satu submission berdasarkan ID
router.get('/:id', verifyToken, allowRoles('admin', 'dosen'), getSubmissionById);

// Dosen kasih nilai dan feedback
router.put('/:id', verifyToken, allowRoles('dosen'), updateSubmission);

export default router;
