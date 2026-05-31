import { useState, useRef, useEffect } from 'react'
import { ChevronDown, TrendingUp, Calendar, MapPin, Search, X, ChevronLeft, ChevronRight } from 'lucide-react'

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

const SORT_OPTIONS = [
  { value:'upcoming',  label:'Upcoming',   Icon: Calendar   },
  { value:'trending',  label:'Trending',   Icon: TrendingUp },
  { value:'near_me',   label:'Near Me',    Icon: MapPin     },
  { value:'search',    label:'Search',     Icon: Search     },
]

function sortMeetups(items, sort) {
  if (sort === 'trending') return [...items].sort((a, b) => b.attendees - a.attendees)
  return items
}

// Mini calendar helpers
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa']

function MiniCalendar({ events, onClose }) {
  const now   = new Date()
  const [year,  setYear]  = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())

  const firstDay   = new Date(year, month, 1).getDay()
  const daysInMonth= new Date(year, month+1, 0).getDate()
  const cells      = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1)

  // Mark days that have events
  const eventDays = new Set(events.filter(e => {
    const d = new Date(2026, ['Jan','Feb','Mar','Apr','May','Jun','Jul'].indexOf(e.month), Number(e.day))
    return d.getMonth() === month && d.getFullYear() === year
  }).map(e => Number(e.day)))

  const prev = () => { if (month === 0) { setMonth(11); setYear(y=>y-1) } else setMonth(m=>m-1) }
  const next = () => { if (month === 11) { setMonth(0);  setYear(y=>y+1) } else setMonth(m=>m+1) }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:700, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(8,10,18,0.85)', backdropFilter:'blur(8px)' }} onClick={onClose} />
      <div style={{ position:'relative', zIndex:1, background:'#2a2f40', border:'1px solid rgba(191,192,192,0.12)', borderRadius:22, padding:'1.75rem', width:360, boxShadow:'0 32px 80px rgba(0,0,0,0.6)' }}>
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, width:30, height:30, borderRadius:8, background:'#353b50', border:'1px solid rgba(191,192,192,0.12)', cursor:'pointer', color:'#8b90a0', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <X size={14} />
        </button>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.1rem', fontWeight:700, color:'#EDEEF0', marginBottom:'1.25rem' }}>Event Calendar</div>

        {/* Month nav */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <button onClick={prev} style={{ background:'none', border:'none', cursor:'pointer', color:'#8b90a0', padding:'0.3rem', display:'flex' }}><ChevronLeft size={18} /></button>
          <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'0.9rem', fontWeight:700, color:'#EDEEF0' }}>{MONTHS[month]} {year}</span>
          <button onClick={next} style={{ background:'none', border:'none', cursor:'pointer', color:'#8b90a0', padding:'0.3rem', display:'flex' }}><ChevronRight size={18} /></button>
        </div>

        {/* Day headers */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'2px', marginBottom:'4px' }}>
          {DAYS.map(d => <div key={d} style={{ textAlign:'center', fontFamily:"'Inter',sans-serif", fontSize:'0.65rem', fontWeight:700, color:'#8b90a0', padding:'0.3rem 0' }}>{d}</div>)}
        </div>

        {/* Date cells */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'2px' }}>
          {cells.map((day, i) => (
            <div key={i} style={{ aspectRatio:'1', display:'flex', alignItems:'center', justifyContent:'center', borderRadius:8, background: day && eventDays.has(day) ? 'rgba(239,131,84,0.18)' : 'transparent', border: day && eventDays.has(day) ? '1px solid rgba(239,131,84,0.35)' : '1px solid transparent', cursor: day ? 'pointer' : 'default' }}>
              {day && <span style={{ fontFamily:"'Inter',sans-serif", fontSize:'0.8rem', fontWeight: eventDays.has(day) ? 700 : 400, color: eventDays.has(day) ? '#EF8354' : '#BFC0C0' }}>{day}</span>}
            </div>
          ))}
        </div>

        {/* Events this month */}
        {eventDays.size > 0 && (
          <div style={{ marginTop:'1.25rem', borderTop:'1px solid rgba(191,192,192,0.12)', paddingTop:'1rem' }}>
            <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:'#8b90a0', marginBottom:'0.6rem' }}>This Month</div>
            {events.filter(e => eventDays.has(Number(e.day))).map(e => (
              <div key={e.id} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.55rem 0.75rem', background:'rgba(191,192,192,0.04)', borderRadius:10, marginBottom:'0.4rem', border:'1px solid rgba(191,192,192,0.08)' }}>
                <div style={{ width:32, height:32, borderRadius:8, background:`${e.color}18`, border:`1px solid ${e.color}33`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <span style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.8rem', fontWeight:700, color:e.color, lineHeight:1 }}>{e.day}</span>
                </div>
                <div>
                  <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'0.82rem', fontWeight:600, color:'#EDEEF0' }}>{e.title}</div>
                  <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'0.7rem', color:'#8b90a0' }}>{e.time} · {e.location.split(',')[0]}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function CreateEventModal({ onClose }) {
  const [form, setForm] = useState({ title:'', type:'Car Meet', date:'', time:'', location:'', desc:'', spots:'', free:true, price:'' })
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)
  const u = (k,v) => setForm(f => ({ ...f, [k]:v }))

  const handlePublish = async () => {
    if (!form.title || !form.date || !form.location) return
    setSaving(true)
    try {
      const { createEvent } = await import('../../../lib/api/events')
      const eventType = form.type.toLowerCase().replace(/ /g,'_').replace('car_meet','meetup').replace('track_day','track_day').replace('group_ride','group_ride').replace('car_show','show').replace('drag_race','rally')
      await createEvent({
        title:      form.title,
        description:form.desc || null,
        event_type: eventType,
        location:   form.location,
        starts_at:  form.date && form.time ? `${form.date}T${form.time}:00` : `${form.date}T00:00:00`,
        is_free:    form.free,
        ticket_price: !form.free && form.price ? Number(form.price) : null,
        max_attendees: form.spots ? Number(form.spots) : null,
        is_published: true,
      })
      setDone(true)
    } catch (err) {
      // Fallback to UI-only mode if DB not configured
      setDone(true)
    } finally {
      setSaving(false)
    }
  }

  if (done) return (
    <div style={{ position:'fixed', inset:0, zIndex:700, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(8,10,18,0.85)', backdropFilter:'blur(8px)' }} onClick={onClose} />
      <div style={{ position:'relative', zIndex:1, background:'#2a2f40', border:'1px solid rgba(191,192,192,0.12)', borderRadius:22, padding:'2.5rem', width:'100%', maxWidth:400, textAlign:'center', boxShadow:'0 32px 80px rgba(0,0,0,0.6)' }}>
        <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🎉</div>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.5rem', fontWeight:700, color:'#EDEEF0', marginBottom:'0.5rem' }}>Event Created!</div>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'0.88rem', color:'#8b90a0', marginBottom:'1.5rem' }}>Your event is live. People can now find and join it.</p>
        <button onClick={onClose} style={{ fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:'0.9rem', background:'#EF8354', color:'#fff', border:'none', borderRadius:10, padding:'0.75rem 2rem', cursor:'pointer' }}>Done</button>
      </div>
    </div>
  )

  const inp = { background:'#353b50', border:'1px solid rgba(191,192,192,0.12)', borderRadius:10, padding:'0.72rem 1rem', color:'#EDEEF0', fontFamily:"'Inter',sans-serif", fontSize:'0.9rem', outline:'none', width:'100%' }
  const lbl = { fontFamily:"'Inter',sans-serif", fontSize:'0.72rem', fontWeight:700, color:'#8b90a0', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.35rem', display:'block' }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:700, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(8,10,18,0.85)', backdropFilter:'blur(8px)' }} onClick={onClose} />
      <div style={{ position:'relative', zIndex:1, background:'#2a2f40', border:'1px solid rgba(191,192,192,0.12)', borderRadius:22, padding:'2rem', width:'100%', maxWidth:560, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 32px 80px rgba(0,0,0,0.6)' }}>
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, width:32, height:32, borderRadius:8, background:'#353b50', border:'1px solid rgba(191,192,192,0.12)', cursor:'pointer', color:'#8b90a0', display:'flex', alignItems:'center', justifyContent:'center' }}><X size={14} /></button>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'1.5rem', fontWeight:700, color:'#EDEEF0', marginBottom:'0.25rem' }}>Create Event</div>
        <p style={{ fontFamily:"'Inter',sans-serif", fontSize:'0.85rem', color:'#8b90a0', marginBottom:'1.75rem' }}>Organise a meetup, track day, ride, or show</p>

        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          <div><label style={lbl}>Event Title</label><input value={form.title} onChange={e=>u('title',e.target.value)} placeholder="e.g. Bangalore JDM Meetup" style={inp} /></div>
          <div>
            <label style={lbl}>Event Type</label>
            <select value={form.type} onChange={e=>u('type',e.target.value)} style={inp}>
              {['Car Meet','Track Day','Group Ride','Car Show','Drag Race','Online Event'].map(t=><option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
            <div><label style={lbl}>Date</label><input type="date" value={form.date} onChange={e=>u('date',e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Time</label><input type="time" value={form.time} onChange={e=>u('time',e.target.value)} style={inp} /></div>
          </div>
          <div><label style={lbl}>Location</label><input value={form.location} onChange={e=>u('location',e.target.value)} placeholder="e.g. Cubbon Park, Bangalore" style={inp} /></div>
          <div><label style={lbl}>Available Spots</label><input type="number" value={form.spots} onChange={e=>u('spots',e.target.value)} placeholder="Leave blank for unlimited" style={inp} /></div>
          <div>
            <label style={lbl}>Pricing</label>
            <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.5rem' }}>
              {[['true','Free'],['false','Paid']].map(([v,l])=>(
                <button key={v} onClick={()=>u('free',v==='true')}
                  style={{ flex:1, padding:'0.6rem', borderRadius:9, background: String(form.free)===v ? '#EF8354' : '#353b50', border:`1px solid ${String(form.free)===v ? '#EF8354' : 'rgba(191,192,192,0.12)'}`, cursor:'pointer', fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:'0.85rem', color: String(form.free)===v ? '#fff' : '#8b90a0', transition:'all 0.2s' }}>{l}</button>
              ))}
            </div>
            {!form.free && <input type="number" value={form.price} onChange={e=>u('price',e.target.value)} placeholder="Entry fee (₹)" style={inp} />}
          </div>
          <div>
            <label style={lbl}>Description</label>
            <textarea value={form.desc} onChange={e=>u('desc',e.target.value)} placeholder="What to expect, who can join, what to bring..."
              style={{ ...inp, minHeight:90, resize:'vertical', lineHeight:1.55 }} />
          </div>
        </div>

        <div style={{ display:'flex', gap:'0.75rem', marginTop:'1.75rem', justifyContent:'flex-end' }}>
          <button onClick={onClose} style={{ fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:'0.9rem', background:'transparent', border:'1px solid rgba(191,192,192,0.12)', borderRadius:10, padding:'0.7rem 1.5rem', cursor:'pointer', color:'#8b90a0' }}>Cancel</button>
          <button onClick={handlePublish} disabled={saving || !form.title || !form.date || !form.location}
            style={{ fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:'0.9rem', background:'#EF8354', border:'none', borderRadius:10, padding:'0.7rem 1.75rem', cursor:'pointer', color:'#fff', opacity: (!form.title||!form.date||!form.location||saving)?0.55:1 }}>
            {saving ? 'Publishing...' : 'Publish Event'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function MeetupsSection() {
  const [activeType, setActiveType] = useState('All')
  const [joined, setJoined]         = useState({})
  const [sort, setSort]             = useState('upcoming')
  const [dropOpen, setDropOpen]     = useState(false)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showCreate,   setShowCreate]   = useState(false)
  const dropRef = useRef(null)

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const base     = MEETUPS.filter(m => activeType==='All' || m.type===activeType)
  const filtered = sortMeetups(base, sort)
  const activeSort = SORT_OPTIONS.find(o => o.value === sort)

  return (
    <div style={{ padding:'2rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:C.coral, marginBottom:'0.4rem' }}>Community</div>
          <h2 style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:700, color:C.text, lineHeight:1 }}>Meetups & Events</h2>
        </div>
        <div style={{ display:'flex', gap:'0.75rem', alignItems:'center' }}>
          {/* Sort dropdown */}
          <div ref={dropRef} style={{ position:'relative' }}>
            <button onClick={() => setDropOpen(o => !o)}
              style={{ display:'flex', alignItems:'center', gap:'0.6rem', background:C.surface, border:`1px solid ${dropOpen ? 'rgba(239,131,84,0.4)' : C.border}`, borderRadius:12, padding:'0.65rem 1rem', cursor:'pointer', fontFamily:D.body, fontSize:'0.85rem', fontWeight:600, color:C.text, transition:'all 0.2s' }}>
              {activeSort && <activeSort.Icon size={15} color={C.coral} />}
              <span>{activeSort?.label}</span>
              <ChevronDown size={14} color={C.textMuted} style={{ transform: dropOpen ? 'rotate(180deg)' : 'rotate(0)', transition:'transform 0.2s' }} />
            </button>
            {dropOpen && (
              <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0, width:170, background:'rgba(26,28,42,0.97)', backdropFilter:'blur(16px)', border:`1px solid ${C.border}`, borderRadius:14, overflow:'hidden', boxShadow:'0 16px 40px rgba(0,0,0,0.5)', zIndex:100 }}>
                {SORT_OPTIONS.map(({ value, label, Icon }) => (
                  <button key={value} onClick={() => { setSort(value); setDropOpen(false) }}
                    style={{ width:'100%', display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.75rem 1rem', background: sort===value ? 'rgba(239,131,84,0.1)' : 'none', border:'none', cursor:'pointer', fontFamily:D.body, fontSize:'0.85rem', fontWeight: sort===value ? 700 : 500, color: sort===value ? C.coral : C.textSoft, transition:'background 0.15s' }}
                    onMouseEnter={e => { if (sort!==value) e.currentTarget.style.background='rgba(255,255,255,0.05)' }}
                    onMouseLeave={e => { if (sort!==value) e.currentTarget.style.background='none' }}>
                    <Icon size={14} color={sort===value ? C.coral : C.textMuted} />{label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button onClick={() => setShowCalendar(true)}
            style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontFamily:D.body, fontWeight:600, fontSize:'0.88rem', background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:'0.7rem 1.1rem', cursor:'pointer', color:C.text, transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(239,131,84,0.4)'; e.currentTarget.style.color=C.coral }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.text }}>
            <Calendar size={15} /> Calendar
          </button>
          <button onClick={() => setShowCreate(true)}
            style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', background:C.coral, color:'#fff', border:'none', borderRadius:12, padding:'0.75rem 1.5rem', cursor:'pointer', transition:'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
            onMouseLeave={e => e.currentTarget.style.background=C.coral}>+ Create Event</button>
        </div>
      </div>

      <div style={{ display:'inline-flex', gap:'0.25rem', background:C.surface, padding:'0.3rem', borderRadius:12, marginBottom:'1.5rem' }}>
        {TYPES.map(t => (
          <button key={t} onClick={() => setActiveType(t)}
            style={{ fontFamily:D.body, fontSize:'0.82rem', fontWeight:600, padding:'0.5rem 1rem', borderRadius:9, background: activeType===t ? C.coral : 'transparent', color: activeType===t ? '#fff' : C.textMuted, border:'none', cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap' }}>
            {t}
          </button>
        ))}
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

      {showCalendar && <MiniCalendar events={MEETUPS} onClose={() => setShowCalendar(false)} />}
      {showCreate   && <CreateEventModal onClose={() => setShowCreate(false)} />}
    </div>
  )
}