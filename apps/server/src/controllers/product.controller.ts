import { Request, Response, NextFunction } from 'express';
import { CreateProductInput, UpdateProductInput } from '@kwwi/shared';
import { supabase } from '../lib/supabase';

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getProductById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', req.params.id)
      .single();

    if (error || !data) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function createProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as CreateProductInput;
    const file = req.file;

    let image_url: string | null = null;

    if (file) {
      const fileName = `${Date.now()}-${file.originalname}`;
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file.buffer, { contentType: file.mimetype });

      if (uploadError) throw new Error(uploadError.message);

      const { data: urlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      image_url = urlData.publicUrl;
    }

    const { data, error } = await supabase
      .from('products')
      .insert({ ...body, image_url })
      .select()
      .single();

    if (error) throw new Error(error.message);

    res.status(201).json(data);
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const body = req.body as UpdateProductInput;

    const { data, error } = await supabase
      .from('products')
      .update({ ...body, updated_at: new Date().toISOString() })
      .eq('id', req.params.id)
      .select()
      .single();

    if (error || !data) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', req.params.id);

    if (error) throw new Error(error.message);

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}