import { supabase } from '../supabase'

export async function getProfile(username) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*, user_badges(*, badge_definitions(*))')
    .eq('username', username)
    .single()
  return { data, error }
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
  const ext = file.name.split('.').pop()
  const path = `${userId}/avatar.${ext}`
  const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
  if (uploadError) return { error: uploadError }
  const { data } = supabase.storage.from('avatars').getPublicUrl(path)
  return { url: data.publicUrl }
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
  const { data } = await supabase.from('follows').select('id').match({ follower_id: user.id, following_id: followingId }).maybeSingle()
  return !!data
}
