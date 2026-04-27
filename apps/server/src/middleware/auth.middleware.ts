import { Request, Response, NextFunction } from 'express';
import { env } from '../config/env';
import { supabase } from '../lib/supabase';

export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing or invalid authorization header' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    req.user = { id: user.id, email: user.email! };
    next();
  } catch {
    res.status(401).json({ error: 'Token verification failed' });
  }
}