import { useState, useRef, useEffect } from 'react'
import { Heart, MessageCircle, Share2, Bookmark, Volume2, VolumeX, X } from 'lucide-react'

const C = { bg:'#0a0b10', surface:'#2a2f40', surface2:'#353b50', coral:'#EF8354', coralDim:'#d96a3a', text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0', border:'rgba(191,192,192,0.12)', green:'#5eaa7e' }
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const REELS = [
  { id:1, user:'TurboMike',  avatar:'T', color:'#f39c12', title:'K-Swap Cold Start 🔥',         views:'24K', likes:1200, comments:84,  duration:'0:32', tag:'Build', img:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=500&q=80',  tags:['#kseries','#honda','#build','#civic'] },
  { id:2, user:'DriftQueen', avatar:'D', color:'#5eaa7e', title:'180SX Drift Entry',            views:'87K', likes:4800, comments:213, duration:'0:18', tag:'Drift', img:'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=500&q=80', tags:['#drift','#180sx','#smoke','#jdm'] },
  { id:3, user:'RaiderKing', avatar:'R', color:'#EF8354', title:'Duke 390 Flyby Sound',        views:'12K', likes:890,  comments:42,  duration:'0:08', tag:'Moto',  img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&q=80',  tags:['#ktm','#duke390','#exhaust','#moto'] },
  { id:4, user:'ZeroShift',  avatar:'Z', color:'#3b82f6', title:'Track Day Onboard Lap',       views:'43K', likes:2100, comments:97,  duration:'1:42', tag:'Track', img:'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=500&q=80', tags:['#trackday','#onboard','#racecar','#lap'] },
  { id:5, user:'NightRider', avatar:'N', color:'#a855f7', title:'Ghat Road Sunset Ride',       views:'61K', likes:3400, comments:158, duration:'0:45', tag:'Trip',  img:'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=500&q=80', tags:['#ride','#sunset','#ghatroad','#touring'] },
  { id:6, user:'IronBlock',  avatar:'I', color:'#EF8354', title:'Turbo Spool Up Close',        views:'19K', likes:1100, comments:66,  duration:'0:12', tag:'Mod',   img:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&q=80', tags:['#turbo','#boost','#mod','#performance'] },
  { id:7, user:'GhostLap',   avatar:'G', color:'#8b90a0', title:'Night Highway Run',           views:'33K', likes:1800, comments:79,  duration:'0:28', tag:'Vibes', img:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=500&q=80', tags:['#night','#highway','#vibes'] },
  { id:8, user:'ApexHunter', avatar:'A', color:'#5eaa7e', title:'Heel-Toe Downshift',          views:'55K', likes:2900, comments:134, duration:'0:15', tag:'Skills',img:'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=500&q=80',  tags:['#skills','#manual','#downshift','#driver'] },
]

const MOCK_COMMENTS = [
  { id:1, user:'TurboMike', avatar:'T', color:'#f39c12', text:'Absolute beast build! 🔥', time:'2m' },
  { id:2, user:'DriftQueen',avatar:'D', color:'#5eaa7e', text:'What tune is this running?', time:'5m' },
  { id:3, user:'ZeroShift', avatar:'Z', color:'#3b82f6', text:'The sound is insane bro', time:'8m' },
  { id:4, user:'NightRider',avatar:'N', color:'#a855f7', text:'Goals 🙌', time:'12m' },
  { id:5, user:'ApexHunter',avatar:'A', color:'#5eaa7e', text:'Stage 2 or stage 3?', time:'18m' },
]

function fmtLikes(n) { return n >= 1000 ? (n/1000).toFixed(1)+'K' : n }

export default function ReelsSection() {
  const [activeIdx, setActiveIdx] = useState(0)
  const [liked,      setLiked]      = useState({})
  const [saved,      setSaved]      = useState({})
  const [muted,      setMuted]      = useState(true)
  const [comment,    setComment]    = useState('')
  const [comments,   setComments]   = useState(MOCK_COMMENTS)
  const [showSaved,  setShowSaved]  = useState(false)
  const saveTimer = useRef(null)
  const containerRef = useRef(null)

  // Double-tap Save = show saved reels popup
  const handleSaveClick = (id) => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current)
      saveTimer.current = null
      setShowSaved(true) // double tap
    } else {
      setSaved(s => ({ ...s, [id]: !s[id] }))
      saveTimer.current = setTimeout(() => { saveTimer.current = null }, 300)
    }
  }
  const active = REELS[activeIdx]

  // Scroll-wheel to change reel
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    let acc = 0
    const handler = (e) => {
      e.preventDefault()
      acc += e.deltaY
      if (acc > 60)  { setActiveIdx(i => Math.min(REELS.length - 1, i + 1)); acc = 0 }
      if (acc < -60) { setActiveIdx(i => Math.max(0, i - 1)); acc = 0 }
    }
    el.addEventListener('wheel', handler, { passive: false })
    return () => el.removeEventListener('wheel', handler)
  }, [])

  const sendComment = () => {
    if (!comment.trim()) return
    setComments(c => [{ id: Date.now(), user:'You', avatar:'Y', color: C.coral, text: comment, time:'now' }, ...c])
    setComment('')
  }

  return (
    <>
    <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', height:'calc(100vh - 60px)', overflow:'hidden', background: C.bg }}>

      {/* ── LEFT: reel player ───────────────────────────── */}
      <div ref={containerRef}
        style={{ position:'relative', overflow:'hidden', cursor:'ns-resize', display:'flex', alignItems:'center', justifyContent:'center' }}>

        {/* Full-bleed background image */}
        <img src={active.img} alt={active.title} key={active.id}
          style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', opacity:0.6, transition:'opacity 0.4s' }} />

        {/* Gradients */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.35) 100%)' }} />

        {/* Top bar: tag + mute */}
        <div style={{ position:'absolute', top:16, left:0, right:0, display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0 20px', zIndex:3 }}>
          <span style={{ fontFamily:D.body, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', background:`${active.color}cc`, color:'#fff', padding:'0.22rem 0.65rem', borderRadius:6 }}>{active.tag}</span>
          <button onClick={() => setMuted(m => !m)}
            style={{ background:'rgba(0,0,0,0.5)', border:'none', borderRadius:8, width:36, height:36, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}>
            {muted ? <VolumeX size={16} color="#fff" /> : <Volume2 size={16} color="#fff" />}
          </button>
        </div>

        {/* Right-side action buttons — INSIDE the panel, absolute right edge */}
        <div style={{ position:'absolute', right:16, bottom:140, display:'flex', flexDirection:'column', gap:'1.5rem', alignItems:'center', zIndex:3 }}>
          {[
            { Icon: Heart,        label: fmtLikes(active.likes + (liked[active.id] ? 1 : 0)), action: () => setLiked(l => ({ ...l, [active.id]: !l[active.id] })), active: liked[active.id], color:'#ef4444' },
            { Icon: MessageCircle,label: active.comments, action: () => {}, active: false, color: C.coral },
            { Icon: Share2,       label: 'Share', action: () => {}, active: false, color: C.textSoft },
            { Icon: Bookmark,     label: 'Save',  action: () => handleSaveClick(active.id), active: saved[active.id], color: C.coral },
          ].map(({ Icon, label, action, active: isAct, color }) => (
            <button key={String(label)} onClick={action}
              style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.25rem', background:'none', border:'none', cursor:'pointer', padding:0 }}>
              <div style={{ width:46, height:46, borderRadius:'50%', background: isAct ? `${color}28` : 'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(6px)', border: isAct ? `1px solid ${color}55` : '1px solid rgba(255,255,255,0.1)', transition:'all 0.2s' }}>
                <Icon size={20} color={isAct ? color : '#fff'} fill={isAct ? color : 'none'} />
              </div>
              <span style={{ fontFamily:D.body, fontSize:'0.66rem', fontWeight:600, color:'rgba(255,255,255,0.85)' }}>{label}</span>
            </button>
          ))}
        </div>

        {/* Bottom: user info + tags + progress */}
        <div style={{ position:'absolute', bottom:0, left:0, right:70, padding:'1.5rem 1.25rem', zIndex:3 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.65rem', marginBottom:'0.55rem' }}>
            <div style={{ width:38, height:38, borderRadius:'50%', background:active.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.85rem', color:'#fff', flexShrink:0, border:'2px solid rgba(255,255,255,0.25)' }}>{active.avatar}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:D.body, fontSize:'0.92rem', fontWeight:700, color:'#fff' }}>@{active.user}</div>
              <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:'rgba(255,255,255,0.6)' }}>{active.views} views</div>
            </div>
            <button style={{ background:'rgba(239,131,84,0.9)', border:'none', borderRadius:8, padding:'0.3rem 0.95rem', cursor:'pointer', fontFamily:D.body, fontWeight:700, fontSize:'0.75rem', color:'#fff' }}>Follow</button>
          </div>
          <div style={{ fontFamily:D.body, fontSize:'0.92rem', fontWeight:600, color:'#fff', marginBottom:'0.4rem' }}>{active.title}</div>
          <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap', marginBottom:'0.85rem' }}>
            {active.tags.map(t => <span key={t} style={{ fontFamily:D.body, fontSize:'0.72rem', color:active.color }}>{t}</span>)}
          </div>
          {/* Progress bar */}
          <div style={{ height:2, background:'rgba(255,255,255,0.18)', borderRadius:1 }}>
            <div style={{ height:'100%', width:'35%', background:C.coral, borderRadius:1 }} />
          </div>
        </div>

        {/* Scroll hint */}
        <div style={{ position:'absolute', bottom:16, right:20, fontFamily:D.body, fontSize:'0.62rem', color:'rgba(255,255,255,0.4)', textAlign:'center', zIndex:2 }}>
          scroll ↕
        </div>

        {/* Dot indicators — left side */}
        <div style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', display:'flex', flexDirection:'column', gap:5, zIndex:3 }}>
          {REELS.map((_, i) => (
            <button key={i} onClick={() => setActiveIdx(i)}
              style={{ width: i === activeIdx ? 4 : 3, height: i === activeIdx ? 22 : 3, borderRadius: i === activeIdx ? 2 : '50%', background: i === activeIdx ? C.coral : 'rgba(255,255,255,0.28)', border:'none', cursor:'pointer', padding:0, transition:'all 0.3s' }} />
          ))}
        </div>
      </div>

      {/* ── RIGHT: uploader + comments panel ───────────── */}
      <div style={{ background: C.surface, display:'flex', flexDirection:'column', borderLeft:`1px solid ${C.border}`, overflow:'hidden' }}>

        {/* Uploader profile */}
        <div style={{ padding:'1.25rem', borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.85rem', marginBottom:'0.85rem' }}>
            <div style={{ width:50, height:50, borderRadius:'50%', background:active.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'1.2rem', color:'#fff', flexShrink:0, border:`3px solid ${active.color}44` }}>{active.avatar}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:D.body, fontSize:'0.92rem', fontWeight:700, color:C.text }}>@{active.user}</div>
              <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted }}>{active.views} views · {active.duration}</div>
            </div>
            <button style={{ fontFamily:D.body, fontWeight:700, fontSize:'0.75rem', background:C.coral, color:'#fff', border:'none', borderRadius:8, padding:'0.4rem 0.9rem', cursor:'pointer' }}>Follow</button>
          </div>
          <div style={{ fontFamily:D.body, fontSize:'0.85rem', fontWeight:600, color:C.text, marginBottom:'0.45rem' }}>{active.title}</div>
          <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
            {active.tags.map(t => (
              <span key={t} style={{ fontFamily:D.body, fontSize:'0.7rem', fontWeight:600, padding:'0.18rem 0.55rem', borderRadius:20, background:`${active.color}18`, color:active.color, border:`1px solid ${active.color}33` }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          {[
            [fmtLikes(active.likes + (liked[active.id] ? 1 : 0)), 'Likes'],
            [active.comments, 'Comments'],
            [active.views,    'Views'],
          ].map(([val, label]) => (
            <div key={label} style={{ padding:'0.75rem', textAlign:'center', borderRight:`1px solid ${C.border}` }}>
              <div style={{ fontFamily:D.display, fontSize:'1.1rem', fontWeight:700, color:C.coral }}>{val}</div>
              <div style={{ fontFamily:D.body, fontSize:'0.65rem', color:C.textMuted }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Comments label */}
        <div style={{ padding:'0.75rem 1.25rem', borderBottom:`1px solid ${C.border}`, flexShrink:0 }}>
          <div style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.textMuted }}>Comments</div>
        </div>

        {/* Comments list */}
        <div style={{ flex:1, overflowY:'auto', padding:'0.75rem 1.25rem', display:'flex', flexDirection:'column', gap:'0.85rem' }}>
          {comments.map(c => (
            <div key={c.id} style={{ display:'flex', gap:'0.6rem', alignItems:'flex-start' }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:c.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.68rem', color:'#fff', flexShrink:0 }}>{c.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ background:C.surface2, borderRadius:12, borderBottomLeftRadius:4, padding:'0.55rem 0.85rem' }}>
                  <span style={{ fontFamily:D.body, fontWeight:700, fontSize:'0.78rem', color:c.color }}>{c.user} </span>
                  <span style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.text }}>{c.text}</span>
                </div>
                <div style={{ fontFamily:D.body, fontSize:'0.62rem', color:C.textMuted, marginTop:'0.18rem', paddingLeft:'0.25rem' }}>{c.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Comment input */}
        <div style={{ padding:'0.85rem', borderTop:`1px solid ${C.border}`, display:'flex', gap:'0.5rem', flexShrink:0 }}>
          <input value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendComment()}
            placeholder="Add a comment..."
            style={{ flex:1, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:24, padding:'0.6rem 1rem', color:C.text, fontFamily:D.body, fontSize:'0.85rem', outline:'none' }}
            onFocus={e => e.target.style.borderColor='rgba(239,131,84,0.4)'}
            onBlur={e => e.target.style.borderColor=C.border} />
          <button onClick={sendComment}
            style={{ background:C.coral, border:'none', borderRadius:24, padding:'0.6rem 1.1rem', cursor:'pointer', fontFamily:D.body, fontWeight:700, fontSize:'0.82rem', color:'#fff', flexShrink:0 }}
            onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
            onMouseLeave={e => e.currentTarget.style.background=C.coral}>Post</button>
        </div>
      </div>
    </div>
    {/* Saved Reels Popup */}
    {showSaved && (
      <div style={{ position:'fixed', inset:0, zIndex:700, display:'flex', alignItems:'flex-end', justifyContent:'center', padding:'1rem' }}>
        <div style={{ position:'absolute', inset:0, background:'rgba(8,10,18,0.75)', backdropFilter:'blur(6px)' }} onClick={() => setShowSaved(false)} />
        <div style={{ position:'relative', zIndex:1, background:'#2a2f40', border:'1px solid rgba(191,192,192,0.12)', borderRadius:'22px 22px 16px 16px', width:'100%', maxWidth:520, maxHeight:'70vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 -16px 48px rgba(0,0,0,0.5)' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'1.25rem 1.5rem', borderBottom:'1px solid rgba(191,192,192,0.12)' }}>
            <div>
              <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.1rem', fontWeight:700, color:'#EDEEF0' }}>Saved Reels</div>
              <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'0.72rem', color:'#8b90a0', marginTop:'0.1rem' }}>{Object.values(saved).filter(Boolean).length} saved</div>
            </div>
            <button onClick={() => setShowSaved(false)} style={{ background:'#353b50', border:'1px solid rgba(191,192,192,0.12)', borderRadius:8, width:32, height:32, cursor:'pointer', color:'#8b90a0', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <X size={15} />
            </button>
          </div>
          <div style={{ overflowY:'auto', padding:'1rem' }}>
            {REELS.filter(r => saved[r.id]).length === 0 ? (
              <div style={{ textAlign:'center', padding:'2.5rem 1rem' }}>
                <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>🔖</div>
                <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'0.9rem', color:'#8b90a0' }}>No saved reels yet. Tap Save on any reel.</div>
              </div>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                {REELS.filter(r => saved[r.id]).map(r => (
                  <div key={r.id} onClick={() => { setActiveIdx(REELS.findIndex(x=>x.id===r.id)); setShowSaved(false) }}
                    style={{ borderRadius:14, overflow:'hidden', border:'1px solid rgba(191,192,192,0.12)', cursor:'pointer', position:'relative' }}>
                    <div style={{ height:110, overflow:'hidden' }}>
                      <img src={r.img} alt={r.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                      <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />
                    </div>
                    <div style={{ padding:'0.65rem 0.75rem' }}>
                      <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'0.8rem', fontWeight:600, color:'#EDEEF0', marginBottom:'0.2rem' }}>{r.title}</div>
                      <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'0.68rem', color:'#8b90a0' }}>@{r.user} · {r.views} views</div>
                    </div>
                    <button onClick={e=>{e.stopPropagation();setSaved(s=>({...s,[r.id]:false}))}}
                      style={{ position:'absolute', top:8, right:8, background:'rgba(0,0,0,0.55)', border:'none', borderRadius:6, width:26, height:26, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <X size={12} color="#fff" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  )
}
