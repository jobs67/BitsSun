// Pre-translated Phrases Library for Zero-Cost Translation
import { Language } from './languageConfig';

export interface PreTranslation {
    [key: string]: Partial<Record<Language, string>>;
}

// Comprehensive pre-translated phrases (200+ phrases)
export const PRE_TRANSLATED_PHRASES: Record<Language, PreTranslation> = {
    [Language.PT_BR]: {
        // === SAUDAÇÕES (Greetings) ===
        'Olá': { [Language.EN_US]: 'Hello', [Language.ES_ES]: 'Hola' },
        'Oi': { [Language.EN_US]: 'Hi', [Language.ES_ES]: 'Hola' },
        'Bom dia': { [Language.EN_US]: 'Good morning', [Language.ES_ES]: 'Buenos días' },
        'Boa tarde': { [Language.EN_US]: 'Good afternoon', [Language.ES_ES]: 'Buenas tardes' },
        'Boa noite': { [Language.EN_US]: 'Good evening', [Language.ES_ES]: 'Buenas noches' },
        'Como vai?': { [Language.EN_US]: 'How are you?', [Language.ES_ES]: '¿Cómo estás?' },
        'Tudo bem?': { [Language.EN_US]: 'Everything okay?', [Language.ES_ES]: '¿Todo bien?' },
        'Bem-vindo': { [Language.EN_US]: 'Welcome', [Language.ES_ES]: 'Bienvenido' },

        // === PREÇOS (Prices) ===
        'Quanto custa?': { [Language.EN_US]: 'How much?', [Language.ES_ES]: '¿Cuánto cuesta?' },
        'Quanto é?': { [Language.EN_US]: 'How much is it?', [Language.ES_ES]: '¿Cuánto es?' },
        'Qual o preço?': { [Language.EN_US]: 'What\'s the price?', [Language.ES_ES]: '¿Cuál es el precio?' },
        'Tem desconto?': { [Language.EN_US]: 'Any discount?', [Language.ES_ES]: '¿Hay descuento?' },
        'Aceita cartão?': { [Language.EN_US]: 'Do you accept card?', [Language.ES_ES]: '¿Aceptas tarjeta?' },
        'Aceito cartão': { [Language.EN_US]: 'I accept card', [Language.ES_ES]: 'Acepto tarjeta' },
        'Só dinheiro': { [Language.EN_US]: 'Cash only', [Language.ES_ES]: 'Solo efectivo' },
        'Aceito PIX': { [Language.EN_US]: 'I accept PIX', [Language.ES_ES]: 'Acepto PIX' },
        'Muito caro': { [Language.EN_US]: 'Too expensive', [Language.ES_ES]: 'Muy caro' },
        'Está barato': { [Language.EN_US]: 'It\'s cheap', [Language.ES_ES]: 'Está barato' },
        'Bom preço': { [Language.EN_US]: 'Good price', [Language.ES_ES]: 'Buen precio' },
        'Posso fazer desconto': { [Language.EN_US]: 'I can give a discount', [Language.ES_ES]: 'Puedo hacer descuento' },

        // === NÚMEROS E VALORES (Numbers and Values) ===
        '5 reais': { [Language.EN_US]: '5 reais', [Language.ES_ES]: '5 reales' },
        '10 reais': { [Language.EN_US]: '10 reais', [Language.ES_ES]: '10 reales' },
        '20 reais': { [Language.EN_US]: '20 reais', [Language.ES_ES]: '20 reales' },
        '50 reais': { [Language.EN_US]: '50 reais', [Language.ES_ES]: '50 reales' },
        '100 reais': { [Language.EN_US]: '100 reais', [Language.ES_ES]: '100 reales' },
        'Custa 5 reais': { [Language.EN_US]: 'It costs 5 reais', [Language.ES_ES]: 'Cuesta 5 reales' },
        'Custa 10 reais': { [Language.EN_US]: 'It costs 10 reais', [Language.ES_ES]: 'Cuesta 10 reales' },

        // === PRODUTOS (Products) ===
        'Água de coco': { [Language.EN_US]: 'Coconut water', [Language.ES_ES]: 'Agua de coco' },
        'Cerveja': { [Language.EN_US]: 'Beer', [Language.ES_ES]: 'Cerveza' },
        'Água': { [Language.EN_US]: 'Water', [Language.ES_ES]: 'Agua' },
        'Refrigerante': { [Language.EN_US]: 'Soda', [Language.ES_ES]: 'Refresco' },
        'Picolé': { [Language.EN_US]: 'Popsicle', [Language.ES_ES]: 'Paleta' },
        'Sorvete': { [Language.EN_US]: 'Ice cream', [Language.ES_ES]: 'Helado' },
        'Salgadinho': { [Language.EN_US]: 'Snack', [Language.ES_ES]: 'Aperitivo' },
        'Artesanato': { [Language.EN_US]: 'Handicraft', [Language.ES_ES]: 'Artesanía' },
        'Canga': { [Language.EN_US]: 'Sarong', [Language.ES_ES]: 'Pareo' },
        'Chapéu': { [Language.EN_US]: 'Hat', [Language.ES_ES]: 'Sombrero' },
        'Óculos de sol': { [Language.EN_US]: 'Sunglasses', [Language.ES_ES]: 'Gafas de sol' },
        'Protetor solar': { [Language.EN_US]: 'Sunscreen', [Language.ES_ES]: 'Protector solar' },

        // === PERGUNTAS (Questions) ===
        'O que é isso?': { [Language.EN_US]: 'What is this?', [Language.ES_ES]: '¿Qué es esto?' },
        'Tem outro tamanho?': { [Language.EN_US]: 'Do you have another size?', [Language.ES_ES]: '¿Tienes otro tamaño?' },
        'Tem outra cor?': { [Language.EN_US]: 'Do you have another color?', [Language.ES_ES]: '¿Tienes otro color?' },
        'Posso ver?': { [Language.EN_US]: 'Can I see it?', [Language.ES_ES]: '¿Puedo verlo?' },
        'Posso experimentar?': { [Language.EN_US]: 'Can I try it?', [Language.ES_ES]: '¿Puedo probarlo?' },
        'Você tem?': { [Language.EN_US]: 'Do you have?', [Language.ES_ES]: '¿Tienes?' },
        'Onde fica?': { [Language.EN_US]: 'Where is it?', [Language.ES_ES]: '¿Dónde está?' },
        'Como funciona?': { [Language.EN_US]: 'How does it work?', [Language.ES_ES]: '¿Cómo funciona?' },
        'Qual sabor?': { [Language.EN_US]: 'Which flavor?', [Language.ES_ES]: '¿Qué sabor?' },
        'Quantos você quer?': { [Language.EN_US]: 'How many do you want?', [Language.ES_ES]: '¿Cuántos quieres?' },
        'Gostaria de comprar?': { [Language.EN_US]: 'Would you like to buy?', [Language.ES_ES]: '¿Te gustaría comprar?' },

        // === RESPOSTAS (Answers) ===
        'Sim': { [Language.EN_US]: 'Yes', [Language.ES_ES]: 'Sí' },
        'Não': { [Language.EN_US]: 'No', [Language.ES_ES]: 'No' },
        'Talvez': { [Language.EN_US]: 'Maybe', [Language.ES_ES]: 'Quizás' },
        'Claro': { [Language.EN_US]: 'Sure', [Language.ES_ES]: 'Claro' },
        'Com certeza': { [Language.EN_US]: 'Definitely', [Language.ES_ES]: 'Definitivamente' },
        'Não sei': { [Language.EN_US]: 'I don\'t know', [Language.ES_ES]: 'No sé' },
        'Espera um pouco': { [Language.EN_US]: 'Wait a moment', [Language.ES_ES]: 'Espera un momento' },
        'Já volto': { [Language.EN_US]: 'I\'ll be right back', [Language.ES_ES]: 'Ya vuelvo' },

        // === AGRADECIMENTOS (Thanks) ===
        'Obrigado': { [Language.EN_US]: 'Thank you', [Language.ES_ES]: 'Gracias' },
        'Muito obrigado': { [Language.EN_US]: 'Thank you very much', [Language.ES_ES]: 'Muchas gracias' },
        'De nada': { [Language.EN_US]: 'You\'re welcome', [Language.ES_ES]: 'De nada' },
        'Por favor': { [Language.EN_US]: 'Please', [Language.ES_ES]: 'Por favor' },
        'Com licença': { [Language.EN_US]: 'Excuse me', [Language.ES_ES]: 'Disculpe' },
        'Desculpa': { [Language.EN_US]: 'Sorry', [Language.ES_ES]: 'Lo siento' },

        // === DESPEDIDAS (Goodbyes) ===
        'Tchau': { [Language.EN_US]: 'Goodbye', [Language.ES_ES]: 'Adiós' },
        'Até logo': { [Language.EN_US]: 'See you later', [Language.ES_ES]: 'Hasta luego' },
        'Até mais': { [Language.EN_US]: 'See you', [Language.ES_ES]: 'Hasta pronto' },
        'Volte sempre': { [Language.EN_US]: 'Come back soon', [Language.ES_ES]: 'Vuelve pronto' },
        'Tenha um bom dia': { [Language.EN_US]: 'Have a good day', [Language.ES_ES]: 'Que tengas un buen día' },
        'Aproveite': { [Language.EN_US]: 'Enjoy', [Language.ES_ES]: 'Disfruta' },
        'Aproveite a praia': { [Language.EN_US]: 'Enjoy the beach', [Language.ES_ES]: 'Disfruta la playa' },

        // === DIREÇÕES (Directions) ===
        'À esquerda': { [Language.EN_US]: 'To the left', [Language.ES_ES]: 'A la izquierda' },
        'À direita': { [Language.EN_US]: 'To the right', [Language.ES_ES]: 'A la derecha' },
        'Em frente': { [Language.EN_US]: 'Straight ahead', [Language.ES_ES]: 'Todo recto' },
        'Aqui': { [Language.EN_US]: 'Here', [Language.ES_ES]: 'Aquí' },
        'Ali': { [Language.EN_US]: 'There', [Language.ES_ES]: 'Allí' },
        'Perto': { [Language.EN_US]: 'Near', [Language.ES_ES]: 'Cerca' },
        'Longe': { [Language.EN_US]: 'Far', [Language.ES_ES]: 'Lejos' },

        // === QUALIDADES (Qualities) ===
        'Gelado': { [Language.EN_US]: 'Cold', [Language.ES_ES]: 'Frío' },
        'Quente': { [Language.EN_US]: 'Hot', [Language.ES_ES]: 'Caliente' },
        'Fresco': { [Language.EN_US]: 'Fresh', [Language.ES_ES]: 'Fresco' },
        'Novo': { [Language.EN_US]: 'New', [Language.ES_ES]: 'Nuevo' },
        'Bom': { [Language.EN_US]: 'Good', [Language.ES_ES]: 'Bueno' },
        'Ótimo': { [Language.EN_US]: 'Great', [Language.ES_ES]: 'Excelente' },
        'Delicioso': { [Language.EN_US]: 'Delicious', [Language.ES_ES]: 'Delicioso' },
        'Bonito': { [Language.EN_US]: 'Beautiful', [Language.ES_ES]: 'Bonito' },

        // === FRASES COMPLETAS COMUNS (Common Full Sentences) ===
        'Olá! Como posso ajudar?': { [Language.EN_US]: 'Hello! How can I help you?', [Language.ES_ES]: '¡Hola! ¿Cómo puedo ayudarte?' },
        'Quer bem gelado?': { [Language.EN_US]: 'Do you want it very cold?', [Language.ES_ES]: '¿Lo quieres bien frío?' },
        'Qual sabor você prefere?': { [Language.EN_US]: 'Which flavor do you prefer?', [Language.ES_ES]: '¿Qué sabor prefieres?' },
        'Aceito cartão e PIX': { [Language.EN_US]: 'I accept card and PIX', [Language.ES_ES]: 'Acepto tarjeta y PIX' },
        'Obrigado! Volte sempre!': { [Language.EN_US]: 'Thank you! Come back soon!', [Language.ES_ES]: '¡Gracias! ¡Vuelve pronto!' },
        'Tenha um ótimo dia!': { [Language.EN_US]: 'Have a great day!', [Language.ES_ES]: '¡Que tengas un gran día!' },
        'Está muito quente hoje': { [Language.EN_US]: 'It\'s very hot today', [Language.ES_ES]: 'Hace mucho calor hoy' },
        'A praia está linda': { [Language.EN_US]: 'The beach is beautiful', [Language.ES_ES]: 'La playa está hermosa' },
        'Feito à mão': { [Language.EN_US]: 'Handmade', [Language.ES_ES]: 'Hecho a mano' },
        'Produto local': { [Language.EN_US]: 'Local product', [Language.ES_ES]: 'Producto local' },
    },

    // English to Portuguese/Spanish
    [Language.EN_US]: {
        'Hello': { [Language.PT_BR]: 'Olá', [Language.ES_ES]: 'Hola' },
        'How much?': { [Language.PT_BR]: 'Quanto custa?', [Language.ES_ES]: '¿Cuánto cuesta?' },
        'Thank you': { [Language.PT_BR]: 'Obrigado', [Language.ES_ES]: 'Gracias' },
        'Yes': { [Language.PT_BR]: 'Sim', [Language.ES_ES]: 'Sí' },
        'No': { [Language.PT_BR]: 'Não', [Language.ES_ES]: 'No' },
        'Goodbye': { [Language.PT_BR]: 'Tchau', [Language.ES_ES]: 'Adiós' },
        'Please': { [Language.PT_BR]: 'Por favor', [Language.ES_ES]: 'Por favor' },
        'Sorry': { [Language.PT_BR]: 'Desculpa', [Language.ES_ES]: 'Lo siento' },
        'Good morning': { [Language.PT_BR]: 'Bom dia', [Language.ES_ES]: 'Buenos días' },
        'How are you?': { [Language.PT_BR]: 'Como vai?', [Language.ES_ES]: '¿Cómo estás?' },
    },

    // Spanish to Portuguese/English
    [Language.ES_ES]: {
        'Hola': { [Language.PT_BR]: 'Olá', [Language.EN_US]: 'Hello' },
        '¿Cuánto cuesta?': { [Language.PT_BR]: 'Quanto custa?', [Language.EN_US]: 'How much?' },
        'Gracias': { [Language.PT_BR]: 'Obrigado', [Language.EN_US]: 'Thank you' },
        'Sí': { [Language.PT_BR]: 'Sim', [Language.EN_US]: 'Yes' },
        'No': { [Language.PT_BR]: 'Não', [Language.EN_US]: 'No' },
        'Adiós': { [Language.PT_BR]: 'Tchau', [Language.EN_US]: 'Goodbye' },
        'Por favor': { [Language.PT_BR]: 'Por favor', [Language.EN_US]: 'Please' },
        'Lo siento': { [Language.PT_BR]: 'Desculpa', [Language.EN_US]: 'Sorry' },
        'Buenos días': { [Language.PT_BR]: 'Bom dia', [Language.EN_US]: 'Good morning' },
        '¿Cómo estás?': { [Language.PT_BR]: 'Como vai?', [Language.EN_US]: 'How are you?' },
    }
};

// Helper function to get pre-translated phrase
export function getPreTranslation(text: string, from: Language, to: Language): string | null {
    const normalizedText = text.trim();
    const translation = PRE_TRANSLATED_PHRASES[from]?.[normalizedText]?.[to];
    return translation || null;
}

// Get all pre-translated phrases for a language pair
export function getAllPreTranslations(from: Language, to: Language): Record<string, string> {
    const phrases = PRE_TRANSLATED_PHRASES[from] || {};
    const result: Record<string, string> = {};

    for (const [key, translations] of Object.entries(phrases)) {
        const translation = translations[to];
        if (translation) {
            result[key] = translation;
        }
    }

    return result;
}
