// Supabase client — lazy, offline-safe. No network at import (jest-safe).
// Configure via EXPO_PUBLIC_SUPABASE_URL + EXPO_PUBLIC_SUPABASE_ANON_KEY.
// When missing (local dev/CI), isSupabaseConfigured() is false and callers
// must fall back to AsyncStorage offline mode — never throw.
import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let cached: SupabaseClient | null = null;

export function supabaseUrl(): string {
  return (process.env.EXPO_PUBLIC_SUPABASE_URL ?? '').trim();
}

export function isSupabaseConfigured(): boolean {
  return supabaseUrl().length > 8 && (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '').trim().length > 20;
}

export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null;
  if (cached) return cached;
  cached = createClient(supabaseUrl(), process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!.trim(), {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return cached;
}
