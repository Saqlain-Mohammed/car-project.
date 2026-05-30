import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'

const C = { bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50', coral:'#EF8354', coralDim:'#d96a3a', text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0', border:'rgba(191,192,192,0.12)', green:'#5eaa7e', amber:'#f5a623' }
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const VEHICLES = [
  { id:1, make:'Honda', model:'Civic', variant:'EK9 Type R', year:1998, type:'car', mods:14, hp:320, color:'#EF8354', emoji:'🚗',
    modList:['K20 Engine Swap','Coilovers — Tein','6-speed LSD Gearbox','Full Roll Cage','Bride Bucket Seats','AP Racing Brakes','Recaro Harness','Custom Exhaust','ECU Tune — Hondata','Carbon Hood','Wide Body Kit','Work Emotion Wheels','Racing Fuel Cell','Sparco Steering Wheel'],
    timeline:[{date:'Jan 2023',event:'Bought stock EK9',type:'buy'},{date:'Mar 2023',event:'Suspension overhaul',type:'mod'},{date:'Jun 2023',event:'K-swap complete',type:'major'},{date:'Sep 2023',event:'First track day',type:'event'},{date:'Jan 2024',event:'Full roll cage installed',type:'mod'},{date:'Apr 2024',event:'Best lap: 1:41.2',type:'achievement'}]
  },
  { id:2, make:'KTM', model:'Duke', variant:'390', year:2022, type:'bike', mods:6, hp:44, color:'#f39c12', emoji:'🏍️',
    modList:['Akrapovic Exhaust','K&N Air Filter','ECU Flash','Frame Sliders','Bar End Mirrors','Tail Tidy'],
    timeline:[{date:'Aug 2022',event:'Bought new Duke 390',type:'buy'},{date:'Oct 2022',event:'Exhaust + air filter',type:'mod'},{date:'Dec 2022',event:'ECU flash done',type:'mod'},{date:'Mar 2023',event:'First track day',type:'event'}]
  },
]

const BADGES = [
  { icon:'🏆', name:'Build King', desc:'Top rated build', color:'#f5a623' },
  { icon:'✅', name:'Verified Owner', desc:'Ownership confirmed', color:'#5eaa7e' },
  { icon:'🔧', name:'Mod Master', desc:'10+ documented mods', color:'#3b82f6' },
  { icon:'🏁', name:'Track Rat', desc:'5+ track days', color:'#EF8354' },
]

const tlColors = { buy:'#5eaa7e', mod:'#3b82f6', major:'#EF8354', event:'#f5a623', achievement:'#a855f7' }

export default function GarageProfile() {
  const { user } = useAuth()
  const [activeVehicle, setActiveVehicle] = useState(VEHICLES[0])
  const [activeTab, setActiveTab] = useState('mods')
  const username = user?.user_metadata?.username || 'GarageKing'

  return (
    <div style={{ padding:'2rem', maxWidth:1100, margin:'0 auto' }}>
      <div style={{ background:C.surface, borderRadius:20, padding:'2rem', marginBottom:'1.5rem', border:`1px solid ${C.border}`, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-40, right:-40, width:200, height:200, borderRadius:'50%', background:C.coral, opacity:0.05, pointerEvents:'none' }} />
        <div style={{ display:'flex', gap:'2rem', alignItems:'flex-start', position:'relative', zIndex:1 }}>
          <div style={{ width:88, height:88, borderRadius:'50%', background:`linear-gradient(135deg, ${C.coral}, #f39c12)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'2.2rem', color:'#1f2230', flexShrink:0, border:`3px solid rgba(239,131,84,0.3)` }}>
            {username[0].toUpperCase()}
          </div>
          <div style={{ flex:1 }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.85rem', flexWrap:'wrap', marginBottom:'0.4rem' }}>
              <h1 style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:700, color:C.text, lineHeight:1 }}>{username}</h1>
              <span style={{ fontFamily:D.body, fontSize:'0.7rem', fontWeight:600, padding:'0.2rem 0.6rem', borderRadius:6, background:'rgba(239,131,84,0.12)', color:C.coral, border:'1px solid rgba(239,131,84,0.25)' }}>✓ Verified</span>
              <span style={{ fontFamily:D.body, fontSize:'0.7rem', fontWeight:600, padding:'0.2rem 0.6rem', borderRadius:6, background:'rgba(245,166,35,0.12)', color:C.amber, border:'1px solid rgba(245,166,35,0.25)' }}>★ Build King</span>
            </div>
            <div style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.textMuted, marginBottom:'1.25rem' }}>@{username.toLowerCase()} · Bengaluru, Karnataka</div>
            <div style={{ display:'flex', gap:'2rem' }}>
              {[['247','Followers'],['84','Posts'],['2','Vehicles'],['12','Badges']].map(([v,l]) => (
                <div key={l}>
                  <div style={{ fontFamily:D.display, fontSize:'1.5rem', fontWeight:700, color:C.text, lineHeight:1 }}>{v}</div>
                  <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted, marginTop:'0.15rem' }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display:'flex', gap:'0.6rem' }}>
            <button style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.85rem', background:C.coral, color:'#fff', border:'none', padding:'0.65rem 1.4rem', borderRadius:10, cursor:'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
              onMouseLeave={e => e.currentTarget.style.background=C.coral}>Edit Profile</button>
            <button style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.85rem', background:'transparent', color:C.text, border:`1px solid ${C.border}`, padding:'0.65rem 1.4rem', borderRadius:10, cursor:'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background=C.surface2}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>Share</button>
          </div>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        {BADGES.map(({ icon, name, desc, color }) => (
          <div key={name} style={{ background:C.surface, borderRadius:14, padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:'0.85rem', border:`1px solid ${C.border}`, transition:'border-color 0.2s', cursor:'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor=`${color}44`}
            onMouseLeave={e => e.currentTarget.style.borderColor=C.border}>
            <div style={{ width:42, height:42, background:`${color}18`, border:`1px solid ${color}33`, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0 }}>{icon}</div>
            <div>
              <div style={{ fontFamily:D.body, fontSize:'0.85rem', fontWeight:700, color:C.text }}>{name}</div>
              <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted, marginTop:'0.1rem' }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display:'flex', gap:'1px', background:C.border, borderRadius:14, overflow:'hidden', marginBottom:'1.25rem' }}>
        {VEHICLES.map(v => (
          <button key={v.id} onClick={() => setActiveVehicle(v)}
            style={{ flex:1, padding:'1rem 1.5rem', background: activeVehicle.id===v.id ? C.surface : C.bg, border:'none', borderBottom: activeVehicle.id===v.id ? `3px solid ${v.color}` : '3px solid transparent', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.85rem', transition:'all 0.2s' }}>
            <div style={{ width:44, height:44, borderRadius:11, background:`${v.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>{v.emoji}</div>
            <div style={{ textAlign:'left' }}>
              <div style={{ fontFamily:D.body, fontSize:'0.95rem', fontWeight:700, color: activeVehicle.id===v.id ? C.text : C.textMuted }}>{v.make} {v.model}</div>
              <div style={{ fontFamily:D.body, fontSize:'0.75rem', color:v.color, marginTop:'0.1rem' }}>{v.variant} · {v.year}</div>
            </div>
            <div style={{ marginLeft:'auto', textAlign:'right' }}>
              <div style={{ fontFamily:D.display, fontSize:'0.9rem', fontWeight:700, color:v.color }}>{v.mods} Mods</div>
              <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted }}>{v.hp}hp</div>
            </div>
          </button>
        ))}
        <button style={{ padding:'1rem 1.5rem', background:C.bg, border:'none', cursor:'pointer', fontFamily:D.body, fontSize:'0.85rem', fontWeight:600, color:C.textMuted, display:'flex', alignItems:'center', gap:'0.5rem', transition:'all 0.2s', whiteSpace:'nowrap' }}
          onMouseEnter={e => { e.currentTarget.style.background=C.surface; e.currentTarget.style.color=C.coral }}
          onMouseLeave={e => { e.currentTarget.style.background=C.bg; e.currentTarget.style.color=C.textMuted }}>
          + Add Vehicle
        </button>
      </div>

      <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, overflow:'hidden' }}>
        <div style={{ height:4, background:`linear-gradient(to right, ${activeVehicle.color}, ${activeVehicle.color}44)` }} />
        <div style={{ padding:'1.5rem', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:'1.5rem' }}>
          <div style={{ width:64, height:64, borderRadius:16, background:`${activeVehicle.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', flexShrink:0 }}>{activeVehicle.emoji}</div>
          <div>
            <h2 style={{ fontFamily:D.display, fontSize:'1.8rem', fontWeight:700, color:C.text, lineHeight:1 }}>{activeVehicle.make} {activeVehicle.model} {activeVehicle.variant}</h2>
            <div style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.textMuted, marginTop:'0.3rem' }}>{activeVehicle.year} · {activeVehicle.hp}hp</div>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:'0.5rem' }}>
            {['🔧 Edit','📸 Photos','📊 Stats'].map(a => (
              <button key={a} style={{ fontFamily:D.body, fontSize:'0.8rem', fontWeight:600, background:'transparent', border:`1px solid ${C.border}`, borderRadius:9, padding:'0.45rem 0.9rem', cursor:'pointer', color:C.textMuted, transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=activeVehicle.color; e.currentTarget.style.color=C.text }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textMuted }}>{a}</button>
            ))}
          </div>
        </div>

        <div style={{ display:'inline-flex', gap:'0.25rem', padding:'1rem 1.5rem', borderBottom:`1px solid ${C.border}` }}>
          {['mods','timeline'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ fontFamily:D.body, fontSize:'0.85rem', fontWeight:600, padding:'0.5rem 1.2rem', borderRadius:9, background: activeTab===tab ? activeVehicle.color : 'transparent', color: activeTab===tab ? '#fff' : C.textMuted, border:'none', cursor:'pointer', transition:'all 0.2s' }}>
              {tab === 'mods' ? `Mod List (${activeVehicle.mods})` : 'Timeline'}
            </button>
          ))}
        </div>

        <div style={{ padding:'1.5rem' }}>
          {activeTab === 'mods' ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:'0.75rem' }}>
              {activeVehicle.modList.map((mod, i) => (
                <div key={mod} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.75rem 1rem', background:C.surface2, borderRadius:11, border:`1px solid ${C.border}`, transition:'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor=`${activeVehicle.color}44`}
                  onMouseLeave={e => e.currentTarget.style.borderColor=C.border}>
                  <span style={{ fontFamily:D.display, fontSize:'0.75rem', fontWeight:700, color:activeVehicle.color, flexShrink:0, width:22 }}>{String(i+1).padStart(2,'0')}</span>
                  <span style={{ fontFamily:D.body, fontSize:'0.88rem', fontWeight:500, color:C.text }}>{mod}</span>
                </div>
              ))}
              <div style={{ display:'flex', alignItems:'center', justifyContent:'center', padding:'0.75rem 1rem', border:`2px dashed rgba(191,192,192,0.15)`, borderRadius:11, cursor:'pointer', transition:'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor=`${activeVehicle.color}66`}
                onMouseLeave={e => e.currentTarget.style.borderColor='rgba(191,192,192,0.15)'}>
                <span style={{ fontFamily:D.body, fontSize:'0.88rem', fontWeight:600, color:C.textMuted }}>+ Add Mod</span>
              </div>
            </div>
          ) : (
            <div style={{ maxWidth:480 }}>
              {activeVehicle.timeline.map(({ date, event, type }, idx) => (
                <div key={date} style={{ display:'flex', gap:'1rem', alignItems:'flex-start' }}>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                    <div style={{ width:12, height:12, borderRadius:'50%', background: tlColors[type] || C.textMuted, border:`2px solid ${C.surface}`, marginTop:'0.2rem' }} />
                    {idx < activeVehicle.timeline.length - 1 && <div style={{ width:2, flex:1, background:`linear-gradient(to bottom, ${tlColors[type] || C.textMuted}44, transparent)`, minHeight:32, margin:'4px 0' }} />}
                  </div>
                  <div style={{ paddingBottom:'1.25rem' }}>
                    <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color: tlColors[type] || C.textMuted, marginBottom:'0.2rem' }}>{date}</div>
                    <div style={{ fontFamily:D.body, fontSize:'0.92rem', fontWeight:500, color:C.text }}>{event}</div>
                  </div>
                </div>
              ))}
              <button style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.85rem', background:'transparent', border:`1px dashed rgba(191,192,192,0.25)`, borderRadius:10, padding:'0.6rem 1.2rem', cursor:'pointer', color:C.textMuted, transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=`${activeVehicle.color}66`; e.currentTarget.style.color=C.text }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(191,192,192,0.25)'; e.currentTarget.style.color=C.textMuted }}>
                + Add Milestone
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}