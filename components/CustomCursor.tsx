
import React, { useEffect, useState, useRef } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isIdle, setIsIdle] = useState(false);
  const [isExcited, setIsExcited] = useState(false);
  const [isPouncing, setIsPouncing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  
  // Motion values for the mouse (lead)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for the cat (follower)
  const catX = useSpring(mouseX, { damping: 20, stiffness: 100, restDelta: 0.001 });
  const catY = useSpring(mouseY, { damping: 20, stiffness: 100, restDelta: 0.001 });

  const idleTimer = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isVisible) setIsVisible(true);
      
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      setIsIdle(false);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
      
      idleTimer.current = window.setTimeout(() => {
        setIsIdle(true);
      }, 3000);
    };

    const handleMouseDown = () => {
      setIsPouncing(true);
      const meow = new Audio('https://actions.google.com/sounds/v1/animals/cat_meow.ogg');
      meow.volume = 0.2;
      meow.play().catch(() => {});
      setTimeout(() => setIsPouncing(false), 200);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (['BUTTON', 'A', 'INPUT', 'SELECT'].includes(target.tagName) || target.closest('[role="button"]')) {
        setIsExcited(true);
      }
    };

    const handleMouseOut = () => {
      setIsExcited(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseover', handleMouseOver);
    window.addEventListener('mouseout', handleMouseOut);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseover', handleMouseOver);
      window.removeEventListener('mouseout', handleMouseOut);
      if (idleTimer.current) window.clearTimeout(idleTimer.current);
    };
  }, [mouseX, mouseY, isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999]">
      {/* The Mouse (The lead) */}
      <motion.div
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '20px', // Mouse is slightly ahead
          translateY: '-10px',
        }}
        className="absolute text-xl select-none"
      >
        <span role="img" aria-label="mouse">🐭</span>
      </motion.div>

      {/* The Cat (The chaser) */}
      <motion.div
        style={{
          x: catX,
          y: catY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: isPouncing ? 1.4 : isExcited ? 1.2 : 1,
          rotate: isPouncing ? 15 : 0,
        }}
        className="absolute flex items-center justify-center text-4xl select-none"
      >
        <div className="relative">
          {isIdle ? (
            <span role="img" aria-label="sitting cat">🐈‍⬛</span>
          ) : (
            <motion.div
              animate={{
                y: [0, -4, 0],
                rotate: [0, -5, 5, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 0.4,
                ease: "linear"
              }}
            >
              <span role="img" aria-label="running cat">🐈</span>
            </motion.div>
          )}
          
          {/* Excited Sparkles */}
          {isExcited && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute -top-4 -right-4 text-xs"
            >
              ✨❤️
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CustomCursor;
