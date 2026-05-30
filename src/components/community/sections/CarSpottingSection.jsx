import { useState } from 'react'

const C = { dark:'#2B2D42', light:'#EDF2F4', red:'#EF233C', black:'#1a1b26', card:'#23253a', muted:'#8D99AE' }
const D = { display:"'Barlow Condensed', sans-serif", body:"'Barlow', sans-serif" }

const SPOTS = [
  { id:1, user:'GhostLap', avatar:'G', color:'#8D99AE', car:'Ferrari 488 Pista', location:'MG Road, Bangalore', time:'10m ago', rarity:'Rare', likes:234 },
  { id:2, user:'LapQueen', avatar:'L', color:'#a855f7', car:'Lamborghini Urus', location:'Vittal Mallya Rd, Bangalore', time:'45m ago', rarity:'Very Rare', likes:512 },
  { id:3, user:'TurboMike', avatar:'T', color:'#f39c12', car:'Porsche 911 GT3', location:'Indiranagar, Bangalore', time:'2h ago', rarity:'Rare', likes:389 },
  { id:4, user:'DriftQueen', avatar:'D', color:'#27ae60', car:'Honda Civic Type R FK8', location:'Koramangala, Bangalore', time:'4h ago', rarity:'Uncommon', likes:156 },
  { id:5, user:'RaiderKing', avatar:'R', color:'#EF233C', car:'BMW M3 Competition', location:'Whitefield, Bangalore', time:'6h ago', rarity:'Uncommon', likes:198 },
  { id:6, user:'ZeroShift', avatar:'Z', color:'#3b82f6', car:'Audi RS6 Avant', location:'HSR Layout, Bangalore', time:'1d ago', rarity:'Rare', likes:287 },
]

const rarityColors = { 'Very Rare':'#f39c12', Rare:'#EF233C', Uncommon:'#3b82f6', Common:'#8D99AE' }

export default function CarSpottingSection() {
  const [liked, setLiked] = useState({})
  const [view, setView] = useState('grid')

  return (
    <div style={{ padding:'1.5rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
        <div>
          <div style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:C.red, marginBottom:'0.25rem' }}>Community</div>
          <h2 style={{ fontFamily:D.display, fontSize:'2.5rem', fontWeight:900, color:C.light, lineHeight:1 }}>Car Spotting</h2>
        </div>
        <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
          {[['⊞','grid'],['☰','list']].map(([icon,mode]) => (
            <button key={mode} onClick={() => setView(mode)}
              style={{ width:36, height:36, background: view===mode ? C.red : C.card, border:'none', cursor:'pointer', fontSize:'1rem', color:C.light }}>
              {icon}
            </button>
          ))}
          <button style={{ fontFamily:D.display, fontWeight:800, fontSize:'0.82rem', letterSpacing:'0.1em', textTransform:'uppercase', background:C.red, color:C.light, border:'none', padding:'0.6rem 1.4rem', cursor:'pointer' }}>
            📸 Submit Spot
          </button>
        </div>
      </div>

      <div style={{ display:'flex', gap:'1rem', marginBottom:'1.5rem', alignItems:'center', flexWrap:'wrap' }}>
        <span style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:C.muted }}>Rarity:</span>
        {Object.entries(rarityColors).map(([label, color]) => (
          <span key={label} style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontFamily:D.display, fontSize:'0.72rem', fontWeight:700, color }}>
            <span style={{ width:8, height:8, borderRadius:'50%', background:color, display:'inline-block' }} /> {label}
          </span>
        ))}
      </div>

      {view === 'grid' ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1px', background:'rgba(141,153,174,0.1)' }}>
          {SPOTS.map(spot => (
            <div key={spot.id} style={{ background:C.card, borderTop:`3px solid ${rarityColors[spot.rarity]}`, transition:'background 0.2s', cursor:'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background='#2d3050'}
              onMouseLeave={e => e.currentTarget.style.background=C.card}>
              <div style={{ height:140, background:'rgba(141,153,174,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3.5rem', position:'relative' }}>
                🚗
                <div style={{ position:'absolute', top:8, right:8, fontFamily:D.display, fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', padding:'0.15rem 0.5rem', background:`${rarityColors[spot.rarity]}22`, border:`1px solid ${rarityColors[spot.rarity]}44`, color:rarityColors[spot.rarity] }}>{spot.rarity}</div>
              </div>
              <div style={{ padding:'1rem' }}>
                <div style={{ fontFamily:D.display, fontWeight:900, fontSize:'1.05rem', color:C.light, marginBottom:'0.3rem' }}>{spot.car}</div>
                <div style={{ fontFamily:D.display, fontSize:'0.75rem', color:C.muted, marginBottom:'0.75rem' }}>📍 {spot.location} · {spot.time}</div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                  <div style={{ width:26, height:26, borderRadius:'50%', background:spot.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:900, fontSize:'0.7rem', color:'#fff' }}>{spot.avatar}</div>
                  <span style={{ fontFamily:D.display, fontSize:'0.78rem', color:C.muted, flex:1 }}>{spot.user}</span>
                  <button onClick={() => setLiked(l => ({ ...l, [spot.id]: !l[spot.id] }))}
                    style={{ background:'none', border:'none', cursor:'pointer', fontFamily:D.display, fontSize:'0.82rem', fontWeight:700, color: liked[spot.id] ? C.red : C.muted }}>
                    {liked[spot.id] ? '❤️' : '🤍'} {spot.likes + (liked[spot.id] ? 1 : 0)}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1px', background:'rgba(141,153,174,0.1)' }}>
          {SPOTS.map(spot => (
            <div key={spot.id} style={{ background:C.card, padding:'1.2rem 1.5rem', display:'flex', gap:'1.2rem', alignItems:'center', borderLeft:`3px solid ${rarityColors[spot.rarity]}`, cursor:'pointer', transition:'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background='#2d3050'}
              onMouseLeave={e => e.currentTarget.style.background=C.card}>
              <div style={{ width:52, height:52, background:'rgba(141,153,174,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', flexShrink:0 }}>🚗</div>
              <div style={{ width:34, height:34, borderRadius:'50%', background:spot.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:900, fontSize:'0.85rem', color:'#fff', flexShrink:0 }}>{spot.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.2rem' }}>
                  <span style={{ fontFamily:D.display, fontWeight:900, fontSize:'1rem', color:C.light }}>{spot.car}</span>
                  <span style={{ fontFamily:D.display, fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:rarityColors[spot.rarity] }}>{spot.rarity}</span>
                </div>
                <div style={{ fontFamily:D.display, fontSize:'0.78rem', color:C.muted }}>📍 {spot.location} · {spot.user} · {spot.time}</div>
              </div>
              <button onClick={() => setLiked(l => ({ ...l, [spot.id]: !l[spot.id] }))}
                style={{ background:'none', border:'none', cursor:'pointer', fontFamily:D.display, fontSize:'0.88rem', fontWeight:700, color: liked[spot.id] ? C.red : C.muted, flexShrink:0 }}>
                {liked[spot.id] ? '❤️' : '🤍'} {spot.likes + (liked[spot.id] ? 1 : 0)}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}