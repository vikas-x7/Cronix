import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';

export interface OAuthUserInput {
  provider: 'GOOGLE' | 'GITHUB';
  providerAccountId: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateOAuthUser(input: OAuthUserInput) {
    const existingAccount = await this.prisma.account.findFirst({
      where: {
        provider: input.provider as any,
        providerAccountId: input.providerAccountId,
      },
      include: { user: true },
    });

    if (existingAccount) {
      return existingAccount.user;
    }

    const existingUser = await this.prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      await this.prisma.account.create({
        data: {
          provider: input.provider as any,
          providerAccountId: input.providerAccountId,
          userId: existingUser.id,
        },
      });
      return existingUser;
    }

    const user = await this.prisma.user.create({
      data: {
        email: input.email,
        name: input.name,
        avatar: input.avatar,
        accounts: {
          create: {
            provider: input.provider as any,
            providerAccountId: input.providerAccountId,
          },
        },
      },
    });

    await this.prisma.space.create({
      data: {
        name: `${input.name || input.email}'s Space`,
        userId: user.id,
      },
    });

    return user;
  }

  async login(user: { id: string; email: string }): Promise<TokenPair> {
    return this.generateTokens(user);
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    try {
      const payload = this.jwtService.verify<{ sub: string; email: string }>(
        refreshToken,
        {
          secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
        },
      );

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      return this.generateTokens({ id: user.id, email: user.email });
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token', {
        cause: error,
      });
    }
  }

  private generateTokens(user: { id: string; email: string }): TokenPair {
    const payload = { sub: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN', '15m') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.getOrThrow<string>('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get<string>(
        'JWT_REFRESH_EXPIRES_IN',
        '7d',
      ) as any,
    });

    return { accessToken, refreshToken };
  }
}
