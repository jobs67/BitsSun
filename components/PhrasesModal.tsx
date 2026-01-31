
import React, { useState } from 'react';
import { Language } from '../types';
import { COMMON_PHRASES, CATEGORY_LABELS, getPhrasesByCategory, CommonPhrase } from '../services/commonPhrases';

interface PhrasesModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectPhrase: (phrase: CommonPhrase) => void;
    currentLanguage: Language;
}

const PhrasesModal: React.FC<PhrasesModalProps> = ({
    isOpen,
    onClose,
    onSelectPhrase,
    currentLanguage
}) => {
    const [selectedCategory, setSelectedCategory] = useState<CommonPhrase['category']>('greetings');
    const [searchQuery, setSearchQuery] = useState('');

    if (!isOpen) return null;

    const categories = Object.keys(CATEGORY_LABELS) as CommonPhrase['category'][];
    const phrases = searchQuery
        ? COMMON_PHRASES.filter(p =>
            p.translations[currentLanguage].toLowerCase().includes(searchQuery.toLowerCase())
        )
        : getPhrasesByCategory(selectedCategory);

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-charcoal-deep/80 backdrop-blur-sm">
            <div className="bg-surface rounded-t-card sm:rounded-card w-full sm:max-w-lg sm:mx-4 max-h-[85vh] flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center justify-between p-5 border-b border-border-light">
                    <div>
                        <h3 className="text-lg font-bold text-charcoal">Frases Comuns</h3>
                        <p className="text-xs text-charcoal-soft">Toque para usar</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-9 h-9 flex items-center justify-center rounded-full bg-charcoal-soft/10 hover:bg-charcoal-soft/20 transition-colors"
                    >
                        <span className="material-symbols-outlined text-charcoal-soft text-xl">close</span>
                    </button>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-border-light">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-soft text-xl">
                            search
                        </span>
                        <input
                            type="text"
                            placeholder="Buscar frase..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-surface-alt border border-border-light rounded-btn focus:outline-none focus:ring-2 focus:ring-sun-gold focus:border-transparent text-charcoal"
                        />
                    </div>
                </div>

                {/* Categories */}
                {!searchQuery && (
                    <div className="flex flex-wrap gap-2 px-4 py-3 border-b border-border-light">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-pill whitespace-nowrap font-bold text-sm transition-all ${selectedCategory === category
                                    ? 'bg-sun-gold text-charcoal-deep shadow-md'
                                    : 'bg-charcoal-soft/10 text-charcoal-soft hover:bg-charcoal-soft/20'
                                    }`}
                            >
                                <span>{CATEGORY_LABELS[category].icon}</span>
                                <span>{CATEGORY_LABELS[category].pt}</span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Phrases List */}
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {phrases.length === 0 ? (
                        <div className="text-center py-12">
                            <span className="material-symbols-outlined text-charcoal-soft/30 text-5xl mb-3">
                                search_off
                            </span>
                            <p className="text-charcoal-soft text-sm">Nenhuma frase encontrada</p>
                        </div>
                    ) : (
                        phrases.map((phrase) => (
                            <button
                                key={phrase.id}
                                onClick={() => {
                                    onSelectPhrase(phrase);
                                    onClose();
                                }}
                                className="w-full text-left p-4 bg-surface-alt hover:bg-sun-light rounded-btn transition-colors border border-border-light hover:border-sun-gold group"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-charcoal mb-1">
                                            {phrase.translations[currentLanguage]}
                                        </p>
                                        {currentLanguage !== Language.PT_BR && (
                                            <p className="text-xs text-charcoal-soft italic">
                                                {phrase.translations[Language.PT_BR]}
                                            </p>
                                        )}
                                    </div>
                                    <span className="material-symbols-outlined text-charcoal-soft group-hover:text-sun-gold transition-colors">
                                        add_circle
                                    </span>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-border-light bg-surface-alt">
                    <p className="text-xs text-center text-charcoal-soft">
                        {phrases.length} {phrases.length === 1 ? 'frase disponível' : 'frases disponíveis'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PhrasesModal;
