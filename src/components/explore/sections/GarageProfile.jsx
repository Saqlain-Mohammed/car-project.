import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'

const C = { dark:'#2B2D42', light:'#EDF2F4', red:'#EF233C', black:'#1a1b26', card:'#23253a', muted:'#8D99AE', steel:'#8D99AE' }
const D = { display:"'Barlow Condensed', sans-serif", body:"'Barlow', sans-serif" }

const VEHICLES = [
  { id:1, make:'Honda', model:'Civic', variant:'EK9 Type R', year:1998, type:'car', mods:14, hp:320, color:'#EF233C', emoji:'🚗',
    modList:['K20 Engine Swap','Coilovers — Tein','6-speed LSD Gearbox','Full Roll Cage','Bride Bucket Seats','AP Racing Brakes','Recaro Harness','Custom Exhaust','ECU Tune — Hondata','Carbon Hood','Wide Body Kit','Work Emotion Wheels','Racing Fuel Cell','Sparco Steering Wheel'],
    timeline:[{date:'Jan 2023',event:'Bought stock EK9',type:'buy'},{date:'Mar 2023',event:'Suspension overhaul',type:'mod'},{date:'Jun 2023',event:'K-swap complete',type:'major'},{date:'Sep 2023',event:'First track day',type:'event'},{date:'Jan 2024',event:'Full roll cage installed',type:'mod'},{date:'Apr 2024',event:'Best lap: 1:41.2',type:'achievement'}]
  },
  { id:2, make:'KTM', model:'Duke', variant:'390', year:2022, type:'bike', mods:6, hp:44, color:'#f39c12', emoji:'🏍️',
    modList:['Akrapovic Exhaust','K&N Air Filter','ECU Flash','Frame Sliders','Bar End Mirrors','Tail Tidy'],
    timeline:[{date:'Aug 2022',event:'Bought new Duke 390',type:'buy'},{date:'Oct 2022',event:'Exhaust + air filter',type:'mod'},{date:'Dec 2022',event:'ECU flash done',type:'mod'},{date:'Mar 2023',event:'First track day',type:'event'}]
  },
]

const BADGES = [
  { icon:'🏆', name:'Build King', desc:'Top rated build of the month', color:'#f39c12' },
  { icon:'✅', name:'Verified Owner', desc:'Ownership confirmed', color:'#27ae60' },
  { icon:'🔧', name:'Mod Master', desc:'10+ documented mods', color:'#3b82f6' },
  { icon:'🏁', name:'Track Rat', desc:'5+ track days logged', color:'#EF233C' },
]

const timelineColors = { buy:'#27ae60', mod:'#3b82f6', major:'#EF233C', event:'#f39c12', achievement:'#a855f7' }

export default function GarageProfile() {
  const { user } = useAuth()
  const [activeVehicle, setActiveVehicle] = useState(VEHICLES[0])
  const [activeTab, setActiveTab] = useState('mods')
  const username = user?.user_metadata?.username || 'GarageKing'

  return (
    <div style={{ padding:'1.5rem', maxWidth:1100, margin:'0 auto' }}>
      {/* Profile header */}
      <div style={{ background:C.card, border:'1px solid rgba(141,153,174,0.12)', borderTop:`3px solid ${C.red}`, padding:'2rem', marginBottom:'1.5rem', display:'flex', gap:'2rem', alignItems:'flex-start' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:`linear-gradient(135deg, ${C.red}, #f39c12)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:900, fontSize:'2rem', color:C.dark, flexShrink:0 }}>
          {username[0].toUpperCase()}
        </div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap', marginBottom:'0.5rem' }}>
            <h1 style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:900, color:C.light, lineHeight:1 }}>{username}</h1>
            <div style={{ display:'flex', gap:'0.4rem' }}>
              {['✓ Verified','★ Build King'].map(b => (
                <span key={b} style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.2rem 0.5rem', border:`1px solid ${b.includes('✓') ? C.red : '#f39c12'}`, color:b.includes('✓') ? C.red : '#f39c12' }}>{b}</span>
              ))}
            </div>
          </div>
          <div style={{ fontFamily:D.display, fontSize:'0.85rem', color:C.muted, marginBottom:'1rem' }}>@{username.toLowerCase()} · Bengaluru, Karnataka</div>
          <div style={{ display:'flex', gap:'2.5rem' }}>
            {[['247','Followers'],['84','Posts'],['2','Vehicles'],['12','Badges']].map(([v,l]) => (
              <div key={l}>
                <div style={{ fontFamily:D.display, fontSize:'1.5rem', fontWeight:900, color:C.light, lineHeight:1 }}>{v}</div>
                <div style={{ fontFamily:D.display, fontSize:'0.72rem', color:C.muted, letterSpacing:'0.1em', textTransform:'uppercase' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display:'flex', gap:'0.75rem' }}>
          <button style={{ fontFamily:D.display, fontWeight:800, fontSize:'0.82rem', letterSpacing:'0.1em', textTransform:'uppercase', background:C.red, color:C.light, border:'none', padding:'0.6rem 1.4rem', cursor:'pointer' }}>Edit Profile</button>
          <button style={{ fontFamily:D.display, fontWeight:800, fontSize:'0.82rem', letterSpacing:'0.1em', textTransform:'uppercase', background:'none', color:C.light, border:'1px solid rgba(141,153,174,0.3)', padding:'0.6rem 1.4rem', cursor:'pointer' }}>Share</button>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1px', background:'rgba(141,153,174,0.1)', marginBottom:'1.5rem' }}>
        {BADGES.map(({ icon, name, desc, color }) => (
          <div key={name} style={{ background:C.card, padding:'1rem', display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <div style={{ width:40, height:40, background:`${color}20`, border:`1px solid ${color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>{icon}</div>
            <div>
              <div style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.88rem', color:C.light }}>{name}</div>
              <div style={{ fontFamily:D.display, fontSize:'0.68rem', color:C.muted }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle tabs */}
      <div style={{ display:'flex', gap:'1px', background:'rgba(141,153,174,0.1)', marginBottom:'1.5rem' }}>
        {VEHICLES.map(v => (
          <button key={v.id} onClick={() => setActiveVehicle(v)}
            style={{ flex:1, padding:'1rem 1.5rem', background: activeVehicle.id===v.id ? C.card : C.black, border:'none', borderBottom: activeVehicle.id===v.id ? `3px solid ${v.color}` : '3px solid transparent', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.75rem', transition:'all 0.2s' }}>
            <span style={{ fontSize:'1.5rem' }}>{v.emoji}</span>
            <div style={{ textAlign:'left' }}>
              <div style={{ fontFamily:D.display, fontWeight:700, fontSize:'1rem', color: activeVehicle.id===v.id ? C.light : C.muted }}>{v.make} {v.model}</div>
              <div style={{ fontFamily:D.display, fontSize:'0.72rem', color:v.color }}>{v.variant} · {v.year}</div>
            </div>
            <div style={{ marginLeft:'auto', textAlign:'right' }}>
              <div style={{ fontFamily:D.display, fontSize:'0.75rem', fontWeight:700, color:v.color }}>{v.mods} Mods</div>
              <div style={{ fontFamily:D.display, fontSize:'0.68rem', color:C.muted }}>{v.hp}hp</div>
            </div>
          </button>
        ))}
        <button style={{ padding:'1rem 2rem', background:C.black, border:'none', cursor:'pointer', fontFamily:D.display, fontSize:'0.82rem', fontWeight:700, color:C.muted }}
          onMouseEnter={e => e.currentTarget.style.color=C.light} onMouseLeave={e => e.currentTarget.style.color=C.muted}>
          + Add Vehicle
        </button>
      </div>

      {/* Vehicle detail */}
      <div style={{ background:C.card, border:'1px solid rgba(141,153,174,0.12)', borderTop:`3px solid ${activeVehicle.color}` }}>
        <div style={{ padding:'1.5rem', borderBottom:'1px solid rgba(141,153,174,0.1)', display:'flex', alignItems:'center', gap:'1.5rem' }}>
          <div style={{ fontSize:'3rem' }}>{activeVehicle.emoji}</div>
          <div>
            <h2 style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:900, color:C.light, lineHeight:1 }}>{activeVehicle.make} {activeVehicle.model} {activeVehicle.variant}</h2>
            <div style={{ fontFamily:D.display, fontSize:'0.85rem', color:C.muted, marginTop:'0.25rem' }}>{activeVehicle.year} · {activeVehicle.hp}hp</div>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:'0.5rem' }}>
            {['🔧 Edit','📸 Photos','📊 Stats'].map(a => (
              <button key={a} style={{ fontFamily:D.display, fontSize:'0.78rem', fontWeight:700, background:'none', border:'1px solid rgba(141,153,174,0.2)', padding:'0.4rem 0.9rem', cursor:'pointer', color:C.muted }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=activeVehicle.color; e.currentTarget.style.color=C.light }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(141,153,174,0.2)'; e.currentTarget.style.color=C.muted }}>{a}</button>
            ))}
          </div>
        </div>

        <div style={{ display:'flex', borderBottom:'1px solid rgba(141,153,174,0.1)', padding:'0 1.5rem' }}>
          {['mods','timeline'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.82rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.75rem 1.2rem', background:'none', border:'none', cursor:'pointer', color: activeTab===tab ? C.light : C.muted, borderBottom: activeTab===tab ? `2px solid ${activeVehicle.color}` : '2px solid transparent' }}>
              {tab === 'mods' ? `Mod List (${activeVehicle.mods})` : 'Timeline'}
            </button>
          ))}
        </div>

        <div style={{ padding:'1.5rem' }}>
          {activeTab === 'mods' ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(220px,1fr))', gap:'0.75rem' }}>
              {activeVehicle.modList.map((mod, i) => (
                <div key={mod} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.75rem 1rem', background:'rgba(141,153,174,0.06)', border:'1px solid rgba(141,153,174,0.1)' }}>
                  <span style={{ fontFamily:D.display, fontSize:'0.7rem', fontWeight:900, color:activeVehicle.color, flexShrink:0 }}>{String(i+1).padStart(2,'0')}</span>
                  <span style={{ fontFamily:D.display, fontWeight:600, fontSize:'0.88rem', color:C.light }}>{mod}</span>
                </div>
              ))}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'0.75rem 1rem', border:'1px dashed rgba(141,153,174,0.25)', cursor:'pointer' }}>
                <span style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.88rem', color:C.muted }}>+ Add Mod</span>
              </div>
            </div>
          ) : (
            <div style={{ maxWidth:480 }}>
              {activeVehicle.timeline.map(({ date, event, type }) => (
                <div key={date} style={{ display:'flex', gap:'1rem', alignItems:'flex-start', marginBottom:'1.2rem' }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                    <div style={{ width:10, height:10, borderRadius:'50%', background: timelineColors[type] || C.muted, border:`2px solid ${C.card}` }} />
                    <div style={{ width:1, flex:1, background:'rgba(141,153,174,0.15)', minHeight:24 }} />
                  </div>
                  <div style={{ paddingBottom:'0.5rem' }}>
                    <div style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color: timelineColors[type] || C.muted, marginBottom:'0.2rem' }}>{date}</div>
                    <div style={{ fontFamily:D.display, fontSize:'0.95rem', fontWeight:600, color:C.light }}>{event}</div>
                  </div>
                </div>
              ))}
              <button style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.82rem', background:'none', border:'1px solid rgba(141,153,174,0.2)', padding:'0.5rem 1.2rem', cursor:'pointer', color:C.muted }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=C.red; e.currentTarget.style.color=C.light }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(141,153,174,0.2)'; e.currentTarget.style.color=C.muted }}>
                + Add Milestone
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}