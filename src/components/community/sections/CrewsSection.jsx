import { useState } from 'react'
import { X, Trophy, Users, MapPin, Shield } from 'lucide-react'

const C = { bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50', coral:'#EF8354', coralDim:'#d96a3a', text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0', border:'rgba(191,192,192,0.12)', green:'#5eaa7e' }
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const CREW_DETAILS = {
  1: { achievements:['200+ members milestone','Best JDM Crew 2024','Annual Concours Winner'], topMembers:['TurboMike','GhostLap','DriftQueen','LapQueen'], tags:['#JDM','#Karnataka','#WeeklyMeets','#TrackDays','#OpenToAll'], founded:'March 2021', events:47 },
  2: { achievements:['Regional Drift Champions 2023','50+ Training Sessions','Official ISDC Partner'], topMembers:['DriftQueen','ZeroShift','IronBlock','ApexHunter'], tags:['#Drift','#Hyderabad','#Training','#Competitive'], founded:'August 2022', events:23 },
  3: { achievements:['Largest South India Bike Community','10,000km Group Ride','Pan-India Rally Winner'], topMembers:['RaiderKing','NightRider','RoadKing','ApexHunter'], tags:['#Bikes','#SouthIndia','#Touring','#Camaraderie'], founded:'January 2020', events:89 },
  4: { achievements:['Kari Track Day Partners','25+ Track Sessions','Fastest Lap Board Members'], topMembers:['ApexHunter','TurboMike','GhostLap'], tags:['#Track','#Timing','#Motorsport','#Coimbatore'], founded:'June 2022', events:31 },
  5: { achievements:['Best Night Drive Community 2023','1000km Night Coverage','City Lights Photography Award'], topMembers:['NightRider','ZeroShift','IronBlock'], tags:['#NightDrives','#Bangalore','#Photography','#ConvoyRuns'], founded:'November 2021', events:18 },
}

const CREWS = [
  { id:1, name:'Bangalore JDM Crew', tag:'BJP_JDM', emoji:'🏎️', color:'#EF8354', members:147, city:'Bangalore', type:'JDM', desc:"Karnataka's biggest JDM community. Weekly meets, track days, and build showcases.", verified:true },
  { id:2, name:'Deccan Drift Club', tag:'DDC_Official', emoji:'💨', color:'#f5a623', members:89, city:'Hyderabad', type:'Drift', desc:'Dedicated to the art of sliding. Training sessions, events, and drift builds.', verified:true },
  { id:3, name:'South India Bikers', tag:'SIB_Crew', emoji:'🏍️', color:'#5eaa7e', members:312, city:'Pan-India', type:'Bikes', desc:'Connecting bikers across South India. Group rides, touring, and community events.', verified:true },
  { id:4, name:'Track Day Addicts', tag:'TDA_India', emoji:'🏁', color:'#3b82f6', members:56, city:'Coimbatore', type:'Track', desc:"If it has a timing board, we're there. Track day coordination and coaching.", verified:false },
  { id:5, name:'Night Riders Bangalore', tag:'NRB_Official', emoji:'🌙', color:'#a855f7', members:203, city:'Bangalore', type:'Night Drives', desc:'Late night convoy runs across Bangalore. Sunset drives and city lights photography.', verified:false },
]

const TYPES = ['All','JDM','Drift','Bikes','Track','Night Drives']

function CrewDetailModal({ crew, onClose, memberships, setMemberships }) {
  const d = CREW_DETAILS[crew.id] || { achievements:[], topMembers:[], tags:[], founded:'—', events:0 }
  return (
    <div style={{ position:'fixed', inset:0, zIndex:600, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(8,10,18,0.88)', backdropFilter:'blur(8px)' }} onClick={onClose} />
      <div style={{ position:'relative', zIndex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:22, padding:'2rem', width:'100%', maxWidth:560, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 32px 80px rgba(0,0,0,0.6)' }}>
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16, width:32, height:32, borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, cursor:'pointer', color:C.textMuted, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <X size={15} />
        </button>

        {/* Header */}
        <div style={{ height:4, background:`linear-gradient(to right, ${crew.color}, ${crew.color}44)`, borderRadius:2, marginBottom:'1.5rem' }} />
        <div style={{ display:'flex', gap:'1rem', alignItems:'flex-start', marginBottom:'1.5rem' }}>
          <div style={{ width:60, height:60, background:`${crew.color}18`, border:`1px solid ${crew.color}33`, borderRadius:16, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', flexShrink:0 }}>{crew.emoji}</div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.2rem' }}>
              <span style={{ fontFamily:D.display, fontSize:'1.35rem', fontWeight:700, color:C.text }}>{crew.name}</span>
              {crew.verified && <Shield size={14} color={C.green} />}
            </div>
            <div style={{ fontFamily:D.body, fontSize:'0.78rem', color:crew.color, marginBottom:'0.4rem' }}>@{crew.tag}</div>
            <div style={{ display:'flex', gap:'1.25rem' }}>
              {[[crew.members,'Members'],[d.events,'Events']].map(([v,l]) => (
                <div key={l}>
                  <span style={{ fontFamily:D.display, fontSize:'1.1rem', fontWeight:700, color:C.text }}>{v} </span>
                  <span style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted }}>{l}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p style={{ fontFamily:D.body, fontSize:'0.88rem', color:C.textMuted, lineHeight:1.65, marginBottom:'1.5rem' }}>{crew.desc}</p>

        {/* Tags */}
        <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
          {d.tags.map(t => <span key={t} style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:600, padding:'0.22rem 0.65rem', borderRadius:20, background:`${crew.color}18`, color:crew.color, border:`1px solid ${crew.color}33` }}>{t}</span>)}
        </div>

        {/* Top members */}
        <div style={{ marginBottom:'1.5rem' }}>
          <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.textMuted, marginBottom:'0.75rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <Users size={13} /> Core Members
          </div>
          <div style={{ display:'flex', gap:'0.6rem', flexWrap:'wrap' }}>
            {d.topMembers.map((m, i) => (
              <div key={m} style={{ display:'flex', alignItems:'center', gap:'0.45rem', background:C.surface2, borderRadius:20, padding:'0.3rem 0.75rem 0.3rem 0.35rem', border:`1px solid ${C.border}` }}>
                <div style={{ width:22, height:22, borderRadius:'50%', background:crew.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.6rem', color:'#fff' }}>{m[0]}</div>
                <span style={{ fontFamily:D.body, fontSize:'0.78rem', fontWeight:500, color:C.text }}>{m}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Achievements */}
        <div style={{ marginBottom:'1.75rem' }}>
          <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.textMuted, marginBottom:'0.75rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <Trophy size={13} /> Achievements
          </div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
            {d.achievements.map(a => (
              <div key={a} style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.6rem 0.85rem', background:C.surface2, borderRadius:10, border:`1px solid ${C.border}` }}>
                <span style={{ color:C.amber, fontSize:'0.9rem' }}>🏆</span>
                <span style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.text }}>{a}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info row */}
        <div style={{ display:'flex', gap:'1.5rem', marginBottom:'1.75rem' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <MapPin size={14} color={C.textMuted} />
            <span style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textMuted }}>{crew.city}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <span style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textMuted }}>Founded {d.founded}</span>
          </div>
        </div>

        <button onClick={() => setMemberships(m => ({ ...m, [crew.id]: !m[crew.id] }))}
          style={{ width:'100%', fontFamily:D.body, fontWeight:700, fontSize:'0.9rem', background: memberships[crew.id] ? 'transparent' : crew.color, color: memberships[crew.id] ? crew.color : '#fff', border:`1.5px solid ${crew.color}`, borderRadius:12, padding:'0.85rem', cursor:'pointer', transition:'all 0.2s' }}>
          {memberships[crew.id] ? '✓ Already a Member' : `Join ${crew.name}`}
        </button>
      </div>
    </div>
  )
}

export default function CrewsSection() {
  const [activeType, setActiveType]     = useState('All')
  const [memberships, setMemberships]   = useState({ 2:true, 5:true })
  const [showCreate, setShowCreate]     = useState(false)
  const [detailCrew, setDetailCrew]     = useState(null)
  const clickTimer = {}

  const handleCrewClick = (crew) => {
    if (clickTimer[crew.id]) {
      clearTimeout(clickTimer[crew.id])
      delete clickTimer[crew.id]
      setDetailCrew(crew)
    } else {
      clickTimer[crew.id] = setTimeout(() => { delete clickTimer[crew.id] }, 300)
    }
  }

  const filtered = CREWS.filter(c => activeType==='All' || c.type===activeType)

  return (
    <div style={{ padding:'2rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
        <div>
          <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:C.coral, marginBottom:'0.4rem' }}>Community</div>
          <h2 style={{ fontFamily:D.display, fontSize:'2.5rem', fontWeight:700, color:C.text, lineHeight:1 }}>Crews & Clubs</h2>
        </div>
        <button onClick={() => setShowCreate(!showCreate)}
          style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', background:C.coral, color:'#fff', border:'none', borderRadius:12, padding:'0.75rem 1.5rem', cursor:'pointer', transition:'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
          onMouseLeave={e => e.currentTarget.style.background=C.coral}>+ Create Crew</button>
      </div>

      {showCreate && (
        <div style={{ background:C.surface, borderRadius:20, padding:'1.75rem', marginBottom:'1.5rem', border:'1px solid rgba(239,131,84,0.3)', borderTop:`3px solid ${C.coral}` }}>
          <div style={{ fontFamily:D.display, fontSize:'1.25rem', fontWeight:700, color:C.text, marginBottom:'1.25rem' }}>Start Your Crew</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1.25rem' }}>
            {[['Crew Name','e.g. Bangalore JDM Crew'],['City / Region','e.g. Bangalore, KA']].map(([label, ph]) => (
              <div key={label}>
                <div style={{ fontFamily:D.body, fontSize:'0.75rem', fontWeight:600, color:C.textMuted, letterSpacing:'0.06em', textTransform:'uppercase', marginBottom:'0.4rem' }}>{label}</div>
                <input placeholder={ph} style={{ width:'100%', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.75rem 1rem', color:C.text, fontFamily:D.body, fontSize:'0.9rem', outline:'none' }}
                  onFocus={e => e.target.style.borderColor='rgba(239,131,84,0.5)'}
                  onBlur={e => e.target.style.borderColor=C.border} />
              </div>
            ))}
          </div>
          <div style={{ display:'flex', gap:'0.75rem' }}>
            <button style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.88rem', background:C.coral, color:'#fff', border:'none', borderRadius:10, padding:'0.65rem 1.4rem', cursor:'pointer' }}>Create Crew</button>
            <button onClick={() => setShowCreate(false)} style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.88rem', background:'transparent', color:C.textMuted, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.65rem 1.4rem', cursor:'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {Object.keys(memberships).length > 0 && (
        <div style={{ marginBottom:'1.5rem' }}>
          <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:C.textMuted, marginBottom:'0.75rem' }}>My Crews</div>
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
            {CREWS.filter(c => memberships[c.id]).map(c => (
              <div key={c.id} style={{ background:C.surface, borderRadius:14, padding:'1rem 1.25rem', border:`1px solid ${C.border}`, borderTop:`3px solid ${c.color}`, display:'flex', alignItems:'center', gap:'0.85rem', flex:1, minWidth:220 }}>
                <span style={{ fontSize:'2rem' }}>{c.emoji}</span>
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:D.body, fontSize:'0.9rem', fontWeight:700, color:C.text }}>{c.name}</div>
                  <div style={{ fontFamily:D.body, fontSize:'0.75rem', color:c.color }}>👥 {c.members} · {c.city}</div>
                </div>
                <button style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.75rem', background:'transparent', border:`1px solid ${c.color}`, color:c.color, borderRadius:8, padding:'0.3rem 0.75rem', cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap' }}
                  onMouseEnter={e => { e.currentTarget.style.background=c.color; e.currentTarget.style.color='#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=c.color }}>
                  Open Chat
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display:'inline-flex', gap:'0.25rem', background:C.surface, padding:'0.3rem', borderRadius:12, marginBottom:'1.5rem' }}>
        {TYPES.map(t => (
          <button key={t} onClick={() => setActiveType(t)}
            style={{ fontFamily:D.body, fontSize:'0.82rem', fontWeight:600, padding:'0.5rem 1rem', borderRadius:9, background: activeType===t ? C.coral : 'transparent', color: activeType===t ? '#fff' : C.textMuted, border:'none', cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap' }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ marginBottom:'0.5rem' }}>
        <span style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted }}>Double-click a crew to see full details</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem' }}>
        {filtered.map(crew => (
          <div key={crew.id} style={{ background:C.surface, borderRadius:18, padding:'1.5rem', border:`1px solid ${C.border}`, borderTop:`3px solid ${crew.color}`, transition:'all 0.2s', cursor:'pointer' }}
            onDoubleClick={() => setDetailCrew(crew)}
            onMouseEnter={e => { e.currentTarget.style.background=C.surface2; e.currentTarget.style.transform='translateY(-2px)' }}
            onMouseLeave={e => { e.currentTarget.style.background=C.surface; e.currentTarget.style.transform='translateY(0)' }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:'1rem', marginBottom:'1rem' }}>
              <div style={{ width:52, height:52, background:`${crew.color}18`, border:`1px solid ${crew.color}33`, borderRadius:14, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', flexShrink:0 }}>{crew.emoji}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.2rem' }}>
                  <span style={{ fontFamily:D.body, fontSize:'1rem', fontWeight:700, color:C.text }}>{crew.name}</span>
                  {crew.verified && <span style={{ fontFamily:D.body, fontSize:'0.62rem', fontWeight:600, color:C.green, background:'rgba(94,170,126,0.12)', padding:'0.1rem 0.4rem', borderRadius:5 }}>✓</span>}
                </div>
                <div style={{ fontFamily:D.body, fontSize:'0.75rem', color:crew.color }}>@{crew.tag}</div>
              </div>
            </div>
            <p style={{ fontFamily:D.body, fontSize:'0.85rem', lineHeight:1.6, color:C.textMuted, marginBottom:'1.25rem' }}>{crew.desc}</p>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', gap:'1rem' }}>
                <span style={{ fontFamily:D.body, fontSize:'0.85rem', fontWeight:600, color:C.text }}>👥 {crew.members}</span>
                <span style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.textMuted }}>📍 {crew.city}</span>
              </div>
              <button onClick={() => setMemberships(m => ({ ...m, [crew.id]: !m[crew.id] }))}
                style={{ fontFamily:D.body, fontWeight:700, fontSize:'0.82rem', background: memberships[crew.id] ? 'transparent' : crew.color, color: memberships[crew.id] ? crew.color : '#fff', border:`1px solid ${crew.color}`, borderRadius:9, padding:'0.4rem 1rem', cursor:'pointer', transition:'all 0.2s' }}>
                {memberships[crew.id] ? '✓ Joined' : 'Join'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {detailCrew && <CrewDetailModal crew={detailCrew} onClose={() => setDetailCrew(null)} memberships={memberships} setMemberships={setMemberships} />}
    </div>
  )
}