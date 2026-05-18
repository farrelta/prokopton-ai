import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const DEFAULT_MODEL = process.env.GEMINI_MODEL || "gemini-3-flash-preview";

const SYSTEM_PROMPT = `You are "Prokopton", an emotionally intelligent AI reflection companion designed to help users process stress, emotional overwhelm, uncertainty, failure, insecurity, comparison, frustration, burnout, overthinking, and daily life struggles through calm reflection and philosophical perspective.

Your role is NOT to act as:
- a therapist, psychologist, psychiatrist, medical professional, or crisis counselor.
- You do NOT diagnose mental illness or provide medical advice.

Your purpose is to:
- reduce emotional overwhelm and help users think more clearly.
- encourage reflective thinking and provide grounded perspective.
- help users distinguish controllable vs uncontrollable concerns.
- guide users toward calm and practical next steps.

PERSONALITY & TONE:
- Calm, warm, emotionally mature, grounded, thoughtful, concise but meaningful, non-judgmental.
- Avoid sounding: robotic, overly cheerful, preachy, dramatic, or clinical.

RESPONSE FLOW & STRUCTURE (JSON):
1. acknowledgment: Short calming acknowledgment.
2. emotionalInsight: Briefly identify the emotional or thinking pattern (non-clinical).
3. dominantTheme: A single word or short phrase representing the core struggle (e.g., "Comparison", "Perfectionism").
4. entryTitle: A concise, poetic title for this journal entry (e.g., "The Weight of Comparison", "Finding Stillness in Chaos").
5. emotionalPatterns: Array of 1-3 tags summarizing patterns (e.g. ["burnout", "uncertainty"]).
6. reflectionSummary: A one-sentence summary of the core insight.
7. primaryPhilosophyName: Name of the primary philosophy lens chosen (e.g., Stoicism, Buddhism).
7. perspective: Explain the primary perspective simply and practically.
8. controlMapping: Object with "within" (list of controllable actions/thoughts) and "outside" (list of uncontrollable factors).
9. nextSteps: 3–5 small practical actions.
10. reflectionPrompt: ONE meaningful reflection question to deepen awareness.
11. alternativeLenses: List of objects, each with "philosophy" (name) and "perspective" (1 short sentence reinterpretion). Cover 3-4 other lenses.
12. continuationOptions: 3-5 short probable following question from user to AI to continue.

PHILOSOPHICAL FRAMEWORKS:
Stoicism, Buddhism, Taoism, Existentialism, Minimalism, Modern reflective psychology, Confucianism, Islamic wisdom traditions.

SAFETY RULES:
If the user expresses self-harm, suicidal thoughts, or danger, encourage seeking trusted human support or professional help calmly and do not perform philosophical analysis.`;

const AI_PROVIDER = process.env.AI_PROVIDER || "gemini";

async function callGemini(prompt: string, mode: string, languageInstruction: string) {
  const response = await ai.models.generateContent({
    model: DEFAULT_MODEL,
    contents: `User is feeling: "${prompt}". Please use the lens of ${mode} to help them reflect. If the mode is "Automatic Recommendation Mode", analyze and choose the best lens. \n\n${languageInstruction}`,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          acknowledgment: { type: Type.STRING },
          emotionalInsight: { type: Type.STRING },
          dominantTheme: { type: Type.STRING },
          entryTitle: { type: Type.STRING },
          emotionalPatterns: { type: Type.ARRAY, items: { type: Type.STRING } },
          reflectionSummary: { type: Type.STRING },
          primaryPhilosophyName: { type: Type.STRING },
          perspective: { type: Type.STRING },
          controlMapping: {
            type: Type.OBJECT,
            properties: {
              within: { type: Type.ARRAY, items: { type: Type.STRING } },
              outside: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["within", "outside"]
          },
          nextSteps: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
          reflectionPrompt: { type: Type.STRING },
          alternativeLenses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                philosophy: { type: Type.STRING },
                perspective: { type: Type.STRING }
              },
              required: ["philosophy", "perspective"]
            }
          },
          continuationOptions: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          },
        },
        required: [
          "acknowledgment", 
          "emotionalInsight", 
          "dominantTheme",
          "entryTitle",
          "emotionalPatterns",
          "reflectionSummary",
          "primaryPhilosophyName",
          "perspective", 
          "controlMapping",
          "nextSteps", 
          "reflectionPrompt", 
          "alternativeLenses",
          "continuationOptions"
        ]
      }
    }
  });

  const text = response.text || "{}";
  return JSON.parse(text);
}

async function callOpenAICompatible(provider: "openrouter" | "groq", prompt: string, mode: string, languageInstruction: string) {
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
      "HTTP-Referer": "https://prokopton-reflection.vercel.app",
      "X-Title": "Prokopton Reflection Tool",
    },
    body: JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: `${SYSTEM_PROMPT}\n\nReturn strictly valid JSON only. No extra text.` },
        { role: "user", content: `User is feeling: "${prompt}". Please use the lens of ${mode} to help them reflect. If the mode is "Automatic Recommendation Mode", analyze and choose the best lens. \n\n${languageInstruction}` }
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
    const { prompt, mode, language } = await req.json();
    const languageInstruction = `CRITICAL: You MUST respond in the following language: ${language === 'id' ? 'Indonesian' : 'English'}. The entire JSON response (except for keys) must be translated to this language.`;

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
        console.log(`Attempting reflection with ${provider}...`);
        let data;
        if (provider === "gemini") {
          data = await callGemini(prompt, mode, languageInstruction);
        } else if (provider === "groq" || provider === "openrouter") {
          data = await callOpenAICompatible(provider as "groq" | "openrouter", prompt, mode, languageInstruction);
        }
        
        if (data) {
          return NextResponse.json(data);
        }
      } catch (error: any) {
        console.warn(`Provider ${provider} failed:`, error.message);
        lastError = error;
      }
    }

    throw lastError || new Error("All AI providers failed.");
  } catch (error: any) {
    console.error("AI Reflection Error:", error);
    const status = error.status === 429 ? 429 : 500;
    return NextResponse.json(
      { error: "Failed to generate reflection. Please try again in a moment of stillness.", details: error.message },
      { status: status }
    );
  }
}

