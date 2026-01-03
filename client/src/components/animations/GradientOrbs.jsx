// components/animations/GradientOrbs.jsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const GradientOrbs = () => {
  const [orbs, setOrbs] = useState([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    const generateOrbs = () => {
      const newOrbs = [
        {
          id: 1,
          size: 'w-96 h-96',
          colors: 'from-blue-400/20 to-purple-600/20',
          path: {
            x: ["-20%", "120%", "-20%"],
            y: ["-20%", "120%", "-20%"],
          },
          duration: 35,
          initialPosition: { top: "10%", left: "-10%" },
        },
        {
          id: 2,
          size: 'w-80 h-80',
          colors: 'from-pink-400/20 to-yellow-600/20',
          path: {
            x: ["120%", "-20%", "120%"],
            y: ["120%", "-20%", "120%"],
          },
          duration: 40,
          initialPosition: { bottom: "10%", right: "-10%" },
        },
        {
          id: 3,
          size: 'w-64 h-64',
          colors: 'from-green-400/20 to-teal-600/20',
          path: {
            x: ["50%", "50%", "50%"],
            y: ["-30%", "130%", "-30%"],
          },
          duration: 30,
          initialPosition: { top: "30%", left: "50%", transform: "translateX(-50%)" },
        },
        {
          id: 4,
          size: 'w-72 h-72',
          colors: 'from-indigo-400/15 to-cyan-600/15',
          path: {
            x: ["-30%", "130%", "-30%"],
            y: ["50%", "50%", "50%"],
          },
          duration: 45,
          initialPosition: { top: "50%", right: "-15%", transform: "translateY(-50%)" },
        },
        {
          id: 5,
          size: 'w-56 h-56',
          colors: 'from-rose-400/15 to-amber-600/15',
          path: {
            x: ["70%", "30%", "70%"],
            y: ["70%", "30%", "70%"],
          },
          duration: 32,
          initialPosition: { bottom: "20%", left: "20%" },
        }
      ];
      
      setOrbs(newOrbs);
    };
    
    generateOrbs();
    
    // Regenerate orbs periodically for variety
    const intervalId = setInterval(generateOrbs, 120000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {orbs.map((orb) => {
        const baseTransition = prefersReducedMotion 
          ? { duration: 0 }
          : {
              duration: orb.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
            };
            
        return (
          <motion.div
            key={orb.id}
            className={`absolute ${orb.size} rounded-full bg-gradient-to-r ${orb.colors} blur-3xl`}
            animate={{
              ...orb.path,
              scale: [1, 1.1, 1],
              opacity: [0.7, 0.9, 0.7],
            }}
            transition={baseTransition}
            style={orb.initialPosition}
            whileHover={{
              scale: 1.2,
              opacity: 1,
            }}
          />
        );
      })}
      
      {/* Interactive orb that follows mouse slightly
      <motion.div
        className="absolute w-32 h-32 rounded-full bg-gradient-to-r from-violet-400/10 to-pink-600/10 blur-2xl"
        animate={{
          x: mousePosition.x - 64,
          y: mousePosition.y - 64,
        }}
        transition={{
          type: 'spring',
          stiffness: 100,
          damping: 25,
          mass: 0.5
        }}
      /> */}
    </div>
  );
};

export default GradientOrbs;