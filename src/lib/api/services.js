import { supabase } from '../supabase'

export async function getServices({ type = null, search = '', page = 0, limit = 20 } = {}) {
  let query = supabase
    .from('services')
    .select('*, profiles:provider_id ( id, username, avatar_url, is_verified )')
    .eq('is_active', true)
    .order('rating', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (type)   query = query.eq('service_type', type)
  if (search) query = query.ilike('title', `%${search}%`)

  const { data, error } = await query
  return { data: data ?? [], error }
}

export async function getService(id) {
  const { data, error } = await supabase
    .from('services')
    .select('*, profiles:provider_id ( id, username, avatar_url, is_verified ), service_reviews ( * )')
    .eq('id', id)
    .single()
  return { data, error }
}

export async function submitServiceEnquiry({ serviceId, phone, message, serviceType, providerName }) {
  const { data: { user } } = await supabase.auth.getUser()

  // If no auth (demo mode), just return success
  if (!user) return { data: { id: 'demo', status: 'pending' }, error: null }

  const { data, error } = await supabase
    .from('service_enquiries')
    .insert({
      service_id:    serviceId || null,
      user_id:       user.id,
      phone,
      message:       message || null,
      service_type:  serviceType || null,
      provider_name: providerName || null,
    })
    .select()
    .single()
  return { data, error }
}

export async function submitServiceReview({ serviceId, rating, body }) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Must be logged in to leave a review')

  const { data, error } = await supabase
    .from('service_reviews')
    .upsert({ service_id: serviceId, reviewer_id: user.id, rating, body }, { onConflict: 'service_id,reviewer_id' })
    .select()
    .single()

  if (!error) {
    // Update avg rating
    const { data: reviews } = await supabase
      .from('service_reviews')
      .select('rating')
      .eq('service_id', serviceId)

    if (reviews?.length) {
      const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      await supabase.from('services').update({ rating: Math.round(avg * 10) / 10, review_count: reviews.length }).eq('id', serviceId)
    }
  }
  return { data, error }
}
