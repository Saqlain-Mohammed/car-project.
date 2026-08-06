import { useState, useRef, useEffect } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Search, Bell, LogOut, ChevronDown, X, Inbox } from 'lucide-react'
import { useUnreadCount, useNotifications, useMarkAllRead, useMarkRead } from '../../hooks/useNotifications'
import { C, D, R, SHADOW } from '../../lib/theme'
import { Avatar, Dropdown, MenuItem, Divider, IconButton } from '../ui/Primitives'
import ThemeToggle from '../ui/ThemeToggle'
import HeroSection     from '../explore/HeroSection'
import ExplorePage     from '../explore/ExplorePage'
import CommunityPage   from '../community/CommunityPage'
import MarketplacePage from '../marketplace/MarketplacePage'
import KnowledgePage   from '../knowledge/KnowledgePage'
import ServicesPage    from '../services/ServicesPage'
import NotFound        from '../ui/NotFound'
import MobileNav       from './MobileNav'

const NAV_ITEMS = [
  { path: '',            label: 'Home'        },
  { path: 'explore',     label: 'Explore'     },
  { path: 'community',   label: 'Community'   },
  { path: 'marketplace', label: 'Marketplace' },
  { path: 'knowledge',   label: 'Knowledge'   },
  { path: 'services',    label: 'Services'    },
]

function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000
  if (diff < 60)    return 'just now'
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

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
  const { data: notifData }       = useNotifications()
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
    <div style={{ minHeight: '100vh', background: C.bg }}>

      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        background: 'var(--nav-bg)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        boxShadow: `0 1px 0 ${C.border}`,
      }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', padding: '0 1.75rem', height: 60, display: 'flex', alignItems: 'center', gap: '1.5rem' }}>

          {/* Logo */}
          <button onClick={() => navigate('/app')} className="t-press"
            style={{
              fontFamily: D.headline, fontSize: '1.7rem', fontWeight: 900,
              letterSpacing: '0.04em', color: C.text, cursor: 'pointer',
              flexShrink: 0, background: 'none', border: 'none', padding: 0, lineHeight: 1,
            }}>
            TORQUE<span style={{ color: C.accent }}>GRID</span>
          </button>

          {/* Nav */}
          <nav className="tg-nav-links" style={{ display: 'flex', flex: 1, gap: '0.15rem' }}>
            {NAV_ITEMS.map(({ path, label }) => (
              <NavLink key={path}
                to={path === '' ? '/app' : `/app/${path}`}
                end={path === ''}
                style={({ isActive }) => ({
                  position: 'relative',
                  fontFamily: D.body, fontSize: '0.825rem',
                  fontWeight: isActive ? 600 : 500,
                  textDecoration: 'none',
                  padding: '0 0.85rem', height: 40, borderRadius: R.md,
                  display: 'flex', alignItems: 'center',
                  color: isActive ? C.text : C.textMuted,
                  background: isActive ? C.surface2 : 'transparent',
                  transition: 'color 150ms cubic-bezier(0.22,1,0.36,1), background-color 150ms cubic-bezier(0.22,1,0.36,1)',
                })}>
                {({ isActive }) => (
                  <>
                    {label}
                    {isActive && (
                      <span style={{
                        position: 'absolute', bottom: -10, left: '50%', translate: '-50% 0',
                        width: 18, height: 2, borderRadius: 2, background: C.accent,
                      }} />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', flexShrink: 0 }}>

            {searchOpen ? (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem', height: 40,
                background: C.surface2, border: `1px solid ${C.accentBr}`,
                borderRadius: R.md, padding: '0 0.85rem',
              }}>
                <Search size={15} color={C.textMuted} />
                <input autoFocus value={searchVal} onChange={e => setSearchVal(e.target.value)}
                  placeholder="Search cars, mods, people…"
                  onKeyDown={e => { if (e.key === 'Escape') { setSearchOpen(false); setSearchVal('') } }}
                  style={{ background: 'none', border: 'none', outline: 'none', color: C.text, fontFamily: D.body, fontSize: '0.85rem', width: 210 }} />
                <button onClick={() => { setSearchOpen(false); setSearchVal('') }} aria-label="Close search"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: C.textMuted, display: 'flex', padding: 2 }}>
                  <X size={14} />
                </button>
              </div>
            ) : (
              <IconButton icon={Search} label="Search" onClick={() => setSearchOpen(true)} />
            )}

            <ThemeToggle />

            {/* Notifications */}
            <div ref={notifRef} style={{ position: 'relative' }}>
              <button onClick={() => setNotifOpen(o => !o)} aria-label="Notifications" className="t-press"
                style={{
                  width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: notifOpen ? C.accentBg : 'transparent', border: '1px solid transparent',
                  borderRadius: R.md, color: notifOpen ? C.accent : C.textMuted, cursor: 'pointer', position: 'relative',
                  transition: 'background-color 150ms cubic-bezier(0.22,1,0.36,1), color 150ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
                }}>
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span style={{
                    position: 'absolute', top: 6, right: 6, minWidth: 16, height: 16,
                    borderRadius: R.full, background: C.accent, border: '2px solid var(--bg)',
                    fontFamily: D.body, fontSize: '0.56rem', fontWeight: 700, color: '#fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 3px',
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              <Dropdown open={notifOpen} width={340} origin="top-right">
                <div style={{ padding: '0.95rem 1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontFamily: D.display, fontSize: '0.925rem', fontWeight: 700, color: C.text }}>Notifications</span>
                  {unreadCount > 0 && (
                    <button onClick={() => markAllRead.mutate()}
                      style={{ fontFamily: D.body, fontSize: '0.72rem', fontWeight: 600, color: C.accent, background: 'none', border: 'none', cursor: 'pointer' }}>
                      Mark all read
                    </button>
                  )}
                </div>
                <Divider />
                <div style={{ maxHeight: 340, overflowY: 'auto' }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '2.5rem 1rem', textAlign: 'center' }}>
                      <Inbox size={22} color={C.textDim} style={{ marginBottom: '0.6rem' }} />
                      <div style={{ fontFamily: D.body, fontSize: '0.825rem', color: C.textDim }}>You're all caught up</div>
                    </div>
                  ) : notifications.map(n => (
                    <button key={n.id} onClick={() => markRead.mutate(n.id)}
                      style={{
                        width: '100%', padding: '0.8rem 1rem', display: 'flex', gap: '0.7rem',
                        alignItems: 'flex-start', textAlign: 'left', cursor: 'pointer', border: 'none',
                        background: n.is_read ? 'transparent' : C.accentBg,
                        transition: 'background-color 150ms cubic-bezier(0.22,1,0.36,1)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                      onMouseLeave={e => e.currentTarget.style.background = n.is_read ? 'transparent' : C.accentBg}>
                      <Avatar name={n.actor?.username} src={n.actor?.avatar_url} size={30} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: D.body, fontSize: '0.815rem', color: C.text, lineHeight: 1.45 }}>{n.body}</div>
                        <div style={{ fontFamily: D.body, fontSize: '0.68rem', color: C.textDim, marginTop: '0.2rem' }}>{timeAgo(n.created_at)}</div>
                      </div>
                      {!n.is_read && <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent, flexShrink: 0, marginTop: 6 }} />}
                    </button>
                  ))}
                </div>
              </Dropdown>
            </div>

            {/* Profile */}
            <div ref={profileRef} style={{ position: 'relative', marginLeft: '0.35rem' }}>
              <button onClick={() => setProfileOpen(o => !o)} className="t-press"
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem', height: 40,
                  background: profileOpen ? C.surface3 : C.surface2,
                  border: `1px solid ${C.border}`, borderRadius: R.full,
                  padding: '0 0.7rem 0 0.3rem', cursor: 'pointer',
                  transition: 'background-color 150ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
                }}>
                <Avatar name={username} size={30} />
                <span style={{ fontFamily: D.body, fontSize: '0.825rem', fontWeight: 600, color: C.text }}>{username}</span>
                <ChevronDown size={13} color={C.textMuted}
                  style={{ rotate: profileOpen ? '180deg' : '0deg', transition: 'rotate 250ms cubic-bezier(0.22,1,0.36,1)' }} />
              </button>

              <Dropdown open={profileOpen} width={216} origin="top-right">
                <div style={{ padding: '0.95rem 1rem' }}>
                  <div style={{ fontFamily: D.display, fontSize: '0.9rem', fontWeight: 700, color: C.text }}>{username}</div>
                  <div style={{ fontFamily: D.body, fontSize: '0.73rem', color: C.textMuted, marginTop: '0.15rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
                </div>
                <Divider />
                <div style={{ padding: '0.35rem' }}>
                  <MenuItem icon={LogOut} danger onClick={async () => { setProfileOpen(false); await signOut(); navigate('/auth') }}>
                    Sign out
                  </MenuItem>
                </div>
              </Dropdown>
            </div>
          </div>
        </div>
      </header>

      <main className="tg-has-mobile-nav" style={{ paddingTop: 60 }}>
        <Routes>
          <Route path=""              element={<HeroSection />}     />
          <Route path="explore/*"     element={<ExplorePage />}     />
          <Route path="community/*"   element={<CommunityPage />}   />
          <Route path="marketplace/*" element={<MarketplacePage />} />
          <Route path="knowledge/*"   element={<KnowledgePage />}   />
          <Route path="services/*"    element={<ServicesPage />}    />
          <Route path="*"             element={<NotFound />}        />
        </Routes>
      </main>

      <MobileNav />
    </div>
  )
}
