import express from 'express';
import { createMerch, getMerch, updateMerch, deleteMerch } from '../controllers/merch.controller';
import { upload } from '../middleware/upload.middleware';

const router = express.Router();

// Public routes
router.get('/', getMerch);

// Protected routes (add auth middleware if needed later)
router.post('/', upload.single('image'), createMerch);
router.put('/:id', upload.single('image'), updateMerch);
router.delete('/:id', deleteMerch);

export default router;
