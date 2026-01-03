// components/animations/FloatingShapes.jsx
import { motion } from 'framer-motion';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useMousePosition } from '../../hooks/useMousePosition';

const FloatingShapes = () => {
  const [shapes, setShapes] = useState([]);
  const [isInteracting, setIsInteracting] = useState(false);
  const mousePosition = useMousePosition();
  
  useEffect(() => {
    const generateShapes = () => {
      const newShapes = [];
      const colors = [
        'rgba(100, 200, 255, 0.15)', 
        'rgba(255, 100, 200, 0.15)', 
        'rgba(200, 255, 100, 0.15)',
        'rgba(255, 200, 100, 0.15)',
        'rgba(180, 100, 255, 0.15)',
        'rgba(100, 255, 200, 0.15)'
      ];
      
      for (let i = 0; i < 20; i++) {
        const type = ['circle', 'triangle', 'square', 'hexagon', 'star'][Math.floor(Math.random() * 5)];
        newShapes.push({
          id: i,
          type,
          size: Math.random() * 80 + 20,
          color: colors[Math.floor(Math.random() * colors.length)],
          x: Math.random() * 100,
          y: Math.random() * 100,
          duration: Math.random() * 25 + 15,
          delay: Math.random() * 5,
          rotationSpeed: Math.random() * 10 + 5,
          floatIntensity: Math.random() * 40 + 10
        });
      }
      
      setShapes(newShapes);
    };
    
    generateShapes();
    
    // Regenerate shapes periodically for variety
    const intervalId = setInterval(generateShapes, 60000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  const renderShape = useCallback((shape) => {
    const baseStyle = {
      position: 'absolute',
      width: `${shape.size}px`,
      height: `${shape.size}px`,
      left: `${shape.x}%`,
      top: `${shape.y}%`,
      filter: 'blur(1px)',
      transform: 'translate3d(0, 0, 0)', // Hardware acceleration
      willChange: 'transform' // Performance optimization
    };
    
    switch (shape.type) {
      case 'circle':
        return (
          <div 
            key={shape.id} 
            style={{ 
              ...baseStyle, 
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, ${shape.color.replace('0.15', '0.3')}, ${shape.color})`,
              boxShadow: `0 0 20px ${shape.color}`
            }} 
          />
        );
      case 'square':
        return (
          <div 
            key={shape.id} 
            style={{ 
              ...baseStyle, 
              borderRadius: '15%',
              background: `linear-gradient(135deg, ${shape.color.replace('0.15', '0.3')}, ${shape.color})`,
              boxShadow: `0 0 15px ${shape.color}`
            }} 
          />
        );
      case 'triangle':
        return (
          <div
            key={shape.id}
            style={{
              ...baseStyle,
              width: 0,
              height: 0,
              backgroundColor: 'transparent',
              borderLeft: `${shape.size/2}px solid transparent`,
              borderRight: `${shape.size/2}px solid transparent`,
              borderBottom: `${shape.size}px solid ${shape.color}`,
              filter: `drop-shadow(0 0 10px ${shape.color})`
            }}
          />
        );
      case 'hexagon':
        return (
          <div 
            key={shape.id} 
            style={{ 
              ...baseStyle,
              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
              background: `linear-gradient(135deg, ${shape.color.replace('0.15', '0.3')}, ${shape.color})`,
              boxShadow: `0 0 15px ${shape.color}`
            }} 
          />
        );
      case 'star':
        return (
          <div 
            key={shape.id} 
            style={{ 
              ...baseStyle,
              clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
              background: `linear-gradient(135deg, ${shape.color.replace('0.15', '0.3')}, ${shape.color})`,
              boxShadow: `0 0 15px ${shape.color}`
            }} 
          />
        );
      default:
        return null;
    }
  }, []);
  
  const calculateMouseInfluence = useCallback((shape) => {
    if (!isInteracting || !mousePosition.x || !mousePosition.y) return { x: 0, y: 0 };
    
    const shapeCenterX = window.innerWidth * (shape.x / 100) + shape.size / 2;
    const shapeCenterY = window.innerHeight * (shape.y / 100) + shape.size / 2;
    
    const distance = Math.sqrt(
      Math.pow(mousePosition.x - shapeCenterX, 2) + 
      Math.pow(mousePosition.y - shapeCenterY, 2)
    );
    
    const maxDistance = 300;
    const influence = Math.max(0, 1 - distance / maxDistance);
    
    const angle = Math.atan2(
      shapeCenterY - mousePosition.y,
      shapeCenterX - mousePosition.x
    );
    
    return {
      x: Math.cos(angle) * influence * 30,
      y: Math.sin(angle) * influence * 30
    };
  }, [isInteracting, mousePosition]);
  
  return (
    <div 
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      onMouseEnter={() => setIsInteracting(true)}
      onMouseLeave={() => setIsInteracting(false)}
    >
      {shapes.map(shape => {
        const mouseInfluence = calculateMouseInfluence(shape);
        
        return (
          <motion.div
            key={shape.id}
            animate={{
              y: [0, -shape.floatIntensity, 0],
              x: [0, shape.floatIntensity * 0.7, 0],
              rotate: [0, shape.rotationSpeed, 0],
              opacity: [0.3, 0.7, 0.3],
              scale: [1, 1.05, 1],
            }}
            whileHover={{
              scale: 1.2,
              opacity: 0.9,
            }}
            transition={{
              duration: shape.duration,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'easeInOut',
              delay: shape.delay,
            }}
            style={{
              x: mouseInfluence.x,
              y: mouseInfluence.y,
            }}
          >
            {renderShape(shape)}
          </motion.div>
        );
      })}
    </div>
  );
};

export default FloatingShapes;