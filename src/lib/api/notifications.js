import { supabase } from '../supabase'

export async function getNotifications({ page = 0, limit = 30 } = {}) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: [], error: null }

  const { data, error } = await supabase
    .from('notifications')
    .select('*, actor:actor_id ( username, avatar_url )')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  return { data: data ?? [], error }
}

export async function getUnreadCount() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { count: 0 }

  const { count, error } = await supabase
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  return { count: count ?? 0, error }
}

export async function markNotificationRead(notificationId) {
  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
  return { error }
}

export async function markAllNotificationsRead() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: null }

  const { error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)
  return { error }
}

export function subscribeToNotifications(userId, callback) {
  return supabase
    .channel(`notifications:${userId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'notifications',
      filter: `user_id=eq.${userId}`,
    }, payload => callback(payload.new))
    .subscribe()
}
