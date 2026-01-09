import { forwardRef } from 'react';

const Textarea = forwardRef(({
    label,
    error,
    className = '',
    rows = 4,
    ...props
}, ref) => {
    return (
        <div className="w-full">
            {label && (
                <label className="block text-sm font-medium text-[rgb(var(--text-secondary))] mb-2">
                    {label}
                </label>
            )}
            <textarea
                ref={ref}
                rows={rows}
                className={`
          w-full px-4 py-2.5 
          glass rounded-lg 
          text-[rgb(var(--text-primary))]
          placeholder:text-[rgb(var(--text-secondary))]
          focus:outline-none focus:ring-2 focus:ring-[rgb(var(--accent))]
          transition-all duration-300
          resize-none
          ${error ? 'border-red-500' : ''}
          ${className}
        `}
                {...props}
            />
            {error && (
                <p className="mt-1 text-sm text-red-500">{error}</p>
            )}
        </div>
    );
});

Textarea.displayName = 'Textarea';

export default Textarea;
