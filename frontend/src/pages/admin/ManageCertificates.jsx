import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Award, ExternalLink } from 'lucide-react';
import { Button, Modal, Input, Textarea, GlassCard } from '../../components/ui';
import { certificatesAPI } from '../../services/api';
import toast from 'react-hot-toast';
import Loader from '../../components/ui/Loader';

const ManageCertificates = () => {
    const [certificates, setCertificates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCert, setEditingCert] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        credentialUrl: '',
        description: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchCertificates();
    }, []);

    const fetchCertificates = async () => {
        try {
            const response = await certificatesAPI.getAll();
            setCertificates(response.data.data);
        } catch (error) {
            toast.error('Failed to fetch certificates');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (cert = null) => {
        if (cert) {
            setEditingCert(cert);
            setFormData({
                title: cert.title,
                issuer: cert.issuer,
                issueDate: new Date(cert.issueDate).toISOString().split('T')[0],
                expiryDate: cert.expiryDate ? new Date(cert.expiryDate).toISOString().split('T')[0] : '',
                credentialId: cert.credentialId || '',
                credentialUrl: cert.credentialUrl || '',
                description: cert.description || '',
            });
        } else {
            setEditingCert(null);
            setFormData({
                title: '',
                issuer: '',
                issueDate: '',
                expiryDate: '',
                credentialId: '',
                credentialUrl: '',
                description: '',
            });
        }
        setImageFile(null);
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
                if (formData[key]) {
                    data.append(key, formData[key]);
                }
            });

            if (imageFile) {
                data.append('image', imageFile);
            }

            if (editingCert) {
                await certificatesAPI.update(editingCert._id, data);
                toast.success('Certificate updated successfully');
            } else {
                await certificatesAPI.create(data);
                toast.success('Certificate created successfully');
            }

            setModalOpen(false);
            fetchCertificates();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this certificate?')) return;

        try {
            await certificatesAPI.delete(id);
            toast.success('Certificate deleted successfully');
            fetchCertificates();
        } catch (error) {
            toast.error('Failed to delete certificate');
        }
    };

    if (loading) return <Loader fullScreen size="xl" />;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold mb-2">Manage Certificates</h1>
                    <p className="text-[rgb(var(--text-secondary))] text-sm sm:text-base">
                        Add, edit, or remove your certifications
                    </p>
                </div>
                <Button icon={Plus} onClick={() => handleOpenModal()} className="w-full sm:w-auto">
                    Add Certificate
                </Button>
            </div>

            {/* Certificates Grid */}
            {certificates.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {certificates.map((cert, index) => (
                        <motion.div
                            key={cert._id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <GlassCard className="h-full flex flex-col hover:scale-105 transition-transform">
                                <img
                                    src={cert.image.url}
                                    alt={cert.title}
                                    className="w-full h-40 sm:h-48 object-cover rounded-lg mb-4"
                                />

                                <div className="flex-1">
                                    <div className="flex items-start gap-2 mb-3">
                                        <Award className="w-5 h-5 text-[rgb(var(--accent))] mt-1 flex-shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-base sm:text-lg font-semibold mb-1 break-words">
                                                {cert.title}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] break-words">
                                                {cert.issuer}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-xs sm:text-sm text-[rgb(var(--text-secondary))] mb-3">
                                        Issued: {new Date(cert.issueDate).toLocaleDateString()}
                                    </p>

                                    {cert.credentialUrl && (
                                        <a
                                            href={cert.credentialUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-xs sm:text-sm text-[rgb(var(--accent))] hover:underline mb-3 break-all"
                                        >
                                            <ExternalLink className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                                            View Credential
                                        </a>
                                    )}
                                </div>

                                <div className="flex gap-2 pt-4 border-t border-[rgb(var(--border))]">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        icon={Edit}
                                        onClick={() => handleOpenModal(cert)}
                                        className="flex-1 text-xs sm:text-sm"
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => handleDelete(cert._id)}
                                        className="text-xs sm:text-sm"
                                    >
                                        <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </Button>
                                </div>
                            </GlassCard>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 sm:py-20">
                    <p className="text-[rgb(var(--text-secondary))] text-base sm:text-lg mb-4">
                        No certificates yet. Add your first certificate!
                    </p>
                    <Button icon={Plus} onClick={() => handleOpenModal()}>
                        Add Certificate
                    </Button>
                </div>
            )}

            {/* Add/Edit Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title={editingCert ? 'Edit Certificate' : 'Add Certificate'}
                size="lg"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        label="Certificate Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="AWS Certified Developer"
                        required
                    />

                    <Input
                        label="Issuing Organization"
                        name="issuer"
                        value={formData.issuer}
                        onChange={handleChange}
                        placeholder="Amazon Web Services"
                        required
                    />

                    <div className="grid sm:grid-cols-2 gap-4">
                        <Input
                            label="Issue Date"
                            type="date"
                            name="issueDate"
                            value={formData.issueDate}
                            onChange={handleChange}
                            required
                        />

                        <Input
                            label="Expiry Date (Optional)"
                            type="date"
                            name="expiryDate"
                            value={formData.expiryDate}
                            onChange={handleChange}
                        />
                    </div>

                    <Input
                        label="Credential ID"
                        name="credentialId"
                        value={formData.credentialId}
                        onChange={handleChange}
                        placeholder="ABC123XYZ"
                    />

                    <Input
                        label="Credential URL"
                        name="credentialUrl"
                        value={formData.credentialUrl}
                        onChange={handleChange}
                        placeholder="https://..."
                        icon={ExternalLink}
                    />

                    <Textarea
                        label="Description (Optional)"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Brief description..."
                    />

                    <div>
                        <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                            Certificate Image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                            className="w-full px-4 py-2.5 glass rounded-lg text-[rgb(var(--text-primary))] text-sm"
                            required={!editingCert}
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-4">
                        <Button type="submit" className="flex-1" loading={submitting}>
                            {editingCert ? 'Update' : 'Create'}
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

export default ManageCertificates;
