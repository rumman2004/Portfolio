import About from '../model/About.js';
import { deleteImage } from '../utils/helpers.js';

// @desc    Get about info
// @route   GET /api/about
// @access  Public
export const getAbout = async (req, res) => {
    try {
        const about = await About.findOne();

        if (!about) {
            return res.status(404).json({
                success: false,
                message: 'About information not found'
            });
        }

        res.status(200).json({
            success: true,
            data: about
        });
    } catch (error) {
        console.error('❌ Error in getAbout:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create or update about info
// @route   POST /api/about
// @access  Private
export const createOrUpdateAbout = async (req, res) => {
    try {
        console.log('📝 Request body:', req.body);
        console.log('📁 Request files:', req.files);

        // Validate required fields
        if (!req.body.name || !req.body.title || !req.body.bio || !req.body.email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields: name, title, bio, and email'
            });
        }

        const aboutData = {
            name: req.body.name.trim(),
            title: req.body.title.trim(),
            bio: req.body.bio.trim(),
            email: req.body.email.trim(),
            phone: req.body.phone?.trim() || '',
            location: req.body.location?.trim() || ''
        };

        // Parse stats if it's a JSON string (from FormData)
        if (req.body.stats) {
            try {
                aboutData.stats = typeof req.body.stats === 'string'
                    ? JSON.parse(req.body.stats)
                    : req.body.stats;
                console.log('📊 Parsed stats:', aboutData.stats);
            } catch (error) {
                console.error('❌ Error parsing stats:', error);
                return res.status(400).json({
                    success: false,
                    message: 'Invalid stats format'
                });
            }
        }

        // Check if about exists
        let about = await About.findOne();

        // Handle profile image removal
        if (req.body.removeProfileImage === 'true') {
            console.log('🗑️ Removing profile image...');

            // Delete from Cloudinary if exists
            if (about?.profileImage?.public_id) {
                try {
                    await deleteImage(about.profileImage.public_id);
                    console.log('✅ Profile image deleted from Cloudinary');
                } catch (error) {
                    console.error('⚠️ Error deleting profile image from Cloudinary:', error);
                }
            }

            // Set profile image to empty
            aboutData.profileImage = {
                url: '',
                public_id: ''
            };
            console.log('✅ Profile image marked for removal');
        }

        // Handle new profile image upload (only if not removing)
        if (req.files?.profileImage && req.files.profileImage[0] && req.body.removeProfileImage !== 'true') {
            console.log('📸 New profile image uploaded');

            // Delete old profile image if exists
            if (about?.profileImage?.public_id) {
                try {
                    await deleteImage(about.profileImage.public_id);
                    console.log('🗑️ Deleted old profile image from Cloudinary');
                } catch (error) {
                    console.error('⚠️ Error deleting old profile image:', error);
                }
            }

            // Set new profile image
            aboutData.profileImage = {
                url: req.files.profileImage[0].path,
                public_id: req.files.profileImage[0].filename
            };
            console.log('✅ New profile image set:', aboutData.profileImage);
        }

        // Handle resume upload
        if (req.files?.resume && req.files.resume[0]) {
            console.log('📄 New resume uploaded');

            // Delete old resume if exists
            if (about?.resume?.public_id) {
                try {
                    await deleteImage(about.resume.public_id);
                    console.log('🗑️ Deleted old resume from Cloudinary');
                } catch (error) {
                    console.error('⚠️ Error deleting old resume:', error);
                }
            }

            // Set new resume
            aboutData.resume = {
                url: req.files.resume[0].path,
                public_id: req.files.resume[0].filename
            };
            console.log('✅ New resume set:', aboutData.resume);
        }

        // Update or create about
        if (about) {
            // Update existing about
            about = await About.findOneAndUpdate({}, aboutData, {
                new: true,
                runValidators: true
            });
            console.log('✅ About information updated successfully');
        } else {
            // Create new about
            about = await About.create(aboutData);
            console.log('✅ About information created successfully');
        }

        res.status(200).json({
            success: true,
            data: about,
            message: 'About information saved successfully'
        });
    } catch (error) {
        console.error('❌ Error in createOrUpdateAbout:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages.join(', ')
            });
        }

        // Handle duplicate key errors
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Duplicate entry found'
            });
        }

        res.status(500).json({
            success: false,
            message: error.message || 'Server error while updating about information'
        });
    }
};

// @desc    Delete profile image
// @route   DELETE /api/about/profile-image
// @access  Private
export const deleteProfileImage = async (req, res) => {
    try {
        const about = await About.findOne();

        if (!about) {
            return res.status(404).json({
                success: false,
                message: 'About information not found'
            });
        }

        if (!about.profileImage?.public_id) {
            return res.status(404).json({
                success: false,
                message: 'No profile image found'
            });
        }

        // Delete from Cloudinary
        try {
            await deleteImage(about.profileImage.public_id);
            console.log('🗑️ Deleted profile image from Cloudinary');
        } catch (error) {
            console.error('⚠️ Error deleting profile image from Cloudinary:', error);
        }

        // Update database
        about.profileImage = {
            url: '',
            public_id: ''
        };
        await about.save();

        res.status(200).json({
            success: true,
            message: 'Profile image deleted successfully',
            data: about
        });
    } catch (error) {
        console.error('❌ Error in deleteProfileImage:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while deleting profile image'
        });
    }
};

// @desc    Delete resume
// @route   DELETE /api/about/resume
// @access  Private
export const deleteResume = async (req, res) => {
    try {
        const about = await About.findOne();

        if (!about) {
            return res.status(404).json({
                success: false,
                message: 'About information not found'
            });
        }

        if (!about.resume?.public_id) {
            return res.status(404).json({
                success: false,
                message: 'No resume found'
            });
        }

        // Delete from Cloudinary
        try {
            await deleteImage(about.resume.public_id);
            console.log('🗑️ Deleted resume from Cloudinary');
        } catch (error) {
            console.error('⚠️ Error deleting resume from Cloudinary:', error);
        }

        // Update database
        about.resume = {
            url: '',
            public_id: ''
        };
        await about.save();

        res.status(200).json({
            success: true,
            message: 'Resume deleted successfully',
            data: about
        });
    } catch (error) {
        console.error('❌ Error in deleteResume:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error while deleting resume'
        });
    }
};
