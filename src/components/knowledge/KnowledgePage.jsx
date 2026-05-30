import { useState, useDeferredValue } from 'react'
import { useVehicleCatalog, useMaintenanceGuides, useNews } from '../../hooks/useKnowledge'
import { RowSkeleton } from '../ui/Skeleton'

const C = {
  navy:'#2D3142', slate:'#4F5D75', grey:'#BFC0C0', coral:'#EF8354', coralDim:'#d96a3a',
  white:'#FFFFFF', bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50',
  text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0',
  border:'rgba(191,192,192,0.12)',
}
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const CAR_DB = [
  { id:1, make:'Honda', model:'Civic Type R', variant:'EK9', year:'1997–2000', engine:'B16B VTEC', power:'185hp', torque:'160Nm', weight:'1,050kg', drivetrain:'FWD', emoji:'🚗' },
  { id:2, make:'Toyota', model:'Supra', variant:'A80 JZA80', year:'1993–2002', engine:'2JZ-GTE Twin Turbo', power:'280hp', torque:'431Nm', weight:'1,560kg', drivetrain:'RWD', emoji:'🚗' },
  { id:3, make:'Nissan', model:'Skyline GT-R', variant:'R34 V-Spec', year:'1999–2002', engine:'RB26DETT Twin Turbo', power:'280hp', torque:'392Nm', weight:'1,560kg', drivetrain:'AWD', emoji:'🚗' },
  { id:4, make:'KTM', model:'Duke', variant:'390', year:'2023', engine:'373cc Single', power:'44hp', torque:'37Nm', weight:'171kg', drivetrain:'Chain', emoji:'🏍️' },
  { id:5, make:'Royal Enfield', model:'Interceptor', variant:'650 Twin', year:'2023', engine:'648cc Parallel Twin', power:'47hp', torque:'52Nm', weight:'202kg', drivetrain:'Chain', emoji:'🏍️' },
]

const GUIDES = [
  { id:1, title:'How to Read Tyre Size', category:'Basics', readTime:'3 min', emoji:'🔧', difficulty:'Beginner' },
  { id:2, title:'Understanding Gear Ratios', category:'Drivetrain', readTime:'6 min', emoji:'⚙️', difficulty:'Intermediate' },
  { id:3, title:'K-Swap Complete Guide', category:'Engine Builds', readTime:'15 min', emoji:'🏎️', difficulty:'Advanced' },
  { id:4, title:'Coilover Setup Guide', category:'Suspension', readTime:'8 min', emoji:'🔩', difficulty:'Intermediate' },
  { id:5, title:'ECU Tuning Basics', category:'Electronics', readTime:'10 min', emoji:'💻', difficulty:'Advanced' },
  { id:6, title:'Track Day Prep Checklist', category:'Track', readTime:'5 min', emoji:'🏁', difficulty:'Beginner' },
]

const NEWS = [
  { title:'F1 2026 Power Unit Regs Finalised', tag:'F1', time:'2h ago', emoji:'🏎️', hot:true },
  { title:'Maruti Jimny Gets 5-Door Variant for India', tag:'India', time:'5h ago', emoji:'🚙', hot:false },
  { title:'KTM 990 Duke Revealed at EICMA 2026', tag:'Bikes', time:'1d ago', emoji:'🏍️', hot:true },
  { title:'Best Budget Track Cars Under ₹10L — 2026 Guide', tag:'Guide', time:'2d ago', emoji:'🏁', hot:false },
]

const diffColors = { Beginner:'#5eaa7e', Intermediate:'#EF8354', Advanced:'#d96a3a' }

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState('specs')
  const [search, setSearch] = useState('')
  const [selectedCar, setSelectedCar] = useState(null)
  const deferredSearch = useDeferredValue(search)

  const { data: dbCatalog, isLoading: loadingCatalog } = useVehicleCatalog(
    deferredSearch ? { make: deferredSearch } : {}
  )
  const { data: dbGuides, isLoading: loadingGuides } = useMaintenanceGuides()
  const { data: dbNews,   isLoading: loadingNews   } = useNews()

  // Use DB data when available, else fall back to built-in mock data
  const catalogData = (dbCatalog && dbCatalog.length > 0)
    ? dbCatalog.map(r => ({ id: r.id, make: r.make, model: r.model, variant: r.trim || '', year: String(r.year), engine: r.engine || '—', power: r.horsepower ? `${r.horsepower}hp` : '—', torque: r.torque_nm ? `${r.torque_nm}Nm` : '—', weight: r.weight_kg ? `${r.weight_kg}kg` : '—', drivetrain: r.drivetrain || '—', emoji: r.type === 'motorcycle' ? '🏍️' : '🚗' }))
    : CAR_DB

  const guidesData = (dbGuides && dbGuides.length > 0)
    ? dbGuides.map(r => ({ id: r.id, title: r.title, category: r.category, readTime: '5 min', emoji: '🔧', difficulty: r.difficulty }))
    : GUIDES

  const newsData = (dbNews && dbNews.length > 0)
    ? dbNews.map(r => ({ title: r.title, tag: r.category || 'News', time: new Date(r.published_at).toLocaleDateString(), emoji: '📰', hot: false }))
    : NEWS

  const isLoading = activeTab === 'specs' ? loadingCatalog : activeTab === 'guides' ? loadingGuides : loadingNews

  const filtered = catalogData.filter(c =>
    search === '' ||
    c.make.toLowerCase().includes(search.toLowerCase()) ||
    c.model.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ minHeight:'calc(100vh - 60px)', background:C.bg, padding:'2.5rem 3rem' }}>
      <div style={{ maxWidth:1200, margin:'0 auto' }}>

        <div style={{ marginBottom:'2rem' }}>
          <div style={{ fontFamily:D.body, fontSize:'0.75rem', fontWeight:600, letterSpacing:'0.15em', textTransform:'uppercase', color:C.coral, marginBottom:'0.5rem' }}>Knowledge Hub</div>
          <h1 style={{ fontFamily:D.display, fontSize:'2.75rem', fontWeight:700, color:C.text, lineHeight:1.05, letterSpacing:'-0.02em' }}>The Encyclopedia</h1>
          <p style={{ fontFamily:D.body, fontSize:'1rem', color:C.textMuted, marginTop:'0.75rem', maxWidth:540, lineHeight:1.6 }}>
            Specs on every machine, in-depth guides, and the latest automotive news — all in one place.
          </p>
        </div>

        <div style={{ display:'inline-flex', gap:'0.25rem', background:C.surface, padding:'0.35rem', borderRadius:12, marginBottom:'2rem' }}>
          {[['specs','Specs Database'],['guides','Guides'],['news','News']].map(([tab, label]) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ fontFamily:D.body, fontSize:'0.88rem', fontWeight:600, padding:'0.6rem 1.4rem', borderRadius:8, background: activeTab===tab ? C.coral : 'transparent', color: activeTab===tab ? C.white : C.textMuted, border:'none', cursor:'pointer', transition:'all 0.2s' }}>
              {label}
            </button>
          ))}
        </div>

        {activeTab === 'specs' && (
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:'0.85rem 1.2rem', marginBottom:'1.5rem' }}>
              <span style={{ color:C.textMuted, fontSize:'1.1rem' }}>🔍</span>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search make or model..."
                style={{ background:'none', border:'none', outline:'none', fontFamily:D.body, fontSize:'0.95rem', color:C.text, flex:1 }} />
            </div>

            <div style={{ display:'grid', gridTemplateColumns: selectedCar ? '1fr 400px' : '1fr', gap:'1.5rem', alignItems:'start' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                {loadingCatalog
                  ? Array.from({length:5}).map((_,i) => <RowSkeleton key={i} />)
                  : filtered.map(car => (
                  <div key={car.id} onClick={() => setSelectedCar(selectedCar?.id === car.id ? null : car)}
                    style={{ background: selectedCar?.id===car.id ? C.surface2 : C.surface, borderRadius:14, padding:'1.25rem 1.5rem', display:'flex', gap:'1.25rem', alignItems:'center', cursor:'pointer', border:`1px solid ${selectedCar?.id===car.id ? 'rgba(239,131,84,0.4)' : C.border}`, transition:'all 0.2s' }}
                    onMouseEnter={e => { if (selectedCar?.id!==car.id) e.currentTarget.style.background=C.surface2 }}
                    onMouseLeave={e => { if (selectedCar?.id!==car.id) e.currentTarget.style.background=C.surface }}>
                    <div style={{ width:54, height:54, borderRadius:12, background:'rgba(239,131,84,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', flexShrink:0 }}>{car.emoji}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:D.display, fontSize:'1.15rem', fontWeight:600, color:C.text }}>{car.make} {car.model}</div>
                      <div style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textMuted, marginTop:'0.15rem' }}>{car.variant} · {car.year} · {car.engine}</div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontFamily:D.display, fontSize:'1.25rem', fontWeight:700, color:C.coral }}>{car.power}</div>
                      <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted, marginTop:'0.1rem' }}>{car.drivetrain}</div>
                    </div>
                  </div>
                ))}
                {!loadingCatalog && filtered.length === 0 && (
                  <div style={{ textAlign:'center', padding:'3rem', color:C.textMuted, fontFamily:D.body }}>No vehicles found. Try a different search.</div>
                )}
              </div>

              {selectedCar && (
                <div style={{ background:C.surface, borderRadius:16, padding:'1.75rem', border:`1px solid ${C.border}`, position:'sticky', top:80 }}>
                  <div style={{ width:64, height:64, borderRadius:14, background:'rgba(239,131,84,0.12)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.2rem', marginBottom:'1.25rem' }}>{selectedCar.emoji}</div>
                  <h3 style={{ fontFamily:D.display, fontSize:'1.6rem', fontWeight:700, color:C.text, lineHeight:1.1, letterSpacing:'-0.01em' }}>{selectedCar.make} {selectedCar.model}</h3>
                  <div style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.textMuted, marginTop:'0.35rem', marginBottom:'1.5rem' }}>{selectedCar.variant} · {selectedCar.year}</div>
                  <div>
                    {[['Engine', selectedCar.engine],['Power', selectedCar.power],['Torque', selectedCar.torque],['Weight', selectedCar.weight],['Drivetrain', selectedCar.drivetrain]].map(([k, v]) => (
                      <div key={k} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.85rem 0', borderBottom:`1px solid ${C.border}` }}>
                        <span style={{ fontFamily:D.body, fontSize:'0.82rem', fontWeight:500, color:C.textMuted }}>{k}</span>
                        <span style={{ fontFamily:D.display, fontSize:'0.95rem', fontWeight:600, color:C.text }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <button style={{ width:'100%', marginTop:'1.5rem', fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', background:C.coral, color:C.white, border:'none', padding:'0.85rem', borderRadius:10, cursor:'pointer', transition:'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
                    onMouseLeave={e => e.currentTarget.style.background=C.coral}>
                    View Full Specs
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'guides' && (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem' }}>
            {loadingGuides
              ? Array.from({length:6}).map((_,i) => <RowSkeleton key={i} />)
              : guidesData.map(g => (
              <div key={g.id} style={{ background:C.surface, borderRadius:16, padding:'1.75rem', cursor:'pointer', border:`1px solid ${C.border}`, transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background=C.surface2; e.currentTarget.style.transform='translateY(-2px)' }}
                onMouseLeave={e => { e.currentTarget.style.background=C.surface; e.currentTarget.style.transform='translateY(0)' }}>
                <div style={{ width:56, height:56, borderRadius:14, background:'rgba(239,131,84,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', marginBottom:'1.25rem' }}>{g.emoji}</div>
                <div style={{ display:'flex', gap:'0.5rem', marginBottom:'0.85rem' }}>
                  <span style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:600, padding:'0.2rem 0.6rem', borderRadius:6, background:`${diffColors[g.difficulty]}22`, color:diffColors[g.difficulty] }}>{g.difficulty}</span>
                  <span style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:600, padding:'0.2rem 0.6rem', borderRadius:6, background:'rgba(191,192,192,0.08)', color:C.textMuted }}>{g.category}</span>
                </div>
                <div style={{ fontFamily:D.display, fontSize:'1.2rem', fontWeight:600, color:C.text, lineHeight:1.25, marginBottom:'0.6rem' }}>{g.title}</div>
                <div style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textMuted }}>⏱ {g.readTime} read</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'news' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'0.85rem' }}>
            {loadingNews
              ? Array.from({length:4}).map((_,i) => <RowSkeleton key={i} />)
              : newsData.map(n => (
              <div key={n.title} style={{ background:C.surface, borderRadius:14, padding:'1.25rem 1.5rem', display:'flex', gap:'1.25rem', alignItems:'center', cursor:'pointer', border:`1px solid ${C.border}`, transition:'all 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background=C.surface2}
                onMouseLeave={e => e.currentTarget.style.background=C.surface}>
                <div style={{ width:54, height:54, borderRadius:12, background:'rgba(191,192,192,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', flexShrink:0 }}>{n.emoji}</div>
                <div style={{ flex:1 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.35rem' }}>
                    {n.hot && <span style={{ fontFamily:D.body, fontSize:'0.65rem', fontWeight:600, color:C.coral, background:'rgba(239,131,84,0.12)', padding:'0.15rem 0.5rem', borderRadius:5 }}>Hot</span>}
                    <span style={{ fontFamily:D.body, fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:C.textMuted }}>{n.tag}</span>
                  </div>
                  <div style={{ fontFamily:D.display, fontSize:'1.1rem', fontWeight:600, color:C.text }}>{n.title}</div>
                </div>
                <div style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted, flexShrink:0 }}>{n.time}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}