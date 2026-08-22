import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser, UserRole } from '../models/user.model.js';
import { env } from '../config/env.js';
import { AppError } from '../errors/AppError.js';
import crypto from 'crypto';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
  subscriptionTier: 'free' | 'pro';
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static generateTokens(user: IUser): AuthTokens {
    const payload: TokenPayload = {
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
      subscriptionTier: user.subscriptionTier,
    };

    const accessToken = jwt.sign(payload, env.jwtSecret, {
      expiresIn: env.jwtAccessExpiresIn as any,
    });

    const refreshToken = jwt.sign(payload, env.jwtRefreshSecret, {
      expiresIn: env.jwtRefreshExpiresIn as any,
    });

    return { accessToken, refreshToken };
  }

  static async register(dto: RegisterDto): Promise<{ user: IUser; tokens: AuthTokens }> {
    const existing = await User.findOne({ email: dto.email.toLowerCase() });
    if (existing) {
      throw AppError.conflict('An account with this email address already exists.');
    }

    if (dto.password.length < 8 || !/\d/.test(dto.password)) {
      throw AppError.badRequest('Password must be at least 8 characters long and contain at least one number.');
    }

    const passwordHash = await this.hashPassword(dto.password);
    
    // First user is automatically granted admin role for bootstrap administrative control
    // First user is automatically granted admin role for bootstrap administrative control
    const totalUsers = await User.countDocuments();
    const role: UserRole = totalUsers === 0 ? 'admin' : 'free';
    const subscriptionTier = role === 'admin' ? 'pro' : 'free';

    const user = await User.create({
      email: dto.email.toLowerCase(),
      passwordHash,
      name: dto.name,
      role,
      subscriptionTier,
      isVerified: true, // Auto-verify in Phase 1 zero-cost build
    });

    const tokens = this.generateTokens(user);
    user.refreshTokenHash = await this.hashPassword(tokens.refreshToken);
    await user.save();

    return { user, tokens };
  }

  static async login(dto: LoginDto): Promise<{ user: IUser; tokens: AuthTokens }> {
    const user = await User.findOne({ email: dto.email.toLowerCase() });
    if (!user) {
      throw AppError.unauthorized('Invalid email or password.');
    }

    const isMatch = await this.comparePassword(dto.password, user.passwordHash);
    if (!isMatch) {
      throw AppError.unauthorized('Invalid email or password.');
    }

    const tokens = this.generateTokens(user);
    user.refreshTokenHash = await this.hashPassword(tokens.refreshToken);
    await user.save();

    return { user, tokens };
  }

  static async refreshToken(refreshToken: string): Promise<AuthTokens> {
    try {
      const decoded = jwt.verify(refreshToken, env.jwtRefreshSecret) as TokenPayload;
      const user = await User.findById(decoded.userId);
      if (!user || !user.refreshTokenHash) {
        throw AppError.unauthorized('Invalid refresh token.');
      }

      const isValid = await this.comparePassword(refreshToken, user.refreshTokenHash);
      if (!isValid) {
        throw AppError.unauthorized('Revoked or invalid refresh token.');
      }

      const tokens = this.generateTokens(user);
      user.refreshTokenHash = await this.hashPassword(tokens.refreshToken);
      await user.save();

      return tokens;
    } catch (err: any) {
      if (err instanceof AppError) throw err;
      throw AppError.unauthorized('Invalid or expired refresh token.');
    }
  }

  static async logout(userId: string): Promise<void> {
    await User.findByIdAndUpdate(userId, { $unset: { refreshTokenHash: 1 } });
  }

  static async requestPasswordReset(email: string): Promise<string> {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Don't reveal account existence for security
      return 'If an account exists, a reset token has been generated.';
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    await user.save();

    return resetToken;
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    if (newPassword.length < 8 || !/\d/.test(newPassword)) {
      throw AppError.badRequest('Password must be at least 8 characters long and contain at least one number.');
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      throw AppError.badRequest('Password reset token is invalid or has expired.');
    }

    user.passwordHash = await this.hashPassword(newPassword);
    await User.findByIdAndUpdate(user._id, {
      $unset: { resetPasswordToken: 1, resetPasswordExpires: 1, refreshTokenHash: 1 },
      $set: { passwordHash: user.passwordHash },
    });
  }

  static async updateProfile(userId: string, updates: { name?: string; headline?: string; avatarUrl?: string }): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw AppError.notFound('User not found.');
    }

    if (updates.name) user.name = updates.name.trim();
    if (updates.headline !== undefined) user.headline = updates.headline.trim();
    if (updates.avatarUrl !== undefined) user.avatarUrl = updates.avatarUrl.trim();

    await user.save();
    return user;
  }
}
