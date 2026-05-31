import { useState } from 'react'

const C = { bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50', coral:'#EF8354', coralDim:'#d96a3a', text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0', border:'rgba(191,192,192,0.12)', green:'#5eaa7e', amber:'#f5a623' }
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const SPOTS = [
  { id:1, user:'GhostLap',   avatar:'G', color:'#8b90a0', car:'Ferrari 488 Pista',      location:'MG Road, Bangalore',        time:'10m ago', rarity:'Rare',      likes:234, img:'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80' },
  { id:2, user:'LapQueen',   avatar:'L', color:'#a855f7', car:'Lamborghini Urus',        location:'Vittal Mallya Rd',           time:'45m ago', rarity:'Very Rare', likes:512, img:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80' },
  { id:3, user:'TurboMike',  avatar:'T', color:'#f5a623', car:'Porsche 911 GT3',         location:'Indiranagar, Bangalore',     time:'2h ago',  rarity:'Rare',      likes:389, img:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80' },
  { id:4, user:'DriftQueen', avatar:'D', color:'#5eaa7e', car:'Honda Civic Type R FK8',  location:'Koramangala',               time:'4h ago',  rarity:'Uncommon',  likes:156, img:'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80' },
  { id:5, user:'RaiderKing', avatar:'R', color:'#EF8354', car:'BMW M3 Competition',      location:'Whitefield, Bangalore',      time:'6h ago',  rarity:'Uncommon',  likes:198, img:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80' },
  { id:6, user:'ZeroShift',  avatar:'Z', color:'#3b82f6', car:'Audi RS6 Avant',          location:'HSR Layout, Bangalore',      time:'1d ago',  rarity:'Rare',      likes:287, img:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80' },
  { id:7, user:'NightRider', avatar:'N', color:'#a855f7', car:'Toyota GR86',             location:'Hebbal, Bangalore',          time:'1d ago',  rarity:'Uncommon',  likes:143, img:'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=600&q=80' },
  { id:8, user:'ApexHunter', avatar:'A', color:'#5eaa7e', car:'Nissan GT-R R35',         location:'Airport Road, Bangalore',    time:'2d ago',  rarity:'Very Rare', likes:621, img:'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=600&q=80' },
]

const rarityColors = { 'Very Rare':'#f5a623', Rare:'#EF8354', Uncommon:'#3b82f6', Common:'#8b90a0' }

export default function CarSpottingSection() {
  const [liked, setLiked] = useState({})
  const [view, setView] = useState('grid')
  const [hovered, setHovered] = useState(null)

  return (
    <div style={{ padding:'2rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
        <div>
          <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:C.coral, marginBottom:'0.4rem' }}>Community</div>
          <h2 style={{ fontFamily:D.display, fontSize:'2.5rem', fontWeight:700, color:C.text, lineHeight:1 }}>Car Spotting</h2>
        </div>
        <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
          {[['⊞','grid'],['☰','list']].map(([icon,mode]) => (
            <button key={mode} onClick={() => setView(mode)}
              style={{ width:38, height:38, borderRadius:10, background: view===mode ? C.coral : C.surface, border:`1px solid ${view===mode ? C.coral : C.border}`, cursor:'pointer', fontSize:'1rem', color: view===mode ? '#fff' : C.textMuted, transition:'all 0.2s' }}>
              {icon}
            </button>
          ))}
          <button style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.88rem', background:C.coral, color:'#fff', border:'none', borderRadius:12, padding:'0.65rem 1.4rem', cursor:'pointer', transition:'background 0.2s', whiteSpace:'nowrap' }}
            onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
            onMouseLeave={e => e.currentTarget.style.background=C.coral}>
            📸 Submit Spot
          </button>
        </div>
      </div>

      <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap', alignItems:'center' }}>
        <span style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.textMuted }}>Rarity:</span>
        {Object.entries(rarityColors).map(([label, color]) => (
          <span key={label} style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontFamily:D.body, fontSize:'0.78rem', fontWeight:600, color }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:color, display:'inline-block' }} /> {label}
          </span>
        ))}
      </div>

      {view === 'grid' ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
          {SPOTS.map(spot => (
            <div key={spot.id} onMouseEnter={() => setHovered(spot.id)} onMouseLeave={() => setHovered(null)}
              style={{ background:C.surface, borderRadius:18, overflow:'hidden', border:`1px solid ${hovered===spot.id ? `${rarityColors[spot.rarity]}44` : C.border}`, transition:'all 0.25s', cursor:'pointer', transform: hovered===spot.id ? 'translateY(-3px)' : 'translateY(0)' }}>
              <div style={{ height:160, position:'relative', overflow:'hidden' }}>
                <img src={spot.img} alt={spot.car} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s' }} onMouseEnter={e => e.currentTarget.style.transform='scale(1.06)'} onMouseLeave={e => e.currentTarget.style.transform='scale(1)'} />
                <div style={{ position:'absolute', top:10, right:10, fontFamily:D.body, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.18rem 0.55rem', background:`${rarityColors[spot.rarity]}22`, border:`1px solid ${rarityColors[spot.rarity]}44`, borderRadius:6, color:rarityColors[spot.rarity] }}>{spot.rarity}</div>
              </div>
              <div style={{ padding:'1.25rem' }}>
                <div style={{ fontFamily:D.body, fontSize:'1rem', fontWeight:700, color:C.text, marginBottom:'0.3rem' }}>{spot.car}</div>
                <div style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted, marginBottom:'1rem' }}>📍 {spot.location} · {spot.time}</div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background:spot.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.72rem', color:'#fff' }}>{spot.avatar}</div>
                  <span style={{ fontFamily:D.body, fontSize:'0.8rem', color:C.textMuted, flex:1 }}>{spot.user}</span>
                  <button onClick={() => setLiked(l => ({ ...l, [spot.id]: !l[spot.id] }))}
                    style={{ display:'flex', alignItems:'center', gap:'0.3rem', padding:'0.35rem 0.75rem', borderRadius:8, background: liked[spot.id] ? 'rgba(239,131,84,0.12)' : 'transparent', border:`1px solid ${liked[spot.id] ? 'rgba(239,131,84,0.3)' : 'transparent'}`, cursor:'pointer', fontFamily:D.body, fontSize:'0.82rem', fontWeight:600, color: liked[spot.id] ? C.coral : C.textMuted, transition:'all 0.2s' }}>
                    {liked[spot.id] ? '❤️' : '🤍'} {spot.likes + (liked[spot.id] ? 1 : 0)}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {SPOTS.map(spot => (
            <div key={spot.id} style={{ background:C.surface, borderRadius:14, padding:'1.25rem 1.5rem', display:'flex', gap:'1.25rem', alignItems:'center', cursor:'pointer', border:`1px solid ${C.border}`, transition:'all 0.2s', borderLeft:`3px solid ${rarityColors[spot.rarity]}` }}
              onMouseEnter={e => e.currentTarget.style.background=C.surface2}
              onMouseLeave={e => e.currentTarget.style.background=C.surface}>
              <div style={{ width:56, height:56, borderRadius:14, overflow:'hidden', flexShrink:0 }}><img src={spot.img} alt={spot.car} style={{ width:'100%', height:'100%', objectFit:'cover' }} /></div>
              <div style={{ width:36, height:36, borderRadius:'50%', background:spot.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.9rem', color:'#fff', flexShrink:0 }}>{spot.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.2rem' }}>
                  <span style={{ fontFamily:D.body, fontSize:'1rem', fontWeight:700, color:C.text }}>{spot.car}</span>
                  <span style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:rarityColors[spot.rarity] }}>{spot.rarity}</span>
                </div>
                <div style={{ fontFamily:D.body, fontSize:'0.8rem', color:C.textMuted }}>📍 {spot.location} · {spot.user} · {spot.time}</div>
              </div>
              <button onClick={() => setLiked(l => ({ ...l, [spot.id]: !l[spot.id] }))}
                style={{ display:'flex', alignItems:'center', gap:'0.3rem', padding:'0.5rem 0.85rem', borderRadius:9, background: liked[spot.id] ? 'rgba(239,131,84,0.12)' : 'transparent', border:`1px solid ${liked[spot.id] ? 'rgba(239,131,84,0.3)' : 'transparent'}`, cursor:'pointer', fontFamily:D.body, fontSize:'0.88rem', fontWeight:600, color: liked[spot.id] ? C.coral : C.textMuted, transition:'all 0.2s', flexShrink:0 }}>
                {liked[spot.id] ? '❤️' : '🤍'} {spot.likes + (liked[spot.id] ? 1 : 0)}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}