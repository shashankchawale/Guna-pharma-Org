'use client';

import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xtnazvpjlsupnyyovnes.supabase.co';
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    'sb_publishable_Pi_q-MeEtDkT5-03RE_9fQ_f461abXL';
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}