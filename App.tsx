import React, { useState, useEffect } from 'react';
import { TimeState } from './types';
import AnalogClock from './components/AnalogClock';
import Calendar from './components/Calendar';
import TimeInsight from './components/TimeInsight';

const App: React.FC = () => {
  const [timeState, setTimeState] = useState<TimeState>({
    hours: 0,
    minutes: 0,
    seconds: 0,
    ampm: 'AM',
    date: new Date()
  });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'

      setTimeState({
        hours,
        minutes: now.getMinutes(),
        seconds: now.getSeconds(),
        ampm,
        date: now
      });
    };

    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen bg-[#0f172a] relative text-white flex flex-col items-center py-10 px-4 overflow-hidden">
      
      {/* Ambient Background Effects */}
      <div className="fixed top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed top-[40%] left-[40%] transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="z-10 text-center mb-10">
        <h1 className="text-4xl md:text-6xl font-bold font-space bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-indigo-200 tracking-tight drop-shadow-lg">
          Cosmic Chronos
        </h1>
        <p className="text-slate-400 mt-2 tracking-widest uppercase text-sm">
          Integrated Temporal System
        </p>
      </header>

      {/* Main Content Grid */}
      <main className="z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20">
        
        {/* Clock Section */}
        <div className="flex flex-col items-center">
          <div className="relative group">
             {/* Glow effect on hover */}
            <div className="absolute inset-0 bg-purple-500 rounded-full blur-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-700"></div>
            <AnalogClock time={timeState} />
          </div>
        </div>

        {/* Calendar Section */}
        <div className="flex flex-col items-center">
          <Calendar currentDate={timeState.date} />
        </div>

      </main>

      {/* AI Insight Section - Full width below */}
      <footer className="z-10 w-full mt-12">
        <TimeInsight />
      </footer>

      {/* Footer Credits */}
      <div className="mt-16 text-slate-600 text-xs font-space tracking-wider z-10">
        POWERED BY GOOGLE GEMINI
      </div>

    </div>
  );
};

export default App;