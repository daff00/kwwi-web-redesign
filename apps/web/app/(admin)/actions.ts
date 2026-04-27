'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { loginSchema } from '@kwwi/shared';

export async function login(formData: FormData) {
  const supabase = await createClient();

  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const result = loginSchema.safeParse(raw);
  if (!result.success) {
    redirect('/login?error=Validation+failed');
  }

  const { data, error } = await supabase.auth.signInWithPassword(result.data);

  if (error || !data.session) {
    redirect(`/login?error=${encodeURIComponent(error?.message ?? 'Unknown error')}`);
  }

  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/', 'layout');
  redirect('/login');
}