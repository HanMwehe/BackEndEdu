// Struktur dasar backend Express dengan MongoDB untuk sistem pendidikan

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import connectDB from './src/config/connection.js';

import authRoutes from './src/routes/authRoutes.js';
import mahasiswaRoutes from './src/routes/mahasiswaRoutes.js';
import dosenRoutes from './src/routes/dosenRoutes.js';
import temaRoutes from './src/routes/temaRoutes.js';
import matkulRoutes from './src/routes/matkulRoutes.js';
import jurusanRoutes from './src/routes/jurusanRoutes.js';
import materiRoutes from './src/routes/materiRoutes.js';
import tugasRoutes from './src/routes/tugasRoutes.js';
import ujianRoutes from './src/routes/ujianRoutes.js';
import jurusanRoute from './src/routes/tambahJurusan.js';
import tugasSubmissionRoutes from './src/routes/tugasSubmissionRoutes.js';
import ujianSubmissionRoutes from './src/routes/ujianSubmissionRoutes.js';
import feedbackRoutes from './src/routes/feedbackRoutes.js';

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/jurusan', jurusanRoute)
app.use('/auth', authRoutes);
app.use('/mahasiswa', mahasiswaRoutes);
app.use('/dosen', dosenRoutes);
app.use('/tema', temaRoutes);
app.use('/matkul', matkulRoutes);
app.use('/jurusan', jurusanRoutes);
app.use('/materi', materiRoutes);
app.use('/tugas', tugasRoutes);
app.use('/ujian', ujianRoutes);
app.use('/tugas-submission', tugasSubmissionRoutes);
app.use('/ujian-submission', ujianSubmissionRoutes);
app.use('/feedback', feedbackRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
