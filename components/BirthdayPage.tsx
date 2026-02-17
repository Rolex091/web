
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cat, Sparkles, Heart, Volume2, VolumeX, Star, X } from 'lucide-react';
import MagicRain from './MagicRain';
import { 
  CAT_IMAGES, 
  CHOCO_IMAGES, 
  HP_WISHES, 
  BABY_CAT_IMAGES, 
  BIRTHDAY_QUOTES 
} from '../constants';
import { CatGif } from '../types';

interface SpecialDrop {
  id: string;
  type: 'hp-character' | 'chocolate' | 'flower';
  x: number;
  y?: number;
  url?: string;
  data?: any;
}

const BirthdayPage: React.FC = () => {
  const [catCount, setCatCount] = useState(0);
  const [happiness, setHappiness] = useState(10);
  const [activeGifs, setActiveGifs] = useState<CatGif[]>([]);
  const [specialDrops, setSpecialDrops] = useState<SpecialDrop[]>([]);
  const [activeFlowers, setActiveFlowers] = useState<SpecialDrop[]>([]);
  const [surpriseOpen, setSurpriseOpen] = useState(false);
  const [showMessage, setShowMessage] = useState<string | null>(null);
  const [showMemory, setShowMemory] = useState(false);
  const [isWishMode, setIsWishMode] = useState(false);
  const [surpriseType, setSurpriseType] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [isFriendWishOpen, setIsFriendWishOpen] = useState(false);
  
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);
  const catWishMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Correctly initialize audio and assign to refs to avoid immediate null property access errors
    const bgAudio = new Audio('https://cdn.pixabay.com/audio/2022/11/22/audio_feb6b8b0e8.mp3'); 
    bgAudio.loop = true;
    bgAudio.volume = 0.25;
    bgMusicRef.current = bgAudio;

    const catAudio = new Audio('https://www.myinstants.com/media/sounds/cat-birthday-song.mp3');
    catAudio.volume = 0.6;
    catWishMusicRef.current = catAudio;
    
    const startMusic = () => {
      bgMusicRef.current?.play().then(() => setIsMusicPlaying(true)).catch(() => {});
      window.removeEventListener('click', startMusic);
    };
    window.addEventListener('click', startMusic);
    
    return () => {
      bgMusicRef.current?.pause();
      catWishMusicRef.current?.pause();
      window.removeEventListener('click', startMusic);
    };
  }, []);

  // Timer logic for the 10-second auto-close of the Wish popup
  useEffect(() => {
    let timer: number;
    if (isFriendWishOpen) {
      timer = window.setTimeout(() => {
        setIsFriendWishOpen(false);
      }, 10000); // 10 seconds
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isFriendWishOpen]);

  const toggleMusic = () => {
    if (isMusicPlaying) {
      bgMusicRef.current?.pause();
      catWishMusicRef.current?.pause();
    } else {
      bgMusicRef.current?.play();
    }
    setIsMusicPlaying(!isMusicPlaying);
  };

  const playCuteMeow = () => {
    const audio = new Audio('https://www.myinstants.com/media/sounds/kitten-meow.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  };

  const addCat = () => {
    setCatCount(prev => prev + 1);
    setHappiness(prev => Math.min(prev + 2, 100));
    playCuteMeow();
    
    const newGif: CatGif = {
      id: Math.random().toString(),
      url: CAT_IMAGES[Math.floor(Math.random() * CAT_IMAGES.length)],
      x: Math.random() * (window.innerWidth - 120),
      y: Math.random() * (window.innerHeight - 120),
    };
    
    setActiveGifs(prev => [...prev, newGif]);
    setTimeout(() => {
      setActiveGifs(prev => prev.filter(g => g.id !== newGif.id));
    }, 4000);
  };

  const dropManyChocolates = () => {
    setHappiness(prev => Math.min(prev + 15, 100));
    const items: SpecialDrop[] = Array.from({ length: 25 }).map((_, i) => ({
      id: Math.random().toString(),
      type: 'chocolate',
      x: Math.random() * 100,
      url: CHOCO_IMAGES[Math.floor(Math.random() * CHOCO_IMAGES.length)]
    }));

    setSpecialDrops(prev => [...prev, ...items]);
    setTimeout(() => {
      setSpecialDrops(prev => prev.filter(d => !items.find(i => i.id === d.id)));
    }, 5000);
  };

  const handleSurpriseClick = () => {
    const types = ['memory', 'confetti', 'meows', 'wish'];
    const current = types[surpriseType % types.length];
    setSurpriseType(prev => prev + 1);

    if (current === 'memory') {
        setShowMemory(true);
        setShowMessage(null);
    } else if (current === 'meows') {
      playCuteMeow();
      for(let i=0; i<10; i++) setTimeout(addCat, i * 150);
    } else {
        setShowMessage(HP_WISHES[Math.floor(Math.random() * HP_WISHES.length)]);
        setShowMemory(false);
    }
  };

  return (
    <div className={`min-h-screen text-[#f5deb3] relative overflow-hidden standard-font pb-20 transition-all duration-700 bg-[#1a0f00]`}>
      <MagicRain />
      
      {/* Music Toggle */}
      <button 
        onClick={toggleMusic}
        className="fixed top-6 left-6 z-50 bg-[#2d1e12]/90 backdrop-blur-md border-2 border-[#d4af37] p-3 rounded-full shadow-lg text-[#d4af37] hover:bg-[#d4af37] hover:text-[#1a0f00] transition-all flex items-center gap-2 group"
      >
        {isMusicPlaying ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
      </button>

      {/* Flower Explosion Animation */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        <AnimatePresence>
          {activeFlowers.map(flower => (
            <motion.div
              key={flower.id}
              initial={{ x: '50vw', y: '50vh', scale: 0, opacity: 1 }}
              animate={{ 
                x: `${flower.x}vw`, 
                y: ['50vh', '-10vh', '110vh'], 
                scale: [1, 1.5, 1],
                rotate: 720,
                opacity: [1, 1, 0]
              }}
              transition={{ duration: 6 + Math.random() * 4, ease: "easeOut" }}
              className="absolute text-5xl"
            >
              {flower.data}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Chocolate Rain */}
      <div className="fixed inset-0 pointer-events-none z-50">
        <AnimatePresence>
          {specialDrops.map(drop => (
            <motion.div
              key={drop.id}
              initial={{ y: -500, opacity: 1, rotate: Math.random() * 360 }}
              animate={{ y: window.innerHeight + 500, rotate: 1080 }}
              transition={{ duration: 4 + Math.random() * 2, ease: "linear" }}
              className="absolute"
              style={{ left: `${drop.x}%` }}
            >
              <div className="w-40 h-40 rounded-2xl border-4 border-[#d4af37] overflow-hidden shadow-2xl bg-[#2d1e12]">
                <img src={drop.url} className="w-full h-full object-cover" alt="Chocolate" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <header className="relative z-20 pt-10 text-center px-4">
        <motion.h1 
          animate={isWishMode ? { scale: [1, 1.1, 1], rotate: [-1, 1, -1] } : {}}
          className="hp-font text-5xl md:text-8xl text-[#d4af37] drop-shadow-[0_0_20px_rgba(212,175,55,0.7)]"
        >
          {isWishMode ? "MEOW-Y BIRTHDAY! 🐾" : "Happy Birthday Harish G! 🐱🍫⚡"}
        </motion.h1>
      </header>

      <main className="relative z-20 max-w-6xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        
        {/* Cat Card */}
        <motion.section className="bg-[#2d1e12]/80 backdrop-blur-md border-2 border-[#d4af37] p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center">
          <Cat className="w-16 h-16 text-[#ffd700] mb-4" />
          <h2 className="hp-font text-3xl text-[#ffd700] mb-2 uppercase tracking-widest">Kitten Army</h2>
          <p className="text-6xl funny-font mb-4 text-white drop-shadow-md">{catCount}</p>
          <button onClick={addCat} className="bg-[#d4af37] text-[#1a0f00] px-8 py-3 rounded-full hp-font text-2xl hover:brightness-110 active:scale-90 transition-all shadow-[0_6px_0_#8b701c]">Summon 🐾</button>
        </motion.section>

        {/* Happiness Meter */}
        <motion.section className="bg-[#2d1e12]/80 backdrop-blur-md border-2 border-[#d4af37] p-8 rounded-3xl shadow-2xl flex flex-col items-center">
          <Sparkles className="w-16 h-16 text-[#ffd700] mb-4" />
          <h2 className="hp-font text-3xl text-[#ffd700] mb-4 text-center">Magical Happiness</h2>
          <div className="w-full bg-[#1a0f00] rounded-full h-10 overflow-hidden border-2 border-[#5c4033] relative">
            <motion.div animate={{ width: `${happiness}%` }} className="bg-gradient-to-r from-[#5c4033] to-[#ffd700] h-full" />
          </div>
          <button onClick={dropManyChocolates} className="mt-6 bg-[#5c4033] text-[#f5deb3] px-10 py-3 rounded-full hp-font text-xl border border-[#d4af37] hover:bg-[#d4af37] hover:text-[#1a0f00] transition-all shadow-xl font-bold">Cast Choco-Spell 🍫</button>
        </motion.section>

        {/* Wish Song Section - Replaced action with Friendship Popup */}
        <motion.section className="bg-[#2d1e12]/80 backdrop-blur-md border-2 border-[#d4af37] p-8 rounded-3xl shadow-2xl flex flex-col items-center text-center">
          <Volume2 className="w-16 h-16 text-[#ffd700] mb-4" />
          <h2 className="hp-font text-3xl text-[#ffd700] mb-2 uppercase tracking-widest">Whish from Harish(Varms)</h2>
          <p className="italic funny-font text-2xl text-[#f5deb3] mb-6 flex-grow">"Click to see a special magical message from your friend!"</p>
          <button 
            onClick={() => setIsFriendWishOpen(true)}
            className="bg-[#d4af37] text-[#1a0f00] px-8 py-3 rounded-full hp-font text-xl hover:bg-[#ffd700] transition-all shadow-lg active:translate-y-2 flex items-center gap-2"
          >
            Hear Whish 🐾
          </button>
        </motion.section>

      </main>

      <div className="flex flex-col items-center mt-16 relative z-20">
        <motion.button
          whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(212,175,55,0.6)" }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSurpriseClick}
          className="bg-gradient-to-r from-[#d4af37] via-[#ffd700] to-[#d4af37] text-[#1a0f00] px-16 py-6 rounded-full hp-font text-5xl shadow-2xl flex items-center gap-6 border-4 border-[#1a0f00]"
        >
          SURPRISE! 🪄
        </motion.button>
        
        <AnimatePresence>
          {(showMessage || showMemory) && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="mt-12 bg-[#1e1305] border-8 border-[#d4af37] p-10 rounded-[3rem] text-center max-w-2xl mx-4 shadow-2xl relative"
            >
              {showMemory ? (
                <div className="relative z-10">
                   <h3 className="hp-font text-4xl text-[#d4af37] mb-6">Wizard & Familiar</h3>
                   {/* Removed Image as requested */}
                   <p className="funny-font text-3xl text-[#ffd700] mt-6 italic">"A true wizard's magic lies in their bonds and their love for chocolates!"</p>
                </div>
              ) : (
                <div className="relative z-10">
                  <div className="flex justify-center mb-6 gap-3">
                    {[...Array(5)].map((_, i) => <Heart key={i} className="text-red-500 w-10 h-10 animate-bounce" style={{ animationDelay: `${i * 0.1}s` }} />)}
                  </div>
                  <p className="funny-font text-4xl text-[#ffd700] leading-snug drop-shadow-md font-bold">{showMessage}</p>
                </div>
              )}
              <button onClick={() => { setShowMessage(null); setShowMemory(false); }} className="mt-10 text-[#d4af37] hp-font text-2xl border-b-2 border-[#d4af37] hover:text-white transition-all uppercase tracking-widest">Close Spell ✖</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed inset-0 pointer-events-none z-30">
        <AnimatePresence>
          {activeGifs.map(gif => (
            <motion.img
              key={gif.id}
              src={gif.url}
              initial={{ opacity: 0, scale: 0, x: gif.x, y: gif.y }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              className="absolute w-32 h-32 rounded-full border-4 border-[#d4af37] shadow-xl object-cover"
              style={{ left: 0, top: 0 }}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* New Cute Birthday Wish Section */}
      <footer className="mt-24 flex justify-center pb-24 relative z-20 px-4">
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl w-full bg-gradient-to-br from-[#2d1e12] to-[#1e1305] border-[6px] border-[#d4af37] p-8 md:p-12 rounded-[3rem] shadow-[0_20px_80px_rgba(0,0,0,0.8)] flex flex-col md:flex-row items-center gap-10"
        >
          <div className="w-full md:w-1/2">
            <div className="relative">
              <div className="absolute inset-0 bg-[#d4af37] blur-3xl opacity-20 animate-pulse"></div>
              <img 
                src={BABY_CAT_IMAGES[0]} 
                className="relative z-10 w-full h-auto rounded-3xl shadow-2xl border-4 border-[#d4af37] transform -rotate-3 hover:rotate-0 transition-transform duration-500" 
                alt="Beautiful Baby Cat" 
              />
            </div>
          </div>
          <div className="w-full md:w-1/2 text-center md:text-left">
            <Sparkles className="w-12 h-12 text-[#d4af37] mb-6 mx-auto md:mx-0" />
            <h2 className="hp-font text-4xl text-[#d4af37] mb-6">A Purr-fect Wish</h2>
            <p className="funny-font text-2xl text-[#f5deb3] leading-relaxed mb-8">
              "{BIRTHDAY_QUOTES[0]}"
            </p>
            <div className="flex gap-4 justify-center md:justify-start">
              <Cat className="text-[#d4af37] w-8 h-8" />
              <Star className="text-[#d4af37] w-8 h-8 animate-spin" style={{ animationDuration: '4s' }} />
              <Heart className="text-red-500 w-8 h-8 animate-bounce" />
            </div>
          </div>
        </motion.div>
      </footer>

      {/* Friendship Wish Full-Screen Popup */}
      <AnimatePresence>
        {isFriendWishOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 2 } }} // Slow fade-out as requested
            className="fixed inset-0 z-[500] bg-black/95 flex items-center justify-center p-6 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, transition: { duration: 2 } }} // Slow scale/fade-out as requested
              className="relative max-w-3xl w-full bg-[#1e1305] border-[8px] border-[#d4af37] p-10 md:p-16 rounded-[4rem] text-center shadow-[0_0_100px_rgba(212,175,55,0.6)] overflow-hidden"
            >
              {/* Confetti Background effect inside modal */}
              <div className="absolute inset-0 pointer-events-none opacity-20">
                {Array.from({ length: 20 }).map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: [0, 800],
                      x: [0, (Math.random() - 0.5) * 200],
                      rotate: [0, 360]
                    }}
                    transition={{
                      duration: 4 + Math.random() * 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute text-2xl"
                    style={{ left: `${Math.random() * 100}%`, top: '-50px' }}
                  >
                    {['✨', '🍫', '🐾', '🎊'][Math.floor(Math.random() * 4)]}
                  </motion.div>
                ))}
              </div>

              <button 
                onClick={() => setIsFriendWishOpen(false)}
                className="absolute top-8 right-8 text-[#d4af37] hover:text-white transition-colors"
              >
                <X className="w-10 h-10" />
              </button>

              <div className="relative z-10">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-16 h-16 text-[#d4af37] mx-auto mb-6" />
                </motion.div>
                
                <h2 className="hp-font text-5xl md:text-7xl text-[#d4af37] mb-8 drop-shadow-lg">
                  Birthday Wishes for Harish
                </h2>
                
                <div className="space-y-8">
                  <div className="bg-[#2d1e12] p-8 rounded-3xl border-2 border-[#d4af37]/30 shadow-inner">
                    <p className="hp-font text-3xl text-[#ffd700] mb-4">From Harish (Varma):</p>
                    <p className="funny-font text-3xl md:text-4xl text-[#f5deb3] leading-relaxed italic">
                      “Happy Birthday da Harish!<br/>
                      May your day be full of cats, chocolates, laughter, and zero responsibilities.<br/>
                      Stay awesome, stay weird, and keep being the legend you are.<br/>
                      Have the happiest birthday ever!”
                    </p>
                  </div>

                  <div className="pt-6 border-t border-[#d4af37]/20">
                    <p className="hp-font text-2xl text-[#d4af37] mb-4 uppercase tracking-widest">Friendship Birthday Quote:</p>
                    <p className="standard-font text-2xl md:text-3xl text-[#ffd700] italic font-semibold">
                      “Real friends remember your birthday, but best friends make a whole chaotic website for it.”
                    </p>
                  </div>
                </div>

                <div className="mt-12 flex justify-center gap-6">
                  <Cat className="text-[#d4af37] w-10 h-10" />
                  <Heart className="text-red-500 w-10 h-10 animate-bounce" />
                  <Star className="text-[#ffd700] w-10 h-10 animate-pulse" />
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {surpriseOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] bg-black/98 flex items-center justify-center p-6 backdrop-blur-2xl"
          >
            <motion.div
              initial={{ scale: 0.1, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              className="bg-[#1e1305] border-[12px] border-[#d4af37] p-10 rounded-[4rem] text-center max-w-4xl shadow-[0_0_150px_rgba(212,175,55,0.7)]"
            >
              <h2 className="hp-font text-7xl md:text-9xl text-[#d4af37] mb-8 leading-tight drop-shadow-2xl">
                  HAPPY BIRTHDAY<br/><span className="text-[#ffd700]">HARISH G!</span>
              </h2>
              {/* Removed Image as requested */}
              <div className="p-12 bg-[#2d1e12] rounded-3xl mb-10 border-4 border-[#d4af37]/30">
                <Sparkles className="w-20 h-20 text-[#d4af37] mx-auto mb-6 animate-pulse" />
                <p className="funny-font text-4xl text-[#f5deb3]">You are a true legend in the wizarding world!</p>
              </div>
              <p className="funny-font text-4xl text-[#f5deb3] mb-12 font-bold drop-shadow-md">Stay Magical, Wizard!</p>
              <button onClick={() => setSurpriseOpen(false)} className="bg-gradient-to-r from-[#d4af37] to-[#ffd700] text-[#1a0f00] hp-font text-4xl py-6 px-16 rounded-full hover:scale-110 transition-all font-black border-4 border-[#1a0f00]">Mischief Managed 🪄</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BirthdayPage;
