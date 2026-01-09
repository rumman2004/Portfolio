import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Trash2, CheckCircle, Reply, Eye, Filter, Search } from 'lucide-react';
import { Button, Modal, GlassCard, Badge, Input } from '../../components/ui';
import { contactsAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';

const ViewContacts = () => {
    const [contacts, setContacts] = useState([]);
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedContact, setSelectedContact] = useState(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [filter, setFilter] = useState('all'); // all, unread, read, replied
    const [searchQuery, setSearchQuery] = useState('');
    const [stats, setStats] = useState({
        total: 0,
        unread: 0,
        read: 0,
        replied: 0
    });

    useEffect(() => {
        fetchContacts();
        fetchStats();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [contacts, filter, searchQuery]);

    const fetchContacts = async () => {
        try {
            const response = await contactsAPI.getAll();
            setContacts(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch messages');
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await contactsAPI.getStats();
            setStats(response.data.data);
        } catch (error) {
            console.error('Failed to fetch stats');
        }
    };

    const applyFilters = () => {
        let filtered = [...contacts];

        // Apply status filter
        if (filter === 'unread') {
            filtered = filtered.filter(c => !c.isRead);
        } else if (filter === 'read') {
            filtered = filtered.filter(c => c.isRead && !c.replied);
        } else if (filter === 'replied') {
            filtered = filtered.filter(c => c.replied);
        }

        // Apply search filter
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(c =>
                c.name.toLowerCase().includes(query) ||
                c.email.toLowerCase().includes(query) ||
                c.message.toLowerCase().includes(query) ||
                (c.subject && c.subject.toLowerCase().includes(query))
            );
        }

        setFilteredContacts(filtered);
    };

    const handleViewContact = async (contact) => {
        setSelectedContact(contact);
        setModalOpen(true);

        // Mark as read if not already
        if (!contact.isRead) {
            try {
                await contactsAPI.markAsRead(contact._id);
                fetchContacts();
                fetchStats();
            } catch (error) {
                console.error('Failed to mark as read');
            }
        }
    };

    const handleMarkAsReplied = async (id) => {
        try {
            await contactsAPI.markAsReplied(id);
            toast.success('Marked as replied');
            fetchContacts();
            fetchStats();
            setModalOpen(false);
        } catch (error) {
            toast.error('Failed to mark as replied');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;

        try {
            await contactsAPI.delete(id);
            toast.success('Message deleted successfully');
            fetchContacts();
            fetchStats();
            setModalOpen(false);
        } catch (error) {
            toast.error('Failed to delete message');
        }
    };

    const getStatusBadge = (contact) => {
        if (contact.replied) return <Badge variant="success">Replied</Badge>;
        if (contact.isRead) return <Badge variant="info">Read</Badge>;
        return <Badge variant="warning">New</Badge>;
    };

    if (loading) return <Loader fullScreen size="xl" />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">Messages</h1>
                <p className="text-[rgb(var(--text-secondary))] text-sm sm:text-base">
                    View and manage contact form submissions
                </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <GlassCard className="text-center">
                    <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] mb-1">Total</p>
                    <p className="text-2xl sm:text-3xl font-bold">{stats.total}</p>
                </GlassCard>
                <GlassCard className="text-center">
                    <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] mb-1">Unread</p>
                    <p className="text-2xl sm:text-3xl font-bold text-yellow-500">{stats.unread}</p>
                </GlassCard>
                <GlassCard className="text-center">
                    <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] mb-1">Read</p>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-500">{stats.read}</p>
                </GlassCard>
                <GlassCard className="text-center">
                    <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] mb-1">Replied</p>
                    <p className="text-2xl sm:text-3xl font-bold text-green-500">{stats.replied}</p>
                </GlassCard>
            </div>

            {/* Filters and Search */}
            <GlassCard>
                <div className="flex flex-col lg:flex-row gap-4">
                    {/* Filter Buttons */}
                    <div className="flex flex-wrap items-center gap-2">
                        <Filter className="w-4 h-4 sm:w-5 sm:h-5 text-[rgb(var(--text-secondary))]" />
                        {['all', 'unread', 'read', 'replied'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg transition-all text-xs sm:text-sm ${filter === f
                                        ? 'bg-[rgb(var(--accent))] text-white'
                                        : 'glass hover:bg-[rgb(var(--accent))]/20'
                                    }`}
                            >
                                {f.charAt(0).toUpperCase() + f.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Search */}
                    <div className="flex-1">
                        <Input
                            placeholder="Search messages..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            icon={Search}
                        />
                    </div>
                </div>
            </GlassCard>

            {/* Messages List */}
            {filteredContacts.length > 0 ? (
                <div className="space-y-3 sm:space-y-4">
                    {filteredContacts.map((contact, index) => (
                        <motion.div
                            key={contact._id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                        >
                            <GlassCard
                                className="hover:scale-[1.01] transition-transform cursor-pointer"
                                onClick={() => handleViewContact(contact)}
                            >
                                <div className="flex flex-col sm:flex-row gap-4">
                                    {/* Icon */}
                                    <div className={`p-3 rounded-lg w-fit ${contact.isRead ? 'bg-gray-500/10' : 'bg-[rgb(var(--accent))]/10'
                                        }`}>
                                        <Mail className={`w-5 h-5 sm:w-6 sm:h-6 ${contact.isRead ? 'text-gray-500' : 'text-[rgb(var(--accent))]'
                                            }`} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                                            <div className="flex-1 min-w-0">
                                                <h3 className={`text-base sm:text-lg font-semibold break-words ${!contact.isRead ? 'text-[rgb(var(--accent))]' : ''
                                                    }`}>
                                                    {contact.name}
                                                </h3>
                                                <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] break-all">
                                                    {contact.email}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {getStatusBadge(contact)}
                                            </div>
                                        </div>

                                        {contact.subject && (
                                            <p className="text-sm font-medium text-[rgb(var(--text-primary))] mb-1 break-words">
                                                Subject: {contact.subject}
                                            </p>
                                        )}

                                        <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] line-clamp-2 break-words mb-2">
                                            {contact.message}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-3 text-xs text-[rgb(var(--text-secondary))]">
                                            <span>{new Date(contact.createdAt).toLocaleDateString()}</span>
                                            <span>{new Date(contact.createdAt).toLocaleTimeString()}</span>
                                            {contact.phone && (
                                                <span className="break-all">📞 {contact.phone}</span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions (Desktop) */}
                                    <div className="hidden sm:flex flex-col gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            icon={Eye}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewContact(contact);
                                            }}
                                        >
                                            View
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            icon={Trash2}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(contact._id);
                                            }}
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
                    <Mail className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 text-[rgb(var(--text-secondary))]" />
                    <p className="text-[rgb(var(--text-secondary))] text-base sm:text-lg">
                        {searchQuery || filter !== 'all'
                            ? 'No messages found matching your criteria'
                            : 'No messages yet'}
                    </p>
                </div>
            )}

            {/* View Message Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Message Details"
                size="lg"
            >
                {selectedContact && (
                    <div className="space-y-4 sm:space-y-6">
                        {/* Header */}
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-4 border-b border-[rgb(var(--border))]">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-xl sm:text-2xl font-bold mb-2 break-words">
                                    {selectedContact.name}
                                </h3>
                                <p className="text-sm sm:text-base text-[rgb(var(--text-secondary))] break-all mb-1">
                                    {selectedContact.email}
                                </p>
                                {selectedContact.phone && (
                                    <p className="text-sm text-[rgb(var(--text-secondary))] break-all">
                                        📞 {selectedContact.phone}
                                    </p>
                                )}
                            </div>
                            {getStatusBadge(selectedContact)}
                        </div>

                        {/* Subject */}
                        {selectedContact.subject && (
                            <div>
                                <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] mb-1">Subject</p>
                                <p className="text-base sm:text-lg font-semibold break-words">
                                    {selectedContact.subject}
                                </p>
                            </div>
                        )}

                        {/* Message */}
                        <div>
                            <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] mb-2">Message</p>
                            <div className="glass p-4 rounded-lg">
                                <p className="text-sm sm:text-base whitespace-pre-wrap break-words">
                                    {selectedContact.message}
                                </p>
                            </div>
                        </div>

                        {/* Timestamp */}
                        <div className="text-xs sm:text-sm text-[rgb(var(--text-secondary))]">
                            Received: {new Date(selectedContact.createdAt).toLocaleString()}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-[rgb(var(--border))]">
                            <a
                                href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Your message'}`}
                                className="flex-1"
                            >
                                <Button variant="primary" className="w-full" icon={Reply}>
                                    Reply via Email
                                </Button>
                            </a>

                            {!selectedContact.replied && (
                                <Button
                                    variant="outline"
                                    icon={CheckCircle}
                                    onClick={() => handleMarkAsReplied(selectedContact._id)}
                                    className="w-full sm:w-auto"
                                >
                                    Mark as Replied
                                </Button>
                            )}

                            <Button
                                variant="danger"
                                icon={Trash2}
                                onClick={() => handleDelete(selectedContact._id)}
                                className="w-full sm:w-auto"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default ViewContacts;
