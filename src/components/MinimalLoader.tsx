import { motion } from 'framer-motion';

const MinimalLoader = () => {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="relative w-24 h-24">
        {/* Background Track */}
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="2"
          />
          {/* Animated Progress */}
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ strokeDasharray: "0 300" }}
            animate={{ 
              strokeDasharray: ["0 300", "150 150", "289 300"],
              rotate: [0, 180, 360]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#fff" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#fff" stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Center Pulse */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-2 h-2 bg-white rounded-full blur-[1px]"
          />
        </div>
      </div>
      
      {/* Sleek Text */}
      <motion.div
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="text-[10px] uppercase tracking-[0.4em] text-gray-400 font-light"
      >
        Processing
      </motion.div>
    </div>
  );
};

export default MinimalLoader;
