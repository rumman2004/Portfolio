const Card = ({ children, className = '', title, description }) => {
    return (
        <div className={`bg-[rgb(var(--bg-card))] rounded-lg shadow-md p-6 ${className}`}>
            {title && (
                <div className="mb-4">
                    <h3 className="text-xl font-semibold text-[rgb(var(--text-primary))]">
                        {title}
                    </h3>
                    {description && (
                        <p className="text-sm text-[rgb(var(--text-secondary))] mt-1">
                            {description}
                        </p>
                    )}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;
