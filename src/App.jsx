import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import ErrorBoundary from './components/ui/ErrorBoundary'

// Code-split every page — only the current route's JS is loaded
const AuthPage      = lazy(() => import('./components/auth/AuthPage'))
const AppShell      = lazy(() => import('./components/layout/AppShell'))

const PageSpinner = () => (
  <div style={{
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    background: 'var(--bg)',
  }}>
    <div style={{
      width: 32, height: 32, borderRadius: '50%',
      border: '2px solid var(--accent)', borderTopColor: 'transparent',
      animation: 'spin 0.7s linear infinite',
    }} />
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
            <Route path="*" element={<Navigate to="/app" replace />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  )
}
