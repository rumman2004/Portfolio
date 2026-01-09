import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { Button, Modal, Input, GlassCard, Badge } from '../../components/ui';
import { socialsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';
import { socialIconMap } from '../../components/icons/SocialIcons';

const ManageSocials = () => {
    const [socials, setSocials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSocial, setEditingSocial] = useState(null);
    const [formData, setFormData] = useState({
        platform: 'github',
        url: '',
        username: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchSocials();
    }, []);

    const fetchSocials = async () => {
        try {
            const response = await socialsAPI.getAll();
            setSocials(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch social links');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (social = null) => {
        if (social) {
            setEditingSocial(social);
            setFormData({
                platform: social.platform,
                url: social.url,
                username: social.username || '',
            });
        } else {
            setEditingSocial(null);
            setFormData({
                platform: 'github',
                url: '',
                username: '',
            });
        }
        setModalOpen(true);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (editingSocial) {
                await socialsAPI.update(editingSocial._id, formData);
                toast.success('Social link updated successfully');
            } else {
                await socialsAPI.create(formData);
                toast.success('Social link created successfully');
            }

            setModalOpen(false);
            fetchSocials();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this social link?')) return;

        try {
            await socialsAPI.delete(id);
            toast.success('Social link deleted successfully');
            fetchSocials();
        } catch (error) {
            toast.error('Failed to delete social link');
        }
    };

    const handleToggleVisibility = async (id) => {
        try {
            await socialsAPI.toggleVisibility(id);
            toast.success('Visibility updated');
            fetchSocials();
        } catch (error) {
            toast.error('Failed to update visibility');
        }
    };

    // Get icon component for platform
    const getIcon = (platform) => {
        const IconComponent = socialIconMap[platform.toLowerCase()] || socialIconMap.github;
        return IconComponent;
    };

    if (loading) return <Loader fullScreen size="xl" />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Manage Social Links</h1>
                    <p className="text-[rgb(var(--text-secondary))] text-sm sm:text-base">
                        Add, edit, or remove your social media profiles
                    </p>
                </div>
                <Button icon={Plus} onClick={() => handleOpenModal()} className="w-full sm:w-auto">
                    Add Social Link
                </Button>
            </div>

            {/* Socials Grid */}
            {socials.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {socials.map((social, index) => {
                        const Icon = getIcon(social.platform);

                        return (
                            <motion.div
                                key={social._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <GlassCard className="hover:scale-105 transition-transform">
                                    <div className="flex items-start gap-4 mb-4">
                                        {/* Platform Icon */}
                                        <div className="p-3 glass rounded-lg flex-shrink-0">
                                            <Icon className="w-8 h-8" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base sm:text-lg font-semibold capitalize mb-1 break-words">
                                                {social.platform}
                                            </h3>
                                            {social.username && (
                                                <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] break-all">
                                                    @{social.username}
                                                </p>
                                            )}
                                        </div>

                                        <Badge variant={social.visible ? 'success' : 'default'}>
                                            {social.visible ? 'Visible' : 'Hidden'}
                                        </Badge>
                                    </div>

                                    <a
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs sm:text-sm text-[rgb(var(--accent))] hover:underline mb-4 block break-all"
                                    >
                                        {social.url}
                                    </a>

                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleToggleVisibility(social._id)}
                                            className="text-xs sm:text-sm"
                                        >
                                            {social.visible ? (
                                                <>
                                                    <EyeOff className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    <span className="hidden sm:inline">Hide</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                                                    <span className="hidden sm:inline">Show</span>
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            icon={Edit}
                                            onClick={() => handleOpenModal(social)}
                                            className="text-xs sm:text-sm"
                                        >
                                            <span className="hidden sm:inline">Edit</span>
                                        </Button>
                                    </div>

                                    <Button
                                        variant="danger"
                                        size="sm"
                                        icon={Trash2}
                                        onClick={() => handleDelete(social._id)}
                                        className="w-full mt-2 text-xs sm:text-sm"
                                    >
                                        Delete
                                    </Button>
                                </GlassCard>
                            </motion.div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12 sm:py-20">
                    <p className="text-[rgb(var(--text-secondary))] text-base sm:text-lg mb-4">
                        No social links yet. Add your first social link!
                    </p>
                    <Button icon={Plus} onClick={() => handleOpenModal()}>
                        Add Social Link
                    </Button>
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingSocial ? 'Edit Social Link' : 'Add Social Link'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                            Platform
                        </label>
                        <select
                            name="platform"
                            value={formData.platform}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 glass rounded-lg text-[rgb(var(--text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
                        >
                            <option value="github">GitHub</option>
                            <option value="linkedin">LinkedIn</option>
                            <option value="twitter">X (Twitter)</option>
                            <option value="instagram">Instagram</option>
                            <option value="facebook">Facebook</option>
                            <option value="youtube">YouTube</option>
                            <option value="discord">Discord</option>
                            <option value="gmail">Gmail / Email</option>
                            <option value="medium">Medium</option>
                            <option value="dev">Dev.to</option>
                            <option value="stackoverflow">Stack Overflow</option>
                            <option value="behance">Behance</option>
                            <option value="dribbble">Dribbble</option>
                            <option value="portfolio">Portfolio Website</option>
                            <option value="other">Other</option>
                        </select>

                        {/* Icon Preview */}
                        <div className="mt-3 p-3 glass rounded-lg flex items-center gap-3">
                            {(() => {
                                const PreviewIcon = getIcon(formData.platform);
                                return <PreviewIcon className="w-8 h-8" />;
                            })()}
                            <span className="text-sm text-[rgb(var(--text-secondary))]">
                                Icon preview
                            </span>
                        </div>
                    </div>

                    <Input
                        label="Profile URL"
                        name="url"
                        value={formData.url}
                        onChange={handleChange}
                        placeholder="https://github.com/username"
                        required
                    />

                    <Input
                        label="Username (Optional)"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="your_username"
                    />

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button type="submit" className="flex-1" loading={submitting}>
                            {editingSocial ? 'Update' : 'Create'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setModalOpen(false)}
                            className="w-full sm:w-auto"
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageSocials;
