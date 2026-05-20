'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Atmosphere from '@/components/Atmosphere';
import ReflectionFlow from '@/components/ReflectionFlow';
import { Sparkles, ArrowDown, Home as HomeIcon, Calendar, BookOpen, Menu, X, Languages, History } from 'lucide-react';
import HistoryPanel from '@/components/HistoryPanel';
import DailyReflections from '@/components/DailyReflections';
import WisdomLibrary from '@/components/WisdomLibrary';
import PhilosophyLearning from '@/components/PhilosophyLearning';
import Journal from '@/components/Journal';
import MusicPlayer from '@/components/MusicPlayer';
import { useLanguage } from '@/lib/LanguageContext';

type Tab = 'home' | 'daily' | 'library' | 'journal' | 'learning';

export default function Home() {
  const { t, language, setLanguage } = useLanguage();
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFooterVisible, setIsFooterVisible] = useState(false);
  const footerRef = useRef<HTMLElement>(null);
  const [journalContext, setJournalContext] = useState<string | null>(null);
  const [greetingKey, setGreetingKey] = useState<'morning' | 'afternoon' | 'evening' | 'night'>('morning');
  const [isSubModalOpen, setIsSubModalOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    const timer = setTimeout(() => {
      if (hour >= 5 && hour < 12) setGreetingKey('morning');
      else if (hour >= 12 && hour < 17) setGreetingKey('afternoon');
      else if (hour >= 17 && hour < 21) setGreetingKey('evening');
      else setGreetingKey('night');
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const scrollToReflect = (immediate = false) => {
    // If immediate is true, we don't wait for long transitions
    const attempts = immediate ? 5 : 10;
    let count = 0;

    const interval = setInterval(() => {
      const reflectSection = document.getElementById('reflect');
      if (reflectSection) {
        clearInterval(interval);
        
        // Use a robust way to scroll to the section
        const yOffset = -40; // Reduced offset for better centering
        const elementRect = reflectSection.getBoundingClientRect();
        const absoluteElementTop = elementRect.top + window.pageYOffset + yOffset;
        
        window.scrollTo({
          top: absoluteElementTop,
          behavior: 'smooth'
        });
        
        // Focus search for input after scrolling
        setTimeout(() => {
          const inputElement = document.getElementById('reflect-input');
          if (inputElement) {
            inputElement.focus();
          }
        }, 300);
      } else {
        count++;
        if (count >= attempts) {
          clearInterval(interval);
        }
      }
    }, 100);
  };

  const [journalTitle, setJournalTitle] = useState<string | null>(null);
  const [journalInitialText, setJournalInitialText] = useState<string | null>(null);

  const handleLoadContext = (text: string, title?: string) => {
    setJournalContext(text);
    setJournalTitle(title || null);
    setActiveTab('home');
    scrollToReflect(false);
  };

  const handleAddToJournal = (text: string, title?: string) => {
    setJournalInitialText(text);
    setJournalTitle(title || null);
    setActiveTab('journal');
  };

  const handleGoHome = () => {
    setActiveTab('home');
    setIsMenuOpen(false);
    setJournalContext('');
    setJournalTitle(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsFooterVisible(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );

    const currentFooter = footerRef.current;
    if (currentFooter) {
      observer.observe(currentFooter);
    }

    return () => {
      if (currentFooter) {
        observer.unobserve(currentFooter);
      }
    };
  }, []);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const selectTab = (tab: Tab) => {
    setActiveTab(tab);
    setIsMenuOpen(false);
  };

  return (
    <main className="relative min-h-screen">
      <Atmosphere />
      <HistoryPanel 
        hideToggle={isFooterVisible || activeTab !== 'home'} 
        onSelect={handleLoadContext}
        onOpenChange={setIsHistoryOpen}
      />
      
      {/* Ambient Music Player - Persistent on all tabs */}
      <MusicPlayer isHidden={isHistoryOpen || isSubModalOpen || isFooterVisible} isLowered={activeTab !== 'home'} />
      
      {/* Header */}
      {!isSubModalOpen && (
        <header className="relative z-50 flex justify-between items-center px-8 py-6">
          <div className="flex items-center gap-12">
            <div 
              className="flex items-center gap-2 cursor-pointer" 
              onClick={handleGoHome}
            >
              <div className="w-8 h-8 bg-beige rounded-full flex items-center justify-center">
                <div className="w-4 h-4 rounded-full bg-forest"></div>
              </div>
              <h1 className="font-inter text-xl font-medium tracking-tight text-white">Prokopton</h1>
            </div>
            <nav className="hidden lg:flex items-center gap-8 text-[11px] uppercase tracking-widest font-bold text-sage">
              <button 
                onClick={() => setActiveTab('daily')} 
                className={`transition-colors hover:text-white ${activeTab === 'daily' ? 'text-white' : 'text-sage'}`}
              >
                {t.nav.daily}
              </button>
              <button 
                onClick={() => setActiveTab('library')} 
                className={`transition-colors hover:text-white ${activeTab === 'library' ? 'text-white' : 'text-sage'}`}
              >
                {t.nav.library}
              </button>
              <button 
                onClick={() => setActiveTab('learning')} 
                className={`transition-colors hover:text-white ${activeTab === 'learning' ? 'text-white' : 'text-sage'}`}
              >
                {t.nav.learning}
              </button>
              <button 
                onClick={() => setActiveTab('journal')} 
                className={`transition-colors hover:text-white ${activeTab === 'journal' ? 'text-white' : 'text-sage'}`}
              >
                {t.nav.journal}
              </button>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex glass rounded-full p-1 border border-white/5">
              <button 
                onClick={() => setLanguage('en')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'en' ? 'bg-beige text-forest' : 'text-sage hover:text-white'}`}
              >
                EN
              </button>
              <button 
                onClick={() => setLanguage('id')}
                className={`px-3 py-1 rounded-full text-[10px] font-bold transition-all ${language === 'id' ? 'bg-beige text-forest' : 'text-sage hover:text-white'}`}
              >
                ID
              </button>
            </div>
            <div className="flex items-center space-x-2 glass px-4 py-2 rounded-full text-[10px] uppercase tracking-widest font-bold text-white/80">
              <span className="w-2 h-2 rounded-full bg-green-400"></span>
              <span>{t.common.aiActive}</span>
            </div>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <div className="relative z-10 pb-15 lg:pb-12">
        <AnimatePresence mode="wait">
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <section className="pt-24 pb-12 px-6 text-center max-w-4xl mx-auto space-y-10">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sage text-[10px] uppercase tracking-[0.2em] font-bold"
                >
                  <Sparkles className="w-3 h-3" />
                  JuaraVibeCoding
                </motion.div>
                
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-6xl md:text-8xl font-serif text-white leading-[0.9] tracking-tighter italic"
                >
                  {t.hero.clarity} <br /> 
                  <span className="not-italic font-bold">{t.hero.unfolding}</span>
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-sage font-cormorant text-2xl max-w-xl mx-auto leading-relaxed"
                >
                  {t.hero.greetings[greetingKey]}
                  {t.hero.greetingSuffix}
                </motion.p>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="pt-8"
                >
                  <ArrowDown className="w-6 h-6 mx-auto animate-bounce text-stone-300" />
                </motion.div>
              </section>

              <section id="reflect">
                <ReflectionFlow 
                  initialInput={journalContext || undefined} 
                  initialTitle={journalTitle || undefined}
                  onClearedContext={() => {
                    setJournalContext(null);
                    setJournalTitle(null);
                  }} 
                />
              </section>
            </motion.div>
          )}

          {activeTab === 'daily' && (
            <motion.div
              key="daily"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="pt-12"
            >
              <DailyReflections onReflect={handleLoadContext} />
            </motion.div>
          )}

          {activeTab === 'library' && (
            <motion.div
              key="library"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="pt-12"
            >
              <WisdomLibrary 
                onReflect={handleLoadContext} 
                onAddToJournal={handleAddToJournal}
              />
            </motion.div>
          )}

          {activeTab === 'learning' && (
            <motion.div
              key="learning"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="pt-12"
            >
              <PhilosophyLearning onOpenChange={setIsSubModalOpen} />
            </motion.div>
          )}

          {activeTab === 'journal' && (
            <motion.div
              key="journal"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="pt-12"
            >
              <Journal 
                onLoadContext={handleLoadContext} 
                initialText={journalInitialText || undefined}
                initialTitle={journalTitle || undefined}
                onClearInitial={() => {
                  setJournalInitialText(null);
                  setJournalTitle(null);
                }}
                onOpenChange={setIsSubModalOpen}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Floating Navigation */}
      <AnimatePresence>
        {!isFooterVisible && !isSubModalOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-8 right-8 z-[100] lg:hidden"
          >
            <AnimatePresence>
              {isMenuOpen && (
                <motion.nav
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.8 }}
                  className="absolute bottom-20 right-0 flex flex-col gap-4 items-end"
                >
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    onClick={handleGoHome}
                    className={`p-4 rounded-2xl flex items-center gap-3 transition-all bg-forest border border-white/5 shadow-2xl ${activeTab === 'home' ? 'border-beige text-white' : 'text-sage'}`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">{t.nav.home}</span>
                    <HomeIcon className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    onClick={() => selectTab('daily')}
                    className={`p-4 rounded-2xl flex items-center gap-3 transition-all bg-forest border border-white/5 shadow-2xl ${activeTab === 'daily' ? 'border-beige text-white' : 'text-sage'}`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">{t.nav.daily}</span>
                    <Calendar className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    onClick={() => selectTab('library')}
                    className={`p-4 rounded-2xl flex items-center gap-3 transition-all bg-forest border border-white/5 shadow-2xl ${activeTab === 'library' ? 'border-beige text-white' : 'text-sage'}`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">{t.nav.library}</span>
                    <BookOpen className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                    onClick={() => selectTab('learning')}
                    className={`p-4 rounded-2xl flex items-center gap-3 transition-all bg-forest border border-white/5 shadow-2xl ${activeTab === 'learning' ? 'border-beige text-white' : 'text-sage'}`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">{t.nav.learning}</span>
                    <Sparkles className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => selectTab('journal')}
                    className={`p-4 rounded-2xl flex items-center gap-3 transition-all bg-forest border border-white/5 shadow-2xl ${activeTab === 'journal' ? 'border-beige text-white' : 'text-sage'}`}
                  >
                    <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap">{t.nav.journal}</span>
                    <History className="w-5 h-5" />
                  </motion.button>
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex bg-forest rounded-full p-1 border border-white/5 shadow-2xl"
                  >
                    <button 
                      onClick={() => setLanguage('en')}
                      className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all ${language === 'en' ? 'bg-beige text-forest' : 'text-sage'}`}
                    >
                      EN
                    </button>
                    <button 
                      onClick={() => setLanguage('id')}
                      className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all ${language === 'id' ? 'bg-beige text-forest' : 'text-sage'}`}
                    >
                      ID
                    </button>
                  </motion.div>
                </motion.nav>
              )}
            </AnimatePresence>

            <button
              onClick={toggleMenu}
              className="w-16 h-16 rounded-full bg-beige text-forest shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      {!isSubModalOpen && (
        <footer ref={footerRef} className="relative z-10 py-12 px-8 border-t border-stone-200/50 mt-15">
          <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between items-center gap-8">
            <div className="text-[10px] uppercase tracking-widest text-stone-400 font-bold">
              {t.footer.copyright}
            </div>
          </div>
        </footer>
      )}
    </main>
  );
}
