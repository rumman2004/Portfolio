import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import { useAuth } from '../../context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Loader from '../ui/Loader';
import { useTheme } from '../../context/ThemeContext';

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { isAuthenticated, loading } = useAuth();
    const { theme } = useTheme();

    if (loading) {
        return <Loader fullScreen size="xl" />;
    }

    if (!isAuthenticated()) {
        return <Navigate to="/admin/login" replace />;
    }

    return (
        <div className={`min-h-screen ${theme === 'dark'
                ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900'
                : 'bg-gradient-to-br from-slate-50 via-white to-slate-100'
            } transition-colors duration-300`}>
            {/* Sidebar */}
            <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            {/* Main Content */}
            <div className="lg:ml-64 min-h-screen flex flex-col">
                {/* Navbar */}
                <AdminNavbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: theme === 'dark'
                            ? 'rgba(30, 41, 59, 0.95)'
                            : 'rgba(255, 255, 255, 0.95)',
                        color: theme === 'dark' ? '#f1f5f9' : '#0f172a',
                        backdropFilter: 'blur(10px)',
                        border: theme === 'dark'
                            ? '1px solid rgba(148, 163, 184, 0.1)'
                            : '1px solid rgba(148, 163, 184, 0.2)',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    },
                    success: {
                        iconTheme: {
                            primary: '#10b981',
                            secondary: theme === 'dark' ? '#1e293b' : '#ffffff',
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: '#ef4444',
                            secondary: theme === 'dark' ? '#1e293b' : '#ffffff',
                        },
                    },
                }}
            />
        </div>
    );
};

export default AdminLayout;
