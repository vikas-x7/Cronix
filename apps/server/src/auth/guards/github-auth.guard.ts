import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class GitHubAuthGuard extends AuthGuard('github') {}

@Injectable()
export class GitHubAuthCallbackGuard extends AuthGuard('github') {
  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('GitHub authentication failed');
    }
    return user;
  }
}
