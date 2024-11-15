import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Response } from 'express';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const validationErrors = exception.getResponse()['message'];

    const messages = this.flattenValidationErrors(validationErrors);

    response.status(status).json({
      statusCode: status,
      messages: messages,
      timestamp: new Date().toISOString(),
    });
  }

  private flattenValidationErrors(
    validationErrors: string[] | ValidationError[],
  ): string[] {
    if (!Array.isArray(validationErrors)) {
      return [validationErrors];
    }

    const messages: string[] = [];

    validationErrors.forEach((error) => {
      if (typeof error === 'string') {
        messages.push(error);
      } else if (error.constraints) {
        messages.push(...(Object.values(error.constraints) as string[]));
      }
    });

    return messages;
  }
}
