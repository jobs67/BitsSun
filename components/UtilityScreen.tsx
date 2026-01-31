
import React, { useState } from 'react';
import { Message, Language } from '../types';
import { translateText } from '../services/geminiService';
import { speechService } from '../services/speechService';
import { getLanguageInfo } from '../services/languageConfig';

interface UtilityScreenProps {
  onBack: () => void;
  onAddMessage: (msg: Message) => void;
  touristLanguage: Language;
}

interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number;
  locale: string;
}

const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'Dólar Americano', rate: 0.17, locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.16, locale: 'de-DE' },
];

const BRL_CURRENCY: Currency = { code: 'BRL', symbol: 'R$', name: 'Real', rate: 1, locale: 'pt-BR' };

const UtilityScreen: React.FC<UtilityScreenProps> = ({ onBack, onAddMessage, touristLanguage }) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0]);
  const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInverted, setIsInverted] = useState(false); // false = BRL->USD/EUR, true = USD/EUR->BRL
  const [discountMode, setDiscountMode] = useState(false); // Discount calculator mode
  const [originalValue, setOriginalValue] = useState('0');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [pixKey, setPixKey] = useState('');
  const [showPixModal, setShowPixModal] = useState(false);
  const [tempPixKey, setTempPixKey] = useState('');
  const [showSendMenu, setShowSendMenu] = useState(false);
  const [rawValue, setRawValue] = useState('0'); // Raw digits for auto-decimal

  // Helper to format numbers based on locale
  const formatNumber = (val: string, locale: string) => {
    // Split into integer and decimal parts
    const parts = val.split(',');
    const integerPart = parts[0];
    const decimalPart = parts.length > 1 ? parts[1] : null;

    // Clean non-numeric chars from integer part for formatting
    const cleanInteger = integerPart.replace(/\D/g, '');

    // Create formatter
    const formatter = new Intl.NumberFormat(locale);

    // Format integer part
    let formattedInteger = cleanInteger;
    if (cleanInteger) {
      formattedInteger = formatter.format(BigInt(cleanInteger));
    }

    // Reassemble
    const decimalSeparator = locale === 'en-US' ? '.' : ',';

    // Handle cases like "0," or just formatted integer
    if (decimalPart !== null) {
      return `${formattedInteger}${decimalSeparator}${decimalPart}`;
    }

    // If original had comma but no decimal part yet (typing "123,")
    if (val.includes(',')) {
      return `${formattedInteger}${decimalSeparator}`;
    }

    return formattedInteger || '0';
  };

  const formatExpression = (expr: string, locale: string) => {
    // Split by operators but keep them
    const tokens = expr.split(/([+\-×÷])/);
    return tokens.map(token => {
      // If operator, return as is
      if (['+', '-', '×', '÷'].includes(token)) return ` ${token} `;
      // If number, format it
      return formatNumber(token, locale);
    }).join('');
  };

  // Format raw digits as currency (last 2 digits = centavos)
  const formatCurrency = (raw: string) => {
    // Remove leading zeros
    const cleaned = raw.replace(/^0+/, '') || '0';
    const len = cleaned.length;

    if (len <= 2) {
      // 0-99 centavos
      return `0,${cleaned.padStart(2, '0')}`;
    } else {
      // Split into reais and centavos
      const reais = cleaned.slice(0, len - 2);
      const centavos = cleaned.slice(len - 2);
      return `${reais},${centavos}`;
    }
  };

  // Load PIX key from localStorage on mount
  React.useEffect(() => {
    const savedPixKey = localStorage.getItem('bitssun_pix_key');
    if (savedPixKey) {
      setPixKey(savedPixKey);
    }
  }, []);

  const savePixKey = () => {
    if (tempPixKey.trim()) {
      localStorage.setItem('bitssun_pix_key', tempPixKey.trim());
      setPixKey(tempPixKey.trim());
      setShowPixModal(false);
      setTempPixKey('');
    }
  };

  const handleSendPix = async () => {
    if (!pixKey) {
      setShowPixModal(true);
      return;
    }

    const value = display;
    const pixMessage = `💰 Pagamento PIX\n\nValor: R$ ${formatNumber(value, 'pt-BR')}\n\n🔑 Chave PIX:\n${pixKey}`;

    setIsProcessing(true);
    try {
      const translated = await translateText(pixMessage, Language.PT_BR, touristLanguage);
      const newMessage: Message = {
        id: Date.now().toString(),
        sender: 'VENDOR',
        originalText: pixMessage,
        translatedText: translated,
        timestamp: Date.now(),
        originalLanguage: Language.PT_BR,
        targetLanguage: touristLanguage
      };
      onAddMessage(newMessage);

      speechService.speak(translated, touristLanguage);

      onBack();
    } catch (error) {
      console.error('Error sending PIX:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const applyDiscount = (percent: number) => {
    const val = parseFloat(display.replace(',', '.'));
    if (isNaN(val)) return;

    setOriginalValue(display);
    setDiscountPercent(percent);
    const discountAmount = val * (percent / 100);
    const finalValue = val - discountAmount;
    // Format with 2 decimals and update raw value
    const formatted = finalValue.toFixed(2);
    setDisplay(formatted.replace('.', ','));
    setRawValue((finalValue * 100).toFixed(0));
  };

  const handleKey = (key: string) => {
    // Toggle discount mode when % is pressed
    if (key === '%') {
      if (discountMode) {
        // Exit discount mode
        setDiscountMode(false);
        setOriginalValue('0');
        setDiscountPercent(0);
      } else {
        // Enter discount mode
        setDiscountMode(true);
        setOriginalValue(display);
      }
      return;
    }

    if (key === 'C') {
      setDisplay('0,00');
      setRawValue('0');
      setExpression('');
      setDiscountMode(false);
      setOriginalValue('0');
      setDiscountPercent(0);
      return;
    }

    if (key === '=') {
      if (expression) {
        try {
          // Evaluate the full expression
          const fullExpression = expression + display.replace(',', '.');
          const result = eval(fullExpression.replace('×', '*').replace('÷', '/'));
          const formatted = parseFloat(result).toFixed(2);
          setDisplay(formatted.replace('.', ','));
          setRawValue((result * 100).toFixed(0));
          setExpression('');
        } catch {
          setDisplay('Erro');
          setExpression('');
        }
      }
      return;
    }

    if (key === 'backspace') {
      const newRaw = rawValue.length > 1 ? rawValue.slice(0, -1) : '0';
      setRawValue(newRaw);
      setDisplay(formatCurrency(newRaw));
      return;
    }

    // Handle operators (+, -, ×, ÷)
    if (['+', '-', '×', '÷'].includes(key)) {
      if (expression) {
        // Evaluate current expression first
        try {
          const fullExpression = expression + display.replace(',', '.');
          const result = eval(fullExpression.replace('×', '*').replace('÷', '/'));
          const formatted = parseFloat(result).toFixed(2);
          setDisplay(formatted.replace('.', ','));
          setRawValue((result * 100).toFixed(0));
          setExpression(formatted.replace('.', ',') + key);
        } catch {
          setExpression(display + key);
        }
      } else {
        setExpression(display + key);
      }
      setRawValue('0');
      return;
    }

    // Handle number input (0-9)
    if (/^[0-9]$/.test(key)) {
      const newRaw = rawValue === '0' ? key : rawValue + key;
      setRawValue(newRaw);
      setDisplay(formatCurrency(newRaw));
    }
  };

  const getConverted = () => {
    try {
      // Parse current display value (last number if expression)
      const parts = display.split(/[+\-×÷]/);
      const currentValStr = parts[parts.length - 1];
      const val = parseFloat(currentValStr.replace(',', '.'));

      if (isNaN(val)) return '0,00';

      let result = 0;
      if (isInverted) {
        // Foreign -> BRL
        result = val / selectedCurrency.rate;
        return result.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      } else {
        // BRL -> Foreign
        result = val * selectedCurrency.rate;
        return result.toLocaleString(selectedCurrency.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    } catch {
      return '0,00';
    }
  };

  const toggleConversion = () => {
    setIsInverted(!isInverted);
  };

  // Determine current active locale for the main display
  const currentDisplayLocale = isInverted ? selectedCurrency.locale : 'pt-BR';

  const handleShareToChat = async () => {
    const brlValue = display;
    const convertedValue = getConverted();

    if (brlValue === '0' || brlValue === 'Erro') {
      return;
    }

    setIsProcessing(true);

    try {
      const originalText = `O valor é ${formatExpression(brlValue, 'pt-BR')} (R$) = ${convertedValue} (${selectedCurrency.code})`;

      let translatedText = originalText;
      if (touristLanguage !== Language.PT_BR) {
        translatedText = await translateText(originalText, Language.PT_BR, touristLanguage);
      }

      const newMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'VENDOR',
        originalText,
        translatedText,
        timestamp: Date.now(),
        originalLanguage: Language.PT_BR,
        targetLanguage: touristLanguage
      };

      onAddMessage(newMessage);

      setTimeout(() => {
        speechService.speak(translatedText, touristLanguage);
      }, 300);

      onBack();
    } catch (error) {
      console.error('Error sharing to chat:', error);
      setIsProcessing(false);
    }
  };

  const touristLangInfo = getLanguageInfo(touristLanguage);

  return (
    <div className="flex flex-col h-full bg-charcoal-deep relative">
      {/* Header - Brutalist */}
      <header className="sticky top-0 z-30 bg-charcoal border-b-4 border-sun-gold animate-slide-up">
        <div className="flex items-center justify-between px-5 pt-10 pb-4">
          <button
            onClick={onBack}
            className="flex items-center justify-center size-12 rounded-sm bg-charcoal-soft text-white shadow-lg hover:translate-y-[-2px] active:translate-y-0 transition-transform"
          >
            <span className="material-symbols-outlined text-2xl">arrow_back</span>
          </button>

          {/* New Two-Tone Logo */}
          <div className="flex items-center gap-0">
            {/* Sun Icon - Golden Square */}
            <div className="w-10 h-10 bg-sun-gold rounded-l-md flex items-center justify-center">
              <span className="material-symbols-outlined text-charcoal-deep text-xl fill-1">wb_sunny</span>
            </div>
            {/* Text - Red Background */}
            <div className="h-10 bg-red-500 rounded-r-md px-3 flex items-center">
              <span className="text-base font-black tracking-tight text-white font-display">BitsSun</span>
            </div>
          </div>

          {/* Spacer to center logo */}
          <div className="size-12"></div>
        </div>
      </header>

      <main className="flex-1 flex flex-col p-5 overflow-y-auto hide-scrollbar">
        {/* Display - Brutalist */}
        <div className="flex flex-col justify-end gap-3 bg-charcoal rounded-sm p-5 shadow-xl border-l-4 border-sun-gold mb-5">
          <div className="text-right text-white/50 text-sm font-bold overflow-hidden whitespace-nowrap h-5">
            {formatExpression(expression, currentDisplayLocale)}
          </div>

          {/* Source Currency */}
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-black border-l-4 ${isInverted ? 'bg-sun-gold text-charcoal-deep border-sun-gold/60' : 'bg-vendor-green text-white border-vendor-green-dark'}`}>
              {isInverted ? `${selectedCurrency.code}` : '🇧🇷 BRL'}
            </div>
            <div className="text-right text-white text-4xl font-black tracking-tight overflow-hidden whitespace-nowrap">
              {isInverted
                ? `${selectedCurrency.symbol} ${formatExpression(display, selectedCurrency.locale)}`
                : `R$ ${formatExpression(display, 'pt-BR')}`}
            </div>
          </div>

          {/* Swap Button */}
          <button
            onClick={toggleConversion}
            className="flex items-center justify-center gap-2 py-2 bg-sun-gold/20 hover:bg-sun-gold/40 rounded-sm transition-colors"
          >
            <span className="material-symbols-outlined text-sun-gold text-2xl">swap_vert</span>
            <span className="text-sun-gold text-xs font-bold uppercase tracking-widest">Alternar</span>
          </button>

          {/* Converted Currency */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowCurrencyPicker(!showCurrencyPicker)}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm text-sm font-black hover:translate-y-[-1px] active:translate-y-0 transition-transform ${isInverted ? 'bg-vendor-green text-white border-l-4 border-vendor-green-dark' : 'bg-sun-gold text-charcoal-deep'}`}
            >
              {isInverted ? '🇧🇷 BRL' : selectedCurrency.code}
              <span className="material-symbols-outlined text-lg">expand_more</span>
            </button>
            <div className={`text-right text-3xl font-black tracking-tight overflow-hidden whitespace-nowrap ${isInverted ? 'text-white' : 'text-sun-gold'}`}>
              {isInverted
                ? `R$ ${getConverted()}`
                : `${selectedCurrency.symbol} ${getConverted()}`}
            </div>
          </div>

          {/* Currency Picker */}
          {showCurrencyPicker && (
            <div className="mt-2 bg-charcoal-deep rounded-sm border-2 border-sun-gold overflow-hidden">
              {CURRENCIES.map((currency) => (
                <button
                  key={currency.code}
                  onClick={() => {
                    setSelectedCurrency(currency);
                    setShowCurrencyPicker(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-sun-gold/20 transition-colors border-b border-white/10 ${currency.code === selectedCurrency.code ? 'bg-sun-gold/30' : ''
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-black text-white">{currency.symbol}</span>
                    <span className="text-sm text-white/70">{currency.name}</span>
                  </div>
                  <span className="text-xs font-black text-white/50">{currency.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Discount Mode - Percentage Buttons */}
        {discountMode && (
          <div className="mb-4 p-4 bg-charcoal rounded-sm border-l-4 border-sun-gold">
            <div className="text-white/70 text-xs font-bold uppercase tracking-widest mb-3">Desconto Rápido</div>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15, 20, 25, 30].map(percent => (
                <button
                  key={percent}
                  onClick={() => applyDiscount(percent)}
                  className="py-3 bg-sun-gold text-charcoal-deep rounded-sm font-black text-lg hover:translate-y-[-2px] active:translate-y-0 transition-all shadow-lg"
                >
                  {percent}%
                </button>
              ))}
            </div>
            {discountPercent > 0 && (
              <div className="mt-3 pt-3 border-t border-white/10 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Valor Original:</span>
                  <span className="text-white font-bold">R$ {formatNumber(originalValue, 'pt-BR')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-white/50">Desconto ({discountPercent}%):</span>
                  <span className="text-tourist-coral font-bold">-R$ {formatNumber((parseFloat(originalValue.replace(',', '.')) * (discountPercent / 100)).toString().replace('.', ','), 'pt-BR')}</span>
                </div>
                <div className="flex justify-between text-lg pt-2 border-t border-white/10">
                  <span className="text-sun-gold font-black">Valor Final:</span>
                  <span className="text-sun-gold font-black">R$ {formatNumber(display, 'pt-BR')}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Keypad - Grid */}
        <div className="grid grid-cols-4 gap-3">
          <CalcKey label="C" onClick={() => handleKey('C')} variant="danger" />
          <CalcKey label={<span className="material-symbols-outlined text-2xl">backspace</span>} onClick={() => handleKey('backspace')} variant="secondary" />
          <CalcKey
            label={
              <div className="flex flex-col items-center gap-0">
                <span className="material-symbols-outlined text-2xl fill-1">sell</span>
                <span className="text-[9px] font-black tracking-wider">DESC</span>
              </div>
            }
            onClick={() => handleKey('%')}
            variant="discount"
          />
          <CalcKey label="÷" onClick={() => handleKey('÷')} variant="operator" />

          <CalcKey label="7" onClick={() => handleKey('7')} />
          <CalcKey label="8" onClick={() => handleKey('8')} />
          <CalcKey label="9" onClick={() => handleKey('9')} />
          <CalcKey label="×" onClick={() => handleKey('×')} variant="operator" />

          <CalcKey label="4" onClick={() => handleKey('4')} />
          <CalcKey label="5" onClick={() => handleKey('5')} />
          <CalcKey label="6" onClick={() => handleKey('6')} />
          <CalcKey label="-" onClick={() => handleKey('-')} variant="operator" />

          <CalcKey label="1" onClick={() => handleKey('1')} />
          <CalcKey label="2" onClick={() => handleKey('2')} />
          <CalcKey label="3" onClick={() => handleKey('3')} />
          <CalcKey label="+" onClick={() => handleKey('+')} variant="operator" />

          <CalcKey label="0" onClick={() => handleKey('0')} className="col-span-2" />
          <CalcKey label="00" onClick={() => {
            const newRaw = rawValue === '0' ? '0' : rawValue + '00';
            setRawValue(newRaw);
            setDisplay(formatCurrency(newRaw));
          }} />
          <CalcKey label="=" onClick={() => handleKey('=')} variant="operator" />
        </div>

        {/* Unified Send Button with PIX Option */}
        <div className="mt-auto relative">
          <button
            onClick={handleShareToChat}
            disabled={isProcessing || display === '0' || display === 'Erro'}
            className="flex items-center justify-center gap-3 py-5 w-full bg-vendor-green text-white rounded-sm font-black text-lg shadow-xl border-l-4 border-vendor-green-dark hover:translate-y-[-2px] active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? (
              <>
                <div className="animate-spin w-5 h-5 border-3 border-white border-t-transparent rounded-sm"></div>
                <span className="uppercase tracking-wide">Enviando...</span>
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-2xl fill-1">send</span>
                <span className="uppercase tracking-wide">Enviar para o Chat</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSendMenu(!showSendMenu);
                  }}
                  className="ml-auto px-3 py-2 bg-[#FF6B35] hover:bg-[#FF5722] rounded-sm transition-all animate-pulse border-2 border-[#E85D2A]"
                >
                  <span className="text-sm font-black text-white">PIX</span>
                </button>
              </>
            )}
          </button>

          {/* PIX Send Menu */}
          {showSendMenu && (
            <div className="absolute bottom-full mb-2 right-0 bg-charcoal rounded-sm border-2 border-sun-gold shadow-xl overflow-hidden w-64">
              <button
                onClick={() => {
                  handleSendPix();
                  setShowSendMenu(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-4 bg-[#FF6B35] hover:bg-[#FF5722] transition-all text-left border-l-4 border-[#E85D2A] animate-pulse"
              >
                <span className="text-3xl">💳</span>
                <div className="flex-1">
                  <div className="text-white font-black text-base">Enviar com PIX</div>
                  <div className="text-white/90 text-xs font-bold">
                    {pixKey ? '✓ Chave configurada' : '⚠️ Configurar chave'}
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-charcoal border-t-4 border-sun-gold px-5 py-4 text-center">
        <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">
          © 2025 JCBULHOES
        </p>
      </footer>

      {/* PIX Key Modal */}
      {showPixModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-5 z-50">
          <div className="bg-charcoal rounded-sm border-l-4 border-sun-gold p-6 max-w-md w-full">
            <h3 className="text-white font-black text-xl mb-2">Configurar Chave PIX</h3>
            <p className="text-white/70 text-sm mb-4">
              Salve sua chave PIX para enviar informações de pagamento aos clientes.
            </p>
            <input
              type="text"
              value={tempPixKey}
              onChange={(e) => setTempPixKey(e.target.value)}
              placeholder="Digite sua chave PIX (CPF, e-mail, telefone...)"
              className="w-full bg-charcoal-deep text-white px-4 py-3 rounded-sm border-2 border-white/20 focus:border-sun-gold outline-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowPixModal(false);
                  setTempPixKey('');
                }}
                className="flex-1 py-3 bg-charcoal-soft text-white rounded-sm font-bold hover:translate-y-[-2px] transition-all"
              >
                Cancelar
              </button>
              <button
                onClick={savePixKey}
                disabled={!tempPixKey.trim()}
                className="flex-1 py-3 bg-sun-gold text-charcoal-deep rounded-sm font-black hover:translate-y-[-2px] transition-all disabled:opacity-50"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface CalcKeyProps {
  label: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'secondary' | 'operator' | 'danger' | 'discount';
  className?: string;
}

const CalcKey: React.FC<CalcKeyProps> = ({ label, onClick, variant = 'default', className = '' }) => {
  const variants = {
    default: 'bg-charcoal-soft text-white',
    secondary: 'bg-charcoal text-white/70',
    operator: 'bg-sun-gold text-charcoal-deep font-black',
    danger: 'bg-tourist-coral text-white font-black',
    discount: 'bg-blue-600 text-white font-black border-2 border-white'
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-center h-16 rounded-sm text-2xl font-bold shadow-lg hover:translate-y-[-2px] active:translate-y-0 transition-all ${variants[variant]} ${className}`}
    >
      {label}
    </button>
  );
};

export default UtilityScreen;
