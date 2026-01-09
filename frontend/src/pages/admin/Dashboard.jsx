import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
    FolderOpen,
    Award,
    Briefcase,
    Wrench,
    Mail,
    TrendingUp,
    Eye,
    MessageSquare,
    CheckCircle,
    Clock
} from 'lucide-react';
import { Card, GlassCard } from '../../components/ui';
import {
    projectsAPI,
    skillsAPI,
    experienceAPI,
    certificatesAPI,
    contactsAPI
} from '../../services/api';
import Loader from '../../components/ui/Loader';

const Dashboard = () => {
    const [stats, setStats] = useState({
        projects: 0,
        skills: 0,
        experiences: 0,
        certificates: 0,
        contacts: { total: 0, unread: 0, replied: 0 }
    });
    const [loading, setLoading] = useState(true);
    const [recentContacts, setRecentContacts] = useState([]);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [
                projectsRes,
                skillsRes,
                experienceRes,
                certificatesRes,
                contactStatsRes,
                contactsRes
            ] = await Promise.all([
                projectsAPI.getAll(),
                skillsAPI.getAll(),
                experienceAPI.getAll(),
                certificatesAPI.getAll(),
                contactsAPI.getStats(),
                contactsAPI.getAll()
            ]);

            setStats({
                projects: projectsRes.data.count,
                skills: skillsRes.data.count,
                experiences: experienceRes.data.count,
                certificates: certificatesRes.data.count,
                contacts: contactStatsRes.data.data
            });

            setRecentContacts(contactsRes.data.data.slice(0, 5));
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const statCards = [
        {
            title: 'Total Projects',
            value: stats.projects,
            icon: FolderOpen,
            color: 'from-blue-500 to-cyan-500',
            bgColor: 'bg-blue-500/10',
            iconColor: 'text-blue-500'
        },
        {
            title: 'Skills',
            value: stats.skills,
            icon: Wrench,
            color: 'from-purple-500 to-pink-500',
            bgColor: 'bg-purple-500/10',
            iconColor: 'text-purple-500'
        },
        {
            title: 'Experience',
            value: stats.experiences,
            icon: Briefcase,
            color: 'from-green-500 to-emerald-500',
            bgColor: 'bg-green-500/10',
            iconColor: 'text-green-500'
        },
        {
            title: 'Certificates',
            value: stats.certificates,
            icon: Award,
            color: 'from-yellow-500 to-orange-500',
            bgColor: 'bg-yellow-500/10',
            iconColor: 'text-yellow-500'
        },
        {
            title: 'Total Messages',
            value: stats.contacts.total,
            icon: Mail,
            color: 'from-red-500 to-rose-500',
            bgColor: 'bg-red-500/10',
            iconColor: 'text-red-500'
        },
        {
            title: 'Unread Messages',
            value: stats.contacts.unread,
            icon: MessageSquare,
            color: 'from-indigo-500 to-purple-500',
            bgColor: 'bg-indigo-500/10',
            iconColor: 'text-indigo-500'
        }
    ];

    if (loading) return <Loader fullScreen size="xl" />;

    return (
        <div className="min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                >
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                        Dashboard
                    </h1>
                    <p className="text-sm sm:text-base text-[rgb(var(--text-secondary))]">
                        Welcome back! Here's what's happening with your portfolio.
                    </p>
                </motion.div>

                {/* Stats Grid - Responsive */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {statCards.map((stat, index) => (
                        <motion.div
                            key={stat.title}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <GlassCard className="relative overflow-hidden hover:scale-[1.02] transition-transform duration-300">
                                <div className="flex items-center justify-between p-4 sm:p-5">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[rgb(var(--text-secondary))] text-xs sm:text-sm mb-1 truncate">
                                            {stat.title}
                                        </p>
                                        <h3 className="text-2xl sm:text-3xl font-bold">
                                            {stat.value}
                                        </h3>
                                    </div>
                                    <div className={`p-3 sm:p-4 rounded-xl ${stat.bgColor} flex-shrink-0`}>
                                        <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.iconColor}`} />
                                    </div>
                                </div>
                                <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${stat.color}`} />
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Activity - Responsive Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Recent Contacts */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        <Card
                            title="Recent Messages"
                            description="Latest contact form submissions"
                            className="h-full"
                        >
                            <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
                                {recentContacts.length > 0 ? (
                                    recentContacts.map((contact) => (
                                        <motion.div
                                            key={contact._id}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="glass p-3 sm:p-4 rounded-lg flex items-start gap-3 hover:bg-[rgb(var(--bg-secondary))] transition-colors"
                                        >
                                            <div className={`p-2 rounded-lg flex-shrink-0 ${contact.isRead
                                                    ? 'bg-gray-500/10'
                                                    : 'bg-[rgb(var(--accent))]/10'
                                                }`}>
                                                <Mail className={`w-4 h-4 ${contact.isRead
                                                        ? 'text-gray-500'
                                                        : 'text-[rgb(var(--accent))]'
                                                    }`} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <p className="font-medium truncate text-sm sm:text-base">
                                                        {contact.name}
                                                    </p>
                                                    {!contact.isRead && (
                                                        <span className="text-xs text-[rgb(var(--accent))] font-semibold flex-shrink-0">
                                                            New
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] line-clamp-2">
                                                    {contact.message}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <Clock className="w-3 h-3 text-[rgb(var(--text-secondary))]" />
                                                    <p className="text-xs text-[rgb(var(--text-secondary))]">
                                                        {new Date(contact.createdAt).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </p>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                ) : (
                                    <div className="text-center py-12">
                                        <Mail className="w-12 h-12 text-[rgb(var(--text-secondary))] mx-auto mb-3 opacity-50" />
                                        <p className="text-[rgb(var(--text-secondary))]">
                                            No messages yet
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </motion.div>

                    {/* Portfolio Overview */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <Card
                            title="Portfolio Overview"
                            description="Key metrics at a glance"
                            className="h-full"
                        >
                            <div className="space-y-4">
                                {/* Response Rate */}
                                <div className="glass p-4 rounded-lg">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-sm sm:text-base text-[rgb(var(--text-secondary))]">
                                            Response Rate
                                        </span>
                                        <span className="font-semibold text-lg">
                                            {stats.contacts.total > 0
                                                ? Math.round((stats.contacts.replied / stats.contacts.total) * 100)
                                                : 0}%
                                        </span>
                                    </div>
                                    <div className="w-full bg-[rgb(var(--bg-secondary))] rounded-full h-2.5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{
                                                width: `${stats.contacts.total > 0
                                                    ? (stats.contacts.replied / stats.contacts.total) * 100
                                                    : 0}%`
                                            }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-2.5 rounded-full"
                                        />
                                    </div>
                                </div>

                                {/* Featured Projects */}
                                <div className="glass p-4 rounded-lg flex items-center justify-between hover:bg-[rgb(var(--bg-secondary))] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-500/10 rounded-lg">
                                            <Eye className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" />
                                        </div>
                                        <span className="text-sm sm:text-base text-[rgb(var(--text-secondary))]">
                                            Featured Projects
                                        </span>
                                    </div>
                                    <span className="font-semibold text-lg">
                                        {stats.projects > 0 ? Math.min(3, stats.projects) : 0}
                                    </span>
                                </div>

                                {/* Active Sections */}
                                <div className="glass p-4 rounded-lg flex items-center justify-between hover:bg-[rgb(var(--bg-secondary))] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500/10 rounded-lg">
                                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                                        </div>
                                        <span className="text-sm sm:text-base text-[rgb(var(--text-secondary))]">
                                            Active Sections
                                        </span>
                                    </div>
                                    <span className="font-semibold text-lg">8</span>
                                </div>

                                {/* Completion Status */}
                                <div className="glass p-4 rounded-lg flex items-center justify-between hover:bg-[rgb(var(--bg-secondary))] transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-500/10 rounded-lg">
                                            <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" />
                                        </div>
                                        <span className="text-sm sm:text-base text-[rgb(var(--text-secondary))]">
                                            Portfolio Status
                                        </span>
                                    </div>
                                    <span className="font-semibold text-green-500">Active</span>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
