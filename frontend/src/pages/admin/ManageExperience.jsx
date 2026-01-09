import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Calendar, MapPin, Briefcase } from 'lucide-react';
import { Button, Modal, Input, Textarea, GlassCard } from '../../components/ui';
import { experienceAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';

const ManageExperience = () => {
    const [experiences, setExperiences] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingExp, setEditingExp] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: '',
        responsibilities: '',
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const response = await experienceAPI.getAll();
            setExperiences(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch experiences');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (exp = null) => {
        if (exp) {
            setEditingExp(exp);
            setFormData({
                title: exp.title,
                company: exp.company,
                location: exp.location || '',
                startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
                endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
                current: exp.current,
                description: exp.description,
                responsibilities: exp.responsibilities?.join('\n') || '',
            });
        } else {
            setEditingExp(null);
            setFormData({
                title: '',
                company: '',
                location: '',
                startDate: '',
                endDate: '',
                current: false,
                description: '',
                responsibilities: '',
            });
        }
        setModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = {
                ...formData,
                responsibilities: formData.responsibilities
                    .split('\n')
                    .filter(r => r.trim())
                    .map(r => r.trim())
            };

            if (editingExp) {
                await experienceAPI.update(editingExp._id, data);
                toast.success('Experience updated successfully');
            } else {
                await experienceAPI.create(data);
                toast.success('Experience created successfully');
            }

            setModalOpen(false);
            fetchExperiences();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this experience?')) return;

        try {
            await experienceAPI.delete(id);
            toast.success('Experience deleted successfully');
            fetchExperiences();
        } catch (error) {
            toast.error('Failed to delete experience');
        }
    };

    if (loading) return <Loader fullScreen size="xl" />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Manage Experience</h1>
                    <p className="text-[rgb(var(--text-secondary))] text-sm sm:text-base">
                        Add, edit, or remove your work experience
                    </p>
                </div>
                <Button icon={Plus} onClick={() => handleOpenModal()} className="w-full sm:w-auto">
                    Add Experience
                </Button>
            </div>

            {/* Experiences List */}
            {experiences.length > 0 ? (
                <div className="space-y-4">
                    {experiences.map((exp, index) => (
                        <motion.div
                            key={exp._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <GlassCard className="hover:scale-[1.02] transition-transform">
                                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-start gap-3 mb-3">
                                            <div className="p-3 glass rounded-lg w-fit">
                                                <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-[rgb(var(--accent))]" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg sm:text-xl font-semibold mb-1 break-words">
                                                    {exp.title}
                                                </h3>
                                                <p className="text-[rgb(var(--accent))] font-medium text-sm sm:text-base">
                                                    {exp.company}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 text-xs sm:text-sm text-[rgb(var(--text-secondary))] mb-3">
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 flex-shrink-0" />
                                                <span className="break-words">
                                                    {new Date(exp.startDate).toLocaleDateString()} -
                                                    {exp.current ? ' Present' : ` ${new Date(exp.endDate).toLocaleDateString()}`}
                                                </span>
                                            </div>
                                            {exp.location && (
                                                <div className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4 flex-shrink-0" />
                                                    <span className="break-words">{exp.location}</span>
                                                </div>
                                            )}
                                        </div>

                                        <p className="text-[rgb(var(--text-secondary))] text-sm sm:text-base break-words">
                                            {exp.description}
                                        </p>

                                        {exp.responsibilities && exp.responsibilities.length > 0 && (
                                            <ul className="mt-3 space-y-1 text-xs sm:text-sm">
                                                {exp.responsibilities.slice(0, 3).map((resp, i) => (
                                                    <li key={i} className="flex gap-2 text-[rgb(var(--text-secondary))]">
                                                        <span className="text-[rgb(var(--accent))] flex-shrink-0">•</span>
                                                        <span className="break-words">{resp}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    {/* Actions */}
                                    <div className="flex lg:flex-col gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            icon={Edit}
                                            onClick={() => handleOpenModal(exp)}
                                            className="flex-1 lg:flex-none text-xs sm:text-sm"
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            icon={Trash2}
                                            onClick={() => handleDelete(exp._id)}
                                            className="flex-1 lg:flex-none text-xs sm:text-sm"
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 sm:py-20">
                    <p className="text-[rgb(var(--text-secondary))] text-base sm:text-lg mb-4">
                        No experience yet. Add your first experience!
                    </p>
                    <Button icon={Plus} onClick={() => handleOpenModal()}>
                        Add Experience
                    </Button>
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingExp ? 'Edit Experience' : 'Add Experience'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Job Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Senior Developer"
                        required
                    />

                    <Input
                        label="Company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Company Name"
                        required
                    />

                    <Input
                        label="Location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="City, Country"
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                        <Input
                            label="Start Date"
                            type="date"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="End Date"
                            type="date"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleChange}
                            disabled={formData.current}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="current"
                            checked={formData.current}
                            onChange={handleChange}
                            className="w-4 h-4"
                        />
                        <label className="text-sm">Currently working here</label>
                    </div>

                    <Textarea
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Brief description of your role..."
                        required
                    />

                    <Textarea
                        label="Responsibilities (one per line)"
                        name="responsibilities"
                        value={formData.responsibilities}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Led team of 5 developers&#10;Developed REST APIs&#10;Improved performance by 40%"
                    />

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            type="submit"
                            className="flex-1"
                            loading={submitting}
                        >
                            {editingExp ? 'Update' : 'Create'}
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

export default ManageExperience;
