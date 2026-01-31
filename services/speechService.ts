
import { Language } from './languageConfig';

// Check if browser supports Web Speech API
export const isSpeechRecognitionSupported = (): boolean => {
    return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

export const isSpeechSynthesisSupported = (): boolean => {
    return 'speechSynthesis' in window;
};

// Get SpeechRecognition constructor (cross-browser)
const getSpeechRecognition = (): any => {
    return (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
};

export interface SpeechRecognitionResult {
    transcript: string;
    confidence: number;
    isFinal: boolean;
}

export interface SpeechRecognitionCallbacks {
    onResult: (result: SpeechRecognitionResult) => void;
    onError: (error: string) => void;
    onEnd: () => void;
    onStart?: () => void;
}

class SpeechService {
    private recognition: any = null;
    private synthesis: SpeechSynthesis | null = null;
    private isListening: boolean = false;
    private voicesLoaded: boolean = false;

    constructor() {
        if (isSpeechSynthesisSupported()) {
            this.synthesis = window.speechSynthesis;
            // Load voices
            this.loadVoices();
        }
    }

    /**
     * Load available voices
     */
    private loadVoices(): void {
        if (!this.synthesis) return;

        const loadVoicesHandler = () => {
            this.voicesLoaded = true;
        };

        // Chrome loads voices asynchronously
        if (this.synthesis.getVoices().length > 0) {
            this.voicesLoaded = true;
        } else {
            this.synthesis.addEventListener('voiceschanged', loadVoicesHandler);
        }
    }

    /**
     * Check microphone permission status
     */
    async checkMicrophonePermission(): Promise<PermissionState> {
        try {
            const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
            return result.state;
        } catch (error) {
            console.warn('Permissions API not supported:', error);
            return 'prompt';
        }
    }

    /**
     * Request microphone permission proactively
     */
    async requestMicrophonePermission(): Promise<boolean> {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Stop the stream immediately, we just wanted to get permission
            stream.getTracks().forEach(track => track.stop());
            return true;
        } catch (error: any) {
            console.error('Microphone permission denied:', error);
            return false;
        }
    }

    /**
     * Start listening for speech input
     */
    startListening(language: Language, callbacks: SpeechRecognitionCallbacks): boolean {
        if (!isSpeechRecognitionSupported()) {
            callbacks.onError('Reconhecimento de voz não suportado neste navegador. Use Chrome, Edge ou Safari.');
            return false;
        }

        if (this.isListening) {
            this.stopListening();
        }

        const SpeechRecognition = getSpeechRecognition();
        this.recognition = new SpeechRecognition();

        // Configuration
        this.recognition.lang = language;
        this.recognition.continuous = false; // Stop after one phrase
        this.recognition.interimResults = true; // Get partial results
        this.recognition.maxAlternatives = 1;

        // Event handlers
        this.recognition.onstart = () => {
            this.isListening = true;
            console.log('Speech recognition started for language:', language);
            if (callbacks.onStart) callbacks.onStart();
        };

        this.recognition.onresult = (event: any) => {
            const result = event.results[event.results.length - 1];
            const transcript = result[0].transcript;
            const confidence = result[0].confidence;
            const isFinal = result.isFinal;

            console.log('Speech result:', { transcript, confidence, isFinal });

            callbacks.onResult({
                transcript,
                confidence,
                isFinal
            });
        };

        this.recognition.onerror = (event: any) => {
            this.isListening = false;
            let errorMessage = 'Erro no reconhecimento de voz';

            console.error('Speech recognition error:', event.error);

            switch (event.error) {
                case 'no-speech':
                    errorMessage = 'Nenhuma fala detectada. Por favor, fale mais alto e tente novamente.';
                    break;
                case 'audio-capture':
                    errorMessage = 'Microfone não encontrado. Verifique se seu dispositivo possui um microfone conectado.';
                    break;
                case 'not-allowed':
                    errorMessage = 'Permissão de microfone negada. Clique no ícone de cadeado na barra de endereços para permitir o acesso.';
                    break;
                case 'network':
                    errorMessage = 'Erro de rede. Verifique sua conexão com a internet e tente novamente.';
                    break;
                case 'aborted':
                    errorMessage = 'Reconhecimento de voz cancelado.';
                    break;
                case 'service-not-allowed':
                    errorMessage = 'Serviço de reconhecimento de voz não permitido. Verifique as configurações do navegador.';
                    break;
                default:
                    errorMessage = `Erro desconhecido: ${event.error}. Tente novamente.`;
            }

            callbacks.onError(errorMessage);
        };

        this.recognition.onend = () => {
            this.isListening = false;
            console.log('Speech recognition ended');
            callbacks.onEnd();
        };

        try {
            this.recognition.start();
            return true;
        } catch (error: any) {
            console.error('Failed to start speech recognition:', error);
            callbacks.onError('Erro ao iniciar reconhecimento de voz. Tente novamente.');
            return false;
        }
    }

    /**
     * Stop listening
     */
    stopListening(): void {
        if (this.recognition && this.isListening) {
            this.recognition.stop();
            this.isListening = false;
        }
    }

    /**
     * Check if currently listening
     */
    getIsListening(): boolean {
        return this.isListening;
    }

    /**
     * Check if voices are available for a language
     */
    hasVoicesForLanguage(language: Language): boolean {
        if (!this.synthesis || !this.voicesLoaded) return false;

        const voices = this.synthesis.getVoices();
        const langCode = language.split('-')[0];
        return voices.some(voice => voice.lang.startsWith(langCode));
    }

    /**
     * Speak text using Text-to-Speech
     */
    speak(text: string, language: Language, options?: {
        rate?: number;
        pitch?: number;
        volume?: number;
        onEnd?: () => void;
    }): boolean {
        if (!this.synthesis) {
            console.warn('Text-to-Speech não suportado neste navegador');
            return false;
        }

        // Wait for voices to load if needed
        if (!this.voicesLoaded) {
            console.warn('Voices not loaded yet, waiting...');
            setTimeout(() => this.speak(text, language, options), 100);
            return false;
        }

        // Check if voices are available for this language
        if (!this.hasVoicesForLanguage(language)) {
            console.warn(`No voices available for language: ${language}`);
            // Continue anyway, browser will use default voice
        }

        // Cancel any ongoing speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = options?.rate || 1.0;
        utterance.pitch = options?.pitch || 1.0;
        utterance.volume = options?.volume || 1.0;

        if (options?.onEnd) {
            utterance.onend = options.onEnd;
        }

        utterance.onerror = (event) => {
            console.error('Speech synthesis error:', event);
        };

        // Try to find a voice for the language
        const voices = this.synthesis.getVoices();
        const langCode = language.split('-')[0];

        // Prefer voices that match the full locale, then fallback to language code
        let voice = voices.find(v => v.lang === language);
        if (!voice) {
            voice = voices.find(v => v.lang.startsWith(langCode));
        }

        if (voice) {
            utterance.voice = voice;
            console.log('Using voice:', voice.name, 'for language:', language);
        } else {
            console.warn('No specific voice found for language:', language, '- using default');
        }

        this.synthesis.speak(utterance);
        return true;
    }

    /**
     * Stop speaking
     */
    stopSpeaking(): void {
        if (this.synthesis) {
            this.synthesis.cancel();
        }
    }

    /**
     * Get available voices for a language
     */
    getVoicesForLanguage(language: Language): SpeechSynthesisVoice[] {
        if (!this.synthesis) return [];

        const voices = this.synthesis.getVoices();
        const langCode = language.split('-')[0];
        return voices.filter(voice => voice.lang.startsWith(langCode));
    }
}

// Export singleton instance
export const speechService = new SpeechService();
