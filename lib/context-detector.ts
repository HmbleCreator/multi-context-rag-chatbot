import { IntentClassification, ContextType } from '@/types';

// Keywords for context detection
const necKeywords = [
  'nec', 'code', 'electrical', 'grounding', 'bonding', 'conductor', 'circuit',
  'breaker', 'panel', 'outlet', 'receptacle', 'wire', 'ampacity', 'voltage',
  'current', 'overcurrent', 'gfci', 'afci', 'arc fault', 'ground fault',
  'service', 'feeder', 'branch circuit', 'motor', 'hazardous location',
  'class i', 'class ii', 'class iii', 'explosion proof', 'article 110',
  'article 250', 'article 210', 'article 310', 'article 430', 'article 408',
  'dwelling', 'commercial', 'residential wiring', 'electrical installation',
  'junction box', 'raceway', 'conduit', 'romex', 'nm cable', 'thhn',
  'electrical inspector', 'ahj', 'authority having jurisdiction',
];

const wattmonkKeywords = [
  'wattmonk', 'solar', 'pv', 'photovoltaic', 'panel design', 'solar design',
  'permit', 'permitting', 'site assessment', 'roof analysis', 'shading analysis',
  'solar installation', 'solar project', 'energy production', 'kilowatt', 'kw',
  'megawatt', 'mw', 'inverter', 'string sizing', 'module', 'array',
  'solar software', 'ai design', 'automated design', 'solar proposal',
  'solar sales', 'solar installer', 'epc', 'solar contractor', 'financing',
  'solar lease', 'ppa', 'power purchase agreement', 'net metering',
  'solar incentive', 'itc', 'investment tax credit', 'solar rebate',
  'battery storage', 'solar plus storage', 'ev charging', 'charger',
];

const generalKeywords = [
  'hello', 'hi', 'hey', 'how are you', 'what can you do', 'help me',
  'thank', 'thanks', 'goodbye', 'bye', 'see you', 'ok', 'okay',
  'weather', 'time', 'date', 'joke', 'funny', 'tell me about yourself',
  'who are you', 'what is your name', 'how do you work',
];

export function classifyIntent(query: string): IntentClassification {
  const normalized = query.toLowerCase();
  const words = normalized.split(/\s+/);

  let necScore = 0;
  let wattmonkScore = 0;
  let generalScore = 0;

  // Check for NEC keywords
  necKeywords.forEach(keyword => {
    if (normalized.includes(keyword.toLowerCase())) {
      necScore += keyword.split(' ').length * 2; // Weight multi-word matches higher
    }
  });

  // Check for Wattmonk keywords
  wattmonkKeywords.forEach(keyword => {
    if (normalized.includes(keyword.toLowerCase())) {
      wattmonkScore += keyword.split(' ').length * 2;
    }
  });

  // Check for general conversation keywords
  generalKeywords.forEach(keyword => {
    if (normalized.includes(keyword.toLowerCase())) {
      generalScore += keyword.split(' ').length * 1.5;
    }
  });

  // Check for question patterns that suggest general conversation
  if (/^(what|how|why|when|where|who|can|could|would|will)\s+(is|are|do|does|can|you|we|i)/i.test(normalized)) {
    if (necScore === 0 && wattmonkScore === 0) {
      generalScore += 2;
    }
  }

  // Determine the winning context
  let context: ContextType = 'general';
  let confidence = 0;
  let reasoning = '';

  const totalScore = necScore + wattmonkScore + generalScore;

  if (totalScore === 0) {
    // No specific keywords found - default to general
    context = 'general';
    confidence = 0.5;
    reasoning = 'No specific domain keywords detected. Treating as general inquiry.';
  } else if (necScore > wattmonkScore && necScore > generalScore) {
    context = 'nec';
    confidence = necScore / totalScore;
    reasoning = `Detected NEC/electrical code terminology (score: ${necScore})`;
  } else if (wattmonkScore > necScore && wattmonkScore > generalScore) {
    context = 'wattmonk';
    confidence = wattmonkScore / totalScore;
    reasoning = `Detected Wattmonk/solar industry terminology (score: ${wattmonkScore})`;
  } else {
    context = 'general';
    confidence = generalScore / totalScore;
    reasoning = `General conversation pattern detected (score: ${generalScore})`;
  }

  // Boost confidence for strong keyword matches
  if (necScore > 5 || wattmonkScore > 5) {
    confidence = Math.min(confidence * 1.2, 0.95);
  }

  return {
    context,
    confidence: Math.round(confidence * 100) / 100,
    reasoning,
  };
}

export function getSystemPrompt(context: ContextType): string {
  const basePrompt = `You are a helpful AI assistant that can answer questions about electrical codes (NEC), Wattmonk solar services, and general topics.`;

  switch (context) {
    case 'nec':
      return `${basePrompt}

You are currently answering a question about the National Electrical Code (NEC).
Guidelines:
- Provide accurate information based on NEC standards
- Cite specific articles and sections when possible
- Emphasize safety and code compliance
- Note that local amendments may apply
- Recommend consulting a licensed electrician for specific installations

Use the provided context to answer accurately. If the context doesn't contain the answer, say so clearly.`;

    case 'wattmonk':
      return `${basePrompt}

You are currently answering a question about Wattmonk's products and services.
Guidelines:
- Be knowledgeable about Wattmonk's AI-powered solar design platform
- Explain features, pricing, and services clearly
- Be enthusiastic but accurate about capabilities
- Direct complex technical questions to Wattmonk support when appropriate
- Mention that specific pricing may vary and to contact sales for quotes

Use the provided context to answer accurately. If the context doesn't contain the answer, say so clearly.`;

    default:
      return `${basePrompt}

You are having a general conversation.
Guidelines:
- Be friendly and helpful
- Answer general knowledge questions to the best of your ability
- Be honest about limitations
- If the user asks about electrical codes or Wattmonk, note that you can help with those topics too`;
  }
}
