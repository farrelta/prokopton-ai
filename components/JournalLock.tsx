'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Shield, ShieldCheck, X, Fingerprint } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

export interface LockState {
  enabled: boolean;
  isLocked: boolean;
  pin?: string;
}

export default function JournalProtection({ onUnlock }: { onUnlock: () => void }) {
  const { t } = useLanguage();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    // Disable body scroll when locked
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const validatePin = (currentPin: string) => {
    const storedPin = localStorage.getItem('prokopton_journal_pin');
    if (currentPin === storedPin) {
      onUnlock();
    } else {
      setError(true);
      setPin('');
      setTimeout(() => setError(false), 2000);
    }
  };

  const handleNumberClick = (n: number | string) => {
    if (pin.length < 4) {
      const nextPin = pin + n;
      setPin(nextPin);
      if (nextPin.length === 4) {
        validatePin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-forest/40 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-[260px] glass p-5 rounded-[28px] border border-white/10 shadow-2xl text-center space-y-3"
      >
        <div className="flex flex-col items-center gap-1.5">
          <div className="w-10 h-10 bg-beige/10 rounded-lg flex items-center justify-center text-beige mb-0.5">
            <Lock className="w-5 h-5" />
          </div>
          <div className="space-y-0">
            <h2 className="serif text-base text-white italic">{t.common.lock.enterPin}</h2>
            <p className="text-sage/60 font-cormorant text-[11px] italic leading-tight">{t.common.lock.sub}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-center gap-2.5">
            {[0, 1, 2, 3].map((i) => (
              <div 
                key={i}
                className={`w-1.5 h-1.5 rounded-full border-2 transition-all duration-300 ${
                  pin.length > i ? 'bg-beige border-beige' : 'border-white/10'
                } ${error ? 'bg-red-500 border-red-500 animate-shake' : ''}`}
              />
            ))}
          </div>

          <div className="grid grid-cols-3 gap-2 mx-auto">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
              <button
                key={n}
                onClick={() => handleNumberClick(n)}
                className="w-full aspect-square rounded-lg bg-white/5 border border-white/5 text-white text-sm font-serif hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center shadow-sm"
              >
                {n}
              </button>
            ))}
            <div />
            <button
              onClick={() => handleNumberClick(0)}
              className="w-full aspect-square rounded-lg bg-white/5 border border-white/5 text-white text-sm font-serif hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center shadow-sm"
            >
              0
            </button>
            <button
              onClick={handleDelete}
              className="w-full aspect-square rounded-lg bg-white/5 border border-white/5 text-white text-sm font-serif hover:bg-white/10 transition-all active:scale-95 flex items-center justify-center shadow-sm"
            >
              <X className="w-3.5 h-3.5 opacity-40 hover:opacity-100" />
            </button>
          </div>
        </div>

        <div className="pt-2 border-t border-white/5">
           <p className="text-sage/20 text-[6px] uppercase tracking-[0.3em] font-bold">
              Secure Reflection Boundary
           </p>
        </div>
      </motion.div>
    </div>
  );
}
