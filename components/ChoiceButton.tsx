'use client';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface ChoiceButtonProps {
  label: string;
  icon: LucideIcon;
  selected: boolean;
  onClick: () => void;
  description: string;
}

export default function ChoiceButton({ label, icon: Icon, selected, onClick, description }: ChoiceButtonProps) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`
        relative flex flex-col items-center p-6 rounded-2xl transition-all duration-500
        ${selected 
          ? 'bg-beige text-dark shadow-xl shadow-forest/20 ring-1 ring-beige' 
          : 'bg-white/5 hover:bg-white/10 text-white glass hover:shadow-lg shadow-black/10 border border-white/10'
        }
      `}
    >
      <div className={`p-3 rounded-xl mb-4 transition-colors ${selected ? 'bg-sage/10' : 'bg-white/5'}`}>
        <Icon className={`w-6 h-6 ${selected ? 'text-forest' : 'text-white'}`} />
      </div>
      <span className={`font-serif font-semibold text-sm md:text-base lg:text-lg mb-1 ${selected ? 'text-forest' : 'text-white'}`}>{label}</span>
      <span className={`text-[9px] md:text-[10px] uppercase tracking-wider md:tracking-widest opacity-60 text-center leading-tight max-w-[120px] ${selected ? 'text-forest' : 'text-white'}`}>
        {description}
      </span>
      
      {selected && (
        <motion.div
          layoutId="selected-indicator"
          className="absolute inset-0 rounded-2xl border-2 border-beige"
          initial={false}
          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
        />
      )}
    </motion.button>
  );
}
