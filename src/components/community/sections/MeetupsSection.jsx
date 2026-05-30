import { useState } from 'react'

const C = { dark:'#2B2D42', light:'#EDF2F4', red:'#EF233C', black:'#1a1b26', card:'#23253a', muted:'#8D99AE' }
const D = { display:"'Barlow Condensed', sans-serif", body:"'Barlow', sans-serif" }

const MEETUPS = [
  { id:1, title:'Bangalore JDM Meetup', date:'Jun 7', month:'Jun', day:'7', time:'6:00 PM', location:'Cubbon Park, Bangalore', type:'Car Meet', attendees:84, spots:20, emoji:'🚗', color:'#EF233C', host:'TurboMike', tags:['JDM','Open to all','Free'] },
  { id:2, title:'KTM Track Day — Kari Speedway', date:'Jun 14', month:'Jun', day:'14', time:'7:00 AM', location:'Kari Motor Speedway, Coimbatore', type:'Track Day', attendees:32, spots:4, emoji:'🏁', color:'#f39c12', host:'RaiderKing', tags:['Track','KTM','₹2500 entry'] },
  { id:3, title:"JDM Concours d'Elegance", date:'Jun 21', month:'Jun', day:'21', time:'10:00 AM', location:'Palace Grounds, Bangalore', type:'Car Show', attendees:210, spots:999, emoji:'🏆', color:'#27ae60', host:'GarageGuru', tags:['Show','JDM','Free entry'] },
  { id:4, title:'Sunday Ghat Ride — Nandi Hills', date:'Jun 28', month:'Jun', day:'28', time:'5:30 AM', location:'Nandi Hills, Bangalore', type:'Group Ride', attendees:48, spots:12, emoji:'🏍️', color:'#a855f7', host:'NightRider', tags:['Bikes','Ghat roads','Free'] },
  { id:5, title:'Drag Night — BIEC', date:'Jul 5', month:'Jul', day:'5', time:'7:00 PM', location:'BIEC, Bangalore', type:'Drag Race', attendees:67, spots:30, emoji:'💨', color:'#3b82f6', host:'ZeroShift', tags:['Drag','All welcome','₹500 entry'] },
]

const TYPES = ['All','Car Meet','Track Day','Group Ride','Car Show','Drag Race']

export default function MeetupsSection() {
  const [activeType, setActiveType] = useState('All')
  const [joined, setJoined] = useState({})
  const filtered = MEETUPS.filter(m => activeType==='All' || m.type===activeType)

  return (
    <div style={{ padding:'1.5rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
        <div>
          <div style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:C.red, marginBottom:'0.25rem' }}>Community</div>
          <h2 style={{ fontFamily:D.display, fontSize:'2.5rem', fontWeight:900, color:C.light, lineHeight:1 }}>Meetups & Events</h2>
        </div>
        <button style={{ fontFamily:D.display, fontWeight:800, fontSize:'0.82rem', letterSpacing:'0.1em', textTransform:'uppercase', background:C.red, color:C.light, border:'none', padding:'0.7rem 1.5rem', cursor:'pointer' }}>+ Create Event</button>
      </div>

      <div style={{ display:'flex', gap:'0.4rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {TYPES.map(t => (
          <button key={t} onClick={() => setActiveType(t)}
            style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.78rem', letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.35rem 0.9rem', background: activeType===t ? C.red : 'none', border:`1px solid ${activeType===t ? C.red : 'rgba(141,153,174,0.2)'}`, color: activeType===t ? C.light : C.muted, cursor:'pointer', transition:'all 0.2s' }}>
            {t}
          </button>
        ))}
      </div>

      {/* Map placeholder */}
      <div style={{ height:180, background:C.card, border:'1px solid rgba(141,153,174,0.12)', marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.05, backgroundImage:'linear-gradient(rgba(141,153,174,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(141,153,174,0.5) 1px, transparent 1px)', backgroundSize:'30px 30px' }} />
        <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
          <div style={{ fontSize:'2rem', marginBottom:'0.4rem' }}>🗺️</div>
          <div style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:700, color:C.muted }}>{filtered.length} events near you</div>
          <div style={{ display:'flex', gap:'0.4rem', justifyContent:'center', marginTop:'0.75rem', flexWrap:'wrap' }}>
            {filtered.map(m => (
              <span key={m.id} style={{ fontFamily:D.display, fontSize:'0.62rem', fontWeight:700, padding:'0.15rem 0.5rem', background:`${m.color}22`, border:`1px solid ${m.color}44`, color:m.color }}>
                📍 {m.location.split(',')[0]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'1px', background:'rgba(141,153,174,0.1)' }}>
        {filtered.map(m => (
          <div key={m.id} style={{ background:C.card, padding:'1.5rem 2rem', display:'grid', gridTemplateColumns:'60px 1fr auto', gap:'1.5rem', alignItems:'center', borderLeft:'3px solid transparent', transition:'border-color 0.2s', cursor:'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderLeftColor=m.color}
            onMouseLeave={e => e.currentTarget.style.borderLeftColor='transparent'}>
            <div style={{ textAlign:'center', flexShrink:0 }}>
              <div style={{ fontFamily:D.display, fontSize:'1.8rem', fontWeight:900, color:m.color, lineHeight:1 }}>{m.day}</div>
              <div style={{ fontFamily:D.display, fontSize:'0.7rem', fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.1em' }}>{m.month}</div>
              <div style={{ fontSize:'1.5rem', marginTop:'0.25rem' }}>{m.emoji}</div>
            </div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.4rem', flexWrap:'wrap' }}>
                <span style={{ fontFamily:D.display, fontSize:'1.2rem', fontWeight:900, color:C.light }}>{m.title}</span>
                <span style={{ fontFamily:D.display, fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', padding:'0.15rem 0.5rem', background:`${m.color}22`, border:`1px solid ${m.color}44`, color:m.color }}>{m.type}</span>
              </div>
              <div style={{ display:'flex', gap:'1.5rem', marginBottom:'0.5rem', flexWrap:'wrap' }}>
                <span style={{ fontFamily:D.display, fontSize:'0.82rem', color:C.muted }}>📍 {m.location}</span>
                <span style={{ fontFamily:D.display, fontSize:'0.82rem', color:C.muted }}>🕐 {m.time}</span>
                <span style={{ fontFamily:D.display, fontSize:'0.82rem', color:C.muted }}>👤 {m.host}</span>
              </div>
              <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
                {m.tags.map(tag => (
                  <span key={tag} style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.1rem 0.5rem', background:'rgba(141,153,174,0.08)', border:'1px solid rgba(141,153,174,0.15)', color:C.muted }}>{tag}</span>
                ))}
              </div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontFamily:D.display, fontSize:'0.85rem', fontWeight:700, color:C.light, marginBottom:'0.25rem' }}>👥 {m.attendees} going</div>
              <div style={{ fontFamily:D.display, fontSize:'0.72rem', color: m.spots < 10 ? C.red : C.muted, marginBottom:'0.75rem' }}>
                {m.spots < 10 ? `⚠️ ${m.spots} spots left` : `${m.spots} spots left`}
              </div>
              <button onClick={() => setJoined(j => ({ ...j, [m.id]: !j[m.id] }))}
                style={{ fontFamily:D.display, fontWeight:800, fontSize:'0.82rem', letterSpacing:'0.1em', textTransform:'uppercase', background: joined[m.id] ? 'transparent' : m.color, color: joined[m.id] ? m.color : C.light, border:`1px solid ${m.color}`, padding:'0.5rem 1.2rem', cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap' }}>
                {joined[m.id] ? '✓ Joined' : 'Join Event'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}