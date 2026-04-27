import { Request, Response, NextFunction } from 'express';
import { LoginInput } from '@kwwi/shared';
import { supabase } from '../lib/supabase';

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password } = req.body as LoginInput;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    res.json({
      access_token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await supabase.auth.signOut();
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
}

export async function getMe(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // req.user is attached by authMiddleware
    res.json({ user: req.user });
  } catch (err) {
    next(err);
  }
}