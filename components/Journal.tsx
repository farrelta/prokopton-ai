import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Book, Trash2, Calendar, ChevronRight, History, Plus, Edit3, Save, X, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';
import { getJournal, JournalEntry, deleteFromJournal, saveToJournal, updateJournalEntry, analyzeJournalHistory } from '@/lib/journal';

interface JournalProps {
  onLoadContext: (text: string) => void;
}

export default function Journal({ onLoadContext }: JournalProps) {
  const { t, language } = useLanguage();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<{ title: string; content: string }>({ title: '', content: '' });
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null);

  useEffect(() => {
    const journal = getJournal();
    setEntries(journal); // eslint-disable-line react-hooks/set-state-in-effect
  }, []);

  const analysis = React.useMemo(() => analyzeJournalHistory(entries), [entries]);

  const handleDeleteClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setEntryToDelete(id);
  };

  const confirmDelete = () => {
    if (entryToDelete) {
      deleteFromJournal(entryToDelete);
      setEntries(entries.filter(entry => entry.id !== entryToDelete));
      if (selectedEntry?.id === entryToDelete) setSelectedEntry(null);
      setEntryToDelete(null);
    }
  };

  const cancelDelete = () => {
    setEntryToDelete(null);
  };

  const handleCreateNew = () => {
    const newEntry = {
      title: 'New contemplation',
      input: '',
    };
    const saved = saveToJournal(newEntry);
    setEntries([saved, ...entries]);
    setSelectedEntry(saved);
    setIsEditing(true);
    setEditData({ title: saved.title || '', content: saved.input });
  };

  const startEdit = () => {
    if (!selectedEntry) return;
    setIsEditing(true);
    setEditData({ 
      title: selectedEntry.title || (selectedEntry.mode ? `${selectedEntry.mode} reflection` : 'Untitled'), 
      content: selectedEntry.input 
    });
  };

  const handleSaveEdit = () => {
    if (!selectedEntry) return;

    if (!editData.content.trim()) {
      deleteFromJournal(selectedEntry.id);
      setEntries(entries.filter(e => e.id !== selectedEntry.id));
      setSelectedEntry(null);
      setIsEditing(false);
      return;
    }

    const updates = { 
      title: editData.title.trim() ? editData.title : (selectedEntry.mode ? `${selectedEntry.mode} reflection` : 'Untitled'), 
      input: editData.content 
    };
    updateJournalEntry(selectedEntry.id, updates);
    
    const updatedEntries = entries.map(e => e.id === selectedEntry.id ? { ...e, ...updates } : e);
    setEntries(updatedEntries);
    setSelectedEntry({ ...selectedEntry, ...updates });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    if (selectedEntry && !selectedEntry.input.trim()) {
      deleteFromJournal(selectedEntry.id);
      setEntries(entries.filter(e => e.id !== selectedEntry.id));
      setSelectedEntry(null);
    }
    setIsEditing(false);
  };

  const locale = language === 'id' ? 'id-ID' : 'en-US';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Pattern Recognition Summary */}
      <AnimatePresence>
        {analysis ? (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 glass p-6 lg:p-8 rounded-[32px] border border-white/5 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-beige/10 rounded-full blur-2xl -mr-16 -mt-16 group-hover:bg-beige/20 transition-all duration-700" />
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4 max-w-xl">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-beige" />
                  <h3 className="text-white font-serif text-2xl italic">{t.common.analysisTitle}</h3>
                </div>
                <p className="text-sage text-sm leading-relaxed">{t.common.analysisSub}</p>
                
                <div className="flex flex-wrap gap-6 pt-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-sage/40 uppercase tracking-widest">{t.common.recurringThemes}</span>
                    <div className="flex flex-wrap gap-2">
                      {analysis.topThemes.map((theme: string, i: number) => (
                        <span key={i} className="text-xs text-white bg-white/5 px-3 py-1 rounded-full border border-white/5">
                          {theme}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-sage/40 uppercase tracking-widest">{t.common.emotionalPatterns}</span>
                    <div className="flex flex-wrap gap-2">
                      {analysis.topPatterns.map((pattern: string, i: number) => (
                        <span key={i} className="text-xs text-beige/80 border border-beige/20 px-3 py-1 rounded-full">
                          {pattern}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-8 px-6 py-4 bg-forest/40 rounded-2xl border border-white/5">
                <div className="text-center">
                  <div className="text-2xl font-serif text-white italic">{analysis.totalEntries}</div>
                  <div className="text-[10px] font-bold text-sage/50 uppercase tracking-widest">Contemplations</div>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div className="text-center">
                  <div className="text-2xl font-serif text-white italic">
                    {analysis.lastReflected ? new Date(analysis.lastReflected).toLocaleDateString(locale, { day: 'numeric', month: 'short' }) : '---'}
                  </div>
                  <div className="text-[10px] font-bold text-sage/50 uppercase tracking-widest">Last Journey</div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12 glass p-6 rounded-[24px] border border-dashed border-white/10 flex items-center gap-4 bg-white/5"
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-beige">
              <Sparkles className="w-5 h-5 opacity-50" />
            </div>
            <p className="text-sage/60 text-sm italic font-cormorant">
              {t.common.analysisPending}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar / Timeline */}
        <div className="lg:col-span-1 space-y-6">
          <header className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-beige rounded-full flex items-center justify-center text-forest">
                  <History className="w-5 h-5" />
                </div>
                <h2 className="serif text-3xl text-white italic">{t.common.timeline}</h2>
              </div>
              <button 
                onClick={handleCreateNew}
                className="p-2 bg-beige/10 hover:bg-beige/20 text-beige rounded-full border border-beige/20 transition-all"
                title={t.common.addEntry}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sage font-cormorant text-sm uppercase tracking-widest">{t.common.journalSub}</p>
          </header>

          <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar relative">
            <div className="absolute left-[31px] top-4 bottom-4 w-px bg-white/5" />
            
            {entries.length === 0 ? (
              <div className="glass p-8 rounded-3xl text-center space-y-4">
                <History className="w-8 h-8 text-sage/30 mx-auto" />
                <p className="text-sage font-cormorant italic">{t.common.journalEmpty}</p>
              </div>
            ) : (
              entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  onClick={() => {
                    if (isEditing && selectedEntry && !selectedEntry.input.trim()) {
                      deleteFromJournal(selectedEntry.id);
                      setEntries(prev => prev.filter(e => e.id !== selectedEntry.id));
                    }
                    setSelectedEntry(entry);
                    setIsEditing(false);
                  }}
                  className={`relative pl-12 group cursor-pointer`}
                >
                  {/* Timeline Dot */}
                  <div className={`absolute left-[26px] top-6 w-3 h-3 rounded-full border-2 transition-all z-10 ${
                    selectedEntry?.id === entry.id ? 'bg-beige border-beige shadow-[0_0_10px_rgba(212,190,152,0.5)] scale-125' : 'bg-stone-900 border-white/10'
                  }`} />

                  <div className={`glass p-5 rounded-2xl border transition-all relative ${
                    selectedEntry?.id === entry.id ? 'border-beige/50 bg-white/10' : 'border-white/5 hover:border-white/10 hover:bg-white/5'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[9px] font-bold text-beige/60 uppercase tracking-widest px-2 py-0.5 bg-beige/5 rounded-full">
                        {entry.mode || 'Manual'}
                      </span>
                      <span className="text-[10px] font-mono text-sage/30">
                        {new Date(entry.timestamp).toLocaleDateString(locale)}
                      </span>
                    </div>
                    <h4 className="text-white font-medium text-sm mb-1 line-clamp-1">
                      {entry.title || (entry.mode ? `${entry.mode} reflection` : 'Untitled')}
                    </h4>
                    <p className="text-white/40 line-clamp-1 text-xs font-cormorant italic">
                      &ldquo;{entry.input}&rdquo;
                    </p>
                    <div className="flex justify-between items-center mt-3">
                       <div className="flex gap-1 overflow-hidden">
                          {entry.result?.dominantTheme && (
                            <span className="text-[8px] font-bold text-beige/40 uppercase tracking-widest px-1.5 py-0.5 border border-beige/10 rounded">
                              {entry.result.dominantTheme}
                            </span>
                          )}
                       </div>
                        <button 
                        onClick={(e) => handleDeleteClick(entry.id, e)}
                        className="p-1 text-sage/20 hover:text-red-400 focus:text-red-400 transition-colors opacity-100 lg:opacity-0 group-hover:opacity-100"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4 lg:w-3.5 lg:h-3.5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>

        {/* Main Content View */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selectedEntry ? (
              <motion.div
                key={selectedEntry.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="glass p-8 lg:p-12 rounded-[40px] border border-white/10 space-y-10 relative overflow-hidden"
              >
                {/* Decoration */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-beige/5 rounded-full blur-3xl -mr-32 -mt-32" />

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-8 relative z-10">
                  <div className="space-y-1">
                    {isEditing ? (
                      <input 
                        className="bg-transparent text-beige text-[10px] font-bold uppercase tracking-widest border-b border-beige/30 outline-none w-full"
                        value={editData.title}
                        onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                        placeholder={t.common.entryTitle}
                      />
                    ) : (
                      <h3 className="text-beige text-[10px] font-bold uppercase tracking-widest">
                        {selectedEntry.title || (selectedEntry.mode ? `${selectedEntry.mode} reflection` : 'Untitled')}
                      </h3>
                    )}
                    <div className="flex items-center gap-2 text-white/40 text-sm font-mono">
                      <Calendar className="w-4 h-4" />
                      {new Date(selectedEntry.timestamp).toLocaleDateString(locale, { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {isEditing ? (
                      <>
                        <button
                          onClick={handleSaveEdit}
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-beige text-forest text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform"
                        >
                          <Save className="w-3 h-3" />
                          {t.common.saveEntry}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all"
                        >
                          <X className="w-3 h-3" />
                          {t.common.cancel}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={startEdit}
                          className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-sage text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all"
                        >
                          <Edit3 className="w-3 h-3" />
                          {t.common.editEntry}
                        </button>
                        <button
                          onClick={() => onLoadContext(selectedEntry.input)}
                          className="flex items-center gap-2 px-6 py-3 rounded-full bg-beige/10 border border-beige/20 text-beige text-xs font-bold uppercase tracking-widest hover:bg-beige/20 transition-all"
                        >
                          {t.common.revisitPerspective}
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-12 relative z-10">
                  <section className="space-y-4">
                    <h4 className="text-[10px] font-bold text-sage uppercase tracking-widest">{t.common.entryContent}</h4>
                    {isEditing ? (
                      <textarea 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 serif text-xl text-white italic leading-relaxed outline-none focus:border-beige/50 min-h-[200px]"
                        value={editData.content}
                        onChange={(e) => setEditData({ ...editData, content: e.target.value })}
                        placeholder="Pour your thoughts here..."
                      />
                    ) : (
                      <p className="serif text-xl lg:text-2xl text-white italic leading-relaxed max-w-2xl">
                        &ldquo;{selectedEntry.input}&rdquo;
                      </p>
                    )}
                  </section>

                  {!isEditing && selectedEntry.result && (
                    <motion.section 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-beige" />
                        <h4 className="text-[10px] font-bold text-sage uppercase tracking-widest">Reflective Insight</h4>
                      </div>
                      
                      <div className="space-y-8">
                         <div className="p-8 bg-forest/20 rounded-3xl border border-white/5 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                               <Book className="w-12 h-12" />
                            </div>
                            <p className="serif text-lg text-beige italic leading-relaxed mb-6">
                              {selectedEntry.result.reflectionSummary}
                            </p>
                            <hr className="border-white/5 my-6" />
                            <div className="grid lg:grid-cols-2 gap-8">
                              <div>
                                 <span className="text-[10px] font-bold text-sage/60 uppercase tracking-widest block mb-2">Core Pattern</span>
                                 <p className="text-white/80 leading-relaxed font-cormorant text-lg italic mb-4">
                                   {selectedEntry.result.emotionalInsight}
                                 </p>
                                 <div className="flex flex-wrap gap-2">
                                    {selectedEntry.result.emotionalPatterns.map((pattern, i) => (
                                      <span key={i} className="text-[9px] font-bold text-stone-400 bg-white/5 px-2 py-1 rounded border border-white/5 uppercase tracking-tighter">
                                        {pattern}
                                      </span>
                                    ))}
                                 </div>
                              </div>
                              <div>
                                 <span className="text-[10px] font-bold text-sage/60 uppercase tracking-widest block mb-2">{selectedEntry.result.primaryPhilosophyName} Wisdom</span>
                                 <p className="text-white/80 leading-relaxed font-cormorant text-lg italic">
                                   {selectedEntry.result.perspective}
                                 </p>
                              </div>
                            </div>
                         </div>

                         <div className="grid lg:grid-cols-2 gap-6">
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                              <h5 className="text-[10px] font-bold text-sage uppercase tracking-widest mb-3">Within Your Control</h5>
                              <ul className="space-y-3">
                                {selectedEntry.result.controlMapping.within.map((item, i) => (
                                  <li key={i} className="text-white/60 text-sm flex gap-3">
                                    <span className="text-beige/30 font-bold">•</span>
                                    <span className="font-cormorant italic text-base">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                              <h5 className="text-[10px] font-bold text-sage uppercase tracking-widest mb-3">Next Conscious Steps</h5>
                              <ul className="space-y-3">
                                {selectedEntry.result.nextSteps.map((item, i) => (
                                  <li key={i} className="text-white/60 text-sm flex gap-3">
                                    <span className="text-beige/30 font-bold">{i+1}.</span>
                                    <span className="font-cormorant italic text-base">{item}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                         </div>
                      </div>
                    </motion.section>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full min-h-[500px] flex items-center justify-center bg-white/5 rounded-[40px] border border-dashed border-white/10">
                <div className="text-center space-y-4 p-8">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto text-sage/20 border border-white/5">
                    <History className="w-10 h-10" />
                  </div>
                  <h3 className="serif text-2xl text-white italic">Revisit Your Journey</h3>
                  <p className="text-sage/40 font-cormorant italic text-lg max-w-xs mx-auto">
                    Choose a moment from your timeline to observe your growth and perspective.
                  </p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {entryToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-stone-800 border border-white/10 p-6 rounded-3xl max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl -mr-16 -mt-16" />
              <div className="relative z-10 text-center space-y-6">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto text-red-400">
                  <Trash2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="serif text-xl text-white italic mb-2">Delete Entry?</h3>
                  <p className="text-sage text-sm">{t.common.confirmDelete}</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={cancelDelete}
                    className="flex-1 py-3 px-4 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-bold uppercase tracking-widest transition-colors"
                  >
                    {t.common.cancel}
                  </button>
                  <button
                    onClick={confirmDelete}
                    className="flex-1 py-3 px-4 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs font-bold uppercase tracking-widest transition-colors border border-red-500/20"
                  >
                    {t.common.deleteEntry || 'Delete'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
