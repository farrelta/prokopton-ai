import { GoogleGenAI } from "@google/genai";
import { NextRequest, NextResponse } from "next/server";

const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash-latest";

const SYSTEM_PROMPT = `
# PERIODIC REFLECTION SUMMARY SYSTEM
The application includes a periodic reflection summary feature designed to help users gently notice recurring emotional themes and perspective shifts over time.

IMPORTANT:
- This is NOT a clinical analyzer. Purpose: reflective self-awareness.
- Tone: calm, subtle, emotionally safe, thoughtful, non-invasive, reflective.
- Pacing: Summaries appear occasionally to provide perspective, not continuous evaluation.

# PRIMARY GOALS
- Help users notice recurring themes and thought loops gently.
- Observe perspective changes over time.
- NEVER: diagnose, label psychologically, or sound medically authoritative.

# RESPONSE STYLE
- Observational, not authoritative.
- Invitational, not diagnostic.
- Encourage reflection, not certainty.
- Tone examples: "Many recent reflections seem connected to uncertainty", "Comparison appears frequently".
- Language Rules: Use "seems", "appears", "may", "often", "recent reflections suggest". Avoid "clearly", "definitely", "always", "you are", "you have".

# OUTPUT FORMAT (JSON ONLY)
Return a JSON object with:
1. summary: A gentle, concise observational summary (max 2 sentences).
2. recurringThemes: Array of 2-3 broad, non-clinical themes (e.g., "Uncertainty", "Comparison", "Self-pressure").
3. perspectiveShifts: Array of 1-2 subtle shifts noticed in perspective/tone (optional).
4. recurringQuestions: Array of 1-2 questions that seem to reappear in their entries (optional).

# SUMMARY TYPES TO RECOGNIZE
- Weekly Reflection: Overview of recent themes.
- Perspective Evolution: Subtle shifts in thinking patterns.
- Recurring Themes: Repeated emotional themes.
- Reflection Questions: Reappearing reflective inquiries.
`;

async function callGemini(history: any[], languageInstruction: string) {
  const result = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: `Analyze the following recent journal history context and provide pattern recognition insights following the guidelines.
    History: ${JSON.stringify(history)}
    
    ${languageInstruction}
    Return ONLY a JSON object.`,
    config: {
      responseMimeType: "application/json",
      systemInstruction: SYSTEM_PROMPT,
    },
  });

  const text = result.text || "{}";
  return JSON.parse(text);
}

async function callOpenAICompatible(provider: "openrouter" | "groq", history: any[], languageInstruction: string) {
  let apiKey = "";
  let model = "";
  let url = "";

  if (provider === "openrouter") {
    apiKey = process.env.OPENROUTER_API_KEY || "";
    model = process.env.OPENROUTER_MODEL || "deepseek/deepseek-chat";
    url = "https://openrouter.ai/api/v1/chat/completions";
  } else if (provider === "groq") {
    apiKey = process.env.GROQ_API_KEY || "";
    model = process.env.GROQ_MODEL || "llama3-70b-8192";
    url = "https://api.groq.com/openai/v1/chat/completions";
  }

  if (!apiKey) {
    throw new Error(`API Key for ${provider} is not configured.`);
  }

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: `${SYSTEM_PROMPT}\n\nReturn strictly valid JSON only. No extra text.` },
        { role: "user", content: `Analyze the following recent journal history context and provide pattern recognition insights following the guidelines.
        History: ${JSON.stringify(history)}
        
        ${languageInstruction}
        Return ONLY a JSON object.` }
      ],
      response_format: { type: "json_object" }
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || `AI Provider ${provider} error: ${response.statusText}`);
  }

  const data = await response.json();
  const content = data.choices[0].message.content;
  return JSON.parse(content);
}

export async function POST(req: NextRequest) {
  try {
    const { history, language } = await req.json();
    const languageInstruction = `CRITICAL: Respond in ${language === 'id' ? 'Indonesian' : 'English'}. All values in the JSON must be in this language.`;

    const providers = ["gemini", "groq", "openrouter"];
    const preferredProvider = process.env.AI_PROVIDER;
    
    // Sort providers so the preferred one is first
    const sortedProviders = providers.filter(p => (p === preferredProvider || 
      (p === "gemini" && process.env.GEMINI_API_KEY) ||
      (p === "groq" && process.env.GROQ_API_KEY) ||
      (p === "openrouter" && process.env.OPENROUTER_API_KEY)
    ));

    if (preferredProvider && sortedProviders.includes(preferredProvider)) {
      sortedProviders.splice(sortedProviders.indexOf(preferredProvider), 1);
      sortedProviders.unshift(preferredProvider);
    }

    let lastError = null;
    for (const provider of sortedProviders) {
      try {
        console.log(`Attempting analysis with ${provider}...`);
        let data;
        if (provider === "gemini") {
          data = await callGemini(history, languageInstruction);
        } else if (provider === "groq" || provider === "openrouter") {
          data = await callOpenAICompatible(provider as "groq" | "openrouter", history, languageInstruction);
        }
        
        if (data) {
          return NextResponse.json(data);
        }
      } catch (error: any) {
        console.warn(`Provider ${provider} failed for analysis:`, error.message);
        lastError = error;
      }
    }

    throw lastError || new Error("All AI providers failed for analysis.");
  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: "Failed to analyze patterns", details: error.message }, { status: 500 });
  }
}
