import { Loader2 } from 'lucide-react';

const Loader = ({ size = 'md', fullScreen = false }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12',
        xl: 'w-16 h-16',
    };

    const loader = (
        <div className="flex items-center justify-center">
            <Loader2 className={`${sizes[size]} animate-spin text-[rgb(var(--accent))]`} />
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-[rgb(var(--bg-primary))]/80 backdrop-blur-sm flex items-center justify-center z-50">
                {loader}
            </div>
        );
    }

    return loader;
};

export default Loader;
