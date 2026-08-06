import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { C, D, R, SHADOW, closeDuration } from '../../lib/theme'

/**
 * Scale-up modal with a paired backdrop fade — transitions.dev "Modal open / close".
 *
 * The open class is applied imperatively after a forced reflow rather than on a
 * rAF tick: React's dev-mode double-invoked effects can cancel a queued frame,
 * which leaves the panel stuck at its pre-open scale. Reading `offsetHeight`
 * flushes the closed state to the browser so the class swap has something to
 * transition from, deterministically.
 */
export default function Modal({ open, onClose, children, width = 560, labelledBy }) {
  const [mounted, setMounted] = useState(open)
  const panelRef    = useRef(null)
  const backdropRef = useRef(null)

  // Mount on open; delay unmount until the exit transition has run.
  useEffect(() => {
    if (open) { setMounted(true); return }
    if (!mounted) return

    const els = [panelRef.current, backdropRef.current].filter(Boolean)
    els.forEach(el => { el.classList.remove('is-open'); el.classList.add('is-closing') })
    const t = setTimeout(() => setMounted(false), closeDuration())
    return () => clearTimeout(t)
  }, [open, mounted])

  // Enter: flush the pre-open frame, then flip to the resting state.
  useEffect(() => {
    if (!mounted || !open) return
    const els = [panelRef.current, backdropRef.current].filter(Boolean)
    if (!els.length) return
    els.forEach(el => el.classList.remove('is-closing'))
    void els[0].offsetHeight
    els.forEach(el => el.classList.add('is-open'))
  }, [mounted, open])

  // Escape to dismiss, and lock scroll behind the overlay.
  useEffect(() => {
    if (!mounted) return
    const onKey = e => { if (e.key === 'Escape') onClose?.() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [mounted, onClose])

  if (!mounted) return null

  return (
    <div style={{ position:'fixed', inset:0, zIndex:700, display:'flex', alignItems:'center', justifyContent:'center', padding:'1.5rem' }}>
      <div ref={backdropRef} className="t-backdrop" onClick={onClose}
        style={{ position:'absolute', inset:0, background:'var(--scrim)', backdropFilter:'blur(10px)', WebkitBackdropFilter:'blur(10px)' }} />

      <div ref={panelRef} className="t-modal" role="dialog" aria-modal="true" aria-labelledby={labelledBy}
        style={{
          position:'relative', zIndex:1, width:'100%', maxWidth:width,
          maxHeight:'88vh', display:'flex', flexDirection:'column',
          background:C.surface, borderRadius:R.xxl, boxShadow:SHADOW.lg, overflow:'hidden',
        }}>
        <button onClick={onClose} aria-label="Close dialog" className="t-press"
          style={{
            position:'absolute', top:16, right:16, zIndex:10,
            width:34, height:34, borderRadius:R.sm,
            display:'flex', alignItems:'center', justifyContent:'center',
            background:C.surface2, border:`1px solid ${C.border}`, color:C.textMuted, cursor:'pointer',
            transition:'color 150ms cubic-bezier(0.22,1,0.36,1), background-color 150ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
          }}
          onMouseEnter={e => { e.currentTarget.style.color = C.text; e.currentTarget.style.background = C.surface3 }}
          onMouseLeave={e => { e.currentTarget.style.color = C.textMuted; e.currentTarget.style.background = C.surface2 }}>
          <X size={16} />
        </button>
        {children}
      </div>
    </div>
  )
}

export function ModalHeader({ title, subtitle, id }) {
  return (
    <div style={{ padding:'1.75rem 1.75rem 1.25rem' }}>
      <h2 id={id} style={{ fontFamily:D.display, fontSize:'1.4rem', fontWeight:700, color:C.text, letterSpacing:'-0.01em' }}>{title}</h2>
      {subtitle && <p style={{ fontFamily:D.body, fontSize:'0.875rem', color:C.textMuted, marginTop:'0.35rem', lineHeight:1.5 }}>{subtitle}</p>}
    </div>
  )
}

export function ModalBody({ children, style }) {
  return <div style={{ padding:'0 1.75rem', overflowY:'auto', flex:1, ...style }}>{children}</div>
}

export function ModalFooter({ children }) {
  return (
    <div style={{ padding:'1.25rem 1.75rem 1.75rem', display:'flex', gap:'0.65rem', justifyContent:'flex-end' }}>
      {children}
    </div>
  )
}

/** Terminal state for a completed action — replaces the modal body. */
export function ModalSuccess({ icon = '✓', title, message, onDone, actionLabel = 'Done' }) {
  return (
    <div style={{ padding:'3rem 2rem', textAlign:'center' }}>
      <div style={{
        width:64, height:64, margin:'0 auto 1.25rem', borderRadius:R.full,
        background:C.successBg, display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'1.75rem', color:C.success,
      }}>{icon}</div>
      <div style={{ fontFamily:D.display, fontSize:'1.25rem', fontWeight:700, color:C.text, marginBottom:'0.4rem' }}>{title}</div>
      {message && <p style={{ fontFamily:D.body, fontSize:'0.875rem', color:C.textMuted, lineHeight:1.6, maxWidth:340, margin:'0 auto 1.75rem' }}>{message}</p>}
      <button onClick={onDone} className="t-press"
        style={{
          fontFamily:D.body, fontSize:'0.9rem', fontWeight:600,
          background:C.accentSolid, color:'#fff', border:'none',
          borderRadius:R.md, padding:'0.7rem 2rem', cursor:'pointer',
          boxShadow:SHADOW.accent,
          transition:'background-color 150ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
        }}
        onMouseEnter={e => e.currentTarget.style.background = C.accentSolidHi}
        onMouseLeave={e => e.currentTarget.style.background = C.accentSolid}>
        {actionLabel}
      </button>
    </div>
  )
}
