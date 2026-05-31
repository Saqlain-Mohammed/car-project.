import { supabase } from '../supabase'
import { validateImageFile } from '../apiUtils'

export async function getFeed({ page = 0, limit = 20, type = null, postType = null } = {}) {
  let query = supabase
    .from('posts')
    .select(`
      *,
      profiles ( id, username, avatar_url, is_verified, is_company, display_name )
    `)
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)

  if (type)     query = query.eq('content_type', type)
  if (postType) query = query.eq('post_type', postType)

  const { data, error } = await query
  return { data: data ?? [], error }
}

export async function getCompanyFeed({ page = 0, limit = 10 } = {}) {
  const { data, error } = await supabase
    .from('posts')
    .select('*, profiles ( id, username, avatar_url, is_verified, is_company, display_name )')
    .eq('is_published', true)
    .eq('post_type', 'company')
    .order('created_at', { ascending: false })
    .range(page * limit, (page + 1) * limit - 1)
  return { data: data ?? [], error }
}

export async function createPost(post, mediaFiles = []) {
  const { data: { user } } = await supabase.auth.getUser()
  const mediaUrls = []

  for (const file of mediaFiles) {
    validateImageFile(file)
    const ext = file.name.split('.').pop()
    const bucket = post.content_type === 'reel' ? 'reels' : post.content_type === 'wallpaper' ? 'wallpapers' : 'posts'
    const path = `${user.id}/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from(bucket).upload(path, file)
    if (upErr) throw new Error(upErr.message)
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    mediaUrls.push(data.publicUrl)
  }

  const { data, error } = await supabase
    .from('posts')
    .insert({ ...post, author_id: user.id, media_urls: mediaUrls })
    .select('*, profiles ( id, username, avatar_url, is_verified, is_company )')
    .single()
  return { data, error }
}

export async function likePost(postId) {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id })
  return { error }
}

export async function unlikePost(postId) {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('post_likes').delete().match({ post_id: postId, user_id: user.id })
  return { error }
}

export async function isPostLiked(postId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data } = await supabase.from('post_likes').select('id').match({ post_id: postId, user_id: user.id }).maybeSingle()
  return !!data
}

export async function getComments(postId) {
  const { data, error } = await supabase
    .from('comments')
    .select(`
      *,
      profiles ( id, username, avatar_url ),
      replies:comments!parent_id ( *, profiles ( id, username, avatar_url ) )
    `)
    .eq('post_id', postId)
    .is('parent_id', null)
    .order('created_at', { ascending: true })
  return { data: data ?? [], error }
}

export async function addComment(postId, body, parentId = null) {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('comments')
    .insert({ post_id: postId, author_id: user.id, body, parent_id: parentId })
    .select('*, profiles ( id, username, avatar_url )')
    .single()
  return { data, error }
}

export async function savePost(postId) {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('saved_posts').insert({ post_id: postId, user_id: user.id })
  return { error }
}

export async function unsavePost(postId) {
  const { data: { user } } = await supabase.auth.getUser()
  const { error } = await supabase.from('saved_posts').delete().match({ post_id: postId, user_id: user.id })
  return { error }
}

export async function getSavedPosts() {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('saved_posts')
    .select('*, posts ( *, profiles ( id, username, avatar_url ) )')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  return { data: data ?? [], error }
}

export async function isPostSaved(postId) {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return false
  const { data } = await supabase.from('saved_posts').select('id').match({ post_id: postId, user_id: user.id }).maybeSingle()
  return !!data
}

export async function deletePost(postId) {
  const { error } = await supabase.from('posts').delete().eq('id', postId)
  return { error }
}

export async function incrementViewCount(postId) {
  await supabase.rpc('increment_post_views', { post_id: postId }).catch(() => {})
}
