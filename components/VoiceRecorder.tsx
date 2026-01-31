
import React, { useState, useEffect } from 'react';
import { Language } from '../types';
import { getLanguageInfo } from '../services/languageConfig';

interface VoiceRecorderProps {
    isRecording: boolean;
    transcript: string;
    onClose: () => void;
    language: Language;
    error?: string;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({
    isRecording,
    transcript,
    onClose,
    language,
    error
}) => {
    const [audioLevel, setAudioLevel] = useState(0);
    const [duration, setDuration] = useState(0);

    const langInfo = getLanguageInfo(language);

    useEffect(() => {
        if (!isRecording) {
            setDuration(0);
            return;
        }

        const levelInterval = setInterval(() => {
            setAudioLevel(Math.random() * 100);
        }, 100);

        const durationInterval = setInterval(() => {
            setDuration(prev => prev + 1);
        }, 1000);

        return () => {
            clearInterval(levelInterval);
            clearInterval(durationInterval);
        };
    }, [isRecording]);

    const formatDuration = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal-deep/80 backdrop-blur-sm">
            <div className="bg-surface rounded-card p-6 max-w-sm w-full mx-4 shadow-2xl">
                {/* Header */}
                <div className="text-center mb-5">
                    <h3 className="text-lg font-bold text-charcoal mb-1">
                        {isRecording ? 'Ouvindo...' : 'Pronto para gravar'}
                    </h3>
                    <p className="text-sm text-charcoal-soft">
                        {isRecording ? 'Fale agora' : 'Clique no microfone para começar'}
                    </p>
                </div>

                {/* Recording Animation */}
                <div className="relative flex items-center justify-center mb-5">
                    {isRecording && (
                        <>
                            <div className="absolute w-28 h-28 bg-sun-gold/30 rounded-full animate-ping" />
                            <div className="absolute w-36 h-36 bg-sun-gold/10 rounded-full animate-pulse" />
                        </>
                    )}

                    <div className={`relative w-20 h-20 rounded-full flex items-center justify-center shadow-xl transition-all ${isRecording ? 'bg-sun-gold' : 'bg-charcoal-soft'
                        }`}>
                        <span className={`material-symbols-outlined text-4xl ${isRecording ? 'text-charcoal-deep' : 'text-white'}`}>
                            {isRecording ? 'mic' : 'mic_off'}
                        </span>
                    </div>
                </div>

                {/* Audio Level Indicator */}
                {isRecording && (
                    <div className="mb-4">
                        <div className="h-2 bg-sun-light rounded-full overflow-hidden">
                            <div
                                className="h-full bg-sun-gold transition-all duration-100"
                                style={{ width: `${audioLevel}%` }}
                            />
                        </div>
                    </div>
                )}

                {/* Duration */}
                {isRecording && (
                    <div className="text-center mb-4">
                        <span className="text-2xl font-mono font-bold text-charcoal">
                            {formatDuration(duration)}
                        </span>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="mb-4 p-3 bg-tourist-coral/10 rounded-btn border border-tourist-coral/30">
                        <div className="flex items-start gap-2">
                            <span className="material-symbols-outlined text-tourist-coral text-lg">error</span>
                            <div>
                                <p className="text-sm text-tourist-coral font-semibold mb-0.5">Erro</p>
                                <p className="text-xs text-tourist-coral-dark">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Transcript */}
                {transcript && !error && (
                    <div className="mb-4 p-3 bg-vendor-green/10 rounded-btn border border-vendor-green/30">
                        <p className="text-xs text-vendor-green font-semibold mb-1">Reconhecido:</p>
                        <p className="text-sm text-charcoal font-medium">{transcript}</p>
                    </div>
                )}

                {/* Language indicator */}
                <div className="text-center mb-5">
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-sun-light text-charcoal rounded-pill text-xs font-bold">
                        <span>{langInfo?.flag}</span>
                        <span>{langInfo?.nativeName}</span>
                    </span>
                </div>

                {/* Close button */}
                <button
                    onClick={onClose}
                    className={`w-full py-3 font-bold rounded-btn transition-colors ${transcript
                            ? 'bg-vendor-green text-white'
                            : 'bg-charcoal-soft/10 text-charcoal hover:bg-charcoal-soft/20'
                        }`}
                >
                    {transcript ? 'Enviar' : 'Cancelar'}
                </button>
            </div>
        </div>
    );
};

export default VoiceRecorder;
