import { supabase } from '../supabase'
import { validateImageFile } from '../apiUtils'

export async function getProfile(username) {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      user_badges (
        awarded_at,
        badge_definitions ( id, name, description, icon_url, category )
      )
    `)
    .eq('username', username)
    .single()
  return { data, error }
}

export async function getProfileById(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, user_badges ( badge_definitions ( * ) )')
    .eq('id', userId)
    .single()
  return { data, error }
}

export async function searchProfiles(query, limit = 10) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, is_verified, follower_count')
    .or(`username.ilike.%${query}%,display_name.ilike.%${query}%`)
    .order('follower_count', { ascending: false })
    .limit(limit)
  return { data: data ?? [], error }
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  return { data, error }
}

export async function uploadAvatar(userId, file) {
  validateImageFile(file)
  const ext = file.name.split('.').pop()
  const path = `${userId}/avatar.${ext}`
  const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
  if (uploadError) return { error: uploadError }
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  // Persist URL back to profile
  await supabase.from('profiles').update({ avatar_url: data.publicUrl }).eq('id', userId)
  return { url: data.publicUrl, error: null }
}

export async function uploadCover(userId, file) {
  validateImageFile(file)
  const ext = file.name.split('.').pop()
  const path = `${userId}/cover.${ext}`
  const { error: uploadError } = await supabase.storage.from('covers').upload(path, file, { upsert: true })
  if (uploadError) return { error: uploadError }
  const { data } = supabase.storage.from('covers').getPublicUrl(path)
  await supabase.from('profiles').update({ cover_url: data.publicUrl }).eq('id', userId)
  return { url: data.publicUrl, error: null }
}

export async function followUser(followingId) {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('follows').insert({ follower_id: user.id, following_id: followingId })
  return { error }
}

export async function unfollowUser(followingId) {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('follows').delete().match({ follower_id: user.id, following_id: followingId })
  return { error }
}

export async function isFollowing(followingId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data } = await supabase.from('follows').select('id').match({ follower_id: user.id, following_id: followingId }).maybeSingle()
  return !!data
}

export async function getFollowers(userId, limit = 20) {
  const { data, error } = await supabase
    .from('follows')
    .select('follower:follower_id ( id, username, avatar_url, is_verified, follower_count )')
    .eq('following_id', userId)
    .limit(limit)
  return { data: data?.map(d => d.follower) ?? [], error }
}

export async function getFollowing(userId, limit = 20) {
  const { data, error } = await supabase
    .from('follows')
    .select('following:following_id ( id, username, avatar_url, is_verified, follower_count )')
    .eq('follower_id', userId)
    .limit(limit)
  return { data: data?.map(d => d.following) ?? [], error }
}
