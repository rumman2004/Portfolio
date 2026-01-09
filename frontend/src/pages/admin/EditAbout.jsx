import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Mail, Phone, MapPin, Briefcase, Save, Upload, TrendingUp,
    Code, Award, Users, X, Trash2
} from 'lucide-react';
import { Input, Button, Textarea, GlassCard } from '../../components/ui';
import { aboutAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';

const EditAbout = () => {
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        title: '',
        bio: '',
        email: '',
        phone: '',
        location: '',
        stats: {
            yearsExperience: 2,
            projectsCompleted: 10,
            certificatesEarned: 5,
            happyClients: 10
        }
    });
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState('');
    const [removeProfileImage, setRemoveProfileImage] = useState(false);
    const [resume, setResume] = useState(null);
    const [currentResume, setCurrentResume] = useState(null);
    const [showRemoveConfirm, setShowRemoveConfirm] = useState(false);

    useEffect(() => {
        fetchAbout();
    }, []);

    const fetchAbout = async () => {
        try {
            const response = await aboutAPI.get();
            const data = response.data.data;

            if (data) {
                setFormData({
                    name: data.name || '',
                    title: data.title || '',
                    bio: data.bio || '',
                    email: data.email || '',
                    phone: data.phone || '',
                    location: data.location || '',
                    stats: {
                        yearsExperience: data.stats?.yearsExperience || 2,
                        projectsCompleted: data.stats?.projectsCompleted || 10,
                        certificatesEarned: data.stats?.certificatesEarned || 5,
                        happyClients: data.stats?.happyClients || 10
                    }
                });

                if (data.profileImage?.url) {
                    setProfileImagePreview(data.profileImage.url);
                }

                if (data.resume?.url) {
                    setCurrentResume(data.resume.url);
                }
            }
        } catch (error) {
            console.log('No about data yet, starting fresh');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleStatsChange = (e) => {
        setFormData({
            ...formData,
            stats: {
                ...formData.stats,
                [e.target.name]: parseInt(e.target.value) || 0
            }
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Image size should be less than 5MB');
                return;
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                toast.error('Please upload an image file');
                return;
            }

            setProfileImage(file);
            setProfileImagePreview(URL.createObjectURL(file));
            setRemoveProfileImage(false); // Reset remove flag if new image is selected
        }
    };

    const handleRemoveProfileImage = () => {
        setShowRemoveConfirm(false);
        setProfileImagePreview('');
        setProfileImage(null);
        setRemoveProfileImage(true);
        toast.success('Profile image will be removed on save');
    };

    const handleCancelRemove = () => {
        setShowRemoveConfirm(false);
    };

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size should be less than 5MB');
                return;
            }

            // Validate file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                toast.error('Please upload a PDF or DOC file');
                return;
            }

            setResume(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = new FormData();

            // Append text fields
            data.append('name', formData.name.trim());
            data.append('title', formData.title.trim());
            data.append('bio', formData.bio.trim());
            data.append('email', formData.email.trim());

            if (formData.phone) data.append('phone', formData.phone.trim());
            if (formData.location) data.append('location', formData.location.trim());

            // Append stats as JSON string
            data.append('stats', JSON.stringify(formData.stats));

            // Handle profile image removal
            if (removeProfileImage) {
                data.append('removeProfileImage', 'true');
            }

            // Append new profile image if selected
            if (profileImage) {
                data.append('profileImage', profileImage);
            }

            // Append resume if selected
            if (resume) {
                data.append('resume', resume);
            }

            await aboutAPI.update(data);
            toast.success('About information updated successfully!');

            // Reset states
            setProfileImage(null);
            setResume(null);
            setRemoveProfileImage(false);

            // Refresh data
            fetchAbout();
        } catch (error) {
            console.error('Error updating about:', error);
            toast.error(error.response?.data?.message || 'Failed to update about information');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loader fullScreen size="xl" />;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Edit About Section</h1>
                <p className="text-[rgb(var(--text-secondary))] text-sm sm:text-base">
                    Update your personal information, profile, and homepage stats
                </p>
            </div>

            {/* Form */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <GlassCard>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Profile Image Section */}
                        <div className="text-center pb-6 border-b border-[rgb(var(--border))]">
                            <h3 className="text-lg sm:text-xl font-semibold mb-4">Profile Image</h3>

                            <div className="flex flex-col items-center gap-4">
                                {profileImagePreview ? (
                                    <motion.div
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        className="relative group"
                                    >
                                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[rgb(var(--accent))] shadow-lg">
                                            <img
                                                src={profileImagePreview}
                                                alt="Profile preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>

                                        {/* Remove button overlay */}
                                        <button
                                            type="button"
                                            onClick={() => setShowRemoveConfirm(true)}
                                            className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-colors transform hover:scale-110"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-[rgb(var(--bg-secondary))] border-4 border-dashed border-[rgb(var(--border))] flex items-center justify-center">
                                        <User className="w-12 h-12 text-[rgb(var(--text-secondary))]" />
                                    </div>
                                )}

                                <div className="flex flex-col sm:flex-row gap-3">
                                    <label className="cursor-pointer">
                                        <div className="px-4 py-2 glass rounded-lg hover:bg-[rgb(var(--accent))]/20 transition-colors flex items-center gap-2">
                                            <Upload className="w-4 h-4" />
                                            <span className="text-sm">
                                                {profileImagePreview ? 'Change Photo' : 'Upload Photo'}
                                            </span>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                <p className="text-xs text-[rgb(var(--text-secondary))]">
                                    Recommended: Square image, at least 400x400px (Max 5MB)
                                </p>
                            </div>
                        </div>

                        {/* Personal Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg sm:text-xl font-semibold">Personal Information</h3>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <Input
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    icon={User}
                                    placeholder="John Doe"
                                    required
                                />

                                <Input
                                    label="Professional Title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    icon={Briefcase}
                                    placeholder="Full Stack Developer"
                                    required
                                />
                            </div>

                            <Textarea
                                label="Bio / About Me"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows={5}
                                placeholder="Tell visitors about yourself, your skills, and what you do..."
                                required
                            />
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4 pt-6 border-t border-[rgb(var(--border))]">
                            <h3 className="text-lg sm:text-xl font-semibold">Contact Information</h3>

                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                icon={Mail}
                                placeholder="your.email@example.com"
                                required
                            />

                            <div className="grid sm:grid-cols-2 gap-4">
                                <Input
                                    label="Phone"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    icon={Phone}
                                    placeholder="+91 1234567890"
                                />

                                <Input
                                    label="Location"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    icon={MapPin}
                                    placeholder="City, Country"
                                />
                            </div>
                        </div>

                        {/* Homepage Statistics */}
                        <div className="space-y-4 pt-6 border-t border-[rgb(var(--border))]">
                            <div className="flex items-center gap-2 mb-4">
                                <TrendingUp className="w-5 h-5 text-[rgb(var(--accent))]" />
                                <h3 className="text-lg sm:text-xl font-semibold">Homepage Statistics</h3>
                            </div>
                            <p className="text-sm text-[rgb(var(--text-secondary))] mb-4">
                                These numbers will appear on your homepage stats section
                            </p>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <Input
                                    label="Years of Experience"
                                    type="number"
                                    name="yearsExperience"
                                    value={formData.stats.yearsExperience}
                                    onChange={handleStatsChange}
                                    icon={Briefcase}
                                    placeholder="2"
                                    min="0"
                                />

                                <Input
                                    label="Projects Completed"
                                    type="number"
                                    name="projectsCompleted"
                                    value={formData.stats.projectsCompleted}
                                    onChange={handleStatsChange}
                                    icon={Code}
                                    placeholder="10"
                                    min="0"
                                />

                                <Input
                                    label="Certificates Earned"
                                    type="number"
                                    name="certificatesEarned"
                                    value={formData.stats.certificatesEarned}
                                    onChange={handleStatsChange}
                                    icon={Award}
                                    placeholder="5"
                                    min="0"
                                />

                                <Input
                                    label="Happy Clients"
                                    type="number"
                                    name="happyClients"
                                    value={formData.stats.happyClients}
                                    onChange={handleStatsChange}
                                    icon={Users}
                                    placeholder="10"
                                    min="0"
                                />
                            </div>
                        </div>

                        {/* Resume Upload */}
                        <div className="space-y-4 pt-6 border-t border-[rgb(var(--border))]">
                            <h3 className="text-lg sm:text-xl font-semibold">Resume / CV</h3>

                            <div className="space-y-3">
                                {currentResume && (
                                    <div className="glass p-4 rounded-lg">
                                        <p className="text-sm text-[rgb(var(--text-secondary))] mb-2">
                                            Current Resume:
                                        </p>
                                        <a
                                            href={currentResume}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-[rgb(var(--accent))] hover:underline text-sm break-all"
                                        >
                                            View Current Resume
                                        </a>
                                    </div>
                                )}

                                <label className="block">
                                    <span className="text-sm font-medium text-[rgb(var(--text-secondary))] mb-2 block">
                                        Upload New Resume (PDF, DOC, DOCX)
                                    </span>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx"
                                        onChange={handleResumeChange}
                                        className="w-full px-4 py-2.5 glass rounded-lg text-[rgb(var(--text-primary))] text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[rgb(var(--accent))] file:text-white file:cursor-pointer hover:file:bg-[rgb(var(--accent))]/80 transition-colors"
                                    />
                                </label>

                                {resume && (
                                    <p className="text-sm text-green-500 flex items-center gap-2">
                                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                                        New resume selected: {resume.name}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-[rgb(var(--border))]">
                            <Button
                                type="submit"
                                loading={submitting}
                                icon={Save}
                                className="w-full sm:w-auto"
                                size="lg"
                            >
                                {submitting ? 'Saving...' : 'Save Changes'}
                            </Button>
                        </div>
                    </form>
                </GlassCard>
            </motion.div>

            {/* Info Card */}
            <GlassCard>
                <h3 className="text-lg font-semibold mb-3">💡 Tips</h3>
                <ul className="space-y-2 text-sm text-[rgb(var(--text-secondary))]">
                    <li>• Use a professional profile photo with good lighting</li>
                    <li>• Keep your bio concise and highlight your key skills</li>
                    <li>• Make sure your contact information is up to date</li>
                    <li>• Update stats regularly to reflect your current achievements</li>
                    <li>• Upload your latest resume in PDF format (Max 5MB)</li>
                    <li>• Click the trash icon on your profile picture to remove it</li>
                </ul>
            </GlassCard>

            {/* Remove Confirmation Modal */}
            <AnimatePresence>
                {showRemoveConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={handleCancelRemove}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="glass p-6 rounded-2xl max-w-md w-full border border-[rgb(var(--border))]"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="p-3 bg-red-500/10 rounded-full">
                                    <Trash2 className="w-6 h-6 text-red-500" />
                                </div>
                                <h3 className="text-xl font-semibold">Remove Profile Picture</h3>
                            </div>

                            <p className="text-[rgb(var(--text-secondary))] mb-6">
                                Are you sure you want to remove your profile picture? This action will take effect when you save your changes.
                            </p>

                            <div className="flex gap-3">
                                <Button
                                    type="button"
                                    onClick={handleCancelRemove}
                                    variant="secondary"
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="button"
                                    onClick={handleRemoveProfileImage}
                                    className="flex-1 bg-red-500 hover:bg-red-600"
                                >
                                    Remove
                                </Button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default EditAbout;
