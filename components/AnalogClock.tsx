import React from 'react';
import { motion } from 'framer-motion';
import { TimeState } from '../types';

interface AnalogClockProps {
  time: TimeState;
}

const AnalogClock: React.FC<AnalogClockProps> = ({ time }) => {
  // Calculate degrees
  const secondDegrees = (time.seconds / 60) * 360;
  const minuteDegrees = ((time.minutes + time.seconds / 60) / 60) * 360;
  const hourDegrees = ((time.hours % 12 + time.minutes / 60) / 12) * 360;

  return (
    <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center bg-slate-800/50 rounded-full shadow-[0_0_40px_rgba(124,58,237,0.2)] backdrop-blur-xl border border-white/10 [--marker-dist:110px] md:[--marker-dist:140px] [--num-dist:88px] md:[--num-dist:112px]">
      
      {/* Clock Numbers */}
      {[...Array(12)].map((_, i) => {
        const num = i + 1;
        const rotation = num * 30;
        return (
          <div
            key={`num-${num}`}
            className="absolute w-8 h-8 flex items-center justify-center text-purple-200/90 font-space font-bold text-xl md:text-2xl z-10"
            style={{
              transform: `rotate(${rotation}deg) translateY(calc(-1 * var(--num-dist))) rotate(-${rotation}deg)`
            }}
          >
            {num}
          </div>
        );
      })}

      {/* Clock Face Markers */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className={`absolute w-1 h-3 bg-white/30 rounded-full origin-bottom`}
          style={{
            transform: `rotate(${i * 30}deg) translateY(calc(-1 * var(--marker-dist)))`,
            height: i % 3 === 0 ? '12px' : '6px',
            width: i % 3 === 0 ? '3px' : '1px',
            opacity: i % 3 === 0 ? 0.8 : 0.4,
          }}
        />
      ))}

      {/* Center Point */}
      <div className="absolute w-3 h-3 bg-purple-400 rounded-full z-20 shadow-[0_0_10px_rgba(168,85,247,0.8)]" />

      {/* Hour Hand */}
      <motion.div
        className="absolute w-1.5 h-20 bg-gradient-to-t from-purple-500 to-pink-500 rounded-full origin-bottom z-10"
        style={{ bottom: '50%' }}
        animate={{ rotate: hourDegrees }}
        transition={{ ease: "linear", duration: 0 }}
      />

      {/* Minute Hand */}
      <motion.div
        className="absolute w-1 h-28 bg-slate-200 rounded-full origin-bottom z-10"
        style={{ bottom: '50%' }}
        animate={{ rotate: minuteDegrees }}
        transition={{ ease: "linear", duration: 0 }}
      />

      {/* Second Hand */}
      <motion.div
        className="absolute w-0.5 h-32 bg-red-400 rounded-full origin-bottom z-10"
        style={{ bottom: '50%' }}
        animate={{ rotate: secondDegrees }}
        transition={{ ease: "linear", duration: 0 }}
      />
      
      {/* Digital Time Overlay */}
      <div className="absolute -bottom-16 text-center">
        <h2 className="text-4xl font-space font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 to-pink-300 tracking-widest">
          {time.hours.toString().padStart(2, '0')}:{time.minutes.toString().padStart(2, '0')}
        </h2>
        <p className="text-sm text-slate-400 font-light tracking-widest uppercase">
          {time.ampm}
        </p>
      </div>
    </div>
  );
};

export default AnalogClock;