export enum PhilosophyMode {
  AUTOMATIC = "Automatic Recommendation Mode",
  STOICISM = "Stoicism",
  BUDDHISM = "Buddhism",
  TAOISM = "Taoism",
  ISLAMIC_WISDOM = "Islamic Wisdom",
  EXISTENTIALISM = "Existentialism",
  MINIMALISM = "Minimalism",
  MODERN_PSYCHOLOGY = "Modern Reflective Psychology"
}

export interface ReflectionResponse {
  acknowledgment: string;
  emotionalInsight: string;
  dominantTheme: string;
  entryTitle: string;
  emotionalPatterns: string[];
  reflectionSummary: string;
  primaryPhilosophyName: string;
  perspective: string;
  controlMapping: {
    within: string[];
    outside: string[];
  };
  nextSteps: string[];
  reflectionPrompt: string;
  alternativeLenses: {
    philosophy: string;
    perspective: string;
  }[];
}

export async function getReflection(prompt: string, mode: PhilosophyMode, language: string = 'en', history?: { dominantTheme: string, emotionalPatterns: string[] }[]): Promise<ReflectionResponse> {
  const response = await fetch('/api/reflect', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, mode, language, history })
  });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("You have reached the free tier quota limit. Please wait a moment before reflecting again, or upgrade your key in Settings.");
    }
    throw new Error("Failed to generate reflection. Please try again in a moment of stillness.");
  }

  return await response.json();
}
