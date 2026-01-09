import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { motion } from 'framer-motion';

const DarkModeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="relative p-2 rounded-lg glass hover:bg-[rgb(var(--accent))]/20 transition-all duration-300"
            aria-label="Toggle theme"
        >
            <motion.div
                initial={false}
                animate={{ rotate: theme === 'dark' ? 0 : 180 }}
                transition={{ duration: 0.3 }}
            >
                {theme === 'dark' ? (
                    <Moon className="w-5 h-5 text-[rgb(var(--accent))]" />
                ) : (
                    <Sun className="w-5 h-5 text-[rgb(var(--accent))]" />
                )}
            </motion.div>
        </motion.button>
    );
};

export default DarkModeToggle;
