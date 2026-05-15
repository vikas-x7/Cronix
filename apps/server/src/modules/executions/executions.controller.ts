import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ExecutionsService } from './executions.service';

@Controller('executions')
@UseGuards(JwtAuthGuard)
export class ExecutionsController {
  constructor(private readonly executionsService: ExecutionsService) {}

  @Get()
  async findAll(
    @CurrentUser('id') userId: string,
    @Query('jobId') jobId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = page ? Math.max(1, parseInt(page, 10)) : 1;
    const l = limit ? Math.max(1, Math.min(100, parseInt(limit, 10))) : 10;
    const data = await this.executionsService.findAll(
      userId,
      jobId || undefined,
      status || undefined,
      p,
      l,
    );
    return { __message: 'Executions fetched', ...data };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ): Promise<any> {
    const data = await this.executionsService.findOne(id, userId);
    return { __message: 'Execution fetched', ...data };
  }

  @Get(':id/logs')
  async findLogs(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const data = await this.executionsService.findLogs(id, userId);
    return { __message: 'Logs fetched', ...data };
  }
}
