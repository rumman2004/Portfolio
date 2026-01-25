import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Download, Code, Palette, Rocket, Mail, Github, Linkedin, ExternalLink, Award, Briefcase, Star, Calendar, MapPin, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, GlassCard } from '../../components/ui';
import { useEffect, useState, useRef } from 'react';
import { aboutAPI, projectsAPI, skillsAPI, experienceAPI, certificatesAPI, socialsAPI } from '../../services/api';
import { socialIconMap } from '../../components/icons/SocialIcons';
import { getSkillIcon } from '../../components/icons'; // ✅ ADD THIS IMPORT


const Home = () => {
    const [about, setAbout] = useState(null);
    const [projects, setProjects] = useState([]);
    const [skills, setSkills] = useState([]);
    const [experiences, setExperiences] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [socials, setSocials] = useState([]);
    const [loading, setLoading] = useState(true);

    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll();
    const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.8]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [aboutRes, projectsRes, skillsRes, expRes, certRes, socialsRes] = await Promise.all([
                aboutAPI.get(),
                projectsAPI.getAll({ featured: true }),
                skillsAPI.getGrouped(),
                experienceAPI.getAll(),
                certificatesAPI.getAll(),
                socialsAPI.getAll({ visible: true }),
            ]);

            setAbout(aboutRes.data.data);
            setProjects(projectsRes.data.data.slice(0, 6));
            setSkills(skillsRes.data.data);
            setExperiences(expRes.data.data.slice(0, 3));
            setCertificates(certRes.data.data.slice(0, 4));
            setSocials(socialsRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    // Format date helper
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            year: 'numeric'
        });
    };

    // Get social icon component
    const getSocialIcon = (platform) => {
        const IconComponent = socialIconMap[platform.toLowerCase()];
        return IconComponent || socialIconMap.github;
    };

    // ✅ NEW: Get skill icon component
    const getSkillIconComponent = (skill) => {
        // Try to get built-in icon first
        const IconComponent = getSkillIcon(skill.iconName || skill.name);

        if (IconComponent) {
            return <IconComponent className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2" />;
        }

        // Fallback to uploaded image
        if (skill.icon?.url) {
            return (
                <img
                    src={skill.icon.url}
                    alt={skill.name}
                    className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2"
                />
            );
        }

        return null;
    };

    return (
        <div className="min-h-screen overflow-hidden">
            {/* Hero Section with Parallax */}
            <motion.section
                ref={heroRef}
                style={{ opacity, scale }}
                className="relative min-h-screen flex items-center"
            >
                <div className="container mx-auto px-4 py-12 sm:py-20 lg:py-32">
                    <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
                        {/* Text Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="flex-1 text-center lg:text-left"
                        >
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="inline-block px-4 py-2 glass rounded-full mb-6"
                            >
                                <span className="text-sm sm:text-base">👋 Welcome to my portfolio</span>
                            </motion.div>

                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-4 sm:mb-6"
                            >
                                Hi, I'm{' '}
                                <span className="bg-gradient-to-r from-[rgb(var(--accent))] to-purple-500 bg-clip-text text-transparent">
                                    {about?.name || 'a Developer'}
                                </span>
                            </motion.h1>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="text-lg sm:text-xl lg:text-2xl text-[rgb(var(--accent))] mb-4 font-semibold"
                            >
                                {about?.title || 'Full Stack Developer'}
                            </motion.p>

                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="text-sm sm:text-base lg:text-lg text-[rgb(var(--text-secondary))] mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0"
                            >
                                {about?.bio || 'Passionate about creating beautiful, functional, and user-friendly applications that solve real-world problems.'}
                            </motion.p>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start"
                            >
                                <Button
                                    size="lg"
                                    icon={ArrowRight}
                                    onClick={() => scrollToSection('projects')}
                                    className="w-full sm:w-auto"
                                >
                                    View My Work
                                </Button>

                                <Link to="/contact" className="w-full sm:w-auto">
                                    <Button variant="outline" size="lg" icon={Mail} className="w-full">
                                        Get In Touch
                                    </Button>
                                </Link>

                                {about?.resume?.url && (
                                    <a href={about.resume.url} target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
                                        <Button variant="outline" size="lg" icon={Download} className="w-full">
                                            Download CV
                                        </Button>
                                    </a>
                                )}
                            </motion.div>

                            {/* Social Links */}
                            {socials.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.6 }}
                                    className="flex gap-3 sm:gap-4 justify-center lg:justify-start mt-6 sm:mt-8"
                                >
                                    {socials.map((social) => {
                                        const Icon = getSocialIcon(social.platform);
                                        return (
                                            <motion.a
                                                key={social._id}
                                                href={social.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                whileHover={{ scale: 1.1, y: -2 }}
                                                className="p-3 glass rounded-lg hover:bg-[rgb(var(--accent))]/20 transition-all"
                                            >
                                                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                                            </motion.a>
                                        );
                                    })}
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Profile Image */}
                        {about?.profileImage?.url && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="flex-1 w-full max-w-md lg:max-w-none"
                            >
                                <div className="relative">
                                    <motion.div
                                        animate={{
                                            scale: [1, 1.2, 1],
                                            rotate: [0, 180, 360],
                                        }}
                                        transition={{
                                            duration: 20,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                        className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--accent))] to-purple-500 rounded-full blur-3xl opacity-20"
                                    />
                                    <img
                                        src={about.profileImage.url}
                                        alt={about.name}
                                        className="relative rounded-full w-48 h-48 sm:w-64 sm:h-64 lg:w-96 lg:h-96 object-cover glass mx-auto shadow-2xl"
                                    />
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Scroll Indicator */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1, duration: 0.5 }}
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden lg:block"
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-6 h-10 border-2 border-[rgb(var(--accent))] rounded-full p-1"
                    >
                        <div className="w-1 h-3 bg-[rgb(var(--accent))] rounded-full mx-auto" />
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Stats Section */}
            <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {[
                        {
                            icon: Briefcase,
                            label: 'Years Experience',
                            value: about?.stats?.yearsExperience || 2
                        },
                        {
                            icon: Code,
                            label: 'Projects Completed',
                            value: about?.stats?.projectsCompleted || projects.length || 10
                        },
                        {
                            icon: Award,
                            label: 'Certificates',
                            value: about?.stats?.certificatesEarned || certificates.length || 5
                        },
                        {
                            icon: Star,
                            label: 'Happy Clients',
                            value: about?.stats?.happyClients || 10
                        },
                    ].map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <GlassCard className="text-center hover:scale-105 transition-transform">
                                <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 mx-auto mb-3 text-[rgb(var(--accent))]" />
                                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-1">
                                    {stat.value}+
                                </h3>
                                <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))]">
                                    {stat.label}
                                </p>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Experience Section */}
            {experiences.length > 0 && (
                <section id="experience" className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-center mb-8 sm:mb-12">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-4"
                            >
                                <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-sm sm:text-base">Career Journey</span>
                            </motion.div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                                Work Experience
                            </h2>
                            <p className="text-sm sm:text-base text-[rgb(var(--text-secondary))] max-w-2xl mx-auto px-4">
                                My professional journey and key achievements
                            </p>
                        </div>

                        <div className="max-w-4xl mx-auto space-y-6">
                            {experiences.map((exp, index) => (
                                <motion.div
                                    key={exp._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <GlassCard className="hover:scale-[1.02] transition-transform">
                                        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                                            {/* Company Logo */}
                                            {exp.companyLogo?.url && (
                                                <div className="flex-shrink-0">
                                                    <div className="w-16 h-16 sm:w-20 sm:h-20 glass rounded-lg p-3 flex items-center justify-center">
                                                        <img
                                                            src={exp.companyLogo.url}
                                                            alt={exp.company}
                                                            className="w-full h-full object-contain"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="flex-1">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                                                    <div>
                                                        <h3 className="text-xl sm:text-2xl font-semibold mb-1">
                                                            {exp.position}
                                                        </h3>
                                                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm text-[rgb(var(--text-secondary))]">
                                                            <div className="flex items-center gap-1">
                                                                <Building2 className="w-4 h-4" />
                                                                <span className="font-medium">{exp.company}</span>
                                                            </div>
                                                            {exp.location && (
                                                                <>
                                                                    <span className="hidden sm:inline">•</span>
                                                                    <div className="flex items-center gap-1">
                                                                        <MapPin className="w-4 h-4" />
                                                                        <span>{exp.location}</span>
                                                                    </div>
                                                                </>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-2 text-sm text-[rgb(var(--text-secondary))]">
                                                        <Calendar className="w-4 h-4" />
                                                        <span>
                                                            {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <p className="text-sm sm:text-base text-[rgb(var(--text-secondary))] mb-4">
                                                    {exp.description}
                                                </p>

                                                {/* Responsibilities */}
                                                {exp.responsibilities && exp.responsibilities.length > 0 && (
                                                    <ul className="space-y-2 mb-4">
                                                        {exp.responsibilities.map((responsibility, i) => (
                                                            <li key={i} className="flex items-start gap-2 text-sm">
                                                                <span className="text-[rgb(var(--accent))] mt-1">▸</span>
                                                                <span className="text-[rgb(var(--text-secondary))]">
                                                                    {responsibility}
                                                                </span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                )}

                                                {/* Technologies */}
                                                {exp.technologies && exp.technologies.length > 0 && (
                                                    <div className="flex flex-wrap gap-2">
                                                        {exp.technologies.map((tech, i) => (
                                                            <span
                                                                key={i}
                                                                className="px-3 py-1 text-xs glass rounded-full"
                                                            >
                                                                {tech}
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>

                        {experiences.length >= 3 && (
                            <div className="text-center mt-8">
                                <Link to="/about">
                                    <Button variant="outline" size="lg" icon={ArrowRight}>
                                        View Full Experience
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                </section>
            )}

            {/* Skills Section - ✅ UPDATED WITH ICONS */}
            {skills.length > 0 && (
                <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-center mb-8 sm:mb-12">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-4"
                            >
                                <Code className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-sm sm:text-base">My Skills</span>
                            </motion.div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                                Technologies I Work With
                            </h2>
                            <p className="text-sm sm:text-base text-[rgb(var(--text-secondary))] max-w-2xl mx-auto px-4">
                                Continuously learning and adapting to new technologies
                            </p>
                        </div>

                        <div className="space-y-6 sm:space-y-8">
                            {skills.map((category, categoryIndex) => (
                                <motion.div
                                    key={category._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: categoryIndex * 0.1 }}
                                >
                                    <GlassCard>
                                        <h3 className="text-xl sm:text-2xl font-semibold mb-4 sm:mb-6 capitalize">
                                            {category._id}
                                        </h3>
                                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                                            {category.skills.map((skill, skillIndex) => (
                                                <motion.div
                                                    key={skill._id}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    whileInView={{ opacity: 1, scale: 1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: skillIndex * 0.05 }}
                                                    whileHover={{ scale: 1.05 }}
                                                    className="glass p-4 rounded-lg text-center group hover:bg-[rgb(var(--accent))]/10 transition-all"
                                                >
                                                    {/* ✅ USE ICON COMPONENT */}
                                                    {getSkillIconComponent(skill)}

                                                    <p className="font-medium text-xs sm:text-sm mb-2">{skill.name}</p>
                                                    <div className="w-full bg-[rgb(var(--bg-secondary))] rounded-full h-1.5 sm:h-2">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${skill.proficiency}%` }}
                                                            viewport={{ once: true }}
                                                            transition={{ duration: 1, delay: 0.5 }}
                                                            className="bg-[rgb(var(--accent))] h-full rounded-full"
                                                        />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </section>
            )}

            {/* Featured Projects Section */}
            {projects.length > 0 && (
                <section id="projects" className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="text-center mb-8 sm:mb-12">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full mb-4"
                            >
                                <Rocket className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="text-sm sm:text-base">Portfolio</span>
                            </motion.div>
                            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
                                Featured Projects
                            </h2>
                            <p className="text-sm sm:text-base text-[rgb(var(--text-secondary))] max-w-2xl mx-auto px-4">
                                Check out some of my recent work
                            </p>
                        </div>

                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                            {projects.map((project, index) => (
                                <motion.div
                                    key={project._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ y: -10 }}
                                    className="group"
                                >
                                    <GlassCard className="overflow-hidden h-full flex flex-col">
                                        <div className="relative overflow-hidden">
                                            <img
                                                src={project.image.url}
                                                alt={project.title}
                                                className="w-full h-40 sm:h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="p-4 sm:p-6 flex-1 flex flex-col">
                                            <h3 className="text-lg sm:text-xl font-semibold mb-2">{project.title}</h3>
                                            <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] mb-4 flex-1">
                                                {project.shortDescription}
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {project.technologies?.slice(0, 3).map((tech, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 text-xs glass rounded-full"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            ))}
                        </div>

                        <div className="text-center mt-8 sm:mt-12">
                            <Link to="/work">
                                <Button variant="outline" size="lg" icon={ArrowRight}>
                                    View All Projects
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </section>
            )}

            {/* CTA Section */}
            <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <GlassCard className="relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-r from-[rgb(var(--accent))]/10 to-purple-500/10" />
                        <div className="relative text-center p-8 sm:p-12 lg:p-16">
                            <motion.div
                                initial={{ scale: 0 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-[rgb(var(--accent))] to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center"
                            >
                                <Mail className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                            </motion.div>

                            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
                                Let's Work Together
                            </h2>
                            <p className="text-sm sm:text-base lg:text-lg text-[rgb(var(--text-secondary))] mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
                                Have a project in mind? Let's create something amazing together! I'm always open to discussing new projects and opportunities.
                            </p>
                            <Link to="/contact">
                                <Button size="lg" icon={ArrowRight}>
                                    Start a Conversation
                                </Button>
                            </Link>
                        </div>
                    </GlassCard>
                </motion.div>
            </section>
        </div>
    );
};

export default Home;
