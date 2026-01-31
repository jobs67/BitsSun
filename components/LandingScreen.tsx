
import React, { useState, useEffect } from 'react';
import { isSpeechRecognitionSupported } from '../services/speechService';
import { validateApiKey, isGeminiAvailable } from '../services/geminiService';

interface LandingScreenProps {
  onStart: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onStart }) => {
  const [showWarning, setShowWarning] = useState(false);
  const [apiKeyStatus, setApiKeyStatus] = useState<'valid' | 'invalid' | 'missing' | 'checking'>('checking');

  useEffect(() => {
    setShowWarning(!isSpeechRecognitionSupported());

    // Validate API Key on mount
    const checkApiKey = async () => {
      if (!isGeminiAvailable()) {
        setApiKeyStatus('missing');
        return;
      }

      const status = await validateApiKey();
      setApiKeyStatus(status);
    };

    checkApiKey();
  }, []);

  const [clickCount, setClickCount] = useState(0);

  const handleLogoClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);

    if (newCount >= 5) {
      throw new Error("Simulação de Erro Crítico (Teste do Error Boundary)");
    }

    // Reset after 3 seconds if not completed
    setTimeout(() => setClickCount(0), 3000);
  };

  return (
    <div className="flex flex-col h-full bg-charcoal-deep relative overflow-hidden">
      {/* Brutalist geometric background */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-sun-gold rotate-12 translate-x-16 -translate-y-16"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-sun-gold/20 -rotate-12 -translate-x-24 translate-y-24"></div>
      <div className="absolute top-1/2 left-1/2 w-32 h-32 border-4 border-sun-gold/30 rotate-45 -translate-x-1/2 -translate-y-1/2"></div>

      <header className="flex items-center justify-between p-6 z-10 animate-slide-up">
        {/* New Two-Tone Logo */}
        <button className="flex items-center gap-0 active:scale-95 transition-transform" onClick={handleLogoClick}>
          {/* Sun Icon - Golden Square */}
          <div className="w-12 h-12 bg-sun-gold rounded-l-md flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-charcoal-deep text-2xl fill-1">wb_sunny</span>
          </div>
          {/* Text - Red Background */}
          <div className="h-12 bg-red-500 rounded-r-md px-4 flex items-center shadow-lg">
            <span className="text-xl font-black tracking-tight text-white font-display">BitsSun</span>
          </div>
        </button>
      </header>

      {/* Browser Warning */}
      {showWarning && (
        <div className="mx-6 mb-4 p-4 bg-tourist-coral border-l-4 border-tourist-coral-dark z-10 animate-shake">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-white text-xl">warning</span>
            <div className="flex-1">
              <p className="text-sm font-bold text-white mb-1">Navegador não suportado</p>
              <p className="text-xs text-white/80">
                Para melhor experiência, use Chrome ou Edge.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* API Key Status Indicator */}
      {apiKeyStatus !== 'checking' && (
        <div className={`mx-6 mb-4 p-4 border-l-4 z-10 animate-slide-up ${apiKeyStatus === 'valid'
          ? 'bg-vendor-green border-vendor-green-dark'
          : apiKeyStatus === 'missing'
            ? 'bg-sun-gold border-sun-gold/60'
            : 'bg-tourist-coral border-tourist-coral-dark'
          }`}>
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-white text-xl fill-1">
              {apiKeyStatus === 'valid' ? 'check_circle' : apiKeyStatus === 'missing' ? 'info' : 'error'}
            </span>
            <div className="flex-1">
              <p className={`text-sm font-bold mb-1 ${apiKeyStatus === 'missing' ? 'text-charcoal-deep' : 'text-white'}`}>
                {apiKeyStatus === 'valid'
                  ? '✅ Gemini AI Ativo'
                  : apiKeyStatus === 'missing'
                    ? '⚠️ Modo Gratuito'
                    : '❌ API Key Inválida'}
              </p>
              <p className={`text-xs ${apiKeyStatus === 'missing' ? 'text-charcoal-deep/80' : 'text-white/80'}`}>
                {apiKeyStatus === 'valid'
                  ? 'Tradução premium disponível via Gemini AI.'
                  : apiKeyStatus === 'missing'
                    ? 'Usando MyMemory API (gratuito). Configure VITE_GEMINI_API_KEY para melhor qualidade.'
                    : 'Verifique sua chave no arquivo .env.local'}
              </p>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 flex flex-col items-center justify-center px-6 z-10">
        {/* Bold typography hero */}
        <div className="text-center mb-10 animate-slide-up">
          <h1 className="text-5xl font-display font-extrabold text-white mb-2 leading-none tracking-tight">
            AQUI
          </h1>
          <h2 className="text-4xl font-display font-extrabold text-sun-gold leading-none tracking-tight">
            O GRINGO COMPRA
          </h2>
        </div>

        {/* Sharp phone mockup */}
        <div className="relative w-72 mb-10 animate-scale-in delay-200">
          <div className="relative mx-auto w-40 h-64 bg-charcoal border-4 border-sun-gold rounded-sm shadow-2xl flex flex-col pt-4 overflow-hidden">
            {/* Status bar */}
            <div className="h-2 w-16 bg-sun-gold mx-auto mb-4"></div>

            {/* Chat bubbles - sharp */}
            <div className="px-3 space-y-3">
              <div className="self-start bg-vendor-green p-2 rounded-sm w-24">
                <div className="w-full h-2 bg-white/60 rounded-sm"></div>
                <div className="w-3/4 h-2 bg-white/40 rounded-sm mt-1"></div>
              </div>
              <div className="self-end bg-sun-gold p-2 rounded-sm w-28 ml-auto">
                <div className="w-full h-2 bg-charcoal-deep/40 rounded-sm"></div>
                <div className="w-2/3 h-2 bg-charcoal-deep/30 rounded-sm mt-1"></div>
              </div>
              <div className="self-start bg-tourist-coral p-2 rounded-sm w-20">
                <div className="w-full h-2 bg-white/60 rounded-sm"></div>
              </div>
            </div>

            {/* Mic button */}
            <div className="mt-auto pb-4 flex justify-center">
              <div className="w-12 h-12 rounded-sm bg-sun-gold flex items-center justify-center animate-pulse-energy">
                <span className="material-symbols-outlined text-charcoal-deep text-xl fill-1">mic</span>
              </div>
            </div>
          </div>

          {/* Floating language badges - sharp */}
          <div className="absolute -left-4 top-1/2 bg-vendor-green p-2 px-4 rounded-sm shadow-xl border-l-4 border-vendor-green-dark flex items-center gap-2 animate-bounce-in delay-300">
            <span className="text-lg">🇺🇸</span>
            <span className="text-sm font-black text-white">Hello!</span>
          </div>
          <div className="absolute -right-4 top-1/4 bg-tourist-coral p-2 px-4 rounded-sm shadow-xl border-l-4 border-tourist-coral-dark flex items-center gap-2 animate-bounce-in delay-400">
            <span className="text-lg">🇪🇸</span>
            <span className="text-sm font-black text-white">¡Hola!</span>
          </div>
        </div>

        {/* Tagline */}
        <p className="text-white/70 text-base font-bold text-center mb-8 max-w-xs animate-slide-up delay-200">
          Tradução instantânea por voz. Negocie com o mundo.
        </p>

        {/* CTA Button - Brutalist */}
        <button
          onClick={onStart}
          className="w-full py-6 bg-sun-gold text-charcoal-deep rounded-sm font-black text-xl shadow-xl border-b-4 border-sun-gold/60 hover:translate-y-[-2px] hover:shadow-2xl active:translate-y-0 active:shadow-lg transition-all flex items-center justify-center gap-3 animate-scale-in delay-300"
        >
          <span className="material-symbols-outlined text-3xl fill-1">mic</span>
          BORA VENDER
        </button>
      </main>

      <footer className="py-4 text-center z-10">
        <span className="text-white/40 text-[10px] font-bold tracking-widest uppercase">
          © 2025 JCBULHOES
        </span>
      </footer>
    </div>
  );
};

export default LandingScreen;
