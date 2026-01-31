
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('Uncaught error:', error, errorInfo);
    }

    private handleReload = () => {
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="flex flex-col h-screen bg-charcoal-deep items-center justify-center p-6 text-center">
                    {/* Brutalist Error Icon */}
                    <div className="relative mb-8 animate-shake">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-tourist-coral rounded-sm rotate-12 translate-x-2 -translate-y-2"></div>
                        <div className="relative w-24 h-24 bg-charcoal border-4 border-tourist-coral rounded-sm flex items-center justify-center shadow-2xl">
                            <span className="material-symbols-outlined text-tourist-coral text-6xl">error</span>
                        </div>
                    </div>

                    <h1 className="text-4xl font-black text-white mb-2 uppercase tracking-tight font-display">
                        Ops! Algo deu errado
                    </h1>

                    <p className="text-white/60 font-bold mb-8 max-w-sm">
                        Ocorreu um erro inesperado. Não se preocupe, seus dados estão seguros.
                    </p>

                    <div className="bg-charcoal p-4 rounded-sm border-l-4 border-tourist-coral mb-8 max-w-md w-full text-left overflow-auto max-h-40 hide-scrollbar">
                        <p className="text-tourist-coral font-mono text-xs font-bold mb-1">DETALHES DO ERRO:</p>
                        <p className="text-white/80 font-mono text-xs break-all">
                            {this.state.error?.message || 'Erro desconhecido'}
                        </p>
                    </div>

                    <button
                        onClick={this.handleReload}
                        className="px-8 py-4 bg-sun-gold text-charcoal-deep rounded-sm font-black text-lg shadow-xl border-b-4 border-sun-gold/60 hover:translate-y-[-2px] active:translate-y-0 transition-all flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined text-2xl fill-1">refresh</span>
                        REINICIAR APLICATIVO
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
