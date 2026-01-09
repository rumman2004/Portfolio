import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, ExternalLink, Github } from 'lucide-react';
import { Button, Modal, Input, Textarea, Badge, GlassCard } from '../../components/ui';
import { projectsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';

const ManageProjects = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        shortDescription: '',
        category: 'web',
        technologies: '',
        githubLink: '',
        liveLink: '',
        featured: false,
    });
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await projectsAPI.getAll();
            setProjects(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (project = null) => {
        if (project) {
            setEditingProject(project);
            setFormData({
                title: project.title,
                description: project.description,
                shortDescription: project.shortDescription || '',
                category: project.category,
                technologies: project.technologies?.join(', ') || '',
                githubLink: project.githubLink || '',
                liveLink: project.liveLink || '',
                featured: project.featured,
            });
        } else {
            setEditingProject(null);
            setFormData({
                title: '',
                description: '',
                shortDescription: '',
                category: 'web',
                technologies: '',
                githubLink: '',
                liveLink: '',
                featured: false,
            });
        }
        setImageFile(null);
        setModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'technologies') {
                    data.append(key, JSON.stringify(formData[key].split(',').map(t => t.trim())));
                } else {
                    data.append(key, formData[key]);
                }
            });

            if (imageFile) {
                data.append('image', imageFile);
            }

            if (editingProject) {
                await projectsAPI.update(editingProject._id, data);
                toast.success('Project updated successfully');
            } else {
                await projectsAPI.create(data);
                toast.success('Project created successfully');
            }

            setModalOpen(false);
            fetchProjects();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;

        try {
            await projectsAPI.delete(id);
            toast.success('Project deleted successfully');
            fetchProjects();
        } catch (error) {
            toast.error('Failed to delete project');
        }
    };

    if (loading) return <Loader fullScreen size="xl" />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Manage Projects</h1>
                    <p className="text-[rgb(var(--text-secondary))]">
                        Add, edit, or remove your portfolio projects
                    </p>
                </div>
                <Button icon={Plus} onClick={() => handleOpenModal()}>
                    Add Project
                </Button>
            </div>

            {/* Projects Grid */}
            {projects.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project, index) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <GlassCard className="h-full flex flex-col">
                                <img
                                    src={project.image.url}
                                    alt={project.title}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />

                                <div className="flex-1">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-xl font-semibold">{project.title}</h3>
                                        {project.featured && <Badge variant="warning">Featured</Badge>}
                                    </div>

                                    <p className="text-[rgb(var(--text-secondary))] text-sm mb-4 line-clamp-2">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.technologies?.slice(0, 3).map((tech, i) => (
                                            <Badge key={i} variant="info">{tech}</Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-[rgb(var(--border))]">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={Edit}
                                        onClick={() => handleOpenModal(project)}
                                        className="flex-1"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        icon={Trash2}
                                        onClick={() => handleDelete(project._id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-[rgb(var(--text-secondary))] text-lg mb-4">
                        No projects yet. Add your first project!
                    </p>
                    <Button icon={Plus} onClick={() => handleOpenModal()}>
                        Add Project
                    </Button>
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingProject ? 'Edit Project' : 'Add Project'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />

                    <Textarea
                        label="Short Description"
                        name="shortDescription"
                        value={formData.shortDescription}
                        onChange={handleChange}
                        rows={2}
                    />

                    <Textarea
                        label="Full Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        required
                    />

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                                Category
                            </label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 glass rounded-lg text-[rgb(var(--text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
                            >
                                <option value="web">Web</option>
                                <option value="mobile">Mobile</option>
                                <option value="fullstack">Full Stack</option>
                                <option value="other">Other</option>
                            </select>
                        </div>

                        <Input
                            label="Technologies (comma separated)"
                            name="technologies"
                            value={formData.technologies}
                            onChange={handleChange}
                            placeholder="React, Node.js, MongoDB"
                        />
                    </div>

                    <Input
                        label="GitHub Link"
                        name="githubLink"
                        value={formData.githubLink}
                        onChange={handleChange}
                        icon={Github}
                    />

                    <Input
                        label="Live Link"
                        name="liveLink"
                        value={formData.liveLink}
                        onChange={handleChange}
                        icon={ExternalLink}
                    />

                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                            Project Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full px-4 py-2.5 glass rounded-lg text-[rgb(var(--text-primary))]"
                            required={!editingProject}
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="featured"
                            checked={formData.featured}
                            onChange={handleChange}
                            className="w-4 h-4"
                        />
                        <label className="text-sm">Mark as featured</label>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="submit"
                            className="flex-1"
                            loading={submitting}
                        >
                            {editingProject ? 'Update' : 'Create'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setModalOpen(false)}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default ManageProjects;
