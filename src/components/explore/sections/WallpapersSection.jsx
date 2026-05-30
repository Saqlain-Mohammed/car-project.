import { useState } from 'react'

const C = { dark:'#2B2D42', light:'#EDF2F4', red:'#EF233C', black:'#1a1b26', card:'#23253a', muted:'#8D99AE' }
const D = { display:"'Barlow Condensed', sans-serif" }

const WALLPAPERS = [
  { id:1, title:'Civic EK9 Track Session', user:'TurboMike', emoji:'🚗', color:'#1a0a0a', tag:'JDM', res:'4K', likes:892 },
  { id:2, title:'Duke 390 Sunset Silhouette', user:'RaiderKing', emoji:'🏍️', color:'#0a1a0a', tag:'Moto', res:'8K', likes:1204 },
  { id:3, title:'GTR R35 Wet Track', user:'GhostLap', emoji:'🌧️', color:'#0a0a1a', tag:'JDM', res:'4K', likes:2341 },
  { id:4, title:'180SX Drift Smoke', user:'DriftQueen', emoji:'💨', color:'#1a1a0a', tag:'Drift', res:'4K', likes:1876 },
  { id:5, title:'Supra A80 Night Shoot', user:'NightRider', emoji:'🌙', color:'#0f0f0f', tag:'JDM', res:'6K', likes:3102 },
  { id:6, title:'Interceptor Mountain Road', user:'RoadKing', emoji:'🏔️', color:'#0a1010', tag:'Moto', res:'4K', likes:956 },
  { id:7, title:'Type R FK8 Circuit', user:'LapQueen', emoji:'🏁', color:'#1a0505', tag:'Honda', res:'4K', likes:1543 },
  { id:8, title:'Swift Sport at Night', user:'ZeroShift', emoji:'⭐', color:'#050512', tag:'Indian', res:'4K', likes:724 },
]

const TAGS = ['All','JDM','Moto','Drift','Track','4K','8K']

export default function WallpapersSection() {
  const [activeTag, setActiveTag] = useState('All')
  const [hoveredId, setHoveredId] = useState(null)
  const filtered = activeTag === 'All' ? WALLPAPERS : WALLPAPERS.filter(w => w.tag === activeTag || w.res === activeTag)

  return (
    <div style={{ padding:'1.5rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
        <div>
          <div style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:C.red, marginBottom:'0.25rem' }}>Community</div>
          <h2 style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:900, color:C.light, lineHeight:1 }}>Wallpapers</h2>
        </div>
        <button style={{ fontFamily:D.display, fontWeight:800, fontSize:'0.82rem', letterSpacing:'0.1em', textTransform:'uppercase', background:C.red, color:C.light, border:'none', padding:'0.6rem 1.4rem', cursor:'pointer' }}>+ Upload</button>
      </div>
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {TAGS.map(tag => (
          <button key={tag} onClick={() => setActiveTag(tag)}
            style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.78rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.35rem 0.9rem', background: activeTag===tag ? C.red : 'none', border:`1px solid ${activeTag===tag ? C.red : 'rgba(141,153,174,0.2)'}`, color: activeTag===tag ? C.light : C.muted, cursor:'pointer' }}>
            {tag}
          </button>
        ))}
      </div>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(240px,1fr))', gap:'2px' }}>
        {filtered.map(w => (
          <div key={w.id}
            onMouseEnter={() => setHoveredId(w.id)} onMouseLeave={() => setHoveredId(null)}
            style={{ position:'relative', aspectRatio:'16/9', background:w.color, overflow:'hidden', cursor:'pointer', transition:'transform 0.2s', transform: hoveredId===w.id ? 'scale(1.02)' : 'scale(1)' }}>
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3.5rem' }}>{w.emoji}</div>
            <div style={{ position:'absolute', top:8, right:8, fontFamily:D.display, fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.15em', background:C.red, color:C.light, padding:'0.15rem 0.4rem' }}>{w.res}</div>
            <div style={{ position:'absolute', top:8, left:8, fontFamily:D.display, fontSize:'0.6rem', fontWeight:700, background:'rgba(0,0,0,0.6)', color:C.muted, padding:'0.15rem 0.4rem' }}>{w.tag}</div>
            {hoveredId === w.id && (
              <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,0.75)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                <div style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.95rem', color:C.light, textAlign:'center', padding:'0 1rem' }}>{w.title}</div>
                <div style={{ fontFamily:D.display, fontSize:'0.72rem', color:C.muted }}>by @{w.user} · ❤️ {w.likes}</div>
                <button style={{ fontFamily:D.display, fontWeight:800, fontSize:'0.78rem', letterSpacing:'0.1em', textTransform:'uppercase', background:C.red, color:C.light, border:'none', padding:'0.4rem 1.2rem', cursor:'pointer', marginTop:'0.5rem' }}>↓ Download</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}