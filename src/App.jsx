import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ErrorBoundary from './components/ui/ErrorBoundary'

// Code-split every page — only the current route's JS is loaded
const AuthPage      = lazy(() => import('./components/auth/AuthPage'))
const AppShell      = lazy(() => import('./components/layout/AppShell'))

const PageSpinner = () => (
  <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-primary)' }}>
    <div className="w-8 h-8 border-2 rounded-full animate-spin"
      style={{ borderColor: 'var(--accent-orange)', borderTopColor: 'transparent' }} />
  </div>
)

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageSpinner />
  return user ? children : <Navigate to="/auth" replace />
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <PageSpinner />
  return !user ? children : <Navigate to="/app" replace />
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<PageSpinner />}>
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={
              <PublicRoute><AuthPage /></PublicRoute>
            } />
            <Route path="/app/*" element={
              <ProtectedRoute>
                <ErrorBoundary>
                  <AppShell />
                </ErrorBoundary>
              </ProtectedRoute>
            } />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
