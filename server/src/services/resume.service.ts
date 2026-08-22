import { Resume, IResume, IResumeSection } from '../models/resume.model.js';
import { Types } from 'mongoose';
import { User } from '../models/user.model.js';
import { AppError } from '../errors/AppError.js';
import { v4 as uuidv4 } from 'uuid';

export class ResumeService {
  static createDefaultSections(): IResumeSection[] {
    return [
      {
        id: 'sec-personal',
        type: 'personal',
        title: 'Personal Information',
        isVisible: true,
        order: 0,
        content: {
          fullName: 'Jane Doe',
          email: 'jane.doe@example.com',
          phone: '+1 (555) 019-2834',
          location: 'San Francisco, CA',
          website: 'https://janedoe.dev',
          linkedin: 'linkedin.com/in/janedoe',
          github: 'github.com/janedoe',
        },
      },
      {
        id: 'sec-summary',
        type: 'summary',
        title: 'Professional Summary',
        isVisible: true,
        order: 1,
        content: {
          text: 'Results-driven Full Stack Software Engineer with 5+ years of experience crafting scalable web applications, distributed REST services, and high-performance user interfaces. Proven track record of boosting system performance by 40% and delivering robust cloud solutions.',
        },
      },
      {
        id: 'sec-experience',
        type: 'experience',
        title: 'Work Experience',
        isVisible: true,
        order: 2,
        content: [
          {
            id: 'exp-1',
            company: 'TechCorp Solutions',
            position: 'Senior Software Engineer',
            location: 'San Francisco, CA',
            startDate: '2023-01',
            endDate: '',
            current: true,
            description: 'Leading frontend and backend development for core enterprise SaaS platform.',
            bullets: [
              'Architected full-stack React and Node.js microservices serving 100k+ active daily users.',
              'Optimized database queries and API caching, reducing response latencies by 45%.',
              'Mentored 4 junior engineers and introduced automated CI/CD pipeline tests.',
            ],
          },
        ],
      },
      {
        id: 'sec-education',
        type: 'education',
        title: 'Education',
        isVisible: true,
        order: 3,
        content: [
          {
            id: 'edu-1',
            institution: 'University of California, Berkeley',
            degree: 'Bachelor of Science',
            fieldOfStudy: 'Computer Science',
            location: 'Berkeley, CA',
            startDate: '2017-09',
            endDate: '2021-05',
            gpa: '3.85 / 4.0',
          },
        ],
      },
      {
        id: 'sec-skills',
        type: 'skills',
        title: 'Skills & Technical Expertise',
        isVisible: true,
        order: 4,
        content: [
          {
            id: 'skill-1',
            category: 'Programming Languages',
            items: ['TypeScript', 'JavaScript (ES6+)', 'Python', 'Go', 'SQL'],
          },
          {
            id: 'skill-2',
            category: 'Frameworks & Libraries',
            items: ['React', 'Node.js', 'Express', 'Tailwind CSS', 'Next.js'],
          },
          {
            id: 'skill-3',
            category: 'Databases & Tools',
            items: ['MongoDB', 'PostgreSQL', 'Redis', 'Docker', 'Git', 'AWS'],
          },
        ],
      },
      {
        id: 'sec-projects',
        type: 'projects',
        title: 'Key Projects',
        isVisible: true,
        order: 5,
        content: [
          {
            id: 'proj-1',
            name: 'CloudMetrics Dashboard',
            role: 'Lead Architect',
            link: 'https://github.com/janedoe/cloudmetrics',
            startDate: '2023-06',
            endDate: '2023-11',
            description: 'Real-time telemetry and server performance monitoring dashboard built with React and WebSockets.',
            highlights: ['Processed 10,000+ metrics per second', 'Implemented dark mode and live charts'],
          },
        ],
      },
    ];
  }

  static async getUserResumes(userId: string): Promise<IResume[]> {
    return Resume.find({ userId }).sort({ updatedAt: -1 });
  }

  static async getResumeById(resumeId: string, userId?: string): Promise<IResume> {
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      throw AppError.notFound('Resume draft not found.');
    }
    if (userId && resume.userId.toString() !== userId) {
      throw AppError.forbidden('Access denied to this resume.');
    }
    return resume;
  }

  static async getPublicResumeBySlug(slug: string): Promise<IResume> {
    const resume = await Resume.findOne({ publicSlug: slug, isPublic: true });
    if (!resume) {
      throw AppError.notFound('Shared resume not found or is currently private.');
    }
    resume.viewsCount += 1;
    await resume.save();
    return resume;
  }

  static async incrementDownloadCount(slug: string): Promise<void> {
    await Resume.updateOne({ publicSlug: slug, isPublic: true }, { $inc: { downloadsCount: 1 } });
  }

  static async createResume(userId: string, title?: string): Promise<IResume> {
    const user = await User.findById(userId);
    if (!user) {
      throw AppError.notFound('User not found.');
    }

    if (user.subscriptionTier === 'free') {
      const existingCount = await Resume.countDocuments({ userId: new Types.ObjectId(userId) });
      if (existingCount >= 1) {
        throw AppError.forbidden(
          'Free tier users are limited to one (1) resume draft. Upgrade to PRO for unlimited resumes.',
        );
      }
    }

    const defaultTitle = title && title.trim() ? title.trim() : 'My Professional Resume';
    const slug = `r-${uuidv4().substring(0, 8)}`;

    const resume = await Resume.create({
      userId,
      title: defaultTitle,
      templateId: 'ats-friendly',
      fontFamily: 'inter',
      colorTheme: 'slate',
      fontSize: 'medium',
      lineSpacing: 'normal',
      isPublic: false,
      publicSlug: slug,
      sections: this.createDefaultSections(),
    });

    return resume;
  }

  static async updateResume(resumeId: string, userId: string, updates: Partial<IResume>): Promise<IResume> {
    const resume = await this.getResumeById(resumeId, userId);

    if (updates.title) resume.title = updates.title.trim();
    if (updates.templateId) resume.templateId = updates.templateId;
    if (updates.fontFamily) resume.fontFamily = updates.fontFamily;
    if (updates.colorTheme) resume.colorTheme = updates.colorTheme;
    if (updates.fontSize) resume.fontSize = updates.fontSize;
    if (updates.lineSpacing) resume.lineSpacing = updates.lineSpacing;
    if (updates.isPublic !== undefined) resume.isPublic = updates.isPublic;
    if (updates.publicSlug) resume.publicSlug = updates.publicSlug;
    if (updates.sections) resume.sections = updates.sections;

    await resume.save();
    return resume;
  }

  static async duplicateResume(resumeId: string, userId: string): Promise<IResume> {
    const user = await User.findById(userId);
    if (!user) throw AppError.notFound('User not found.');

    if (user.subscriptionTier === 'free') {
      const existingCount = await Resume.countDocuments({ userId });
      if (existingCount >= 1) {
        throw AppError.forbidden(
          'Free tier users are limited to one (1) resume draft. Upgrade to PRO for unlimited resumes.',
        );
      }
    }

    const original = await this.getResumeById(resumeId, userId);
    const slug = `r-${uuidv4().substring(0, 8)}`;

    const duplicate = await Resume.create({
      userId,
      title: `${original.title} (Copy)`,
      templateId: original.templateId,
      fontFamily: original.fontFamily,
      colorTheme: original.colorTheme,
      fontSize: original.fontSize,
      lineSpacing: original.lineSpacing,
      isPublic: false,
      publicSlug: slug,
      sections: JSON.parse(JSON.stringify(original.sections)),
    });

    return duplicate;
  }

  static async deleteResume(resumeId: string, userId: string): Promise<void> {
    const resume = await this.getResumeById(resumeId, userId);
    await resume.deleteOne();
  }
}
