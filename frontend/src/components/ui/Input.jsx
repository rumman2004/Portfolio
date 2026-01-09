import { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    icon: Icon,
    className = '',
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                    {label}
                </label>
            )}
            <div className="relative">
                {Icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgb(var(--text-secondary))]">
                        <Icon className="w-5 h-5" />
                    </div>
                )}
                <input
                    ref={ref}
                    className={`
            w-full px-4 py-2.5 
            ${Icon ? 'pl-10' : ''} 
            glass rounded-lg 
            text-[rgb(var(--text-primary))]
            placeholder:text-[rgb(var(--text-secondary))]
            focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]
            transition-all duration-300
            ${error ? 'border-red-500' : ''}
            ${className}
          `}
                    {...props}
                />
            </div>
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;
