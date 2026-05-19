'use client';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Flower2, Heart, Trees, Cloud, Brain, ArrowRight, Loader2, Sparkles, History, Mic } from 'lucide-react';
import { PhilosophyMode, getReflection, ReflectionResponse } from '@/lib/gemini';
import ChoiceButton from './ChoiceButton';
import ResultCard from './ResultCard';
import VoiceInput from './VoiceInput';

import { useLanguage } from '@/lib/LanguageContext';
import { useEffect, useState as reactState } from 'react';
import { getJournal } from '@/lib/journal';

interface ReflectionFlowProps {
  initialInput?: string;
  initialTitle?: string;
  onClearedContext?: () => void;
}

export default function ReflectionFlow({ initialInput, initialTitle, onClearedContext }: ReflectionFlowProps) {
  const { t, language } = useLanguage();
  const [step, setStep] = useState<'mode' | 'input' | 'loading' | 'result'>('mode');
  const [selectedMode, setSelectedMode] = useState<PhilosophyMode>(PhilosophyMode.AUTOMATIC);
  const [input, setInput] = useState('');
  const [journalTitle, setJournalTitle] = useState<string | null>(null);
  const [loadingTitle, setLoadingTitle] = useState<string>('');
  const [result, setResult] = useState<ReflectionResponse | null>(null);
  const [lastJournalEntry, setLastJournalEntry] = reactState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const loadLastEntry = async () => {
      const journal = await getJournal();
      if (journal.length > 0) {
        setLastJournalEntry(journal[0].input);
      }
    };
    loadLastEntry();
  }, [setLastJournalEntry]);

  useEffect(() => {
    // If initialInput is provided (even if empty string ''), jump to input step
    if (initialInput !== undefined && initialInput !== null) {
      setInput(initialInput); // eslint-disable-line react-hooks/set-state-in-effect
      setJournalTitle(initialTitle || null);
      setStep('input');  
      
      // Focus the input after a short delay for animation/tab switch
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 500);
    }
  }, [initialInput, initialTitle]);

  const MODES = [
    { id: PhilosophyMode.AUTOMATIC, icon: Sparkles, desc: t.reflection.modes.automatic },
    { id: PhilosophyMode.STOICISM, icon: Shield, desc: t.reflection.modes.stoicism },
    { id: PhilosophyMode.BUDDHISM, icon: Flower2, desc: t.reflection.modes.buddhism },
    { id: PhilosophyMode.TAOISM, icon: Heart, desc: t.reflection.modes.taoism },
    { id: PhilosophyMode.ISLAMIC_WISDOM, icon: Heart, desc: t.reflection.modes.islamic_wisdom },
    { id: PhilosophyMode.EXISTENTIALISM, icon: Trees, desc: t.reflection.modes.existentialism },
    { id: PhilosophyMode.MINIMALISM, icon: Cloud, desc: t.reflection.modes.minimalism },
    { id: PhilosophyMode.MODERN_PSYCHOLOGY, icon: Brain, desc: t.reflection.modes.modern_psychology },
  ];

  // Handle periodic loading title changes
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'loading') {
      const titles = t.reflection.loadingTitles || [t.reflection.loadingTitle];
      interval = setInterval(() => {
        setLoadingTitle(prev => {
          const currentIndex = titles.indexOf(prev);
          const nextIndex = (currentIndex + 1) % titles.length;
          return titles[nextIndex];
        });
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [step, t.reflection.loadingTitles, t.reflection.loadingTitle]);

  const handleStartReflecting = async (customInput?: string, customMode?: PhilosophyMode) => {
    const finalInput = customInput || input;
    const finalMode = customMode || selectedMode;

    if (!finalInput.trim()) return;

    // Pick a random loading title
    const titles = t.reflection.loadingTitles || [t.reflection.loadingTitle];
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    setLoadingTitle(randomTitle);

    setStep('loading');
    try {
      const journal = await getJournal();
      const historyContext = journal
        .filter(e => !!e.result)
        .slice(0, 5)
        .map(e => ({
          dominantTheme: e.result?.dominantTheme || '',
          emotionalPatterns: e.result?.emotionalPatterns || []
        }));

      const data = await getReflection(finalInput, finalMode, language, historyContext);
      setResult(data);
      setStep('result');
      if (onClearedContext) onClearedContext();

      // Save to history
      const history = JSON.parse(localStorage.getItem('prokopton_history') || '[]');
      const newItem = {
        id: Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        input: finalInput,
        mode: finalMode,
        result: data,
      };
      localStorage.setItem('prokopton_history', JSON.stringify([newItem, ...history].slice(0, 10)));
    } catch (err: any) {
      alert(err.message || "Something went wrong. Let's try to pause and try again.");
      setStep('input');
    }
  };

  const reset = () => {
    setStep('mode');
    setInput('');
    setResult(null);
  };

  const handleContinue = (option: string) => {
    const lowerOption = option.toLowerCase();
    const isModeChange = lowerOption.includes('lens') || lowerOption.includes('philosophy') || lowerOption.includes('lensa') || lowerOption.includes('filosofi');
    
    if (isModeChange) {
      setStep('mode');
    } else {
      // For deepening options, immediately trigger new reflection
      const followUp = `${input}\n\nReflection Goal: ${option}`;
      setInput(followUp);
      handleStartReflecting(followUp);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-6 py-12 lg:py-24">
      <AnimatePresence mode="wait">
        {step === 'mode' && (
          <motion.div
            key="mode-selection"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="space-y-12 text-center"
          >
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-serif italic text-white tracking-tight">
                {t.reflection.modeHeader}
              </h2>
              <p className="text-sage font-cormorant text-xl max-w-lg mx-auto leading-relaxed">
                {t.reflection.modeSubheader}
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {MODES.map((mode) => (
                <ChoiceButton
                  key={mode.id}
                  label={mode.id}
                  icon={mode.icon}
                  description={mode.desc}
                  selected={selectedMode === mode.id}
                  onClick={() => setSelectedMode(mode.id)}
                />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep('input')}
              className="px-12 py-5 rounded-full bg-beige text-forest font-semibold text-lg flex items-center gap-3 mx-auto shadow-xl shadow-black/20"
            >
              {t.reflection.beginButton}
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}

        {step === 'input' && (
          <motion.div
            key="reflection-input"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto space-y-10"
          >
            <div className="space-y-4 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-3 bg-white/5 glass rounded-full">
                  {(() => {
                    const ModeIcon = MODES.find(m => m.id === selectedMode)?.icon || Brain;
                    return <ModeIcon className="w-8 h-8 text-white" />;
                  })()}
                </div>
              </div>
              <h2 className="text-3xl lg:text-4xl font-serif text-white leading-tight italic">
                {t.reflection.inputHeader}
              </h2>
              <p className="text-sage font-cormorant text-xl leading-relaxed">
                {t.reflection.inputSubheader}
              </p>
            </div>

            <div className="relative group">
              <textarea
                id="reflect-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.reflection.inputPlaceholder}
                className="w-full min-h-[220px] p-8 pb-16 rounded-[40px] bg-white/5 border border-white/10 focus:border-beige focus:ring-0 transition-all text-beige text-lg font-cormorant resize-none glass shadow-inner placeholder:text-white/20"
              />
              <div className="absolute top-4 right-8 text-[10px] uppercase tracking-widest text-white/20 font-bold">
                {input.length} {t.reflection.characters}
              </div>
              <div className="absolute bottom-6 right-8">
                <VoiceInput 
                  onTranscript={(text) => setInput(prev => prev + (prev.trim() ? " " : "") + text)}
                />
              </div>
            </div>

            <div className="flex flex-col items-center gap-6">
              <div className="flex flex-col lg:flex-row items-center justify-between w-full gap-6">
                <button 
                  onClick={() => setStep('mode')}
                  className="text-sage hover:text-white font-semibold uppercase text-xs tracking-widest transition-colors"
                >
                  {t.reflection.changeLens}
                </button>
                
                <button
                  disabled={!input.trim()}
                  onClick={() => handleStartReflecting()}
                  className="w-full lg:w-auto px-12 py-5 rounded-full bg-beige disabled:bg-stone-700 text-forest font-semibold text-lg flex items-center justify-center gap-3 transition-colors shadow-xl shadow-black/20"
                >
                  {t.reflection.getPerspective}
                  <Sparkles className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center gap-2 opacity-30">
                <Shield className="w-3 h-3 text-sage" />
                <span className="text-[10px] font-bold text-sage uppercase tracking-widest">
                  {t.common.privacyStatement}
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {step === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center space-y-8 py-24"
          >
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="w-24 h-24 border-2 border-sage/20 border-dashed rounded-full"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-beige" />
              </div>
            </div>
            <div className="text-center space-y-2">
              <p className="text-2xl font-serif italic text-white text-balance">
                {loadingTitle || t.reflection.loadingTitle}
              </p>
              <p className="text-sage font-cormorant text-lg uppercase tracking-widest">
                {t.reflection.loadingSub} {selectedMode}
              </p>
            </div>
          </motion.div>
        )}

        {step === 'result' && result && (
          <ResultCard 
            key="result-view"
            input={input}
            mode={selectedMode}
            result={result} 
            forceTitle={journalTitle || undefined}
            onBack={reset} 
            onContinue={handleContinue}
            onChangeLens={(newMode) => {
              setSelectedMode(newMode);
              handleStartReflecting(input, newMode);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
