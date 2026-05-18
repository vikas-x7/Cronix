import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { Response, Request } from 'express';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  GoogleAuthGuard,
  GoogleAuthCallbackGuard,
} from './guards/google-auth.guard';
import {
  GitHubAuthGuard,
  GitHubAuthCallbackGuard,
} from './guards/github-auth.guard';
import { AuthService, TokenPair } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
@Throttle({ default: { ttl: 900000, limit: 10 } })
export class AuthController {
  private readonly frontendUrl: string;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    this.frontendUrl = this.configService.get<string>(
      'FRONTEND_URL',
      'http://localhost:3000',
    );
  }

  private setAuthCookies(res: Response, tokens: TokenPair) {
    const isProduction = process.env.NODE_ENV === 'production';
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      path: '/',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    };
    res.cookie('access_token', tokens.accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000,
    });
    res.cookie('refresh_token', tokens.refreshToken, cookieOptions);
  }

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin(): void {}

  @Get('google/callback')
  @UseGuards(GoogleAuthCallbackGuard)
  async googleCallback(@Req() req: any, @Res() res: Response) {
    try {
      const tokens = await this.authService.login(req.user);
      this.setAuthCookies(res, tokens);
      res.redirect(`${this.frontendUrl}/auth/callback?status=success`);
    } catch {
      res.redirect(`${this.frontendUrl}/login?error=auth_failed`);
    }
  }

  @Get('github')
  @UseGuards(GitHubAuthGuard)
  githubLogin(): void {}

  @Get('github/callback')
  @UseGuards(GitHubAuthCallbackGuard)
  async githubCallback(@Req() req: any, @Res() res: Response) {
    try {
      const tokens = await this.authService.login(req.user);
      this.setAuthCookies(res, tokens);
      res.redirect(`${this.frontendUrl}/auth/callback?status=success`);
    } catch {
      res.redirect(`${this.frontendUrl}/login?error=auth_failed`);
    }
  }

  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    const tokens = await this.authService.refresh(refreshToken);
    this.setAuthCookies(res, tokens);
    return { __message: 'Token refreshed successfully' };
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(@Res({ passthrough: true }) res: Response): Record<string, string> {
    const cookieOptions = {
      httpOnly: true,
      path: '/',
    };
    res.clearCookie('access_token', cookieOptions);
    res.clearCookie('refresh_token', cookieOptions);
    return {
      __message: 'Logged out successfully',
    };
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: any): Record<string, any> {
    return {
      __message: 'User profile fetched successfully',
      ...user,
    };
  }
}
