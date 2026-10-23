import { describe, it, expect } from 'vitest';
import { AIService } from '../../src/services/ai.service.js';
import type { IResume } from '../../src/models/resume.model.js';
import type { Types } from 'mongoose';

/** Minimal IResume stub — only the fields AIService uses */
function makeResume(overrides: Partial<IResume> = {}): IResume {
  return {
    _id: 'resume-id' as unknown as Types.ObjectId,
    userId: 'user-id' as unknown as Types.ObjectId,
    title: 'Test Resume',
    templateId: 'modern',
    isPublic: false,
    slug: 'test-resume',
    viewsCount: 0,
    downloadsCount: 0,
    sections: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as unknown as IResume;
}

describe('AIService.calculateATSScore', () => {
  it('returns score 0 and all keywords as recommendations for an empty resume', () => {
    const resume = makeResume({ sections: [] });
    const { score, recommendations } = AIService.calculateATSScore(resume);
    expect(score).toBe(0);
    expect(recommendations.length).toBeGreaterThan(0);
  });

  it('returns score 100 when all keywords are present in a string section', () => {
    const allKeywords =
      'JavaScript TypeScript Node.js React HTML CSS REST API Git Docker AWS SQL NoSQL Agile Scrum';
    const resume = makeResume({
      sections: [{ type: 'summary', title: 'Summary', content: allKeywords } as any],
    });
    const { score, recommendations } = AIService.calculateATSScore(resume);
    expect(score).toBe(100);
    expect(recommendations).toHaveLength(0);
  });

  it('score increases with more matching keywords', () => {
    const fewKeywords = makeResume({
      sections: [{ type: 'summary', title: 'Summary', content: 'JavaScript React' } as any],
    });
    const moreKeywords = makeResume({
      sections: [
        { type: 'summary', title: 'Summary', content: 'JavaScript React Node.js TypeScript' } as any,
      ],
    });
    const { score: low } = AIService.calculateATSScore(fewKeywords);
    const { score: high } = AIService.calculateATSScore(moreKeywords);
    expect(high).toBeGreaterThan(low);
  });

  it('handles array-type section content', () => {
    const resume = makeResume({
      sections: [
        {
          type: 'experience',
          title: 'Experience',
          content: [{ position: 'Engineer', bullets: ['Built REST API with Node.js'] }],
        } as any,
      ],
    });
    const { score } = AIService.calculateATSScore(resume);
    expect(score).toBeGreaterThan(0);
  });
});

describe('AIService.generateCoverLetter', () => {
  it('returns a non-empty string', () => {
    const resume = makeResume({ sections: [] });
    const letter = AIService.generateCoverLetter(resume, 'We need a software engineer.');
    expect(typeof letter).toBe('string');
    expect(letter.length).toBeGreaterThan(0);
  });

  it('includes "Dear Hiring Manager" opening', () => {
    const resume = makeResume({ sections: [] });
    const letter = AIService.generateCoverLetter(resume, 'Job description text');
    expect(letter).toContain('Dear Hiring Manager');
  });

  it('uses the applicant name from personal section', () => {
    const resume = makeResume({
      sections: [
        {
          type: 'personal',
          title: 'Personal',
          content: { fullName: 'Jane Doe', email: 'jane@example.com' },
        } as any,
      ],
    });
    const letter = AIService.generateCoverLetter(resume, 'Looking for a React developer.');
    expect(letter).toContain('Jane Doe');
  });

  it('falls back to "Applicant" when no personal section exists', () => {
    const resume = makeResume({ sections: [] });
    const letter = AIService.generateCoverLetter(resume, 'Generic job');
    expect(letter).toContain('Applicant');
  });

  it('truncates a long job description in the letter body', () => {
    const resume = makeResume({ sections: [] });
    const longJD = 'A'.repeat(200);
    const letter = AIService.generateCoverLetter(resume, longJD);
    expect(letter).toContain('...');
  });
});
