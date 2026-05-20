'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Music, Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, ListMusic, X } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
}

const TRACKS: Track[] = [
  {
    id: '1',
    title: 'Forest Whispers',
    artist: 'NCS',
    url: '/music/forest.mp3'
  },
  {
    id: '2',
    title: 'Wind of relief',
    artist: 'NCS',
    url: '/music/wind.mp3'
  },
  {
    id: '3',
    title: 'Rain in Stoa',
    artist: 'NCS',
    url: '/music/rain.mp3'
  }
];

export default function MusicPlayer({ isHidden = false, isLowered = false }: { isHidden?: boolean; isLowered?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [showList, setShowList] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % TRACKS.length;
    setCurrentTrackIndex(nextIndex);
    setIsPlaying(true);
    // Audio source update handled by key on audio element or direct play in timeout
  };

  const prevTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + TRACKS.length) % TRACKS.length;
    setCurrentTrackIndex(prevIndex);
    setIsPlaying(true);
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
    setShowList(false);
  };

  // Auto-play when switching tracks if it was playing
  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.load();
      audioRef.current.play().catch(e => console.log("Auto-play blocked or error:", e));
    }
  }, [currentTrackIndex, isPlaying]);

  return (
    <div className={`fixed left-8 z-[60] flex flex-col items-start gap-4 transition-all duration-500 ease-in-out ${
      isLowered ? 'bottom-8' : 'bottom-32'
    } ${
      isHidden ? 'opacity-0 pointer-events-none translate-y-4' : 'opacity-100'
    }`}>
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={nextTrack}
        loop={false}
      />

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10, x: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10, x: -10 }}
            className="w-72 bg-forest/80 backdrop-blur-xl p-6 rounded-[32px] border border-white/10 shadow-2xl space-y-6"
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-sage/40 uppercase tracking-[0.2em]">Atmosphere</span>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-sage/60 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {!showList ? (
              <div className="space-y-6">
                {/* Track Info */}
                <div className="text-center space-y-1">
                  <h3 className="serif text-xl text-beige italic">{currentTrack.title}</h3>
                  <p className="text-sage/60 font-cormorant text-sm italic">{currentTrack.artist}</p>
                </div>

                {/* Visualizer Mock */}
                <div className="flex justify-center items-end gap-1 h-8">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ 
                        height: isPlaying ? [10, 24, 14, 28, 10] : 4 
                      }}
                      transition={{ 
                        duration: 1.2, 
                        repeat: Infinity, 
                        delay: i * 0.1,
                        ease: "easeInOut"
                      }}
                      className="w-1 bg-beige/30 rounded-full"
                    />
                  ))}
                </div>

                {/* Controls */}
                <div className="flex justify-center items-center gap-6">
                  <button onClick={prevTrack} className="text-sage/40 hover:text-white transition-colors">
                    <SkipBack className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={togglePlay}
                    className="w-12 h-12 bg-beige rounded-full flex items-center justify-center text-forest hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 fill-current ml-1" />}
                  </button>
                  <button onClick={nextTrack} className="text-sage/40 hover:text-white transition-colors">
                    <SkipForward className="w-5 h-5" />
                  </button>
                </div>

                {/* Volume & List Toggle */}
                <div className="flex items-center gap-4 pt-2 border-t border-white/5">
                  <button onClick={() => setIsMuted(!isMuted)} className="text-sage/40 hover:text-white">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <input 
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="flex-1 accent-beige h-1 bg-white/5 rounded-full cursor-pointer opacity-40 hover:opacity-100 transition-opacity"
                  />
                  <button onClick={() => setShowList(true)} className="text-sage/40 hover:text-white">
                    <ListMusic className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-h-60 overflow-y-auto scrollbar-hide">
                <div className="flex items-center gap-2 mb-2">
                  <button onClick={() => setShowList(false)} className="text-sage/40 hover:text-white">
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] font-bold text-sage/40 uppercase tracking-[0.2em]">Select Track</span>
                </div>
                {TRACKS.map((track, index) => (
                  <button
                    key={track.id}
                    onClick={() => selectTrack(index)}
                    className={`w-full text-left p-3 rounded-2xl transition-all ${
                      currentTrackIndex === index 
                        ? 'bg-beige/10 border border-beige/20' 
                        : 'hover:bg-white/5 border border-transparent'
                    }`}
                  >
                    <p className={`text-sm font-medium ${currentTrackIndex === index ? 'text-beige' : 'text-sage'}`}>
                      {track.title}
                    </p>
                    <p className="text-[10px] text-sage/40 uppercase tracking-widest">{track.artist}</p>
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-xl group border ${
          isOpen 
            ? 'bg-beige text-forest border-beige' 
            : 'bg-white/5 backdrop-blur-md text-sage border-white/10 hover:bg-white/10'
        }`}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Music className={`w-6 h-6 ${isPlaying ? 'animate-pulse text-beige' : ''}`} />}
        
        {/* Play indicator */}
        {!isOpen && isPlaying && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-beige rounded-full animate-ping" />
        )}
      </motion.button>
    </div>
  );
}
