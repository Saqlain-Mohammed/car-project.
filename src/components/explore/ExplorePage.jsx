import { useState } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import OverviewFeed from './sections/OverviewFeed'
import GarageProfile from './sections/GarageProfile'
import ReelsSection from './sections/ReelsSection'
import PostsSection from './sections/PostsSection'
import WallpapersSection from './sections/WallpapersSection'
import SkillsSection from './sections/SkillsSection'
import NewsSection from './sections/NewsSection'

const C = {
  bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50',
  coral:'#EF8354', coralDim:'#d96a3a', slate:'#4F5D75',
  text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0',
  border:'rgba(191,192,192,0.12)', green:'#5eaa7e',
}
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const NAV_LINKS = [
  { path:'', label:'Overview', icon:'⊞', exact:true },
  { path:'garage', label:'My Garage', icon:'🏠' },
  { path:'reels', label:'Reels', icon:'🎥' },
  { path:'posts', label:'Posts', icon:'📸' },
  { path:'wallpapers', label:'Wallpapers', icon:'🖼️' },
  { path:'skills', label:'Skills', icon:'⚡' },
  { path:'news', label:'News', icon:'📰' },
]

const ONLINE_USERS = [
  { name:'RaiderKing', avatar:'R', color:'#EF8354' },
  { name:'TurboMike', avatar:'T', color:'#f39c12' },
  { name:'DriftQueen', avatar:'D', color:'#5eaa7e' },
  { name:'ZeroShift', avatar:'Z', color:'#3b82f6' },
  { name:'NightRider', avatar:'N', color:'#a855f7' },
  { name:'IronBlock', avatar:'I', color:'#EF8354' },
]

export default function ExplorePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{ display:'flex', minHeight:'calc(100vh - 60px)', background:C.bg }}>
      <aside style={{ width:240, flexShrink:0, background:C.surface, borderRight:`1px solid ${C.border}`, display:'flex', flexDirection:'column', position:'sticky', top:60, height:'calc(100vh - 60px)', overflowY:'auto' }}>
        <div style={{ padding:'1.5rem 1.25rem 1rem' }}>
          <div style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:C.textMuted, marginBottom:'1rem' }}>Explore</div>
          {NAV_LINKS.map(({ path, label, icon, exact }) => {
            const fullPath = `/app/explore${path ? `/${path}` : ''}`
            const isActive = exact
              ? location.pathname === '/app/explore' || location.pathname === '/app/explore/'
              : location.pathname.includes(`/app/explore/${path}`)
            return (
              <button key={path} onClick={() => navigate(fullPath)}
                style={{ display:'flex', alignItems:'center', gap:'0.75rem', width:'100%', padding:'0.65rem 0.9rem', marginBottom:'0.25rem', background: isActive ? 'rgba(239,131,84,0.12)' : 'transparent', border: isActive ? '1px solid rgba(239,131,84,0.25)' : '1px solid transparent', borderRadius:10, cursor:'pointer', textAlign:'left', transition:'all 0.2s' }}
                onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background='rgba(191,192,192,0.06)'; e.currentTarget.style.borderColor='rgba(191,192,192,0.1)' }}}
                onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent' }}}>
                <span style={{ width:32, height:32, borderRadius:9, background: isActive ? 'rgba(239,131,84,0.15)' : 'rgba(191,192,192,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', flexShrink:0 }}>{icon}</span>
                <span style={{ fontFamily:D.body, fontSize:'0.88rem', fontWeight: isActive ? 600 : 400, color: isActive ? C.coral : C.textSoft }}>{label}</span>
                {isActive && <div style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:C.coral, flexShrink:0 }} />}
              </button>
            )
          })}
        </div>

        <div style={{ margin:'0.5rem 1.25rem', padding:'1rem', background:C.surface2, borderRadius:12, border:`1px solid ${C.border}` }}>
          <div style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:C.textMuted, marginBottom:'0.85rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:C.green, display:'inline-block' }} /> Online Now
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.65rem' }}>
            {ONLINE_USERS.slice(0,4).map(({ name, avatar, color }) => (
              <div key={name} style={{ display:'flex', alignItems:'center', gap:'0.6rem', cursor:'pointer' }}>
                <div style={{ position:'relative', flexShrink:0 }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.72rem', color:'#fff' }}>{avatar}</div>
                  <div style={{ position:'absolute', bottom:0, right:0, width:7, height:7, borderRadius:'50%', background:C.green, border:`1.5px solid ${C.surface2}` }} />
                </div>
                <span style={{ fontFamily:D.body, fontSize:'0.8rem', color:C.textSoft }}>{name}</span>
              </div>
            ))}
            <div style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.textMuted }}>+238 more online</div>
          </div>
        </div>

        <div style={{ marginTop:'auto', padding:'1rem 1.25rem', borderTop:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.75rem', background:C.surface2, borderRadius:12 }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg, ${C.coral}, #f39c12)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'1rem', color:'#1f2230', flexShrink:0 }}>
              {user?.user_metadata?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <div style={{ fontFamily:D.body, fontSize:'0.85rem', fontWeight:600, color:C.text }}>{user?.user_metadata?.username || 'You'}</div>
              <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.green, display:'flex', alignItems:'center', gap:'0.3rem' }}>
                <span style={{ width:5, height:5, borderRadius:'50%', background:C.green, display:'inline-block' }} /> Online
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
        <div style={{ padding:'0.7rem 1.5rem', background:C.surface, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:'1rem', overflowX:'auto' }}>
          <span style={{ fontFamily:D.body, fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:C.textMuted, flexShrink:0 }}>Active</span>
          <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
            {ONLINE_USERS.map(({ name, avatar, color }) => (
              <div key={name} title={name} style={{ position:'relative', cursor:'pointer' }}>
                <div style={{ width:30, height:30, borderRadius:'50%', background:color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.72rem', color:'#fff', border:`2px solid ${C.surface}` }}>{avatar}</div>
                <div style={{ position:'absolute', bottom:0, right:0, width:7, height:7, borderRadius:'50%', background:C.green, border:`1.5px solid ${C.surface}` }} />
              </div>
            ))}
          </div>
          <span style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.textMuted }}>+238 online</span>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <span style={{ width:6, height:6, borderRadius:'50%', background:C.coral, display:'inline-block' }} />
            <span style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.textMuted }}>Live feed updating</span>
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto' }}>
          <Routes>
            <Route path="" element={<OverviewFeed />} />
            <Route path="garage" element={<GarageProfile />} />
            <Route path="reels" element={<ReelsSection />} />
            <Route path="posts" element={<PostsSection />} />
            <Route path="wallpapers" element={<WallpapersSection />} />
            <Route path="skills" element={<SkillsSection />} />
            <Route path="news" element={<NewsSection />} />
          </Routes>
        </div>
      </div>
    </div>
  )
}