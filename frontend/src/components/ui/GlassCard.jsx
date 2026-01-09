import { motion } from 'framer-motion';

const GlassCard = ({ children, className = '', hover = true, ...props }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={hover ? { y: -5, scale: 1.02 } : {}}
            transition={{ duration: 0.3 }}
            className={`glass rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 ${className}`}
            {...props}
        >
            {children}
        </motion.div>
    );
};

export default GlassCard;
