import { useState } from 'react'

const C = { bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50', coral:'#EF8354', coralDim:'#d96a3a', text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0', border:'rgba(191,192,192,0.12)' }
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const WALLPAPERS = [
  { id:1, title:'Civic EK9 Track Session',     user:'TurboMike',  img:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80', tag:'JDM',   res:'4K', likes:892  },
  { id:2, title:'Duke 390 Sunset Silhouette',  user:'RaiderKing', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', tag:'Moto',  res:'8K', likes:1204 },
  { id:3, title:'GTR R35 Wet Track',           user:'GhostLap',   img:'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80', tag:'JDM',   res:'4K', likes:2341 },
  { id:4, title:'180SX Drift Smoke',           user:'DriftQueen', img:'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=800&q=80', tag:'Drift', res:'4K', likes:1876 },
  { id:5, title:'Supra A80 Night Shoot',       user:'NightRider', img:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80', tag:'JDM',   res:'6K', likes:3102 },
  { id:6, title:'Interceptor Mountain Pass',   user:'RoadKing',   img:'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80', tag:'Moto',  res:'4K', likes:956  },
  { id:7, title:'Type R FK8 Circuit',          user:'LapQueen',   img:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80', tag:'Honda', res:'4K', likes:1543 },
  { id:8, title:'Swift Sport at Night',        user:'ZeroShift',  img:'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=800&q=80', tag:'Indian',res:'4K', likes:724  },
]

const TAGS = ['All','JDM','Moto','Drift','Honda','Indian','4K','8K']

export default function WallpapersSection() {
  const [activeTag, setActiveTag] = useState('All')
  const [hovered, setHovered] = useState(null)
  const filtered = activeTag === 'All' ? WALLPAPERS : WALLPAPERS.filter(w => w.tag === activeTag || w.res === activeTag)

  return (
    <div style={{ padding:'2rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
        <div>
          <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:C.coral, marginBottom:'0.4rem' }}>Community</div>
          <h2 style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:700, color:C.text, lineHeight:1 }}>Wallpapers</h2>
        </div>
        <button style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.88rem', background:C.coral, color:'#fff', border:'none', borderRadius:10, padding:'0.65rem 1.4rem', cursor:'pointer', transition:'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
          onMouseLeave={e => e.currentTarget.style.background=C.coral}>
          + Upload
        </button>
      </div>

      <div style={{ display:'inline-flex', gap:'0.25rem', background:C.surface, padding:'0.3rem', borderRadius:12, marginBottom:'1.5rem' }}>
        {TAGS.map(tag => (
          <button key={tag} onClick={() => setActiveTag(tag)}
            style={{ fontFamily:D.body, fontSize:'0.82rem', fontWeight:600, padding:'0.5rem 1rem', borderRadius:9, background: activeTag===tag ? C.coral : 'transparent', color: activeTag===tag ? '#fff' : C.textMuted, border:'none', cursor:'pointer', transition:'all 0.2s' }}>
            {tag}
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))', gap:'1rem' }}>
        {filtered.map(w => (
          <div key={w.id} onMouseEnter={() => setHovered(w.id)} onMouseLeave={() => setHovered(null)}
            style={{ position:'relative', aspectRatio:'16/9', borderRadius:16, overflow:'hidden', cursor:'pointer', border:`1px solid ${hovered===w.id ? 'rgba(239,131,84,0.4)' : C.border}`, transition:'all 0.25s', transform: hovered===w.id ? 'scale(1.02)' : 'scale(1)', boxShadow: hovered===w.id ? '0 12px 32px rgba(0,0,0,0.4)' : 'none' }}>
            <img src={w.img} alt={w.title} style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} />
            <div style={{ position:'absolute', top:10, right:10, fontFamily:D.body, fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.12em', background:C.coral, color:'#fff', padding:'0.18rem 0.5rem', borderRadius:6 }}>{w.res}</div>
            <div style={{ position:'absolute', top:10, left:10, fontFamily:D.body, fontSize:'0.62rem', fontWeight:700, background:'rgba(31,34,48,0.75)', color:C.textSoft, padding:'0.18rem 0.5rem', borderRadius:6, backdropFilter:'blur(4px)' }}>{w.tag}</div>
            {hovered === w.id && (
              <div style={{ position:'absolute', inset:0, background:'rgba(31,34,48,0.85)', backdropFilter:'blur(4px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.6rem' }}>
                <div style={{ fontFamily:D.body, fontSize:'0.9rem', fontWeight:700, color:C.text, textAlign:'center', padding:'0 1rem' }}>{w.title}</div>
                <div style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.textMuted }}>by @{w.user} · ❤️ {w.likes.toLocaleString()}</div>
                <button style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.82rem', background:C.coral, color:'#fff', border:'none', borderRadius:9, padding:'0.5rem 1.25rem', cursor:'pointer', marginTop:'0.25rem' }}
                  onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
                  onMouseLeave={e => e.currentTarget.style.background=C.coral}>
                  ↓ Download
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}