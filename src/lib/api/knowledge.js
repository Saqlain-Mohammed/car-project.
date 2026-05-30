import { supabase } from '../supabase'

export async function searchVehicleCatalog({ make, model, year, type } = {}) {
  let query = supabase
    .from('vehicle_catalog')
    .select('*')
    .order('make')
    .limit(50)

  if (make)  query = query.ilike('make', `%${make}%`)
  if (model) query = query.ilike('model', `%${model}%`)
  if (year)  query = query.eq('year', year)
  if (type)  query = query.eq('type', type)

  const { data, error } = await query
  return { data, error }
}

export async function getCarParts(category = null) {
  let query = supabase.from('car_parts').select('*').order('name')
  if (category) query = query.eq('category', category)
  const { data, error } = await query
  return { data, error }
}

export async function getMaintenanceGuides({ category, difficulty } = {}) {
  let query = supabase.from('maintenance_guides').select('*, profiles(username, avatar_url)').eq('is_published', true).order('created_at', { ascending: false })
  if (category)   query = query.eq('category', category)
  if (difficulty) query = query.eq('difficulty', difficulty)
  const { data, error } = await query
  return { data, error }
}

export async function getNewsArticles({ category, page = 0, limit = 20 } = {}) {
  let query = supabase
    .from('news_articles')
    .select('id, title, slug, excerpt, cover_url, category, published_at, view_count, profiles(username, avatar_url)')
    .eq('is_published', true)
    .order('published_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (category) query = query.eq('category', category)
  const { data, error } = await query
  return { data, error }
}

export async function getNewsArticle(slug) {
  const { data, error } = await supabase
    .from('news_articles')
    .select('*, profiles(username, avatar_url)')
    .eq('slug', slug)
    .single()
  return { data, error }
}
