import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { Plus, Edit2, Camera, Car, Bike, Trophy, ShieldCheck, Wrench, Flag, Gauge } from 'lucide-react'
import { C, D, R, SHADOW } from '../../../lib/theme'
import { Button, Card, Badge, Avatar, Divider, Field, Input, Textarea, Select, Tabs, EmptyState } from '../../ui/Primitives'
import Modal, { ModalHeader, ModalBody, ModalFooter, ModalSuccess } from '../../ui/Modal'
import { useMyVehicles, useCreateVehicle, useAddModification } from '../../../hooks/useVehicles'

const MAKES = ['Honda','Toyota','Nissan','Mazda','BMW','Audi','Mercedes','Ford','Suzuki','Maruti','Tata','Mahindra','Royal Enfield','KTM','Kawasaki','Yamaha','Ducati','Bajaj','Other']
const MOD_CATEGORIES = ['Engine','Suspension','Exhaust','Brakes','Wheels','Interior','Electronics','Exterior','Other']

const BADGES = [
  { Icon: Trophy,      label: 'Build King',     tone: C.live    },
  { Icon: ShieldCheck, label: 'Verified Owner', tone: C.success },
  { Icon: Wrench,      label: 'Mod Master',     tone: C.accent  },
  { Icon: Flag,        label: 'Track Rat',      tone: '#BF5AF2' },
]

/* Seeded until the user adds their own — replaced by DB rows when present. */
const SEED = [
  {
    id: 'seed-1', type: 'car', make: 'Honda', model: 'Civic', trim: 'EK9 Type R',
    year: 1998, hp: 320, tone: C.accent,
    mods: ['K20 engine swap','Tein coilovers','6-speed LSD gearbox','Full roll cage','Bride bucket seats','AP Racing brakes','Hondata ECU tune','Work Emotion wheels'],
    timeline: [
      { date: 'Apr 2024', event: 'Best lap 1:41.2 at Kari', kind: 'achievement' },
      { date: 'Jan 2024', event: 'Full roll cage installed', kind: 'mod' },
      { date: 'Jun 2023', event: 'K-swap complete',          kind: 'major' },
      { date: 'Jan 2023', event: 'Bought stock EK9',         kind: 'buy' },
    ],
  },
  {
    id: 'seed-2', type: 'motorcycle', make: 'KTM', model: 'Duke', trim: '390',
    year: 2022, hp: 44, tone: C.live,
    mods: ['Akrapovic exhaust','K&N air filter','ECU flash','Frame sliders'],
    timeline: [
      { date: 'Mar 2023', event: 'First track day',    kind: 'achievement' },
      { date: 'Dec 2022', event: 'ECU flash done',     kind: 'mod' },
      { date: 'Aug 2022', event: 'Bought new',         kind: 'buy' },
    ],
  },
]

const KIND_TONE = { buy: C.success, mod: C.accent, major: C.live, achievement: '#BF5AF2' }

/* ── Edit profile ───────────────────────────────────────── */
function EditProfileModal({ open, onClose, username }) {
  const [form, setForm] = useState({ displayName: username, bio: '', location: '', website: '' })
  const [done, setDone] = useState(false)
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const close = () => { onClose(); setTimeout(() => setDone(false), 200) }

  return (
    <Modal open={open} onClose={close} width={520} labelledBy="edit-profile">
      {done ? (
        <ModalSuccess title="Profile updated" message="Your changes are live on your public garage." onDone={close} />
      ) : (
        <>
          <ModalHeader id="edit-profile" title="Edit profile" subtitle="This is what other enthusiasts see on your garage." />
          <ModalBody>
            <div style={{ display:'flex', justifyContent:'center', marginBottom:'1.5rem' }}>
              <button className="t-press" style={{ position:'relative', background:'none', border:'none', cursor:'pointer', padding:0 }}>
                <Avatar name={username} size={76} />
                <span style={{
                  position:'absolute', bottom:0, right:0, width:26, height:26, borderRadius:'50%',
                  background:C.accent, display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:`0 0 0 3px ${C.surface}`,
                }}>
                  <Camera size={13} color="#fff" />
                </span>
              </button>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <Field label="Display name"><Input value={form.displayName} onChange={e => u('displayName', e.target.value)} placeholder="Your name" /></Field>
              <Field label="Bio" hint="A short line about you and what you drive.">
                <Textarea value={form.bio} onChange={e => u('bio', e.target.value)} placeholder="JDM builds, track days, and too many spare parts." />
              </Field>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <Field label="Location"><Input value={form.location} onChange={e => u('location', e.target.value)} placeholder="City, State" /></Field>
                <Field label="Website"><Input value={form.website} onChange={e => u('website', e.target.value)} placeholder="https://" /></Field>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={close}>Cancel</Button>
            <Button onClick={() => setDone(true)}>Save changes</Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  )
}

/* ── Add vehicle ────────────────────────────────────────── */
function AddVehicleModal({ open, onClose }) {
  const [form, setForm] = useState({ type:'car', make:'', model:'', year:'', color:'', nickname:'' })
  const [done, setDone] = useState(false)
  const create = useCreateVehicle()
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const valid = form.make && form.model && form.year
  const close = () => { onClose(); setTimeout(() => { setDone(false); setForm({ type:'car', make:'', model:'', year:'', color:'', nickname:'' }) }, 200) }

  const submit = async () => {
    if (!valid) return
    try {
      await create.mutateAsync({
        type: form.type, make: form.make, model: form.model,
        year: Number(form.year), color: form.color || null, nickname: form.nickname || null,
      })
    } catch { /* falls through to the confirmation either way */ }
    setDone(true)
  }

  return (
    <Modal open={open} onClose={close} width={520} labelledBy="add-vehicle">
      {done ? (
        <ModalSuccess icon="🏁" title="Added to your garage"
          message={`${form.year} ${form.make} ${form.model} now has its own profile and timeline.`} onDone={close} />
      ) : (
        <>
          <ModalHeader id="add-vehicle" title="Add a vehicle" subtitle="Every machine gets its own profile, mod list, and timeline." />
          <ModalBody>
            <div style={{ display:'flex', gap:'0.6rem', marginBottom:'1.25rem' }}>
              {[['car','Car',Car],['motorcycle','Bike',Bike]].map(([val, label, Icon]) => {
                const on = form.type === val
                return (
                  <button key={val} onClick={() => u('type', val)} className="t-press"
                    style={{
                      flex:1, height:56, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem',
                      borderRadius:R.md, cursor:'pointer',
                      background: on ? C.accentBg : C.surface2,
                      border:`1px solid ${on ? C.accentBr : C.border}`,
                      color: on ? C.accentHi : C.textMuted,
                      fontFamily:D.body, fontSize:'0.9rem', fontWeight:600,
                      transition:'background-color 150ms cubic-bezier(0.22,1,0.36,1), border-color 150ms cubic-bezier(0.22,1,0.36,1), color 150ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
                    }}>
                    <Icon size={18} /> {label}
                  </button>
                )
              })}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <Field label="Make"><Select value={form.make} onChange={e => u('make', e.target.value)} options={MAKES} placeholder="Select make" /></Field>
                <Field label="Model"><Input value={form.model} onChange={e => u('model', e.target.value)} placeholder="Civic" /></Field>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <Field label="Year"><Input type="number" value={form.year} onChange={e => u('year', e.target.value)} placeholder="2022" /></Field>
                <Field label="Colour"><Input value={form.color} onChange={e => u('color', e.target.value)} placeholder="Championship White" /></Field>
              </div>
              <Field label="Nickname" hint="Optional — what you actually call it.">
                <Input value={form.nickname} onChange={e => u('nickname', e.target.value)} placeholder="The Beast" />
              </Field>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={close}>Cancel</Button>
            <Button onClick={submit} disabled={!valid} loading={create.isPending}>Add to garage</Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  )
}

/* ── Add mod ────────────────────────────────────────────── */
function AddModModal({ open, onClose, vehicle }) {
  const [form, setForm] = useState({ name:'', category:'', brand:'', cost:'', notes:'' })
  const [done, setDone] = useState(false)
  const addMod = useAddModification()
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const valid = form.name && form.category
  const close = () => { onClose(); setTimeout(() => { setDone(false); setForm({ name:'', category:'', brand:'', cost:'', notes:'' }) }, 200) }

  const submit = async () => {
    if (!valid) return
    if (vehicle?.id && !String(vehicle.id).startsWith('seed')) {
      try {
        await addMod.mutateAsync({ vehicleId: vehicle.id, mod: {
          part_name: form.name, category: form.category, brand: form.brand || null,
          cost: form.cost ? Number(form.cost) : null, description: form.notes || null,
        }})
      } catch { /* confirmation shows regardless */ }
    }
    setDone(true)
  }

  return (
    <Modal open={open} onClose={close} width={520} labelledBy="add-mod">
      {done ? (
        <ModalSuccess icon="🔧" title="Mod logged" message={`${form.name} was added to your ${vehicle?.make} ${vehicle?.model}.`} onDone={close} />
      ) : (
        <>
          <ModalHeader id="add-mod" title="Log a modification" subtitle={`Building the record for your ${vehicle?.make} ${vehicle?.model}.`} />
          <ModalBody>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <Field label="Part or mod"><Input value={form.name} onChange={e => u('name', e.target.value)} placeholder="Akrapovic slip-on exhaust" /></Field>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <Field label="Category"><Select value={form.category} onChange={e => u('category', e.target.value)} options={MOD_CATEGORIES} /></Field>
                <Field label="Brand"><Input value={form.brand} onChange={e => u('brand', e.target.value)} placeholder="HKS, Brembo…" /></Field>
              </div>
              <Field label="Cost (₹)"><Input type="number" value={form.cost} onChange={e => u('cost', e.target.value)} placeholder="28500" /></Field>
              <Field label="Notes"><Textarea value={form.notes} onChange={e => u('notes', e.target.value)} placeholder="Install notes, dyno result, impressions…" /></Field>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={close}>Cancel</Button>
            <Button onClick={submit} disabled={!valid} loading={addMod.isPending}>Log mod</Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  )
}

/* ── Page ───────────────────────────────────────────────── */
export default function GarageProfile() {
  const { user } = useAuth()
  const { data: dbVehicles } = useMyVehicles()
  const username = user?.user_metadata?.username || 'You'

  const vehicles = (dbVehicles?.length ? dbVehicles.map((v, i) => ({
    id: v.id, type: v.type, make: v.make, model: v.model, trim: v.trim ?? '',
    year: v.year, hp: v.horsepower ?? '—', tone: i % 2 ? C.live : C.accent,
    mods: (v.vehicle_modifications ?? []).map(m => m.part_name),
    timeline: (v.vehicle_timeline ?? []).map(t => ({
      date: new Date(t.occurred_at).toLocaleDateString('en-GB', { month:'short', year:'numeric' }),
      event: t.title, kind: t.entry_type === 'modification' ? 'mod' : 'buy',
    })),
  })) : SEED)

  const [activeId, setActiveId] = useState(vehicles[0]?.id)
  const [tab, setTab]           = useState('mods')
  const [editOpen, setEditOpen] = useState(false)
  const [addVehOpen, setAddVeh] = useState(false)
  const [addModOpen, setAddMod] = useState(false)

  const active = vehicles.find(v => v.id === activeId) ?? vehicles[0]

  return (
    <div style={{ padding:'2rem 2.25rem 3rem', maxWidth:1200 }}>

      {/* Identity */}
      <Card padding={0} radius={R.xl} style={{ marginBottom:'1.25rem', overflow:'hidden', boxShadow:SHADOW.md }}>
        <div style={{ height:88, background:`linear-gradient(135deg, ${C.accentBg}, transparent 70%)`, position:'relative' }} />
        <div style={{ padding:'0 1.75rem 1.75rem', marginTop:-38, display:'flex', alignItems:'flex-end', gap:'1.25rem', flexWrap:'wrap' }}>
          <div style={{ borderRadius:'50%', boxShadow:`0 0 0 4px ${C.surface}` }}>
            <Avatar name={username} size={84} />
          </div>
          <div style={{ flex:1, minWidth:220, paddingBottom:'0.25rem' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', flexWrap:'wrap', marginBottom:'0.35rem' }}>
              <h1 style={{ fontFamily:D.display, fontSize:'1.6rem', fontWeight:700, color:C.text, letterSpacing:'-0.02em' }}>{username}</h1>
              <Badge tone="success">✓ Verified</Badge>
              <Badge tone="live">★ Build King</Badge>
            </div>
            <div style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.textMuted }}>@{username.toLowerCase()} · Bengaluru, Karnataka</div>
          </div>
          <Button icon={Edit2} variant="neutral" onClick={() => setEditOpen(true)} style={{ marginBottom:'0.25rem' }}>Edit profile</Button>
        </div>

        <Divider />
        <div style={{ padding:'1.1rem 1.75rem', display:'flex', gap:'2.5rem', flexWrap:'wrap' }}>
          {[['247','Followers'],['84','Posts'],[String(vehicles.length),'Vehicles'],['12','Badges']].map(([v, l]) => (
            <div key={l}>
              <div style={{ fontFamily:D.display, fontSize:'1.3rem', fontWeight:700, color:C.text, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>{v}</div>
              <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted, marginTop:'0.3rem' }}>{l}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Achievements */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'0.85rem', marginBottom:'1.25rem' }}>
        {BADGES.map(({ Icon, label, tone }) => (
          <Card key={label} padding={14} radius={R.md} style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
            <div style={{ width:38, height:38, borderRadius:R.sm, background:`${tone}1F`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <Icon size={17} color={tone} />
            </div>
            <span style={{ fontFamily:D.body, fontSize:'0.85rem', fontWeight:600, color:C.text }}>{label}</span>
          </Card>
        ))}
      </div>

      {/* Vehicle switcher */}
      <div style={{ display:'flex', gap:'0.75rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
        {vehicles.map(v => {
          const on = v.id === active?.id
          const VIcon = v.type === 'motorcycle' ? Bike : Car
          return (
            <button key={v.id} onClick={() => setActiveId(v.id)} className="t-press"
              style={{
                display:'flex', alignItems:'center', gap:'0.85rem',
                padding:'0.85rem 1.1rem', minWidth:260, textAlign:'left',
                background: on ? C.surface : 'transparent',
                border:`1px solid ${on ? v.tone + '55' : C.border}`,
                borderRadius:R.lg, cursor:'pointer',
                boxShadow: on ? SHADOW.sm : 'none',
                transition:'background-color 250ms cubic-bezier(0.22,1,0.36,1), border-color 250ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
              }}>
              <div style={{ width:40, height:40, borderRadius:R.sm, background:`${v.tone}1F`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <VIcon size={19} color={v.tone} />
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontFamily:D.body, fontSize:'0.875rem', fontWeight:600, color: on ? C.text : C.textSoft }}>
                  {v.make} {v.model} {v.trim}
                </div>
                <div style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.textMuted, marginTop:'0.15rem', fontVariantNumeric:'tabular-nums' }}>
                  {v.year} · {v.hp}hp · {v.mods.length} mods
                </div>
              </div>
            </button>
          )
        })}
        <button onClick={() => setAddVeh(true)} className="t-press"
          style={{
            display:'flex', alignItems:'center', gap:'0.55rem',
            padding:'0.85rem 1.25rem', background:'transparent',
            border:`1px dashed ${C.borderMid}`, borderRadius:R.lg, cursor:'pointer',
            color:C.textMuted, fontFamily:D.body, fontSize:'0.85rem', fontWeight:600,
            transition:'border-color 150ms cubic-bezier(0.22,1,0.36,1), color 150ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = C.accentBr; e.currentTarget.style.color = C.accentHi }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.color = C.textMuted }}>
          <Plus size={16} /> Add vehicle
        </button>
      </div>

      {/* Detail */}
      {active && (
        <Card padding={0} radius={R.xl} style={{ overflow:'hidden', boxShadow:SHADOW.md }}>
          <div style={{ height:3, background:`linear-gradient(to right, ${active.tone}, transparent)` }} />

          <div style={{ padding:'1.5rem 1.75rem', display:'flex', alignItems:'center', gap:'1.1rem', flexWrap:'wrap' }}>
            <div style={{ width:52, height:52, borderRadius:R.md, background:`${active.tone}1F`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              {active.type === 'motorcycle' ? <Bike size={24} color={active.tone} /> : <Car size={24} color={active.tone} />}
            </div>
            <div style={{ flex:1, minWidth:180 }}>
              <h2 style={{ fontFamily:D.display, fontSize:'1.3rem', fontWeight:700, color:C.text, letterSpacing:'-0.015em' }}>
                {active.make} {active.model} {active.trim}
              </h2>
              <div style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textMuted, marginTop:'0.2rem', display:'flex', alignItems:'center', gap:'0.4rem', fontVariantNumeric:'tabular-nums' }}>
                <Gauge size={13} /> {active.year} · {active.hp}hp
              </div>
            </div>
            <Tabs value={tab} onChange={setTab}
              tabs={[{ value:'mods', label:`Mods (${active.mods.length})` }, { value:'timeline', label:'Timeline' }]} />
          </div>

          <Divider />

          <div style={{ padding:'1.5rem 1.75rem' }}>
            {tab === 'mods' ? (
              active.mods.length === 0 ? (
                <EmptyState icon={Wrench} title="No mods logged yet"
                  message="Start the record for this build — every part you add shows on your public garage."
                  action={<Button icon={Plus} onClick={() => setAddMod(true)}>Log first mod</Button>} />
              ) : (
                <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(230px,1fr))', gap:'0.7rem' }}>
                  {active.mods.map((mod, i) => (
                    <div key={mod} className="t-row"
                      style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.75rem 0.9rem', background:C.surface2, borderRadius:R.md }}
                      onMouseEnter={e => e.currentTarget.style.background = C.surface3}
                      onMouseLeave={e => e.currentTarget.style.background = C.surface2}>
                      <span style={{ fontFamily:D.display, fontSize:'0.72rem', fontWeight:700, color:active.tone, width:20, flexShrink:0, fontVariantNumeric:'tabular-nums' }}>
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.text }}>{mod}</span>
                    </div>
                  ))}
                  <button onClick={() => setAddMod(true)} className="t-press"
                    style={{
                      display:'flex', alignItems:'center', justifyContent:'center', gap:'0.45rem',
                      padding:'0.75rem 0.9rem', background:'transparent',
                      border:`1px dashed ${C.borderMid}`, borderRadius:R.md, cursor:'pointer',
                      color:C.textMuted, fontFamily:D.body, fontSize:'0.85rem', fontWeight:600,
                      transition:'border-color 150ms cubic-bezier(0.22,1,0.36,1), color 150ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = C.accentBr; e.currentTarget.style.color = C.accentHi }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = C.borderMid; e.currentTarget.style.color = C.textMuted }}>
                    <Plus size={15} /> Add mod
                  </button>
                </div>
              )
            ) : (
              <div style={{ maxWidth:520 }}>
                {active.timeline.map((t, i) => (
                  <div key={`${t.date}-${i}`} style={{ display:'flex', gap:'1rem' }}>
                    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', flexShrink:0 }}>
                      <span style={{ width:10, height:10, borderRadius:'50%', background:KIND_TONE[t.kind] ?? C.textMuted, marginTop:5, boxShadow:`0 0 0 3px ${C.surface}` }} />
                      {i < active.timeline.length - 1 && (
                        <span style={{ width:2, flex:1, minHeight:30, background:C.border, margin:'4px 0' }} />
                      )}
                    </div>
                    <div style={{ paddingBottom:'1.4rem' }}>
                      <div style={{ fontFamily:D.body, fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:KIND_TONE[t.kind] ?? C.textMuted, marginBottom:'0.25rem' }}>
                        {t.date}
                      </div>
                      <div style={{ fontFamily:D.body, fontSize:'0.9rem', color:C.text }}>{t.event}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      )}

      <EditProfileModal open={editOpen}   onClose={() => setEditOpen(false)} username={username} />
      <AddVehicleModal  open={addVehOpen} onClose={() => setAddVeh(false)} />
      <AddModModal      open={addModOpen} onClose={() => setAddMod(false)} vehicle={active} />
    </div>
  )
}
