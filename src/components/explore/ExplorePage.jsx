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

const C = { dark:'#2B2D42', light:'#EDF2F4', red:'#EF233C', black:'#1a1b26', card:'#23253a', muted:'#8D99AE' }
const D = { display:"'Barlow Condensed', sans-serif", body:"'Barlow', sans-serif" }

const NAV_LINKS = [
  { path: '', label: 'Overview', icon: '⊞', exact: true },
  { path: 'garage', label: 'Garage Profile', icon: '🏠' },
  { path: 'reels', label: 'Reels', icon: '🎥' },
  { path: 'posts', label: 'Posts', icon: '📸' },
  { path: 'wallpapers', label: 'Wallpapers', icon: '🖼️' },
  { path: 'skills', label: 'Skills Showcase', icon: '⚡' },
  { path: 'news', label: 'News & Updates', icon: '📰' },
]

const ONLINE_USERS = [
  { name: 'RaiderKing', avatar: 'R', color: '#EF233C' },
  { name: 'TurboMike', avatar: 'T', color: '#f39c12' },
  { name: 'DriftQueen', avatar: 'D', color: '#27ae60' },
  { name: 'ZeroShift', avatar: 'Z', color: '#3b82f6' },
  { name: 'NightRider', avatar: 'N', color: '#a855f7' },
  { name: 'IronBlock', avatar: 'I', color: '#EF233C' },
]

export default function ExplorePage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div style={{ display:'flex', minHeight:'calc(100vh - 60px)', background:C.dark }}>

      {/* LEFT NAV */}
      <aside style={{ width:220, flexShrink:0, background:C.black, borderRight:'1px solid rgba(141,153,174,0.12)', display:'flex', flexDirection:'column', position:'sticky', top:60, height:'calc(100vh - 60px)', overflowY:'auto' }}>
        <div style={{ padding:'1.5rem 1.2rem 0.5rem' }}>
          <div style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:C.muted, marginBottom:'0.75rem' }}>Explore</div>
          {NAV_LINKS.map(({ path, label, icon, exact }) => {
            const fullPath = `/app/explore${path ? `/${path}` : ''}`
            const isActive = exact
              ? location.pathname === '/app/explore' || location.pathname === '/app/explore/'
              : location.pathname.includes(`/app/explore/${path}`)
            return (
              <button key={path} onClick={() => navigate(fullPath)}
                style={{ display:'flex', alignItems:'center', gap:'0.75rem', width:'100%', padding:'0.65rem 0.9rem', marginBottom:'0.15rem', background: isActive ? 'rgba(239,35,60,0.1)' : 'transparent', border: isActive ? '1px solid rgba(239,35,60,0.2)' : '1px solid transparent', borderLeft: isActive ? `3px solid ${C.red}` : '3px solid transparent', cursor:'pointer', textAlign:'left', transition:'all 0.2s' }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(141,153,174,0.06)' }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'transparent' }}>
                <span style={{ fontSize:'1rem' }}>{icon}</span>
                <span style={{ fontFamily:D.display, fontSize:'0.95rem', fontWeight: isActive ? 700 : 600, letterSpacing:'0.05em', color: isActive ? C.light : C.muted }}>{label}</span>
              </button>
            )
          })}
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

      {/* MAIN */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>

        {/* Online status bar */}
        <div style={{ padding:'0.75rem 1.5rem', background:C.black, borderBottom:'1px solid rgba(141,153,174,0.1)', display:'flex', alignItems:'center', gap:'1rem', overflowX:'auto' }}>
          <span style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', color:C.muted, flexShrink:0 }}>Active Now</span>
          {ONLINE_USERS.map(({ name, avatar, color }) => (
            <div key={name} style={{ display:'flex', alignItems:'center', gap:'0.4rem', flexShrink:0, cursor:'pointer' }}>
              <div style={{ position:'relative' }}>
                <div style={{ width:32, height:32, borderRadius:'50%', background:color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:900, fontSize:'0.8rem', color:'#fff', border:`2px solid ${C.black}` }}>{avatar}</div>
                <div style={{ position:'absolute', bottom:1, right:1, width:7, height:7, borderRadius:'50%', background:'#27ae60', border:`1px solid ${C.black}` }} />
              </div>
              <span style={{ fontFamily:D.display, fontSize:'0.75rem', color:C.muted }}>{name}</span>
            </div>
          ))}
          <div style={{ marginLeft:'auto', flexShrink:0 }}>
            <span style={{ fontFamily:D.display, fontSize:'0.7rem', color:C.muted }}>+238 online</span>
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