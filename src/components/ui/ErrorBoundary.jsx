import { Component } from 'react'

const C = { bg: '#1f2230', surface: '#2a2f40', coral: '#EF8354', text: '#EDEEF0', textMuted: '#8b90a0' }

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg }}>
          <div style={{ textAlign: 'center', padding: '2rem', maxWidth: 400 }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>⚠️</div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '1.25rem', fontWeight: 700, color: C.text, marginBottom: '0.5rem' }}>
              Something went wrong
            </div>
            <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', color: C.textMuted, marginBottom: '1.5rem' }}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </div>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', fontWeight: 600, padding: '0.65rem 1.5rem', background: C.coral, color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer' }}>
              Try Again
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
