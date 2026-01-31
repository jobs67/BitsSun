
import React from 'react';
import { Language, SUPPORTED_LANGUAGES } from '../services/languageConfig';

interface LanguageSelectorProps {
    selectedLanguage: Language;
    onSelect: (language: Language) => void;
    label?: string;
    excludedLanguages?: Language[];
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
    selectedLanguage,
    onSelect,
    label,
    excludedLanguages = []
}) => {
    const [isOpen, setIsOpen] = React.useState(false);

    const selectedLang = SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage);
    const availableLanguages = SUPPORTED_LANGUAGES.filter(l => !excludedLanguages.includes(l.code));

    return (
        <div className="relative h-full">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-full flex flex-col items-start justify-center bg-tourist-coral rounded-sm px-4 py-2 border-l-4 border-tourist-coral-dark hover:translate-y-[-1px] active:translate-y-0 transition-transform"
            >
                {label && (
                    <span className="text-[9px] font-black uppercase text-white/70 tracking-widest">
                        {label}
                    </span>
                )}
                <div className="flex items-center gap-1">
                    <span className="text-base font-extrabold text-white truncate">
                        {selectedLang?.flag} {selectedLang?.nativeName}
                    </span>
                    <span className={`material-symbols-outlined text-white/70 text-sm transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                        expand_more
                    </span>
                </div>
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown - Brutalist */}
                    <div className="absolute top-full left-0 right-0 mt-2 bg-charcoal-deep border-2 border-sun-gold rounded-sm shadow-2xl z-50 overflow-hidden">
                        {availableLanguages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    onSelect(lang.code);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 border-b border-white/10 hover:bg-sun-gold/20 transition-colors ${lang.code === selectedLanguage ? 'bg-sun-gold/30' : ''
                                    }`}
                            >
                                <span className="text-xl">{lang.flag}</span>
                                <div className="flex-1 text-left">
                                    <div className="text-sm font-bold text-white">{lang.nativeName}</div>
                                    <div className="text-xs text-white/60">{lang.name}</div>
                                </div>
                                {lang.code === selectedLanguage && (
                                    <span className="material-symbols-outlined text-sun-gold fill-1">check</span>
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default LanguageSelector;
