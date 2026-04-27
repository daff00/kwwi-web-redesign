import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { env } from '../config/env';

export function errorMiddleware(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void {
  console.error(`[Error] ${err.message}`);

  // Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      details: err.flatten().fieldErrors,
    });
    return;
  }

  // Generic error
  res.status(500).json({
    error: 'Internal server error',
    ...(env.nodeEnv === 'development' && { details: err.message }),
  });
}