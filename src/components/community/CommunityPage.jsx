import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import MeetupsSection from './sections/MeetupsSection'
import CrewsSection from './sections/CrewsSection'
import MotorsportSection from './sections/MotorsportSection'
import CarSpottingSection from './sections/CarSpottingSection'

const C = { dark:'#2B2D42', light:'#EDF2F4', red:'#EF233C', black:'#1a1b26', card:'#23253a', muted:'#8D99AE' }
const D = { display:"'Barlow Condensed', sans-serif", body:"'Barlow', sans-serif" }

const NAV_LINKS = [
  { path: '', label: 'Motorsport', icon: '🏎️', exact: true },
  { path: 'meetups', label: 'Meetups & Events', icon: '📅' },
  { path: 'crews', label: 'Crews & Clubs', icon: '👥' },
  { path: 'spotting', label: 'Car Spotting', icon: '📸' },
]

export default function CommunityPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{ display:'flex', minHeight:'calc(100vh - 60px)', background:C.dark }}>
      <aside style={{ width:220, flexShrink:0, background:C.black, borderRight:'1px solid rgba(141,153,174,0.12)', display:'flex', flexDirection:'column', position:'sticky', top:60, height:'calc(100vh - 60px)', overflowY:'auto' }}>
        <div style={{ padding:'1.5rem 1.2rem 0.5rem' }}>
          <div style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:C.muted, marginBottom:'0.75rem' }}>Community</div>
          {NAV_LINKS.map(({ path, label, icon, exact }) => {
            const fullPath = `/app/community${path ? `/${path}` : ''}`
            const isActive = exact
              ? location.pathname === '/app/community' || location.pathname === '/app/community/'
              : location.pathname.includes(`/app/community/${path}`)
            return (
              <button key={path} onClick={() => navigate(fullPath)}
                style={{ display:'flex', alignItems:'center', gap:'0.75rem', width:'100%', padding:'0.65rem 0.9rem', marginBottom:'0.15rem', background: isActive ? 'rgba(239,35,60,0.1)' : 'transparent', border: isActive ? '1px solid rgba(239,35,60,0.2)' : '1px solid transparent', borderLeft: isActive ? `3px solid ${C.red}` : '3px solid transparent', cursor:'pointer', textAlign:'left', transition:'all 0.2s' }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background='rgba(141,153,174,0.06)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background='transparent' }}>
                <span style={{ fontSize:'1rem' }}>{icon}</span>
                <span style={{ fontFamily:D.display, fontSize:'0.95rem', fontWeight: isActive ? 700 : 600, color: isActive ? C.light : C.muted }}>{label}</span>
              </button>
            )
          })}
        </div>

        <div style={{ margin:'1rem 1.2rem', padding:'1rem', background:'rgba(239,35,60,0.08)', border:'1px solid rgba(239,35,60,0.2)' }}>
          <div style={{ fontFamily:D.display, fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', color:C.red, marginBottom:'0.5rem' }}>🔴 Live Now</div>
          <div style={{ fontFamily:D.display, fontSize:'1.8rem', fontWeight:900, color:C.light, lineHeight:1 }}>2,847</div>
          <div style={{ fontFamily:D.display, fontSize:'0.7rem', color:C.muted, marginTop:'0.2rem' }}>watching motorsport</div>
        </div>

        <div style={{ marginTop:'auto', padding:'1rem 1.2rem', borderTop:'1px solid rgba(141,153,174,0.1)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:`linear-gradient(135deg, #EF233C, #f39c12)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:900, fontSize:'0.9rem', color:C.dark, flexShrink:0 }}>
              {user?.user_metadata?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{ fontFamily:D.display, fontSize:'0.85rem', fontWeight:700, color:C.light }}>{user?.user_metadata?.username || 'You'}</div>
              <div style={{ fontFamily:D.display, fontSize:'0.65rem', color:'#27ae60' }}>● Online</div>
            </div>
          </div>
        </div>
      </aside>

      <div style={{ flex:1, overflowY:'auto' }}>
        <Routes>
          <Route path="" element={<MotorsportSection />} />
          <Route path="meetups" element={<MeetupsSection />} />
          <Route path="crews" element={<CrewsSection />} />
          <Route path="spotting" element={<CarSpottingSection />} />
        </Routes>
      </div>
    </div>
  )
}