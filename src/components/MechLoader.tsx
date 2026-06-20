import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MECH_STATUSES = [
  { threshold: 0, label: 'SYS_INIT: CORE BOOTING...' },
  { threshold: 15, label: 'CALIBRATING ACTUATORS...' },
  { threshold: 30, label: 'CHARGING CAPACITORS...' },
  { threshold: 50, label: 'SYNCHRONIZING UPLINK...' },
  { threshold: 70, label: 'POLARIZING SHIELDS...' },
  { threshold: 85, label: 'ENGAGING COCKPIT HUD...' },
  { threshold: 95, label: 'CALIBRATION COMPLETE.' },
  { threshold: 100, label: 'SYSTEM READY. ENGAGE COCKPIT.' }
];

const MechLoader = () => {
  const [progress, setProgress] = useState(0);
  const [activeStatus, setActiveStatus] = useState(MECH_STATUSES[0].label);
  const [subSystems, setSubSystems] = useState({
    engine: 'OFFLINE',
    shields: '0%',
    weapons: 'STANDBY',
    link: 'UNSTABLE'
  });

  useEffect(() => {
    let current = 0;
    let active = true;

    const startLoading = () => {
      const interval = setInterval(() => {
        if (!active) return;

        const step = Math.random() > 0.8 ? Math.floor(Math.random() * 15) + 5 : Math.floor(Math.random() * 4) + 1;
        current = Math.min(current + step, 100);
        setProgress(current);

        let statusText = MECH_STATUSES[0].label;
        for (const s of MECH_STATUSES) {
          if (current >= s.threshold) statusText = s.label;
        }
        setActiveStatus(statusText);

        setSubSystems({
          engine: current >= 15 ? 'ONLINE' : 'OFFLINE',
          shields: `${Math.min(Math.floor(current * 1.2), 100)}%`,
          weapons: current >= 45 ? 'ARMED' : current >= 30 ? 'CHARGING' : 'STANDBY',
          link: current >= 95 ? 'SECURED' : current >= 55 ? 'STABLE' : current >= 20 ? 'SYNCING' : 'UNSTABLE'
        });

        if (current >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            if (active) {
              current = 0;
              setProgress(0);
              startLoading();
            }
          }, 5000);
        }
      }, 100);
    };

    startLoading();
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="relative w-full max-w-xs flex flex-col items-center justify-center pt-5 pb-1 font-mono text-[#f59e0b] select-none scale-[0.95] sm:scale-100">
      
      {/* Decorative Outer Decals positioned relative to this max-w-xs container to prevent drifting */}
      <div className="absolute -top-1 left-2 text-[8px] text-[#f59e0b]/45 tracking-wider uppercase font-bold hidden min-[320px]:block">
        SYS.FEED // MK-VII
      </div>
      <div className="absolute -top-1 right-2 text-[8px] text-[#f59e0b]/45 tracking-wider flex items-center gap-1 hidden min-[320px]:block font-bold">
        <span className="w-1 h-1 rounded-full bg-[#f59e0b] animate-ping" />
        MONITOR: LIVE
      </div>

      {/* Compact Column Container (Fits matching tactical loader height) */}
      <div className="w-full flex flex-col items-center justify-center gap-2 sm:gap-3 z-10 mt-2">
        
        {/* Radar Sweep HUD Screen (Scaled down slightly for height proportion) */}
        <div className="relative w-22 h-22 sm:w-26 sm:h-26 border-2 border-[#f59e0b]/45 rounded-full flex items-center justify-center overflow-hidden bg-black/40 shadow-[0_0_15px_rgba(245,158,11,0.05)]">
          {/* Radar grids */}
          <div className="absolute inset-0 rounded-full border border-[#f59e0b]/20 scale-75" />
          <div className="absolute inset-0 rounded-full border border-[#f59e0b]/10 scale-50" />
          <div className="absolute inset-0 rounded-full border border-[#f59e0b]/5 scale-25" />
          
          {/* Radar crosslines */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-full h-[1px] bg-[#f59e0b]/25 absolute" />
            <div className="h-full w-[1px] bg-[#f59e0b]/25 absolute" />
          </div>

          {/* Sweeping radar glow */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-tr from-[#f59e0b]/25 via-transparent to-transparent origin-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
          />

          {/* Target points */}
          <div className="absolute top-4 left-6 w-1.5 h-1.5 border-t border-l border-[#f59e0b] animate-pulse" />
          <div className="absolute bottom-6 right-5 w-1.5 h-1.5 border-b border-r border-[#f59e0b] animate-pulse" />

          {/* Center target dot */}
          <motion.div 
            className="w-1 h-1 bg-[#f59e0b] rounded-full shadow-[0_0_6px_#f59e0b]"
            animate={{ scale: [1, 1.4, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          
          {/* Load Telemetry text */}
          <div className="absolute bottom-1.5 inset-x-0 text-center text-[8px] sm:text-[9px] bg-black/80 font-bold py-0.5 border-t border-b border-[#f59e0b]/25 uppercase tracking-wider text-[#f59e0b]/90">
            LOAD: {progress}%
          </div>
        </div>

        {/* Tactical Sub-Systems Diagnostics Panel */}
        <div className="w-full grid grid-cols-2 gap-1 text-[8px] sm:text-[9px] tracking-wider border-t border-b border-[#f59e0b]/25 py-1.5 bg-black/15 rounded-sm">
          <div className="flex justify-between px-2 border-r border-[#f59e0b]/15">
            <span className="text-[#f59e0b]/55">SYS.ENGINE:</span>
            <span className={subSystems.engine === 'ONLINE' ? 'font-bold text-[#f59e0b]' : 'text-[#f59e0b]/40'}>
              [{subSystems.engine}]
            </span>
          </div>
          <div className="flex justify-between px-2">
            <span className="text-[#f59e0b]/55">SYS.SHIELDS:</span>
            <span className="font-bold">{subSystems.shields}</span>
          </div>
          <div className="flex justify-between px-2 border-r border-[#f59e0b]/15">
            <span className="text-[#f59e0b]/55">SYS.WEAPONS:</span>
            <span className={subSystems.weapons === 'ARMED' ? 'font-bold text-red-500 animate-pulse' : 'font-bold text-[#f59e0b]/75'}>
              [{subSystems.weapons}]
            </span>
          </div>
          <div className="flex justify-between px-2">
            <span className="text-[#f59e0b]/55">SYS.NEURAL:</span>
            <span className={subSystems.link === 'SECURED' ? 'font-bold text-green-500' : 'font-bold'}>
              [{subSystems.link}]
            </span>
          </div>
        </div>

        {/* Linear Block Progress Grid */}
        <div className="w-full">
          <div className="flex justify-between text-[8px] text-[#f59e0b]/60 mb-0.5 tracking-widest font-bold">
            <span>CALIBRATION SEQUENCE</span>
            <span>{progress}%</span>
          </div>
          <div className="h-4 border border-[#f59e0b]/80 p-[2px] bg-black/30 flex gap-[2px] overflow-hidden rounded-sm">
            {Array.from({ length: 20 }).map((_, idx) => {
              const isFilled = idx < Math.round((progress / 100) * 20);
              return (
                <motion.div
                  key={idx}
                  className="h-full flex-1 rounded-2xs"
                  animate={{
                    backgroundColor: isFilled ? '#f59e0b' : 'transparent',
                    opacity: isFilled ? [0.8, 1, 0.8] : 0
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: idx * 0.05
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Scrolling Message ticker */}
        <div className="w-full h-7 flex items-center justify-center border border-[#f59e0b]/20 bg-[#f59e0b]/4 rounded-md text-center relative overflow-hidden px-2 shadow-[inset_0_0_8px_rgba(245,158,11,0.02)]">
          <AnimatePresence mode="wait">
            <motion.span
              key={activeStatus}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              className="text-[8px] sm:text-[9px] tracking-[0.15em] font-bold text-[#f59e0b] uppercase px-1"
            >
              {`> ${activeStatus}`}
            </motion.span>
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
};

export default MechLoader;
