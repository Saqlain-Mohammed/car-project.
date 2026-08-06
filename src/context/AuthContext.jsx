import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

const AuthContext = createContext({})

const DEMO_USER = {
  id: 'demo-123',
  email: 'demo@torquegrid.com',
  user_metadata: {
    username: 'GarageKing',
    vehicle: { make: 'Royal Enfield', model: 'Meteor 350', year: '2023', type: 'bike' }
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {

    if (!isSupabaseConfigured) {
      const saved = localStorage.getItem('demo_user')
      if (saved) setUser(JSON.parse(saved))
      setLoading(false)
      return
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => setUser(session?.user ?? null)
    )
    return () => subscription.unsubscribe()
  }, [])

  /**
   * supabase-js surfaces a dead endpoint as the browser's raw "Failed to
   * fetch", which reads like the user mistyped something. Anything that never
   * reached the server is a connection problem, so say that instead.
   */
  const explain = (result) => {
    const msg = result?.error?.message || ''
    if (/failed to fetch|network ?error|load failed/i.test(msg)) {
      return { ...result, error: { ...result.error, message:
        "Can't reach the server. Check your connection — if it persists, the backend may be unavailable." } }
    }
    return result
  }

  const signIn = async (email, password) => {
    if (!isSupabaseConfigured) {
      const u = { ...DEMO_USER, email }
      setUser(u)
      localStorage.setItem('demo_user', JSON.stringify(u))
      return { data: u, error: null }
    }
    return explain(await supabase.auth.signInWithPassword({ email, password }))
  }

  const signUp = async (email, password, username, vehicle) => {
    if (!isSupabaseConfigured) {
      const u = { ...DEMO_USER, email, user_metadata: { username, vehicle } }
      setUser(u)
      localStorage.setItem('demo_user', JSON.stringify(u))
      return { data: u, error: null }
    }
    return explain(await supabase.auth.signUp({ email, password, options: { data: { username, vehicle } } }))
  }

  const signOut = async () => {
    localStorage.removeItem('demo_user')
    setUser(null)
    if (isSupabaseConfigured) {
        await supabase.auth.signOut()
    }
  }

  /**
   * Sends the reset link. Supabase redirects back to `/auth`, where the
   * recovery session lets the user set a new password.
   */
  const resetPassword = async (email) => {
    if (!isSupabaseConfigured) {
      return { error: { message: 'Password reset needs a backend connection.' } }
    }
    return explain(await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth`,
    }))
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)