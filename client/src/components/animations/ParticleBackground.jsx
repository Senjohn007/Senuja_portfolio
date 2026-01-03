// components/animations/ParticleBackground.jsx
import { useEffect, useRef } from 'react';

const ParticleBackground = () => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef(null);
  const particles = useRef([]);
  const grid = useRef([]);

  // --- Configuration ---
  const config = {
    particleCount: Math.floor((window.innerWidth * window.innerHeight) / 15000), // Base count
    maxParticles: 100, // Cap the number of particles for performance
    connectionDistance: 120,
    mouseRadius: 100,
    cellSize: 120, // Size of each cell in the spatial grid
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Adjust particle count based on screen size but cap it
    config.particleCount = Math.min(
      Math.floor((window.innerWidth * window.innerHeight) / 15000),
      config.maxParticles
    );

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      // Re-initialize particles on resize
      initParticles();
    };

    // --- Particle Initialization ---
    const initParticles = () => {
      particles.current = [];
      for (let i = 0; i < config.particleCount; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 0.5,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.3,
        });
      }
    };
    
    // --- Spatial Grid for Optimization ---
    const updateGrid = () => {
      grid.current = [];
      const cols = Math.ceil(canvas.width / config.cellSize);
      const rows = Math.ceil(canvas.height / config.cellSize);
      for (let i = 0; i < cols * rows; i++) {
        grid.current.push([]);
      }

      particles.current.forEach(particle => {
        const cellX = Math.floor(particle.x / config.cellSize);
        const cellY = Math.floor(particle.y / config.cellSize);
        const cellIndex = cellY * cols + cellX;
        if (grid.current[cellIndex]) {
          grid.current[cellIndex].push(particle);
        }
      });
    };

    const getNearbyParticles = (particle) => {
      const nearby = [];
      const cellX = Math.floor(particle.x / config.cellSize);
      const cellY = Math.floor(particle.y / config.cellSize);
      const cols = Math.ceil(canvas.width / config.cellSize);

      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const checkX = cellX + j;
          const checkY = cellY + i;
          if (checkX >= 0 && checkX < cols && checkY >= 0) {
            const cellIndex = checkY * cols + checkX;
            if (grid.current[cellIndex]) {
              nearby.push(...grid.current[cellIndex]);
            }
          }
        }
      }
      return nearby;
    };

    // --- Animation Loop ---
    const animate = () => {
      // Use a semi-transparent black rectangle for a trail effect instead of a gradient
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      updateGrid();

      particles.current.forEach((particle, index) => {
        // --- Update Particle Position ---
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Mouse interaction (repulsion)
        const dx = particle.x - mouseRef.current.x;
        const dy = particle.y - mouseRef.current.y;
        const distSq = dx * dx + dy * dy;
        if (distSq < config.mouseRadius * config.mouseRadius) {
          const dist = Math.sqrt(distSq);
          const force = (config.mouseRadius - dist) / config.mouseRadius;
          const angle = Math.atan2(dy, dx);
          particle.x += Math.cos(angle) * force * 2;
          particle.y += Math.sin(angle) * force * 2;
        }
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // --- Draw Particle ---
        // Simplified drawing: single circle with a subtle glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        // Color based on position, but simplified
        const hue = (particle.x / canvas.width) * 60 + 180;
        ctx.fillStyle = `hsla(${hue}, 70%, 60%, ${particle.opacity})`;
        ctx.fill();
      });
      
      // --- Draw Connections (Optimized) ---
      particles.current.forEach((p1, i) => {
        const nearbyParticles = getNearbyParticles(p1);
        nearbyParticles.forEach(p2 => {
          if (p1 === p2) return;
          
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < config.connectionDistance * config.connectionDistance) {
            const distance = Math.sqrt(distSq);
            const opacity = 0.15 * (1 - distance / config.connectionDistance);
            
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            
            // Simplified line style, no shadow
            ctx.strokeStyle = `rgba(100, 200, 255, ${opacity})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // --- Event Listeners ---
    const handleResize = () => {
      resizeCanvas();
    };

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    
    // --- Initialization ---
    resizeCanvas();
    animate();
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);
  
  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ 
        opacity: 0.25,
        // Hints to the browser to optimize for animations
        willChange: 'transform', 
        // Slight blur can sometimes improve performance by reducing visual noise
        filter: 'blur(0.25px)' 
      }}
    />
  );
};

export default ParticleBackground;