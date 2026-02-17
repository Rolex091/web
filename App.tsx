
import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import BirthdayPage from './components/BirthdayPage';
import CustomCursor from './components/CustomCursor';
import { motion, AnimatePresence } from 'framer-motion';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMagic, setShowMagic] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => setShowMagic(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn]);

  const handleLogin = (success: boolean) => {
    if (success) {
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-x-hidden">
      {/* Custom Cat and Mouse Cursor */}
      <CustomCursor />

      <AnimatePresence mode="wait">
        {!isLoggedIn ? (
          <motion.div
            key="login"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
            className="z-50 relative"
          >
            <Login onLogin={handleLogin} />
          </motion.div>
        ) : (
          <motion.div
            key="birthday"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full"
          >
            <BirthdayPage />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background Sparkles */}
      <div className="fixed inset-0 pointer-events-none z-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="sparkle-dot"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
