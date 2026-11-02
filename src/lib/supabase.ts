import { createClient, type SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string = import.meta.env.PUBLIC_SUPABASE_URL?.trim() || '';
const supabaseAnonKey: string = import.meta.env.PUBLIC_SUPABASE_ANON_KEY?.trim() || '';

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl.length > 0 &&
  supabaseAnonKey.length > 0 &&
  !supabaseUrl.includes('placeholder')
);

// Fallback dummy URL and anon key to prevent createClient from throwing during build/SSR
// when environment variables are not yet populated.
const safeUrl = isSupabaseConfigured ? supabaseUrl : 'https://placeholder.supabase.co';
const safeKey = isSupabaseConfigured ? supabaseAnonKey : 'placeholder-anon-key';

export const supabase: SupabaseClient = createClient(safeUrl, safeKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
});
