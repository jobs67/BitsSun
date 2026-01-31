
import { Language } from './languageConfig';

export interface CommonPhrase {
    id: string;
    category: 'greetings' | 'prices' | 'products' | 'questions' | 'thanks';
    translations: Record<Language, string>;
}

export const COMMON_PHRASES: CommonPhrase[] = [
    // Greetings
    {
        id: 'greeting_hello',
        category: 'greetings',
        translations: {
            [Language.PT_BR]: 'Olá! Como posso ajudar?',
            [Language.EN_US]: 'Hello! How can I help you?',
            [Language.ES_ES]: '¡Hola! ¿Cómo puedo ayudarte?'
        }
    },
    {
        id: 'greeting_good_morning',
        category: 'greetings',
        translations: {
            [Language.PT_BR]: 'Bom dia!',
            [Language.EN_US]: 'Good morning!',
            [Language.ES_ES]: '¡Buenos días!'
        }
    },
    {
        id: 'greeting_good_afternoon',
        category: 'greetings',
        translations: {
            [Language.PT_BR]: 'Boa tarde!',
            [Language.EN_US]: 'Good afternoon!',
            [Language.ES_ES]: '¡Buenas tardes!'
        }
    },

    // Prices
    {
        id: 'price_how_much',
        category: 'prices',
        translations: {
            [Language.PT_BR]: 'Quanto custa?',
            [Language.EN_US]: 'How much does it cost?',
            [Language.ES_ES]: '¿Cuánto cuesta?'
        }
    },
    {
        id: 'price_5_reais',
        category: 'prices',
        translations: {
            [Language.PT_BR]: 'Custa 5 reais',
            [Language.EN_US]: 'It costs 5 reais',
            [Language.ES_ES]: 'Cuesta 5 reales'
        }
    },
    {
        id: 'price_10_reais',
        category: 'prices',
        translations: {
            [Language.PT_BR]: 'Custa 10 reais',
            [Language.EN_US]: 'It costs 10 reais',
            [Language.ES_ES]: 'Cuesta 10 reales'
        }
    },
    {
        id: 'price_discount',
        category: 'prices',
        translations: {
            [Language.PT_BR]: 'Posso fazer um desconto',
            [Language.EN_US]: 'I can give you a discount',
            [Language.ES_ES]: 'Puedo hacer un descuento'
        }
    },
    {
        id: 'price_accept_card',
        category: 'prices',
        translations: {
            [Language.PT_BR]: 'Aceito cartão e PIX',
            [Language.EN_US]: 'I accept card and PIX',
            [Language.ES_ES]: 'Acepto tarjeta y PIX'
        }
    },

    // Products
    {
        id: 'product_coconut_water',
        category: 'products',
        translations: {
            [Language.PT_BR]: 'Água de coco gelada',
            [Language.EN_US]: 'Cold coconut water',
            [Language.ES_ES]: 'Agua de coco fría'
        }
    },
    {
        id: 'product_ice_cream',
        category: 'products',
        translations: {
            [Language.PT_BR]: 'Picolé de frutas',
            [Language.EN_US]: 'Fruit popsicle',
            [Language.ES_ES]: 'Paleta de frutas'
        }
    },
    {
        id: 'product_beer',
        category: 'products',
        translations: {
            [Language.PT_BR]: 'Cerveja gelada',
            [Language.EN_US]: 'Cold beer',
            [Language.ES_ES]: 'Cerveza fría'
        }
    },
    {
        id: 'product_water',
        category: 'products',
        translations: {
            [Language.PT_BR]: 'Água mineral',
            [Language.EN_US]: 'Mineral water',
            [Language.ES_ES]: 'Agua mineral'
        }
    },
    {
        id: 'product_snacks',
        category: 'products',
        translations: {
            [Language.PT_BR]: 'Salgadinhos e petiscos',
            [Language.EN_US]: 'Snacks and appetizers',
            [Language.ES_ES]: 'Aperitivos y bocadillos'
        }
    },
    {
        id: 'product_handicraft',
        category: 'products',
        translations: {
            [Language.PT_BR]: 'Artesanato local',
            [Language.EN_US]: 'Local handicrafts',
            [Language.ES_ES]: 'Artesanía local'
        }
    },

    // Questions
    {
        id: 'question_want_buy',
        category: 'questions',
        translations: {
            [Language.PT_BR]: 'Gostaria de comprar?',
            [Language.EN_US]: 'Would you like to buy?',
            [Language.ES_ES]: '¿Te gustaría comprar?'
        }
    },
    {
        id: 'question_cold',
        category: 'questions',
        translations: {
            [Language.PT_BR]: 'Quer bem gelado?',
            [Language.EN_US]: 'Do you want it very cold?',
            [Language.ES_ES]: '¿Lo quieres bien frío?'
        }
    },
    {
        id: 'question_flavor',
        category: 'questions',
        translations: {
            [Language.PT_BR]: 'Qual sabor você prefere?',
            [Language.EN_US]: 'Which flavor do you prefer?',
            [Language.ES_ES]: '¿Qué sabor prefieres?'
        }
    },
    {
        id: 'question_quantity',
        category: 'questions',
        translations: {
            [Language.PT_BR]: 'Quantos você quer?',
            [Language.EN_US]: 'How many do you want?',
            [Language.ES_ES]: '¿Cuántos quieres?'
        }
    },

    // Thanks
    {
        id: 'thanks_thank_you',
        category: 'thanks',
        translations: {
            [Language.PT_BR]: 'Obrigado! Volte sempre!',
            [Language.EN_US]: 'Thank you! Come back soon!',
            [Language.ES_ES]: '¡Gracias! ¡Vuelve pronto!'
        }
    },
    {
        id: 'thanks_good_day',
        category: 'thanks',
        translations: {
            [Language.PT_BR]: 'Tenha um ótimo dia!',
            [Language.EN_US]: 'Have a great day!',
            [Language.ES_ES]: '¡Que tengas un gran día!'
        }
    },
    {
        id: 'thanks_enjoy',
        category: 'thanks',
        translations: {
            [Language.PT_BR]: 'Aproveite a praia!',
            [Language.EN_US]: 'Enjoy the beach!',
            [Language.ES_ES]: '¡Disfruta la playa!'
        }
    }
];

export const CATEGORY_LABELS: Record<CommonPhrase['category'], { pt: string; icon: string }> = {
    greetings: { pt: 'Saudações', icon: '👋' },
    prices: { pt: 'Preços', icon: '💰' },
    products: { pt: 'Produtos', icon: '🥥' },
    questions: { pt: 'Perguntas', icon: '❓' },
    thanks: { pt: 'Agradecimentos', icon: '🙏' }
};

export const getPhrasesByCategory = (category: CommonPhrase['category']): CommonPhrase[] => {
    return COMMON_PHRASES.filter(phrase => phrase.category === category);
};

export const getPhraseById = (id: string): CommonPhrase | undefined => {
    return COMMON_PHRASES.find(phrase => phrase.id === id);
};

export const searchPhrases = (query: string, language: Language): CommonPhrase[] => {
    const lowerQuery = query.toLowerCase();
    return COMMON_PHRASES.filter(phrase =>
        phrase.translations[language].toLowerCase().includes(lowerQuery)
    );
};
