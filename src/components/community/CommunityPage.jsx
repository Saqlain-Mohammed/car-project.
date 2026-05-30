import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import MotorsportSection from './sections/MotorsportSection'
import MeetupsSection from './sections/MeetupsSection'
import CrewsSection from './sections/CrewsSection'
import CarSpottingSection from './sections/CarSpottingSection'

const C = { bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50', coral:'#EF8354', coralDim:'#d96a3a', text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0', border:'rgba(191,192,192,0.12)', green:'#5eaa7e' }
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const NAV_LINKS = [
  { path:'', label:'Motorsport', icon:'🏎️', exact:true },
  { path:'meetups', label:'Meetups & Events', icon:'📅' },
  { path:'crews', label:'Crews & Clubs', icon:'👥' },
  { path:'spotting', label:'Car Spotting', icon:'📸' },
]

export default function CommunityPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{ display:'flex', minHeight:'calc(100vh - 60px)', background:C.bg }}>
      <aside style={{ width:240, flexShrink:0, background:C.surface, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', position:'sticky', top:60, height:'calc(100vh - 60px)', overflowY:'auto' }}>
        <div style={{ padding:'1.5rem 1.25rem 1rem' }}>
          <div style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:C.textMuted, marginBottom:'1rem' }}>Community</div>
          {NAV_LINKS.map(({ path, label, icon, exact }) => {
            const fullPath = `/app/community${path ? `/${path}` : ''}`
            const isActive = exact ? location.pathname === '/app/community' || location.pathname === '/app/community/' : location.pathname.includes(`/app/community/${path}`)
            return (
              <button key={path} onClick={() => navigate(fullPath)}
                style={{ display:'flex', alignItems:'center', gap:'0.75rem', width:'100%', padding:'0.65rem 0.9rem', marginBottom:'0.25rem', background: isActive ? 'rgba(239,131,84,0.12)' : 'transparent', border: isActive ? '1px solid rgba(239,131,84,0.25)' : '1px solid transparent', borderRadius:10, cursor:'pointer', textAlign:'left', transition:'all 0.2s' }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background='rgba(191,192,192,0.06)'; e.currentTarget.style.borderColor='rgba(191,192,192,0.1)' }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent' }}}>
                <span style={{ width:32, height:32, borderRadius:9, background: isActive ? 'rgba(239,131,84,0.15)' : 'rgba(191,192,192,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>{icon}</span>
                <span style={{ fontFamily:D.body, fontSize:'0.88rem', fontWeight: isActive ? 600 : 400, color: isActive ? C.coral : C.textSoft }}>{label}</span>
                {isActive && <div style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:C.coral }} />}
              </button>
            )
          })}
        </div>

        <div style={{ margin:'0.5rem 1.25rem', padding:'1.25rem', background:`linear-gradient(135deg, rgba(239,131,84,0.12), rgba(239,131,84,0.04))`, borderRadius:14, border:'1px solid rgba(239,131,84,0.2)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem' }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background:'#ef4444' }} />
            <span style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'#ef4444' }}>Live Now</span>
          </div>
          <div style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:700, color:C.text, lineHeight:1 }}>2,847</div>
          <div style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.textMuted, marginTop:'0.25rem' }}>watching motorsport</div>
        </div>

        <div style={{ marginTop:'auto', padding:'1rem 1.25rem', borderTop:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.75rem', background:C.surface2, borderRadius:12 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg, ${C.coral}, #f39c12)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'1rem', color:'#1f2230', flexShrink:0 }}>
              {user?.user_metadata?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{ fontFamily:D.body, fontSize:'0.85rem', fontWeight:600, color:C.text }}>{user?.user_metadata?.username || 'You'}</div>
              <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.green }}>● Online</div>
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