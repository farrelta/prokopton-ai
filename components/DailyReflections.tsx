'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sun, Wind, Moon, Coffee, Sparkles, CheckCircle2, Calendar, Mic } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import VoiceInput from './VoiceInput';

interface DailyReflectionsProps {
  onReflect?: (text: string, title?: string) => void;
}

import { saveToJournal } from '@/lib/journal';
import { getDailyTheme } from '@/lib/wisdomDatabase';

export default function DailyReflections({ onReflect }: DailyReflectionsProps) {
  const { t, language } = useLanguage();
  const [loggedDates, setLoggedDates] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);
  const [apiTheme, setApiTheme] = useState<any>(null);
  const [today, setToday] = useState(() => new Date());
  
  const [reflectionInput, setReflectionInput] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timer = setTimeout(() => {
      setToday(new Date());
    }, msUntilMidnight + 100);
    
    return () => clearTimeout(timer);
  }, [today]);

  // Calculate deterministic values for the current day
  const themeIndex = today.getDate() % t.themes.length;
  const locale = language === 'id' ? 'id-ID' : 'en-US';
  const dateStr = today.toLocaleDateString(locale, { month: 'long', day: 'numeric', year: 'numeric' });

  useEffect(() => {
    setMounted(true); // eslint-disable-line react-hooks/set-state-in-effect
    if (typeof window !== 'undefined') {
      let dates: string[] = [];
      const savedLogs = localStorage.getItem('reflection_history_dates');
      if (savedLogs) {
        try {
          const parsed = JSON.parse(savedLogs);
          if (Array.isArray(parsed)) {
            dates = parsed;
          }
        } catch (e) {
          console.error("Error parsing reflection history", e);
        }
      } else {
        const lastLogged = localStorage.getItem('last_reflection_log');
        if (lastLogged) {
          dates = [lastLogged];
        }
      }
      setLoggedDates(dates);

      // Sync to local storage if migration happened
      if (!localStorage.getItem('reflection_history_dates') && dates.length > 0) {
        localStorage.setItem('reflection_history_dates', JSON.stringify(dates));
      }
    }
  }, []);

  // const isLoggedToday = mounted ? loggedDates.includes(today.toDateString()) : false;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setApiTheme(getDailyTheme());
  }, [today]);

  if (!mounted) return null;

  const handleSaveReflection = () => {
    if (!reflectionInput.trim()) return;
    
    const todayStr = new Date().toDateString();
    if (!loggedDates.includes(todayStr)) {
      const newDates = [...loggedDates, todayStr];
      setLoggedDates(newDates);
      localStorage.setItem('reflection_history_dates', JSON.stringify(newDates));
      localStorage.setItem('last_reflection_log', todayStr); // Keep for compatibility
    }
    
    saveToJournal({
      title: "Daily Reflection",
      input: reflectionInput,
      result: {
        reflectionPrompt: theme.quote,
        entryTitle: "Daily Reflection"
      } as any
    });
    
    setReflectionInput('');
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleQuoteClick = () => {
    if (onReflect) {
      onReflect(theme.quote, "Daily Reflection");
    }
  };

  const theme = apiTheme || t.themes[themeIndex];

  // Calendar Helper
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysCount = getDaysInMonth(currentYear, currentMonth);
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sunday
  
  const loggedThisMonth = loggedDates.filter(dateStr => {
    const d = new Date(dateStr);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const consistencyPercentage = Math.round((loggedThisMonth.length / daysCount) * 100);
  
  const calendarDays = Array.from({ length: daysCount }, (_, i) => {
    const day = i + 1;
    const dateObj = new Date(currentYear, currentMonth, day);
    const dateKey = dateObj.toDateString();
    const isLogged = loggedDates.includes(dateKey);
    const isToday = day === today.getDate();
    return { day, isLogged, isToday };
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass p-6 lg:p-12 rounded-3xl lg:rounded-[48px] border border-white/10 relative overflow-hidden"
          >
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-beige/5 rounded-full blur-3xl -mr-32 -mt-32" />
            
            <header className="relative z-10 text-center mb-12">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-beige rounded-full flex items-center justify-center text-forest shadow-2xl">
                  <Sun className="w-8 h-8 animate-pulse" />
                </div>
              </div>
              <span className="text-[10px] font-bold text-sage uppercase tracking-[0.4em] mb-2 block">{t.common.dailyContemplation}</span>
              <span className="text-stone-500 text-[11px] font-mono">{dateStr}</span>
            </header>

            <div className="relative z-10 mb-16">
              <h2 className="serif text-3xl lg:text-5xl text-white text-center mb-8">{theme.title}</h2>
              <div 
                onClick={handleQuoteClick}
                className="bg-clay/20 p-6 lg:p-10 rounded-2xl lg:rounded-[32px] border border-clay/30 relative cursor-pointer hover:bg-clay/30 transition-all group/quote"
              >
                <Sparkles className="absolute -top-3 -left-3 w-8 h-8 text-beige opacity-50 group-hover/quote:scale-110 transition-transform" />
                <p className="serif text-xl lg:text-2xl text-beige italic leading-relaxed text-center mb-6">
                  &ldquo;{theme.quote}&rdquo;
                </p>
                <div className="text-center">
                  <span className="text-[10px] font-bold text-sage uppercase tracking-widest">— {theme.author}</span>
                </div>
                <div className="mt-6 flex justify-center opacity-100 lg:absolute lg:bottom-4 lg:right-8 lg:opacity-0 lg:group-hover/quote:opacity-40 transition-opacity items-center gap-2">
                  <Sparkles className="w-3 h-3 text-beige" />
                  <span className="text-[8px] font-bold text-beige uppercase tracking-[0.2em]">Reflect on this</span>
                </div>
              </div>
            </div>

            <div className="relative z-10 space-y-8">
              <h4 className="text-[10px] font-bold text-sage uppercase tracking-widest flex items-center gap-3">
                <div className="w-4 h-px bg-sage" />
                {t.common.todaysPractice}
                <div className="w-4 h-px bg-sage" />
              </h4>
              
              <div className="grid gap-4">
                {theme.contemplations?.map((step: string, i: number) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                  >
                    <span className="font-mono text-beige/50 text-xs mt-1">0{i + 1}</span>
                    <p className="text-sage leading-relaxed">{step}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="mt-16 relative z-10">
              <div className="bg-forest/50 p-6 rounded-3xl border border-white/5 shadow-inner relative group">
                <textarea
                  value={reflectionInput}
                  onChange={(e) => setReflectionInput(e.target.value)}
                  placeholder="Write your reflection based on today's wisdom..."
                  className="w-full bg-transparent text-sage placeholder-sage/30 resize-none outline-none min-h-[140px] mb-4 pr-16 pb-12"
                />
                <div className="absolute top-6 right-6">
                  <VoiceInput 
                    onTranscript={(text) => setReflectionInput(prev => prev + (prev.trim() ? " " : "") + text)}
                  />
                </div>
                <div className="flex justify-between items-center border-t border-white/5 pt-4">
                  <AnimatePresence>
                    {showSuccess ? (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-green-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Saved to Journal
                      </motion.div>
                    ) : (
                      <div />
                    )}
                  </AnimatePresence>
                  
                  <button
                    onClick={handleSaveReflection}
                    disabled={!reflectionInput.trim()}
                    className="px-6 py-3 rounded-full bg-beige text-forest font-bold text-[10px] uppercase tracking-widest hover:bg-white transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Entry
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Calendar / Side Stats */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 rounded-3xl border border-white/10 flex flex-col"
          >
            <h3 className="serif text-xl text-white mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-beige" />
              {t.common.journey}
            </h3>

            <div className="mb-4 flex justify-between items-center text-[10px] font-bold text-sage uppercase tracking-widest">
              <span>{today.toLocaleDateString(locale, { month: 'long', year: 'numeric' })}</span>
              <span className="text-beige">{loggedThisMonth.length} Days</span>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-8">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                <div key={i} className="text-center text-[10px] text-white/30 font-bold">{day}</div>
              ))}
              
              {/* Empty offsets for first day of month */}
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`offset-${i}`} />
              ))}

              {calendarDays.map((day) => (
                <div 
                  key={day.day}
                  className={`
                    aspect-square rounded-lg flex items-center justify-center text-[10px] font-mono transition-all
                    ${day.isLogged ? 'bg-beige text-forest font-bold scale-110 shadow-lg shadow-beige/20' : 'bg-white/5 text-sage/40'}
                    ${day.isToday && !day.isLogged ? 'border border-beige/50 text-beige' : ''}
                  `}
                >
                  {day.day}
                </div>
              ))}
            </div>

            <div className="mt-auto space-y-4 pt-6 border-t border-white/5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-bold text-sage uppercase tracking-widest">{t.common.consistency}</span>
                <span className="text-beige text-xs font-mono">{consistencyPercentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${consistencyPercentage}%` }}
                  className="h-full bg-beige"
                />
              </div>
            </div>
          </motion.div>

          <div className="glass p-6 rounded-3xl flex items-center gap-4">
            <Coffee className="w-5 h-5 text-sage" />
            <span className="text-[10px] font-bold text-sage uppercase tracking-widest">{t.common.morningIntention}</span>
          </div>
          <div className="glass p-6 rounded-3xl flex items-center gap-4">
            <Wind className="w-5 h-5 text-sage" />
            <span className="text-[10px] font-bold text-sage uppercase tracking-widest">{t.common.middayPause}</span>
          </div>
          <div className="glass p-6 rounded-3xl flex items-center gap-4">
            <Moon className="w-5 h-5 text-sage" />
            <span className="text-[10px] font-bold text-sage uppercase tracking-widest">{t.common.eveningReview}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
