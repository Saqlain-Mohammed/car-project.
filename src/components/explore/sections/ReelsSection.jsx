import { useState } from 'react'

const C = { dark:'#2B2D42', light:'#EDF2F4', red:'#EF233C', black:'#1a1b26', card:'#23253a', muted:'#8D99AE' }
const D = { display:"'Barlow Condensed', sans-serif", body:"'Barlow', sans-serif" }

const REELS = [
  { id:1, user:'TurboMike', avatar:'T', color:'#f39c12', title:'K-Swap Cold Start 🔥', views:'24K', likes:'1.2K', duration:'0:32', emoji:'🚗', tag:'Build' },
  { id:2, user:'DriftQueen', avatar:'D', color:'#27ae60', title:'180SX Drift Entry', views:'87K', likes:'4.8K', duration:'0:18', emoji:'💨', tag:'Drift' },
  { id:3, user:'RaiderKing', avatar:'R', color:'#EF233C', title:'Duke 390 Flyby Sound', views:'12K', likes:'890', duration:'0:08', emoji:'🏍️', tag:'Moto' },
  { id:4, user:'ZeroShift', avatar:'Z', color:'#3b82f6', title:'Track Day Onboard Lap', views:'43K', likes:'2.1K', duration:'1:42', emoji:'🏁', tag:'Track' },
  { id:5, user:'NightRider', avatar:'N', color:'#a855f7', title:'Ghat Road Sunset Ride', views:'61K', likes:'3.4K', duration:'0:45', emoji:'🌄', tag:'Trip' },
  { id:6, user:'IronBlock', avatar:'I', color:'#EF233C', title:'Turbo Spool Up Close', views:'19K', likes:'1.1K', duration:'0:12', emoji:'⚙️', tag:'Mod' },
  { id:7, user:'GhostLap', avatar:'G', color:'#8D99AE', title:'Night Highway Run', views:'33K', likes:'1.8K', duration:'0:28', emoji:'🌙', tag:'Vibes' },
  { id:8, user:'ApexHunter', avatar:'A', color:'#27ae60', title:'Heel-Toe Downshift', views:'55K', likes:'2.9K', duration:'0:15', emoji:'🎯', tag:'Skills' },
]

export default function ReelsSection() {
  const [activeReel, setActiveReel] = useState(REELS[0])

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', minHeight:'100%' }}>
      {/* Player */}
      <div style={{ background:C.black, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'2rem', borderRight:'1px solid rgba(141,153,174,0.1)' }}>
        <div style={{ width:'100%', maxWidth:380, aspectRatio:'9/16', background:C.card, border:'1px solid rgba(141,153,174,0.15)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
          <div style={{ fontSize:'5rem', marginBottom:'1rem' }}>{activeReel.emoji}</div>
          <div style={{ fontFamily:D.display, fontSize:'1.4rem', fontWeight:900, color:C.light, textAlign:'center', padding:'0 1.5rem', lineHeight:1.2 }}>{activeReel.title}</div>
          <div style={{ position:'absolute', bottom:0, left:0, right:0, padding:'1.5rem', background:'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.75rem' }}>
              <div style={{ width:32, height:32, borderRadius:'50%', background:activeReel.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:900, fontSize:'0.8rem', color:'#fff' }}>{activeReel.avatar}</div>
              <span style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.95rem', color:C.light }}>@{activeReel.user}</span>
              <button style={{ marginLeft:'auto', fontFamily:D.display, fontWeight:800, fontSize:'0.72rem', letterSpacing:'0.1em', background:C.red, color:C.light, border:'none', padding:'0.25rem 0.75rem', cursor:'pointer' }}>Follow</button>
            </div>
            <div style={{ height:2, background:'rgba(255,255,255,0.2)', borderRadius:1 }}>
              <div style={{ height:'100%', width:'35%', background:C.red, borderRadius:1 }} />
            </div>
          </div>
          <div style={{ position:'absolute', right:12, bottom:100, display:'flex', flexDirection:'column', gap:'1.2rem', alignItems:'center' }}>
            {[['❤️',activeReel.likes],['💬','84'],['↗','Share']].map(([icon,label]) => (
              <div key={label} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.2rem', cursor:'pointer' }}>
                <div style={{ fontSize:'1.4rem' }}>{icon}</div>
                <div style={{ fontFamily:D.display, fontSize:'0.65rem', color:C.light, fontWeight:700 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', gap:'1rem', marginTop:'1.5rem' }}>
          <button onClick={() => { const i=REELS.findIndex(r=>r.id===activeReel.id); if(i>0) setActiveReel(REELS[i-1]) }}
            style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.85rem', background:'none', border:'1px solid rgba(141,153,174,0.2)', color:C.muted, padding:'0.5rem 1.5rem', cursor:'pointer' }}>↑ Prev</button>
          <button onClick={() => { const i=REELS.findIndex(r=>r.id===activeReel.id); if(i<REELS.length-1) setActiveReel(REELS[i+1]) }}
            style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.85rem', background:C.red, border:'none', color:C.light, padding:'0.5rem 1.5rem', cursor:'pointer' }}>↓ Next</button>
        </div>
      </div>

      {/* Grid */}
      <div style={{ overflowY:'auto', padding:'1rem', background:C.dark }}>
        <div style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:C.muted, marginBottom:'0.75rem' }}>All Reels</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1px', background:'rgba(141,153,174,0.1)' }}>
          {REELS.map(reel => (
            <div key={reel.id} onClick={() => setActiveReel(reel)}
              style={{ cursor:'pointer', background: activeReel.id===reel.id ? C.card : C.black, border: activeReel.id===reel.id ? `1px solid ${C.red}` : '1px solid transparent', transition:'all 0.2s' }}>
              <div style={{ height:120, background:'rgba(141,153,174,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', position:'relative' }}>
                {reel.emoji}
                <div style={{ position:'absolute', bottom:4, right:6, fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, color:C.light, background:'rgba(0,0,0,0.7)', padding:'0.1rem 0.35rem' }}>{reel.duration}</div>
                <div style={{ position:'absolute', top:4, left:4, fontFamily:D.display, fontSize:'0.55rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.light, background:C.red, padding:'0.1rem 0.35rem' }}>{reel.tag}</div>
              </div>
              <div style={{ padding:'0.6rem' }}>
                <div style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.82rem', color:C.light, lineHeight:1.2, marginBottom:'0.3rem' }}>{reel.title}</div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  <div style={{ width:18, height:18, borderRadius:'50%', background:reel.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:900, fontSize:'0.55rem', color:'#fff' }}>{reel.avatar}</div>
                  <span style={{ fontFamily:D.display, fontSize:'0.68rem', color:C.muted }}>{reel.user}</span>
                  <span style={{ marginLeft:'auto', fontFamily:D.display, fontSize:'0.65rem', color:C.muted }}>👁 {reel.views}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}