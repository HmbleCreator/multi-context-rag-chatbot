import { ContextType } from '@/types';

/**
 * Generates related question suggestions based on current context and query
 */
export function generateQuerySuggestions(
  query: string,
  context: ContextType,
  sources: any[]
): string[] {
  const suggestions: string[] = [];
  
  // Context-specific suggestions
  if (context === 'nec') {
    suggestions.push(
      "What are the grounding requirements for electrical panels?",
      "How do I calculate conduit fill for THHN wires?",
      "What's the difference between GFCI and AFCI protection?",
      "What are the NEC requirements for solar panel installations?",
      "How do I determine wire size for a 200 amp service?"
    );
  } else if (context === 'wattmonk') {
    suggestions.push(
      "How does Wattmonk's AI design platform work?",
      "What permit services does Wattmonk offer?",
      "How accurate is Wattmonk's remote site assessment?",
      "What are Wattmonk's pricing plans for solar installers?",
      "How does Wattmonk ensure NEC compliance in designs?"
    );
  } else {
    suggestions.push(
      "Can you explain NEC grounding requirements?",
      "What solar design services does Wattmonk offer?",
      "How do I get started with solar panel installation?",
      "What's the difference between NEC and local electrical codes?",
      "How long does solar permitting typically take?"
    );
  }
  
  // Add source-specific suggestions if available
  if (sources.length > 0) {
    const sourceTitles = sources.map(s => s.title).slice(0, 2);
    if (sourceTitles.length > 0) {
      suggestions.unshift(
        `Tell me more about ${sourceTitles[0]}`,
        `How does ${sourceTitles[0]} relate to ${sourceTitles[1] || 'other topics'}?`
      );
    }
  }
  
  // Return top 3 unique suggestions
  return [...new Set(suggestions)].slice(0, 3);
}

/**
 * Extracts specific section references from document content
 */
export function extractSectionReferences(content: string): Array<{section: string, page?: number}> {
  const sections: Array<{section: string, page?: number}> = [];
  
  // Look for common section patterns
  const sectionPatterns = [
    /(?:Section\s+|§\s*)(\d+(?:\.\d+)*)/gi,
    /(?:Article\s+|Art\.\s*)(\d+(?:\.\d+)*)/gi,
    /(?:Chapter\s+|Ch\.\s*)(\d+(?:\.\d+)*)/gi,
    /(?:Table\s+|Tbl\.\s*)(\d+(?:\.\d+)*)/gi,
    /(?:Figure\s+|Fig\.\s*)(\d+(?:\.\d+)*)/gi
  ];
  
  sectionPatterns.forEach(pattern => {
    let match;
    while ((match = pattern.exec(content)) !== null) {
      sections.push({
        section: match[1],
        page: undefined // Would need PDF parsing for accurate page numbers
      });
    }
  });
  
  // Remove duplicates and limit results
  const uniqueSections = sections.filter(
    (section, index, self) => 
      index === self.findIndex(s => s.section === section.section)
  );
  
  return uniqueSections.slice(0, 5);
}