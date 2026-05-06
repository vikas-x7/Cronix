import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
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
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin(): void {}

  @Get('google/callback')
  @UseGuards(GoogleAuthCallbackGuard)
  googleCallback(@Req() req: any): Promise<TokenPair> {
    return this.authService.login(req.user);
  }

  @Get('github')
  @UseGuards(GitHubAuthGuard)
  githubLogin(): void {}

  @Get('github/callback')
  @UseGuards(GitHubAuthCallbackGuard)
  githubCallback(@Req() req: any): Promise<TokenPair> {
    return this.authService.login(req.user);
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto): Promise<TokenPair> {
    return this.authService.refresh(dto.refreshToken);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  logout(): Record<string, string> {
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
