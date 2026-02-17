
import React, { useEffect, useState } from 'react';
import { FallingItem } from '../types';

const MagicRain: React.FC = () => {
  const [items, setItems] = useState<FallingItem[]>([]);

  useEffect(() => {
    const generateItems = () => {
      const newItems: FallingItem[] = Array.from({ length: 30 }).map((_, i) => ({
        id: Math.random(),
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 7,
        type: Math.random() > 0.3 ? 'chocolate' : 'cat',
        rotation: Math.random() * 360,
        size: 20 + Math.random() * 30,
      }));
      setItems(newItems);
    };

    generateItems();
    const interval = setInterval(generateItems, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {items.map((item) => (
        <div
          key={item.id}
          className="absolute text-4xl"
          style={{
            left: `${item.left}%`,
            top: '-50px',
            animation: `fall ${item.duration}s linear ${item.delay}s infinite`,
            fontSize: `${item.size}px`,
            opacity: 0.8,
          }}
        >
          {item.type === 'chocolate' ? '🍫' : '🐱'}
          <style>{`
            @keyframes fall {
              0% { transform: translateY(0) rotate(0deg); }
              100% { transform: translateY(110vh) rotate(${item.rotation}deg); }
            }
          `}</style>
        </div>
      ))}
    </div>
  );
};

export default MagicRain;
