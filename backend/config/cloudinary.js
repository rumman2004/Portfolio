import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { Readable } from 'stream';
import dotenv from 'dotenv';

dotenv.config();

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Use memory storage instead of CloudinaryStorage
const storage = multer.memoryStorage();

// Configure multer with memory storage
export const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        console.log('🔍 Validating file:', file.originalname, 'Type:', file.mimetype);

        const allowedMimeTypes = [
            'image/jpeg',
            'image/jpg',
            'image/png',
            'image/gif',
            'image/webp',
            'image/svg+xml',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ];

        if (allowedMimeTypes.includes(file.mimetype)) {
            console.log('✅ File type accepted:', file.mimetype);
            cb(null, true);
        } else {
            console.error('❌ File type rejected:', file.mimetype);
            cb(new Error(`Invalid file type: ${file.mimetype}`), false);
        }
    },
});

// Manual Cloudinary upload middleware
export const uploadToCloudinary = (req, res, next) => {
    if (!req.file) {
        return next();
    }

    const isSVG = req.file.mimetype === 'image/svg+xml';
    const isPDF = req.file.mimetype === 'application/pdf';
    const isDoc = req.file.mimetype.includes('msword') || req.file.mimetype.includes('wordprocessingml');

    console.log(`📤 Uploading ${req.file.originalname} (${req.file.mimetype}) to Cloudinary...`);

    // Convert buffer to stream
    const bufferStream = new Readable();
    bufferStream.push(req.file.buffer);
    bufferStream.push(null);

    // Determine upload options based on file type
    const uploadOptions = {
        folder: 'portfolio',
        resource_type: (isSVG || isPDF || isDoc) ? 'raw' : 'image',
        public_id: `${Date.now()}-${req.file.originalname.replace(/\.[^/.]+$/, '')}`, // Remove extension
    };

    // Add transformation only for regular images
    if (!isSVG && !isPDF && !isDoc) {
        uploadOptions.transformation = [
            { width: 1000, height: 1000, crop: 'limit', quality: 'auto' }
        ];
    }

    console.log('Upload options:', uploadOptions);

    // Upload to Cloudinary using stream
    const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
            if (error) {
                console.error('❌ Cloudinary upload error:', error);
                return res.status(500).json({
                    success: false,
                    message: 'Failed to upload file to Cloudinary',
                    error: error.message
                });
            }

            console.log('✅ File uploaded successfully to Cloudinary');
            console.log('URL:', result.secure_url);
            console.log('Public ID:', result.public_id);

            // Attach result to req.file for later use
            req.file.path = result.secure_url;
            req.file.filename = result.public_id;

            next();
        }
    );

    bufferStream.pipe(uploadStream);
};

// Helper to delete file from cloudinary
export const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) {
            console.warn('⚠️ No public_id provided for deletion');
            return;
        }

        // Determine resource type
        let resourceType = 'image';

        if (publicId.toLowerCase().includes('.svg') ||
            publicId.toLowerCase().includes('.pdf') ||
            publicId.toLowerCase().includes('.doc') ||
            publicId.startsWith('portfolio/') && publicId.match(/\d+-/)) {
            resourceType = 'raw';
        }

        console.log(`🗑️ Deleting ${resourceType} from Cloudinary:`, publicId);

        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
            invalidate: true
        });

        console.log('✅ Deletion result:', result);
        return result;
    } catch (error) {
        console.error('❌ Error deleting from Cloudinary:', error);
        throw error;
    }
};

export default cloudinary;
