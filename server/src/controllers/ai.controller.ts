import { Request, Response, NextFunction } from 'express';
import { AIService } from '../services/ai.service.js';

/**
 * POST /api/v1/ai/ats-score
 * Body: { resume: IResume }
 * Returns: { score: number; recommendations: string[] }
 */
export const getATSScore = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { resume } = req.body;
    if (!resume || !Array.isArray(resume.sections)) {
      res.status(400).json({ success: false, message: 'A valid resume object with sections is required.' });
      return;
    }

    const result = AIService.calculateATSScore(resume);
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/v1/ai/cover-letter
 * Body: { resumeId: string; jobDescription: string }
 * Returns: { coverLetter: string }
 */
export const generateCoverLetter = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { resumeId, jobDescription } = req.body;
    if (!resumeId || typeof jobDescription !== 'string') {
      res.status(400).json({ success: false, message: 'resumeId and jobDescription are required.' });
      return;
    }

    const { ResumeService } = await import('../services/resume.service.js');
    const resume = await ResumeService.getResumeById(resumeId, req.user?.userId);

    const coverLetter = AIService.generateCoverLetter(resume, jobDescription);
    res.status(200).json({ success: true, data: { coverLetter } });
  } catch (error) {
    next(error);
  }
};
