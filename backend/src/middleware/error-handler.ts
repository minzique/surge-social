import { Request, Response, NextFunction } from 'express';
import { AppError } from '../error/app-error';

export const errorHandler = (
  err: Error | AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (AppError.isAppError(err)) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null
    });
  }

  console.error('Unhandled error:', err);
  return res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
};