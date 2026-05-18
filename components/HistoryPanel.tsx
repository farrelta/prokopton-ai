'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Trash2, X } from 'lucide-react';
import { ReflectionResponse, PhilosophyMode } from '@/lib/gemini';

interface HistoryItem {
  id: string;
  timestamp: string;
  input: string;
  mode: PhilosophyMode;
  result: ReflectionResponse;
}

interface HistoryPanelProps {
  hideToggle?: boolean;
  onSelect?: (text: string) => void;
}

export default function HistoryPanel({ hideToggle, onSelect }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('prokopton_history');
    if (saved) {
      const data = JSON.parse(saved);
      // Small delay to avoid synchronous state update in effect
      const timer = setTimeout(() => setHistory(data), 0);
      return () => clearTimeout(timer);
    }
  }, [isOpen]); // Refresh when opened

  const clearHistory = () => {
    localStorage.removeItem('prokopton_history');
    setHistory([]);
  };

  const handleItemClick = (text: string) => {
    if (onSelect) {
      onSelect(text);
      setIsOpen(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {!hideToggle && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 left-8 z-50 p-4 rounded-full glass border border-stone-200 hover:bg-stone-900 hover:text-white transition-all shadow-lg text-forest"
          >
            <Clock className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-y-0 left-0 w-full max-w-md bg-forest shadow-2xl z-[60] border-r border-white/5 overflow-y-auto"
          >
            <div className="p-8 space-y-8">
              <div className="flex justify-between items-center text-white">
                <div className="space-y-1">
                  <h3 className="text-2xl font-serif font-bold tracking-tight">Your Chronicles</h3>
                  <p className="text-sage font-cormorant text-sm uppercase tracking-widest font-bold">Past Reflections</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/5 rounded-full transition-colors glass">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {history.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="w-16 h-16 bg-white/5 glass rounded-full flex items-center justify-center mx-auto text-sage">
                    <Clock className="w-8 h-8" />
                  </div>
                  <p className="text-sage font-cormorant text-lg italic">No echoes from the past yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {history.map((item) => (
                    <div 
                      key={item.id} 
                      onClick={() => handleItemClick(item.input)}
                      className="p-6 rounded-3xl glass border border-white/10 space-y-3 hover:bg-white/[0.12] hover:border-beige/30 transition-all cursor-pointer group"
                    >
                      <div className="flex justify-between items-start text-sage">
                        <span className="text-[10px] uppercase tracking-widest font-black group-hover:text-beige transition-colors">{item.mode}</span>
                        <span className="text-[10px] font-mono opacity-40">{new Date(item.timestamp).toLocaleDateString()}</span>
                      </div>
                      <p className="text-white/80 line-clamp-2 text-sm font-cormorant italic pr-4 group-hover:text-white transition-colors">&ldquo;{item.input}&rdquo;</p>
                      <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="text-[8px] font-bold text-beige uppercase tracking-[0.2em]">Load to Reflect</span>
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={clearHistory}
                    className="w-full py-4 border-t border-white/5 mt-8 text-[10px] uppercase tracking-widest font-black text-sage hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Dissolve History
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
