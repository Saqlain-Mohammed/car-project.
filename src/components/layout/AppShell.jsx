import { useState, useRef, useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Search, Bell, Settings, LogOut, ChevronDown, X } from 'lucide-react'
import { useUnreadCount, useNotifications, useMarkAllRead, useMarkRead } from '../../hooks/useNotifications'
import HeroSection    from '../explore/HeroSection'
import ExplorePage    from '../explore/ExplorePage'
import CommunityPage  from '../community/CommunityPage'
import MarketplacePage from '../marketplace/MarketplacePage'
import KnowledgePage  from '../knowledge/KnowledgePage'
import ServicesPage   from '../services/ServicesPage'

const NAV_ITEMS = [
  { path: '',           label: 'Home'        },
  { path: 'explore',    label: 'Explore'     },
  { path: 'community',  label: 'Community'   },
  { path: 'marketplace',label: 'Marketplace' },
  { path: 'knowledge',  label: 'Knowledge'   },
  { path: 'services',   label: 'Services'    },
]

export default function AppShell() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [searchOpen,  setSearchOpen]  = useState(false)
  const [searchVal,   setSearchVal]   = useState('')
  const [profileOpen, setProfileOpen] = useState(false)
  const [notifOpen,   setNotifOpen]   = useState(false)
  const profileRef = useRef(null)
  const notifRef   = useRef(null)
  const username   = user?.user_metadata?.username || 'User'

  const { data: unreadCount = 0 } = useUnreadCount()
  const { data: notifData }        = useNotifications()
  const markAllRead = useMarkAllRead()
  const markRead    = useMarkRead()
  const notifications = notifData?.pages?.flat() ?? []

  useEffect(() => {
    const h = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
      if (notifRef.current   && !notifRef.current.contains(e.target))   setNotifOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#1f2230' }}>

      {/* ── Navbar ── */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'rgba(18,20,32,0.72)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 2px 32px rgba(0,0,0,0.35)',
      }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 2rem', height: 60, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>

          {/* Logo */}
          <div onClick={() => navigate('/app')}
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '1.9rem', fontWeight: 900, letterSpacing: '0.06em', color: '#EDF2F4', cursor: 'pointer', flexShrink: 0, userSelect: 'none' }}>
            TORQUE<span style={{ color: '#EF8354' }}>GRID</span>
          </div>

          {/* Nav links */}
          <nav style={{ display: 'flex', flex: 1 }}>
            {NAV_ITEMS.map(({ path, label }) => (
              <NavLink key={path}
                to={path === '' ? '/app' : `/app/${path}`}
                end={path === ''}
                style={({ isActive }) => ({
                  fontFamily: "'Inter', sans-serif",
                  fontSize: '0.82rem',
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.04em',
                  textDecoration: 'none',
                  padding: '0 0.95rem',
                  height: 60,
                  display: 'flex',
                  alignItems: 'center',
                  color: isActive ? '#EF8354' : '#8D99AE',
                  borderBottom: isActive ? '2px solid #EF8354' : '2px solid transparent',
                  transition: 'all 0.2s',
                })}
                onMouseEnter={e => { if (!e.currentTarget.style.color.includes('239')) e.currentTarget.style.color = '#EDEEF0' }}
                onMouseLeave={e => { if (!e.currentTarget.className?.includes('active')) e.currentTarget.style.color = '#8D99AE' }}>
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>

            {/* Search */}
            {searchOpen ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, padding: '0.4rem 0.85rem' }}>
                <Search size={15} color="#8D99AE" />
                <input autoFocus value={searchVal} onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search cars, mods, people..."
                  style={{ background: 'none', border: 'none', outline: 'none', color: '#EDEEF0', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', width: 200 }} />
                <button onClick={() => { setSearchOpen(false); setSearchVal('') }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8D99AE', padding: '0.1rem', display: 'flex' }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <button onClick={() => setSearchOpen(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8D99AE', padding: '0.5rem', borderRadius: 8, display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#EDEEF0'}
                onMouseLeave={e => e.currentTarget.style.color = '#8D99AE'}>
                <Search size={18} />
              </button>
            )}

            {/* Notification bell */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button onClick={() => { setNotifOpen(o => !o); if (!notifOpen && unreadCount > 0) markAllRead.mutate() }}
                style={{ background: notifOpen ? 'rgba(239,131,84,0.1)' : 'none', border: 'none', cursor: 'pointer', color: '#8D99AE', padding: '0.5rem', borderRadius: 8, position: 'relative', display: 'flex', alignItems: 'center', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#EDEEF0'}
                onMouseLeave={e => e.currentTarget.style.color = '#8D99AE'}>
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{ position: 'absolute', top: 4, right: 4, minWidth: 16, height: 16, borderRadius: 8, background: '#EF8354', border: '2px solid rgba(18,20,32,0.72)', fontFamily: "'Inter',sans-serif", fontSize: '0.55rem', fontWeight: 800, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px' }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {notifOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 340, background: 'rgba(26,28,42,0.97)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.5)', zIndex: 300, maxHeight: 420, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ padding: '1rem 1rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: "'Space Grotesk',sans-serif", fontSize: '0.95rem', fontWeight: 700, color: '#EDEEF0' }}>Notifications</span>
                    {notifications.length > 0 && (
                      <button onClick={() => markAllRead.mutate()} style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.72rem', fontWeight: 600, color: '#EF8354', background: 'none', border: 'none', cursor: 'pointer' }}>
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div style={{ overflowY: 'auto', flex: 1 }}>
                    {notifications.length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>🔔</div>
                        <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.85rem', color: '#8D99AE' }}>No notifications yet</div>
                      </div>
                    ) : notifications.map(n => (
                      <div key={n.id} onClick={() => markRead.mutate(n.id)}
                        style={{ padding: '0.85rem 1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start', background: n.is_read ? 'none' : 'rgba(239,131,84,0.06)', borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        onMouseLeave={e => e.currentTarget.style.background = n.is_read ? 'none' : 'rgba(239,131,84,0.06)'}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EF8354', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk',sans-serif", fontWeight: 700, fontSize: '0.75rem', color: '#fff', flexShrink: 0 }}>
                          {n.actor?.username?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.82rem', color: '#EDEEF0', lineHeight: 1.4 }}>{n.body}</div>
                          <div style={{ fontFamily: "'Inter',sans-serif", fontSize: '0.68rem', color: '#8D99AE', marginTop: '0.2rem' }}>{new Date(n.created_at).toLocaleDateString()}</div>
                        </div>
                        {!n.is_read && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#EF8354', flexShrink: 0, marginTop: 4 }} />}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Profile */}
            <div ref={profileRef} style={{ position: 'relative', marginLeft: '0.35rem' }}>
              <button onClick={() => setProfileOpen(o => !o)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', background: profileOpen ? 'rgba(239,131,84,0.12)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 40, padding: '0.25rem 0.6rem 0.25rem 0.25rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'linear-gradient(135deg,#EF8354,#f39c12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: '0.85rem', color: '#1f2230', flexShrink: 0 }}>
                  {username[0].toUpperCase()}
                </div>
                <span style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.82rem', fontWeight: 600, color: '#EDEEF0' }}>{username}</span>
                <ChevronDown size={13} color="#8D99AE" style={{ transform: profileOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }} />
              </button>

              {profileOpen && (
                <div style={{ position: 'absolute', top: 'calc(100% + 10px)', right: 0, width: 200, background: 'rgba(26,28,42,0.97)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.5)', zIndex: 300 }}>
                  <div style={{ padding: '1rem 1rem 0.75rem', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                    <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '0.9rem', fontWeight: 700, color: '#EDEEF0' }}>{username}</div>
                    <div style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.75rem', color: '#8D99AE', marginTop: '0.1rem' }}>{user?.email}</div>
                  </div>
                  {[
                    { icon: <Settings size={15} />, label: 'Settings', action: () => {},                                                    danger: false },
                    { icon: <LogOut   size={15} />, label: 'Sign Out', action: async () => { await signOut(); navigate('/auth') }, danger: true  },
                  ].map(({ icon, label, action, danger }) => (
                    <button key={label} onClick={() => { setProfileOpen(false); action() }}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'none', border: 'none', cursor: 'pointer', fontFamily: "'Inter', sans-serif", fontSize: '0.85rem', fontWeight: 500, color: danger ? '#ef4444' : '#BFC0C0', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                      {icon}{label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main style={{ paddingTop: 60 }}>
        <Routes>
          <Route path=""             element={<HeroSection />}    />
          <Route path="explore/*"    element={<ExplorePage />}    />
          <Route path="community/*"  element={<CommunityPage />}  />
          <Route path="marketplace/*" element={<MarketplacePage />} />
          <Route path="knowledge/*"  element={<KnowledgePage />}  />
          <Route path="services/*"   element={<ServicesPage />}   />
        </Routes>
      </main>
    </div>
  )
}
