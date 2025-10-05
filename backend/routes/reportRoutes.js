import express from 'express';
import * as reportController from '../controllers/reportController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, reportController.postReport);
router.get('/', protect, isAdmin, reportController.getAll);
router.post('/:id/accept', protect, isAdmin, reportController.accept);
router.post('/:id/reject', protect, isAdmin, reportController.reject);

export default router;