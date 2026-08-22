import { Request, Response, NextFunction } from 'express';
import { ResumeService } from '../services/resume.service.js';

function paramStr(val: string | string[]): string {
  return Array.isArray(val) ? val[0] : val;
}

export class ResumeController {
  static async getResumes(req: Request, res: Response, next: NextFunction) {
    try {
      const resumes = await ResumeService.getUserResumes(req.user!.userId);
      res.json({ resumes });
    } catch (err) {
      next(err);
    }
  }

  static async getResumeById(req: Request, res: Response, next: NextFunction) {
    try {
      const resume = await ResumeService.getResumeById(paramStr(req.params.id), req.user!.userId);
      res.json({ resume });
    } catch (err) {
      next(err);
    }
  }

  static async getPublicResume(req: Request, res: Response, next: NextFunction) {
    try {
      const resume = await ResumeService.getPublicResumeBySlug(paramStr(req.params.slug));
      res.json({ resume });
    } catch (err) {
      next(err);
    }
  }

  static async recordDownload(req: Request, res: Response, next: NextFunction) {
    try {
      await ResumeService.incrementDownloadCount(paramStr(req.params.slug));
      res.json({ message: 'Download count recorded.' });
    } catch (err) {
      next(err);
    }
  }

  static async createResume(req: Request, res: Response, next: NextFunction) {
    try {
      const { title } = req.body;
      const resume = await ResumeService.createResume(req.user!.userId, title);
      res.status(201).json({ message: 'Resume created successfully.', resume });
    } catch (err) {
      next(err);
    }
  }

  static async updateResume(req: Request, res: Response, next: NextFunction) {
    try {
      const resume = await ResumeService.updateResume(paramStr(req.params.id), req.user!.userId, req.body);
      res.json({ message: 'Resume updated successfully.', resume });
    } catch (err) {
      next(err);
    }
  }

  static async duplicateResume(req: Request, res: Response, next: NextFunction) {
    try {
      const resume = await ResumeService.duplicateResume(paramStr(req.params.id), req.user!.userId);
      res.status(201).json({ message: 'Resume duplicated successfully.', resume });
    } catch (err) {
      next(err);
    }
  }

  static async deleteResume(req: Request, res: Response, next: NextFunction) {
    try {
      await ResumeService.deleteResume(paramStr(req.params.id), req.user!.userId);
      res.json({ message: 'Resume draft deleted.' });
    } catch (err) {
      next(err);
    }
  }
}
