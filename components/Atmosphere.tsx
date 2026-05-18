'use client';
import { motion } from 'motion/react';

export default function Atmosphere() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-mesh opacity-60" />
      
      {/* Animated Blobs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full blur-[100px]"
        style={{ backgroundColor: 'rgba(139, 157, 131, 0.1)' }}
      />
      
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          x: [0, -40, 0],
          y: [0, -60, 0],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-[10%] right-[10%] w-[50vw] h-[50vw] rounded-full blur-[100px]"
        style={{ backgroundColor: 'rgba(232, 226, 217, 0.05)' }}
      />
      
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/fine-paper.png')] opacity-[0.03] mix-blend-multiply" />
    </div>
  );
}
