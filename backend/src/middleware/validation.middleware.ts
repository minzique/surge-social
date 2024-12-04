import { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

const formatErrors = (errors: any[]) => {
  return errors.map(error => {
    return Object.values(error.constraints || {}).join(', ');
  });
};

// Validation middleware
export function validateDto(dtoClass: { new (): object }) {
  return async (req: Request, res: Response, next: NextFunction) => {

    const dtoInstance = plainToInstance(dtoClass, req.body);
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      const formattedErrors = formatErrors(errors);
      res.status(400).json({ errors: formattedErrors });
      return;
    }
    req.body = dtoInstance;
    next();
  };
}
