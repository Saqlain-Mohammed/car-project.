import { useState } from 'react'

const C = { dark:'#2B2D42', light:'#EDF2F4', red:'#EF233C', black:'#1a1b26', card:'#23253a', muted:'#8D99AE' }
const D = { display:"'Barlow Condensed', sans-serif", body:"'Barlow', sans-serif" }

const CREWS = [
  { id:1, name:'Bangalore JDM Crew', tag:'BJP_JDM', emoji:'🏎️', color:'#EF233C', members:147, city:'Bangalore', type:'JDM', desc:"Karnataka's biggest JDM community. Weekly meets, track days, and build showcases.", verified:true },
  { id:2, name:'Deccan Drift Club', tag:'DDC_Official', emoji:'💨', color:'#f39c12', members:89, city:'Hyderabad', type:'Drift', desc:'Dedicated to the art of sliding. Training sessions, events, and drift builds.', verified:true },
  { id:3, name:'South India Bikers', tag:'SIB_Crew', emoji:'🏍️', color:'#27ae60', members:312, city:'Pan-India', type:'Bikes', desc:'Connecting bikers across South India. Group rides, touring, and community events.', verified:true },
  { id:4, name:'Track Day Addicts', tag:'TDA_India', emoji:'🏁', color:'#3b82f6', members:56, city:'Coimbatore', type:'Track', desc:"If it has a timing board, we're there. Track day coordination and coaching.", verified:false },
  { id:5, name:'Night Riders Bangalore', tag:'NRB_Official', emoji:'🌙', color:'#a855f7', members:203, city:'Bangalore', type:'Night Drives', desc:'Late night convoy runs across Bangalore. Sunset drives and city lights photography.', verified:false },
]

const TYPES = ['All','JDM','Drift','Bikes','Track','Night Drives']

export default function CrewsSection() {
  const [activeType, setActiveType] = useState('All')
  const [memberships, setMemberships] = useState({ 2:true, 5:true })
  const [showCreate, setShowCreate] = useState(false)
  const filtered = CREWS.filter(c => activeType==='All' || c.type===activeType)

  return (
    <div style={{ padding:'1.5rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
        <div>
          <div style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:C.red, marginBottom:'0.25rem' }}>Community</div>
          <h2 style={{ fontFamily:D.display, fontSize:'2.5rem', fontWeight:900, color:C.light, lineHeight:1 }}>Crews & Clubs</h2>
        </div>
        <button onClick={() => setShowCreate(!showCreate)}
          style={{ fontFamily:D.display, fontWeight:800, fontSize:'0.82rem', letterSpacing:'0.1em', textTransform:'uppercase', background:C.red, color:C.light, border:'none', padding:'0.7rem 1.5rem', cursor:'pointer' }}>
          + Create Crew
        </button>
      </div>

      {showCreate && (
        <div style={{ background:C.card, border:`1px solid ${C.red}`, borderTop:`3px solid ${C.red}`, padding:'1.5rem', marginBottom:'1.5rem' }}>
          <div style={{ fontFamily:D.display, fontSize:'1.2rem', fontWeight:900, color:C.light, marginBottom:'1rem' }}>Start Your Crew</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
            {[['Crew Name','e.g. Bangalore JDM Crew'],['City / Region','e.g. Bangalore, KA']].map(([label, ph]) => (
              <div key={label}>
                <div style={{ fontFamily:D.display, fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:C.muted, marginBottom:'0.4rem' }}>{label}</div>
                <input placeholder={ph} style={{ width:'100%', background:'rgba(141,153,174,0.06)', border:'1px solid rgba(141,153,174,0.15)', padding:'0.6rem 0.9rem', color:C.light, fontFamily:D.body, fontSize:'0.9rem', outline:'none' }}
                  onFocus={e => e.target.style.borderColor=C.red} onBlur={e => e.target.style.borderColor='rgba(141,153,174,0.15)'} />
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'0.75rem' }}>
            <button style={{ fontFamily:D.display, fontWeight:800, fontSize:'0.82rem', letterSpacing:'0.1em', textTransform:'uppercase', background:C.red, color:C.light, border:'none', padding:'0.6rem 1.4rem', cursor:'pointer' }}>Create</button>
            <button onClick={() => setShowCreate(false)} style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.82rem', background:'none', border:'1px solid rgba(141,153,174,0.2)', color:C.muted, padding:'0.6rem 1.4rem', cursor:'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* My Crews */}
      {Object.keys(memberships).length > 0 && (
        <div style={{ marginBottom:'1.5rem' }}>
          <div style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:C.muted, marginBottom:'0.75rem' }}>My Crews</div>
          <div style={{ display:'flex', gap:'1px', background:'rgba(141,153,174,0.1)', flexWrap:'wrap' }}>
            {CREWS.filter(c => memberships[c.id]).map(c => (
              <div key={c.id} style={{ flex:1, minWidth:220, background:C.card, padding:'1rem 1.5rem', borderTop:`3px solid ${c.color}`, display:'flex', alignItems:'center', gap:'1rem' }}>
                <span style={{ fontSize:'1.8rem' }}>{c.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:D.display, fontWeight:700, fontSize:'1rem', color:C.light }}>{c.name}</div>
                  <div style={{ fontFamily:D.display, fontSize:'0.72rem', color:c.color }}>👥 {c.members} · {c.city}</div>
                </div>
                <button style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.72rem', background:'none', border:`1px solid ${c.color}`, color:c.color, padding:'0.3rem 0.75rem', cursor:'pointer' }}>Chat</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display:'flex', gap:'0.4rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {TYPES.map(t => (
          <button key={t} onClick={() => setActiveType(t)}
            style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.78rem', letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.35rem 0.9rem', background: activeType===t ? C.red : 'none', border:`1px solid ${activeType===t ? C.red : 'rgba(141,153,174,0.2)'}`, color: activeType===t ? C.light : C.muted, cursor:'pointer' }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1px', background:'rgba(141,153,174,0.1)' }}>
        {filtered.map(crew => (
          <div key={crew.id} style={{ background:C.card, padding:'1.5rem', borderTop:`3px solid ${crew.color}`, transition:'background 0.2s', cursor:'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background='#2d3050'}
            onMouseLeave={e => e.currentTarget.style.background=C.card}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:'1rem', marginBottom:'1rem' }}>
              <div style={{ width:50, height:50, background:`${crew.color}22`, border:`1px solid ${crew.color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', flexShrink:0 }}>{crew.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.2rem' }}>
                  <span style={{ fontFamily:D.display, fontWeight:900, fontSize:'1.05rem', color:C.light }}>{crew.name}</span>
                  {crew.verified && <span style={{ fontFamily:D.display, fontSize:'0.6rem', fontWeight:700, color:'#27ae60', border:'1px solid #27ae60', padding:'0.1rem 0.35rem' }}>✓</span>}
                </div>
                <div style={{ fontFamily:D.display, fontSize:'0.72rem', color:crew.color }}>@{crew.tag}</div>
              </div>
            </div>
            <p style={{ fontFamily:D.body, fontSize:'0.85rem', lineHeight:1.6, color:C.muted, marginBottom:'1rem' }}>{crew.desc}</p>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', gap:'1rem' }}>
                <span style={{ fontFamily:D.display, fontSize:'0.82rem', color:C.light }}>👥 {crew.members}</span>
                <span style={{ fontFamily:D.display, fontSize:'0.82rem', color:C.muted }}>📍 {crew.city}</span>
              </div>
              <button onClick={() => setMemberships(m => ({ ...m, [crew.id]: !m[crew.id] }))}
                style={{ fontFamily:D.display, fontWeight:800, fontSize:'0.78rem', letterSpacing:'0.1em', textTransform:'uppercase', background: memberships[crew.id] ? 'transparent' : crew.color, color: memberships[crew.id] ? crew.color : C.light, border:`1px solid ${crew.color}`, padding:'0.35rem 1rem', cursor:'pointer', transition:'all 0.2s' }}>
                {memberships[crew.id] ? '✓ Joined' : 'Join'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}