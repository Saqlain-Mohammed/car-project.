import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Flag, CalendarDays, Users } from 'lucide-react'
import { C, D, R } from '../../lib/theme'
import { Avatar } from '../ui/Primitives'
import { useCommunityStats, stat } from '../../hooks/useCommunityStats'
import MotorsportSection from './sections/MotorsportSection'
import MeetupsSection    from './sections/MeetupsSection'
import CrewsSection      from './sections/CrewsSection'

/* Car spotting lives in the Feed as a content filter, not its own surface. */
const NAV_LINKS = [
  { path: '',        label: 'Motorsport', Icon: Flag,         exact: true },
  { path: 'meetups', label: 'Meetups',    Icon: CalendarDays },
  { path: 'crews',   label: 'Crews',      Icon: Users        },
]

export default function CommunityPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const username = user?.user_metadata?.username || 'You'
  const { data: stats, isLoading: statsLoading } = useCommunityStats()

  return (
    <div className="tg-shell" style={{ display:'flex', minHeight:'calc(100vh - 60px)', background:C.bg }}>

      <aside className="tg-sidebar" style={{
        width:232, flexShrink:0, background:C.bgSubtle,
        boxShadow:`inset -1px 0 0 ${C.border}`,
        display:'flex', flexDirection:'column',
        position:'sticky', top:60, height:'calc(100vh - 60px)',
      }}>
        <nav style={{ padding:'1.5rem 0.85rem 1rem', display:'flex', flexDirection:'column', gap:'0.15rem' }}>
          <div style={{
            fontFamily:D.body, fontSize:'0.68rem', fontWeight:700,
            letterSpacing:'0.16em', textTransform:'uppercase',
            color:C.textDim, padding:'0 0.75rem', marginBottom:'0.75rem',
          }}>Community</div>

          {NAV_LINKS.map(({ path, label, Icon, exact }) => {
            const fullPath = `/app/community${path ? `/${path}` : ''}`
            const isActive = exact
              ? location.pathname === '/app/community' || location.pathname === '/app/community/'
              : location.pathname.includes(`/app/community/${path}`)
            return (
              <button key={path} onClick={() => navigate(fullPath)} className="t-press"
                style={{
                  display:'flex', alignItems:'center', gap:'0.7rem',
                  width:'100%', height:42, padding:'0 0.75rem',
                  background: isActive ? C.accentBg : 'transparent',
                  border:'none', borderRadius:R.md, cursor:'pointer', textAlign:'left',
                  color: isActive ? C.accentHi : C.textMuted,
                  fontFamily:D.body, fontSize:'0.875rem', fontWeight: isActive ? 600 : 500,
                  transition:'background-color 150ms cubic-bezier(0.22,1,0.36,1), color 150ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
                }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = C.surface; e.currentTarget.style.color = C.textSoft } }}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.textMuted } }}>
                <Icon size={17} style={{ flexShrink:0 }} />
                {label}
              </button>
            )
          })}
        </nav>

        {/* Community pulse — real counts, refreshed on an interval */}
        <div className="tg-sidebar-extra" style={{ margin:'0.5rem 0.85rem', padding:'1rem 1.1rem', background:C.surface, borderRadius:R.lg }}>
          <div style={{ fontFamily:D.body, fontSize:'0.64rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:C.textDim, marginBottom:'0.85rem' }}>
            Community
          </div>
          {[
            ['Members', stats?.members],
            ['Crews',   stats?.crews],
            ['Events',  stats?.events],
          ].map(([label, value]) => (
            <div key={label} style={{ display:'flex', alignItems:'baseline', justifyContent:'space-between', marginBottom:'0.5rem' }}>
              <span style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted }}>{label}</span>
              <span style={{ fontFamily:D.display, fontSize:'0.95rem', fontWeight:700, color:C.text, fontVariantNumeric:'tabular-nums' }}>
                {statsLoading ? '·· ' : stat(value)}
              </span>
            </div>
          ))}
        </div>

        <div className="tg-sidebar-extra" style={{ marginTop:'auto', padding:'0.85rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.65rem', padding:'0.65rem', background:C.surface, borderRadius:R.md }}>
            <Avatar name={username} size={32} />
            <div style={{ minWidth:0 }}>
              <div style={{ fontFamily:D.body, fontSize:'0.825rem', fontWeight:600, color:C.text, overflow:'hidden', textOverflow:'ellipsis' }}>{username}</div>
              <div style={{ fontFamily:D.body, fontSize:'0.7rem', color:C.success, display:'flex', alignItems:'center', gap:'0.3rem' }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:C.success }} /> Online
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div style={{ flex:1, minWidth:0 }}>
        <Routes>
          <Route path=""        element={<MotorsportSection />} />
          <Route path="meetups" element={<MeetupsSection />}    />
          <Route path="crews"   element={<CrewsSection />}      />
        </Routes>
      </div>
    </div>
  )
}
