<div align="center">
  <h1>☀️ BitsSun</h1>
  <p><strong>Venda para o Mundo. Sem Barreiras.</strong></p>
  <p>Uma plataforma de tradução instantânea projetada para vendedores de praia e turistas, quebrando barreiras linguísticas com tecnologia híbrida e design brutalista.</p>
</div>

## 🚀 Funcionalidades Principais

### 🗣️ Tradução Híbrida Inteligente (Custo Zero)
Arquitetura robusta de 4 camadas para tradução rápida e econômica:
1.  **Cache Local (Zero Latência):** Armazena traduções frequentes por 30 dias.
2.  **Frases Offline:** Biblioteca com 200+ frases comuns de vendas pré-carregadas.
3.  **MyMemory API (Gratuito):** Fallback para frases novas (até 5000/dia).
4.  **Gemini AI (Premium):** Qualidade superior para frases complexas e contexto.

### 🛠️ Ferramentas para Vendedores
- **Lanterna Integrada:** Para vendas noturnas e sinalização.
- **Calculadora Multimoeda:** Conversão em tempo real (BRL ↔ USD/EUR) com formatação correta de milhar/centavos.
- **Modo Voz Híbrido:** Reprodução automática ou manual das traduções.
- **Exportação de Conversa:** Compartilhe o histórico via Email.

### 🎨 Design & UX
- **Estilo Brutalista:** Interface de alto contraste, elementos geométricos e tipografia impactante.
- **Layout Responsivo:** Grid de 7 colunas no header para distribuição perfeita dos botões.
- **Consistência:** Identidade visual unificada em todas as telas (Landing, Chat, Utilidades).

## 🛠️ Tecnologias

- **Frontend:** React, TypeScript, Tailwind CSS (Vite)
- **AI & Tradução:** Google Gemini API, MyMemory API
- **Voz:** Web Speech API (Recognition & Synthesis)
- **Estado:** React Hooks + LocalStorage Persistence

## 📦 Instalação e Execução

**Pré-requisitos:** Node.js instalado.

1.  **Instale as dependências:**
    ```bash
    npm install
    ```

2.  **Configure a API Key:**
    Crie um arquivo `.env.local` na raiz e adicione sua chave Gemini:
    ```env
    VITE_GEMINI_API_KEY=sua_chave_aqui
    ```
    *(Nota: O sistema funciona parcialmente mesmo sem a chave, usando as camadas gratuitas)*

3.  **Execute o projeto:**
    ```bash
    npm run dev
    ```

## 📱 PWA & Mobile
O projeto está otimizado para uso mobile, com áreas de toque grandes (min 48px), feedback tátil visual e suporte a instalação como PWA (em breve).

---
<div align="center">
  <small>© 2025 JCBULHOES</small>
</div>
