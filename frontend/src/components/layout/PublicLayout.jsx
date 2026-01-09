import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { AnimatedBackground } from '../background';
import { Toaster } from 'react-hot-toast';

const PublicLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleKeyPress = (e) => {
            // Press Ctrl + Shift + A to access admin login
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                navigate('/admin/login');
            }
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [navigate]);

    return (
        <div className="min-h-screen relative">
            {/* Animated Background */}
            <AnimatedBackground type="combined" />

            {/* Navigation */}
            <Navbar />

            {/* Main Content */}
            <main className="pt-16">
                <Outlet />
            </main>

            {/* Footer */}
            <Footer />

            {/* Toast Notifications */}
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: 'rgba(var(--bg-card), 0.9)',
                        color: 'rgb(var(--text-primary))',
                        backdropFilter: 'blur(10px)',
                    },
                }}
            />
        </div>
    );
};

export default PublicLayout;
