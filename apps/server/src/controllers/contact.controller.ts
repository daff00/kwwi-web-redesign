import { Request, Response, NextFunction } from 'express';
import { ContactFormInput } from '@kwwi/shared';
import { supabase } from '../lib/supabase';

export async function submitContact(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as ContactFormInput;

    const { error } = await supabase
      .from('contact_submissions')
      .insert({
        name: body.name,
        email: body.email,
        message: body.message,
      });

    if (error) throw new Error(error.message);

    res.status(201).json({ message: 'Message received. We will be in touch!' });
  } catch (err) {
    next(err);
  }
}