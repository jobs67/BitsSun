
export enum View {
  LANDING = 'LANDING',
  CHAT = 'CHAT',
  UTILITY = 'UTILITY'
}

export enum Language {
  PT_BR = 'pt-BR',
  EN_US = 'en-US',
  ES_ES = 'es-ES'
}

export interface Message {
  id: string;
  sender: 'VENDOR' | 'TOURIST';
  originalText: string;
  translatedText: string;
  timestamp: number;
  originalLanguage?: Language;
  targetLanguage?: Language;
  isFromCommonPhrase?: boolean;
}

export interface CurrencyData {
  code: string;
  symbol: string;
  rate: number; // Rate relative to BRL (1 BRL = X Currency)
}

export interface VoiceSettings {
  enabled: boolean;
  autoPlay: boolean;
  rate: number;
  pitch: number;
  volume: number;
}

export interface AppSettings {
  touristLanguage: Language;
  voiceSettings: VoiceSettings;
  autoDetectLanguage: boolean;
}
