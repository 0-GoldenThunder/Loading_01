import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TacticalLoader = () => {
  const [progress, setProgress] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let currentProgress = 0;
    let isActive = true;

    const startLoading = () => {
      const interval = setInterval(() => {
        if (!isActive) return;

        // Non-linear progress simulation
        const increment = Math.random() > 0.8 ? Math.floor(Math.random() * 12) + 5 : Math.floor(Math.random() * 3) + 1;
        currentProgress += increment;
        
        if (currentProgress >= 100) {
          currentProgress = 100;
          setProgress(currentProgress);
          setIsGlitching(true);
          setTimeout(() => { if(isActive) setIsGlitching(false) }, 150);
          
          clearInterval(interval);
          setTimeout(() => { if(isActive) setIsReady(true) }, 500);

          // Reset loop for preview showcase after a delay
          setTimeout(() => {
             if(isActive) {
               currentProgress = 0;
               setProgress(0);
               setIsReady(false);
               startLoading(); // Restart the cycle
             }
          }, 3500);
          return;
        }

        setProgress(currentProgress);

        // Random subtle glitch effect during loading
        if (Math.random() > 0.9) {
          setIsGlitching(true);
          setTimeout(() => { if(isActive) setIsGlitching(false) }, 100);
        }
      }, 80);
    };

    startLoading();

    return () => {
      isActive = false;
    };
  }, []);

  const glitchVariants = {
    normal: { x: 0, y: 0, opacity: 1, filter: "brightness(1)", skewX: 0 },
    glitch: { 
      x: [-3, 3, -2, 0], 
      y: [2, -1, 1, 0], 
      opacity: [1, 0.8, 1],
      filter: ["brightness(1.5) hue-rotate(90deg)", "brightness(0.8)", "brightness(1)"],
      skewX: [10, -10, 0],
      transition: { duration: 0.15 } 
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-[350px] py-4 font-mono overflow-hidden">
      {/* Tactical Grid Background */}
      <div className="absolute inset-0 pointer-events-none opacity-10 z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="tactical-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
              <circle cx="40" cy="40" r="1.5" fill="rgba(255,255,255,0.8)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tactical-grid)" />
        </svg>
      </div>

      {/* Scanning Beam Background Element */}
      <motion.div 
        className="absolute inset-0 z-0 opacity-[0.03] bg-gradient-to-b from-transparent via-white to-transparent"
        animate={{ y: ['-100%', '200%'] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />

      <div className="w-full max-w-sm relative z-10 p-6">
        {/* Frame borders (Tactical style) */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-600" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-600" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-600" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-600" />

        <AnimatePresence mode="wait">
          {!isReady ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
              transition={{ duration: 0.3 }}
              className="flex flex-col"
            >
              {/* Header Info */}
              <div className="flex justify-between items-end mb-1 text-gray-500 text-[10px] tracking-[0.2em] uppercase">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#ff4655] animate-pulse" />
                  Uplink
                </span>
                <span>NODE_04 // SECURE</span>
              </div>

              {/* Main Counter */}
              <div className="flex items-baseline mb-4 relative">
                <motion.span 
                  variants={glitchVariants}
                  animate={isGlitching ? "glitch" : "normal"}
                  className={`text-8xl font-black tracking-tighter ${isGlitching ? 'text-[#ff4655] drop-shadow-[2px_2px_0_rgba(0,255,255,0.5)]' : 'text-white'}`}
                >
                  {progress}
                </motion.span>
                <span className="text-2xl text-gray-500 ml-2 font-bold tracking-widest">%</span>
              </div>

              {/* Tactical Progress Bar */}
              <div className="relative w-full h-1 bg-gray-800/80 mb-2 overflow-hidden flex">
                <motion.div 
                  className="h-full bg-[#ff4655]"
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", stiffness: 100, damping: 15, mass: 0.5 }}
                />
                <motion.div 
                   className="absolute top-0 bottom-0 w-4 bg-white/50 blur-[2px]"
                   initial={{ left: "-4px" }}
                   animate={{ left: `calc(${progress}% - 4px)` }}
                   transition={{ type: "spring", stiffness: 100, damping: 15, mass: 0.5 }}
                />
              </div>

              {/* Footer text */}
              <div className="flex justify-between text-[9px] text-gray-500 tracking-[0.2em]">
                <motion.span 
                   animate={{ opacity: [1, 0.4, 1] }} 
                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                >
                  EXTRACTING_PAYLOAD
                </motion.span>
                <span className="text-[#ff4655]">{progress === 100 ? 'COMPLETE' : 'ACTIVE'}</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="ready"
              initial={{ opacity: 0, y: 10, filter: 'blur(5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-8"
            >
              <div className="flex items-center gap-4 mb-2">
                 <div className="w-12 h-[1px] bg-gray-600" />
                 <h2 className="text-2xl font-black text-white tracking-[0.4em] uppercase shadow-sm">
                   Authorized
                 </h2>
                 <div className="w-12 h-[1px] bg-gray-600" />
              </div>
              <p className="text-[#ff4655] text-[10px] tracking-widest uppercase">
                System Interface Ready
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TacticalLoader;
