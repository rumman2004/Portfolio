import express from 'express';
import {
    getAbout,
    createOrUpdateAbout,
    deleteProfileImage,
    deleteResume
} from '../controller/aboutController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadFields, handleUploadError } from '../middleware/uploadMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAbout);

// Protected routes
router.post(
    '/',
    protect,
    uploadFields,
    handleUploadError,
    createOrUpdateAbout
);

// Delete profile image
router.delete('/profile-image', protect, deleteProfileImage);

// Delete resume
router.delete('/resume', protect, deleteResume);

export default router;
