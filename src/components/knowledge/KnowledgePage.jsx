import { useState, useDeferredValue } from 'react'
import { Car, Bike, Wrench, Cpu, Disc, Layers, Zap, Flag, BookOpen, Gauge, Search as SearchIcon } from 'lucide-react'
import { C, D, R, SHADOW } from '../../lib/theme'
import { PageHeader, Tabs, SearchInput, Card, Badge, Button, Divider, EmptyState, useSticky } from '../ui/Primitives'
import Modal from '../ui/Modal'
import { RowSkeleton } from '../ui/Skeleton'
import { useVehicleCatalog, useMaintenanceGuides } from '../../hooks/useKnowledge'

const CATALOG = [
  { id:1, type:'car',  make:'Honda',  model:'Civic Type R', trim:'EK9', years:'1997–2000',
    engine:'B16B VTEC', power:185, torque:'160Nm', weight:'1,050kg', drive:'FWD', accel:'7.8s',
    note:'The lightweight VTEC screamer that defined a generation of hot hatches.' },
  { id:2, type:'car',  make:'Toyota', model:'Supra', trim:'A80 JZA80', years:'1993–2002',
    engine:'2JZ-GTE Twin Turbo', power:280, torque:'431Nm', weight:'1,560kg', drive:'RWD', accel:'5.1s',
    note:'One of the most tunable platforms ever built — the 2JZ is near indestructible.' },
  { id:3, type:'car',  make:'Nissan', model:'Skyline GT-R', trim:'R34 V-Spec', years:'1999–2002',
    engine:'RB26DETT Twin Turbo', power:280, torque:'392Nm', weight:'1,560kg', drive:'AWD', accel:'5.0s',
    note:'Godzilla. ATTESA-ETS all-wheel drive and a legendary RB26 under the bonnet.' },
  { id:4, type:'motorcycle', make:'KTM', model:'Duke', trim:'390', years:'2023',
    engine:'373cc LC4c Single', power:44, torque:'37Nm', weight:'171kg', drive:'Chain', accel:'5.6s',
    note:'Razor-sharp supermoto DNA in a street-legal package. The entry track bike.' },
  { id:5, type:'motorcycle', make:'Royal Enfield', model:'Interceptor', trim:'650 Twin', years:'2023',
    engine:'648cc Parallel Twin', power:47, torque:'52Nm', weight:'202kg', drive:'Chain', accel:'6.5s',
    note:'The best two-wheeled tourer under ₹5L. Bulletproof and endlessly customisable.' },
]

const GUIDES = [
  { id:1, Icon:Wrench, title:'How to read tyre size markings', category:'Basics', difficulty:'Beginner', read:3,
    body:'A marking like 205/55 R16 89V tells you everything. 205 is section width in millimetres. 55 is the aspect ratio — sidewall height as a percentage of that width. R means radial construction, 16 is rim diameter in inches. 89 is the load index and V the speed rating (240 km/h).\n\nA lower aspect ratio gives sharper turn-in and more precise steering, at the cost of ride comfort and sidewall protection. A higher aspect ratio absorbs more, costs less, and is kinder on potholed roads.' },
  { id:2, Icon:Layers, title:'Understanding gear ratios', category:'Drivetrain', difficulty:'Intermediate', read:6,
    body:'Gear ratio is engine RPM divided by wheel RPM. A lower final drive ratio gives a higher top speed but slower acceleration; a higher ratio does the reverse.\n\nClose-ratio gearboxes — common in track cars — keep the engine inside its powerband between shifts, so you spend more time near peak torque. On the road this means more shifting; on track it means more usable power everywhere.' },
  { id:3, Icon:Zap, title:'K-swap conversion: parts and process', category:'Engine Builds', difficulty:'Advanced', read:15,
    body:'Swapping a K-series into an EK or EG Civic needs: the engine and transmission, Hasport or custom mounts, a K-swap shift linkage, custom axles, K-series radiator hoses, a Hondata KPro or S300 ECU, and a fuel pump rated at 190lph minimum.\n\nBudget ₹2.5–4L for parts alone, labour on top. Power runs 180–200hp on a stock K20A2, and past 320hp on built internals with forced induction.' },
  { id:4, Icon:Disc, title:'Coilover setup: height, alignment, damping', category:'Suspension', difficulty:'Intermediate', read:8,
    body:'Set ride height using the spring perch, not the damper body — adjusting the damper body changes your travel and is the most common mistake. Aim for a 20–30mm drop for street use.\n\nGet a four-wheel alignment after any height change. Target roughly -1.5° to -2° front camber, -1° to -1.5° rear, and near-zero toe for daily driving.\n\nStart damping at mid-range on all four corners. Add rebound for high-speed stability, reduce compression for compliance over rough surfaces. Corner-weight the car if you run it on track.' },
  { id:5, Icon:Cpu, title:'ECU tuning fundamentals', category:'Electronics', difficulty:'Advanced', read:10,
    body:'ECU tuning adjusts fuel and ignition maps against load and RPM. Always tune on a load-bearing dyno, never a free-roller — without load you cannot see detonation under real conditions.\n\nStart rich and retarded, which is safe, then pull fuel and add timing carefully. Data-log knock counts on every pull. Any knock at all means stop and investigate before continuing.' },
  { id:6, Icon:Flag, title:'Track day preparation checklist', category:'Track', difficulty:'Beginner', read:5,
    body:'Check brake fluid — if it looks dark, change it. Measure pad thickness; anything under 4mm will not survive a session. Check all fluid levels and tyre pressures cold, typically stock plus 4–6 PSI for track use.\n\nTorque your wheel nuts, then check them again after five laps. Empty the cabin of loose items. Bring a helmet rated SA2020 or newer.\n\nOn track, brake progressively for the first two laps to bed the pads in, and never push cold tyres — they need two or three laps to come up to temperature.' },
]

const DIFF_TONE = { Beginner:'success', Intermediate:'live', Advanced:'danger' }

/* ── Spec detail ────────────────────────────────────────── */
function SpecModal({ item: itemProp, onClose }) {
  const item = useSticky(itemProp)
  if (!item) return null
  const VIcon = item.type === 'motorcycle' ? Bike : Car
  const specs = [
    ['Engine', item.engine], ['Power', `${item.power}hp`], ['Torque', item.torque],
    ['Weight', item.weight], ['Drivetrain', item.drive], ['0–100 km/h', item.accel],
  ]
  return (
    <Modal open={!!itemProp} onClose={onClose} width={620} labelledBy="spec-title">
      <div style={{ overflowY:'auto' }}>
        <div style={{ padding:'2.25rem 1.75rem 1.5rem', background:`linear-gradient(160deg, ${C.accentBg}, transparent 70%)` }}>
          <div style={{ width:56, height:56, borderRadius:R.md, background:C.surface2, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.1rem' }}>
            <VIcon size={26} color={C.accent} />
          </div>
          <div style={{ fontFamily:D.body, fontSize:'0.78rem', fontWeight:600, color:C.accent, marginBottom:'0.25rem' }}>{item.make}</div>
          <h2 id="spec-title" style={{ fontFamily:D.display, fontSize:'1.6rem', fontWeight:700, color:C.text, letterSpacing:'-0.02em', lineHeight:1.2 }}>
            {item.model} <span style={{ color:C.textMuted, fontWeight:500 }}>{item.trim}</span>
          </h2>
          <div style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.textMuted, marginTop:'0.4rem' }}>{item.years}</div>
        </div>

        <div style={{ padding:'0 1.75rem 1.75rem' }}>
          <p style={{ fontFamily:D.body, fontSize:'0.9rem', color:C.textSoft, lineHeight:1.7, marginBottom:'1.5rem' }}>{item.note}</p>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.6rem' }}>
            {specs.map(([k, v]) => (
              <div key={k} style={{ background:C.surface2, borderRadius:R.md, padding:'0.85rem 1rem' }}>
                <div style={{ fontFamily:D.body, fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.08em', textTransform:'uppercase', color:C.textMuted, marginBottom:'0.3rem' }}>{k}</div>
                <div style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:600, color:C.text, fontVariantNumeric:'tabular-nums' }}>{v}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  )
}

/* ── Guide detail ───────────────────────────────────────── */
function GuideModal({ item: itemProp, onClose }) {
  const item = useSticky(itemProp)
  if (!item) return null
  const { Icon } = item
  return (
    <Modal open={!!itemProp} onClose={onClose} width={620} labelledBy="guide-title">
      <div style={{ overflowY:'auto' }}>
        <div style={{ padding:'2.25rem 1.75rem 1.25rem' }}>
          <div style={{ width:52, height:52, borderRadius:R.md, background:C.accentBg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1.1rem' }}>
            <Icon size={24} color={C.accent} />
          </div>
          <div style={{ display:'flex', gap:'0.4rem', marginBottom:'0.85rem' }}>
            <Badge tone={DIFF_TONE[item.difficulty]}>{item.difficulty}</Badge>
            <Badge>{item.category}</Badge>
            <Badge>{item.read} min read</Badge>
          </div>
          <h2 id="guide-title" style={{ fontFamily:D.display, fontSize:'1.45rem', fontWeight:700, color:C.text, lineHeight:1.25, letterSpacing:'-0.02em' }}>
            {item.title}
          </h2>
        </div>
        <Divider />
        <div style={{ padding:'1.5rem 1.75rem 2rem' }}>
          {item.body.split('\n\n').map((para, i) => (
            <p key={i} style={{ fontFamily:D.body, fontSize:'0.925rem', color:C.textSoft, lineHeight:1.8, marginBottom:'1.1rem' }}>{para}</p>
          ))}
        </div>
      </div>
    </Modal>
  )
}

/* ── Page ───────────────────────────────────────────────── */
export default function KnowledgePage() {
  const [tab, setTab]         = useState('specs')
  const [search, setSearch]   = useState('')
  const [specItem, setSpec]   = useState(null)
  const [guideItem, setGuide] = useState(null)
  const deferred = useDeferredValue(search)

  const { data: dbCatalog, isLoading: loadingCatalog } = useVehicleCatalog(deferred ? { query: deferred } : {})
  const { data: dbGuides,  isLoading: loadingGuides  } = useMaintenanceGuides()

  const catalog = dbCatalog?.length
    ? dbCatalog.map(r => ({
        id:r.id, type:r.type, make:r.make, model:r.model, trim:r.trim ?? '',
        years:String(r.year), engine:r.engine ?? '—', power:r.horsepower ?? 0,
        torque:r.torque_nm ? `${r.torque_nm}Nm` : '—', weight:r.weight_kg ? `${r.weight_kg}kg` : '—',
        drive:r.drivetrain ?? '—', accel:r.acceleration_0_100 ? `${r.acceleration_0_100}s` : '—',
        note:r.description ?? '',
      }))
    : CATALOG

  const guides = dbGuides?.length
    ? dbGuides.map((g, i) => ({ id:g.id, Icon:GUIDES[i % GUIDES.length].Icon, title:g.title, category:g.category ?? 'General',
        difficulty:(g.difficulty ?? 'beginner').replace(/^./, c => c.toUpperCase()), read:5, body:g.body ?? '' }))
    : GUIDES

  const q = search.toLowerCase()
  const visibleCatalog = catalog.filter(c => !q || c.make.toLowerCase().includes(q) || c.model.toLowerCase().includes(q))
  const visibleGuides  = guides.filter(g => !q || g.title.toLowerCase().includes(q) || g.category.toLowerCase().includes(q))

  return (
    <div style={{ padding:'2rem 2.25rem 3rem', maxWidth:1240, margin:'0 auto' }}>
      <PageHeader eyebrow="Knowledge Hub" title="The Encyclopedia"
        description="Specs on every machine and in-depth guides written by the people who actually build them." />

      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.75rem', flexWrap:'wrap' }}>
        <Tabs value={tab} onChange={setTab}
          tabs={[{ value:'specs', label:'Specs database' }, { value:'guides', label:'Guides' }]} />
        <SearchInput value={search} onChange={e => setSearch(e.target.value)}
          placeholder={tab === 'specs' ? 'Search make or model…' : 'Search guides…'} width={320} />
      </div>

      {tab === 'specs' ? (
        loadingCatalog ? (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.7rem' }}>
            {Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)}
          </div>
        ) : visibleCatalog.length === 0 ? (
          <EmptyState icon={SearchIcon} title="No vehicles found" message="Try a different make or model."
            action={<Button variant="neutral" onClick={() => setSearch('')}>Clear search</Button>} />
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.7rem' }}>
            {visibleCatalog.map(car => {
              const VIcon = car.type === 'motorcycle' ? Bike : Car
              return (
                <button key={car.id} onClick={() => setSpec(car)} className="t-row"
                  style={{
                    display:'flex', alignItems:'center', gap:'1rem', width:'100%', textAlign:'left',
                    padding:'0.95rem 1.15rem', background:C.surface, border:'none',
                    borderRadius:R.lg, cursor:'pointer', boxShadow:SHADOW.sm,
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = C.surface2}
                  onMouseLeave={e => e.currentTarget.style.background = C.surface}>
                  <div style={{ width:46, height:46, borderRadius:R.md, background:C.accentBg, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <VIcon size={21} color={C.accent} />
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:600, color:C.text, letterSpacing:'-0.01em' }}>
                      {car.make} {car.model} <span style={{ color:C.textMuted, fontWeight:500 }}>{car.trim}</span>
                    </div>
                    <div style={{ fontFamily:D.body, fontSize:'0.79rem', color:C.textMuted, marginTop:'0.2rem' }}>
                      {car.years} · {car.engine}
                    </div>
                  </div>
                  <div style={{ textAlign:'right', flexShrink:0 }}>
                    <div style={{ fontFamily:D.display, fontSize:'1.15rem', fontWeight:700, color:C.accent, lineHeight:1, fontVariantNumeric:'tabular-nums' }}>{car.power}hp</div>
                    <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted, marginTop:'0.25rem' }}>{car.drive}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )
      ) : (
        loadingGuides ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1rem' }}>
            {Array.from({ length: 6 }).map((_, i) => <RowSkeleton key={i} />)}
          </div>
        ) : visibleGuides.length === 0 ? (
          <EmptyState icon={BookOpen} title="No guides found" message="Try another topic or clear your search."
            action={<Button variant="neutral" onClick={() => setSearch('')}>Clear search</Button>} />
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1rem' }}>
            {visibleGuides.map(g => (
              <Card key={g.id} hover onClick={() => setGuide(g)} radius={R.lg} padding={20}>
                <div style={{ width:40, height:40, borderRadius:R.sm, background:C.accentBg, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'0.95rem' }}>
                  <g.Icon size={19} color={C.accent} />
                </div>
                <div style={{ display:'flex', gap:'0.35rem', marginBottom:'0.7rem' }}>
                  <Badge tone={DIFF_TONE[g.difficulty]}>{g.difficulty}</Badge>
                  <Badge>{g.category}</Badge>
                </div>
                <h3 style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:600, color:C.text, lineHeight:1.35, marginBottom:'0.5rem', letterSpacing:'-0.01em' }}>
                  {g.title}
                </h3>
                <div style={{ fontFamily:D.body, fontSize:'0.775rem', color:C.textMuted }}>{g.read} min read</div>
              </Card>
            ))}
          </div>
        )
      )}

      <SpecModal  item={specItem}  onClose={() => setSpec(null)}  />
      <GuideModal item={guideItem} onClose={() => setGuide(null)} />
    </div>
  )
}
