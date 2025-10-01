import { AppError } from '@shared/errors/app.error';
import { NextFunction, Request, Response } from 'express';

export function errorHandler(
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      statusCode: error.statusCode
    });
  }

  console.error('Internal server error:', error);

  return response.status(500).json({
    status: 'error',
    message: 'Internal server error',
    statusCode: 500
  });
}
