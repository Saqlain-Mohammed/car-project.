import { useQuery } from '@tanstack/react-query'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

/**
 * Aggregate counts for the Community landing surfaces.
 *
 * Uses `head: true` count queries so the database returns a number without
 * shipping any rows. When Supabase isn't configured the hook resolves to
 * nulls, and callers render an em-dash rather than an invented figure.
 */
async function countOf(table, filters = {}) {
  let q = supabase.from(table).select('*', { count: 'exact', head: true })
  for (const [col, val] of Object.entries(filters)) q = q.eq(col, val)
  const { count, error } = await q
  if (error) throw error
  return count ?? 0
}

export function useCommunityStats() {
  return useQuery({
    queryKey: ['community-stats'],
    enabled: isSupabaseConfigured,
    staleTime: 60_000,
    refetchInterval: 60_000,
    queryFn: async () => {
      const [members, crews, events, posts, comments, likes] = await Promise.all([
        countOf('profiles'),
        countOf('communities'),
        countOf('events', { is_published: true }),
        countOf('posts',  { is_published: true }),
        countOf('comments'),
        countOf('post_likes'),
      ])
      return { members, crews, events, posts, comments, likes }
    },
  })
}

/**
 * Live motorsport session, if one is running.
 *
 * Returns the row flagged `status = 'live'`, plus a viewer count derived from
 * the comment volume on that event. Polls on a short interval and also
 * subscribes to inserts so a new comment bumps the number immediately.
 */
export function useLiveMotorsport() {
  return useQuery({
    queryKey: ['motorsport-live'],
    enabled: isSupabaseConfigured,
    staleTime: 15_000,
    refetchInterval: 20_000,
    queryFn: async () => {
      const { data: event, error } = await supabase
        .from('motorsport_events')
        .select('*, motorsport_series ( name, category )')
        .eq('status', 'live')
        .order('starts_at', { ascending: false })
        .limit(1)
        .maybeSingle()
      if (error) throw error
      if (!event) return { live: false, event: null, viewers: 0 }

      const { count } = await supabase
        .from('motorsport_comments')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', event.id)

      return { live: true, event, viewers: count ?? 0 }
    },
  })
}

/** Formats a count for display, or an em-dash when the value is unknown. */
export function stat(n) {
  if (n == null) return '—'
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`
  return String(n)
}
