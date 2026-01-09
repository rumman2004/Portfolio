import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const savedAdmin = localStorage.getItem('admin');
        const token = localStorage.getItem('token');

        if (savedAdmin && token) {
            setAdmin(JSON.parse(savedAdmin));
        }
        setLoading(false);
    }, []);

    const login = (adminData) => {
        setAdmin(adminData);
        localStorage.setItem('admin', JSON.stringify(adminData));
        localStorage.setItem('token', adminData.token);
        toast.success('Login successful!');
        navigate('/admin/dashboard');
    };

    const logout = () => {
        setAdmin(null);
        localStorage.removeItem('admin');
        localStorage.removeItem('token');
        toast.success('Logged out successfully');
        navigate('/admin/login');
    };

    const isAuthenticated = () => {
        return !!admin && !!localStorage.getItem('token');
    };

    return (
        <AuthContext.Provider value={{ admin, login, logout, isAuthenticated, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
