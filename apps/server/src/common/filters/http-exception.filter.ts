import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Something went wrong';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as any).message || exception.message;
    } else if ((exception as any)?.code?.startsWith('P')) {
      status = HttpStatus.BAD_REQUEST;
      message = this.handlePrismaError(exception as any);
    } else if (exception instanceof Error) {
      message =
        process.env.NODE_ENV === 'development'
          ? exception.message
          : 'Something went wrong';
    }

    response.status(status).json({
      success: false,
      statusCode: status,
      message: Array.isArray(message) ? message.join(', ') : message,
      timestamp: new Date().toISOString(),
      path: request.url,

      ...(process.env.NODE_ENV === 'development' && {
        stack: (exception as any)?.stack,
      }),
    });
  }

  private handlePrismaError(exception: any): string {
    switch (exception.code) {
      case 'P2002': {
        const fields = (exception.meta?.target as string[])?.join(', ');
        return fields
          ? `Duplicate value for ${fields}`
          : 'Duplicate entry already exists';
      }
      case 'P2025':
        return 'Record not found';
      case 'P2003':
        return 'Invalid reference';
      default:
        return 'Database error';
    }
  }
}
