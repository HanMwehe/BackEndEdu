import express from 'express';
import {
  createFeedback,
  getAllFeedback,
  getFeedbackById,
} from '../controller/feedbackController.js';
import { verifyToken, allowRoles } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', verifyToken, allowRoles('dosen'), createFeedback);
router.get('/', verifyToken, allowRoles('admin', 'dosen'), getAllFeedback);
router.get('/:id', verifyToken, allowRoles('admin', 'dosen'), getFeedbackById);

export default router;
