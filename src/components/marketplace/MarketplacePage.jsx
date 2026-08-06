import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, BadgeCheck, MapPin, Gauge, Settings2, Heart, ImageOff, Car, Wrench, CheckCircle2, Upload } from 'lucide-react'
import { C, D, R, SHADOW } from '../../lib/theme'
import { PageHeader, Button, Badge, Avatar, Divider, ChipRow, Tabs, SearchInput, EmptyState, Field, Input, Textarea, Select, useSticky } from '../ui/Primitives'
import Modal, { ModalHeader, ModalBody, ModalFooter, ModalSuccess } from '../ui/Modal'
import { CardSkeleton } from '../ui/Skeleton'
import { useVehicleListings, usePartsListings, useCreateVehicleListing, useCreatePartsListing } from '../../hooks/useMarketplace'

const MAKES     = ['Honda','Toyota','Nissan','Mazda','BMW','Audi','Suzuki','Maruti','Tata','Mahindra','Royal Enfield','KTM','Kawasaki','Yamaha','Ducati','Other']
const PART_CATS = ['Engine','Intake','Exhaust','Suspension','Brakes','Wheels','Interior','Electronics','Body','Other']
const CONDITIONS = ['New','Used — Excellent','Used — Good','Used — Fair']

const VEHICLES = [
  { id:1, title:'Honda Civic Type R', variant:'EK9 · 1998', price:1850000, priceLabel:'₹18.5L', km:'62,000 km',
    location:'Bangalore', seller:'TurboMike', rating:'4.9', verified:true, kind:'Car', fuel:'Petrol', gearbox:'Manual', tag:'Modified',
    desc:'Full K-swap build making 320hp on a stock bottom end. Daily driven, all paperwork clear. Serious buyers only.',
    imgs:['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=80','https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&q=80','https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&q=80'] },
  { id:2, title:'Kawasaki Z900 RS', variant:'2021 · Candy Brown', price:910000, priceLabel:'₹9.1L', km:'8,200 km',
    location:'Chennai', seller:'RaiderKing', rating:'4.7', verified:true, kind:'Bike', fuel:'Petrol', gearbox:'Manual', tag:'Stock',
    desc:'One owner, full service history, entirely stock. Selling only because I upgraded.',
    imgs:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80','https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&q=80'] },
  { id:3, title:'Toyota Supra A80', variant:'1995 · JZA80 Import', price:4200000, priceLabel:'₹42L', km:'87,000 km',
    location:'Mumbai', seller:'GarageGuru', rating:'5.0', verified:true, kind:'Car', fuel:'Petrol', gearbox:'Manual', tag:'JDM Import',
    desc:'Genuine JZA80, all original, imported and registered. One of very few in the country.',
    imgs:['https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=900&q=80','https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=900&q=80'] },
  { id:4, title:'KTM Duke 390', variant:'2023 · White', price:210000, priceLabel:'₹2.1L', km:'4,500 km',
    location:'Pune', seller:'ApexHunter', rating:'4.6', verified:false, kind:'Bike', fuel:'Petrol', gearbox:'Manual', tag:'Near Stock',
    desc:'Practically new. Only an Akrapovic slip-on added, everything else stock. Warranty still valid.',
    imgs:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80'] },
]

const PARTS = [
  { id:1, title:'Turbocharger — GT3582', category:'Engine', price:62000, priceLabel:'₹62,000', condition:'Used — Good',
    seller:'TurboMike', rating:'4.9', location:'Bangalore', fits:'Universal', verified:true,
    desc:'Ceramic bearings, under 10,000km since rebuild. Includes oil and coolant lines.',
    img:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=700&q=80' },
  { id:2, title:'Tein Coilover Kit', category:'Suspension', price:38000, priceLabel:'₹38,000', condition:'Used — Excellent',
    seller:'DriftQueen', rating:'4.8', location:'Hyderabad', fits:'Honda Civic EK', verified:true,
    desc:'Full Tein Street Basis kit for the EK chassis. Height adjustable, excellent condition.',
    img:'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=700&q=80' },
  { id:3, title:'Akrapovic Slip-On', category:'Exhaust', price:28500, priceLabel:'₹28,500', condition:'Used — Good',
    seller:'RaiderKing', rating:'4.7', location:'Bangalore', fits:'KTM Duke 390', verified:true,
    desc:'Genuine Akrapovic with a titanium can. Sounds superb, no dents or scratches.',
    img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80' },
  { id:4, title:'AP Racing Big Brake Kit', category:'Brakes', price:85000, priceLabel:'₹85,000', condition:'New',
    seller:'ApexHunter', rating:'4.6', location:'Pune', fits:'Universal', verified:false,
    desc:'Brand new six-piston kit, never installed. Fits most 17-inch and larger setups.',
    img:'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=700&q=80' },
]

/* ── Contact form — inline, with a confirmed terminal state ── */
function ContactSeller({ seller }) {
  const [phone, setPhone] = useState('')
  const [sent, setSent]   = useState(false)
  const valid = phone.replace(/\D/g, '').length >= 10

  if (sent) return (
    <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.9rem 1rem', background:C.successBg, borderRadius:R.md }}>
      <CheckCircle2 size={20} color={C.success} style={{ flexShrink:0 }} />
      <div>
        <div style={{ fontFamily:D.body, fontSize:'0.85rem', fontWeight:600, color:C.success }}>Enquiry sent</div>
        <div style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted, marginTop:'0.1rem' }}>{seller} will call you back within 2 hours.</div>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ fontFamily:D.body, fontSize:'0.75rem', fontWeight:600, color:C.textSoft, marginBottom:'0.45rem' }}>Your phone number</div>
      <div style={{ display:'flex', gap:'0.55rem' }}>
        <Input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210"
          onKeyDown={e => e.key === 'Enter' && valid && setSent(true)} />
        <Button onClick={() => valid && setSent(true)} disabled={!valid}>Send</Button>
      </div>
    </div>
  )
}

/* ── Vehicle detail with carousel ───────────────────────── */
function VehicleDetail({ item: itemProp, onClose }) {
  const item = useSticky(itemProp)
  const [idx, setIdx] = useState(0)
  if (!item) return null
  const imgs = item.imgs ?? []

  return (
    <Modal open={!!itemProp} onClose={onClose} width={760} labelledBy="veh-title">
      <div style={{ overflowY:'auto' }}>
        <div style={{ position:'relative', height:320, background:C.surface2 }}>
          {imgs.length > 0 ? (
            <img src={imgs[idx]} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
          ) : (
            <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}><ImageOff size={26} color={C.textDim} /></div>
          )}
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top, ${C.surface} 0%, transparent 45%)` }} />

          {imgs.length > 1 && (
            <>
              {[['left', ChevronLeft, () => setIdx(i => Math.max(0, i - 1)), idx === 0],
                ['right', ChevronRight, () => setIdx(i => Math.min(imgs.length - 1, i + 1)), idx === imgs.length - 1]
              ].map(([side, Icon, fn, off]) => (
                <button key={side} onClick={fn} disabled={off} aria-label={`${side} image`} className="t-press"
                  style={{
                    position:'absolute', [side]:14, top:'42%', width:38, height:38, borderRadius:'50%',
                    background:'rgba(11,13,17,0.7)', backdropFilter:'blur(8px)', border:'none',
                    display:'flex', alignItems:'center', justifyContent:'center',
                    cursor: off ? 'default' : 'pointer', opacity: off ? 0.3 : 1,
                    transition:'opacity 150ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
                  }}>
                  <Icon size={18} color="#fff" />
                </button>
              ))}
              <div style={{ position:'absolute', bottom:16, left:'50%', translate:'-50% 0', display:'flex', gap:5 }}>
                {imgs.map((_, i) => (
                  <button key={i} onClick={() => setIdx(i)} aria-label={`Image ${i + 1}`}
                    style={{
                      width: i === idx ? 18 : 6, height:6, borderRadius:3, border:'none', padding:0, cursor:'pointer',
                      background: i === idx ? C.accent : 'rgba(255,255,255,0.35)',
                      transition:'width 250ms cubic-bezier(0.22,1,0.36,1), background-color 250ms cubic-bezier(0.22,1,0.36,1)',
                    }} />
                ))}
              </div>
            </>
          )}
        </div>

        <div style={{ padding:'0 1.75rem 1.75rem' }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
            <div>
              <h2 id="veh-title" style={{ fontFamily:D.display, fontSize:'1.55rem', fontWeight:700, color:C.text, letterSpacing:'-0.02em' }}>{item.title}</h2>
              <div style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.textMuted, marginTop:'0.2rem' }}>{item.variant}</div>
            </div>
            <div style={{ fontFamily:D.display, fontSize:'1.85rem', fontWeight:700, color:C.accent, fontVariantNumeric:'tabular-nums' }}>{item.priceLabel}</div>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:'0.6rem', marginBottom:'1.25rem' }}>
            {[[MapPin, item.location], [Gauge, item.km], [Settings2, item.gearbox], [Car, item.fuel]].map(([Icon, val], i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:C.surface2, borderRadius:R.md, padding:'0.65rem 0.85rem' }}>
                <Icon size={14} color={C.textMuted} style={{ flexShrink:0 }} />
                <span style={{ fontFamily:D.body, fontSize:'0.84rem', color:C.text }}>{val}</span>
              </div>
            ))}
          </div>

          <p style={{ fontFamily:D.body, fontSize:'0.9rem', color:C.textSoft, lineHeight:1.7, marginBottom:'1.5rem' }}>{item.desc}</p>

          <div style={{ display:'flex', alignItems:'center', gap:'0.8rem', padding:'0.9rem 1rem', background:C.surface2, borderRadius:R.md, marginBottom:'1.25rem' }}>
            <Avatar name={item.seller} size={36} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}>
                <span style={{ fontFamily:D.body, fontSize:'0.875rem', fontWeight:600, color:C.text }}>{item.seller}</span>
                {item.verified && <BadgeCheck size={14} color={C.success} />}
              </div>
              <div style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.live, marginTop:'0.1rem' }}>★ {item.rating}</div>
            </div>
          </div>

          <ContactSeller seller={item.seller} />
        </div>
      </div>
    </Modal>
  )
}

/* ── Part detail ────────────────────────────────────────── */
function PartDetail({ item: itemProp, onClose }) {
  const item = useSticky(itemProp)
  if (!item) return null
  return (
    <Modal open={!!itemProp} onClose={onClose} width={560} labelledBy="part-title">
      <div style={{ overflowY:'auto' }}>
        <div style={{ height:230, background:C.surface2, position:'relative' }}>
          <img src={item.img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
          <div style={{ position:'absolute', inset:0, background:`linear-gradient(to top, ${C.surface} 0%, transparent 55%)` }} />
        </div>
        <div style={{ padding:'0 1.75rem 1.75rem' }}>
          <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem', marginBottom:'0.9rem' }}>
            <div>
              <h2 id="part-title" style={{ fontFamily:D.display, fontSize:'1.3rem', fontWeight:700, color:C.text, letterSpacing:'-0.015em' }}>{item.title}</h2>
              <div style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted, marginTop:'0.2rem' }}>Fits: {item.fits}</div>
            </div>
            <div style={{ fontFamily:D.display, fontSize:'1.5rem', fontWeight:700, color:C.accent, fontVariantNumeric:'tabular-nums' }}>{item.priceLabel}</div>
          </div>

          <div style={{ display:'flex', gap:'0.45rem', flexWrap:'wrap', marginBottom:'1rem' }}>
            <Badge tone="accent">{item.category}</Badge>
            <Badge tone={item.condition === 'New' ? 'success' : 'neutral'}>{item.condition}</Badge>
            <Badge>📍 {item.location}</Badge>
          </div>

          <p style={{ fontFamily:D.body, fontSize:'0.9rem', color:C.textSoft, lineHeight:1.7, marginBottom:'1.25rem' }}>{item.desc}</p>

          <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.85rem 1rem', background:C.surface2, borderRadius:R.md, marginBottom:'1.25rem' }}>
            <Avatar name={item.seller} size={32} />
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.35rem' }}>
                <span style={{ fontFamily:D.body, fontSize:'0.85rem', fontWeight:600, color:C.text }}>{item.seller}</span>
                {item.verified && <BadgeCheck size={13} color={C.success} />}
              </div>
              <div style={{ fontFamily:D.body, fontSize:'0.73rem', color:C.live, marginTop:'0.1rem' }}>★ {item.rating}</div>
            </div>
          </div>

          <ContactSeller seller={item.seller} />
        </div>
      </div>
    </Modal>
  )
}

/* ── Post listing ───────────────────────────────────────── */
function PostListingModal({ open, onClose, defaultTab }) {
  const [tab, setTab]   = useState(defaultTab ?? 'vehicle')
  const [done, setDone] = useState(false)
  const [files, setFiles] = useState([])
  const fileRef = useRef(null)
  const [form, setForm] = useState({ make:'', model:'', year:'', km:'', price:'', location:'', condition:'', desc:'', partName:'', category:'', fits:'' })
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const createVehicle = useCreateVehicleListing()
  const createPart    = useCreatePartsListing()

  const valid = tab === 'vehicle'
    ? form.make && form.model && form.year && form.price
    : form.partName && form.category && form.price

  const close = () => { onClose(); setTimeout(() => { setDone(false); setFiles([]) }, 200) }

  const submit = async () => {
    if (!valid) return
    try {
      if (tab === 'vehicle') {
        await createVehicle.mutateAsync({ listing: {
          make: form.make, model: form.model, year: Number(form.year),
          mileage_km: form.km ? Number(form.km) : null, price: Number(form.price),
          location: form.location, description: form.desc, type: 'car',
        }, files })
      } else {
        await createPart.mutateAsync({ listing: {
          title: form.partName, category: form.category,
          compatible_with: form.fits ? [form.fits] : [],
          price: Number(form.price), location: form.location, description: form.desc,
        }, files })
      }
    } catch { /* confirmation shows regardless */ }
    setDone(true)
  }

  return (
    <Modal open={open} onClose={close} width={600} labelledBy="post-listing">
      {done ? (
        <ModalSuccess title="Listing submitted"
          message="It goes live once reviewed — usually within a couple of hours. We'll notify you." onDone={close} />
      ) : (
        <>
          <ModalHeader id="post-listing" title="Post a listing" subtitle="Anyone can sell. Listings are reviewed before they go live." />
          <ModalBody style={{ paddingBottom:'0.5rem' }}>
            <div style={{ marginBottom:'1.5rem' }}>
              <Tabs value={tab} onChange={setTab}
                tabs={[{ value:'vehicle', label:'Vehicle' }, { value:'part', label:'Part or mod' }]} />
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              {tab === 'vehicle' ? (
                <>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                    <Field label="Make"><Select value={form.make} onChange={e => u('make', e.target.value)} options={MAKES} placeholder="Select make" /></Field>
                    <Field label="Model"><Input value={form.model} onChange={e => u('model', e.target.value)} placeholder="Civic" /></Field>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                    <Field label="Year"><Input type="number" value={form.year} onChange={e => u('year', e.target.value)} placeholder="2019" /></Field>
                    <Field label="Kilometres"><Input type="number" value={form.km} onChange={e => u('km', e.target.value)} placeholder="34000" /></Field>
                  </div>
                </>
              ) : (
                <>
                  <Field label="Part name"><Input value={form.partName} onChange={e => u('partName', e.target.value)} placeholder="Akrapovic slip-on exhaust" /></Field>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                    <Field label="Category"><Select value={form.category} onChange={e => u('category', e.target.value)} options={PART_CATS} /></Field>
                    <Field label="Condition"><Select value={form.condition} onChange={e => u('condition', e.target.value)} options={CONDITIONS} /></Field>
                  </div>
                  <Field label="Fits" hint="Which vehicles this part is compatible with.">
                    <Input value={form.fits} onChange={e => u('fits', e.target.value)} placeholder="KTM Duke 390, or Universal" />
                  </Field>
                </>
              )}

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                <Field label="Asking price (₹)"><Input type="number" value={form.price} onChange={e => u('price', e.target.value)} placeholder="850000" /></Field>
                <Field label="City"><Input value={form.location} onChange={e => u('location', e.target.value)} placeholder="Bangalore" /></Field>
              </div>

              <Field label="Description">
                <Textarea value={form.desc} onChange={e => u('desc', e.target.value)} rows={4}
                  placeholder="Mods, service history, reason for selling, any known issues…" />
              </Field>

              <Field label="Photos" hint="First photo becomes the cover. JPG or PNG, up to 5MB each.">
                <input ref={fileRef} type="file" multiple accept="image/*" style={{ display:'none' }}
                  onChange={e => setFiles(Array.from(e.target.files))} />
                <button onClick={() => fileRef.current?.click()} className="t-press"
                  style={{
                    height:96, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.4rem',
                    background:'transparent', border:`1px dashed ${files.length ? C.accentBr : C.borderMid}`,
                    borderRadius:R.md, cursor:'pointer', width:'100%',
                    transition:'border-color 150ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
                  }}>
                  <Upload size={18} color={files.length ? C.accent : C.textMuted} />
                  <span style={{ fontFamily:D.body, fontSize:'0.85rem', fontWeight:600, color: files.length ? C.accentHi : C.textMuted }}>
                    {files.length ? `${files.length} photo${files.length > 1 ? 's' : ''} selected` : 'Choose photos'}
                  </span>
                </button>
              </Field>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={close}>Cancel</Button>
            <Button onClick={submit} disabled={!valid} loading={createVehicle.isPending || createPart.isPending}>
              Submit listing
            </Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  )
}

/* ── Cards ──────────────────────────────────────────────── */
function VehicleCard({ item, onOpen }) {
  const [saved, setSaved]   = useState(false)
  const [broken, setBroken] = useState(false)

  return (
    <article onClick={onOpen} className="t-lift t-zoom"
      style={{ background:C.surface, borderRadius:R.lg, overflow:'hidden', boxShadow:SHADOW.sm, cursor:'pointer', display:'flex', flexDirection:'column' }}>
      <div style={{ position:'relative', height:184, background:C.surface2, overflow:'hidden' }}>
        {broken || !item.imgs?.[0] ? (
          <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}><ImageOff size={22} color={C.textDim} /></div>
        ) : (
          <img src={item.imgs[0]} alt="" onError={() => setBroken(true)} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        )}
        <div style={{ position:'absolute', top:12, left:12 }}><Badge tone="accent">{item.tag}</Badge></div>
        <button onClick={e => { e.stopPropagation(); setSaved(v => !v) }} aria-label="Save listing" className="t-press"
          style={{
            position:'absolute', top:10, right:10, width:34, height:34, borderRadius:R.sm,
            background:'rgba(11,13,17,0.65)', backdropFilter:'blur(8px)', border:'none',
            display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
            transition:'scale 150ms cubic-bezier(0.22,1,0.36,1)',
          }}>
          <Heart size={15} color={saved ? C.danger : '#fff'} fill={saved ? C.danger : 'none'} />
        </button>
      </div>

      <div style={{ padding:'1rem 1.05rem 1.05rem', display:'flex', flexDirection:'column', gap:'0.55rem', flex:1 }}>
        <div>
          <h3 style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:600, color:C.text, letterSpacing:'-0.01em' }}>{item.title}</h3>
          <div style={{ fontFamily:D.body, fontSize:'0.775rem', color:C.textMuted, marginTop:'0.15rem' }}>{item.variant}</div>
        </div>
        <div style={{ fontFamily:D.display, fontSize:'1.45rem', fontWeight:700, color:C.accent, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>{item.priceLabel}</div>

        <div style={{ display:'flex', gap:'0.85rem', fontFamily:D.body, fontSize:'0.755rem', color:C.textMuted, flexWrap:'wrap' }}>
          <span style={{ display:'flex', alignItems:'center', gap:'0.25rem' }}><Gauge size={12} /> {item.km}</span>
          <span style={{ display:'flex', alignItems:'center', gap:'0.25rem' }}><MapPin size={12} /> {item.location}</span>
        </div>

        <Divider style={{ marginTop:'0.15rem' }} />

        <div style={{ display:'flex', alignItems:'center', gap:'0.55rem' }}>
          <Avatar name={item.seller} size={24} />
          <span style={{ fontFamily:D.body, fontSize:'0.79rem', color:C.textSoft, flex:1 }}>{item.seller}</span>
          {item.verified && <BadgeCheck size={13} color={C.success} />}
          <span style={{ fontFamily:D.body, fontSize:'0.755rem', color:C.live, fontWeight:600 }}>★ {item.rating}</span>
        </div>
      </div>
    </article>
  )
}

function PartCard({ item, onOpen }) {
  const [broken, setBroken] = useState(false)
  return (
    <article onClick={onOpen} className="t-lift t-zoom"
      style={{ background:C.surface, borderRadius:R.lg, overflow:'hidden', boxShadow:SHADOW.sm, cursor:'pointer', display:'flex', flexDirection:'column' }}>
      <div style={{ position:'relative', height:140, background:C.surface2, overflow:'hidden' }}>
        {broken ? (
          <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center' }}><ImageOff size={20} color={C.textDim} /></div>
        ) : (
          <img src={item.img} alt="" onError={() => setBroken(true)} style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        )}
        <div style={{ position:'absolute', top:10, left:10 }}><Badge tone="accent">{item.category}</Badge></div>
        <div style={{ position:'absolute', top:10, right:10 }}>
          <Badge tone={item.condition === 'New' ? 'success' : 'neutral'}>{item.condition}</Badge>
        </div>
      </div>
      <div style={{ padding:'0.95rem 1.05rem 1.05rem', display:'flex', flexDirection:'column', gap:'0.5rem', flex:1 }}>
        <div>
          <h3 style={{ fontFamily:D.display, fontSize:'0.94rem', fontWeight:600, color:C.text, lineHeight:1.3 }}>{item.title}</h3>
          <div style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.textMuted, marginTop:'0.15rem' }}>Fits {item.fits}</div>
        </div>
        <div style={{ fontFamily:D.display, fontSize:'1.25rem', fontWeight:700, color:C.accent, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>{item.priceLabel}</div>
        <Divider style={{ marginTop:'0.15rem' }} />
        <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <Avatar name={item.seller} size={22} />
          <span style={{ fontFamily:D.body, fontSize:'0.775rem', color:C.textSoft, flex:1 }}>{item.seller}</span>
          <span style={{ fontFamily:D.body, fontSize:'0.745rem', color:C.live, fontWeight:600 }}>★ {item.rating}</span>
        </div>
      </div>
    </article>
  )
}

/* ── Page ───────────────────────────────────────────────── */
export default function MarketplacePage() {
  const [tab, setTab]           = useState('vehicles')
  const [search, setSearch]     = useState('')
  const [typeFilter, setType]   = useState('All')
  const [catFilter, setCat]     = useState('All')
  const [listingOpen, setList]  = useState(false)
  const [listingTab, setLTab]   = useState('vehicle')
  const [vehDetail, setVeh]     = useState(null)
  const [partDetail, setPart]   = useState(null)

  const { data: dbVehicles, isLoading: loadingV } = useVehicleListings()
  const { data: dbParts,    isLoading: loadingP } = usePartsListings()

  const vehicles = dbVehicles?.length ? dbVehicles : VEHICLES
  const parts    = dbParts?.length    ? dbParts    : PARTS

  const q = search.toLowerCase()
  const visibleVehicles = vehicles.filter(v =>
    (typeFilter === 'All' || v.kind === typeFilter) &&
    (!q || v.title?.toLowerCase().includes(q) || v.location?.toLowerCase().includes(q)))
  const visibleParts = parts.filter(p =>
    (catFilter === 'All' || p.category === catFilter) &&
    (!q || p.title?.toLowerCase().includes(q) || p.fits?.toLowerCase().includes(q)))

  const openSell = t => { setLTab(t); setList(true) }
  const isVehicles = tab === 'vehicles'
  const loading = isVehicles ? loadingV : loadingP
  const grid = { display:'grid', gridTemplateColumns:`repeat(auto-fill,minmax(${isVehicles ? 290 : 250}px,1fr))`, gap:'1.15rem' }

  return (
    <div style={{ padding:'2rem 2.25rem 3rem', maxWidth:1440, margin:'0 auto' }}>
      <PageHeader eyebrow="The Strip" title="Marketplace"
        description="Buy and sell complete vehicles or individual parts. Community-verified sellers, no middlemen."
        actions={<>
          <Button variant="neutral" icon={Wrench} onClick={() => openSell('part')}>Sell a part</Button>
          <Button icon={Car} onClick={() => openSell('vehicle')}>Sell a vehicle</Button>
        </>} />

      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        <Tabs value={tab} onChange={setTab}
          tabs={[{ value:'vehicles', label:'Cars & bikes' }, { value:'parts', label:'Parts & mods' }]} />
        <SearchInput value={search} onChange={e => setSearch(e.target.value)}
          placeholder={isVehicles ? 'Search make, model, city…' : 'Search parts, compatibility…'} width={340} />
        <span style={{ marginLeft:'auto', fontFamily:D.body, fontSize:'0.8rem', color:C.textMuted, fontVariantNumeric:'tabular-nums' }}>
          {isVehicles ? visibleVehicles.length : visibleParts.length} listings
        </span>
      </div>

      <div style={{ marginBottom:'1.75rem' }}>
        {isVehicles
          ? <ChipRow options={['All','Car','Bike']} value={typeFilter} onChange={setType} />
          : <ChipRow options={['All', ...PART_CATS.slice(0, 6)]} value={catFilter} onChange={setCat} />}
      </div>

      {loading ? (
        <div style={grid}>{Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}</div>
      ) : isVehicles ? (
        visibleVehicles.length === 0
          ? <EmptyState icon={Car} title="No vehicles match" message="Try a different search or clear the filters."
              action={<Button variant="neutral" onClick={() => { setSearch(''); setType('All') }}>Clear filters</Button>} />
          : <div style={grid}>{visibleVehicles.map(v => <VehicleCard key={v.id} item={v} onOpen={() => setVeh(v)} />)}</div>
      ) : (
        visibleParts.length === 0
          ? <EmptyState icon={Wrench} title="No parts match" message="Try a different search or clear the filters."
              action={<Button variant="neutral" onClick={() => { setSearch(''); setCat('All') }}>Clear filters</Button>} />
          : <div style={grid}>{visibleParts.map(p => <PartCard key={p.id} item={p} onOpen={() => setPart(p)} />)}</div>
      )}

      <PostListingModal open={listingOpen} onClose={() => setList(false)} defaultTab={listingTab} />
      <VehicleDetail item={vehDetail}  onClose={() => setVeh(null)} />
      <PartDetail    item={partDetail} onClose={() => setPart(null)} />
    </div>
  )
}
