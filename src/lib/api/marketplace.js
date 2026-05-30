import { supabase } from '../supabase'
import { handleResponse, validateImageFile } from '../apiUtils'

// ── Vehicles ──────────────────────────────────────────────

export async function getVehicleListings({ page = 0, limit = 20, filters = {} } = {}) {
  let query = supabase
    .from('marketplace_vehicles')
    .select('*, profiles(id, username, avatar_url)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (filters.make)       query = query.ilike('make', `%${filters.make}%`)
  if (filters.model)      query = query.ilike('model', `%${filters.model}%`)
  if (filters.type)       query = query.eq('type', filters.type)
  if (filters.min_price)  query = query.gte('price', filters.min_price)
  if (filters.max_price)  query = query.lte('price', filters.max_price)
  if (filters.condition)  query = query.eq('condition', filters.condition)

  const { data, error } = await query
  return { data, error }
}

export async function createVehicleListing(listing, imageFiles = []) {
  const { data: { user } } = await supabase.auth.getUser()
  const imageUrls = []

  for (const file of imageFiles) {
    validateImageFile(file)
    const ext = file.name.split('.').pop()
    const path = `vehicles/${user.id}/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from('marketplace').upload(path, file)
    if (upErr) throw new Error(upErr.message)
    const { data } = supabase.storage.from('marketplace').getPublicUrl(path)
    imageUrls.push(data.publicUrl)
  }

  const { data, error } = await supabase
    .from('marketplace_vehicles')
    .insert({ ...listing, seller_id: user.id, image_urls: imageUrls })
    .select()
    .single()
  return { data, error }
}

// ── Parts ─────────────────────────────────────────────────

export async function getPartsListings({ page = 0, limit = 20, filters = {} } = {}) {
  let query = supabase
    .from('marketplace_parts')
    .select('*, profiles(id, username, avatar_url)')
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (filters.category)  query = query.eq('category', filters.category)
  if (filters.min_price) query = query.gte('price', filters.min_price)
  if (filters.max_price) query = query.lte('price', filters.max_price)
  if (filters.search)    query = query.textSearch('title', filters.search)

  const { data, error } = await query
  return { data, error }
}

export async function createPartsListing(listing, imageFiles = []) {
  const { data: { user } } = await supabase.auth.getUser()
  const imageUrls = []

  for (const file of imageFiles) {
    validateImageFile(file)
    const ext = file.name.split('.').pop()
    const path = `parts/${user.id}/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from('marketplace').upload(path, file)
    if (upErr) throw new Error(upErr.message)
    const { data } = supabase.storage.from('marketplace').getPublicUrl(path)
    imageUrls.push(data.publicUrl)
  }

  const { data, error } = await supabase
    .from('marketplace_parts')
    .insert({ ...listing, seller_id: user.id, image_urls: imageUrls })
    .select()
    .single()
  return { data, error }
}

export async function sendEnquiry({ listingId, listingType, message, offerPrice }) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('marketplace_enquiries')
    .insert({ listing_id: listingId, listing_type: listingType, buyer_id: user.id, message, offer_price: offerPrice })
    .select()
    .single()
  return { data, error }
}
