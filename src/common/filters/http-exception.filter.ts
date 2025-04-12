import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ExceptionResponse {
  message?: string | string[];
  error?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errors: string[] = [];

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse() as ExceptionResponse;

      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        if (Array.isArray(exceptionResponse.message)) {
          errors = exceptionResponse.message;
          message = errors[0];
        } else if (typeof exceptionResponse.message === 'string') {
          message = exceptionResponse.message;
        }
      } else {
        message = exception.message;
      }
    }

    response.status(status).json({
      success: false,
      status: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: message,
      errors: errors.length > 0 ? errors : undefined,
    });
  }
}
