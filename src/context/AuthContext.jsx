import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext({})

const DEMO_USER = {
  id: 'demo-123',
  email: 'demo@revvit.com',
  user_metadata: {
    username: 'GarageKing',
    vehicle: { make: 'Royal Enfield', model: 'Meteor 350', year: '2023', type: 'bike' }
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const hasSupabase = import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_URL !== 'your_supabase_project_url'

    if (!hasSupabase) {
      const saved = localStorage.getItem('demo_user')
      if (saved) setUser(JSON.parse(saved))
      setLoading(false)
      return
    }

    import('../lib/supabase').then(({ supabase }) => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null)
        setLoading(false)
      })
      supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })
    })
  }, [])

  const signIn = async (email, password) => {
    const hasSupabase = import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_URL !== 'your_supabase_project_url'
    if (!hasSupabase) {
      const u = { ...DEMO_USER, email }
      setUser(u)
      localStorage.setItem('demo_user', JSON.stringify(u))
      return { data: u, error: null }
    }
    const { supabase } = await import('../lib/supabase')
    return supabase.auth.signInWithPassword({ email, password })
  }

  const signUp = async (email, password, username, vehicle) => {
    const hasSupabase = import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_URL !== 'your_supabase_project_url'
    if (!hasSupabase) {
      const u = { ...DEMO_USER, email, user_metadata: { username, vehicle } }
      setUser(u)
      localStorage.setItem('demo_user', JSON.stringify(u))
      return { data: u, error: null }
    }
    const { supabase } = await import('../lib/supabase')
    return supabase.auth.signUp({ email, password, options: { data: { username, vehicle } } })
  }

  const signOut = async () => {
    localStorage.removeItem('demo_user')
    setUser(null)
    const hasSupabase = import.meta.env.VITE_SUPABASE_URL &&
      import.meta.env.VITE_SUPABASE_URL !== 'your_supabase_project_url'
    if (hasSupabase) {
      const { supabase } = await import('../lib/supabase')
      await supabase.auth.signOut()
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)