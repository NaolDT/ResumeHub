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

  /**
   * Generates a rule-based cover letter from a resume and job description.
   * Uses template-based insertion rather than a real LLM as per the plan.
   */
  static generateCoverLetter(resume: IResume, jobDescription: string): string {
    const personalSection = resume.sections.find((s) => s.type === 'personal');
    const name = personalSection?.content?.fullName || 'Applicant';
    
    // Extract a few skills to mention
    const skillsSection = resume.sections.find((s) => s.type === 'skills');
    let topSkills = 'relevant skills';
    if (skillsSection && Array.isArray(skillsSection.content) && skillsSection.content.length > 0) {
        const firstSkillGroup = skillsSection.content[0];
        if (firstSkillGroup.items && Array.isArray(firstSkillGroup.items) && firstSkillGroup.items.length >= 2) {
            topSkills = `${firstSkillGroup.items[0]} and ${firstSkillGroup.items[1]}`;
        }
    }

    // Extract current/most recent job title
    const experienceSection = resume.sections.find((s) => s.type === 'experience');
    let currentRole = 'Professional';
    if (experienceSection && Array.isArray(experienceSection.content) && experienceSection.content.length > 0) {
        currentRole = experienceSection.content[0].position || 'Professional';
    }

    return `Dear Hiring Manager,

I am writing to express my strong interest in the open position at your company. With my background as a ${currentRole} and my expertise in ${topSkills}, I am confident in my ability to make an immediate impact on your team.

Having reviewed the job description carefully (${jobDescription.substring(0, 100).replace(/\n/g, ' ')}${jobDescription.length > 100 ? '...' : ''}), I am particularly drawn to this role because it aligns with my professional goals and leverages my core strengths. My past experiences have equipped me with a proven track record of delivering high-quality results in fast-paced environments.

I would welcome the opportunity to discuss how my background, skills, and enthusiasm would be a great fit for your team. Please find my resume attached for your consideration.

Thank you for your time and consideration.

Sincerely,
${name}`;
  }
}
