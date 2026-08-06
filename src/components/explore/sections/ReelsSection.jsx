import { useState, useRef, useEffect, useCallback } from 'react'
import { MessageCircle, Share2, Volume2, VolumeX, ChevronUp, ChevronDown, Bookmark } from 'lucide-react'
import { C, D, R, SHADOW, SERIES } from '../../../lib/theme'
import { Avatar, Button, Badge, Divider, Input, FollowButton, SaveButton, LikeButton } from '../../ui/Primitives'
import Modal, { ModalHeader } from '../../ui/Modal'
import { useSavedIds } from '../../../hooks/useSocialActions'

const REELS = [
  { id:'r1', user:'TurboMike',  title:'K-swap cold start',     views:'24K', likes:1200, comments:84,  tag:'Build',  img:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&q=80', tags:['#kseries','#honda','#build'] },
  { id:'r2', user:'DriftQueen', title:'180SX drift entry',     views:'87K', likes:4800, comments:213, tag:'Drift',  img:'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=900&q=80', tags:['#drift','#180sx','#jdm'] },
  { id:'r3', user:'RaiderKing', title:'Duke 390 flyby',        views:'12K', likes:890,  comments:42,  tag:'Moto',   img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80', tags:['#ktm','#exhaust','#moto'] },
  { id:'r4', user:'ZeroShift',  title:'Track day onboard lap', views:'43K', likes:2100, comments:97,  tag:'Track',  img:'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=80', tags:['#trackday','#onboard'] },
  { id:'r5', user:'NightRider', title:'Ghat road at sunset',   views:'61K', likes:3400, comments:158, tag:'Trip',   img:'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&q=80', tags:['#ride','#sunset','#touring'] },
  { id:'r6', user:'ApexHunter', title:'Heel-toe downshift',    views:'55K', likes:2900, comments:134, tag:'Skills', img:'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=900&q=80', tags:['#skills','#manual'] },
]

const SEED_COMMENTS = [
  { id:1, user:'TurboMike',  text:'Absolute beast of a build.',   time:'2m' },
  { id:2, user:'DriftQueen', text:'What tune is this running?',   time:'5m' },
  { id:3, user:'ZeroShift',  text:'The sound at 4:12 is unreal.', time:'8m' },
  { id:4, user:'NightRider', text:'Goals.',                       time:'12m' },
]

export default function ReelsSection() {
  const [idx, setIdx]             = useState(0)
  const [muted, setMuted]         = useState(true)
  const [draft, setDraft]         = useState('')
  const [comments, setComments]   = useState(SEED_COMMENTS)
  const [savedOpen, setSavedOpen] = useState(false)
  const stageRef = useRef(null)
  const savedIds = useSavedIds('saves')

  const reel = REELS[idx]
  const go = useCallback(dir => {
    setIdx(i => Math.min(REELS.length - 1, Math.max(0, i + dir)))
  }, [])

  // Wheel advances one reel per gesture; the accumulator stops a single
  // trackpad flick from skipping several at once.
  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    let acc = 0, lock = false
    const onWheel = e => {
      e.preventDefault()
      if (lock) return
      acc += e.deltaY
      if (Math.abs(acc) > 50) {
        go(acc > 0 ? 1 : -1)
        acc = 0
        lock = true
        setTimeout(() => { lock = false }, 350)
      }
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  }, [go])

  // Arrow / space navigation, ignored while typing a comment.
  useEffect(() => {
    const onKey = e => {
      if (e.target.matches?.('input, textarea')) return
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') { e.preventDefault(); go(1) }
      if (e.key === 'ArrowUp'   || e.key === 'ArrowLeft')  { e.preventDefault(); go(-1) }
      if (e.key === 'm' || e.key === 'M') setMuted(v => !v)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go])

  // Warm the neighbouring frames so advancing never shows a blank stage.
  useEffect(() => {
    ;[idx - 1, idx + 1].forEach(i => {
      const r = REELS[i]
      if (r) { const img = new Image(); img.src = r.img }
    })
  }, [idx])

  const send = () => {
    if (!draft.trim()) return
    setComments(c => [{ id: Date.now(), user:'You', text: draft, time:'now' }, ...c])
    setDraft('')
  }

  const savedReels = REELS.filter(r => savedIds.has(String(r.id)))

  const railBtn = (Icon, label, onClick, extra) => (
    <button onClick={onClick} aria-label={label} className="t-press"
      style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.3rem', background:'none', border:'none', cursor:'pointer', padding:0 }}>
      <span style={{
        width:44, height:44, borderRadius:'50%',
        background:'rgba(11,13,17,0.55)', backdropFilter:'blur(10px)',
        boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.14)',
        display:'flex', alignItems:'center', justifyContent:'center',
      }}>
        <Icon size={18} color="#fff" />
      </span>
      <span style={{ fontFamily:D.body, fontSize:'0.66rem', fontWeight:600, color:'rgba(255,255,255,0.85)', fontVariantNumeric:'tabular-nums' }}>{extra}</span>
    </button>
  )

  return (
    <div className="tg-reels" style={{ display:'grid', gridTemplateColumns:'minmax(0,1fr) 360px', height:'calc(100vh - 60px)', overflow:'hidden', background:C.bg }}>

      {/* ── Stage: the reel is a true 9:16 card, letterboxed like Shorts ── */}
      <div ref={stageRef} className="tg-reels-stage"
        style={{
          position:'relative', overflow:'hidden', background:'#07080B',
          display:'flex', alignItems:'center', justifyContent:'center', padding:'1.25rem',
        }}>

        {/* Ambient wash of the current frame — fills the letterbox without
            stretching the reel itself out of ratio. */}
        <img key={`bg-${reel.id}`} src={reel.img} alt="" aria-hidden
          style={{
            position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover',
            filter:'blur(48px) saturate(140%)', opacity:0.35, transform:'scale(1.15)', outline:'none',
          }} />
        <div style={{ position:'absolute', inset:0, background:'rgba(7,8,11,0.5)' }} />

        {/* The 9:16 frame */}
        <div style={{
          position:'relative', height:'100%', aspectRatio:'9 / 16', maxWidth:'100%',
          borderRadius:R.xl, overflow:'hidden', boxShadow:SHADOW.lg, background:'#000',
        }}>
          <img key={reel.id} src={reel.img} alt={reel.title}
            style={{ width:'100%', height:'100%', objectFit:'cover', display:'block', animation:'fadeIn 350ms cubic-bezier(0.22,1,0.36,1)' }} />

          {/* Legibility scrims */}
          <div style={{ position:'absolute', inset:0, pointerEvents:'none',
            background:'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 42%), linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0) 22%)' }} />

          {/* Top bar */}
          <div style={{ position:'absolute', top:14, left:14, right:14, display:'flex', justifyContent:'space-between', alignItems:'center', zIndex:3 }}>
            <Badge tone="accent">{reel.tag}</Badge>
            <button onClick={() => setMuted(m => !m)} aria-label={muted ? 'Unmute' : 'Mute'} className="t-press"
              style={{
                width:36, height:36, borderRadius:R.md, border:'none', cursor:'pointer',
                background:'rgba(11,13,17,0.6)', backdropFilter:'blur(10px)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
              {muted ? <VolumeX size={15} color="#fff" /> : <Volume2 size={15} color="#fff" />}
            </button>
          </div>

          {/* Action rail — inside the frame, like Reels/Shorts */}
          <div style={{ position:'absolute', right:12, bottom:118, display:'flex', flexDirection:'column', gap:'1rem', alignItems:'center', zIndex:3 }}>
            <div style={{ background:'rgba(11,13,17,0.55)', backdropFilter:'blur(10px)', borderRadius:R.full, boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.14)' }}>
              <LikeButton postId={reel.id} count={reel.likes} />
            </div>
            {railBtn(MessageCircle, 'Comments', () => {}, reel.comments)}
            {railBtn(Share2, 'Share', () => {}, 'Share')}
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.3rem' }}>
              <span style={{
                width:44, height:44, borderRadius:'50%',
                background:'rgba(11,13,17,0.55)', backdropFilter:'blur(10px)',
                boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.14)',
                display:'flex', alignItems:'center', justifyContent:'center',
              }}>
                <SaveButton postId={reel.id} size={44} />
              </span>
              <button onClick={() => setSavedOpen(true)}
                style={{ fontFamily:D.body, fontSize:'0.66rem', fontWeight:600, color:'rgba(255,255,255,0.85)', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                Saved
              </button>
            </div>
          </div>

          {/* Caption */}
          <div style={{ position:'absolute', bottom:0, left:0, right:72, padding:'1.25rem 1.1rem', zIndex:3 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.55rem', marginBottom:'0.55rem' }}>
              <Avatar name={reel.user} size={34} tone={SERIES[idx % SERIES.length]} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:D.body, fontSize:'0.875rem', fontWeight:600, color:'#fff' }}>@{reel.user}</div>
                <div style={{ fontFamily:D.body, fontSize:'0.7rem', color:'rgba(255,255,255,0.6)' }}>{reel.views} views</div>
              </div>
              <FollowButton profileId={reel.user} />
            </div>
            <div style={{ fontFamily:D.body, fontSize:'0.875rem', fontWeight:500, color:'#fff', marginBottom:'0.35rem' }}>{reel.title}</div>
            <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap', marginBottom:'0.75rem' }}>
              {reel.tags.map(t => <span key={t} style={{ fontFamily:D.body, fontSize:'0.74rem', color:'#9EC1FF' }}>{t}</span>)}
            </div>
            <div style={{ height:2, background:'rgba(255,255,255,0.2)', borderRadius:1, overflow:'hidden' }}>
              <div style={{ height:'100%', width:'38%', background:C.accent, borderRadius:1 }} />
            </div>
          </div>
        </div>

        {/* Prev / next — outside the frame so they never cover content */}
        {[
          { Icon: ChevronUp,   dir: -1, pos: { top: 20 },    label: 'Previous reel', off: idx === 0 },
          { Icon: ChevronDown, dir:  1, pos: { bottom: 20 }, label: 'Next reel',     off: idx === REELS.length - 1 },
        ].map(({ Icon, dir, pos, label, off }) => (
          <button key={label} onClick={() => go(dir)} disabled={off} aria-label={label} className="t-press"
            style={{
              position:'absolute', right:24, ...pos, width:38, height:38, borderRadius:'50%',
              background:'rgba(255,255,255,0.08)', backdropFilter:'blur(10px)', border:'none',
              display:'flex', alignItems:'center', justifyContent:'center', zIndex:4,
              cursor: off ? 'default' : 'pointer', opacity: off ? 0.25 : 1,
              transition:'opacity 250ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
            }}>
            <Icon size={18} color="#fff" />
          </button>
        ))}

        {/* Position rail */}
        <div style={{ position:'absolute', left:14, top:'50%', translate:'0 -50%', display:'flex', flexDirection:'column', gap:5, zIndex:4 }}>
          {REELS.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} aria-label={`Reel ${i + 1}`}
              style={{
                width:3, height: i === idx ? 22 : 3, borderRadius:2, border:'none', padding:0, cursor:'pointer',
                background: i === idx ? C.accent : 'rgba(255,255,255,0.3)',
                transition:'height 250ms cubic-bezier(0.22,1,0.36,1), background-color 250ms cubic-bezier(0.22,1,0.36,1)',
              }} />
          ))}
        </div>
      </div>

      {/* ── Side panel ── */}
      <aside className="tg-reels-panel" style={{ background:C.surface, display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:`inset 1px 0 0 ${C.border}` }}>
        <div style={{ padding:'1.15rem 1.25rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.85rem' }}>
            <Avatar name={reel.user} size={44} tone={SERIES[idx % SERIES.length]} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontFamily:D.body, fontSize:'0.9rem', fontWeight:600, color:C.text }}>@{reel.user}</div>
              <div style={{ fontFamily:D.body, fontSize:'0.74rem', color:C.textMuted }}>{reel.views} views</div>
            </div>
            <FollowButton profileId={reel.user} />
          </div>
          <div style={{ fontFamily:D.body, fontSize:'0.86rem', fontWeight:500, color:C.text, marginBottom:'0.55rem' }}>{reel.title}</div>
          <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap' }}>
            {reel.tags.map(t => <Badge key={t} tone="accent">{t}</Badge>)}
          </div>
        </div>

        <Divider />

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)' }}>
          {[[reel.likes >= 1000 ? `${(reel.likes/1000).toFixed(1)}K` : reel.likes, 'Likes'], [reel.comments, 'Comments'], [reel.views, 'Views']].map(([v, l], i) => (
            <div key={l} style={{ padding:'0.85rem', textAlign:'center', boxShadow: i < 2 ? `inset -1px 0 0 ${C.border}` : 'none' }}>
              <div style={{ fontFamily:D.display, fontSize:'1.05rem', fontWeight:700, color:C.accent, fontVariantNumeric:'tabular-nums' }}>{v}</div>
              <div style={{ fontFamily:D.body, fontSize:'0.68rem', color:C.textMuted, marginTop:'0.15rem' }}>{l}</div>
            </div>
          ))}
        </div>

        <Divider />

        <div style={{ padding:'0.85rem 1.25rem 0.5rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:C.textDim }}>Comments</span>
          <button onClick={() => setSavedOpen(true)}
            style={{ display:'flex', alignItems:'center', gap:'0.3rem', fontFamily:D.body, fontSize:'0.72rem', fontWeight:600, color:C.accent, background:'none', border:'none', cursor:'pointer', padding:0 }}>
            <Bookmark size={12} /> Saved ({savedReels.length})
          </button>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:'0.5rem 1.25rem', display:'flex', flexDirection:'column', gap:'0.8rem' }}>
          {comments.map(c => (
            <div key={c.id} style={{ display:'flex', gap:'0.6rem', alignItems:'flex-start' }}>
              <Avatar name={c.user} size={28} />
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ background:C.surface2, borderRadius:R.md, padding:'0.55rem 0.8rem' }}>
                  <span style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.775rem', color:C.text }}>{c.user} </span>
                  <span style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textSoft }}>{c.text}</span>
                </div>
                <div style={{ fontFamily:D.body, fontSize:'0.66rem', color:C.textDim, marginTop:'0.2rem', paddingLeft:'0.2rem' }}>{c.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding:'0.85rem 1rem', display:'flex', gap:'0.5rem', boxShadow:`inset 0 1px 0 ${C.border}` }}>
          <Input value={draft} onChange={e => setDraft(e.target.value)} placeholder="Add a comment…"
            onKeyDown={e => e.key === 'Enter' && send()} />
          <Button onClick={send} disabled={!draft.trim()}>Post</Button>
        </div>
      </aside>

      {/* Saved shelf */}
      <Modal open={savedOpen} onClose={() => setSavedOpen(false)} width={520} labelledBy="saved-title">
        <ModalHeader id="saved-title" title="Saved reels"
          subtitle={`${savedReels.length} saved — tap any to jump back to it.`} />
        <div style={{ padding:'0 1.75rem 1.75rem', overflowY:'auto' }}>
          {savedReels.length === 0 ? (
            <div style={{ padding:'2.5rem 1rem', textAlign:'center' }}>
              <Bookmark size={24} color={C.textDim} style={{ marginBottom:'0.7rem' }} />
              <div style={{ fontFamily:D.body, fontSize:'0.875rem', color:C.textDim }}>Nothing saved yet — tap the bookmark on any reel.</div>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.7rem' }}>
              {savedReels.map(r => (
                <button key={r.id} onClick={() => { setIdx(REELS.findIndex(x => x.id === r.id)); setSavedOpen(false) }}
                  className="t-lift t-zoom"
                  style={{ borderRadius:R.md, overflow:'hidden', border:'none', padding:0, cursor:'pointer', background:C.surface2, textAlign:'left' }}>
                  <div style={{ aspectRatio:'9 / 16', maxHeight:150, overflow:'hidden' }}>
                    <img src={r.img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                  </div>
                  <div style={{ padding:'0.6rem 0.7rem' }}>
                    <div style={{ fontFamily:D.body, fontSize:'0.79rem', fontWeight:600, color:C.text }}>{r.title}</div>
                    <div style={{ fontFamily:D.body, fontSize:'0.68rem', color:C.textMuted, marginTop:'0.15rem' }}>@{r.user}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </Modal>
    </div>
  )
}
