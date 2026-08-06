import { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Heart, Bookmark } from 'lucide-react'
import { C, D, R, SHADOW, closeDuration } from '../../lib/theme'
import { useFollow, useSavePost, useLikePost } from '../../hooks/useSocialActions'

/**
 * Retains the last non-null value.
 *
 * Detail surfaces are usually driven by `selected && <Detail item={selected}/>`,
 * which unmounts the modal the instant the selection clears — killing the exit
 * transition. Render the modal unconditionally and read its content through
 * this hook instead, so the closing frames still have something to draw.
 */
export function useSticky(value) {
  const ref = useRef(value)
  if (value != null) ref.current = value
  return ref.current
}

/* ══════════════════════════════════════════════════════════
   BUTTON
   ══════════════════════════════════════════════════════════ */
const BTN_SIZES = {
  sm: { h: 34, px: '0.85rem', fs: '0.8rem',  r: R.sm },
  md: { h: 40, px: '1.1rem',  fs: '0.875rem', r: R.md },
  lg: { h: 46, px: '1.5rem',  fs: '0.925rem', r: R.md },
}

export function Button({
  children, variant = 'primary', size = 'md', icon: Icon, iconRight: IconRight,
  onClick, disabled, loading, fullWidth, type = 'button', style,
}) {
  const sz = BTN_SIZES[size]
  const skins = {
    primary: { bg: C.accentSolid, fg: '#fff',    br: 'transparent',   hover: C.accentSolidHi, shadow: SHADOW.accent },
    neutral: { bg: C.surface2,  fg: C.text,      br: C.border,        hover: C.surface3,  shadow: 'none' },
    ghost:   { bg: 'transparent', fg: C.textSoft, br: 'transparent',  hover: C.surface2,  shadow: 'none' },
    outline: { bg: 'transparent', fg: C.text,    br: C.borderMid,     hover: C.surface2,  shadow: 'none' },
    danger:  { bg: C.dangerBg,  fg: C.danger,    br: 'rgba(255,69,58,0.28)', hover: 'rgba(255,69,58,0.2)', shadow: 'none' },
  }
  const k = skins[variant] ?? skins.primary
  const off = disabled || loading

  return (
    <button type={type} onClick={onClick} disabled={off} className="t-press"
      style={{
        display:'inline-flex', alignItems:'center', justifyContent:'center', gap:'0.5rem',
        height: sz.h, padding: `0 ${sz.px}`, width: fullWidth ? '100%' : undefined,
        fontFamily: D.body, fontSize: sz.fs, fontWeight: 600, lineHeight: 1,
        background: k.bg, color: k.fg,
        border: `1px solid ${k.br}`, borderRadius: sz.r,
        boxShadow: k.shadow, cursor: off ? 'not-allowed' : 'pointer',
        opacity: off ? 0.5 : 1, whiteSpace:'nowrap',
        transition: 'background-color 150ms cubic-bezier(0.22,1,0.36,1), border-color 150ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
        ...style,
      }}
      onMouseEnter={e => { if (!off) e.currentTarget.style.background = k.hover }}
      onMouseLeave={e => { if (!off) e.currentTarget.style.background = k.bg }}>
      {loading
        ? <span style={{ width:14, height:14, border:`2px solid ${k.fg}`, borderTopColor:'transparent', borderRadius:'50%', animation:'spin 0.7s linear infinite' }} />
        : Icon && <Icon size={size === 'sm' ? 14 : 16} />}
      {children}
      {IconRight && !loading && <IconRight size={size === 'sm' ? 14 : 16} />}
    </button>
  )
}

/** Square icon button — 40px keeps it inside the dense-desktop hit-area floor. */
export function IconButton({ icon: Icon, onClick, label, active, size = 40, danger }) {
  return (
    <button onClick={onClick} aria-label={label} className="t-press"
      style={{
        width: size, height: size, display:'flex', alignItems:'center', justifyContent:'center',
        background: active ? C.accentBg : 'transparent',
        border:'1px solid transparent', borderRadius: R.md,
        color: danger ? C.danger : active ? C.accent : C.textMuted, cursor:'pointer',
        transition:'background-color 150ms cubic-bezier(0.22,1,0.36,1), color 150ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = C.surface2; e.currentTarget.style.color = C.text } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = danger ? C.danger : C.textMuted } }}>
      <Icon size={18} />
    </button>
  )
}

/**
 * Follow button with persisted state.
 *
 * Swaps to an outline "Following" treatment once active, and reverts to a
 * destructive-looking "Unfollow" on hover so the click target always says
 * what it will actually do.
 */
export function FollowButton({ profileId, size = 'sm', fullWidth }) {
  const { active, pending, toggle } = useFollow(profileId)
  const [hover, setHover] = useState(false)

  const label = !active ? 'Follow' : hover ? 'Unfollow' : 'Following'
  const variant = !active ? 'primary' : hover ? 'danger' : 'outline'

  return (
    <span onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ display: fullWidth ? 'block' : 'inline-flex' }}>
      <Button size={size} variant={variant} fullWidth={fullWidth} loading={pending}
        onClick={e => { e?.stopPropagation?.(); toggle() }}>
        {label}
      </Button>
    </span>
  )
}

/** Bookmark toggle — icon-only, persisted. */
export function SaveButton({ postId, size = 32 }) {
  const { active, toggle } = useSavePost(postId)
  return (
    <button onClick={e => { e.stopPropagation(); toggle() }}
      aria-label={active ? 'Remove from saved' : 'Save'}
      aria-pressed={active}
      className="t-press"
      style={{
        width: size, height: size, display:'flex', alignItems:'center', justifyContent:'center',
        borderRadius: R.sm, background:'none', border:'none', cursor:'pointer',
        color: active ? C.live : C.textMuted,
        transition:'color 150ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
      }}>
      <Bookmark size={15} fill={active ? C.live : 'none'} />
    </button>
  )
}

/** Heart toggle with a live count that reflects the optimistic state. */
export function LikeButton({ postId, count = 0 }) {
  const { active, toggle } = useLikePost(postId)
  const total = count + (active ? 1 : 0)
  return (
    <button onClick={e => { e.stopPropagation(); toggle() }}
      aria-label={active ? 'Unlike' : 'Like'} aria-pressed={active}
      className="t-press"
      style={{
        display:'flex', alignItems:'center', gap:'0.4rem', height:32, padding:'0 0.6rem',
        borderRadius:R.sm, background:'none', border:'none', cursor:'pointer',
        fontFamily:D.body, fontSize:'0.79rem', fontWeight:600, fontVariantNumeric:'tabular-nums',
        color: active ? C.danger : C.textMuted,
        transition:'color 150ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
      }}>
      <Heart size={14} fill={active ? C.danger : 'none'} />
      {total >= 1000 ? `${(total / 1000).toFixed(1)}K` : total}
    </button>
  )
}

/* ══════════════════════════════════════════════════════════
   SURFACES
   ══════════════════════════════════════════════════════════ */
/**
 * Surface container. When `onClick` is supplied the card becomes a real
 * control — focusable, Enter/Space activated, and announced as a button —
 * rather than a div that only a mouse can reach.
 */
export function Card({ children, padding = 20, radius = R.lg, hover, onClick, style, className = '', label }) {
  const interactive = typeof onClick === 'function'

  return (
    <div
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      aria-label={interactive ? label : undefined}
      onKeyDown={interactive ? (e => {
        if (e.key === 'Enter' || e.key === ' ') {
          // Space scrolls the page by default; a button must not.
          e.preventDefault()
          onClick(e)
        }
      }) : undefined}
      className={`${hover ? 't-lift' : ''} ${className}`}
      style={{
        background: C.surface, borderRadius: radius, padding,
        boxShadow: SHADOW.sm, cursor: interactive ? 'pointer' : undefined,
        ...style,
      }}>
      {children}
    </div>
  )
}

export function Badge({ children, tone = 'neutral', dot }) {
  const tones = {
    neutral: { bg:'rgba(255,255,255,0.06)', fg:C.textSoft, br:'transparent' },
    accent:  { bg:C.accentBg,  fg:C.accentHi, br:C.accentBr },
    live:    { bg:C.liveBg,    fg:C.live,     br:'rgba(255,159,10,0.28)' },
    success: { bg:C.successBg, fg:C.success,  br:'rgba(48,209,88,0.28)' },
    danger:  { bg:C.dangerBg,  fg:C.danger,   br:'rgba(255,69,58,0.28)' },
  }
  const t = tones[tone] ?? tones.neutral
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap:'0.35rem',
      fontFamily:D.body, fontSize:'0.7rem', fontWeight:600, lineHeight:1,
      padding:'0.3rem 0.6rem', borderRadius:R.full,
      background:t.bg, color:t.fg, border:`1px solid ${t.br}`, whiteSpace:'nowrap',
    }}>
      {dot && <span style={{ width:6, height:6, borderRadius:'50%', background:t.fg, animation: tone==='live' ? 'livePulse 2s infinite' : 'none' }} />}
      {children}
    </span>
  )
}

export function Avatar({ name = '?', size = 32, src, tone }) {
  const initial = String(name).charAt(0).toUpperCase()
  return (
    <div style={{
      width:size, height:size, borderRadius:'50%', flexShrink:0,
      background: src ? `url(${src}) center/cover` : (tone || `linear-gradient(135deg, ${C.accent}, ${C.accentLo})`),
      display:'flex', alignItems:'center', justifyContent:'center',
      fontFamily:D.display, fontWeight:700, fontSize: size * 0.42, color:'#fff',
      boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.1)',
    }}>
      {!src && initial}
    </div>
  )
}

/** Full-bleed hairline. Softer than a solid border. */
export function Divider({ vertical, style }) {
  return <div style={{
    background: C.border, flexShrink:0,
    width: vertical ? 1 : '100%', height: vertical ? '1.25rem' : 1,
    ...style,
  }} />
}

/* ══════════════════════════════════════════════════════════
   PAGE HEADER — staggered reveal on mount
   ══════════════════════════════════════════════════════════ */
export function PageHeader({ eyebrow, title, description, actions }) {
  const [shown, setShown] = useState(false)
  useEffect(() => { const id = requestAnimationFrame(() => setShown(true)); return () => cancelAnimationFrame(id) }, [])

  return (
    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:'2rem', flexWrap:'wrap', marginBottom:'2rem' }}>
      <div className={`t-stagger ${shown ? 'is-shown' : ''}`} style={{ minWidth:0 }}>
        {eyebrow && (
          <span className="t-stagger-line t-stagger-line--1"
            style={{ fontFamily:D.body, fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:C.accent, marginBottom:'0.6rem' }}>
            {eyebrow}
          </span>
        )}
        <h1 className="t-stagger-line t-stagger-line--2"
          style={{ fontFamily:D.display, fontSize:'clamp(1.65rem,3vw,2.1rem)', fontWeight:700, color:C.text, letterSpacing:'-0.02em', lineHeight:1.1 }}>
          {title}
        </h1>
        {description && (
          <p className="t-stagger-line t-stagger-line--3"
            style={{ fontFamily:D.body, fontSize:'0.925rem', color:C.textMuted, marginTop:'0.6rem', lineHeight:1.6, maxWidth:520 }}>
            {description}
          </p>
        )}
      </div>
      {actions && <div style={{ display:'flex', gap:'0.65rem', flexShrink:0 }}>{actions}</div>}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   TABS — sliding pill
   ══════════════════════════════════════════════════════════ */
export function Tabs({ tabs, value, onChange }) {
  const barRef  = useRef(null)
  const pillRef = useRef(null)

  // Position the pill without a transition on first paint and on
  // resize, so it snaps into place instead of sliding in from zero.
  useLayoutEffect(() => {
    const bar = barRef.current, pill = pillRef.current
    if (!bar || !pill) return

    const move = (animate) => {
      const el = bar.querySelector('[aria-selected="true"]')
      if (!el) return
      if (!animate) {
        const prev = pill.style.transition
        pill.style.transition = 'none'
        pill.style.transform = `translateX(${el.offsetLeft - 4}px)`
        pill.style.width = `${el.offsetWidth}px`
        void pill.offsetWidth
        pill.style.transition = prev
      } else {
        pill.style.transform = `translateX(${el.offsetLeft - 4}px)`
        pill.style.width = `${el.offsetWidth}px`
      }
    }

    const id = requestAnimationFrame(() => move(false))
    const onResize = () => move(false)
    window.addEventListener('resize', onResize)
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', onResize) }
  }, [])

  // Animate on value change
  useEffect(() => {
    const bar = barRef.current, pill = pillRef.current
    if (!bar || !pill) return
    const el = bar.querySelector('[aria-selected="true"]')
    if (!el) return
    pill.style.transform = `translateX(${el.offsetLeft - 4}px)`
    pill.style.width = `${el.offsetWidth}px`
  }, [value])

  return (
    <div ref={barRef} className="t-tabs" role="tablist">
      <span ref={pillRef} className="t-tabs-pill" aria-hidden="true" />
      {tabs.map(t => {
        const val = typeof t === 'string' ? t : t.value
        const lbl = typeof t === 'string' ? t : t.label
        return (
          <button key={val} className="t-tab" role="tab"
            aria-selected={value === val} onClick={() => onChange(val)}>
            {lbl}
          </button>
        )
      })}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   FILTER CHIPS — lighter than tabs, many options
   ══════════════════════════════════════════════════════════ */
export function ChipRow({ options, value, onChange }) {
  return (
    <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
      {options.map(opt => {
        const active = value === opt
        return (
          <button key={opt} onClick={() => onChange(opt)} className="t-press"
            style={{
              fontFamily:D.body, fontSize:'0.8rem', fontWeight:600,
              height:32, padding:'0 0.85rem', borderRadius:R.full,
              background: active ? C.accentBg : 'transparent',
              border: `1px solid ${active ? C.accentBr : C.border}`,
              color: active ? C.accentHi : C.textMuted, cursor:'pointer',
              transition:'background-color 150ms cubic-bezier(0.22,1,0.36,1), border-color 150ms cubic-bezier(0.22,1,0.36,1), color 150ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
            }}
            onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.color = C.textSoft } }}
            onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.color = C.textMuted } }}>
            {opt}
          </button>
        )
      })}
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   FORM FIELDS
   ══════════════════════════════════════════════════════════ */
export function Field({ label, children, hint }) {
  return (
    <label style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
      <span style={{ fontFamily:D.body, fontSize:'0.75rem', fontWeight:600, color:C.textSoft }}>{label}</span>
      {children}
      {hint && <span style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textDim }}>{hint}</span>}
    </label>
  )
}

const inputBase = {
  width:'100%', height:42, padding:'0 0.9rem',
  background:C.surface2, border:`1px solid ${C.border}`, borderRadius:R.md,
  color:C.text, fontFamily:D.body, fontSize:'0.9rem', outline:'none',
  transition:'border-color 150ms cubic-bezier(0.22,1,0.36,1), background-color 150ms cubic-bezier(0.22,1,0.36,1)',
}

export function Input({ value, onChange, placeholder, type = 'text', ...rest }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder} style={inputBase}
      onFocus={e => { e.target.style.borderColor = C.accentBr; e.target.style.background = C.surface3 }}
      onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.surface2 }}
      {...rest} />
  )
}

export function Textarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
      style={{ ...inputBase, height:'auto', padding:'0.75rem 0.9rem', resize:'vertical', lineHeight:1.6 }}
      onFocus={e => { e.target.style.borderColor = C.accentBr; e.target.style.background = C.surface3 }}
      onBlur={e => { e.target.style.borderColor = C.border; e.target.style.background = C.surface2 }} />
  )
}

export function Select({ value, onChange, options, placeholder = 'Select…' }) {
  return (
    <select value={value} onChange={onChange}
      style={{ ...inputBase, cursor:'pointer', color: value ? C.text : C.textMuted }}
      onFocus={e => { e.target.style.borderColor = C.accentBr }}
      onBlur={e => { e.target.style.borderColor = C.border }}>
      <option value="">{placeholder}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
}

export function SearchInput({ value, onChange, placeholder = 'Search…', width = 320 }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:'0.55rem', width, height:40,
      padding:'0 0.9rem', background:C.surface2, borderRadius:R.md,
      border:`1px solid ${C.border}`,
      transition:'border-color 150ms cubic-bezier(0.22,1,0.36,1)',
    }}>
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={C.textMuted} strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink:0 }}>
        <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
      </svg>
      <input value={value} onChange={onChange} placeholder={placeholder}
        style={{ flex:1, minWidth:0, background:'none', border:'none', outline:'none', color:C.text, fontFamily:D.body, fontSize:'0.875rem' }} />
    </div>
  )
}

/* ══════════════════════════════════════════════════════════
   DROPDOWN — origin-aware, grows from its trigger
   ══════════════════════════════════════════════════════════ */
export function Dropdown({ open, children, width = 200, origin = 'top-right', align = 'right' }) {
  const [mounted, setMounted] = useState(open)
  const ref = useRef(null)

  // Mount on open; hold the node until the close transition finishes.
  useEffect(() => {
    if (open) { setMounted(true); return }
    if (!mounted || !ref.current) return
    ref.current.classList.remove('is-open')
    ref.current.classList.add('is-closing')
    const t = setTimeout(() => setMounted(false), closeDuration('--dropdown-close-dur'))
    return () => clearTimeout(t)
  }, [open, mounted])

  // Enter: flush the pre-open scale, then flip. See Modal for why this
  // is a forced reflow rather than a queued animation frame.
  useEffect(() => {
    if (!mounted || !open || !ref.current) return
    ref.current.classList.remove('is-closing')
    void ref.current.offsetHeight
    ref.current.classList.add('is-open')
  }, [mounted, open])

  if (!mounted) return null

  return (
    <div ref={ref} className="t-dropdown" data-origin={origin}
      style={{
        position:'absolute', top:'calc(100% + 8px)',
        [align]: 0, width,
        background:C.surface2, borderRadius:R.lg,
        boxShadow:SHADOW.lg, overflow:'hidden', zIndex:300,
      }}>
      {children}
    </div>
  )
}

export function MenuItem({ icon: Icon, children, onClick, danger, active }) {
  return (
    <button onClick={onClick}
      style={{
        width:'100%', minHeight:40, display:'flex', alignItems:'center', gap:'0.7rem',
        padding:'0 0.9rem', background: active ? C.accentBg : 'none', border:'none', cursor:'pointer',
        fontFamily:D.body, fontSize:'0.85rem', fontWeight: active ? 600 : 500, textAlign:'left',
        color: danger ? C.danger : active ? C.accentHi : C.textSoft,
        transition:'background-color 150ms cubic-bezier(0.22,1,0.36,1), color 150ms cubic-bezier(0.22,1,0.36,1)',
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = danger ? C.danger : C.text } }}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = danger ? C.danger : C.textSoft } }}>
      {Icon && <Icon size={15} style={{ flexShrink:0 }} />}
      {children}
    </button>
  )
}

/* ══════════════════════════════════════════════════════════
   STATES
   ══════════════════════════════════════════════════════════ */
export function EmptyState({ icon: Icon, title, message, action }) {
  return (
    <div style={{ textAlign:'center', padding:'4rem 2rem' }}>
      {Icon && (
        <div style={{ width:52, height:52, margin:'0 auto 1.1rem', borderRadius:R.lg, background:C.surface2, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <Icon size={22} color={C.textDim} />
        </div>
      )}
      <div style={{ fontFamily:D.display, fontSize:'1.05rem', fontWeight:600, color:C.textSoft, marginBottom:'0.35rem' }}>{title}</div>
      {message && <p style={{ fontFamily:D.body, fontSize:'0.875rem', color:C.textDim, maxWidth:340, margin:'0 auto', lineHeight:1.6 }}>{message}</p>}
      {action && <div style={{ marginTop:'1.5rem' }}>{action}</div>}
    </div>
  )
}

export function StatRow({ items }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'2.25rem', flexWrap:'wrap' }}>
      {items.map(([value, label]) => (
        <div key={label}>
          <div style={{ fontFamily:D.display, fontSize:'1.35rem', fontWeight:700, color:C.text, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>{value}</div>
          <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted, marginTop:'0.3rem' }}>{label}</div>
        </div>
      ))}
    </div>
  )
}
