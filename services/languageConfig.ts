
export enum Language {
  PT_BR = 'pt-BR',
  EN_US = 'en-US',
  ES_ES = 'es-ES'
}

export interface LanguageInfo {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
  speechCode: string;
  geminiCode: string;
}

export const SUPPORTED_LANGUAGES: LanguageInfo[] = [
  {
    code: Language.PT_BR,
    name: 'Portuguese',
    nativeName: 'Português',
    flag: '🇧🇷',
    speechCode: 'pt-BR',
    geminiCode: 'Portuguese'
  },
  {
    code: Language.EN_US,
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    speechCode: 'en-US',
    geminiCode: 'English'
  },
  {
    code: Language.ES_ES,
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    speechCode: 'es-ES',
    geminiCode: 'Spanish'
  }
];

export const getLanguageInfo = (code: Language): LanguageInfo | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};

export const getLanguageByGeminiCode = (geminiCode: string): LanguageInfo | undefined => {
  return SUPPORTED_LANGUAGES.find(lang => lang.geminiCode.toLowerCase() === geminiCode.toLowerCase());
};
