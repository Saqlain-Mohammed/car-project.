import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'
import { isSupabaseConfigured } from './lib/supabase.js'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,   // 2 min — data stays fresh
      gcTime:    1000 * 60 * 10,  // 10 min — keep in cache
      // Without a backend every query is guaranteed to fail; retrying just
      // triples the console noise before the same seeded fallback renders.
      retry: isSupabaseConfigured ? 2 : 0,
      refetchOnWindowFocus: false,
    },
    mutations: { retry: isSupabaseConfigured ? 1 : 0 },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
        {/* Toasts read the theme variables so they follow light/dark. */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--surface-2)',
              color: 'var(--text)',
              border: '1px solid var(--border-mid)',
              boxShadow: 'var(--shadow-lg)',
              borderRadius: '12px',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: 'var(--success)', secondary: 'var(--surface-2)' } },
            error:   { iconTheme: { primary: 'var(--danger)',  secondary: 'var(--surface-2)' } },
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
