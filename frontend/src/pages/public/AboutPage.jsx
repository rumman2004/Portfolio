import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { aboutAPI, experienceAPI, certificatesAPI } from '../../services/api';
import { GlassCard } from '../../components/ui';
import { Calendar, MapPin, Award, Mail, Phone, MapPinIcon, Download } from 'lucide-react';
import Loader from '../../components/ui/Loader';

const AboutPage = () => {
    const [about, setAbout] = useState(null);
    const [experiences, setExperiences] = useState([]);
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [aboutRes, expRes, certRes] = await Promise.all([
                aboutAPI.get(),
                experienceAPI.getAll(),
                certificatesAPI.getAll(),
            ]);
            setAbout(aboutRes.data.data);
            setExperiences(expRes.data.data);
            setCertificates(certRes.data.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader fullScreen size="xl" />;

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-6xl mx-auto"
                >
                    {/* Page Title */}
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 sm:mb-12 text-center">
                        About Me
                    </h1>

                    {about && (
                        <>
                            {/* Main About Card */}
                            <GlassCard className="mb-8 sm:mb-12">
                                <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 items-center">
                                    {/* Profile Image */}
                                    {about.profileImage?.url && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.2 }}
                                            className="order-1 lg:order-none"
                                        >
                                            <img
                                                src={about.profileImage.url}
                                                alt={about.name}
                                                className="rounded-2xl w-full h-64 sm:h-80 lg:h-96 object-cover shadow-lg"
                                            />
                                        </motion.div>
                                    )}

                                    {/* About Content */}
                                    <div className="order-2 lg:order-none">
                                        <motion.h2
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2"
                                        >
                                            {about.name}
                                        </motion.h2>

                                        <motion.p
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="text-lg sm:text-xl text-[rgb(var(--accent))] mb-4 sm:mb-6"
                                        >
                                            {about.title}
                                        </motion.p>

                                        <motion.p
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="text-sm sm:text-base text-[rgb(var(--text-secondary))] whitespace-pre-line leading-relaxed"
                                        >
                                            {about.bio}
                                        </motion.p>

                                        {/* Resume Download Button */}
                                        {about.resume?.url && (
                                            <motion.a
                                                href={about.resume.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                download
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.6 }}
                                                className="inline-flex items-center gap-2 mt-6 px-6 py-3 bg-[rgb(var(--accent))] text-white rounded-lg hover:bg-[rgb(var(--accent))]/80 transition-all text-sm sm:text-base"
                                            >
                                                <Download className="w-4 h-4 sm:w-5 sm:h-5" />
                                                Download Resume
                                            </motion.a>
                                        )}
                                    </div>
                                </div>
                            </GlassCard>

                            {/* Contact Info Cards */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16"
                            >
                                {about.email && (
                                    <GlassCard className="hover:scale-105 transition-transform">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-lg bg-[rgb(var(--accent))]/10">
                                                <Mail className="w-5 h-5 text-[rgb(var(--accent))]" />
                                            </div>
                                            <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))]">Email</p>
                                        </div>
                                        <p className="font-medium text-sm sm:text-base break-all">{about.email}</p>
                                    </GlassCard>
                                )}

                                {about.phone && (
                                    <GlassCard className="hover:scale-105 transition-transform">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-lg bg-[rgb(var(--accent))]/10">
                                                <Phone className="w-5 h-5 text-[rgb(var(--accent))]" />
                                            </div>
                                            <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))]">Phone</p>
                                        </div>
                                        <p className="font-medium text-sm sm:text-base">{about.phone}</p>
                                    </GlassCard>
                                )}

                                {about.location && (
                                    <GlassCard className="hover:scale-105 transition-transform">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 rounded-lg bg-[rgb(var(--accent))]/10">
                                                <MapPinIcon className="w-5 h-5 text-[rgb(var(--accent))]" />
                                            </div>
                                            <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))]">Location</p>
                                        </div>
                                        <p className="font-medium text-sm sm:text-base">{about.location}</p>
                                    </GlassCard>
                                )}
                            </motion.div>
                        </>
                    )}

                    {/* Experience Section */}
                    {experiences.length > 0 && (
                        <>
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8"
                            >
                                Experience
                            </motion.h2>

                            <div className="space-y-4 sm:space-y-6 mb-12 sm:mb-16">
                                {experiences.map((exp, index) => (
                                    <motion.div
                                        key={exp._id}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <GlassCard className="hover:scale-[1.02] transition-transform">
                                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-lg sm:text-xl font-semibold mb-1 break-words">
                                                        {exp.title}
                                                    </h3>
                                                    <p className="text-sm sm:text-base text-[rgb(var(--accent))] font-medium">
                                                        {exp.company}
                                                    </p>
                                                </div>

                                                <div className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <Calendar className="w-4 h-4 flex-shrink-0" />
                                                        <span className="break-words">
                                                            {new Date(exp.startDate).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                year: 'numeric'
                                                            })} -
                                                            {exp.current
                                                                ? ' Present'
                                                                : ` ${new Date(exp.endDate).toLocaleDateString('en-US', {
                                                                    month: 'short',
                                                                    year: 'numeric'
                                                                })}`
                                                            }
                                                        </span>
                                                    </div>

                                                    {exp.location && (
                                                        <div className="flex items-center gap-2">
                                                            <MapPin className="w-4 h-4 flex-shrink-0" />
                                                            <span className="break-words">{exp.location}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-sm sm:text-base text-[rgb(var(--text-secondary))] break-words">
                                                {exp.description}
                                            </p>

                                            {exp.responsibilities && exp.responsibilities.length > 0 && (
                                                <ul className="mt-4 space-y-2">
                                                    {exp.responsibilities.map((resp, i) => (
                                                        <li
                                                            key={i}
                                                            className="flex gap-2 text-xs sm:text-sm text-[rgb(var(--text-secondary))]"
                                                        >
                                                            <span className="text-[rgb(var(--accent))] flex-shrink-0">•</span>
                                                            <span className="break-words">{resp}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </GlassCard>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Certificates Section */}
                    {certificates.length > 0 && (
                        <>
                            <motion.h2
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-6 sm:mb-8"
                            >
                                Certificates & Achievements
                            </motion.h2>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                                {certificates.map((cert, index) => (
                                    <motion.div
                                        key={cert._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <GlassCard className="h-full hover:scale-105 transition-transform">
                                            <img
                                                src={cert.image.url}
                                                alt={cert.title}
                                                className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4"
                                            />

                                            <div className="flex items-start gap-2 mb-3">
                                                <Award className="w-5 h-5 text-[rgb(var(--accent))] mt-0.5 flex-shrink-0" />
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-semibold text-sm sm:text-base break-words">
                                                        {cert.title}
                                                    </h3>
                                                    <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] break-words">
                                                        {cert.issuer}
                                                    </p>
                                                </div>
                                            </div>

                                            <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))]">
                                                Issued: {new Date(cert.issueDate).toLocaleDateString('en-US', {
                                                    month: 'long',
                                                    year: 'numeric'
                                                })}
                                            </p>

                                            {cert.credentialUrl && (
                                                <a
                                                    href={cert.credentialUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-block mt-3 text-xs sm:text-sm text-[rgb(var(--accent))] hover:underline"
                                                >
                                                    View Credential →
                                                </a>
                                            )}
                                        </GlassCard>
                                    </motion.div>
                                ))}
                            </div>
                        </>
                    )}
                </motion.div>
            </section>
        </div>
    );
};

export default AboutPage;
