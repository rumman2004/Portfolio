import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0f0720] flex flex-col items-center justify-center text-white p-4 overflow-hidden relative">
      {/* Animated Background Orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-600/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] animate-pulse" />

      {/* Main Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10"
      >
        <motion.h1 
          animate={{ 
            y: [0, -20, 0],
            rotate: [-1, 1, -1]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="text-9xl font-bold bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent drop-shadow-2xl"
        >
          404
        </motion.h1>

        <h2 className="text-3xl font-semibold mt-4 mb-2">Lost in Space?</h2>
        <p className="text-gray-400 max-w-md mx-auto mb-8">
          The page you're looking for has drifted out of orbit. Don't worry, even the best developers get lost sometimes.
        </p>

        {/* Interactive Button */}
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to="/"
            className="px-8 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full font-bold text-white shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
          >
            Back to Reality
          </Link>
        </motion.div>
      </motion.div>

      {/* Interactive Floating Element */}
      <motion.div 
        drag
        dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
        className="mt-12 cursor-grab active:cursor-grabbing p-4 bg-white/5 backdrop-blur-md rounded-xl border border-white/10 text-sm text-gray-300 select-none"
      >
        ✨ Drag me! I'm a stray bit of code.
      </motion.div>
    </div>
  );
};

export default NotFound;