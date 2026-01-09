import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { projectsAPI, skillsAPI } from '../../services/api';
import { GlassCard, Badge, Button } from '../../components/ui';
import { Github, ExternalLink, Filter } from 'lucide-react';
import Loader from '../../components/ui/Loader';
import { getSkillIcon } from '../../components/icons'; // ✅ ADD THIS IMPORT

const WorkPage = () => {
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [projectsRes, skillsRes] = await Promise.all([
                projectsAPI.getAll(),
                skillsAPI.getGrouped(),
            ]);
            setProjects(projectsRes.data.data);
            setSkills(skillsRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = ['all', 'web', 'mobile', 'fullstack', 'other'];

    const filteredProjects = filter === 'all'
        ? projects
        : projects.filter(p => p.category === filter);

    // ✅ NEW: Get skill icon component
    const getSkillIconComponent = (skill) => {
        // Try to get built-in icon first
        const IconComponent = getSkillIcon(skill.iconName || skill.name);

        if (IconComponent) {
            return <IconComponent className="w-12 h-12 mx-auto mb-2" />;
        }

        // Fallback to uploaded image
        if (skill.icon?.url) {
            return (
                <img
                    src={skill.icon.url}
                    alt={skill.name}
                    className="w-12 h-12 mx-auto mb-2 object-contain"
                />
            );
        }

        return null;
    };

    if (loading) return <Loader fullScreen size="xl" />;

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-12 sm:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8 sm:mb-12"
                >
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">My Work</h1>
                    <p className="text-base sm:text-lg lg:text-xl text-[rgb(var(--text-secondary))] max-w-2xl mx-auto px-4">
                        Check out my latest projects and see what I've been working on
                    </p>
                </motion.div>

                {/* Filter */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex flex-wrap justify-center items-center gap-3 mb-8 sm:mb-12"
                >
                    <Filter className="w-5 h-5 text-[rgb(var(--text-secondary))]" />
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setFilter(cat)}
                            className={`px-4 sm:px-6 py-2 rounded-full transition-all duration-300 text-sm sm:text-base ${filter === cat
                                    ? 'bg-[rgb(var(--accent))] text-white'
                                    : 'glass hover:bg-[rgb(var(--accent))]/20'
                                }`}
                        >
                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </button>
                    ))}
                </motion.div>

                {/* Projects Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-20">
                    {filteredProjects.map((project, index) => (
                        <motion.div
                            key={project._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <GlassCard className="h-full flex flex-col">
                                {/* Project Image */}
                                <div className="relative overflow-hidden rounded-lg mb-4 group">
                                    <img
                                        src={project.image.url}
                                        alt={project.title}
                                        className="w-full h-40 sm:h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                                        {project.githubLink && (
                                            <a
                                                href={project.githubLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
                                            >
                                                <Github className="w-5 h-5 text-white" />
                                            </a>
                                        )}
                                        {project.liveLink && (
                                            <a
                                                href={project.liveLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all"
                                            >
                                                <ExternalLink className="w-5 h-5 text-white" />
                                            </a>
                                        )}
                                    </div>
                                </div>

                                {/* Project Info */}
                                <div className="flex-1 flex flex-col">
                                    <div className="flex items-start justify-between mb-2">
                                        <h3 className="text-lg sm:text-xl font-semibold">{project.title}</h3>
                                        {project.featured && (
                                            <Badge variant="warning">Featured</Badge>
                                        )}
                                    </div>

                                    <p className="text-[rgb(var(--text-secondary))] text-sm mb-4 flex-1">
                                        {project.description}
                                    </p>

                                    {/* Technologies */}
                                    {project.technologies && project.technologies.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {project.technologies.map((tech, i) => (
                                                <Badge key={i} variant="info">
                                                    {tech}
                                                </Badge>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                {filteredProjects.length === 0 && (
                    <div className="text-center py-12 sm:py-20">
                        <p className="text-[rgb(var(--text-secondary))] text-base sm:text-lg">
                            No projects found in this category
                        </p>
                    </div>
                )}

                {/* Skills Section - ✅ UPDATED WITH ICONS */}
                {skills.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12">
                            Skills & Technologies
                        </h2>
                        <div className="space-y-6 sm:space-y-8">
                            {skills.map((category) => (
                                <GlassCard key={category._id}>
                                    <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 capitalize">
                                        {category._id}
                                    </h3>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
                                        {category.skills.map((skill, index) => (
                                            <motion.div
                                                key={skill._id}
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                whileInView={{ opacity: 1, scale: 1 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: index * 0.05 }}
                                                whileHover={{ scale: 1.05, y: -5 }}
                                                className="glass p-4 rounded-lg text-center group hover:bg-[rgb(var(--accent))]/10 transition-all"
                                            >
                                                {/* ✅ USE ICON COMPONENT */}
                                                {getSkillIconComponent(skill)}

                                                <p className="font-medium text-sm sm:text-base mb-2">
                                                    {skill.name}
                                                </p>

                                                {skill.proficiency && (
                                                    <div className="mt-2">
                                                        <div className="flex justify-between text-xs text-[rgb(var(--text-secondary))] mb-1">
                                                            <span>Proficiency</span>
                                                            <span>{skill.proficiency}%</span>
                                                        </div>
                                                        <div className="w-full bg-[rgb(var(--bg-secondary))] rounded-full h-2">
                                                            <motion.div
                                                                initial={{ width: 0 }}
                                                                whileInView={{ width: `${skill.proficiency}%` }}
                                                                viewport={{ once: true }}
                                                                transition={{ duration: 1, delay: 0.2 }}
                                                                className="bg-[rgb(var(--accent))] h-2 rounded-full"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </GlassCard>
                            ))}
                        </div>
                    </motion.div>
                )}
            </section>
        </div>
    );
};

export default WorkPage;
