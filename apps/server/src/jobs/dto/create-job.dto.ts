import {
  IsString,
  IsNotEmpty,
  MaxLength,
  IsEnum,
  IsOptional,
  IsUrl,
  IsObject,
  IsNumber,
  Min,
  Max,
  IsBoolean,
  ValidateIf,
} from 'class-validator';
import { JobType, HttpMethod } from 'database';

export class CreateJobDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @IsEnum(JobType)
  @IsNotEmpty()
  type: JobType;

  @IsString()
  @IsNotEmpty()
  workspaceId: string;

  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  endpoint: string;

  @IsEnum(HttpMethod)
  @IsNotEmpty()
  method: HttpMethod;

  @IsOptional()
  @IsObject()
  headers?: Record<string, any>;

  @IsOptional()
  @IsObject()
  body?: Record<string, any>;

  @ValidateIf((o) => o.type === 'CRON')
  @IsString()
  @IsNotEmpty()
  schedule?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(10)
  retryCount?: number;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(300)
  retryDelay?: number;

  @IsOptional()
  @IsNumber()
  @Min(5)
  @Max(300)
  timeout?: number;

  @IsOptional()
  @IsBoolean()
  failureEmail?: boolean;
}
