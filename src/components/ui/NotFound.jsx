import { useNavigate, useLocation } from 'react-router-dom'
import { Compass } from 'lucide-react'
import { C, D, R } from '../../lib/theme'
import { Button } from './Primitives'

/**
 * Terminal state for any URL the router can't match.
 *
 * Without this, an unknown `/app/*` path renders the shell with an empty
 * `<main>` — indistinguishable from a page that failed to load.
 */
export default function NotFound() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  return (
    <div className="t-enter" style={{
      minHeight: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: '1rem',
      padding: '2rem', textAlign: 'center', background: C.bg,
    }}>
      <div style={{
        width: 56, height: 56, display: 'grid', placeItems: 'center',
        borderRadius: R.lg, background: C.surface2, color: C.textMuted,
      }}>
        <Compass size={24} />
      </div>

      <h1 style={{
        fontFamily: D.display, fontSize: '1.5rem', fontWeight: 700,
        color: C.text, margin: 0, textWrap: 'balance',
      }}>
        This road doesn't go anywhere
      </h1>

      <p style={{
        fontFamily: D.body, fontSize: '0.9rem', color: C.textMuted,
        margin: 0, maxWidth: 380, lineHeight: 1.6, textWrap: 'pretty',
      }}>
        We couldn't find <code style={{ color: C.textSoft }}>{pathname}</code>. It may have
        moved, or the link that brought you here is out of date.
      </p>

      <div style={{ display: 'flex', gap: '0.6rem', marginTop: '0.5rem' }}>
        <Button onClick={() => navigate('/app')}>Back home</Button>
        <Button variant="outline" onClick={() => navigate('/app/explore')}>Go to Explore</Button>
      </div>
    </div>
  )
}
