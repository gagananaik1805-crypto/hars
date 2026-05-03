import React from 'react';
import { motion } from 'motion/react';
import { Heart, Activity, Plus } from 'lucide-react';

export default function PremiumBackground() {
  return (
    <div className="premium-bg">
      {/* Background Glows */}
      <motion.div 
        className="bg-glow w-[600px] h-[600px] bg-blue-600/20 -top-40 -left-40"
        animate={{ 
          opacity: [0.2, 0.4, 0.2],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 12, repeat: Infinity }}
      />
      <motion.div 
        className="bg-glow w-[500px] h-[500px] bg-teal-500/20 bottom-0 right-0"
        animate={{ 
          opacity: [0.1, 0.3, 0.1],
          x: [0, -50, 0]
        }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      
      {/* ECG Line Pattern */}
      <div className="ecg-overlay" />

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px]" />

      {/* Subtle Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ y: [0, -20, 0], opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-[20%] right-[10%]"
        >
          <Activity className="w-16 h-16 text-teal-400 rotate-12" />
        </motion.div>
        
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.03, 0.08, 0.03] }}
          transition={{ duration: 10, repeat: Infinity, delay: 2 }}
          className="absolute bottom-[30%] left-[5%]"
        >
          <Heart className="w-12 h-12 text-blue-400 -rotate-12" />
        </motion.div>

        <motion.div 
          animate={{ x: [0, 20, 0], opacity: [0.04, 0.09, 0.04] }}
          transition={{ duration: 12, repeat: Infinity, delay: 1 }}
          className="absolute top-[40%] left-[15%]"
        >
          <Plus className="w-14 h-14 text-white rotate-45" />
        </motion.div>
      </div>
    </div>
  );
}
