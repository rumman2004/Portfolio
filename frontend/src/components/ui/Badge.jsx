const Badge = ({ children, variant = 'default', className = '' }) => {
    const variants = {
        default: 'bg-[rgb(var(--accent))]/20 text-[rgb(var(--accent))]',
        success: 'bg-green-500/20 text-green-500',
        warning: 'bg-yellow-500/20 text-yellow-500',
        danger: 'bg-red-500/20 text-red-500',
        info: 'bg-blue-500/20 text-blue-500',
    };

    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
