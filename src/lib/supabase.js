import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

/** True only when both env vars are present — components can branch on this. */
export const isSupabaseConfigured = Boolean(url && key && url.startsWith('http'))

if (!isSupabaseConfigured && import.meta.env.DEV) {
  console.warn(
    '[TorqueGrid] Supabase env vars missing — running on seeded data. ' +
    'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to connect.'
  )
}

/**
 * createClient throws on an empty URL, which would take down the whole React
 * tree. Fall back to a syntactically valid placeholder so the app still boots;
 * requests fail per-query instead, and the UI shows its seeded state.
 */
export const supabase = createClient(
  isSupabaseConfigured ? url : 'http://localhost:54321',
  isSupabaseConfigured ? key : 'public-anon-key',
  {
    auth: {
      autoRefreshToken: isSupabaseConfigured,
      persistSession: isSupabaseConfigured,
      detectSessionInUrl: isSupabaseConfigured,
    },
  }
)
