import { Request, Response, NextFunction } from 'express';
import { InterviewService } from '../services/interview.service.js';

/**
 * GET /api/v1/interview-questions
 * Query: ?topic=string
 * Returns: InterviewQuestion[]
 */
export const getQuestions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { topic } = req.query;
    const questions = await InterviewService.getQuestions(topic as string);
    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    next(error);
  }
};

