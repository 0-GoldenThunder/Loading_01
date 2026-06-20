import { motion } from 'framer-motion';

const CyberLoader = () => {
  return (
    <div className="relative flex items-center justify-center w-40 h-40">
      {/* Outer Glow */}
      <div className="absolute inset-0 bg-cyan-500/20 blur-[30px] rounded-full" />
      
      {/* Ring 1 - Outer */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 border-2 border-transparent border-t-cyan-400 border-b-cyan-400 rounded-full opacity-70"
        style={{ filter: 'drop-shadow(0 0 8px #22d3ee)' }}
      />
      
      {/* Ring 2 - Middle */}
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute inset-4 border-2 border-transparent border-l-fuchsia-500 border-r-fuchsia-500 rounded-full opacity-80"
        style={{ filter: 'drop-shadow(0 0 10px #d946ef)' }}
      />
      
      {/* Ring 3 - Inner */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute inset-8 border-2 border-dashed border-cyan-300 rounded-full opacity-60"
      />

      {/* Center Core */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-8 h-8 bg-white rounded-full shadow-[0_0_20px_#fff,0_0_40px_#22d3ee]"
      >
        <div className="absolute inset-1 bg-cyan-200 rounded-full blur-[2px]" />
      </motion.div>

      {/* Scanning Line */}
      <motion.div
        animate={{ y: ['-200%', '200%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="absolute w-full h-[2px] bg-cyan-300/50 blur-[1px] shadow-[0_0_10px_#22d3ee]"
      />
      
      {/* Percentage Text */}
      <div className="absolute -bottom-10 font-mono text-cyan-400 text-xs tracking-[0.3em] font-bold drop-shadow-[0_0_5px_#22d3ee]">
        SYSTEM.INIT()
      </div>
    </div>
  );
};

export default CyberLoader;
