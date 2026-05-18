'use client';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Quote, CheckCircle2, ChevronLeft, Bookmark, BookmarkCheck, ChevronDown } from 'lucide-react';
import { ReflectionResponse, PhilosophyMode } from '@/lib/gemini';
import { useLanguage } from '@/lib/LanguageContext';
import { saveToJournal, getJournal } from '@/lib/journal';
import { useState, useEffect, useRef } from 'react';

interface ResultCardProps {
  input: string;
  mode: PhilosophyMode;
  result: ReflectionResponse;
  onBack: () => void;
  onContinue: (option: string) => void;
  onChangeLens?: (mode: PhilosophyMode) => void;
}

export default function ResultCard({ input, mode, result, onBack, onContinue, onChangeLens }: ResultCardProps) {
  const { t } = useLanguage();
  const [isSaved, setIsSaved] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check if current interaction is already in journal
    const journal = getJournal();
    const existing = journal.find(e => e.input === input && e.mode === mode);
    if (existing) setIsSaved(true); // eslint-disable-line react-hooks/set-state-in-effect
  }, [input, mode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSave = () => {
    if (isSaved) return;
    saveToJournal({ 
      title: result.entryTitle,
      input, 
      mode, 
      result 
    });
    setIsSaved(true);
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="max-w-3xl mx-auto space-y-8"
    >
      <div className="flex justify-between items-center mb-8 px-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sage hover:text-white transition-colors uppercase text-[10px] tracking-widest font-bold"
        >
          <ChevronLeft className="w-4 h-4" />
          {t.common.backToReflection}
        </button>
        <div className="flex items-center gap-4">
          <button
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-full border transition-all text-[10px] uppercase tracking-widest font-bold shadow-lg ${
              isSaved 
                ? 'bg-beige/10 border-beige text-beige pointer-events-none' 
                : 'bg-beige border-beige text-forest hover:bg-white hover:border-white'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />}
            {isSaved ? t.common.journalSaved : t.common.saveToJournal}
          </button>
          <div className="hidden md:flex items-center gap-2 text-sage/60">
            <Sparkles className="w-4 h-4" />
            <span className="uppercase text-[10px] tracking-widest font-bold text-white/50">{t.common.aiActive}</span>
          </div>
        </div>
      </div>

      <div className="reflection-card p-6 lg:p-14 flex flex-col bg-beige text-dark rounded-3xl lg:rounded-[48px] shadow-2xl relative overflow-hidden">
        {/* Acknowledgment Header */}
        <div className="mb-12 text-center lg:text-left border-b border-forest/5 pb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4 justify-center lg:justify-start">
            <span className="px-3 py-1 bg-forest/10 text-forest rounded-full text-[10px] font-bold uppercase tracking-widest hidden lg:inline-block">
              Prokopton
            </span>
            
            <div className="relative group inline-block" ref={dropdownRef}>
              <div
                title="Select Philosophy Lens"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-between gap-4 border border-forest/30 text-xs lg:text-[10px] font-bold uppercase tracking-widest px-5 py-3.5 lg:px-4 lg:py-2 min-h-[48px] lg:min-h-0 min-w-[220px] lg:min-w-0 rounded-2xl cursor-pointer outline-none focus:ring-2 focus:ring-forest/20 text-white shadow-md hover:brightness-105 active:scale-95 transition-all"
                style={{ backgroundColor: '#6b705c' }}
              >
                <span>{mode.includes('Automatic') ? 'Automatic Lens' : mode}</span>
                <ChevronDown className={`w-5 h-5 lg:w-3 lg:h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </div>

              <AnimatePresence>
                {isDropdownOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className="absolute z-50 top-full left-0 mt-2 w-full max-h-[300px] overflow-y-auto bg-[#6b705c] border border-forest/30 rounded-2xl shadow-xl text-xs lg:text-[10px] font-bold uppercase tracking-widest text-white [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
                  >
                    {Object.values(PhilosophyMode).map(m => (
                      <li
                        key={m}
                        onClick={() => {
                          if (onChangeLens) onChangeLens(m);
                          setIsDropdownOpen(false);
                        }}
                        className={`px-5 py-3.5 lg:px-4 lg:py-3 cursor-pointer hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 ${mode === m ? 'bg-white/20' : ''}`}
                      >
                        {m.includes('Automatic') ? 'Automatic Lens' : m}
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>

            <span className="px-3 py-1 bg-sage/20 text-forest rounded-full text-[10px] font-bold uppercase tracking-widest">
              {result.dominantTheme}
            </span>
            {result.emotionalPatterns.map((pattern, i) => (
               <span key={i} className="px-3 py-1 border border-forest/10 text-forest/60 rounded-full text-[10px] font-bold uppercase tracking-widest hidden sm:inline-block">
                {pattern}
              </span>
            ))}
          </div>
          <p className="serif text-xl lg:text-3xl font-medium text-forest/80 italic leading-tight">
            &ldquo;{result.acknowledgment}&rdquo;
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 flex-grow">
          <div className="space-y-10">
            <div>
              <h4 className="text-[10px] font-bold text-sage uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-sage" />
                1. Emotional Insight
              </h4>
              <p className="text-base lg:text-lg leading-relaxed text-dark/90 font-inter font-medium">
                {result.emotionalInsight}
              </p>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-sage uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                <div className="w-1 h-1 rounded-full bg-sage" />
                2. Recommended Perspective: {result.primaryPhilosophyName}
              </h4>
              <p className="serif text-lg lg:text-xl leading-relaxed italic text-forest font-semibold bg-clay/20 p-4 lg:p-6 rounded-2xl lg:rounded-3xl border border-clay/50">
                &ldquo;{result.perspective}&rdquo;
              </p>
            </div>
          </div>

          <div className="space-y-10">
            <div>
              <h4 className="text-[10px] font-bold text-forest uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-sage" />
                3. Control Mapping
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div className="p-4 bg-sage/5 rounded-2xl">
                  <span className="text-[10px] font-bold text-sage uppercase tracking-wider mb-2 block">Within Your Control</span>
                  <ul className="space-y-1 text-sm text-dark/70">
                    {result.controlMapping.within.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>
                <div className="p-4 bg-stone-100 rounded-2xl">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 block">Outside Your Control</span>
                  <ul className="space-y-1 text-sm text-dark/50">
                    {result.controlMapping.outside.map((item, i) => <li key={i}>• {item}</li>)}
                  </ul>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-[10px] font-bold text-sage uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" />
                4. Grounded Next Steps
              </h4>
              <ul className="space-y-4">
                {result.nextSteps.map((step, i) => (
                  <li key={i} className="flex gap-3 text-sm lg:text-base leading-snug text-dark/70 font-inter">
                    <span className="text-sage font-bold text-xs mt-1">{i + 1}.</span>
                    {step}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Philosophy Lens Switcher */}
        <div className="mt-12 p-6 lg:p-8 bg-sage/10 rounded-2xl lg:rounded-[32px] border border-sage/20">
          <h4 className="text-[10px] font-bold text-forest uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
            <Sparkles className="w-3 h-3 text-sage" />
            Quick Switch to Another Lens
          </h4>
          <div className="grid lg:grid-cols-2 gap-6">
            {result.alternativeLenses.map((lens, i) => (
              <button 
                key={i} 
                onClick={() => {
                  const matchedMode = Object.values(PhilosophyMode).find(m => m.toLowerCase().includes(lens.philosophy.toLowerCase()));
                  if (matchedMode && onChangeLens) {
                    onChangeLens(matchedMode as PhilosophyMode);
                  }
                }}
                className="space-y-1 text-left p-4 rounded-xl hover:bg-forest/5 transition-colors border border-transparent hover:border-forest/10"
              >
                <span className="text-[10px] font-bold text-forest/60 uppercase tracking-wider">{lens.philosophy} &rarr;</span>
                <p className="text-sm italic text-forest/80 leading-snug">&ldquo;{lens.perspective}&rdquo;</p>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-10 bg-forest text-beige p-6 lg:p-8 rounded-2xl lg:rounded-[32px] shadow-xl">
          <h4 className="text-[10px] font-bold text-beige/40 uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
            <Quote className="w-3 h-3" />
            Reflection Prompt
          </h4>
          <p className="serif text-lg lg:text-xl italic leading-snug font-medium text-white text-center">
            &ldquo;{result.reflectionPrompt}&rdquo;
          </p>
        </div>

        {/* Continuation Options */}
        <div className="mt-14 pt-10 border-t border-forest/5">
          <h4 className="text-[10px] font-bold text-sage uppercase tracking-[0.2em] mb-6 text-center lg:text-left">
            {t.common.continue}
          </h4>
          <div className="flex flex-wrap gap-2 lg:gap-3 justify-center lg:justify-start mb-10">
            {result.continuationOptions.map((option, i) => (
              <button
                key={i}
                onClick={() => onContinue(option)}
                className="px-4 lg:px-5 py-2 rounded-full border border-forest/10 hover:bg-forest hover:text-beige hover:border-forest transition-all text-xs lg:text-sm font-medium text-forest/60"
              >
                {option}
              </button>
            ))}
          </div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <p className="serif text-xs italic text-forest/40 text-center lg:text-left">
              The soul becomes dyed with the color of its thoughts.
            </p>
            <button
              onClick={onBack}
              className="w-full lg:w-auto px-8 py-3.5 bg-forest text-beige rounded-full text-xs lg:text-sm font-semibold hover:opacity-90 transition-all shadow-2xl scale-100"
            >
              {t.common.startNew}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
