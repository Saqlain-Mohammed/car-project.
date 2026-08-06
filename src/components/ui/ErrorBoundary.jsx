import { Component } from 'react'

/**
 * Catches render-time crashes so one broken subtree doesn't blank the app.
 * Styled with CSS variables rather than the JS token object, because the
 * boundary has to survive a failure inside the theme module itself.
 */
export default class ErrorBoundary extends Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info?.componentStack)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div style={{
        minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg, #0B0D11)', padding: '2rem',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 420 }}>
          <div style={{
            width: 52, height: 52, margin: '0 auto 1.1rem', borderRadius: 16,
            background: 'var(--danger-bg, rgba(255,69,58,0.12))',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
          }}>⚠</div>

          <h2 style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.2rem', fontWeight: 700,
            color: 'var(--text, #F4F6F8)', marginBottom: '0.5rem',
          }}>
            Something went wrong
          </h2>

          <p style={{
            fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', lineHeight: 1.6,
            color: 'var(--text-muted, #6C7583)', marginBottom: '1.5rem',
          }}>
            {this.state.error?.message || 'An unexpected error occurred while rendering this view.'}
          </p>

          <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{
                fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', fontWeight: 600,
                padding: '0.65rem 1.4rem', borderRadius: 12, cursor: 'pointer',
                background: 'var(--accent, #4C8DFF)', color: '#fff', border: 'none',
              }}>
              Try again
            </button>
            <button
              onClick={() => { window.location.href = '/app' }}
              style={{
                fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', fontWeight: 600,
                padding: '0.65rem 1.4rem', borderRadius: 12, cursor: 'pointer',
                background: 'transparent', color: 'var(--text-soft, #A3ABB8)',
                border: '1px solid var(--border-mid, rgba(255,255,255,0.10))',
              }}>
              Go home
            </button>
          </div>
        </div>
      </div>
    )
  }
}
