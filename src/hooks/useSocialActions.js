import { useCallback, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { notify } from '../components/ui/Toast'

/**
 * Follow / save / like state that survives a refresh.
 *
 * When Supabase is configured these read and write the real tables. When it
 * isn't — local dev, or a deploy missing env vars — they fall back to
 * localStorage so the buttons still behave correctly instead of silently
 * doing nothing. Either way the UI updates optimistically and rolls back on
 * failure, so a click never leaves the button in a lying state.
 */

const LS_PREFIX = 'torquegrid:'

function readLocal(bucket) {
  try { return new Set(JSON.parse(localStorage.getItem(LS_PREFIX + bucket) || '[]')) }
  catch { return new Set() }
}

function writeLocal(bucket, set) {
  try { localStorage.setItem(LS_PREFIX + bucket, JSON.stringify([...set])) } catch { /* quota */ }
}

/** Fire-and-forget event so every mounted copy of a button stays in sync. */
function broadcast(bucket, id, active) {
  window.dispatchEvent(new CustomEvent('tg:social', { detail: { bucket, id, active } }))
}

/**
 * @param bucket  'follows' | 'saves' | 'likes'
 * @param id      the profile / post id being acted on
 * @param remote  { add, remove, check } — Supabase calls, optional
 */
export function useToggleState(bucket, id, remote) {
  const [active, setActive]   = useState(() => readLocal(bucket).has(String(id)))
  const [pending, setPending] = useState(false)

  // Hydrate from the server when we have one, so a refresh on another
  // device still shows the right state.
  useEffect(() => {
    let cancelled = false
    if (!isSupabaseConfigured || !remote?.check || id == null) return
    remote.check(id)
      .then(v => { if (!cancelled && typeof v === 'boolean') setActive(v) })
      .catch(() => { /* keep the local value */ })
    return () => { cancelled = true }
  }, [id])

  // Keep sibling instances of the same entity in step.
  useEffect(() => {
    const onSync = e => {
      if (e.detail.bucket === bucket && String(e.detail.id) === String(id)) {
        setActive(e.detail.active)
      }
    }
    window.addEventListener('tg:social', onSync)
    return () => window.removeEventListener('tg:social', onSync)
  }, [bucket, id])

  const toggle = useCallback(async () => {
    if (pending || id == null) return
    const next = !active

    // Optimistic: flip immediately, persist locally, tell siblings.
    setActive(next)
    setPending(true)
    const local = readLocal(bucket)
    next ? local.add(String(id)) : local.delete(String(id))
    writeLocal(bucket, local)
    broadcast(bucket, id, next)

    if (isSupabaseConfigured && remote) {
      try {
        const { error } = next ? await remote.add(id) : await remote.remove(id)
        // A duplicate insert means the server already agrees with us.
        if (error && error.code !== '23505') throw error
      } catch (err) {
        // Roll back so the button never claims something that didn't happen.
        setActive(active)
        const revert = readLocal(bucket)
        active ? revert.add(String(id)) : revert.delete(String(id))
        writeLocal(bucket, revert)
        broadcast(bucket, id, active)
        notify.error(err?.message || 'Could not save that — try again.')
      }
    }
    setPending(false)
  }, [active, pending, id, bucket, remote])

  return { active, pending, toggle }
}

/* ── Concrete bindings ──────────────────────────────────── */

async function currentUserId() {
  const { data: { user } } = await supabase.auth.getUser()
  return user?.id ?? null
}

export function useFollow(profileId) {
  return useToggleState('follows', profileId, {
    add: async id => {
      const me = await currentUserId()
      if (!me) return { error: null }
      return supabase.from('follows').insert({ follower_id: me, following_id: id })
    },
    remove: async id => {
      const me = await currentUserId()
      if (!me) return { error: null }
      return supabase.from('follows').delete().match({ follower_id: me, following_id: id })
    },
    check: async id => {
      const me = await currentUserId()
      if (!me) return undefined
      const { data } = await supabase.from('follows').select('id')
        .match({ follower_id: me, following_id: id }).maybeSingle()
      return !!data
    },
  })
}

export function useSavePost(postId) {
  return useToggleState('saves', postId, {
    add: async id => {
      const me = await currentUserId()
      if (!me) return { error: null }
      return supabase.from('saved_posts').insert({ user_id: me, post_id: id })
    },
    remove: async id => {
      const me = await currentUserId()
      if (!me) return { error: null }
      return supabase.from('saved_posts').delete().match({ user_id: me, post_id: id })
    },
    check: async id => {
      const me = await currentUserId()
      if (!me) return undefined
      const { data } = await supabase.from('saved_posts').select('id')
        .match({ user_id: me, post_id: id }).maybeSingle()
      return !!data
    },
  })
}

export function useLikePost(postId) {
  return useToggleState('likes', postId, {
    add: async id => {
      const me = await currentUserId()
      if (!me) return { error: null }
      return supabase.from('post_likes').insert({ user_id: me, post_id: id })
    },
    remove: async id => {
      const me = await currentUserId()
      if (!me) return { error: null }
      return supabase.from('post_likes').delete().match({ user_id: me, post_id: id })
    },
    check: async id => {
      const me = await currentUserId()
      if (!me) return undefined
      const { data } = await supabase.from('post_likes').select('id')
        .match({ user_id: me, post_id: id }).maybeSingle()
      return !!data
    },
  })
}

/** Ids currently saved — powers the "Saved reels" shelf and saved feeds. */
export function useSavedIds(bucket = 'saves') {
  const [ids, setIds] = useState(() => readLocal(bucket))
  useEffect(() => {
    const onSync = e => { if (e.detail.bucket === bucket) setIds(readLocal(bucket)) }
    window.addEventListener('tg:social', onSync)
    return () => window.removeEventListener('tg:social', onSync)
  }, [bucket])
  return ids
}
