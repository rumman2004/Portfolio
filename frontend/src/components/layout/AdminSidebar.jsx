import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FolderOpen,
    Award,
    Briefcase,
    Wrench,
    Share2,
    Mail,
    User,
    LogOut,
    X,
    Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const AdminSidebar = ({ isOpen, setIsOpen }) => {
    const location = useLocation();
    const { logout, admin } = useAuth();
    const { theme } = useTheme();

    const menuItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'About', path: '/admin/about', icon: User },
        { name: 'Projects', path: '/admin/projects', icon: FolderOpen },
        { name: 'Skills', path: '/admin/skills', icon: Wrench },
        { name: 'Experience', path: '/admin/experience', icon: Briefcase },
        { name: 'Certificates', path: '/admin/certificates', icon: Award },
        { name: 'Socials', path: '/admin/socials', icon: Share2 },
        { name: 'Messages', path: '/admin/contacts', icon: Mail },
        { name: 'Profile', path: '/admin/profile', icon: Settings },
    ];

    const handleLinkClick = () => {
        if (window.innerWidth < 1024) {
            setIsOpen(false);
        }
    };

    return (
        <>
            {/* Overlay for mobile */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        onClick={() => setIsOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Sidebar - Fixed width of 256px (w-64) */}
            <aside
                className={`
                    fixed top-0 left-0 h-screen w-64
                    ${theme === 'dark'
                        ? 'bg-slate-900/95 border-slate-700/50'
                        : 'bg-white/95 border-slate-200'
                    }
                    backdrop-blur-xl border-r shadow-2xl
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    z-50 lg:z-30
                `}
            >
                <div className="flex flex-col h-full">
                    {/* Header - Fixed height */}
                    <div className={`p-6 border-b ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'
                        } flex-shrink-0`}>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                                Admin Panel
                            </h2>
                            <button
                                onClick={() => setIsOpen(false)}
                                className={`lg:hidden p-2 rounded-lg transition-colors ${theme === 'dark'
                                        ? 'hover:bg-slate-800 text-slate-300'
                                        : 'hover:bg-slate-100 text-slate-600'
                                    }`}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Admin Info */}
                        {admin && (
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0">
                                    {admin.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'
                                        }`}>
                                        {admin.name}
                                    </p>
                                    <p className={`text-xs truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                                        }`}>
                                        {admin.email || 'Administrator'}
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Menu Items - Scrollable */}
                    <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                        <ul className="space-y-1.5">
                            {menuItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <motion.li
                                        key={item.path}
                                        whileHover={{ x: 4 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                                    >
                                        <Link
                                            to={item.path}
                                            onClick={handleLinkClick}
                                            className={`
                                                flex items-center gap-3 px-4 py-3 rounded-lg
                                                transition-all duration-200
                                                ${isActive
                                                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30'
                                                    : theme === 'dark'
                                                        ? 'hover:bg-slate-800 text-slate-300 hover:text-white'
                                                        : 'hover:bg-slate-100 text-slate-700 hover:text-slate-900'
                                                }
                                            `}
                                        >
                                            <item.icon className="w-5 h-5 flex-shrink-0" />
                                            <span className="font-medium">{item.name}</span>
                                        </Link>
                                    </motion.li>
                                );
                            })}
                        </ul>
                    </nav>

                    {/* Logout Button - Fixed at bottom */}
                    <div className={`p-4 border-t flex-shrink-0 ${theme === 'dark' ? 'border-slate-700/50' : 'border-slate-200'
                        }`}>
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={logout}
                            className={`
                                w-full flex items-center gap-3 px-4 py-3 rounded-lg
                                transition-all duration-200
                                ${theme === 'dark'
                                    ? 'hover:bg-red-500/10 text-red-400 hover:text-red-300'
                                    : 'hover:bg-red-50 text-red-600 hover:text-red-700'
                                }
                            `}
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </motion.button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
