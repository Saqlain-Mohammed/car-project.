import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'
import { C, R, getStoredTheme, applyTheme } from '../../lib/theme'

/**
 * Light/dark switch. Both icons stay mounted and cross-fade with scale +
 * blur (transitions.dev "Icon swap") so neither pops in — a visibility
 * toggle would give the entering icon no state to animate from.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState(getStoredTheme)

  useEffect(() => { applyTheme(theme) }, [theme])

  const dark = theme === 'dark'
  const next = dark ? 'light' : 'dark'

  const iconStyle = on => ({
    position: 'absolute',
    display: 'flex',
    opacity: on ? 1 : 0,
    scale: on ? '1' : '0.25',
    filter: on ? 'blur(0px)' : 'blur(4px)',
    transition: 'opacity 250ms ease-in-out, scale 250ms ease-in-out, filter 250ms ease-in-out',
    willChange: 'opacity, scale, filter',
  })

  return (
    <button
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="t-press"
      style={{
        position: 'relative',
        width: 40, height: 40,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'transparent', border: '1px solid transparent',
        borderRadius: R.md, color: C.textMuted, cursor: 'pointer',
        transition: 'background-color 150ms cubic-bezier(0.22,1,0.36,1), color 150ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = C.surface2; e.currentTarget.style.color = C.text }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = C.textMuted }}
    >
      <span style={iconStyle(dark)}><Moon size={18} /></span>
      <span style={iconStyle(!dark)}><Sun size={18} /></span>
    </button>
  )
}
