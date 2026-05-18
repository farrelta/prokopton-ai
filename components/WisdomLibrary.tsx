'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Book, Shield, Flower2, Heart, Trees, Cloud, ArrowRight, ExternalLink, Sparkles, Shuffle } from 'lucide-react';

import { getLibraryQuotes, WisdomQuote } from '@/lib/wisdomDatabase';

const getIconForPhilosophy = (philosophy: string) => {
  const p = philosophy.toLowerCase();
  if (p.includes('stoic')) return Shield;
  if (p.includes('buddhism') || p.includes('zen')) return Flower2;
  if (p.includes('taoism')) return Heart;
  if (p.includes('existentialism')) return Trees;
  if (p.includes('minimalism')) return Cloud;
  return Book;
};

// ... WISDOM_CARDS can be kept or removed; let's remove it and use DB entirely


import { useLanguage } from '@/lib/LanguageContext';

interface WisdomLibraryProps {
  onReflect?: (text: string) => void;
}

export default function WisdomLibrary({ onReflect }: WisdomLibraryProps) {
  const { t } = useLanguage();
  const [today, setToday] = useState(() => new Date());
  
  const [allCards, setAllCards] = useState<any[]>(() => {
    return getLibraryQuotes().map((card) => ({
      ...card,
      icon: getIconForPhilosophy(card.philosophy)
    }));
  });

  const [rotatedCards, setRotatedCards] = useState<any[]>(() => {
    const day = today.getDate();
    const items = getLibraryQuotes().map((card) => ({
      ...card,
      icon: getIconForPhilosophy(card.philosophy)
    }));
    return [...items].sort((a, b) => {
      const hashA = ((a.title?.length || 0) + (a.content?.length || 0) + day) % 100;
      const hashB = ((b.title?.length || 0) + (b.content?.length || 0) + day) % 100;
      return hashA - hashB;
    }).slice(0, 6);
  });

  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const msUntilMidnight = tomorrow.getTime() - now.getTime();
    
    const timer = setTimeout(() => {
      setToday(new Date());
    }, msUntilMidnight + 100);
    
    return () => clearTimeout(timer);
  }, [today]);

  useEffect(() => {
    const day = today.getDate();
    const sorted = [...allCards].sort((a, b) => {
      const hashA = ((a.title?.length || 0) + (a.content?.length || 0) + day) % 100;
      const hashB = ((b.title?.length || 0) + (b.content?.length || 0) + day) % 100;
      return hashA - hashB;
    });
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRotatedCards(sorted.slice(0, 6));
  }, [today, allCards]);

  const handleShuffle = () => {
    const shuffled = [...allCards].sort(() => 0.5 - Math.random());
    setRotatedCards(shuffled.slice(0, 6));
  };

  const handleCardClick = (url?: string, author?: string) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    } else if (author) {
      const searchUrl = `https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(author)}`;
      window.open(searchUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleReflectClick = (e: React.MouseEvent, content: string) => {
    e.stopPropagation();
    if (onReflect) {
      onReflect(content);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <header className="mb-12 text-center relative flex flex-col items-center">
        <span className="text-[10px] font-bold text-sage uppercase tracking-[0.3em] mb-4 block">{t.library.archive}</span>
        <h2 className="serif text-4xl lg:text-5xl text-beige mb-6">{t.library.title}</h2>
        <p className="text-sage max-w-2xl mx-auto text-sm lg:text-base mb-8">
          {t.library.description}
        </p>
        <button 
          onClick={handleShuffle}
          className="flex items-center gap-2 px-6 py-3 rounded-full hover:bg-beige/10 border border-beige/20 text-beige font-bold text-[10px] sm:text-xs uppercase tracking-[0.2em] transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <Shuffle className="w-4 h-4" />
          Shuffle Wisdom
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {rotatedCards.map((card, i) => (
          <motion.div
            key={card.title + "-" + i}
            onClick={() => handleCardClick(card.sourceUrl, card.author)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group relative glass p-8 rounded-[40px] border border-white/5 hover:border-beige/30 transition-all cursor-pointer flex flex-col justify-between min-h-[400px] overflow-hidden"
          >
            <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-40 transition-opacity">
              <ExternalLink className="w-4 h-4 text-beige" />
            </div>
            
            <div>
              <div className="flex justify-between items-start mb-8">
                <div className="w-12 h-12 bg-beige/10 rounded-2xl flex items-center justify-center text-beige group-hover:bg-beige group-hover:text-forest transition-all duration-500">
                  <card.icon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-sage uppercase tracking-[0.2em]">{card.philosophy}</span>
              </div>
              <h3 className="serif text-xl lg:text-2xl text-white mb-6 transition-colors group-hover:text-beige leading-tight">
                &ldquo;{card.content}&rdquo;
              </h3>
              <div className="relative mt-8 ">
                <button 
                  onClick={(e) => handleReflectClick(e, card.content)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full bg-beige text-forest font-bold text-[10px] uppercase tracking-[0.2em] shadow-2xl opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:translate-y-6 lg:group-hover:-translate-y-4 translate-y-0 transition-all duration-500 hover:scale-105 active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Reflect AI
                </button>
              </div>
            </div>

            <div className="relative flex items-center justify-between mt-12 pt-6 border-t border-white/5">
              <span className="text-[10px] font-bold text-beige/40 uppercase tracking-[0.15em]">— {card.author}</span>
              
              

              <div className="text-beige/40 group-hover:text-beige transition-colors group-hover:translate-x-1 duration-300">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
