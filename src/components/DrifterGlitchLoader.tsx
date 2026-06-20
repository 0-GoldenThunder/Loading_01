import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Runic Character Paths Dictionary in 30x60 cell bounds
// Designed with sharp geometric angles (Vinland/HLD style)
const RUNIC_PATHS: Record<string, () => React.JSX.Element> = {
  S: () => (
    <>
      <path d="M 25 10 L 7 10 L 7 26 L 23 26 L 23 42 L 5 42" />
      <path d="M 11 18 L 14 15 L 17 18 L 14 21 Z" strokeWidth="1.2" fill="#000000" />
      <path d="M 11 34 L 14 31 L 17 34 L 14 37 Z" strokeWidth="1.2" fill="#000000" />
    </>
  ),
  Y: () => (
    <>
      <path d="M 5 10 L 15 26 L 25 10" />
      <path d="M 15 26 L 15 50" />
      <path d="M 11 26 L 15 22 L 19 26 L 15 30 Z" strokeWidth="1.2" fill="#f5e1b5" />
    </>
  ),
  T: () => (
    <>
      <path d="M 5 10 L 25 10" />
      <path d="M 5 10 L 2 20" />
      <path d="M 25 10 L 28 20" />
      <path d="M 15 10 L 15 50" />
    </>
  ),
  E: () => (
    <>
      <path d="M 5 10 L 5 50" />
      <path d="M 5 10 L 25 10" />
      <path d="M 5 50 L 25 50" />
      <path d="M 5 30 L 21 30" />
      <path d="M 9 30 L 14 25 L 19 30 L 14 35 Z" strokeWidth="1.2" fill="#000000" />
      <circle cx="14" cy="30" r="1" fill="#f5e1b5" stroke="none" />
    </>
  ),
  M: () => (
    <>
      <path d="M 5 10 L 5 50" />
      <path d="M 25 10 L 25 50" />
      <path d="M 5 10 L 15 30 L 25 10" />
      <path d="M 11 30 L 15 26 L 19 30 L 15 34 Z" strokeWidth="1.2" fill="#f5e1b5" />
    </>
  ),
  O: () => (
    <>
      <path d="M 15 10 L 25 30 L 15 50 L 5 30 Z" />
      <circle cx="15" cy="30" r="1.5" fill="#f5e1b5" stroke="none" />
    </>
  ),
  N: () => (
    <>
      <path d="M 5 10 L 5 50" />
      <path d="M 25 10 L 25 50" />
      <path d="M 5 10 L 25 50" />
      <path d="M 11 30 L 15 26 L 19 30 L 15 34 Z" strokeWidth="1.2" fill="#f5e1b5" />
    </>
  ),
  L: () => (
    <>
      <path d="M 5 10 L 5 50 L 25 50" />
      <path d="M 5 45 L 10 40 L 15 45 L 10 50 Z" strokeWidth="1.2" fill="#000000" />
    </>
  ),
  I: () => (
    <>
      <path d="M 15 10 L 15 50" />
      <path d="M 7 10 L 23 10" />
      <path d="M 7 50 L 23 50" />
      <path d="M 10 30 L 15 25 L 20 30 L 15 35 Z" strokeWidth="1.2" fill="#f5e1b5" />
    </>
  ),
  A: () => (
    <>
      <path d="M 5 50 L 15 10 L 25 50" />
      <path d="M 10 32 L 20 32" />
      <path d="M 11 32 L 15 28 L 19 32 L 15 36 Z" strokeWidth="1.2" fill="#f5e1b5" />
    </>
  ),
  C: () => (
    <>
      <path d="M 25 10 L 5 10 L 5 50 L 25 50" />
      <path d="M 5 30 L 10 25 L 15 30 L 10 35 Z" strokeWidth="1.2" fill="#f5e1b5" />
    </>
  ),
  U: () => (
    <>
      <path d="M 5 10 L 5 50 L 25 50 L 25 10" />
      <path d="M 11 50 L 15 46 L 19 50 L 15 54 Z" strokeWidth="1.2" fill="#f5e1b5" />
    </>
  ),
  R: () => (
    <>
      <path d="M 5 10 L 5 50" />
      <path d="M 5 10 L 25 22 L 5 34" />
      <path d="M 12 30 L 25 50" />
      <path d="M 9 22 L 14 17 L 19 22 L 14 27 Z" strokeWidth="1.2" fill="#000000" />
      <circle cx="14" cy="22" r="1" fill="#f5e1b5" stroke="none" />
    </>
  ),
  V: () => (
    <>
      <path d="M 5 10 L 15 50 L 25 10" />
      <path d="M 11 50 L 15 46 L 19 50 L 15 54 Z" strokeWidth="1.2" fill="#f5e1b5" />
    </>
  ),
  D: () => (
    <>
      <path d="M 5 10 L 5 50" />
      <path d="M 5 10 L 25 30 L 5 50" />
      <path d="M 9 30 L 14 25 L 19 30 L 14 35 Z" strokeWidth="1.2" fill="#000000" />
      <circle cx="14" cy="30" r="1" fill="#f5e1b5" stroke="none" />
    </>
  ),
  K: () => (
    <>
      <path d="M 5 10 L 5 50" />
      <path d="M 25 10 L 5 30" />
      <path d="M 5 30 L 25 50" />
      <path d="M 11 30 L 15 26 L 19 30 L 15 34 Z" strokeWidth="1.2" fill="#f5e1b5" />
    </>
  )
};

export default function DrifterGlitchLoader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let current = 0;
    let active = true;

    const startProgress = () => {
      const interval = setInterval(() => {
        if (!active) return;

        // Smooth incremental loading steps
        const step = Math.random() > 0.85 ? Math.floor(Math.random() * 7) + 3 : Math.floor(Math.random() * 3) + 1;
        current = Math.min(current + step, 100);
        setProgress(current);

        if (current >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (active) {
              current = 0;
              setProgress(0);
              startProgress();
            }
          }, 4500); // Hold complete state before restart
        }
      }, 110);
    };

    startProgress();

    return () => {
      active = false;
    };
  }, []);

  // Perimeter for the clockwise drawing progress border (M 60 5 L 115 60 L 60 115 L 5 60 Z)
  // Perimeter side length is sqrt(55^2 + 55^2) = ~77.78px. Total = 77.78 * 4 = 311.12px
  const pathLength = 311.12;
  const strokeOffset = pathLength - (progress / 100) * pathLength;

  // Configuration for the pixel extrusion column effects behind the diamond
  const leftExtrusionBars = [
    { x: '18%', width: '8px', baseHeight: 140, delay: 0, color: 'from-[#ff2a85] via-[#ff2a85]/40 to-transparent' },
    { x: '24%', width: '12px', baseHeight: 90, delay: 0.5, color: 'from-[#ff2a85] via-[#ff2a85]/30 to-transparent' },
    { x: '28%', width: '6px', baseHeight: 160, delay: 0.2, color: 'from-[#ff2a85] via-[#ff2a85]/40 to-transparent' },
    { x: '35%', width: '14px', baseHeight: 80, delay: 0.8, color: 'from-[#ff2a85] via-[#ff2a85]/20 to-transparent' },
    { x: '42%', width: '10px', baseHeight: 110, delay: 0.3, color: 'from-[#ff2a85] via-[#ff2a85]/35 to-transparent' }
  ];

  const rightExtrusionBars = [
    { x: '58%', width: '12px', baseHeight: 100, delay: 0.4, color: 'from-[#00f0ff] via-[#00f0ff]/35 to-transparent' },
    { x: '65%', width: '6px', baseHeight: 150, delay: 0.1, color: 'from-[#00f0ff] via-[#00f0ff]/40 to-transparent' },
    { x: '72%', width: '14px', baseHeight: 80, delay: 0.7, color: 'from-[#00f0ff] via-[#00f0ff]/20 to-transparent' },
    { x: '78%', width: '10px', baseHeight: 120, delay: 0.2, color: 'from-[#00f0ff] via-[#00f0ff]/30 to-transparent' },
    { x: '84%', width: '8px', baseHeight: 135, delay: 0.6, color: 'from-[#00f0ff] via-[#00f0ff]/40 to-transparent' }
  ];

  // Dynamic interchanged big runic word in the center (Original requested combination)
  const getCenterRunicWord = () => {
    if (progress < 25) return 'SYSTEM';
    if (progress < 55) return 'ONLINE';
    if (progress < 85) return 'ACTIVE';
    return 'SECURE';
  };

  // Render centered list of runic vector characters
  const renderRunicText = (word: string) => {
    const chars = word.split('');
    const N = chars.length;
    const charWidth = 30;
    const spacing = 10;
    const totalWidth = N * charWidth + (N - 1) * spacing;
    const xStart = (320 - totalWidth) / 2;

    return chars.map((char, idx) => {
      const RenderFn = RUNIC_PATHS[char];
      if (!RenderFn) return null;
      const xOffset = xStart + idx * (charWidth + spacing);
      return (
        <g key={idx} transform={`translate(${xOffset}, 0)`}>
          <RenderFn />
        </g>
      );
    });
  };

  return (
    <div className="relative w-full max-w-lg flex flex-col items-center justify-center p-6 sm:p-10 bg-[#000000] border-2 border-[#161a22]/30 rounded-xl shadow-[0_20px_60px_rgba(0,0,0,0.95)] select-none overflow-hidden h-[480px]">
      
      {/* 1. CONSTANT RGB NEON GLOW FROM BEHIND */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-20 overflow-visible">
        <motion.div
          animate={{
            scale: [0.95, 1.05, 0.95],
            opacity: [0.75, 0.9, 0.75]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-72 h-72 bg-[radial-gradient(circle,rgba(255,42,133,0.18)_0%,rgba(0,240,255,0.12)_45%,rgba(245,225,181,0.06)_70%,transparent_100%)] blur-3xl opacity-150"
        />
      </div>

      {/* 2. DYNAMIC PIXEL-ART VERTICAL COLUMNS (BACKGROUND CHROMATIC SHADERS) */}
      <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none -z-10 overflow-hidden">
        {/* Pink/Magenta Left-side Extrusions */}
        {leftExtrusionBars.map((bar, i) => (
          <motion.div
            key={`left-${i}`}
            animate={{
              height: [bar.baseHeight, bar.baseHeight + 35, bar.baseHeight - 20, bar.baseHeight],
              opacity: [0.45, 0.7, 0.35, 0.45]
            }}
            transition={{
              duration: 4.5,
              repeat: Infinity,
              delay: bar.delay,
              ease: 'easeInOut'
            }}
            className={`absolute bg-gradient-to-t ${bar.color} pointer-events-none bottom-[10%]`}
            style={{
              left: bar.x,
              width: bar.width,
              clipPath: 'inset(0px 0px 0px 0px)'
            }}
          />
        ))}

        {/* Cyan/Teal Right-side Extrusions */}
        {rightExtrusionBars.map((bar, i) => (
          <motion.div
            key={`right-${i}`}
            animate={{
              height: [bar.baseHeight, bar.baseHeight - 25, bar.baseHeight + 40, bar.baseHeight],
              opacity: [0.45, 0.75, 0.3, 0.45]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              delay: bar.delay,
              ease: 'easeInOut'
            }}
            className={`absolute bg-gradient-to-b ${bar.color} pointer-events-none top-[10%]`}
            style={{
              left: bar.x,
              width: bar.width,
              clipPath: 'inset(0px 0px 0px 0px)'
            }}
          />
        ))}
      </div>

      {/* 3. THE GIANT DOMINANT CORE DIAMOND */}
      <div className="relative w-80 h-80 flex flex-col items-center justify-center overflow-visible">
        
        {/* Outer glowing containment frames */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute w-[242px] h-[242px] rotate-45 border border-[#ff2a85]/20 shadow-[0_0_15px_rgba(255,42,133,0.1)] pointer-events-none" />
          <div className="absolute w-[236px] h-[236px] rotate-45 border border-[#00f0ff]/15 shadow-[0_0_12px_rgba(0,240,255,0.08)] pointer-events-none" />
        </div>

        {/* SVG layer for drawing borders and background grids */}
        <svg
          viewBox="0 0 120 120"
          className="absolute inset-0 w-full h-full filter overflow-visible"
        >
          <defs>
            {/* The diagonal game-authentic linear gradient (magenta/pink to teal/cyan) */}
            <linearGradient id="drifterBorderGrad" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff2a85" />
              <stop offset="50%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#00f0ff" />
            </linearGradient>

            {/* High-quality glow filter */}
            <filter id="neonStrokeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Underlay constant-visible game diamond backdrop */}
          <path
            d="M 60 5 L 115 60 L 60 115 L 5 60 Z"
            fill="#010204"
            fillOpacity="0.85"
            stroke="rgba(255,255,255,0.01)"
            strokeWidth="1"
          />

          {/* CONSTANT VISIBLE GLOWING DIAMOND BORDERS */}
          <path
            d="M 60 5 L 115 60 L 60 115 L 5 60 Z"
            fill="none"
            stroke="url(#drifterBorderGrad)"
            strokeWidth="1.5"
            strokeOpacity="0.4"
          />

          {/* BUTTER-SMOOTH PROGRESS BORDER: Interpolates clockwise sweeps using Framer Motion */}
          <motion.path
            d="M 60 5 L 115 60 L 60 115 L 5 60 Z"
            fill="none"
            stroke="url(#drifterBorderGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#neonStrokeGlow)"
            strokeDasharray={pathLength}
            animate={{ strokeDashoffset: strokeOffset }}
            transition={{ ease: 'easeInOut', duration: 0.15 }}
          />
        </svg>

        {/* 4. HIGH-FIDELITY DYNAMIC VECTOR RUNIC TEXT (OVERLAYED MAJESTICALLY TO PREVENT CONTAINER CLIPPING) */}
        <div className="absolute inset-0 flex flex-col items-center justify-center font-mono pointer-events-none z-10 select-none overflow-visible">
          <div className="w-full flex flex-col items-center justify-center py-2 relative overflow-visible">
            
            {/* WELCOME - Shorter, Sleeker Top Pixel Font */}
            <span 
              className="text-[9px] text-[#e3d0ab] tracking-[0.45em] pl-[0.45em] mb-4 uppercase drop-shadow-[0_0_3px_rgba(227,208,171,0.2)]"
              style={{ fontFamily: '"Silkscreen", "Press Start 2P", monospace' }}
            >
              WELCOME
            </span>

            {/* DYNAMIC INTERCHANGING VECTOR RUNIC TEXT (Sleek waits-mode animation during character swaps) */}
            <svg
              viewBox="0 0 320 60"
              className="w-[240px] h-[46px] filter drop-shadow-[0_0_10px_rgba(245,225,181,0.4)] overflow-visible"
            >
              <AnimatePresence mode="wait">
                <motion.g 
                  key={getCenterRunicWord()}
                  initial={{ opacity: 0, scaleY: 0.1, filter: 'blur(5px)' }}
                  animate={{ opacity: 1, scaleY: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scaleY: 0.1, filter: 'blur(5px)' }}
                  transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                  stroke="#f5e1b5" 
                  strokeWidth="3.2" 
                  strokeLinecap="miter" 
                  strokeLinejoin="miter" 
                  fill="none"
                >
                  {renderRunicText(getCenterRunicWord())}
                </motion.g>
              </AnimatePresence>
            </svg>

            {/* DIAGNOSTICS - Shorter, Sleeker Bottom Pixel Font */}
            <span 
              className="text-[9px] text-[#e3d0ab] tracking-[0.45em] pl-[0.45em] mt-4 uppercase drop-shadow-[0_0_3px_rgba(227,208,171,0.2)]"
              style={{ fontFamily: '"Silkscreen", "Press Start 2P", monospace' }}
            >
              DIAGNOSTICS
            </span>

            {/* CONSTANT LOADING PROGRESS TEXT */}
            <span 
              className="text-[8px] text-[#ff2a85] tracking-[0.3em] pl-[0.3em] mt-3 font-bold uppercase"
              style={{ fontFamily: '"Silkscreen", "Press Start 2P", monospace' }}
            >
              LOADING // {progress}%
            </span>

          </div>
        </div>

      </div>

    </div>
  );
}
