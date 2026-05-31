import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'
import { X, Plus, Edit2, Camera, Car, Bike, Upload } from 'lucide-react'
import { useMyVehicles, useCreateVehicle, useAddModification } from '../../../hooks/useVehicles'
import { useUpdateProfile } from '../../../hooks/useProfile'

const C = { bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50', coral:'#EF8354', coralDim:'#d96a3a', text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0', border:'rgba(191,192,192,0.12)', green:'#5eaa7e', amber:'#f5a623' }
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const VEHICLES = [
  { id:1, make:'Honda', model:'Civic', variant:'EK9 Type R', year:1998, type:'car', mods:14, hp:320, color:'#EF8354',
    modList:['K20 Engine Swap','Coilovers — Tein','6-speed LSD Gearbox','Full Roll Cage','Bride Bucket Seats','AP Racing Brakes','Recaro Harness','Custom Exhaust','ECU Tune — Hondata','Carbon Hood','Wide Body Kit','Work Emotion Wheels','Racing Fuel Cell','Sparco Steering Wheel'],
    timeline:[{date:'Jan 2023',event:'Bought stock EK9',type:'buy'},{date:'Mar 2023',event:'Suspension overhaul',type:'mod'},{date:'Jun 2023',event:'K-swap complete',type:'major'},{date:'Sep 2023',event:'First track day',type:'event'},{date:'Jan 2024',event:'Full roll cage installed',type:'mod'},{date:'Apr 2024',event:'Best lap: 1:41.2',type:'achievement'}]
  },
  { id:2, make:'KTM', model:'Duke', variant:'390', year:2022, type:'bike', mods:6, hp:44, color:'#f39c12',
    modList:['Akrapovic Exhaust','K&N Air Filter','ECU Flash','Frame Sliders','Bar End Mirrors','Tail Tidy'],
    timeline:[{date:'Aug 2022',event:'Bought new Duke 390',type:'buy'},{date:'Oct 2022',event:'Exhaust + air filter',type:'mod'},{date:'Dec 2022',event:'ECU flash done',type:'mod'},{date:'Mar 2023',event:'First track day',type:'event'}]
  },
]

const BADGES = [
  { Icon: '🏆', name:'Build King', desc:'Top rated build', color:'#f5a623' },
  { Icon: '✅', name:'Verified Owner', desc:'Ownership confirmed', color:'#5eaa7e' },
  { Icon: '🔧', name:'Mod Master', desc:'10+ documented mods', color:'#3b82f6' },
  { Icon: '🏁', name:'Track Rat', desc:'5+ track days', color:'#EF8354' },
]

const tlColors = { buy:'#5eaa7e', mod:'#3b82f6', major:'#EF8354', event:'#f5a623', achievement:'#a855f7' }

const MAKES = ['Toyota','Honda','Ford','BMW','Mercedes','Audi','Nissan','Mazda','Suzuki','Royal Enfield','Yamaha','Bajaj','KTM','Kawasaki','Ducati','Other']

function Modal({ onClose, children }) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:600, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(8,10,18,0.85)', backdropFilter:'blur(8px)' }} onClick={onClose} />
      <div style={{ position:'relative', zIndex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:22, padding:'2rem', width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto', boxShadow:'0 32px 80px rgba(0,0,0,0.6)' }}>
        <button onClick={onClose} style={{ position:'absolute', top:16, right:16, width:32, height:32, borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, cursor:'pointer', color:C.textMuted, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <X size={15} />
        </button>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'0.35rem' }}>
      <label style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, color:C.textMuted, letterSpacing:'0.08em', textTransform:'uppercase' }}>{label}</label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type='text' }) {
  return (
    <input type={type} value={value} onChange={onChange} placeholder={placeholder}
      style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.72rem 1rem', color:C.text, fontFamily:D.body, fontSize:'0.9rem', outline:'none', width:'100%' }}
      onFocus={e => e.target.style.borderColor='rgba(239,131,84,0.5)'}
      onBlur={e => e.target.style.borderColor=C.border} />
  )
}

function EditProfileModal({ onClose, username }) {
  const [form, setForm] = useState({ displayName: username, bio: 'Car enthusiast. JDM lover. Track addict.', location: 'Bengaluru, Karnataka', website: '' })
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const [saved, setSaved] = useState(false)

  if (saved) return (
    <Modal onClose={onClose}>
      <div style={{ textAlign:'center', padding:'2rem 1rem' }}>
        <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>✅</div>
        <div style={{ fontFamily:D.display, fontSize:'1.5rem', fontWeight:700, color:C.text, marginBottom:'0.5rem' }}>Profile Updated!</div>
        <button onClick={onClose} style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', background:C.coral, color:'#fff', border:'none', borderRadius:10, padding:'0.7rem 2rem', cursor:'pointer', marginTop:'1rem' }}>Done</button>
      </div>
    </Modal>
  )

  return (
    <Modal onClose={onClose}>
      <div style={{ fontFamily:D.display, fontSize:'1.5rem', fontWeight:700, color:C.text, marginBottom:'0.25rem' }}>Edit Profile</div>
      <p style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.textMuted, marginBottom:'1.75rem' }}>Update your public garage profile</p>

      {/* Avatar */}
      <div style={{ display:'flex', justifyContent:'center', marginBottom:'1.75rem' }}>
        <div style={{ position:'relative', cursor:'pointer' }}>
          <div style={{ width:80, height:80, borderRadius:'50%', background:`linear-gradient(135deg,${C.coral},#f39c12)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'2rem', color:'#1f2230' }}>
            {username[0].toUpperCase()}
          </div>
          <div style={{ position:'absolute', bottom:0, right:0, width:26, height:26, borderRadius:'50%', background:C.coral, display:'flex', alignItems:'center', justifyContent:'center', border:`2px solid ${C.surface}` }}>
            <Camera size={13} color="#fff" />
          </div>
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        <Field label="Display Name"><Input value={form.displayName} onChange={e => u('displayName', e.target.value)} placeholder="Your name" /></Field>
        <Field label="Bio">
          <textarea value={form.bio} onChange={e => u('bio', e.target.value)} placeholder="Tell your story..."
            style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.72rem 1rem', color:C.text, fontFamily:D.body, fontSize:'0.9rem', outline:'none', minHeight:90, resize:'vertical', lineHeight:1.55 }}
            onFocus={e => e.target.style.borderColor='rgba(239,131,84,0.5)'}
            onBlur={e => e.target.style.borderColor=C.border} />
        </Field>
        <Field label="Location"><Input value={form.location} onChange={e => u('location', e.target.value)} placeholder="City, State" /></Field>
        <Field label="Website"><Input value={form.website} onChange={e => u('website', e.target.value)} placeholder="https://yoursite.com" /></Field>
      </div>

      <div style={{ display:'flex', gap:'0.75rem', marginTop:'1.75rem', justifyContent:'flex-end' }}>
        <button onClick={onClose} style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', background:'transparent', border:`1px solid ${C.border}`, borderRadius:10, padding:'0.7rem 1.5rem', cursor:'pointer', color:C.textMuted }}>Cancel</button>
        <button onClick={() => setSaved(true)} style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', background:C.coral, border:'none', borderRadius:10, padding:'0.7rem 1.75rem', cursor:'pointer', color:'#fff' }}
          onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
          onMouseLeave={e => e.currentTarget.style.background=C.coral}>Save Changes</button>
      </div>
    </Modal>
  )
}

function AddVehicleModal({ onClose }) {
  const [form, setForm] = useState({ type:'car', make:'', model:'', year:'', color:'', nickname:'' })
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const [added, setAdded] = useState(false)
  const createVehicle = useCreateVehicle()

  if (added) return (
    <Modal onClose={onClose}>
      <div style={{ textAlign:'center', padding:'2rem 1rem' }}>
        <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🚗</div>
        <div style={{ fontFamily:D.display, fontSize:'1.5rem', fontWeight:700, color:C.text, marginBottom:'0.5rem' }}>Vehicle Added!</div>
        <p style={{ fontFamily:D.body, fontSize:'0.88rem', color:C.textMuted, marginBottom:'1.5rem' }}>{form.year} {form.make} {form.model} is now in your garage.</p>
        <button onClick={onClose} style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', background:C.coral, color:'#fff', border:'none', borderRadius:10, padding:'0.7rem 2rem', cursor:'pointer' }}>Done</button>
      </div>
    </Modal>
  )

  return (
    <Modal onClose={onClose}>
      <div style={{ fontFamily:D.display, fontSize:'1.5rem', fontWeight:700, color:C.text, marginBottom:'0.25rem' }}>Add a Vehicle</div>
      <p style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.textMuted, marginBottom:'1.75rem' }}>Add your car or bike to the garage</p>

      {/* Type toggle */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.25rem' }}>
        {[['car','Car'],['motorcycle','Bike']].map(([val, label]) => (
          <button key={val} onClick={() => u('type', val)}
            style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', padding:'0.75rem', borderRadius:12, background: form.type===val ? C.coral : C.surface2, border:`1px solid ${form.type===val ? C.coral : C.border}`, cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.88rem', color: form.type===val ? '#fff' : C.textMuted, transition:'all 0.2s' }}>
            {val === 'car' ? <Car size={16} /> : <Bike size={16} />} {label}
          </button>
        ))}
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          <Field label="Make">
            <select value={form.make} onChange={e => u('make', e.target.value)}
              style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.72rem 1rem', color: form.make ? C.text : C.textMuted, fontFamily:D.body, fontSize:'0.9rem', outline:'none', cursor:'pointer' }}>
              <option value="">Select make</option>
              {MAKES.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </Field>
          <Field label="Model"><Input value={form.model} onChange={e => u('model', e.target.value)} placeholder="e.g. Civic" /></Field>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          <Field label="Year"><Input type="number" value={form.year} onChange={e => u('year', e.target.value)} placeholder="2022" /></Field>
          <Field label="Color"><Input value={form.color} onChange={e => u('color', e.target.value)} placeholder="e.g. Midnight Blue" /></Field>
        </div>
        <Field label="Nickname (optional)"><Input value={form.nickname} onChange={e => u('nickname', e.target.value)} placeholder="e.g. The Beast" /></Field>
      </div>

      <div style={{ display:'flex', gap:'0.75rem', marginTop:'1.75rem', justifyContent:'flex-end' }}>
        <button onClick={onClose} style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', background:'transparent', border:`1px solid ${C.border}`, borderRadius:10, padding:'0.7rem 1.5rem', cursor:'pointer', color:C.textMuted }}>Cancel</button>
        <button
          onClick={async () => {
            if (!form.make || !form.model || !form.year) return
            try { await createVehicle.mutateAsync({ type: form.type, make: form.make, model: form.model, year: Number(form.year), color: form.color || null, nickname: form.nickname || null }) } catch (_) {}
            setAdded(true)
          }}
          disabled={createVehicle.isPending || !form.make || !form.model || !form.year}
          style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', background:C.coral, border:'none', borderRadius:10, padding:'0.7rem 1.75rem', cursor:'pointer', color:'#fff', opacity: (!form.make || !form.model || !form.year || createVehicle.isPending) ? 0.5 : 1 }}
          onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
          onMouseLeave={e => e.currentTarget.style.background=C.coral}>
          {createVehicle.isPending ? 'Adding...' : 'Add to Garage'}
        </button>
      </div>
    </Modal>
  )
}

const CAR_PHOTOS = [
  'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=80',
  'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&q=80',
  'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=80',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&q=80',
  'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400&q=80',
  'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=400&q=80',
]

function PhotosModal({ vehicle, onClose }) {
  const fileRef = useState(null)
  return (
    <Modal onClose={onClose}>
      <div style={{ fontFamily:D.display, fontSize:'1.4rem', fontWeight:700, color:C.text, marginBottom:'0.25rem' }}>{vehicle.make} {vehicle.model} — Photos</div>
      <p style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.textMuted, marginBottom:'1.5rem' }}>{CAR_PHOTOS.length} photos in garage</p>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.6rem', marginBottom:'1.25rem' }}>
        {CAR_PHOTOS.map((url, i) => (
          <div key={i} style={{ aspectRatio:'1', borderRadius:12, overflow:'hidden', border:`1px solid ${C.border}` }}>
            <img src={url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.3s' }}
              onMouseEnter={e=>e.currentTarget.style.transform='scale(1.06)'}
              onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'} />
          </div>
        ))}
        {/* Upload tile */}
        <div style={{ aspectRatio:'1', borderRadius:12, border:`2px dashed rgba(191,192,192,0.2)`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.4rem', cursor:'pointer', transition:'border-color 0.2s' }}
          onMouseEnter={e=>e.currentTarget.style.borderColor='rgba(239,131,84,0.45)'}
          onMouseLeave={e=>e.currentTarget.style.borderColor='rgba(191,192,192,0.2)'}>
          <Upload size={20} color={C.textMuted} />
          <span style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted }}>Add Photo</span>
        </div>
      </div>
      <button onClick={onClose} style={{ width:'100%', fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', background:C.surface2, color:C.text, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.7rem', cursor:'pointer' }}>Close</button>
    </Modal>
  )
}

function StatsModal({ vehicle, onClose }) {
  const stats = [
    { label:'Total Mods', value: vehicle.mods, unit:'parts', color:'#EF8354' },
    { label:'Horsepower', value: vehicle.hp, unit:'hp', color:'#f5a623' },
    { label:'Timeline Events', value: vehicle.timeline.length, unit:'entries', color:'#3b82f6' },
    { label:'Photos', value: CAR_PHOTOS.length, unit:'photos', color:'#5eaa7e' },
  ]
  const modCategories = [
    { label:'Engine', pct:35, color:'#EF8354' },
    { label:'Suspension', pct:20, color:'#3b82f6' },
    { label:'Interior', pct:18, color:'#a855f7' },
    { label:'Exterior', pct:15, color:'#5eaa7e' },
    { label:'Brakes', pct:12, color:'#f5a623' },
  ]
  return (
    <Modal onClose={onClose}>
      <div style={{ fontFamily:D.display, fontSize:'1.4rem', fontWeight:700, color:C.text, marginBottom:'0.25rem' }}>{vehicle.make} {vehicle.model} — Stats</div>
      <p style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.textMuted, marginBottom:'1.5rem' }}>Build statistics and breakdown</p>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem', marginBottom:'1.5rem' }}>
        {stats.map(s => (
          <div key={s.label} style={{ background:C.surface2, borderRadius:12, padding:'1rem', borderTop:`3px solid ${s.color}` }}>
            <div style={{ fontFamily:D.display, fontSize:'1.8rem', fontWeight:700, color:s.color, lineHeight:1 }}>{s.value}</div>
            <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted, marginTop:'0.2rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom:'1.5rem' }}>
        <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.textMuted, marginBottom:'0.85rem' }}>Mod Breakdown</div>
        {modCategories.map(m => (
          <div key={m.label} style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.65rem' }}>
            <div style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.text, width:80, flexShrink:0 }}>{m.label}</div>
            <div style={{ flex:1, height:7, background:'rgba(191,192,192,0.1)', borderRadius:4, overflow:'hidden' }}>
              <div style={{ height:'100%', width:`${m.pct}%`, background:m.color, borderRadius:4, transition:'width 0.6s' }} />
            </div>
            <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted, width:30, textAlign:'right' }}>{m.pct}%</div>
          </div>
        ))}
      </div>
      <button onClick={onClose} style={{ width:'100%', fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', background:C.surface2, color:C.text, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.7rem', cursor:'pointer' }}>Close</button>
    </Modal>
  )
}

function AddModModal({ vehicle, onClose }) {
  const CATEGORIES = ['Engine','Suspension','Exhaust','Brakes','Wheels','Interior','ECU / Electronics','Exterior','Audio','Other']
  const [form, setForm] = useState({ name:'', category:'', brand:'', cost:'', desc:'' })
  const u = (k,v) => setForm(f=>({...f,[k]:v}))
  const [done, setDone] = useState(false)
  const addMod = useAddModification()
  const inp = { background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.72rem 1rem', color:C.text, fontFamily:D.body, fontSize:'0.9rem', outline:'none', width:'100%' }

  if (done) return (
    <Modal onClose={onClose}>
      <div style={{ textAlign:'center', padding:'2rem 1rem' }}>
        <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🔧</div>
        <div style={{ fontFamily:D.display, fontSize:'1.4rem', fontWeight:700, color:C.text, marginBottom:'0.5rem' }}>Mod Added!</div>
        <p style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.textMuted, marginBottom:'1.5rem' }}><strong style={{color:C.text}}>{form.name}</strong> has been added to your {vehicle.make} {vehicle.model}.</p>
        <button onClick={onClose} style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', background:C.coral, color:'#fff', border:'none', borderRadius:10, padding:'0.7rem 2rem', cursor:'pointer' }}>Done</button>
      </div>
    </Modal>
  )

  return (
    <Modal onClose={onClose}>
      <div style={{ fontFamily:D.display, fontSize:'1.4rem', fontWeight:700, color:C.text, marginBottom:'0.25rem' }}>Add Modification</div>
      <p style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.textMuted, marginBottom:'1.5rem' }}>Log a new mod for your {vehicle.make} {vehicle.model}</p>
      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        <div>
          <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, color:C.textMuted, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.35rem' }}>Part / Mod Name</div>
          <input value={form.name} onChange={e=>u('name',e.target.value)} placeholder="e.g. Akrapovic Exhaust" style={inp} onFocus={e=>e.target.style.borderColor='rgba(239,131,84,0.5)'} onBlur={e=>e.target.style.borderColor=C.border} />
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          <div>
            <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, color:C.textMuted, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.35rem' }}>Category</div>
            <select value={form.category} onChange={e=>u('category',e.target.value)} style={{...inp, cursor:'pointer', color: form.category ? C.text : C.textMuted}}>
              <option value="">Select…</option>
              {CATEGORIES.map(c=><option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, color:C.textMuted, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.35rem' }}>Brand</div>
            <input value={form.brand} onChange={e=>u('brand',e.target.value)} placeholder="e.g. HKS, Brembo" style={inp} onFocus={e=>e.target.style.borderColor='rgba(239,131,84,0.5)'} onBlur={e=>e.target.style.borderColor=C.border} />
          </div>
        </div>
        <div>
          <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, color:C.textMuted, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.35rem' }}>Cost (₹)</div>
          <input type="number" value={form.cost} onChange={e=>u('cost',e.target.value)} placeholder="e.g. 28500" style={inp} onFocus={e=>e.target.style.borderColor='rgba(239,131,84,0.5)'} onBlur={e=>e.target.style.borderColor=C.border} />
        </div>
        <div>
          <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, color:C.textMuted, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.35rem' }}>Notes</div>
          <textarea value={form.desc} onChange={e=>u('desc',e.target.value)} placeholder="Install notes, dyno result, impressions..."
            style={{...inp, minHeight:80, resize:'vertical', lineHeight:1.55}} onFocus={e=>e.target.style.borderColor='rgba(239,131,84,0.5)'} onBlur={e=>e.target.style.borderColor=C.border} />
        </div>
      </div>
      <div style={{ display:'flex', gap:'0.75rem', marginTop:'1.5rem', justifyContent:'flex-end' }}>
        <button onClick={onClose} style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', background:'transparent', border:`1px solid ${C.border}`, borderRadius:10, padding:'0.7rem 1.5rem', cursor:'pointer', color:C.textMuted }}>Cancel</button>
        <button
          onClick={async () => {
            if (!form.name || !form.category) return
            if (vehicle?.id && !vehicle.id.toString().startsWith('mock')) {
              try { await addMod.mutateAsync({ vehicleId: vehicle.id, mod: { part_name: form.name, category: form.category, brand: form.brand || null, cost: form.cost ? Number(form.cost) : null, description: form.desc || null }}) } catch (_) {}
            }
            setDone(true)
          }}
          disabled={addMod.isPending || !form.name || !form.category}
          style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', background:C.coral, border:'none', borderRadius:10, padding:'0.7rem 1.75rem', cursor:'pointer', color:'#fff', opacity: (!form.name||!form.category||addMod.isPending)?0.5:1 }}
          onMouseEnter={e=>e.currentTarget.style.background=C.coralDim}
          onMouseLeave={e=>e.currentTarget.style.background=C.coral}>
          {addMod.isPending ? 'Saving...' : 'Add Mod'}
        </button>
      </div>
    </Modal>
  )
}

export default function GarageProfile() {
  const { user } = useAuth()
  const [activeVehicle, setActiveVehicle] = useState(VEHICLES[0])
  const [activeTab, setActiveTab]         = useState('mods')

  // Live data from DB — falls back to mock VEHICLES if DB is empty
  const { data: dbVehicles } = useMyVehicles()
  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showAddVehicle,  setShowAddVehicle]  = useState(false)
  const [showPhotos,      setShowPhotos]      = useState(false)
  const [showStats,       setShowStats]       = useState(false)
  const [showAddMod,      setShowAddMod]      = useState(false)
  const username = user?.user_metadata?.username || 'GarageKing'

  return (
    <div style={{ padding:'2rem', maxWidth:1100, margin:'0 auto' }}>

      {/* Profile header */}
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
            <button onClick={() => setShowEditProfile(true)}
              style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontFamily:D.body, fontWeight:600, fontSize:'0.85rem', background:C.coral, color:'#fff', border:'none', padding:'0.65rem 1.4rem', borderRadius:10, cursor:'pointer', transition:'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
              onMouseLeave={e => e.currentTarget.style.background=C.coral}>
              <Edit2 size={14} /> Edit Profile
            </button>
            <button style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.85rem', background:'transparent', color:C.text, border:`1px solid ${C.border}`, padding:'0.65rem 1.4rem', borderRadius:10, cursor:'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background=C.surface2}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>Share</button>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        {BADGES.map(({ Icon, name, desc, color }) => (
          <div key={name} style={{ background:C.surface, borderRadius:14, padding:'1rem 1.25rem', display:'flex', alignItems:'center', gap:'0.85rem', border:`1px solid ${C.border}`, transition:'border-color 0.2s', cursor:'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderColor=`${color}44`}
            onMouseLeave={e => e.currentTarget.style.borderColor=C.border}>
            <div style={{ width:42, height:42, background:`${color}18`, border:`1px solid ${color}33`, borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0 }}>{Icon}</div>
            <div>
              <div style={{ fontFamily:D.body, fontSize:'0.85rem', fontWeight:700, color:C.text }}>{name}</div>
              <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted, marginTop:'0.1rem' }}>{desc}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Vehicle tabs */}
      <div style={{ display:'flex', gap:'1px', background:C.border, borderRadius:14, overflow:'hidden', marginBottom:'1.25rem' }}>
        {VEHICLES.map(v => (
          <button key={v.id} onClick={() => setActiveVehicle(v)}
            style={{ flex:1, padding:'1rem 1.5rem', background: activeVehicle.id===v.id ? C.surface : C.bg, border:'none', borderBottom: activeVehicle.id===v.id ? `3px solid ${v.color}` : '3px solid transparent', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.85rem', transition:'all 0.2s' }}>
            <div style={{ width:44, height:44, borderRadius:11, background:`${v.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem', flexShrink:0 }}>
              {v.type === 'car' ? <Car size={22} color={v.color} /> : <Bike size={22} color={v.color} />}
            </div>
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
        <button onClick={() => setShowAddVehicle(true)}
          style={{ padding:'1rem 1.5rem', background:C.bg, border:'none', cursor:'pointer', fontFamily:D.body, fontSize:'0.85rem', fontWeight:600, color:C.textMuted, display:'flex', alignItems:'center', gap:'0.5rem', transition:'all 0.2s', whiteSpace:'nowrap' }}
          onMouseEnter={e => { e.currentTarget.style.background=C.surface; e.currentTarget.style.color=C.coral }}
          onMouseLeave={e => { e.currentTarget.style.background=C.bg; e.currentTarget.style.color=C.textMuted }}>
          <Plus size={16} /> Add Vehicle
        </button>
      </div>

      {/* Vehicle detail */}
      <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, overflow:'hidden' }}>
        <div style={{ height:4, background:`linear-gradient(to right, ${activeVehicle.color}, ${activeVehicle.color}44)` }} />
        <div style={{ padding:'1.5rem', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:'1.5rem' }}>
          <div style={{ width:64, height:64, borderRadius:16, background:`${activeVehicle.color}18`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            {activeVehicle.type === 'car' ? <Car size={34} color={activeVehicle.color} /> : <Bike size={34} color={activeVehicle.color} />}
          </div>
          <div>
            <h2 style={{ fontFamily:D.display, fontSize:'1.8rem', fontWeight:700, color:C.text, lineHeight:1 }}>{activeVehicle.make} {activeVehicle.model} {activeVehicle.variant}</h2>
            <div style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.textMuted, marginTop:'0.3rem' }}>{activeVehicle.year} · {activeVehicle.hp}hp</div>
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:'0.5rem' }}>
            {[['Edit', () => setShowEditProfile(true)], ['Photos', () => setShowPhotos(true)], ['Stats', () => setShowStats(true)]].map(([label, action]) => (
              <button key={label} onClick={action} style={{ fontFamily:D.body, fontSize:'0.8rem', fontWeight:600, background:'transparent', border:`1px solid ${C.border}`, borderRadius:9, padding:'0.45rem 0.9rem', cursor:'pointer', color:C.textMuted, transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=activeVehicle.color; e.currentTarget.style.color=C.text }}
                onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textMuted }}>{label}</button>
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
              <div onClick={() => setShowAddMod(true)} style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', padding:'0.75rem 1rem', border:`2px dashed rgba(191,192,192,0.15)`, borderRadius:11, cursor:'pointer', transition:'border-color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.borderColor=`${activeVehicle.color}66`}
                onMouseLeave={e => e.currentTarget.style.borderColor='rgba(191,192,192,0.15)'}>
                <Plus size={14} color={C.textMuted} />
                <span style={{ fontFamily:D.body, fontSize:'0.88rem', fontWeight:600, color:C.textMuted }}>Add Mod</span>
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
              <button style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontFamily:D.body, fontWeight:600, fontSize:'0.85rem', background:'transparent', border:`1px dashed rgba(191,192,192,0.25)`, borderRadius:10, padding:'0.6rem 1.2rem', cursor:'pointer', color:C.textMuted }}
                onMouseEnter={e => { e.currentTarget.style.borderColor=`${activeVehicle.color}66`; e.currentTarget.style.color=C.text }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(191,192,192,0.25)'; e.currentTarget.style.color=C.textMuted }}>
                <Plus size={14} /> Add Milestone
              </button>
            </div>
          )}
        </div>
      </div>

      {showEditProfile && <EditProfileModal onClose={() => setShowEditProfile(false)} username={username} />}
      {showAddVehicle  && <AddVehicleModal  onClose={() => setShowAddVehicle(false)} />}
      {showPhotos      && <PhotosModal      vehicle={activeVehicle} onClose={() => setShowPhotos(false)} />}
      {showStats       && <StatsModal       vehicle={activeVehicle} onClose={() => setShowStats(false)} />}
      {showAddMod      && <AddModModal      vehicle={activeVehicle} onClose={() => setShowAddMod(false)} />}
    </div>
  )
}
