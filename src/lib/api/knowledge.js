import { supabase } from '../supabase'

export async function searchVehicleCatalog({ make, model, year, type, query } = {}) {
  let q = supabase
    .from('vehicle_catalog')
    .select('*')
    .order('make')
    .limit(50)

  if (make)  q = q.ilike('make', `%${make}%`)
  if (model) q = q.ilike('model', `%${model}%`)
  if (year)  q = q.eq('year', year)
  if (type)  q = q.eq('type', type)
  if (query) q = q.or(`make.ilike.%${query}%,model.ilike.%${query}%`)

  const { data, error } = await q
  return { data: data ?? [], error }
}

export async function getVehicleById(id) {
  const { data, error } = await supabase.from('vehicle_catalog').select('*').eq('id', id).single()
  return { data, error }
}

export async function getCarParts(category = null) {
  let q = supabase.from('car_parts').select('*').order('name')
  if (category) q = q.eq('category', category)
  const { data, error } = await q
  return { data: data ?? [], error }
}

export async function getCarPart(id) {
  const { data, error } = await supabase.from('car_parts').select('*').eq('id', id).single()
  return { data, error }
}

export async function getMaintenanceGuides({ category, difficulty } = {}) {
  let q = supabase
    .from('maintenance_guides')
    .select('*, profiles ( username, avatar_url )')
    .eq('is_published', true)
    .order('created_at', { ascending: false })

  if (category)   q = q.eq('category', category)
  if (difficulty) q = q.eq('difficulty', difficulty)

  const { data, error } = await q
  return { data: data ?? [], error }
}

export async function getMaintenanceGuide(id) {
  const { data, error } = await supabase
    .from('maintenance_guides')
    .select('*, profiles ( username, avatar_url )')
    .eq('id', id)
    .single()

  if (!error && data) {
    // Increment view count silently
    await supabase.from('maintenance_guides').update({ view_count: (data.view_count || 0) + 1 }).eq('id', id).catch(() => {})
  }
  return { data, error }
}

export async function getNewsArticles({ category, page = 0, limit = 20 } = {}) {
  let q = supabase
    .from('news_articles')
    .select('id, title, slug, excerpt, cover_url, category, published_at, view_count, profiles ( username, avatar_url )')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (category) q = q.eq('category', category)

  const { data, error } = await q
  return { data: data ?? [], error }
}

export async function getNewsArticle(slug) {
  const { data, error } = await supabase
    .from('news_articles')
    .select('*, profiles ( username, avatar_url )')
    .eq('slug', slug)
    .single()

  if (!error && data) {
    await supabase.from('news_articles').update({ view_count: (data.view_count || 0) + 1 }).eq('id', data.id).catch(() => {})
  }
  return { data, error }
}

export async function searchAllKnowledge(query) {
  const [catalog, parts, guides, news] = await Promise.all([
    searchVehicleCatalog({ query }),
    supabase.from('car_parts').select('id,name,category').ilike('name', `%${query}%`).limit(5),
    supabase.from('maintenance_guides').select('id,title,category,difficulty').eq('is_published', true).ilike('title', `%${query}%`).limit(5),
    supabase.from('news_articles').select('id,title,slug,category').eq('is_published', true).ilike('title', `%${query}%`).limit(5),
  ])

  return {
    vehicles: catalog.data ?? [],
    parts:    parts.data ?? [],
    guides:   guides.data ?? [],
    news:     news.data ?? [],
  }
}
