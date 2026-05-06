import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { ConfigService } from '@nestjs/config';
import { AuthService } from '../auth.service';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      clientID: configService.getOrThrow<string>('GITHUB_CLIENT_ID'),
      clientSecret: configService.getOrThrow<string>('GITHUB_CLIENT_SECRET'),
      callbackURL: configService.getOrThrow<string>('GITHUB_CALLBACK_URL'),
      scope: ['user:email'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile: any,
    done: (error: any, user?: any) => void,
  ) {
    try {
      const { id, emails, photos, displayName, username } = profile;
      const email = emails?.[0]?.value || `${username}@github.local`;
      const avatar = photos?.[0]?.value;

      const user = await this.authService.validateOAuthUser({
        provider: 'GITHUB',
        providerAccountId: id,
        email,
        name: displayName || username,
        avatar,
      });

      done(null, user);
    } catch (error) {
      done(error as Error, false);
    }
  }
}
