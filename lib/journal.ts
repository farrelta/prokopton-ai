import { PhilosophyMode, ReflectionResponse } from './gemini';

export interface JournalEntry {
  id: string;
  timestamp: string;
  title?: string;
  input: string;
  mode?: PhilosophyMode;
  result?: ReflectionResponse;
}

export const getJournal = (): JournalEntry[] => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('prokopton_journal');
  return saved ? JSON.parse(saved) : [];
};

export const saveToJournal = (entry: Omit<JournalEntry, 'id' | 'timestamp'>): JournalEntry => {
  const newEntry: JournalEntry = {
    ...entry,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
  };
  
  const journal = getJournal();
  localStorage.setItem('prokopton_journal', JSON.stringify([newEntry, ...journal]));
  return newEntry;
};

export const updateJournalEntry = (id: string, updates: Partial<JournalEntry>) => {
  const journal = getJournal();
  const updated = journal.map(entry => entry.id === id ? { ...entry, ...updates } : entry);
  localStorage.setItem('prokopton_journal', JSON.stringify(updated));
};

export const deleteFromJournal = (id: string) => {
  const journal = getJournal();
  localStorage.setItem('prokopton_journal', JSON.stringify(journal.filter(e => e.id !== id)));
};

export const analyzeJournalHistory = (journal: JournalEntry[]) => {
  if (journal.length < 3) return null;

  const patterns: Record<string, number> = {};
  const themes: Record<string, number> = {};

  journal.forEach(entry => {
    if (entry.result?.emotionalPatterns) {
      entry.result.emotionalPatterns.forEach(p => {
        const normalized = p.toLowerCase().trim();
        if (normalized) {
          patterns[normalized] = (patterns[normalized] || 0) + 1;
        }
      });
    }
    if (entry.result?.dominantTheme) {
      const normalized = entry.result.dominantTheme.toLowerCase().trim();
      if (normalized) {
        themes[normalized] = (themes[normalized] || 0) + 1;
      }
    }
  });

  const sortedPatterns = Object.entries(patterns)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([p]) => p.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));

  const sortedThemes = Object.entries(themes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([t]) => t.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '));

  if (sortedPatterns.length === 0 && sortedThemes.length === 0) return null;

  return {
    topPatterns: sortedPatterns,
    topThemes: sortedThemes,
    totalEntries: journal.length,
    lastReflected: journal[0]?.timestamp,
  };
};
