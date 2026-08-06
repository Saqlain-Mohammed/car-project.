import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Car, Film, LayoutGrid, Newspaper } from 'lucide-react'
import { C, D, R } from '../../lib/theme'
import { Avatar } from '../ui/Primitives'
import PostsSection   from './sections/PostsSection'
import GarageProfile  from './sections/GarageProfile'
import ReelsSection   from './sections/ReelsSection'
import NewsSection    from './sections/NewsSection'

/* Wallpapers and Skills are post content_types, not separate surfaces —
   they live as filters inside the feed instead of their own routes. */
const NAV_LINKS = [
  { path: '',       label: 'Feed',      Icon: LayoutGrid, exact: true },
  { path: 'garage', label: 'My Garage', Icon: Car },
  { path: 'reels',  label: 'Reels',     Icon: Film },
  { path: 'news',   label: 'News',      Icon: Newspaper },
]

export default function ExplorePage() {
  const { user }  = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const username  = user?.user_metadata?.username || 'You'

  return (
    <div className="tg-shell" style={{ display: 'flex', minHeight: 'calc(100vh - 60px)', background: C.bg }}>

      <aside className="tg-sidebar" style={{
        width: 232, flexShrink: 0, background: C.bgSubtle,
        boxShadow: `inset -1px 0 0 ${C.border}`,
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 60, height: 'calc(100vh - 60px)',
      }}>
        <nav style={{ padding: '1.5rem 0.85rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
          <div style={{
            fontFamily: D.body, fontSize: '0.68rem', fontWeight: 700,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: C.textDim, padding: '0 0.75rem', marginBottom: '0.75rem',
          }}>Explore</div>

          {NAV_LINKS.map(({ path, label, Icon, exact }) => {
            const fullPath = `/app/explore${path ? `/${path}` : ''}`
            const isActive = exact
              ? location.pathname === '/app/explore' || location.pathname === '/app/explore/'
              : location.pathname.includes(`/app/explore/${path}`)
            return (
              <button key={path} onClick={() => navigate(fullPath)} className="t-press"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.7rem',
                  width: '100%', height: 42, padding: '0 0.75rem',
                  background: isActive ? C.accentBg : 'transparent',
                  border: 'none', borderRadius: R.md, cursor: 'pointer', textAlign: 'left',
                  color: isActive ? C.accentHi : C.textMuted,
                  fontFamily: D.body, fontSize: '0.875rem', fontWeight: isActive ? 600 : 500,
                  transition: 'background-color 150ms cubic-bezier(0.22,1,0.36,1), color 150ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = C.surface; e.currentTarget.style.color = C.textSoft } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.textMuted } }}>
                <Icon size={17} style={{ flexShrink: 0 }} />
                {label}
              </button>
            )
          })}
        </nav>

        <div className="tg-sidebar-extra" style={{ marginTop: 'auto', padding: '0.85rem' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.65rem',
            padding: '0.65rem', background: C.surface, borderRadius: R.md,
          }}>
            <Avatar name={username} size={32} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: D.body, fontSize: '0.825rem', fontWeight: 600, color: C.text, overflow: 'hidden', textOverflow: 'ellipsis' }}>{username}</div>
              <div style={{ fontFamily: D.body, fontSize: '0.7rem', color: C.success, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: C.success }} /> Online
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div style={{ flex: 1, minWidth: 0 }}>
        <Routes>
          <Route path=""       element={<PostsSection />}  />
          <Route path="garage" element={<GarageProfile />} />
          <Route path="reels"  element={<ReelsSection />}  />
          <Route path="news"   element={<NewsSection />}   />
        </Routes>
      </div>
    </div>
  )
}
