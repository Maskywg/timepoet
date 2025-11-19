import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getTimeInsight } from '../services/geminiService';
import { InsightResponse } from '../types';

const TimeInsight: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<InsightResponse | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const result = await getTimeInsight(new Date());
      setData(result);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 w-full max-w-2xl mx-auto">
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-2xl p-6 backdrop-blur-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Sparkles size={80} />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-indigo-300">
            <Sparkles size={18} />
            <span className="text-sm font-medium uppercase tracking-wider">Gemini 時間詩人</span>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={loading}
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-all disabled:opacity-50 active:scale-95"
            title="生成新見解"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        <div className="min-h-[80px] flex flex-col justify-center">
          <AnimatePresence mode='wait'>
            {!data && !loading && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-slate-400 text-center italic text-sm"
              >
                點擊刷新以探索此刻的本質...
              </motion.div>
            )}

            {loading && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex justify-center items-center gap-2"
              >
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </motion.div>
            )}

            {data && !loading && (
              <motion.div
                key="content"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-center"
              >
                <p className="text-xl md:text-2xl font-serif italic text-white mb-3 leading-relaxed">
                  "{data.insight}"
                </p>
                <div className="inline-block px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-purple-200 uppercase tracking-widest">
                  心情: {data.mood}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default TimeInsight;