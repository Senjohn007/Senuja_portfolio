// components/animations/NoiseTexture.jsx
import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';

const NoiseTexture = ({ 
  intensity = 5, 
  opacity = 0.03, 
  animated = true,
  noiseType = 'monochrome' // 'monochrome', 'rgb', 'perlin'
}) => {
  const canvasRef = useRef(null);
  const animationFrameId = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, []);
  
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    
    // Simple Perlin noise approximation
    const generatePerlinNoise = (width, height, scale) => {
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const index = (y * width + x) * 4;
          
          // Simple pseudo-random pattern that looks like Perlin noise
          const value = Math.sin(x * scale) * Math.cos(y * scale) * 128 + 128;
          const noise = Math.random() * 20 - 10; // Add some randomness
          const finalValue = Math.min(255, Math.max(0, value + noise));
          
          if (noiseType === 'rgb') {
            data[index] = finalValue * 0.8;     // red
            data[index + 1] = finalValue * 0.9; // green
            data[index + 2] = finalValue;       // blue
          } else {
            data[index] = finalValue;     // red
            data[index + 1] = finalValue; // green
            data[index + 2] = finalValue; // blue
          }
          
          data[index + 3] = intensity; // alpha
        }
      }
      
      return imageData;
    };
    
    const generateMonochromeNoise = (width, height) => {
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;     // red
        data[i + 1] = value; // green
        data[i + 2] = value; // blue
        data[i + 3] = intensity; // alpha
      }
      
      return imageData;
    };
    
    const generateRGBNoise = (width, height) => {
      const imageData = ctx.createImageData(width, height);
      const data = imageData.data;
      
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.random() * 255;     // red
        data[i + 1] = Math.random() * 255; // green
        data[i + 2] = Math.random() * 255; // blue
        data[i + 3] = intensity; // alpha
      }
      
      return imageData;
    };
    
    const generateNoise = () => {
      let imageData;
      
      switch (noiseType) {
        case 'perlin':
          imageData = generatePerlinNoise(
            dimensions.width, 
            dimensions.height, 
            0.01
          );
          break;
        case 'rgb':
          imageData = generateRGBNoise(dimensions.width, dimensions.height);
          break;
        default:
          imageData = generateMonochromeNoise(dimensions.width, dimensions.height);
      }
      
      ctx.putImageData(imageData, 0, 0);
    };
    
    if (animated && !prefersReducedMotion) {
      const animate = () => {
        generateNoise();
        animationFrameId.current = requestAnimationFrame(animate);
      };
      
      animate();
    } else {
      generateNoise();
    }
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [dimensions, intensity, animated, noiseType, prefersReducedMotion]);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ 
        mixBlendMode: 'overlay',
        opacity
      }}
    />
  );
};

export default NoiseTexture;