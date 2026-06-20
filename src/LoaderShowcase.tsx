import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Keyboard, Shield, Cpu, Radio } from 'lucide-react';
import RetroLoader from './components/RetroLoader';
import CyberLoader from './components/CyberLoader';
import MinimalLoader from './components/MinimalLoader';
import TacticalLoader from './components/TacticalLoader';
import MechLoader from './components/MechLoader';
import DrifterGlitchLoader from './components/DrifterGlitchLoader';

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 120 : -120,
    opacity: 0,
    scale: 0.9,
    filter: 'blur(8px)',
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -120 : 120,
    opacity: 0,
    scale: 0.9,
    filter: 'blur(8px)',
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const LoaderShowcase = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 = right, -1 = left
  const [isLKeyActive, setIsLKeyActive] = useState(false);
  const [isRKeyActive, setIsRKeyActive] = useState(false);

  const themes = [
    { id: 'drifter', label: 'Drifter Glitch Console', component: <DrifterGlitchLoader />, color: 'text-[#ff2a85]', glow: 'shadow-[#ff2a85]/35', tag: 'HLD_CORE_v1.0.4' },
    { id: 'cyber', label: 'High-Tech Cyber', component: <CyberLoader />, color: 'text-cyan-400', glow: 'shadow-cyan-500/25', tag: 'CYBER_CORE_v4.2' },
    { id: 'tactical', label: 'Tactical Game UI', component: <TacticalLoader />, color: 'text-[#ff4655]', glow: 'shadow-[#ff4655]/25', tag: 'VALOR_SEC_UPLINK' },
    { id: 'mech', label: 'Mech Tactical HUD', component: <MechLoader />, color: 'text-amber-500', glow: 'shadow-amber-500/25', tag: 'MK_VII_CALIBRATOR' },
    { id: 'retro', label: 'Retro Pixel', component: <RetroLoader />, color: 'text-emerald-400', glow: 'shadow-emerald-500/25', tag: 'ARCADE_EMULATOR_8B' },
    { id: 'minimal', label: 'Modern Minimal', component: <MinimalLoader />, color: 'text-white', glow: 'shadow-white/20', tag: 'MIN_VECTOR_DOCK' },
  ];

  const handlePrev = () => {
    setDirection(-1);
    setActiveIndex((prev) => (prev === 0 ? themes.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setActiveIndex((prev) => (prev === themes.length - 1 ? 0 : prev + 1));
  };

  // Keyboard controls with visual flash
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setIsLKeyActive(true);
        handlePrev();
        setTimeout(() => setIsLKeyActive(false), 200);
      } else if (e.key === 'ArrowRight') {
        setIsRKeyActive(true);
        handleNext();
        setTimeout(() => setIsRKeyActive(false), 200);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Touch controls for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const minSwipeDistance = 50;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  const currentTheme = themes[activeIndex];

  return (
    <div className="min-h-screen bg-[#020203] text-white flex flex-col items-center justify-between p-4 sm:p-8 overflow-hidden font-mono relative">
      {/* Sci-Fi Ambient Grid Overlay */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 0 0 0 30" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Cybernetic HUD Scanlines and Glows */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent z-10" />
      <div className="absolute bottom-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent z-10" />
      
      {/* Immersive HUD Header Panel */}
      <header className="w-full max-w-4xl z-10 flex flex-col sm:flex-row justify-between items-center border-b border-gray-800/80 pb-4 mt-2 sm:mt-0 gap-3 text-center sm:text-left select-none">
        <div className="flex flex-col">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h1 className="text-sm font-black tracking-[0.4em] uppercase text-cyan-400">
              SYS.INITIALIZER_FEED // v3.8
            </h1>
          </div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
            Tactical animation array calibration console
          </p>
        </div>
        
        {/* Tech Readouts */}
        <div className="flex items-center gap-6 text-[10px] text-gray-400 bg-black/40 border border-gray-800/50 rounded px-4 py-2">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-cyan-500" />
            <span>GRID: <span className="text-cyan-400">ONLINE</span></span>
          </div>
          <div className="flex items-center gap-1.5 border-l border-gray-800 pl-4">
            <Shield className="w-3.5 h-3.5 text-fuchsia-500" />
            <span>SECURE: <span className="text-fuchsia-400">ESTABLISHED</span></span>
          </div>
          <div className="hidden md:flex items-center gap-1.5 border-l border-gray-800 pl-4">
            <Radio className="w-3.5 h-3.5 text-amber-500" />
            <span>LATENCY: <span className="text-amber-400">0.4ms</span></span>
          </div>
        </div>
      </header>

      {/* Main Tactical Deck (Mobile Adaptive View) */}
      <main className="w-full max-w-4xl flex-grow flex flex-col items-center justify-center my-6 z-10 select-none">
        <div className="w-full flex items-center justify-between gap-2 sm:gap-6 relative">
          
          {/* LEFT NAV CHEVRON */}
          <button
            onClick={handlePrev}
            aria-label="Previous Loader Style"
            className="group relative hidden sm:flex w-14 h-24 border border-gray-800/80 bg-black/40 backdrop-blur-md rounded-lg items-center justify-center cursor-pointer transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-950/20 active:scale-95"
          >
            {/* Tech Corner Deco */}
            <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-gray-700 group-hover:border-cyan-400 transition-colors" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-gray-700 group-hover:border-cyan-400 transition-colors" />
            
            <ChevronLeft className="w-8 h-8 text-gray-500 group-hover:text-cyan-400 transition-all duration-300 group-hover:-translate-x-0.5" />
          </button>

          {/* THE STAGE: Main Screen */}
          <div
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            className="w-full h-[380px] sm:h-[430px] relative rounded-xl border border-gray-800 bg-[#040406]/95 shadow-2xl backdrop-blur-2xl overflow-hidden flex flex-col items-center justify-center p-4 sm:p-6"
          >
            {/* Stage Dynamic Theme Ambient Phosphor Glow (Transitions smoothly) */}
            <div 
              className="absolute inset-0 opacity-50 pointer-events-none transition-all duration-700 ease-in-out z-0" 
              style={{
                background: currentTheme.id === 'drifter' ? 'radial-gradient(circle at center, rgba(255, 42, 133, 0.12) 0%, rgba(0, 240, 255, 0.05) 50%, transparent 75%)' :
                            currentTheme.id === 'cyber' ? 'radial-gradient(circle at center, rgba(34, 211, 238, 0.08) 0%, transparent 70%)' :
                            currentTheme.id === 'tactical' ? 'radial-gradient(circle at center, rgba(255, 70, 85, 0.08) 0%, transparent 70%)' :
                            currentTheme.id === 'mech' ? 'radial-gradient(circle at center, rgba(245, 158, 11, 0.08) 0%, transparent 70%)' :
                            currentTheme.id === 'retro' ? 'radial-gradient(circle at center, rgba(52, 211, 153, 0.08) 0%, transparent 70%)' :
                            'radial-gradient(circle at center, rgba(255, 255, 255, 0.04) 0%, transparent 70%)'
              }}
            />
            
            {/* Stage Grid overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.01)_0,transparent_75%)] pointer-events-none z-0" />
            <div className="absolute inset-0 border border-gray-900 pointer-events-none rounded-xl z-0" />
            
            {/* Dynamic Interactive Corner Brackets */}
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-gray-700 z-0" />
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-gray-700" />
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-gray-700" />
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-gray-700" />

            {/* Glowing active theme indicator at corners */}
            <div className={`absolute top-0 left-1/2 -translate-x-1/2 px-4 py-0.5 rounded-b border-x border-b border-gray-800 bg-black/80 text-[9px] uppercase tracking-widest text-gray-500`}>
              THEME DECK // <span className={currentTheme.color}>{currentTheme.tag}</span>
            </div>

            {/* Animation transition container */}
            <div className="w-full h-full flex items-center justify-center relative z-10 overflow-hidden">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={currentTheme.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="absolute w-full h-full flex items-center justify-center"
                >
                  {currentTheme.component}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Mobile swipe tutorial helper */}
            <div className="absolute bottom-3 text-[9px] text-gray-600 sm:hidden tracking-[0.2em] animate-pulse">
              ◀ SWIPE TO TOGGLE INTERFACES ▶
            </div>
          </div>

          {/* RIGHT NAV CHEVRON */}
          <button
            onClick={handleNext}
            aria-label="Next Loader Style"
            className="group relative hidden sm:flex w-14 h-24 border border-gray-800/80 bg-black/40 backdrop-blur-md rounded-lg items-center justify-center cursor-pointer transition-all duration-300 hover:border-cyan-500/50 hover:bg-cyan-950/20 active:scale-95"
          >
            {/* Tech Corner Deco */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-gray-700 group-hover:border-cyan-400 transition-colors" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-gray-700 group-hover:border-cyan-400 transition-colors" />
            
            <ChevronRight className="w-8 h-8 text-gray-500 group-hover:text-cyan-400 transition-all duration-300 group-hover:translate-x-0.5" />
          </button>
          
        </div>

        {/* MOBILE Tactile Navigation Panel (Visible only on smaller screens) */}
        <div className="flex sm:hidden items-center justify-between w-full max-w-sm mt-4 px-4 bg-black/30 border border-gray-800/50 rounded-lg py-2">
          <button
            onClick={handlePrev}
            className="w-10 h-10 border border-gray-800 bg-black/50 rounded flex items-center justify-center active:scale-95 text-gray-400 active:text-cyan-400"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="text-center">
            <div className="text-[8px] text-gray-500 uppercase tracking-widest">ACTIVE SELECTION</div>
            <div className={`text-xs font-bold uppercase tracking-wider ${currentTheme.color}`}>
              {currentTheme.label}
            </div>
          </div>
          <button
            onClick={handleNext}
            className="w-10 h-10 border border-gray-800 bg-black/50 rounded flex items-center justify-center active:scale-95 text-gray-400 active:text-cyan-400"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </main>

      {/* Immersive HUD Control Panel (Desktop & Tablet Details) */}
      <footer className="w-full max-w-4xl z-10 border-t border-gray-800/80 pt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-gray-500 select-none pb-2 sm:pb-0">
        
        {/* Style selection descriptor */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded bg-amber-500/25 border border-amber-500 flex items-center justify-center animate-pulse">
            <div className="w-1 h-1 bg-amber-500 rounded" />
          </div>
          <span className="tracking-widest uppercase">
            SELECTED ENGINE: <span className="font-bold text-white text-xs ml-1 font-mono tracking-wider">{currentTheme.label}</span>
          </span>
        </div>

        {/* Dynamic Theme indicator pips */}
        <div className="flex items-center gap-2">
          {themes.map((theme, i) => (
            <button
              key={theme.id}
              onClick={() => {
                setDirection(i > activeIndex ? 1 : -1);
                setActiveIndex(i);
              }}
              className={`h-2 transition-all duration-300 rounded-full cursor-pointer ${
                activeIndex === i 
                  ? `w-8 bg-cyan-400 shadow-[0_0_8px_#22d3ee]` 
                  : 'w-2 bg-gray-800 hover:bg-gray-700'
              }`}
              title={theme.label}
            />
          ))}
        </div>

        {/* Keyboard navigation helper layout */}
        <div className="flex items-center gap-3 bg-black/40 border border-gray-800/50 rounded-lg px-4 py-1.5">
          <Keyboard className="w-3.5 h-3.5 text-gray-600" />
          <span className="tracking-wider uppercase">NAV CONTROLS:</span>
          <div className="flex items-center gap-1">
            <span className={`w-6 h-5 border rounded flex items-center justify-center text-[9px] font-bold font-mono transition-all duration-150 ${isLKeyActive ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_8px_#22d3ee]' : 'border-gray-700 text-gray-400'}`}>
              ←
            </span>
            <span className={`w-6 h-5 border rounded flex items-center justify-center text-[9px] font-bold font-mono transition-all duration-150 ${isRKeyActive ? 'bg-cyan-500 border-cyan-400 text-black shadow-[0_0_8px_#22d3ee]' : 'border-gray-700 text-gray-400'}`}>
              →
            </span>
          </div>
        </div>

      </footer>
    </div>
  );
};

export default LoaderShowcase;
