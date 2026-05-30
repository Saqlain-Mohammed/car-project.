import { supabase } from '../supabase'

export async function getCommunities({ search = '', type = null } = {}) {
  let query = supabase
    .from('communities')
    .select('*, community_members(count)')
    .eq('is_private', false)
    .order('member_count', { ascending: false })

  if (search) query = query.ilike('name', `%${search}%`)
  if (type)   query = query.eq('type', type)

  const { data, error } = await query
  return { data, error }
}

export async function joinCommunity(communityId) {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase
    .from('community_members')
    .insert({ community_id: communityId, user_id: user.id })
  return { error }
}

export async function leaveCommunity(communityId) {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase
    .from('community_members')
    .delete()
    .match({ community_id: communityId, user_id: user.id })
  return { error }
}

export async function getCommunityMessages(communityId, limit = 50) {
  const { data, error } = await supabase
    .from('community_messages')
    .select('*, profiles(id, username, avatar_url)')
    .eq('community_id', communityId)
    .order('created_at', { ascending: false })
    .limit(limit)
  return { data: data?.reverse(), error }
}

export async function sendCommunityMessage(communityId, body) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('community_messages')
    .insert({ community_id: communityId, sender_id: user.id, body })
    .select('*, profiles(id, username, avatar_url)')
    .single()
  return { data, error }
}

// Real-time subscription for live chat
export function subscribeToCommunityMessages(communityId, callback) {
  return supabase
    .channel(`community:${communityId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'community_messages',
      filter: `community_id=eq.${communityId}`,
    }, payload => callback(payload.new))
    .subscribe()
}
