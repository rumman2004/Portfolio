import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Save } from 'lucide-react';
import { Input, Button, GlassCard } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { authAPI } from '../../services/api';
import toast from 'react-hot-toast';

const Profile = () => {
    const { admin, login } = useAuth();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [loading, setLoading] = useState(false);
    const [passwordMode, setPasswordMode] = useState(false);

    useEffect(() => {
        if (admin) {
            setFormData(prev => ({
                ...prev,
                name: admin.name,
                email: admin.email,
            }));
        }
    }, [admin]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const updateData = {
                name: formData.name,
                email: formData.email,
            };

            // Only include password if trying to change it
            if (passwordMode) {
                if (formData.newPassword !== formData.confirmPassword) {
                    toast.error('New passwords do not match');
                    setLoading(false);
                    return;
                }
                if (formData.newPassword.length < 6) {
                    toast.error('Password must be at least 6 characters');
                    setLoading(false);
                    return;
                }
                updateData.password = formData.newPassword;
            }

            const response = await authAPI.updateProfile(updateData);
            login(response.data.data);
            toast.success('Profile updated successfully');

            // Reset password fields
            if (passwordMode) {
                setFormData(prev => ({
                    ...prev,
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: '',
                }));
                setPasswordMode(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            {/* Header */}
            <div className="text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Profile Settings</h1>
                <p className="text-[rgb(var(--text-secondary))] text-sm sm:text-base">
                    Manage your account information and password
                </p>
            </div>

            {/* Profile Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <GlassCard>
                    <div className="flex flex-col sm:flex-row items-center gap-6 mb-6 pb-6 border-b border-[rgb(var(--border))]">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-r from-[rgb(var(--accent))] to-purple-500 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold">
                            {admin?.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="text-center sm:text-left">
                            <h2 className="text-xl sm:text-2xl font-bold mb-1">{admin?.name}</h2>
                            <p className="text-sm sm:text-base text-[rgb(var(--text-secondary))] break-all">
                                {admin?.email}
                            </p>
                            <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] mt-2">
                                Administrator
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-4 sm:space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg sm:text-xl font-semibold">Basic Information</h3>

                            <Input
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                icon={User}
                                required
                            />

                            <Input
                                label="Email"
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                icon={Mail}
                                required
                            />
                        </div>

                        {/* Password Section */}
                        <div className="space-y-4 pt-6 border-t border-[rgb(var(--border))]">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <h3 className="text-lg sm:text-xl font-semibold">Password</h3>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setPasswordMode(!passwordMode)}
                                    className="w-full sm:w-auto"
                                >
                                    {passwordMode ? 'Cancel Password Change' : 'Change Password'}
                                </Button>
                            </div>

                            {passwordMode && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="space-y-4"
                                >
                                    <Input
                                        label="New Password"
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        icon={Lock}
                                        placeholder="Enter new password"
                                        required={passwordMode}
                                    />

                                    <Input
                                        label="Confirm New Password"
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        icon={Lock}
                                        placeholder="Confirm new password"
                                        required={passwordMode}
                                    />

                                    <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))]">
                                        Password must be at least 6 characters long
                                    </p>
                                </motion.div>
                            )}
                        </div>

                        {/* Save Button */}
                        <div className="pt-6">
                            <Button
                                type="submit"
                                loading={loading}
                                icon={Save}
                                className="w-full sm:w-auto"
                                size="lg"
                            >
                                Save Changes
                            </Button>
                        </div>
                    </form>
                </GlassCard>
            </motion.div>

            {/* Account Info */}
            <GlassCard>
                <h3 className="text-lg sm:text-xl font-semibold mb-4">Account Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-[rgb(var(--text-secondary))] mb-1">Account Type</p>
                        <p className="font-medium">Administrator</p>
                    </div>
                    <div>
                        <p className="text-[rgb(var(--text-secondary))] mb-1">Member Since</p>
                        <p className="font-medium">
                            {admin?.createdAt
                                ? new Date(admin.createdAt).toLocaleDateString()
                                : 'N/A'}
                        </p>
                    </div>
                </div>
            </GlassCard>
        </div>
    );
};

export default Profile;
