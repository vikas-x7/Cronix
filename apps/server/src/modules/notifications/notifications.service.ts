import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly resend: Resend;
  private readonly fromEmail: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.resend = new Resend(this.configService.get<string>('RESEND_API_KEY'));
    this.fromEmail =
      this.configService.get<string>('FROM_EMAIL') ||
      'Cronix <onboarding@resend.dev>';
  }

  async sendJobFailureEmail(jobId: string, error: string): Promise<void> {
    try {
      const job = await this.prisma.job.findUnique({
        where: { id: jobId },
        include: {
          space: {
            include: { user: true },
          },
        },
      });

      if (!job || !job.space?.user?.email) {
        this.logger.warn(
          `Cannot send failure email job or user not found for jobId: ${jobId}`,
        );
        return;
      }

      const user = job.space.user;
      const timestamp = new Date().toISOString();

      const { error: sendError } = await this.resend.emails.send({
        from: this.fromEmail,
        to: user.email,
        subject: `Job Failed: ${job.name}`,
        html: `
          <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; border: 1px solid #1a1a2e; border-radius: 12px; overflow: hidden;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 32px 24px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 600;">⚠️ Job Execution Failed</h1>
            </div>
            <div style="padding: 32px 24px;">
              <p style="color: #a1a1aa; font-size: 15px; margin: 0 0 24px;">
                Hi ${user.name || 'there'}, your scheduled job has failed after exhausting all retry attempts.
              </p>
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 16px; color: #71717a; font-size: 13px; border-bottom: 1px solid #1a1a2e;">Job Name</td>
                  <td style="padding: 12px 16px; color: #e4e4e7; font-size: 14px; font-weight: 500; border-bottom: 1px solid #1a1a2e; text-align: right;">${job.name}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; color: #71717a; font-size: 13px; border-bottom: 1px solid #1a1a2e;">Endpoint</td>
                  <td style="padding: 12px 16px; color: #e4e4e7; font-size: 14px; font-weight: 500; border-bottom: 1px solid #1a1a2e; text-align: right; word-break: break-all;">${job.endpoint}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; color: #71717a; font-size: 13px; border-bottom: 1px solid #1a1a2e;">Method</td>
                  <td style="padding: 12px 16px; color: #e4e4e7; font-size: 14px; font-weight: 500; border-bottom: 1px solid #1a1a2e; text-align: right;">${job.method}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; color: #71717a; font-size: 13px; border-bottom: 1px solid #1a1a2e;">Attempts Made</td>
                  <td style="padding: 12px 16px; color: #e4e4e7; font-size: 14px; font-weight: 500; border-bottom: 1px solid #1a1a2e; text-align: right;">${job.retryCount} / ${job.retryCount}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; color: #71717a; font-size: 13px; border-bottom: 1px solid #1a1a2e;">Failed At</td>
                  <td style="padding: 12px 16px; color: #e4e4e7; font-size: 14px; font-weight: 500; border-bottom: 1px solid #1a1a2e; text-align: right;">${timestamp}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 16px; color: #71717a; font-size: 13px;">Error</td>
                  <td style="padding: 12px 16px; color: #ef4444; font-size: 14px; font-weight: 500; text-align: right; word-break: break-all;">${error}</td>
                </tr>
              </table>
              <p style="color: #52525b; font-size: 12px; text-align: center; margin: 24px 0 0;">
                Cronix Job Monitoring Platform
              </p>
            </div>
          </div>
        `,
      });

      if (sendError) {
        this.logger.error(
          `Failed to send failure email for job ${jobId}: ${JSON.stringify(sendError)}`,
        );
        return;
      }

      this.logger.log(
        `Failure email sent to ${user.email} for job "${job.name}"`,
      );
    } catch (err: any) {
      this.logger.error(
        `Error sending failure email for job ${jobId}: ${err.message}`,
      );
    }
  }
}
