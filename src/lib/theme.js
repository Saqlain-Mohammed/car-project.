/**
 * Carbon — the app-interior design system.
 *
 * Every token resolves to a CSS custom property rather than a literal, so the
 * light/dark switch in index.css re-themes all inline styles at once without
 * any component re-rendering. The marketing hero keeps its own warm palette.
 */

export const C = {
  // Surfaces
  bg:        'var(--bg)',
  bgSubtle:  'var(--bg-subtle)',
  surface:   'var(--surface)',
  surface2:  'var(--surface-2)',
  surface3:  'var(--surface-3)',

  // Hairlines
  border:    'var(--border)',
  borderMid: 'var(--border-mid)',
  borderHi:  'var(--border-hi)',

  // Type
  text:      'var(--text)',
  textSoft:  'var(--text-soft)',
  textMuted: 'var(--text-muted)',
  textDim:   'var(--text-dim)',

  // Primary
  accent:    'var(--accent)',
  accentHi:  'var(--accent-hi)',
  accentLo:  'var(--accent-lo)',
  accentBg:  'var(--accent-bg)',
  accentBr:  'var(--accent-br)',
  /** Solid fill that carries white text at AA in both themes. */
  accentSolid:   'var(--accent-solid)',
  accentSolidHi: 'var(--accent-solid-hi)',

  // Status
  live:      'var(--live)',
  liveBg:    'var(--live-bg)',
  success:   'var(--success)',
  successBg: 'var(--success-bg)',
  danger:    'var(--danger)',
  dangerBg:  'var(--danger-bg)',

  // Fixed — reads on both themes
  onAccent:  '#FFFFFF',
  white:     '#FFFFFF',
}

/**
 * Data-series colours for differentiating cards, teams, and categories.
 * These stay literal hex because callers append alpha (`${tone}1F`).
 */
export const SERIES = ['#4C8DFF', '#F59E0B', '#10B981', '#A855F7', '#F43F5E', '#06B6D4']

export const D = {
  display:  "'Space Grotesk', sans-serif",
  body:     "'Inter', sans-serif",
  headline: "'Barlow Condensed', sans-serif",
}

/** Concentric radius scale — outer = inner + padding. */
export const R = { xs: 6, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, full: 999 }

/** Layered shadows read as depth; solid borders read as seams. */
export const SHADOW = {
  sm:     'var(--shadow-sm)',
  md:     'var(--shadow-md)',
  lg:     'var(--shadow-lg)',
  accent: 'var(--shadow-accent)',
}

/** Motion — mirrors the custom properties in index.css. */
export const M = {
  quick: '150ms', fast: '250ms', medium: '350ms', slow: '400ms',
  ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
}

/** Read a close duration off :root so JS timeouts stay in sync with CSS. */
export function closeDuration(varName = '--modal-close-dur', fallback = 150) {
  if (typeof document === 'undefined') return fallback
  const raw = getComputedStyle(document.documentElement).getPropertyValue(varName)
  return parseFloat(raw) || fallback
}

/* ── Theme persistence ──────────────────────────────────── */
const THEME_KEY = 'torquegrid-theme'

export function getStoredTheme() {
  if (typeof window === 'undefined') return 'dark'
  const saved = localStorage.getItem(THEME_KEY)
  if (saved === 'light' || saved === 'dark') return saved
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = theme
  localStorage.setItem(THEME_KEY, theme)
}
