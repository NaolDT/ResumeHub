import { IResume } from '../models/resume.model.js';

export class AIService {
  // Curated list of ATS-friendly keywords
  private static readonly keywords: string[] = [
    'JavaScript',
    'TypeScript',
    'Node.js',
    'React',
    'HTML',
    'CSS',
    'REST',
    'API',
    'Git',
    'Docker',
    'AWS',
    'SQL',
    'NoSQL',
    'Agile',
    'Scrum',
  ];

  /**
   * Calculate a simple ATS compatibility score based on keyword presence.
   * @returns score (0-100) and an array of missing keyword recommendations.
   */
  static calculateATSScore(resume: IResume): { score: number; recommendations: string[] } {
    const texts: string[] = [];

    for (const section of resume.sections) {
      const c = section.content;
      if (typeof c === 'string') {
        texts.push(c);
      } else if (Array.isArray(c)) {
        for (const item of c) {
          for (const value of Object.values(item as Record<string, unknown>)) {
            if (typeof value === 'string') texts.push(value);
            else if (Array.isArray(value)) texts.push((value as string[]).join(' '));
          }
        }
      } else if (c && typeof c === 'object') {
        for (const value of Object.values(c as Record<string, unknown>)) {
          if (typeof value === 'string') texts.push(value);
          else if (Array.isArray(value)) texts.push((value as string[]).join(' '));
        }
      }
    }

    const combined = texts.join(' ').toLowerCase();
    const matched = AIService.keywords.filter((k) => combined.includes(k.toLowerCase()));
    const missing = AIService.keywords.filter((k) => !combined.includes(k.toLowerCase()));
    const score = Math.round((matched.length / AIService.keywords.length) * 100);

    return { score, recommendations: missing };
  }
}

