import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { ResponseData, ApiResponse } from '../interfaces/response.interface';

@Injectable()
export class TransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data: ResponseData<T> | T) => {
        const responseData = data as ResponseData<T>;
        const actualData =
          'data' in responseData ? responseData.data : (data as T);
        const message = responseData?.message || 'Handled successfully';

        return {
          success: true,
          status: response.statusCode,
          method: request.method,
          timestamp: new Date().toISOString(),
          path: request.url,
          message,
          data: actualData,
        };
      }),
    );
  }
}
