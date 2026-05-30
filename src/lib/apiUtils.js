// Central error handler — turns Supabase error objects into thrown Errors
export function handleResponse({ data, error }) {
  if (error) {
    // Map common Supabase error codes to readable messages
    const msg = {
      '23505': 'This already exists (duplicate entry).',
      '42501': 'You do not have permission to do that.',
      'PGRST116': 'Record not found.',
    }[error.code] || error.message || 'An unexpected error occurred'
    throw new Error(msg)
  }
  return data
}

// Simple client-side rate limiter — prevents button-spamming
const lastCalled = {}
export function rateLimit(key, ms = 1000) {
  const now = Date.now()
  if (lastCalled[key] && now - lastCalled[key] < ms) {
    throw new Error('Too many requests. Please wait a moment.')
  }
  lastCalled[key] = now
}

// Validate file before upload
export function validateImageFile(file, maxMB = 5) {
  const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!allowed.includes(file.type)) throw new Error('Only JPG, PNG, WebP, and GIF images are allowed.')
  if (file.size > maxMB * 1024 * 1024) throw new Error(`File must be under ${maxMB}MB.`)
}
