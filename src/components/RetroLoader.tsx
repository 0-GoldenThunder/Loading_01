import { useEffect, useState } from 'react';
import type { Variants } from 'framer-motion';
import { motion, AnimatePresence } from 'framer-motion';

const TOTAL_BLOCKS = 20;

const STATUS_LABELS = [
  { threshold: 0,  label: 'SYSTEM BOOTING...' },
  { threshold: 15, label: 'INITIALIZING CORE...' },
  { threshold: 30, label: 'DOWNLOADING ASSETS...' },
  { threshold: 50, label: 'LOADING SHADERS...' },
  { threshold: 65, label: 'BUILDING WORLD MAP...' },
  { threshold: 80, label: 'SPAWNING ENTITIES...' },
  { threshold: 95, label: 'FINALIZING...' },
  { threshold: 100, label: 'READY.' },
];

function getStatusLabel(progress: number): string {
  let current = STATUS_LABELS[0].label;
  for (const s of STATUS_LABELS) {
    if (progress >= s.threshold) current = s.label;
  }
  return current;
}

// Staggered container for children to enter one-by-one
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12, filter: 'blur(4px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
};

const RetroLoader = () => {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let current = 0;
    let active = true;

    const startLoop = () => {
      const id = setInterval(() => {
        if (!active) return;
        // Chunky retro-style non-linear increments
        const step = Math.random() > 0.7 ? Math.floor(Math.random() * 8) + 4 : Math.floor(Math.random() * 3) + 1;
        current = Math.min(current + step, 100);
        setProgress(current);

        if (current >= 100) {
          clearInterval(id);
          setTimeout(() => {
            if (active) setIsComplete(true);
          }, 300);
          // Auto-reset for showcase
          setTimeout(() => {
            if (active) {
              current = 0;
              setProgress(0);
              setIsComplete(false);
              startLoop();
            }
          }, 4500);
        }
      }, 110);
    };

    startLoop();
    return () => { active = false; };
  }, []);

  const filledBlocks = Math.round((progress / 100) * TOTAL_BLOCKS);
  const statusLabel = getStatusLabel(progress);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={mounted ? "visible" : "hidden"}
      className="flex flex-col items-center justify-center w-full min-h-[350px] py-4 font-mono select-none px-8"
    >
      {/* Top decorative scanline bar */}
      <motion.div variants={itemVariants} className="w-full max-w-sm mb-6 flex items-center gap-3">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
        <span className="text-[9px] tracking-[0.3em] text-cyan-600 uppercase">SYS_LOAD</span>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      </motion.div>

      {/* Main percentage counter */}
      <motion.div variants={itemVariants} className="relative mb-5 text-center">
        {/* Glow layer */}
        <span
          className="absolute inset-0 text-7xl font-black text-cyan-400 opacity-30 blur-lg pointer-events-none"
          aria-hidden
        >
          {String(progress)}
        </span>
        <span className="relative text-7xl font-black text-cyan-300 drop-shadow-[0_0_12px_rgba(34,211,238,0.8)] tracking-tighter">
          {String(progress)}
        </span>
        <span className="relative text-2xl text-cyan-500 ml-1 font-bold">%</span>
      </motion.div>

      {/* Block-based progress bar */}
      <motion.div variants={itemVariants} className="flex gap-[3px] mb-3 w-full max-w-sm">
        {Array.from({ length: TOTAL_BLOCKS }).map((_, i) => {
          const filled = i < filledBlocks;
          const isEdge = i === filledBlocks - 1;
          return (
            <motion.div
              key={i}
              className="flex-1 h-5 relative"
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: i * 0.04, duration: 0.2, ease: 'easeOut' }}
            >
              <motion.div
                className="w-full h-full"
                animate={{
                  backgroundColor: filled
                    ? isEdge
                      ? ['#06b6d4', '#67e8f9', '#06b6d4']
                      : '#0e7490'
                    : '#0d1117',
                  boxShadow: filled && isEdge
                    ? ['0 0 8px #22d3ee', '0 0 16px #67e8f9', '0 0 8px #22d3ee']
                    : filled
                    ? '0 0 4px #0e7490'
                    : 'none',
                }}
                transition={
                  isEdge
                    ? { duration: 0.8, repeat: Infinity, ease: 'easeInOut' }
                    : { duration: 0.2 }
                }
                style={{ border: '1px solid', borderColor: filled ? '#0e7490' : '#1a2a3a' }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Block count indicator */}
      <motion.div variants={itemVariants} className="flex justify-between w-full max-w-sm mb-5 text-[9px] text-cyan-800 tracking-widest">
        <span>|0</span>
        <span className="text-cyan-700">{filledBlocks}/{TOTAL_BLOCKS}</span>
        <span>100|</span>
      </motion.div>

      {/* Cycling status label */}
      <motion.div variants={itemVariants} className="h-5 mb-6 relative overflow-hidden w-full max-w-sm text-center">
        <AnimatePresence mode="wait">
          <motion.span
            key={statusLabel}
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute inset-0 flex items-center justify-center text-[11px] tracking-[0.25em] text-cyan-500/80 uppercase"
          >
            {`> ${statusLabel}`}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {/* Press Start button — only on completion */}
      <AnimatePresence>
        {isComplete && (
          <motion.button
            key="press-start"
            initial={{ opacity: 0, scale: 0.85, filter: 'blur(6px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ type: 'spring', stiffness: 200, damping: 18 }}
            whileHover={{
              scale: 1.05,
              textShadow: '0 0 20px #22d3ee, 0 0 40px #22d3ee',
              boxShadow: '0 0 16px #22d3ee, inset 0 0 12px rgba(34,211,238,0.15)',
            }}
            whileTap={{ scale: 0.96 }}
            className="px-10 py-3 border border-cyan-500 text-cyan-300 text-[11px] tracking-[0.4em] uppercase
                       bg-transparent cursor-pointer relative overflow-hidden"
            style={{ fontFamily: 'monospace' }}
          >
            {/* Animated scan highlight on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent -skew-x-12"
              animate={{ x: ['-150%', '150%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
            />
            <motion.span
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              className="relative z-10"
            >
              ▶ PRESS START
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Bottom decorative scanline bar */}
      <motion.div variants={itemVariants} className="w-full max-w-sm mt-6 flex items-center gap-3">
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
        <span className="text-[9px] tracking-[0.3em] text-cyan-800 uppercase">v2.4.1</span>
        <div className="flex-1 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      </motion.div>
    </motion.div>
  );
};

export default RetroLoader;
