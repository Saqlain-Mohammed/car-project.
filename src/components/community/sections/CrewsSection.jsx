import { useState } from 'react'
import { Users, MapPin, Trophy, Plus, ShieldCheck, CalendarDays } from 'lucide-react'
import { C, D, R, SHADOW, SERIES } from '../../../lib/theme'
import { PageHeader, Card, Badge, Avatar, Button, Divider, ChipRow, EmptyState, Field, Input, Textarea, Select, useSticky } from '../../ui/Primitives'
import Modal, { ModalHeader, ModalBody, ModalFooter, ModalSuccess } from '../../ui/Modal'

const TYPES = ['All','Crew','Club']
const CREW_TYPES = ['Crew','Club']

const CREWS = [
  { id:1, name:'Bangalore JDM Collective', slug:'bangalore-jdm', type:'Crew', city:'Bangalore, Karnataka',
    members:247, events:47, founded:'March 2021', verified:true, tone:SERIES[0],
    desc:'The largest JDM community in South India. Weekly meets, organised track days, and group wrenching sessions on weekends.',
    tags:['JDM','Weekly meets','Track days','Open to all'],
    core:['TurboMike','GhostLap','DriftQueen','LapQueen'],
    wins:['Passed 200 members','Best JDM Crew 2024','Annual Concours winner'] },
  { id:2, name:'South India Drift Academy', slug:'south-india-drift', type:'Club', city:'Hyderabad, Telangana',
    members:89, events:23, founded:'August 2022', verified:true, tone:SERIES[3],
    desc:'Official drift training and practice crew. Open to all skill levels, safety briefing mandatory before every session.',
    tags:['Drift','Training','Competitive'],
    core:['DriftQueen','ZeroShift','IronBlock'],
    wins:['Regional Drift Champions 2023','50+ training sessions run'] },
  { id:3, name:'Royal Riders South India', slug:'royal-riders-si', type:'Crew', city:'Chennai, Tamil Nadu',
    members:1240, events:89, founded:'January 2020', verified:true, tone:SERIES[1],
    desc:'The biggest Royal Enfield community in the south. Monthly ghat rides and an annual pan-India rally.',
    tags:['Bikes','Touring','Monthly rides'],
    core:['RaiderKing','NightRider','RoadKing'],
    wins:['Largest bike community in South India','10,000km group ride'] },
  { id:4, name:'Track Day Coimbatore', slug:'track-day-cbe', type:'Club', city:'Coimbatore, Tamil Nadu',
    members:156, events:31, founded:'June 2022', verified:false, tone:SERIES[2],
    desc:'Kari Motor Speedway regulars. Timing, coaching, and friendly competition for anyone who wants to go faster.',
    tags:['Track','Timing','Coaching'],
    core:['ApexHunter','TurboMike','GhostLap'],
    wins:['Kari track day partners','25+ sessions run'] },
]

/* ── Crew detail ────────────────────────────────────────── */
function CrewModal({ crew: crewProp, onClose, joined, onToggle }) {
  const crew = useSticky(crewProp)
  if (!crew) return null
  return (
    <Modal open={!!crewProp} onClose={onClose} width={580} labelledBy="crew-title">
      <div style={{ overflowY:'auto' }}>
        <div style={{ height:4, background:`linear-gradient(to right, ${crew.tone}, transparent)` }} />
        <div style={{ padding:'1.75rem' }}>
          <div style={{ display:'flex', gap:'1rem', alignItems:'flex-start', marginBottom:'1.25rem' }}>
            <div style={{ width:58, height:58, borderRadius:R.md, background:`${crew.tone}1F`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Users size={26} color={crew.tone} />
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.2rem', flexWrap:'wrap' }}>
                <h2 id="crew-title" style={{ fontFamily:D.display, fontSize:'1.3rem', fontWeight:700, color:C.text, letterSpacing:'-0.015em' }}>{crew.name}</h2>
                {crew.verified && <ShieldCheck size={15} color={C.success} />}
              </div>
              <div style={{ fontFamily:D.body, fontSize:'0.78rem', color:crew.tone, marginBottom:'0.5rem' }}>@{crew.slug}</div>
              <div style={{ display:'flex', gap:'1.25rem' }}>
                {[[crew.members, 'Members'], [crew.events, 'Events']].map(([v, l]) => (
                  <div key={l}>
                    <span style={{ fontFamily:D.display, fontSize:'1.05rem', fontWeight:700, color:C.text, fontVariantNumeric:'tabular-nums' }}>{v.toLocaleString()} </span>
                    <span style={{ fontFamily:D.body, fontSize:'0.73rem', color:C.textMuted }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p style={{ fontFamily:D.body, fontSize:'0.9rem', color:C.textSoft, lineHeight:1.7, marginBottom:'1.25rem' }}>{crew.desc}</p>

          <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
            {crew.tags.map(t => <Badge key={t} tone="accent">{t}</Badge>)}
          </div>

          <div style={{ marginBottom:'1.5rem' }}>
            <div style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.textDim, marginBottom:'0.7rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
              <Users size={12} /> Core members
            </div>
            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
              {crew.core.map(m => (
                <div key={m} style={{ display:'flex', alignItems:'center', gap:'0.45rem', background:C.surface2, borderRadius:R.full, padding:'0.25rem 0.7rem 0.25rem 0.25rem' }}>
                  <Avatar name={m} size={22} tone={crew.tone} />
                  <span style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textSoft }}>{m}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ marginBottom:'1.75rem' }}>
            <div style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.textDim, marginBottom:'0.7rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
              <Trophy size={12} /> Achievements
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.45rem' }}>
              {crew.wins.map(w => (
                <div key={w} style={{ display:'flex', alignItems:'center', gap:'0.6rem', padding:'0.6rem 0.85rem', background:C.surface2, borderRadius:R.md }}>
                  <Trophy size={14} color={C.live} style={{ flexShrink:0 }} />
                  <span style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.textSoft }}>{w}</span>
                </div>
              ))}
            </div>
          </div>

          <Divider style={{ marginBottom:'1.25rem' }} />

          <div style={{ display:'flex', gap:'1.25rem', marginBottom:'1.5rem', fontFamily:D.body, fontSize:'0.8rem', color:C.textMuted, flexWrap:'wrap' }}>
            <span style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}><MapPin size={13} /> {crew.city}</span>
            <span style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}><CalendarDays size={13} /> Founded {crew.founded}</span>
          </div>

          <Button fullWidth size="lg" variant={joined ? 'outline' : 'primary'} onClick={onToggle}>
            {joined ? '✓ You are a member' : `Join ${crew.name}`}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

/* ── Create crew ────────────────────────────────────────── */
function CreateCrewModal({ open, onClose }) {
  const [form, setForm] = useState({ name:'', type:'Crew', city:'', desc:'' })
  const [done, setDone] = useState(false)
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const valid = form.name && form.city
  const close = () => { onClose(); setTimeout(() => setDone(false), 200) }

  return (
    <Modal open={open} onClose={close} width={520} labelledBy="create-crew">
      {done ? (
        <ModalSuccess icon="🤝" title="Crew created"
          message={`${form.name} is live. Invite people and start organising.`} onDone={close} />
      ) : (
        <>
          <ModalHeader id="create-crew" title="Start a crew" subtitle="Bring your local scene together in one place." />
          <ModalBody>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <Field label="Crew name"><Input value={form.name} onChange={e => u('name', e.target.value)} placeholder="Bangalore JDM Collective" /></Field>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <Field label="Type"><Select value={form.type} onChange={e => u('type', e.target.value)} options={CREW_TYPES} /></Field>
                <Field label="City"><Input value={form.city} onChange={e => u('city', e.target.value)} placeholder="Bangalore" /></Field>
              </div>
              <Field label="Description" hint="What the crew is about and who should join.">
                <Textarea value={form.desc} onChange={e => u('desc', e.target.value)} rows={3}
                  placeholder="Weekly meets, track days, and a lot of spare parts changing hands…" />
              </Field>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={close}>Cancel</Button>
            <Button onClick={() => setDone(true)} disabled={!valid}>Create crew</Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  )
}

/* ── Page ───────────────────────────────────────────────── */
export default function CrewsSection() {
  const [type, setType]       = useState('All')
  const [detail, setDetail]   = useState(null)
  const [createOpen, setCreate] = useState(false)
  const [memberships, setMemberships] = useState({ 2: true })

  const visible = CREWS.filter(c => type === 'All' || c.type === type)
  const toggle = id => setMemberships(m => ({ ...m, [id]: !m[id] }))

  return (
    <div style={{ padding:'2rem 2.25rem 3rem', maxWidth:1200 }}>
      <PageHeader eyebrow="Community" title="Crews & Clubs"
        description="Find your local scene, or start one. Every crew has its own chat, events, and member roster."
        actions={<Button icon={Plus} onClick={() => setCreate(true)}>Start a crew</Button>} />

      <div style={{ marginBottom:'1.75rem' }}>
        <ChipRow options={TYPES} value={type} onChange={setType} />
      </div>

      {visible.length === 0 ? (
        <EmptyState icon={Users} title="No crews here yet"
          message="Nothing matches this filter. Start the first one for your city."
          action={<Button icon={Plus} onClick={() => setCreate(true)}>Start a crew</Button>} />
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(310px,1fr))', gap:'1.15rem' }}>
          {visible.map(crew => {
            const joined = memberships[crew.id]
            return (
              <Card key={crew.id} hover onClick={() => setDetail(crew)} padding={0} radius={R.lg} style={{ overflow:'hidden' }}>
                <div style={{ height:3, background:crew.tone }} />
                <div style={{ padding:'1.25rem' }}>
                  <div style={{ display:'flex', alignItems:'flex-start', gap:'0.85rem', marginBottom:'0.9rem' }}>
                    <div style={{ width:44, height:44, borderRadius:R.md, background:`${crew.tone}1F`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Users size={20} color={crew.tone} />
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.15rem' }}>
                        <span style={{ fontFamily:D.display, fontSize:'0.975rem', fontWeight:600, color:C.text, letterSpacing:'-0.01em' }}>{crew.name}</span>
                        {crew.verified && <ShieldCheck size={13} color={C.success} style={{ flexShrink:0 }} />}
                      </div>
                      <div style={{ fontFamily:D.body, fontSize:'0.74rem', color:C.textMuted, display:'flex', alignItems:'center', gap:'0.3rem' }}>
                        <MapPin size={11} /> {crew.city}
                      </div>
                    </div>
                  </div>

                  <p style={{ fontFamily:D.body, fontSize:'0.83rem', color:C.textMuted, lineHeight:1.6, marginBottom:'1rem',
                    display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical', overflow:'hidden' }}>
                    {crew.desc}
                  </p>

                  <div style={{ display:'flex', gap:'0.35rem', flexWrap:'wrap', marginBottom:'1rem' }}>
                    {crew.tags.slice(0, 3).map(t => <Badge key={t}>{t}</Badge>)}
                  </div>

                  <Divider style={{ marginBottom:'0.9rem' }} />

                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'0.75rem' }}>
                    <div style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted, fontVariantNumeric:'tabular-nums' }}>
                      <span style={{ color:C.text, fontWeight:600 }}>{crew.members.toLocaleString()}</span> members
                    </div>
                    <Button size="sm" variant={joined ? 'outline' : 'primary'}
                      onClick={e => { e.stopPropagation(); toggle(crew.id) }}>
                      {joined ? '✓ Joined' : 'Join'}
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {detail && (
        <CrewModal crew={detail} onClose={() => setDetail(null)}
          joined={memberships[detail.id]} onToggle={() => toggle(detail.id)} />
      )}
      <CreateCrewModal open={createOpen} onClose={() => setCreate(false)} />
    </div>
  )
}
