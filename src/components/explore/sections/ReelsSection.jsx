import { useState } from 'react'

const C = { bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50', coral:'#EF8354', coralDim:'#d96a3a', text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0', border:'rgba(191,192,192,0.12)', green:'#5eaa7e' }
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const REELS = [
  { id:1, user:'TurboMike', avatar:'T', color:'#f39c12', title:'K-Swap Cold Start 🔥', views:'24K', likes:'1.2K', duration:'0:32', emoji:'🚗', tag:'Build' },
  { id:2, user:'DriftQueen', avatar:'D', color:'#5eaa7e', title:'180SX Drift Entry', views:'87K', likes:'4.8K', duration:'0:18', emoji:'💨', tag:'Drift' },
  { id:3, user:'RaiderKing', avatar:'R', color:'#EF8354', title:'Duke 390 Flyby Sound', views:'12K', likes:'890', duration:'0:08', emoji:'🏍️', tag:'Moto' },
  { id:4, user:'ZeroShift', avatar:'Z', color:'#3b82f6', title:'Track Day Onboard Lap', views:'43K', likes:'2.1K', duration:'1:42', emoji:'🏁', tag:'Track' },
  { id:5, user:'NightRider', avatar:'N', color:'#a855f7', title:'Ghat Road Sunset Ride', views:'61K', likes:'3.4K', duration:'0:45', emoji:'🌄', tag:'Trip' },
  { id:6, user:'IronBlock', avatar:'I', color:'#EF8354', title:'Turbo Spool Up Close', views:'19K', likes:'1.1K', duration:'0:12', emoji:'⚙️', tag:'Mod' },
  { id:7, user:'GhostLap', avatar:'G', color:'#8b90a0', title:'Night Highway Run', views:'33K', likes:'1.8K', duration:'0:28', emoji:'🌙', tag:'Vibes' },
  { id:8, user:'ApexHunter', avatar:'A', color:'#5eaa7e', title:'Heel-Toe Downshift', views:'55K', likes:'2.9K', duration:'0:15', emoji:'🎯', tag:'Skills' },
]

export default function ReelsSection() {
  const [active, setActive] = useState(REELS[0])

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', minHeight:'100%' }}>
      <div style={{ background:C.bg, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', borderRight:`1px solid ${C.border}` }}>
        <div style={{ width:'100%', maxWidth:360, aspectRatio:'9/16', background:C.surface, borderRadius:24, border:`1px solid ${C.border}`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', boxShadow:'0 24px 60px rgba(0,0,0,0.4)' }}>
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(135deg, ${active.color}18, ${active.color}06)` }} />
          <div style={{ fontSize:'5rem', marginBottom:'1rem', position:'relative', zIndex:1 }}>{active.emoji}</div>
          <div style={{ fontFamily:D.display, fontSize:'1.3rem', fontWeight:700, color:C.text, textAlign:'center', padding:'0 1.5rem', lineHeight:1.2, position:'relative', zIndex:1 }}>{active.title}</div>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'1.5rem', background:'linear-gradient(to top, rgba(31,34,48,0.95), transparent)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.85rem' }}>
              <div style={{ width:34, height:34, borderRadius:'50%', background:active.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.82rem', color:'#fff' }}>{active.avatar}</div>
              <span style={{ fontFamily:D.body, fontSize:'0.9rem', fontWeight:600, color:C.text, flex:1 }}>@{active.user}</span>
              <button style={{ background:C.coral, border:'none', borderRadius:8, padding:'0.3rem 0.85rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.75rem', color:'#fff' }}>Follow</button>
            </div>
            <div style={{ height:3, background:'rgba(255,255,255,0.12)', borderRadius:2 }}>
              <div style={{ height:'100%', width:'35%', background:C.coral, borderRadius:2 }} />
            </div>
          </div>
          <div style={{ position:'absolute', right:14, bottom:110, display:'flex', flexDirection:'column', gap:'1.25rem', alignItems:'center', zIndex:2 }}>
            {[['❤️',active.likes],['💬','84'],['↗','Share']].map(([icon,label]) => (
              <div key={label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.2rem', cursor:'pointer' }}>
                <div style={{ fontSize:'1.5rem' }}>{icon}</div>
                <div style={{ fontFamily:D.body, fontSize:'0.65rem', fontWeight:600, color:C.textSoft }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', gap:'1rem', marginTop:'1.5rem' }}>
          <button onClick={() => { const i=REELS.findIndex(r=>r.id===active.id); if(i>0) setActive(REELS[i-1]) }}
            style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.85rem', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, color:C.textMuted, padding:'0.6rem 1.5rem', cursor:'pointer', transition:'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.color=C.text}
            onMouseLeave={e => e.currentTarget.style.color=C.textMuted}>↑ Prev</button>
          <button onClick={() => { const i=REELS.findIndex(r=>r.id===active.id); if(i<REELS.length-1) setActive(REELS[i+1]) }}
            style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.85rem', background:C.coral, border:'none', borderRadius:10, color:'#fff', padding:'0.6rem 1.5rem', cursor:'pointer', transition:'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
            onMouseLeave={e => e.currentTarget.style.background=C.coral}>↓ Next</button>
        </div>
      </div>

      <div style={{ overflowY:'auto', padding:'1.5rem', background:C.surface }}>
        <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:C.textMuted, marginBottom:'1rem' }}>All Reels</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
          {REELS.map(r => (
            <div key={r.id} onClick={() => setActive(r)}
              style={{ cursor:'pointer', background: active.id===r.id ? C.surface2 : C.bg, borderRadius:14, border:`1px solid ${active.id===r.id ? 'rgba(239,131,84,0.4)' : C.border}`, overflow:'hidden', transition:'all 0.2s' }}
              onMouseEnter={e => { if(active.id!==r.id) e.currentTarget.style.borderColor='rgba(191,192,192,0.25)' }}
              onMouseLeave={e => { if(active.id!==r.id) e.currentTarget.style.borderColor=C.border }}>
              <div style={{ height:110, background:`linear-gradient(135deg, ${r.color}18, ${r.color}06)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', position:'relative' }}>
                {r.emoji}
                <div style={{ position:'absolute', bottom:6, right:8, fontFamily:D.body, fontSize:'0.68rem', fontWeight:600, color:C.text, background:'rgba(0,0,0,0.6)', padding:'0.1rem 0.4rem', borderRadius:5 }}>{r.duration}</div>
                <div style={{ position:'absolute', top:6, left:6, fontFamily:D.body, fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#fff', background:r.color, padding:'0.1rem 0.4rem', borderRadius:5 }}>{r.tag}</div>
              </div>
              <div style={{ padding:'0.75rem' }}>
                <div style={{ fontFamily:D.body, fontSize:'0.82rem', fontWeight:600, color:C.text, lineHeight:1.3, marginBottom:'0.4rem' }}>{r.title}</div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', background:r.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.55rem', color:'#fff' }}>{r.avatar}</div>
                  <span style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted, flex:1 }}>{r.user}</span>
                  <span style={{ fontFamily:D.body, fontSize:'0.68rem', color:C.textMuted }}>👁 {r.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}