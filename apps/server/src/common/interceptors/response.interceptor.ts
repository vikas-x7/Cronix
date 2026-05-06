import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
}

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse();

    return next.handle().pipe(
      map((data) => {
        if (data && data.__message) {
          const { __message, ...rest } = data;
          return {
            success: true,
            statusCode: response.statusCode,
            message: __message,
            data: rest,
          };
        }

        return {
          success: true,
          statusCode: response.statusCode,
          message: this.getDefaultMessage(response.statusCode),
          data: data ?? null,
        };
      }),
    );
  }

  private getDefaultMessage(statusCode: number): string {
    switch (statusCode) {
      case 200:
        return 'Success';
      case 201:
        return 'Created successfully';
      case 204:
        return 'Deleted successfully';
      default:
        return 'OK';
    }
  }
}
