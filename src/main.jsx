import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ui/ErrorBoundary.jsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:        1000 * 60 * 2,   // 2 min — data stays fresh
      gcTime:           1000 * 60 * 10,  // 10 min — keep in cache
      retry:            2,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#2a2f40',
              color: '#EDEEF0',
              border: '1px solid rgba(191,192,192,0.18)',
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.875rem',
            },
            success: { iconTheme: { primary: '#5eaa7e', secondary: '#2a2f40' } },
            error:   { iconTheme: { primary: '#ef4444', secondary: '#2a2f40' } },
          }}
        />
      </QueryClientProvider>
    </ErrorBoundary>
  </StrictMode>,
)
