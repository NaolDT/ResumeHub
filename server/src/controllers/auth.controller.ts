import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  static async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, name } = req.body;
      const { user, tokens } = await AuthService.register({ email, password, name });
      res.status(201).json({
        message: 'Registration successful.',
        user,
        tokens,
      });
    } catch (err) {
      next(err);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const { user, tokens } = await AuthService.login({ email, password });
      res.json({
        message: 'Login successful.',
        user,
        tokens,
      });
    } catch (err) {
      next(err);
    }
  }

  static async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;
      if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required.' });
      }
      const tokens = await AuthService.refreshToken(refreshToken);
      res.json({ tokens });
    } catch (err) {
      next(err);
    }
  }

  static async logout(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.user) {
        await AuthService.logout(req.user.userId);
      }
      res.json({ message: 'Logged out successfully.' });
    } catch (err) {
      next(err);
    }
  }

  static async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const resetToken = await AuthService.requestPasswordReset(email);
      res.json({
        message: 'If an account exists for this email, a password reset token has been issued.',
        // Returned in dev mode for easy local verification without needing email server
        resetToken: process.env.NODE_ENV !== 'production' ? resetToken : undefined,
      });
    } catch (err) {
      next(err);
    }
  }

  static async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { token, newPassword } = req.body;
      await AuthService.resetPassword(token, newPassword);
      res.json({ message: 'Password has been reset successfully. You may now log in.' });
    } catch (err) {
      next(err);
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.updateProfile(req.user!.userId, {});
      res.json({ user });
    } catch (err) {
      next(err);
    }
  }

  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await AuthService.updateProfile(req.user!.userId, req.body);
      res.json({ message: 'Profile updated successfully.', user });
    } catch (err) {
      next(err);
    }
  }
}
