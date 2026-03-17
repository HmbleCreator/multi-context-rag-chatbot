import { ContextType } from '@/types';

/**
 * Detects the language of the input text
 * Returns ISO 639-1 language code (e.g., 'en', 'es', 'fr')
 */
export function detectLanguage(text: string): string {
  // Simple language detection based on common words
  const langPatterns: Record<string, RegExp[]> = {
    en: [/\b(the|and|or|but|in|on|at|to|for|of|with|by)\b/gi],
    es: [/\b(el|la|los|las|y|o|pero|en|sobre|a|para|de|con|por)\b/gi],
    fr: [/\b(le|la|les|et|ou|mais|dans|sur|à|pour|de|avec|par)\b/gi],
    de: [/\b(der|die|das|und|oder|aber|in|auf|an|zu|für|von|mit|bei)\b/gi],
    pt: [/\b(o|a|os|as|e|ou|mas|em|no|na|para|de|com|por)\b/gi]
  };

  const lowerText = text.toLowerCase();
  const scores: Record<string, number> = {};

  // Initialize scores
  Object.keys(langPatterns).forEach(lang => {
    scores[lang] = 0;
  });

  // Count matches for each language
  Object.entries(langPatterns).forEach(([lang, patterns]) => {
    patterns.forEach(pattern => {
      const matches = lowerText.match(pattern);
      if (matches) {
        scores[lang] += matches.length;
      }
    });
  });

  // Find language with highest score
  let maxScore = 0;
  let detectedLang = 'en'; // Default to English

  Object.entries(scores).forEach(([lang, score]) => {
    if (score > maxScore) {
      maxScore = score;
      detectedLang = lang;
    }
  });

  // If no strong detection, default to English
  return maxScore > 2 ? detectedLang : 'en';
}

/**
 * Translates interface text to target language
 * In a production app, you would use a proper translation service
 */
export const translations: Record<string, Record<string, string>> = {
  en: {
    fallbackGeneral: "I'd be happy to help with that! However, I'm currently running in fallback mode without the AI model connected.\n\nI can help you with:\n- **NEC Electrical Code questions** - Ask about grounding, circuits, wiring methods, etc.\n- **Wattmonk questions** - Learn about our solar design platform, permits, and services\n- **General conversation** - I'm here to chat!\n\nTo get full AI-powered responses, please add a GEMINI_API_KEY to the environment variables.",
    fallbackNoInfo: "I don't have specific information about that in my knowledge base. Please try rephrasing your question or ask about a different topic related to {topic}.",
    noDocuments: "I couldn't find relevant documents for your query.",
    error: "An error occurred while processing your request.",
    welcome: "Hello! I can help you with NEC electrical codes, Wattmonk solar services, or general questions. How can I assist you today?"
  },
  es: {
    fallbackGeneral: "¡Me encantaría ayudarte con eso! Sin embargo, actualmente estoy ejecutando en modo de respaldo sin el modelo de IA conectado.\n\nPuedo ayudarte con:\n- **Preguntas sobre el Código Eléctrico NEC** - Pregunta sobre puesta a tierra, circuitos, métodos de cableado, etc.\n- **Preguntas sobre Wattmonk** - Aprende sobre nuestra plataforma de diseño solar, permisos y servicios\n- **Conversación general** - ¡Estoy aquí para charlar!\n\nPara obtener respuestas completas con IA, por favor agrega una GEMINI_API_KEY a las variables de entorno.",
    fallbackNoInfo: "No tengo información específica sobre eso en mi base de conocimientos. Por favor intenta reformular tu pregunta o preguntar sobre un tema diferente relacionado con {topic}.",
    noDocuments: "No pude encontrar documentos relevantes para tu consulta.",
    error: "Ocurrió un error al procesar tu solicitud.",
    welcome: "¡Hola! Puedo ayudarte con códigos eléctricos NEC, servicios solares de Wattmonk, o preguntas generales. ¿En qué puedo ayudarte hoy?"
  },
  fr: {
    fallbackGeneral: "Je serais heureux de vous aider avec cela! Cependant, je suis actuellement en mode de secours sans le modèle d'IA connecté.\n\nJe peux vous aider avec:\n- **Questions sur le Code Électrique NEC** - Posez des questions sur la mise à la terre, les circuits, les méthodes de câblage, etc.\n- **Questions sur Wattmonk** - Apprenez-en davantage sur notre plateforme de conception solaire, les permis et les services\n- **Conversation générale** - Je suis là pour discuter!\n\nPour obtenir des réponses complètes avec IA, veuillez ajouter une GEMINI_API_KEY aux variables d'environnement.",
    fallbackNoInfo: "Je n'ai pas d'informations spécifiques à ce sujet dans ma base de connaissances. Veuillez essayer de reformuler votre question ou poser une question sur un sujet différent lié à {topic}.",
    noDocuments: "Je n'ai pas pu trouver de documents pertinents pour votre requête.",
    error: "Une erreur est survenue lors du traitement de votre demande.",
    welcome: "Bonjour ! Je peux vous aider avec les codes électriques NEC, les services solaires Wattmonk, ou des questions générales. Comment puis-je vous aider aujourd'hui ?"
  }
};

/**
 * Gets translated text for a given key and language
 */
export function getTranslation(key: string, lang: string = 'en', substitutions: Record<string, string> = {}): string {
  const langTranslations = translations[lang] || translations.en;
  const text = langTranslations[key] || translations.en[key] || key;
  
  // Apply substitutions
  return text.replace(/\{(\w+)\}/g, (match, placeholder) => {
    return substitutions[placeholder] || match;
  });
}