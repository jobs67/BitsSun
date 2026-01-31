
import React, { useRef, useEffect, useState } from 'react';
import { Message, Language, VoiceSettings } from '../types';
import { translateText } from '../services/geminiService';
import { speechService, isSpeechRecognitionSupported } from '../services/speechService';
import { getLanguageInfo } from '../services/languageConfig';
import { CommonPhrase } from '../services/commonPhrases';
import LanguageSelector from './LanguageSelector';
import VoiceRecorder from './VoiceRecorder';
import PhrasesModal from './PhrasesModal';

interface ChatScreenProps {
  messages: Message[];
  onAddMessage: (msg: Message) => void;
  onClear: () => void;
  onOpenUtility: () => void;
  onBack: () => void;
  touristLanguage: Language;
  onTouristLanguageChange: (lang: Language) => void;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ messages, onAddMessage, onClear, onOpenUtility, onBack, touristLanguage, onTouristLanguageChange }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [currentSpeaker, setCurrentSpeaker] = useState<'VENDOR' | 'TOURIST'>('VENDOR');
  const [voiceTranscript, setVoiceTranscript] = useState('');
  const [voiceError, setVoiceError] = useState('');
  const [showPhrasesModal, setShowPhrasesModal] = useState(false);
  const [micPermissionGranted, setMicPermissionGranted] = useState<boolean | null>(null);
  const [autoPlayVoice, setAutoPlayVoice] = useState(false); // Hybrid voice mode
  const [flashlightOn, setFlashlightOn] = useState(false); // Flashlight state
  const flashlightStreamRef = useRef<MediaStream | null>(null);

  const [voiceSettings] = useState<VoiceSettings>({
    enabled: true,
    autoPlay: true,
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const checkPermissions = async () => {
      const permissionState = await speechService.checkMicrophonePermission();
      setMicPermissionGranted(permissionState === 'granted');
    };
    checkPermissions();
  }, []);

  const handleVoiceInput = async (sender: 'VENDOR' | 'TOURIST') => {
    if (!isSpeechRecognitionSupported()) {
      alert('Reconhecimento de voz não suportado neste navegador. Use Chrome ou Edge para melhor experiência.');
      handleTextInput(sender);
      return;
    }

    if (micPermissionGranted === false || micPermissionGranted === null) {
      const granted = await speechService.requestMicrophonePermission();
      setMicPermissionGranted(granted);

      if (!granted) {
        alert('Permissão de microfone negada. Por favor, permita o acesso ao microfone nas configurações do navegador.');
        return;
      }
    }

    setCurrentSpeaker(sender);
    setVoiceTranscript('');
    setVoiceError('');
    setShowVoiceRecorder(true);

    const language = sender === 'VENDOR' ? Language.PT_BR : touristLanguage;

    speechService.startListening(language, {
      onResult: (result) => {
        setVoiceTranscript(result.transcript);
        setVoiceError('');

        if (result.isFinal) {
          handleTranslation(result.transcript, sender);
        }
      },
      onError: (error) => {
        console.error('Speech recognition error:', error);
        setVoiceError(error);

        if (error.includes('Permissão de microfone negada')) {
          setMicPermissionGranted(false);
        }
      },
      onEnd: () => { },
      onStart: () => {
        console.log('Recording started');
        setVoiceError('');
      }
    });
  };

  const toggleFlashlight = async () => {
    try {
      if (flashlightOn) {
        // Turn OFF flashlight
        if (flashlightStreamRef.current) {
          flashlightStreamRef.current.getTracks().forEach(track => track.stop());
          flashlightStreamRef.current = null;
        }
        setFlashlightOn(false);
      } else {
        // Turn ON flashlight
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }
        });

        const track = stream.getVideoTracks()[0];
        const capabilities = track.getCapabilities() as any;

        if (capabilities.torch) {
          await track.applyConstraints({
            advanced: [{ torch: true } as any]
          });
          flashlightStreamRef.current = stream;
          setFlashlightOn(true);
        } else {
          // Fallback: just keep camera on (provides some light)
          flashlightStreamRef.current = stream;
          setFlashlightOn(true);
        }
      }
    } catch (error) {
      console.error('Flashlight error:', error);
      alert('Lanterna não disponível neste dispositivo');
    }
  };

  const handleTextInput = async (sender: 'VENDOR' | 'TOURIST') => {
    const promptText = sender === 'VENDOR'
      ? 'O que você quer falar para o turista?'
      : 'What do you want to say to the vendor?';
    const input = window.prompt(promptText);

    if (input && input.trim()) {
      await handleTranslation(input, sender);
    }
  };

  const exportConversation = () => {
    // Format conversation
    const conversationText = messages.map(msg => {
      const sender = msg.sender === 'VENDOR' ? '🇧🇷 Vendedor' : '🌍 Turista';
      return `${sender}:\n${msg.originalText}\n→ ${msg.translatedText}\n`;
    }).join('\n');

    const fullText = `📱 BitsSun - Conversa Traduzida\n\n${conversationText}`;

    // Send via email
    window.location.href = `mailto:?subject=BitsSun - Conversa Traduzida&body=${encodeURIComponent(fullText)}`;
  };

  const handleTranslation = async (text: string, sender: 'VENDOR' | 'TOURIST') => {
    if (!text.trim()) return;

    setIsProcessing(true);
    setShowVoiceRecorder(false);

    const fromLang = sender === 'VENDOR' ? Language.PT_BR : touristLanguage;
    const toLang = sender === 'VENDOR' ? touristLanguage : Language.PT_BR;

    try {
      const translation = await translateText(text, fromLang, toLang);

      const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender,
        originalText: text,
        translatedText: translation,
        timestamp: Date.now(),
        originalLanguage: fromLang,
        targetLanguage: toLang
      };

      onAddMessage(newMessage);

      // Auto-play voice only if enabled
      if (voiceSettings.enabled && voiceSettings.autoPlay && autoPlayVoice) {
        setTimeout(() => {
          speechService.speak(translation, toLang, {
            rate: voiceSettings.rate,
            pitch: voiceSettings.pitch,
            volume: voiceSettings.volume
          });
        }, 300);
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert('Erro ao traduzir. Tente novamente.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePhraseSelect = (phrase: CommonPhrase) => {
    const sender: 'VENDOR' | 'TOURIST' = 'VENDOR';
    const fromLang = Language.PT_BR;
    const toLang = touristLanguage;

    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender,
      originalText: phrase.translations[fromLang],
      translatedText: phrase.translations[toLang],
      timestamp: Date.now(),
      originalLanguage: fromLang,
      targetLanguage: toLang,
      isFromCommonPhrase: true
    };

    onAddMessage(newMessage);

    if (voiceSettings.enabled && voiceSettings.autoPlay) {
      setTimeout(() => {
        speechService.speak(phrase.translations[toLang], toLang, {
          rate: voiceSettings.rate,
          pitch: voiceSettings.pitch,
          volume: voiceSettings.volume
        });
      }, 300);
    }
  };

  const touristLangInfo = getLanguageInfo(touristLanguage);

  return (
    <div className="flex flex-col h-full bg-charcoal-deep relative">
      {/* Header - Reorganized with Centered Logo */}
      <header className="sticky top-0 z-30 bg-charcoal border-b-4 border-sun-gold animate-slide-up">
        {/* Row 1: Back Button + Centered Logo */}
        <div className="flex items-center justify-between px-4 pt-6 pb-3">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center justify-center size-10 rounded-sm bg-charcoal-soft text-white hover:bg-sun-gold hover:text-charcoal-deep active:scale-95 transition-all"
            title="Voltar"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>

          {/* Centered Logo */}
          <div className="flex items-center gap-0">
            {/* Sun Icon - Golden Square */}
            <div className="w-11 h-11 bg-sun-gold rounded-l-md flex items-center justify-center shadow-lg">
              <span className="material-symbols-outlined text-charcoal-deep text-2xl fill-1">wb_sunny</span>
            </div>
            {/* Text - Red Background */}
            <div className="h-11 bg-red-500 rounded-r-md px-3 flex items-center shadow-lg">
              <span className="text-lg font-black tracking-tight text-white font-display">BitsSun</span>
            </div>
          </div>

          {/* Spacer for symmetry */}
          <div className="size-10"></div>
        </div>

        {/* Row 2: Keyboard Button + Action Buttons */}
        <div className="grid grid-cols-7 gap-1 px-4 pb-3">
          {/* Keyboard Input Button */}
          <button
            onClick={() => handleTextInput(currentSpeaker)}
            className="flex items-center justify-center h-14 w-full rounded-sm bg-charcoal-soft text-white hover:bg-sun-gold hover:text-charcoal-deep active:scale-95 transition-all shadow-lg"
            title="Digitar Mensagem"
          >
            <span className="material-symbols-outlined text-3xl">keyboard</span>
          </button>

          {/* Action Buttons */}
          <div className="contents">
            {/* Flashlight Toggle */}
            <button
              onClick={toggleFlashlight}
              className={`flex items-center justify-center h-14 w-full rounded-sm transition-all shadow-lg active:scale-95 ${flashlightOn
                ? 'bg-sun-gold text-charcoal-deep hover:bg-sun-gold/80'
                : 'bg-charcoal-soft text-white hover:bg-white hover:text-charcoal-deep'
                }`}
              title={flashlightOn ? 'Lanterna Ligada (Clique para Desligar)' : 'Lanterna Desligada (Clique para Ligar)'}
            >
              <span className="material-symbols-outlined text-3xl fill-1">
                {flashlightOn ? 'flashlight_on' : 'flashlight_off'}
              </span>
            </button>

            {/* Voice Mode Toggle */}
            <button
              onClick={() => setAutoPlayVoice(!autoPlayVoice)}
              className={`flex items-center justify-center h-14 w-full rounded-sm transition-all shadow-lg active:scale-95 ${autoPlayVoice
                ? 'bg-sun-gold text-charcoal-deep hover:bg-sun-gold/80'
                : 'bg-charcoal-soft text-white hover:bg-white hover:text-charcoal-deep'
                }`}
              title={autoPlayVoice ? 'Voz Automática (Clique para Desativar)' : 'Voz Manual (Clique para Ativar)'}
            >
              <span className="material-symbols-outlined text-3xl fill-1">
                {autoPlayVoice ? 'volume_up' : 'volume_off'}
              </span>
            </button>

            <button
              onClick={() => setShowPhrasesModal(true)}
              className="flex items-center justify-center h-14 w-full rounded-sm bg-charcoal-soft text-white hover:bg-white hover:text-charcoal-deep active:scale-95 transition-all shadow-lg"
              title="Frases Comuns"
            >
              <span className="material-symbols-outlined text-3xl fill-1">chat_bubble</span>
            </button>
            <button
              onClick={onOpenUtility}
              className="flex items-center justify-center h-14 w-full rounded-sm bg-charcoal-soft text-white hover:bg-white hover:text-charcoal-deep active:scale-95 transition-all shadow-lg"
              title="Calculadora"
            >
              <span className="material-symbols-outlined text-3xl">calculate</span>
            </button>
            <button
              onClick={onClear}
              className="flex items-center justify-center h-14 w-full rounded-sm bg-charcoal-soft text-white hover:bg-white hover:text-charcoal-deep active:scale-95 transition-all shadow-lg"
              title="Limpar"
            >
              <span className="material-symbols-outlined text-3xl">delete</span>
            </button>

            {/* Export Button - Direct Email */}
            <button
              onClick={exportConversation}
              className="flex items-center justify-center h-14 w-full rounded-sm bg-charcoal-soft text-white hover:bg-sun-gold hover:text-charcoal-deep active:scale-95 transition-all shadow-lg"
              title="Exportar por Email"
            >
              <span className="material-symbols-outlined text-3xl">email</span>
            </button>
          </div>
        </div>

        {/* Row 3: Language Buttons - Equal Width Grid */}
        <div className="grid grid-cols-[1fr_40px_1fr] items-center px-4 pb-4 gap-3">
          {/* Vendedor - Equal Width */}
          <div className="flex flex-col bg-vendor-green rounded-sm px-4 py-3 border-l-4 border-vendor-green-dark h-[60px] justify-center">
            <span className="text-[9px] font-black uppercase text-white/70 tracking-widest leading-tight">Vendedor</span>
            <span className="text-base font-extrabold text-white truncate leading-tight">🇧🇷 Português</span>
          </div>

          {/* Sync Icon - Fixed 40px */}
          <div className="flex items-center justify-center">
            <span className="material-symbols-outlined text-sun-gold text-2xl">sync_alt</span>
          </div>

          {/* Turista - Equal Width */}
          <div className="h-[60px]">
            <LanguageSelector
              selectedLanguage={touristLanguage}
              onSelect={onTouristLanguageChange}
              label="Turista"
              excludedLanguages={[Language.PT_BR]}
            />
          </div>
        </div>
      </header>

      {/* Messages */}
      <main
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 space-y-4 hide-scrollbar bg-charcoal-deep"
      >
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center py-12 animate-scale-in">
            <div className="w-20 h-20 bg-sun-gold rounded-sm flex items-center justify-center mb-4 shadow-lg">
              <span className="material-symbols-outlined text-charcoal-deep text-4xl fill-1">translate</span>
            </div>
            <p className="text-white/60 font-bold text-base">
              Pressione um botão abaixo para começar a conversa
            </p>
          </div>
        )}

        {messages.map((msg) => {
          const isVendor = msg.sender === 'VENDOR';
          const langInfo = isVendor
            ? { flag: '🇧🇷', name: 'Você' }
            : { flag: touristLangInfo?.flag || '🌍', name: 'Turista' };

          return (
            <div
              key={msg.id}
              className={`flex flex-col gap-1.5 ${isVendor ? 'items-start' : 'items-end'}`}
            >
              <span className="text-[10px] font-black text-white/50 uppercase tracking-widest px-1">
                {langInfo.flag} {langInfo.name}
              </span>

              <div
                className={`max-w-[85%] rounded-sm px-4 py-3 shadow-lg relative group ${isVendor
                  ? 'bg-vendor-green border-l-4 border-vendor-green-dark text-white'
                  : 'bg-tourist-coral border-l-4 border-tourist-coral-dark text-white'
                  }`}
              >
                <p className="text-lg font-bold leading-snug">
                  {msg.originalText}
                </p>
                <div className={`h-px w-full my-2 ${isVendor ? 'bg-white/20' : 'bg-white/20'}`}></div>
                <p className="text-sm font-medium opacity-90 italic">
                  {msg.translatedText}
                </p>

                {/* Audio button */}
                <button
                  onClick={() => {
                    if (msg.targetLanguage) {
                      speechService.speak(msg.translatedText, msg.targetLanguage);
                    }
                  }}
                  className="absolute -bottom-2 -right-2 w-8 h-8 bg-surface rounded-full shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity border border-border-light"
                  title="Repetir áudio"
                >
                  <span className="material-symbols-outlined text-charcoal text-base">volume_up</span>
                </button>

                {msg.isFromCommonPhrase && (
                  <div className="absolute -top-2 -left-2 w-6 h-6 bg-sun-gold rounded-sm shadow flex items-center justify-center">
                    <span className="material-symbols-outlined text-charcoal-deep text-sm fill-1">star</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex justify-center py-4">
            <div className="flex items-center gap-3 bg-sun-gold px-5 py-3 rounded-sm shadow-lg animate-pulse">
              <div className="animate-spin w-5 h-5 border-3 border-charcoal-deep border-t-transparent rounded-sm"></div>
              <span className="text-sm font-black text-charcoal-deep uppercase tracking-wide">Traduzindo...</span>
            </div>
          </div>
        )}
      </main>

      {/* Footer - Voice Buttons */}
      <footer className="bg-charcoal border-t-4 border-sun-gold p-4 pb-6">
        <div className="grid grid-cols-2 gap-4">
          <button
            disabled={isProcessing}
            onClick={() => handleVoiceInput('VENDOR')}
            className="flex flex-col items-center justify-center gap-3 min-h-[130px] bg-vendor-green text-white rounded-sm shadow-xl border-l-4 border-vendor-green-dark hover:translate-y-[-3px] hover:shadow-2xl active:translate-y-0 transition-all disabled:opacity-50"
          >
            <div className="size-16 bg-white/20 rounded-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl fill-1">mic</span>
            </div>
            <span className="text-base font-black uppercase tracking-widest">Vendedor</span>
          </button>

          <button
            disabled={isProcessing}
            onClick={() => handleVoiceInput('TOURIST')}
            className="flex flex-col items-center justify-center gap-3 min-h-[130px] bg-tourist-coral text-white rounded-sm shadow-xl border-l-4 border-tourist-coral-dark hover:translate-y-[-3px] hover:shadow-2xl active:translate-y-0 transition-all disabled:opacity-50"
          >
            <div className="size-16 bg-white/20 rounded-sm flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl fill-1">translate</span>
            </div>
            <span className="text-base font-black uppercase tracking-widest">Turista</span>
          </button>
        </div>

        {/* Copyright Footer */}
        <div className="mt-4 text-center">
          <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">
            © 2025 JCBULHOES
          </p>
        </div>
      </footer>

      {/* Voice Recorder Modal */}
      {showVoiceRecorder && (
        <VoiceRecorder
          isRecording={speechService.getIsListening()}
          transcript={voiceTranscript}
          error={voiceError}
          onClose={() => {
            speechService.stopListening();
            setShowVoiceRecorder(false);
            setVoiceTranscript('');
            setVoiceError('');
          }}
          language={currentSpeaker === 'VENDOR' ? Language.PT_BR : touristLanguage}
        />
      )}

      {/* Common Phrases Modal */}
      <PhrasesModal
        isOpen={showPhrasesModal}
        onClose={() => setShowPhrasesModal(false)}
        onSelectPhrase={handlePhraseSelect}
        currentLanguage={Language.PT_BR}
      />
    </div>
  );
};

export default ChatScreen;

