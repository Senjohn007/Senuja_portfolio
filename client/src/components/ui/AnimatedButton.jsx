import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const AnimatedButton = ({ children, className = '', icon = true, ...props }) => {
  return (
    <motion.button
      className={`btn-primary ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      {...props}
    >
      {children}
      {icon && <ArrowRight size={16} />}
    </motion.button>
  );
};

export default AnimatedButton;