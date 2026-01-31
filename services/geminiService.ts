
import { GoogleGenAI } from "@google/genai";
import { Language, getLanguageInfo } from './languageConfig';
import { translationCache } from './translationCache';
import { getPreTranslation } from './preTranslatedPhrases';

// Get API key from environment
const apiKey = process.env.VITE_GEMINI_API_KEY || '';

// Log API key status
if (!apiKey || apiKey === '') {
  console.error('❌ GEMINI_API_KEY não configurada! Verifique o arquivo .env.local');
} else {
  console.log('✅ GEMINI_API_KEY carregada:', apiKey.substring(0, 10) + '...');
}

const ai = new GoogleGenAI({
  apiKey,
  apiVersion: 'v1'
});

/**
 * Validate Gemini API Key
 * Returns: 'valid' | 'invalid' | 'missing'
 */
export const validateApiKey = async (): Promise<'valid' | 'invalid' | 'missing'> => {
  if (!apiKey || apiKey === '') {
    return 'missing';
  }

  try {
    // Test with a simple request
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Hello',
    });

    if (response.text) {
      return 'valid';
    }
    return 'invalid';
  } catch (error) {
    console.error('API Key validation failed:', error);
    return 'invalid';
  }
};

/**
 * Check if Gemini is available (has API key)
 */
export const isGeminiAvailable = (): boolean => {
  return apiKey !== '' && apiKey !== undefined;
};

// Cache key generator
const getCacheKey = (text: string, from: string, to: string): string => {
  return `${from}:${to}:${text.toLowerCase().trim()}`;
};

/**
 * Translate using MyMemory API (Free, 5000 chars/day)
 */
async function translateMyMemory(text: string, from: string, to: string): Promise<string> {
  // Map languages to MyMemory format (e.g., pt-br -> pt-BR)
  const langPair = `${from}|${to}`;
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    } else {
      throw new Error(`MyMemory Error: ${data.responseStatus}`);
    }
  } catch (error) {
    throw new Error('MyMemory API failed');
  }
}

/**
 * Detect the language of a given text
 */
export const detectLanguage = async (text: string): Promise<Language> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Detect the language of this text and respond with ONLY one word: "Portuguese", "English", or "Spanish". Text: "${text}"`,
    });

    const detected = response.text?.trim() || 'English';

    if (detected.toLowerCase().includes('portuguese') || detected.toLowerCase().includes('português')) {
      return Language.PT_BR;
    } else if (detected.toLowerCase().includes('spanish') || detected.toLowerCase().includes('español')) {
      return Language.ES_ES;
    } else {
      return Language.EN_US;
    }
  } catch (error) {
    console.error("Language Detection Error:", error);
    return Language.EN_US;
  }
};

/**
 * Smart Translate: Hybrid strategy (Cache -> Pre-translated -> MyMemory -> Gemini)
 */
export const translateText = async (
  text: string,
  fromLang: Language,
  toLang: Language
): Promise<string> => {
  if (fromLang === toLang) return text;
  if (!text.trim()) return '';

  const cacheKey = getCacheKey(text, fromLang, toLang);

  // 1. Check LocalStorage Cache (Fastest & Free)
  const cached = translationCache.get(cacheKey);
  if (cached) {
    console.log(`⚡ Cache Hit: "${text}"`);
    return cached;
  }

  // 2. Check Pre-translated Phrases (Instant & Free)
  const preTranslated = getPreTranslation(text, fromLang, toLang);
  if (preTranslated) {
    console.log(`📚 Phrase Hit: "${text}"`);
    translationCache.set(cacheKey, preTranslated);
    return preTranslated;
  }

  // 3. Try MyMemory API (Free Tier - 5k/day)
  try {
    const translation = await translateMyMemory(text, fromLang, toLang);
    console.log(`🌐 MyMemory Translation: "${text}"`);
    translationCache.set(cacheKey, translation);
    return translation;
  } catch (error) {
    console.warn('MyMemory failed, falling back to Gemini...', error);
  }

  // 4. Fallback to Gemini API (High Quality, Rate Limited)
  try {
    const fromLangInfo = getLanguageInfo(fromLang);
    const toLangInfo = getLanguageInfo(toLang);

    if (!fromLangInfo || !toLangInfo) {
      throw new Error('Idioma não suportado');
    }

    // Rate limiting delay (simple jitter)
    await new Promise(resolve => setTimeout(resolve, Math.random() * 500));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Translate the following text from ${fromLangInfo.geminiCode} to ${toLangInfo.geminiCode}. Return ONLY the translated text without any explanations, quotation marks, or additional commentary: "${text}"`,
    });

    const translation = response.text?.trim() || "Tradução indisponível";
    console.log(`🤖 Gemini Translation: "${text}"`);

    translationCache.set(cacheKey, translation);
    return translation;

  } catch (error) {
    console.error("All Translation Methods Failed:", error);

    // Better error messages
    if (error instanceof Error) {
      if (error.message.includes('network')) return "Erro de conexão.";
      if (error.message.includes('quota')) return "Limite atingido. Tente mais tarde.";
    }
    return "Erro na tradução.";
  }
};

/**
 * Clear translation cache
 */
export const clearCache = (): void => {
  translationCache.clear();
};
