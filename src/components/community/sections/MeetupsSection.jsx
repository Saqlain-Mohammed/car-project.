import { useState } from 'react'

const C = { bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50', coral:'#EF8354', coralDim:'#d96a3a', text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0', border:'rgba(191,192,192,0.12)', green:'#5eaa7e' }
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const MEETUPS = [
  { id:1, title:'Bangalore JDM Meetup', day:'7', month:'Jun', time:'6:00 PM', location:'Cubbon Park, Bangalore', type:'Car Meet', attendees:84, spots:20, emoji:'🚗', color:'#EF8354', host:'TurboMike', tags:['JDM','Open to all','Free'] },
  { id:2, title:'KTM Track Day — Kari Speedway', day:'14', month:'Jun', time:'7:00 AM', location:'Kari Motor Speedway, Coimbatore', type:'Track Day', attendees:32, spots:4, emoji:'🏁', color:'#f5a623', host:'RaiderKing', tags:['Track','KTM','₹2500'] },
  { id:3, title:"JDM Concours d'Elegance", day:'21', month:'Jun', time:'10:00 AM', location:'Palace Grounds, Bangalore', type:'Car Show', attendees:210, spots:999, emoji:'🏆', color:'#5eaa7e', host:'GarageGuru', tags:['Show','JDM','Free'] },
  { id:4, title:'Sunday Ghat Ride — Nandi Hills', day:'28', month:'Jun', time:'5:30 AM', location:'Nandi Hills, Bangalore', type:'Group Ride', attendees:48, spots:12, emoji:'🏍️', color:'#a855f7', host:'NightRider', tags:['Bikes','Ghats','Free'] },
  { id:5, title:'Drag Night — BIEC', day:'5', month:'Jul', time:'7:00 PM', location:'BIEC, Bangalore', type:'Drag Race', attendees:67, spots:30, emoji:'💨', color:'#3b82f6', host:'ZeroShift', tags:['Drag','All welcome','₹500'] },
]

const TYPES = ['All','Car Meet','Track Day','Group Ride','Car Show','Drag Race']

export default function MeetupsSection() {
  const [activeType, setActiveType] = useState('All')
  const [joined, setJoined] = useState({})
  const filtered = MEETUPS.filter(m => activeType==='All' || m.type===activeType)

  return (
    <div style={{ padding:'2rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
        <div>
          <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:C.coral, marginBottom:'0.4rem' }}>Community</div>
          <h2 style={{ fontFamily:D.display, fontSize:'2.5rem', fontWeight:700, color:C.text, lineHeight:1 }}>Meetups & Events</h2>
        </div>
        <button style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', background:C.coral, color:'#fff', border:'none', borderRadius:12, padding:'0.75rem 1.5rem', cursor:'pointer', transition:'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
          onMouseLeave={e => e.currentTarget.style.background=C.coral}>+ Create Event</button>
      </div>

      <div style={{ display:'inline-flex', gap:'0.25rem', background:C.surface, padding:'0.3rem', borderRadius:12, marginBottom:'1.5rem' }}>
        {TYPES.map(t => (
          <button key={t} onClick={() => setActiveType(t)}
            style={{ fontFamily:D.body, fontSize:'0.82rem', fontWeight:600, padding:'0.5rem 1rem', borderRadius:9, background: activeType===t ? C.coral : 'transparent', color: activeType===t ? '#fff' : C.textMuted, border:'none', cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap' }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ height:180, background:C.surface, borderRadius:20, marginBottom:'1.5rem', display:'flex', alignItems:'center', justifyContent:'center', border:`1px solid ${C.border}`, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, opacity:0.04, backgroundImage:'linear-gradient(rgba(191,192,192,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(191,192,192,0.8) 1px, transparent 1px)', backgroundSize:'30px 30px' }} />
        <div style={{ textAlign:'center', position:'relative', zIndex:1 }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'0.5rem' }}>🗺️</div>
          <div style={{ fontFamily:D.body, fontSize:'1rem', fontWeight:600, color:C.textMuted, marginBottom:'0.5rem' }}>{filtered.length} events near you</div>
          <div style={{ display:'flex', gap:'0.5rem', justifyContent:'center', flexWrap:'wrap' }}>
            {filtered.map(m => <span key={m.id} style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:600, padding:'0.2rem 0.6rem', background:`${m.color}18`, border:`1px solid ${m.color}33`, borderRadius:6, color:m.color }}>📍 {m.location.split(',')[0]}</span>)}
          </div>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        {filtered.map(m => (
          <div key={m.id} style={{ background:C.surface, borderRadius:18, padding:'1.5rem 2rem', display:'grid', gridTemplateColumns:'80px 1fr auto', gap:'1.5rem', alignItems:'center', border:`1px solid ${C.border}`, transition:'all 0.2s', cursor:'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.background=C.surface2; e.currentTarget.style.borderColor=`${m.color}33` }}
            onMouseLeave={e => { e.currentTarget.style.background=C.surface; e.currentTarget.style.borderColor=C.border }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ width:60, height:60, borderRadius:16, background:`${m.color}18`, border:`1px solid ${m.color}33`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', margin:'0 auto 0.4rem' }}>
                <div style={{ fontFamily:D.display, fontSize:'1.5rem', fontWeight:700, color:m.color, lineHeight:1 }}>{m.day}</div>
                <div style={{ fontFamily:D.body, fontSize:'0.65rem', fontWeight:700, color:C.textMuted, textTransform:'uppercase', letterSpacing:'0.08em' }}>{m.month}</div>
              </div>
              <div style={{ fontSize:'1.5rem' }}>{m.emoji}</div>
            </div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.5rem', flexWrap:'wrap' }}>
                <span style={{ fontFamily:D.body, fontSize:'1.05rem', fontWeight:700, color:C.text }}>{m.title}</span>
                <span style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.18rem 0.55rem', background:`${m.color}18`, border:`1px solid ${m.color}33`, borderRadius:6, color:m.color }}>{m.type}</span>
              </div>
              <div style={{ display:'flex', gap:'1.25rem', marginBottom:'0.5rem', flexWrap:'wrap' }}>
                <span style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textMuted }}>📍 {m.location}</span>
                <span style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textMuted }}>🕐 {m.time}</span>
                <span style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textMuted }}>👤 {m.host}</span>
              </div>
              <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap' }}>
                {m.tags.map(tag => <span key={tag} style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:500, padding:'0.15rem 0.55rem', background:'rgba(191,192,192,0.06)', border:`1px solid ${C.border}`, borderRadius:6, color:C.textMuted }}>{tag}</span>)}
              </div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontFamily:D.body, fontSize:'0.88rem', fontWeight:600, color:C.text, marginBottom:'0.25rem' }}>👥 {m.attendees} going</div>
              <div style={{ fontFamily:D.body, fontSize:'0.75rem', color: m.spots < 10 ? '#ef4444' : C.textMuted, marginBottom:'0.85rem' }}>
                {m.spots < 10 ? `⚠️ ${m.spots} spots left` : `${m.spots} spots left`}
              </div>
              <button onClick={() => setJoined(j => ({ ...j, [m.id]: !j[m.id] }))}
                style={{ fontFamily:D.body, fontWeight:700, fontSize:'0.85rem', background: joined[m.id] ? 'transparent' : m.color, color: joined[m.id] ? m.color : '#fff', border:`1px solid ${m.color}`, borderRadius:10, padding:'0.6rem 1.25rem', cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap' }}>
                {joined[m.id] ? '✓ Joined' : 'Join Event'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}