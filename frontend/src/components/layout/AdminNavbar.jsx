import { Menu, Bell, Search, Sun, Moon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';
import { useState } from 'react';

const AdminNavbar = ({ toggleSidebar }) => {
    const { admin } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const [searchOpen, setSearchOpen] = useState(false);

    return (
        <nav className={`
            sticky top-0 z-30 
            ${theme === 'dark'
                ? 'bg-slate-900/80 border-slate-700/50'
                : 'bg-white/80 border-slate-200'
            }
            backdrop-blur-xl border-b shadow-lg
        `}>
            <div className="px-3 sm:px-4 lg:px-6 py-3 sm:py-4 flex items-center justify-between gap-4">
                {/* Left side */}
                <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleSidebar}
                        className={`
                            lg:hidden p-2 rounded-lg transition-colors
                            ${theme === 'dark'
                                ? 'hover:bg-slate-800 text-slate-300'
                                : 'hover:bg-slate-100 text-slate-600'
                            }
                        `}
                    >
                        <Menu className="w-5 h-5" />
                    </motion.button>

                    {/* Search - Desktop */}
                    <div className={`
                        hidden md:flex items-center gap-2 px-4 py-2 rounded-lg flex-1 max-w-md
                        ${theme === 'dark'
                            ? 'bg-slate-800/50 border-slate-700/50'
                            : 'bg-slate-50 border-slate-200'
                        }
                        border transition-colors
                    `}>
                        <Search className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                            }`} />
                        <input
                            type="text"
                            placeholder="Search..."
                            className={`
                                bg-transparent border-none outline-none w-full text-sm
                                ${theme === 'dark'
                                    ? 'text-slate-200 placeholder-slate-500'
                                    : 'text-slate-900 placeholder-slate-400'
                                }
                            `}
                        />
                    </div>

                    {/* Search - Mobile */}
                    <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        className={`
                            md:hidden p-2 rounded-lg transition-colors
                            ${theme === 'dark'
                                ? 'hover:bg-slate-800 text-slate-300'
                                : 'hover:bg-slate-100 text-slate-600'
                            }
                        `}
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>

                {/* Right side */}
                <div className="flex items-center gap-2 sm:gap-3">
                    {/* Notifications */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        className={`
                            relative p-2 rounded-lg transition-colors
                            ${theme === 'dark'
                                ? 'hover:bg-slate-800 text-slate-300'
                                : 'hover:bg-slate-100 text-slate-600'
                            }
                        `}
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-slate-900" />
                    </motion.button>

                    {/* Theme Toggle */}
                    <motion.button
                        whileTap={{ scale: 0.95 }}
                        onClick={toggleTheme}
                        className={`
                            p-2 rounded-lg transition-colors
                            ${theme === 'dark'
                                ? 'hover:bg-slate-800 text-yellow-400'
                                : 'hover:bg-slate-100 text-indigo-600'
                            }
                        `}
                    >
                        {theme === 'dark' ? (
                            <Sun className="w-5 h-5" />
                        ) : (
                            <Moon className="w-5 h-5" />
                        )}
                    </motion.button>

                    {/* Admin Avatar */}
                    <div className={`
                        flex items-center gap-2 sm:gap-3 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg
                        ${theme === 'dark'
                            ? 'bg-slate-800/50 border-slate-700/50'
                            : 'bg-slate-50 border-slate-200'
                        }
                        border
                    `}>
                        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm shadow-lg">
                            {admin?.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className={`
                            hidden sm:block text-sm font-medium truncate max-w-[100px]
                            ${theme === 'dark' ? 'text-slate-200' : 'text-slate-900'}
                        `}>
                            {admin?.name}
                        </span>
                    </div>
                </div>
            </div>

            {/* Mobile Search Dropdown */}
            {searchOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`
                        md:hidden px-3 pb-3
                    `}
                >
                    <div className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg
                        ${theme === 'dark'
                            ? 'bg-slate-800/50 border-slate-700/50'
                            : 'bg-slate-50 border-slate-200'
                        }
                        border
                    `}>
                        <Search className={`w-4 h-4 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'
                            }`} />
                        <input
                            type="text"
                            placeholder="Search..."
                            autoFocus
                            className={`
                                bg-transparent border-none outline-none w-full text-sm
                                ${theme === 'dark'
                                    ? 'text-slate-200 placeholder-slate-500'
                                    : 'text-slate-900 placeholder-slate-400'
                                }
                            `}
                        />
                    </div>
                </motion.div>
            )}
        </nav>
    );
};

export default AdminNavbar;
