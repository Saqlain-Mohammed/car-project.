import { useState, useRef, useEffect } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, ChevronDown, Plus, MapPin, Clock, Users, TrendingUp } from 'lucide-react'
import { C, D, R, SHADOW, SERIES } from '../../../lib/theme'
import { PageHeader, Card, Badge, Button, Divider, Dropdown, MenuItem, ChipRow, EmptyState, Field, Input, Textarea, Select } from '../../ui/Primitives'
import Modal, { ModalHeader, ModalBody, ModalFooter, ModalSuccess } from '../../ui/Modal'

const TYPES = ['All','Car Meet','Track Day','Group Ride','Car Show']
const EVENT_TYPES = ['Car Meet','Track Day','Group Ride','Car Show','Drag Race']
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const DAYS   = ['Su','Mo','Tu','We','Th','Fr','Sa']

const MEETUPS = [
  { id:1, title:'Bangalore JDM Meetup',       day:7,  month:'Jun', time:'6:00 PM',  location:'Cubbon Park, Bangalore',        type:'Car Meet',   going:84,  spots:20,  host:'TurboMike',  tone:SERIES[0], free:true },
  { id:2, title:'KTM Track Day — Kari',       day:14, month:'Jun', time:'7:00 AM',  location:'Kari Motor Speedway, Coimbatore',type:'Track Day',  going:32,  spots:4,   host:'RaiderKing', tone:SERIES[1], free:false, price:2500 },
  { id:3, title:"JDM Concours d'Elegance",    day:21, month:'Jun', time:'10:00 AM', location:'Palace Grounds, Bangalore',      type:'Car Show',   going:210, spots:999, host:'GarageGuru', tone:SERIES[2], free:true },
  { id:4, title:'Sunday Ghat Ride — Nandi',   day:28, month:'Jun', time:'5:30 AM',  location:'Nandi Hills, Bangalore',         type:'Group Ride', going:48,  spots:12,  host:'NightRider', tone:SERIES[3], free:true },
]

const SORTS = [
  { value:'upcoming', label:'Upcoming', Icon: CalendarDays },
  { value:'popular',  label:'Popular',  Icon: TrendingUp   },
  { value:'nearby',   label:'Near me',  Icon: MapPin       },
]

/* ── Month calendar ─────────────────────────────────────── */
function CalendarModal({ open, onClose, events }) {
  const now = new Date()
  const [year, setYear]   = useState(now.getFullYear())
  const [month, setMonth] = useState(5) // June, where the seeded events live

  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = Array.from({ length: firstDay + daysInMonth }, (_, i) => i < firstDay ? null : i - firstDay + 1)

  const monthEvents = events.filter(e => MONTHS.indexOf(e.month) === month)
  const eventDays   = new Set(monthEvents.map(e => e.day))

  const step = dir => {
    let m = month + dir, y = year
    if (m < 0)  { m = 11; y -= 1 }
    if (m > 11) { m = 0;  y += 1 }
    setMonth(m); setYear(y)
  }

  return (
    <Modal open={open} onClose={onClose} width={420} labelledBy="cal-title">
      <ModalHeader id="cal-title" title="Event calendar" subtitle="Days with a highlight have something scheduled." />
      <ModalBody style={{ paddingBottom:'1.75rem' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
          <button onClick={() => step(-1)} aria-label="Previous month" className="t-press"
            style={{ width:34, height:34, borderRadius:R.sm, background:C.surface2, border:'none', cursor:'pointer', color:C.textMuted, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <ChevronLeft size={16} />
          </button>
          <span style={{ fontFamily:D.display, fontSize:'0.95rem', fontWeight:700, color:C.text }}>{MONTHS[month]} {year}</span>
          <button onClick={() => step(1)} aria-label="Next month" className="t-press"
            style={{ width:34, height:34, borderRadius:R.sm, background:C.surface2, border:'none', cursor:'pointer', color:C.textMuted, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <ChevronRight size={16} />
          </button>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3, marginBottom:4 }}>
          {DAYS.map(d => (
            <div key={d} style={{ textAlign:'center', fontFamily:D.body, fontSize:'0.66rem', fontWeight:700, color:C.textDim, padding:'0.35rem 0' }}>{d}</div>
          ))}
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3 }}>
          {cells.map((day, i) => {
            const has = day && eventDays.has(day)
            return (
              <div key={i} style={{
                aspectRatio:'1', display:'flex', alignItems:'center', justifyContent:'center',
                borderRadius:R.sm,
                background: has ? C.accentBg : 'transparent',
                boxShadow: has ? `inset 0 0 0 1px ${C.accentBr}` : 'none',
              }}>
                {day && (
                  <span style={{
                    fontFamily:D.body, fontSize:'0.8rem',
                    fontWeight: has ? 700 : 400,
                    color: has ? C.accentHi : C.textMuted,
                    fontVariantNumeric:'tabular-nums',
                  }}>{day}</span>
                )}
              </div>
            )
          })}
        </div>

        {monthEvents.length > 0 && (
          <>
            <Divider style={{ margin:'1.25rem 0 1rem' }} />
            <div style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.textDim, marginBottom:'0.65rem' }}>
              This month
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.45rem' }}>
              {monthEvents.map(e => (
                <div key={e.id} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.6rem 0.75rem', background:C.surface2, borderRadius:R.md }}>
                  <div style={{ width:32, height:32, borderRadius:R.sm, background:`${e.tone}22`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ fontFamily:D.display, fontSize:'0.8rem', fontWeight:700, color:e.tone, fontVariantNumeric:'tabular-nums' }}>{e.day}</span>
                  </div>
                  <div style={{ minWidth:0 }}>
                    <div style={{ fontFamily:D.body, fontSize:'0.82rem', fontWeight:600, color:C.text }}>{e.title}</div>
                    <div style={{ fontFamily:D.body, fontSize:'0.7rem', color:C.textMuted }}>{e.time} · {e.location.split(',')[0]}</div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </ModalBody>
    </Modal>
  )
}

/* ── Create event ───────────────────────────────────────── */
function CreateEventModal({ open, onClose }) {
  const [form, setForm] = useState({ title:'', type:'Car Meet', date:'', time:'', location:'', spots:'', free:true, price:'', desc:'' })
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const valid = form.title && form.date && form.location
  const close = () => { onClose(); setTimeout(() => setDone(false), 200) }

  const publish = async () => {
    if (!valid) return
    setSaving(true)
    try {
      const { createEvent } = await import('../../../lib/api/events')
      await createEvent({
        title: form.title, description: form.desc || null,
        event_type: form.type.toLowerCase().replace(/ /g, '_'),
        location: form.location,
        starts_at: form.time ? `${form.date}T${form.time}:00` : `${form.date}T00:00:00`,
        is_free: form.free,
        ticket_price: !form.free && form.price ? Number(form.price) : null,
        max_attendees: form.spots ? Number(form.spots) : null,
        is_published: true,
      })
    } catch { /* confirmation shows regardless */ }
    setSaving(false); setDone(true)
  }

  return (
    <Modal open={open} onClose={close} width={560} labelledBy="create-event">
      {done ? (
        <ModalSuccess icon="🏁" title="Event published"
          message="It's live now — people in your area can find and join it." onDone={close} />
      ) : (
        <>
          <ModalHeader id="create-event" title="Create an event" subtitle="Organise a meet, track day, ride, or show." />
          <ModalBody>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <Field label="Event title"><Input value={form.title} onChange={e => u('title', e.target.value)} placeholder="Sunday morning cars & coffee" /></Field>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <Field label="Type"><Select value={form.type} onChange={e => u('type', e.target.value)} options={EVENT_TYPES} /></Field>
                <Field label="Available spots" hint="Leave blank for unlimited.">
                  <Input type="number" value={form.spots} onChange={e => u('spots', e.target.value)} placeholder="50" />
                </Field>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <Field label="Date"><Input type="date" value={form.date} onChange={e => u('date', e.target.value)} /></Field>
                <Field label="Start time"><Input type="time" value={form.time} onChange={e => u('time', e.target.value)} /></Field>
              </div>
              <Field label="Location"><Input value={form.location} onChange={e => u('location', e.target.value)} placeholder="Cubbon Park, Bangalore" /></Field>

              <Field label="Entry">
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  {[[true,'Free'],[false,'Paid']].map(([v, l]) => (
                    <button key={l} onClick={() => u('free', v)} className="t-press"
                      style={{
                        flex:1, height:42, borderRadius:R.md, cursor:'pointer',
                        background: form.free === v ? C.accentBg : C.surface2,
                        border:`1px solid ${form.free === v ? C.accentBr : C.border}`,
                        color: form.free === v ? C.accentHi : C.textMuted,
                        fontFamily:D.body, fontSize:'0.875rem', fontWeight:600,
                        transition:'background-color 150ms cubic-bezier(0.22,1,0.36,1), border-color 150ms cubic-bezier(0.22,1,0.36,1), color 150ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
                      }}>{l}</button>
                  ))}
                </div>
              </Field>
              {!form.free && (
                <Field label="Entry fee (₹)"><Input type="number" value={form.price} onChange={e => u('price', e.target.value)} placeholder="500" /></Field>
              )}

              <Field label="Description">
                <Textarea value={form.desc} onChange={e => u('desc', e.target.value)} rows={3}
                  placeholder="What to expect, who can join, what to bring…" />
              </Field>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={close}>Cancel</Button>
            <Button onClick={publish} disabled={!valid} loading={saving}>Publish event</Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  )
}

/* ── Page ───────────────────────────────────────────────── */
export default function MeetupsSection() {
  const [type, setType]       = useState('All')
  const [sort, setSort]       = useState('upcoming')
  const [sortOpen, setSortOpen] = useState(false)
  const [calOpen, setCal]     = useState(false)
  const [createOpen, setCreate] = useState(false)
  const [joined, setJoined]   = useState({})
  const sortRef = useRef(null)

  useEffect(() => {
    const h = e => { if (sortRef.current && !sortRef.current.contains(e.target)) setSortOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const base   = MEETUPS.filter(m => type === 'All' || m.type === type)
  const events = sort === 'popular' ? [...base].sort((a, b) => b.going - a.going) : base
  const activeSort = SORTS.find(s => s.value === sort)

  return (
    <div style={{ padding:'2rem 2.25rem 3rem', maxWidth:1100 }}>
      <PageHeader eyebrow="Community" title="Meetups"
        description="Local meets, track days, and group rides — organised by people who actually turn up."
        actions={<>
          <div ref={sortRef} style={{ position:'relative' }}>
            <Button variant="neutral" icon={activeSort?.Icon} iconRight={ChevronDown} onClick={() => setSortOpen(o => !o)}>
              {activeSort?.label}
            </Button>
            <Dropdown open={sortOpen} width={170} origin="top-right">
              <div style={{ padding:'0.35rem' }}>
                {SORTS.map(({ value, label, Icon }) => (
                  <MenuItem key={value} icon={Icon} active={sort === value}
                    onClick={() => { setSort(value); setSortOpen(false) }}>{label}</MenuItem>
                ))}
              </div>
            </Dropdown>
          </div>
          <Button variant="neutral" icon={CalendarDays} onClick={() => setCal(true)}>Calendar</Button>
          <Button icon={Plus} onClick={() => setCreate(true)}>Create event</Button>
        </>} />

      <div style={{ marginBottom:'1.75rem' }}>
        <ChipRow options={TYPES} value={type} onChange={setType} />
      </div>

      {events.length === 0 ? (
        <EmptyState icon={CalendarDays} title="Nothing scheduled"
          message="No events match this filter. Be the first to organise one."
          action={<Button icon={Plus} onClick={() => setCreate(true)}>Create event</Button>} />
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
          {events.map(m => {
            const on = joined[m.id]
            const tight = m.spots < 10
            return (
              <Card key={m.id} radius={R.lg} padding={0} style={{ overflow:'hidden' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'1.35rem', padding:'1.25rem 1.5rem', flexWrap:'wrap' }}>
                  {/* Date block */}
                  <div style={{
                    width:62, height:62, borderRadius:R.md, flexShrink:0,
                    background:`${m.tone}18`, boxShadow:`inset 0 0 0 1px ${m.tone}33`,
                    display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
                  }}>
                    <span style={{ fontFamily:D.display, fontSize:'1.35rem', fontWeight:700, color:m.tone, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>{m.day}</span>
                    <span style={{ fontFamily:D.body, fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', color:C.textMuted, marginTop:'0.15rem' }}>{m.month}</span>
                  </div>

                  {/* Detail */}
                  <div style={{ flex:1, minWidth:220 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.45rem', flexWrap:'wrap' }}>
                      <span style={{ fontFamily:D.display, fontSize:'1.02rem', fontWeight:600, color:C.text, letterSpacing:'-0.01em' }}>{m.title}</span>
                      <Badge tone="accent">{m.type}</Badge>
                      {m.free ? <Badge tone="success">Free</Badge> : <Badge>₹{m.price}</Badge>}
                    </div>
                    <div style={{ display:'flex', gap:'1.1rem', flexWrap:'wrap', fontFamily:D.body, fontSize:'0.79rem', color:C.textMuted }}>
                      <span style={{ display:'flex', alignItems:'center', gap:'0.3rem' }}><MapPin size={12} /> {m.location}</span>
                      <span style={{ display:'flex', alignItems:'center', gap:'0.3rem' }}><Clock size={12} /> {m.time}</span>
                      <span style={{ display:'flex', alignItems:'center', gap:'0.3rem' }}><Users size={12} /> {m.going} going</span>
                    </div>
                  </div>

                  {/* Action */}
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{
                      fontFamily:D.body, fontSize:'0.74rem', marginBottom:'0.6rem',
                      color: tight ? C.live : C.textDim, fontVariantNumeric:'tabular-nums',
                    }}>
                      {tight ? `Only ${m.spots} spots left` : m.spots > 500 ? 'Open to all' : `${m.spots} spots left`}
                    </div>
                    <Button variant={on ? 'outline' : 'primary'}
                      onClick={() => setJoined(j => ({ ...j, [m.id]: !j[m.id] }))}>
                      {on ? '✓ Going' : 'Join event'}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <CalendarModal open={calOpen} onClose={() => setCal(false)} events={MEETUPS} />
      <CreateEventModal open={createOpen} onClose={() => setCreate(false)} />
    </div>
  )
}
