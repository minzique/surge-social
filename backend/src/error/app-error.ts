export class AppError extends Error {
  readonly statusCode: number;
  readonly errors?: any[];

  constructor(statusCode: number, message: string, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = 'AppError';
    
    // This is needed in TypeScript when extending built-in classes
    Object.setPrototypeOf(this, AppError.prototype);
  }

  static isAppError(error: any): error is AppError {
    return error instanceof AppError;
  }
}