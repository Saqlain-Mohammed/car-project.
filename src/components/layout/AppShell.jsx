import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { LogOut, Bell, Search } from 'lucide-react'
import HeroSection from '../explore/HeroSection'
import ExplorePage from '../explore/ExplorePage'
import CommunityPage from '../community/CommunityPage'
import MarketplacePage from '../marketplace/MarketplacePage'
import KnowledgePage from '../knowledge/KnowledgePage'
import ServicesPage from '../services/ServicesPage'

const NAV_ITEMS = [
  { path: '', label: 'Home' },
  { path: 'explore', label: 'Explore' },
  { path: 'community', label: 'Community' },
  { path: 'marketplace', label: 'Marketplace' },
  { path: 'knowledge', label: 'Knowledge' },
  { path: 'services', label: 'Services' },
]

export default function AppShell() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  return (
    <div style={{ minHeight: '100vh', background: '#2B2D42' }}>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        background: 'rgba(26,27,38,0.96)',
        borderBottom: '1px solid rgba(239,35,60,0.2)',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 3rem', height: 60, display: 'flex', alignItems: 'center', gap: '2rem' }}>

          <div onClick={() => navigate('/app')}
            style={{ fontFamily: "'Barlow Condensed',sans-serif", fontSize: '1.9rem', fontWeight: 900, letterSpacing: '0.06em', color: '#EDF2F4', cursor: 'pointer', flexShrink: 0 }}>
            REV<span style={{ color: '#EF233C' }}>VIT</span>
          </div>

          <nav style={{ display: 'flex', flex: 1 }}>
            {NAV_ITEMS.map(({ path, label }) => (
              <NavLink key={path}
                to={path === '' ? '/app' : `/app/${path}`}
                end={path === ''}
                style={({ isActive }) => ({
                  fontFamily: "'Barlow Condensed',sans-serif",
                  fontSize: '0.82rem', fontWeight: 700,
                  letterSpacing: '0.15em', textTransform: 'uppercase',
                  textDecoration: 'none', padding: '0 1rem', height: 60,
                  display: 'flex', alignItems: 'center',
                  color: isActive ? '#EF233C' : '#8D99AE',
                  borderBottom: isActive ? '2px solid #EF233C' : '2px solid transparent',
                  transition: 'all 0.2s',
                })}>
                {label}
              </NavLink>
            ))}
          </nav>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8D99AE', padding: '0.5rem' }}>
              <Search size={17} />
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8D99AE', padding: '0.5rem', position: 'relative' }}>
              <Bell size={17} />
              <span style={{ position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: '50%', background: '#EF233C' }} />
            </button>
            <div style={{ width: 32, height: 32, background: '#23253a', border: '1px solid rgba(239,35,60,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Barlow Condensed',sans-serif", fontWeight: 900, fontSize: '1rem', color: '#EF233C', marginLeft: '0.25rem' }}>
              {user?.user_metadata?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <button onClick={async () => { await signOut(); navigate('/auth') }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8D99AE', padding: '0.5rem' }}>
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: 60 }}>
        <Routes>
          <Route path="" element={<HeroSection />} />
          <Route path="explore/*" element={<ExplorePage />} />
          <Route path="community/*" element={<CommunityPage />} />
          <Route path="marketplace/*" element={<MarketplacePage />} />
          <Route path="knowledge/*" element={<KnowledgePage />} />
          <Route path="services/*" element={<ServicesPage />} />
        </Routes>
      </main>
    </div>
  )
}