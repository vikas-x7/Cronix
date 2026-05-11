import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';

@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async create(
    @Body() dto: CreateJobDto,
    @CurrentUser('id') userId: string,
    @Req() req: Request,
  ) {
    const data = await this.jobsService.create(dto, userId);

    const result: any = { ...data };

    if (data.webhookToken) {
      const baseUrl = `${req.protocol}://${req.hostname}:${process.env.PORT ?? 3001}`;
      result.webhookUrl = `${baseUrl}/api/v1/webhooks/${data.webhookToken}`;
    }

    return { __message: 'Job created', ...result };
  }

  @Get()
  async findAll(
    @CurrentUser('id') userId: string,
    @Query('workspaceId') workspaceId?: string,
    @Query('status') status?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = page ? Math.max(1, parseInt(page, 10)) : 1;
    const l = limit ? Math.max(1, Math.min(100, parseInt(limit, 10))) : 10;
    const data = await this.jobsService.findAll(
      userId,
      workspaceId,
      status || undefined,
      p,
      l,
    );
    return { __message: 'Jobs fetched', ...data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const data = await this.jobsService.findOne(id, userId);
    return { __message: 'Job fetched', ...data };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateJobDto,
    @CurrentUser('id') userId: string,
  ) {
    const data = await this.jobsService.update(id, dto, userId);
    return { __message: 'Job updated', ...data };
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const data = await this.jobsService.delete(id, userId);
    return { __message: 'Job deleted', ...data };
  }

  @Post(':id/pause')
  async pause(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const data = await this.jobsService.pause(id, userId);
    return { __message: 'Job paused', ...data };
  }

  @Post(':id/resume')
  async resume(@Param('id') id: string, @CurrentUser('id') userId: string) {
    const data = await this.jobsService.resume(id, userId);
    return { __message: 'Job resumed', ...data };
  }

  @Post(':id/run')
  @Throttle({ default: { ttl: 60000, limit: 10 } })
  async runNow(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return await this.jobsService.runNow(id, userId);
  }
}
