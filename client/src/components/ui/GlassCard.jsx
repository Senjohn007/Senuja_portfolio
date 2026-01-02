import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const GlassCard = ({ children, className = '', hover = true, ...props }) => {
  return (
    <motion.div
      className={clsx(
        'relative overflow-hidden rounded-xl',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -5 } : {}}
      {...props}
    >
      {/* Glassmorphism background */}
      <div className="absolute inset-0 glass-border-highlight"></div>
      
      {/* Content */}
      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
};

export default GlassCard;