import { NavLink } from 'react-router-dom'
import { Home, Compass, Users, ShoppingBag, BookOpen, Wrench } from 'lucide-react'
import { C, D, R } from '../../lib/theme'

/**
 * Bottom tab bar for viewports where the header nav is hidden (<= 860px).
 *
 * Without this the primary sections are unreachable on a phone — the header
 * collapses to logo + controls and nothing replaces the links. Mirrors
 * NAV_ITEMS in AppShell; keep the two in step.
 */
const TABS = [
  { path: '',            label: 'Home',    Icon: Home },
  { path: 'explore',     label: 'Explore', Icon: Compass },
  { path: 'community',   label: 'Crews',   Icon: Users },
  { path: 'marketplace', label: 'Market',  Icon: ShoppingBag },
  { path: 'knowledge',   label: 'Learn',   Icon: BookOpen },
  { path: 'services',    label: 'Services', Icon: Wrench },
]

export default function MobileNav() {
  return (
    <nav className="tg-mobile-nav" aria-label="Primary">
      {TABS.map(({ path, label, Icon }) => (
        <NavLink
          key={path}
          to={path === '' ? '/app' : `/app/${path}`}
          end={path === ''}
          className="t-press"
          style={({ isActive }) => ({
            flex: 1,
            minWidth: 0,
            height: 52,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.2rem',
            textDecoration: 'none',
            color: isActive ? C.accent : C.textMuted,
            fontFamily: D.body,
            fontSize: '0.62rem',
            fontWeight: isActive ? 650 : 500,
            borderRadius: R.sm,
            transition: 'color 150ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
          })}>
          {({ isActive }) => (
            <>
              <Icon size={19} strokeWidth={isActive ? 2.4 : 1.9} />
              <span style={{ letterSpacing: '0.01em' }}>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
