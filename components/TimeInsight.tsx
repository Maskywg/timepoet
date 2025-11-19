import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTimeInsight } from '../services/geminiService';
import { InsightResponse } from '../types';

const TimeInsight: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<InsightResponse | null>(null);

  const handleGenerate = async () => {
    if (loading) return;

    setLoading(true);
    // Reset data to null to trigger exit animation of old data and enter animation of loading
    setData(null);
    
    try {
      const result = await getTimeInsight(new Date());
      setData(result);
    } catch (e) {
      // Should strictly not happen due to service fallback, but just in case
      console.error("Critical failure:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 w-full max-w-2xl mx-auto px-4">
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-md shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 p-3 opacity-5 pointer-events-none">
          <Sparkles size={120} />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6 relative z-10">
          <div className="flex items-center gap-2 text-indigo-300">
            <Sparkles size={18} className="text-purple-400" />
            <span className="text-sm font-medium uppercase tracking-wider font-space">Gemini 時間詩人</span>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 transition-all disabled:opacity-50 active:scale-95 border border-white/5 cursor-pointer z-20"
            title="生成新見解"
          >
            <span className="text-xs font-medium text-indigo-100 group-hover:text-white">
              {loading ? "詠唱中..." : "賦詩"}
            </span>
            <RefreshCw 
              size={14} 
              className={`text-indigo-200 group-hover:text-white ${loading ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} 
            />
          </button>
        </div>

        {/* Content Area */}
        <div className="min-h-[100px] flex flex-col justify-center relative z-10">
          <AnimatePresence mode='wait'>
            
            {/* Initial State */}
            {!data && !loading && (
              <motion.div 
                key="initial"
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center h-full"
              >
                <p className="text-slate-400 italic text-sm font-light tracking-wide">
                  點擊按鈕，捕捉此刻的時光碎片...
                </p>
              </motion.div>
            )}

            {/* Loading State */}
            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center gap-3"
              >
                <div className="flex gap-1.5">
                    <motion.span 
                      className="w-1.5 h-1.5 bg-indigo-400 rounded-full"
                      animate={{ y: [-3, 3, -3] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.span 
                      className="w-1.5 h-1.5 bg-purple-400 rounded-full"
                      animate={{ y: [-3, 3, -3] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                    />
                    <motion.span 
                      className="w-1.5 h-1.5 bg-pink-400 rounded-full"
                      animate={{ y: [-3, 3, -3] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                    />
                </div>
                <p className="text-xs text-indigo-300/80 tracking-widest uppercase font-space animate-pulse">
                  Reading The Stars...
                </p>
              </motion.div>
            )}

            {/* Data State */}
            {data && !loading && (
              <motion.div
                key="content"
                initial={{ opacity: 0, scale: 0.95, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex flex-col items-center text-center"
              >
                <p className="text-lg md:text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-100 to-purple-100 mb-4 leading-relaxed drop-shadow-sm">
                  "{data.insight}"
                </p>
                
                <motion.div 
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                  <span className="text-xs text-purple-200 font-space tracking-widest uppercase">
                    {data.mood}
                  </span>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default TimeInsight;