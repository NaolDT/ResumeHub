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

