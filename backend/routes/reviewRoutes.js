import express from 'express';
import * as reviewController from '../controllers/reviewController.js';
import { protect, isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, reviewController.postReview);
router.get('/', protect, isAdmin, reviewController.getAll);
router.put('/:id', protect, isAdmin, reviewController.update);
router.delete('/:id', protect, isAdmin, reviewController.remove);

export default router;