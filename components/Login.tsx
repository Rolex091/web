
import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isCasting, setIsCasting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCasting(true);

    setTimeout(() => {
      if (username.toLowerCase() !== 'harish') {
        setError('⚠️ Only the chosen wizard Harish can enter.');
        setIsCasting(false);
      } else if (password !== '18022026') {
        setError('Wrong spell! Try again muggle.');
        setIsCasting(false);
      } else {
        setError('');
        onLogin(true);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0500] p-4">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/black-linen.png')] opacity-30"></div>
      
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md bg-[#1e1305] border-4 border-[#d4af37] p-8 rounded-xl shadow-[0_0_50px_rgba(212,175,55,0.3)] relative z-10"
      >
        <div className="text-center mb-8">
          <h1 className="hp-font text-4xl text-[#d4af37] mb-2 drop-shadow-md">Wizard Entry Portal</h1>
          <p className="standard-font text-[#f5deb3] text-sm italic">Identify yourself, Sorcerer.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="hp-font block text-[#d4af37] mb-2">Wizard Alias</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#3d2b1f] border-2 border-[#5c4033] rounded px-4 py-3 text-[#f5deb3] focus:outline-none focus:border-[#d4af37] transition-colors font-mono"
              placeholder="e.g. Harry"
            />
          </div>

          <div>
            <label className="hp-font block text-[#d4af37] mb-2">Secret Incantation</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#3d2b1f] border-2 border-[#5c4033] rounded px-4 py-3 text-[#f5deb3] focus:outline-none focus:border-[#d4af37] transition-colors font-mono"
              placeholder="••••••••"
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={isCasting}
            className="w-full bg-[#d4af37] hover:bg-[#b89b30] text-[#1e1305] hp-font text-xl py-3 rounded transition-all shadow-lg flex items-center justify-center gap-2"
          >
            {isCasting ? 'Casting Spell...' : 'Enter the Birthday Chamber'}
            {!isCasting && <span>🪄</span>}
          </motion.button>
        </form>

        {error && (
          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-6 text-red-400 text-center funny-font text-lg"
          >
            {error}
          </motion.p>
        )}
      </motion.div>

      {/* Floating Magic Items */}
      <div className="absolute top-10 left-10 text-4xl animate-bounce">⚡</div>
      <div className="absolute bottom-10 right-10 text-4xl animate-pulse">🍫</div>
      <div className="absolute top-1/2 left-4 text-4xl animate-spin" style={{ animationDuration: '5s' }}>🐱</div>
    </div>
  );
};

export default Login;
