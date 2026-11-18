import { GoogleGenAI } from '@google/genai';
import { config } from '../config/env.js';

let geminiClient = null;

if (config.geminiApiKey) {
  try {
    geminiClient = new GoogleGenAI({ apiKey: config.geminiApiKey });
  } catch (err) {
    console.warn('[Gemini Client] Initialization note:', err.message);
  }
}

/**
 * Generate AI reasoning and structured analysis using Google Gemini models.
 * Tries the high-throughput gemini-3.1-flash-lite model, and falls back to gemini-3.8-flash if needed.
 */
export async function generateAiInsight({ prompt, systemInstruction = '', model = 'gemini-3.1-flash-lite' }) {
  if (!geminiClient) {
    return {
      success: false,
      isRealLlm: false,
      reason: 'NO_API_KEY',
    };
  }

  const candidateModels = [model, 'gemini-3.1-flash-lite', 'gemini-3.8-flash'];
  const uniqueModels = [...new Set(candidateModels)];

  for (const m of uniqueModels) {
    try {
      const response = await geminiClient.models.generateContent({
        model: m,
        contents: prompt,
        config: {
          systemInstruction: systemInstruction || undefined,
          temperature: 0.2,
        },
      });

      if (response && response.text) {
        return {
          success: true,
          isRealLlm: true,
          text: response.text,
          modelUsed: m,
        };
      }
    } catch (err) {
      console.warn(`[Gemini API Call Notice - ${m}]:`, err.message || err);
    }
  }

  return {
    success: false,
    isRealLlm: false,
    error: 'All Gemini model candidates busy or unavailable',
  };
}

export const isGeminiConfigured = () => !!geminiClient;
