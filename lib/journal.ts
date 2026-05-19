import { PhilosophyMode, ReflectionResponse } from './gemini';
import { encryptData, decryptData } from './security';

export interface JournalEntry {
  id: string;
  timestamp: string;
  title?: string;
  input: string;
  reflectionAnswer?: string;
  mode?: PhilosophyMode;
  result?: ReflectionResponse;
}

export const getJournal = async (): Promise<JournalEntry[]> => {
  if (typeof window === 'undefined') return [];
  const saved = localStorage.getItem('prokopton_journal');
  if (!saved) return [];

  // Migration and Decryption
  if (saved.startsWith('[')) {
    // Old plain text format
    return JSON.parse(saved);
  }

  try {
    const decrypted = await decryptData(saved);
    return JSON.parse(decrypted);
  } catch (e) {
    console.error('Failed to parse journal:', e);
    return [];
  }
};

export const saveToJournal = async (entry: Omit<JournalEntry, 'id' | 'timestamp'>): Promise<JournalEntry> => {
  const newEntry: JournalEntry = {
    ...entry,
    id: Math.random().toString(36).substr(2, 9),
    timestamp: new Date().toISOString(),
  };
  
  const journal = await getJournal();
  const updatedJournal = [newEntry, ...journal];
  const encrypted = await encryptData(JSON.stringify(updatedJournal));
  localStorage.setItem('prokopton_journal', encrypted);
  return newEntry;
};

export const updateJournalEntry = async (id: string, updates: Partial<JournalEntry>) => {
  const journal = await getJournal();
  const updated = journal.map(entry => entry.id === id ? { ...entry, ...updates } : entry);
  const encrypted = await encryptData(JSON.stringify(updated));
  localStorage.setItem('prokopton_journal', encrypted);
};

export const deleteFromJournal = async (id: string) => {
  const journal = await getJournal();
  const filtered = journal.filter(e => e.id !== id);
  const encrypted = await encryptData(JSON.stringify(filtered));
  localStorage.setItem('prokopton_journal', encrypted);
};

export interface JournalAnalysis {
  summary: string;
  recurringThemes: string[];
  perspectiveShifts: string[];
  recurringQuestions: string[];
  lastReflected: string;
  timestamp: string;
  entryCountAtAnalysis: number;
}

export const getStoredAnalysis = async (): Promise<JournalAnalysis | null> => {
  if (typeof window === 'undefined') return null;
  const saved = localStorage.getItem('prokopton_analysis');
  if (!saved) return null;

  if (saved.startsWith('{')) return JSON.parse(saved);

  try {
    const decrypted = await decryptData(saved);
    return JSON.parse(decrypted);
  } catch (e) {
    return null;
  }
};

export const saveAnalysis = async (analysis: JournalAnalysis) => {
  const encrypted = await encryptData(JSON.stringify(analysis));
  localStorage.setItem('prokopton_analysis', encrypted);
};

export async function getAIJournalAnalysis(journal: JournalEntry[], language: string = 'en'): Promise<JournalAnalysis | null> {
  if (journal.length < 5) return null;

  // Prepare a condensed history for the AI
  const history = journal.slice(0, 10).map(e => ({
    date: e.timestamp,
    title: e.title,
    theme: e.result?.dominantTheme,
    patterns: e.result?.emotionalPatterns,
    summary: e.result?.reflectionSummary
  }));

  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ history, language })
    });

    if (!response.ok) return null;
    const data = await response.json();
    
    const analysis: JournalAnalysis = {
      ...data,
      timestamp: new Date().toISOString(),
      entryCountAtAnalysis: journal.length,
      lastReflected: journal[0]?.timestamp
    };

    saveAnalysis(analysis);
    return analysis;
  } catch (error) {
    console.error('Failed to fetch AI analysis:', error);
    return null;
  }
}

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
