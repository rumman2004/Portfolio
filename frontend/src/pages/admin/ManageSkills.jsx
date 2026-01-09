import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button, Modal, Input, Badge, GlassCard } from '../../components/ui';
import { skillsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';
import { skillIconMap, getSkillIcon } from '../../components/icons';

const ManageSkills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingSkill, setEditingSkill] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: 'frontend',
        proficiency: 50,
        iconName: '', // New field for icon selection
    });
    const [iconFile, setIconFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [useBuiltInIcon, setUseBuiltInIcon] = useState(true); // Toggle between built-in and upload

    // Available skill names for dropdown
    const availableSkills = {
        languages: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++'],
        frameworks: ['React', 'ReactJS', 'Node.js', 'NodeJS', 'Express', 'ExpressJS', 'Tailwind', 'TailwindCSS', 'Next.js', 'NextJS'],
        databases: ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis'],
        tools: ['Git', 'GitHub', 'Docker', 'Figma', 'VS Code', 'VSCode', 'Postman', 'Webpack', 'NPM', 'Yarn', 'WebStorm', 'Linux'],
    };

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const response = await skillsAPI.getGrouped();
            setSkills(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch skills');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (skill = null) => {
        if (skill) {
            setEditingSkill(skill);
            setFormData({
                name: skill.name,
                category: skill.category,
                proficiency: skill.proficiency,
                iconName: skill.iconName || '',
            });
        } else {
            setEditingSkill(null);
            setFormData({
                name: '',
                category: 'frontend',
                proficiency: 50,
                iconName: '',
            });
        }
        setIconFile(null);
        setUseBuiltInIcon(true);
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
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                data.append(key, formData[key]);
            });

            // Only upload file if not using built-in icon
            if (!useBuiltInIcon && iconFile) {
                data.append('image', iconFile);
            }

            if (editingSkill) {
                await skillsAPI.update(editingSkill._id, data);
                toast.success('Skill updated successfully');
            } else {
                await skillsAPI.create(data);
                toast.success('Skill created successfully');
            }

            setModalOpen(false);
            fetchSkills();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this skill?')) return;

        try {
            await skillsAPI.delete(id);
            toast.success('Skill deleted successfully');
            fetchSkills();
        } catch (error) {
            toast.error('Failed to delete skill');
        }
    };

    // Get icon component for display
    const getIconComponent = (skill) => {
        // Try iconName first, then fallback to name (lowercase)
        const iconKey = skill.iconName || skill.name.toLowerCase().replace(/\s+/g, '');
        const IconComponent = getSkillIcon(iconKey);

        if (IconComponent) {
            return <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3" />;
        }

        // Fallback to uploaded image
        if (skill.icon?.url) {
            return (
                <img
                    src={skill.icon.url}
                    alt={skill.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3"
                />
            );
        }

        return null;
    };

    // Get preview icon in modal
    const getPreviewIcon = () => {
        if (useBuiltInIcon && formData.iconName) {
            const IconComponent = getSkillIcon(formData.iconName);
            if (IconComponent) {
                return <IconComponent className="w-16 h-16 mx-auto" />;
            }
        } else if (iconFile) {
            return (
                <img
                    src={URL.createObjectURL(iconFile)}
                    alt="Preview"
                    className="w-16 h-16 mx-auto object-contain"
                />
            );
        }
        return null;
    };

    if (loading) return <Loader fullScreen size="xl" />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Manage Skills</h1>
                    <p className="text-[rgb(var(--text-secondary))] text-sm sm:text-base">
                        Add, edit, or remove your technical skills
                    </p>
                </div>
                <Button icon={Plus} onClick={() => handleOpenModal()} className="w-full sm:w-auto">
                    Add Skill
                </Button>
            </div>

            {/* Skills by Category */}
            {skills.length > 0 ? (
                <div className="space-y-6">
                    {skills.map((category) => (
                        <GlassCard key={category._id}>
                            <h2 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 capitalize">
                                {category._id}
                            </h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                                {category.skills.map((skill, index) => (
                                    <motion.div
                                        key={skill._id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <div className="glass p-4 rounded-lg group hover:scale-105 transition-all">
                                            {getIconComponent(skill)}
                                            
                                            <h3 className="font-medium text-center mb-2 text-sm sm:text-base">
                                                {skill.name}
                                            </h3>

                                            {/* Proficiency Bar */}
                                            <div className="mb-3">
                                                <div className="flex justify-between text-xs text-[rgb(var(--text-secondary))] mb-1">
                                                    <span>Proficiency</span>
                                                    <span>{skill.proficiency}%</span>
                                                </div>
                                                <div className="w-full bg-[rgb(var(--bg-secondary))] rounded-full h-2">
                                                    <div
                                                        className="bg-[rgb(var(--accent))] h-2 rounded-full transition-all duration-500"
                                                        style={{ width: `${skill.proficiency}%` }}
                                                    />
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    icon={Edit}
                                                    onClick={() => handleOpenModal(skill)}
                                                    className="flex-1 text-xs sm:text-sm"
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => handleDelete(skill._id)}
                                                    className="text-xs sm:text-sm"
                                                >
                                                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </GlassCard>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 sm:py-20">
                    <p className="text-[rgb(var(--text-secondary))] text-base sm:text-lg mb-4">
                        No skills yet. Add your first skill!
                    </p>
                    <Button icon={Plus} onClick={() => handleOpenModal()}>
                        Add Skill
                    </Button>
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingSkill ? 'Edit Skill' : 'Add Skill'}
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Skill Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="React, Node.js, etc."
                        required
                    />

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
                            <option value="frontend">Frontend</option>
                            <option value="backend">Backend</option>
                            <option value="database">Database</option>
                            <option value="tools">Tools</option>
                            <option value="languages">Languages</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                            Proficiency: {formData.proficiency}%
                        </label>
                        <input
                            type="range"
                            name="proficiency"
                            min="0"
                            max="100"
                            value={formData.proficiency}
                            onChange={handleChange}
                            className="w-full"
                        />
                    </div>

                    {/* Icon Selection Toggle */}
                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                            Icon Type
                        </label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={useBuiltInIcon}
                                    onChange={() => setUseBuiltInIcon(true)}
                                    className="accent-[rgb(var(--accent))]"
                                />
                                <span className="text-sm">Built-in Icons</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="radio"
                                    checked={!useBuiltInIcon}
                                    onChange={() => setUseBuiltInIcon(false)}
                                    className="accent-[rgb(var(--accent))]"
                                />
                                <span className="text-sm">Upload Custom</span>
                            </label>
                        </div>
                    </div>

                    {/* Built-in Icon Selection */}
                    {useBuiltInIcon ? (
                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                                Select Icon
                            </label>
                            <select
                                name="iconName"
                                value={formData.iconName}
                                onChange={handleChange}
                                className="w-full px-4 py-2.5 glass rounded-lg text-[rgb(var(--text-primary))] focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]"
                            >
                                <option value="">-- Select an icon --</option>
                                <optgroup label="Languages">
                                    {availableSkills.languages.map(skill => (
                                        <option key={skill} value={skill.toLowerCase()}>
                                            {skill}
                                        </option>
                                    ))}
                                </optgroup>
                                <optgroup label="Frameworks">
                                    {availableSkills.frameworks.map(skill => (
                                        <option key={skill} value={skill.toLowerCase()}>
                                            {skill}
                                        </option>
                                    ))}
                                </optgroup>
                                <optgroup label="Databases">
                                    {availableSkills.databases.map(skill => (
                                        <option key={skill} value={skill.toLowerCase()}>
                                            {skill}
                                        </option>
                                    ))}
                                </optgroup>
                                <optgroup label="Dev Tools">
                                    {availableSkills.tools.map(skill => (
                                        <option key={skill} value={skill.toLowerCase().replace(/\s+/g, '')}>
                                            {skill}
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
                        </div>
                    ) : (
                        <div>
                            <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                                Upload Custom Icon
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setIconFile(e.target.files[0])}
                                className="w-full px-4 py-2.5 glass rounded-lg text-[rgb(var(--text-primary))] text-sm"
                            />
                        </div>
                    )}

                    {/* Icon Preview */}
                    {(formData.iconName || iconFile) && (
                        <div className="glass p-4 rounded-lg">
                            <p className="text-sm text-[rgb(var(--text-secondary))] mb-2 text-center">
                                Icon Preview
                            </p>
                            <div className="flex justify-center">
                                {getPreviewIcon()}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button
                            type="submit"
                            className="flex-1"
                            loading={submitting}
                        >
                            {editingSkill ? 'Update' : 'Create'}
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

export default ManageSkills;
