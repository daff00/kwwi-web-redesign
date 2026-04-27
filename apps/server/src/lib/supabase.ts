import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { env } from '../config/env';

// Lazy singleton — only created when first accessed
let _supabase: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!_supabase) {
    _supabase = createClient(
      env.supabase.url,
      env.supabase.serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );
  }
  return _supabase;
}

// Convenience export — use this in controllers
export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return getSupabase()[prop as keyof SupabaseClient];
  },
});