import { supabase } from '../supabase'
import { validateImageFile } from '../apiUtils'

export async function getEvents({ type = null, upcoming = true, page = 0, limit = 20 } = {}) {
  let query = supabase
    .from('events')
    .select(`
      *,
      profiles:organizer_id ( id, username, avatar_url, is_verified ),
      communities ( id, name, slug )
    `)
    .eq('is_published', true)
    .order('starts_at', { ascending: true })
    .range(page * limit, (page + 1) * limit - 1)

  if (upcoming) query = query.gte('starts_at', new Date().toISOString())
  if (type)    query = query.eq('event_type', type)

  const { data, error } = await query
  return { data: data ?? [], error }
}

export async function getEvent(id) {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      profiles:organizer_id ( id, username, avatar_url, is_verified ),
      event_attendees ( user_id, status, profiles ( username, avatar_url ) )
    `)
    .eq('id', id)
    .single()
  return { data, error }
}

export async function createEvent(event, coverFile = null) {
  const { data: { user } } = await supabase.auth.getUser()
  let cover_url = null

  if (coverFile) {
    validateImageFile(coverFile)
    const ext = coverFile.name.split('.').pop()
    const path = `events/${user.id}/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from('community-media').upload(path, coverFile)
    if (upErr) throw new Error(upErr.message)
    const { data } = supabase.storage.from('community-media').getPublicUrl(path)
    cover_url = data.publicUrl
  }

  const { data, error } = await supabase
    .from('events')
    .insert({ ...event, organizer_id: user.id, cover_url })
    .select()
    .single()
  return { data, error }
}

export async function updateEvent(id, updates) {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  return { data, error }
}

export async function deleteEvent(id) {
  const { error } = await supabase.from('events').delete().eq('id', id)
  return { error }
}

export async function joinEvent(eventId, status = 'going') {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('event_attendees')
    .upsert({ event_id: eventId, user_id: user.id, status }, { onConflict: 'event_id,user_id' })
    .select()
    .single()
  return { data, error }
}

export async function leaveEvent(eventId) {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase
    .from('event_attendees')
    .delete()
    .match({ event_id: eventId, user_id: user.id })
  return { error }
}

export async function getMyAttendance(eventId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { data: null }
  const { data } = await supabase
    .from('event_attendees')
    .select('status')
    .match({ event_id: eventId, user_id: user.id })
    .maybeSingle()
  return { data }
}

export async function getEventAttendees(eventId) {
  const { data, error } = await supabase
    .from('event_attendees')
    .select('*, profiles ( id, username, avatar_url )')
    .eq('event_id', eventId)
    .eq('status', 'going')
    .limit(50)
  return { data: data ?? [], error }
}
