'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  Flower2, 
  Heart, 
  Compass, 
  Cloud, 
  Users, 
  Scroll, 
  ArrowRight, 
  Sparkles,
  ChevronRight,
  X
} from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

const getIconForPhilosophy = (key: string) => {
  switch (key) {
    case 'stoicism': return Shield;
    case 'buddhism': return Flower2;
    case 'taoism': return Heart;
    case 'existentialism': return Compass;
    case 'minimalism': return Cloud;
    case 'humanistic_psychology': return Users;
    case 'confucianism': return Scroll;
    default: return Sparkles;
  }
};

export default function PhilosophyLearning({ onOpenChange }: { onOpenChange?: (open: boolean) => void }) {
  const { t } = useLanguage();
  const [selectedPhilosophy, setSelectedPhilosophy] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPhilosophy) {
      document.body.style.overflow = 'hidden';
      onOpenChange?.(true);
    } else {
      document.body.style.overflow = 'unset';
      onOpenChange?.(false);
    }
    return () => {
      document.body.style.overflow = 'unset';
      onOpenChange?.(false);
    };
  }, [selectedPhilosophy, onOpenChange]);

  const philosophies = (Object.keys(t.learning.philosophies) as (keyof typeof t.learning.philosophies)[]).map(key => ({
    key,
    ...t.learning.philosophies[key],
    icon: getIconForPhilosophy(key)
  }));

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 pb-32">
      <header className="mb-16 text-center max-w-2xl mx-auto">
        <span className="text-[10px] font-bold text-sage uppercase tracking-[0.3em] mb-4 block">
          {t.learning.practicalwisdom}
        </span>
        <h2 className="serif text-4xl lg:text-5xl text-beige mb-6">
          {t.learning.title}
        </h2>
        <p className="text-sage text-sm lg:text-base leading-relaxed">
          {t.learning.sub}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {philosophies.map((philosophy, i) => (
          <motion.div
            key={philosophy.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => setSelectedPhilosophy(philosophy.key)}
            className="group relative glass p-8 rounded-[40px] border border-white/5 hover:border-beige/30 transition-all cursor-pointer flex flex-col justify-between min-h-[320px] overflow-hidden"
          >
            <div>
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-beige/10 rounded-2xl flex items-center justify-center text-beige group-hover:bg-beige group-hover:text-forest transition-all duration-500">
                  <philosophy.icon className="w-6 h-6" />
                </div>
                <ArrowRight className="w-5 h-5 text-beige/20 group-hover:text-beige transition-all group-hover:translate-x-1" />
              </div>
              
              <h3 className="serif text-2xl text-white mb-4 transition-colors group-hover:text-beige">
                {philosophy.title}
              </h3>
              
              <p className="text-white/60 text-sm italic font-cormorant leading-relaxed mb-6">
                &ldquo;{philosophy.summary}&rdquo;
              </p>

              <div className="flex flex-wrap gap-2 mt-auto">
                {philosophy.focus.slice(0, 2).map((item: string, idx: number) => (
                  <span key={idx} className="text-[9px] uppercase tracking-widest font-bold px-3 py-1 rounded-full bg-white/5 text-sage/60 border border-white/5">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal - expanded view */}
      <AnimatePresence>
        {selectedPhilosophy && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-12 overflow-hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedPhilosophy(null)}
              className="absolute inset-0 bg-forest/90 backdrop-blur-md"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl glass p-8 sm:p-12 rounded-[50px] border border-white/10 shadow-2xl overflow-y-auto max-h-[80vh] scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            >
              <button 
                onClick={() => setSelectedPhilosophy(null)}
                className="absolute top-6 right-6 text-sage hover:text-white transition-colors z-20 bg-forest/20 p-2 rounded-full backdrop-blur-sm"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>

              {philosophies.filter(p => p.key === selectedPhilosophy).map(p => (
                <div key={p.key} className="space-y-8 sm:space-y-10 pt-4 sm:pt-0">
                  <div className="flex items-start sm:items-center gap-4 sm:gap-6 pr-8 sm:pr-0">
                    <div className="w-12 h-12 sm:w-16 sm:h-16 bg-beige rounded-2xl flex items-center justify-center text-forest shrink-0">
                      <p.icon className="w-6 h-6 sm:w-8 sm:h-8" />
                    </div>
                    <div>
                      <h2 className="serif text-3xl sm:text-4xl text-beige leading-tight">{p.title}</h2>
                      <p className="text-sage text-[10px] uppercase tracking-[0.2em] font-bold mt-1">Practical Philosophy</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <p className="text-white/90 text-xl sm:text-2xl italic font-cormorant leading-relaxed">
                      &ldquo;{p.summary}&rdquo;
                    </p>
                    
                    <p className="text-sage leading-relaxed text-base sm:text-lg font-cormorant">
                      {p.description}
                    </p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-8 sm:gap-12 pt-8 border-t border-white/5">
                    <div className="space-y-4">
                      <span className="text-[10px] font-bold text-sage/40 uppercase tracking-[0.2em]">Practices & Focus</span>
                      <ul className="space-y-3">
                        {p.focus.map((item: string, idx: number) => (
                          <li key={idx} className="flex items-center gap-3 text-white/80 text-sm">
                            <div className="w-1.5 h-1.5 rounded-full bg-beige/40" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-4">
                      <span className="text-[10px] font-bold text-sage/40 uppercase tracking-[0.2em]">How it helps</span>
                      <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                        <p className="text-sage/80 text-xs italic leading-relaxed">
                          Applying this perspective allows you to step back from emotional turbulence and find a grounded center of operation.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 sm:pt-8 flex justify-center">
                    <button 
                      onClick={() => setSelectedPhilosophy(null)}
                      className="group flex items-center gap-3 bg-beige text-forest px-8 py-3 sm:py-4 rounded-full font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl"
                    >
                      Understood
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
