import { useState } from 'react'
import { CheckCircle } from 'lucide-react'

// Reusable contact component used across all service detail views
function ContactShopButton({ shop }) {
  const [open,  setOpen]  = useState(false)
  const [phone, setPhone] = useState('')
  const [sent,  setSent]  = useState(false)

  const submit = () => {
    if (phone.length < 7) return
    setSent(true)
    setTimeout(() => { setSent(false); setOpen(false); setPhone('') }, 3500)
  }

  if (sent) return (
    <div style={{ background:'rgba(94,170,126,0.1)', border:'1px solid rgba(94,170,126,0.3)', borderRadius:12, padding:'1rem', display:'flex', alignItems:'center', gap:'0.75rem' }}>
      <CheckCircle size={22} color='#5eaa7e' />
      <div>
        <div style={{ fontFamily:"'Space Grotesk',sans-serif", fontSize:'0.95rem', fontWeight:700, color:'#5eaa7e' }}>Message Sent!</div>
        <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'0.78rem', color:'#8b90a0' }}>{shop.name} will call you back within 2 hours.</div>
      </div>
    </div>
  )

  if (open) return (
    <div style={{ background:'rgba(239,131,84,0.08)', border:'1px solid rgba(239,131,84,0.2)', borderRadius:12, padding:'0.9rem' }}>
      <div style={{ fontFamily:"'Inter',sans-serif", fontSize:'0.78rem', color:'#8b90a0', marginBottom:'0.6rem' }}>Enter your phone — {shop.name} will call you back.</div>
      <div style={{ display:'flex', gap:'0.5rem' }}>
        <input value={phone} onChange={e => setPhone(e.target.value)} onKeyDown={e => e.key==='Enter' && submit()}
          placeholder="+91 98765 43210" autoFocus
          style={{ flex:1, background:'#2a2f40', border:'1px solid rgba(191,192,192,0.12)', borderRadius:9, padding:'0.6rem 0.85rem', color:'#EDEEF0', fontFamily:"'Inter',sans-serif", fontSize:'0.88rem', outline:'none' }}
          onFocus={e => e.target.style.borderColor='rgba(239,131,84,0.45)'}
          onBlur={e => e.target.style.borderColor='rgba(191,192,192,0.12)'} />
        <button onClick={submit}
          style={{ background:'#EF8354', border:'none', borderRadius:9, padding:'0.6rem 1.1rem', cursor:'pointer', fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:'0.85rem', color:'#fff', opacity: phone.length < 7 ? 0.55 : 1, transition:'all 0.2s' }}>
          Send
        </button>
        <button onClick={() => setOpen(false)}
          style={{ background:'transparent', border:'1px solid rgba(191,192,192,0.12)', borderRadius:9, padding:'0.6rem 0.85rem', cursor:'pointer', fontFamily:"'Inter',sans-serif", fontSize:'0.82rem', color:'#8b90a0', transition:'all 0.2s' }}>
          ✕
        </button>
      </div>
    </div>
  )

  return (
    <button onClick={() => setOpen(true)}
      style={{ width:'100%', background:'#EF8354', border:'none', borderRadius:10, padding:'0.7rem', cursor:'pointer', fontFamily:"'Inter',sans-serif", fontWeight:600, fontSize:'0.88rem', color:'#fff', transition:'background 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.background='#d96a3a'}
      onMouseLeave={e => e.currentTarget.style.background='#EF8354'}>
      Get Quote
    </button>
  )
}

const C = {
  bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50', navy:'#2D3142',
  coral:'#EF8354', coralDim:'#d96a3a', slate:'#4F5D75',
  text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0',
  border:'rgba(191,192,192,0.12)', borderBright:'rgba(191,192,192,0.22)',
  white:'#FFFFFF', green:'#5eaa7e', amber:'#f5a623',
}
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const SERVICE_FEATURES = [
  {
    id:'repair', icon:'🔧', title:'Repair & Service',
    subtitle:'Find trusted mechanics near you',
    desc:'Browse verified workshops, garages, and mobile mechanics. Compare ratings, specialities, and pricing before booking.',
    color:'#EF8354', colorDim:'rgba(239,131,84,0.12)',
    stats:[['2,400+','Verified Shops'],['4.7★','Avg Rating'],['< 2hr','Response']],
    tags:['Engine Repair','Oil Change','Brake Service','AC Repair','Electrical'],
    cta:'Find a Mechanic',
  },
  {
    id:'mods', icon:'⚙️', title:'Custom Mods',
    subtitle:'Build your dream machine',
    desc:'Connect with specialist fabricators, tuners, and body shops. From bolt-ons to full engine builds — get accurate quotes from verified builders.',
    color:'#4F5D75', colorDim:'rgba(79,93,117,0.18)',
    stats:[['860+','Mod Shops'],['₹500–₹50L','Price Range'],['500+','Projects']],
    tags:['Turbo Kits','Body Kits','Exhaust','Roll Cages','ECU Tune','Dyno'],
    cta:'Find a Builder',
  },
  {
    id:'detailing', icon:'✨', title:'Detailing',
    subtitle:'Showroom finish every time',
    desc:'PPF, ceramic coatings, paint corrections, and full interior detailing. Find detailers with verified before/after portfolios.',
    color:'#5eaa7e', colorDim:'rgba(94,170,126,0.12)',
    stats:[['620+','Studios'],['99%','Satisfaction'],['1-Day','Turnaround']],
    tags:['PPF','Ceramic Coat','Paint Correction','Interior Detail','Wash & Wax'],
    cta:'Book Detailing',
  },
  {
    id:'pdi', icon:'🔍', title:'PDI Checks',
    subtitle:'Know before you buy',
    desc:'Professional pre-delivery inspection for used vehicles. 150-point checklist, OBD scan, test drive report, and full digital report delivered instantly.',
    color:'#3b82f6', colorDim:'rgba(59,130,246,0.12)',
    stats:[['150pt','Inspection'],['₹1,500','Starting'],['24hr','Report']],
    tags:['OBD Scan','Engine Check','Chassis Inspect','Test Drive','Document Check'],
    cta:'Book PDI',
  },
  {
    id:'insurance', icon:'🛡️', title:'Insurance Portal',
    subtitle:'Compare, buy, and manage in one place',
    desc:'Compare policies from 12+ insurers instantly. File claims, track renewals, and get roadside cover — all from your garage profile.',
    color:'#a855f7', colorDim:'rgba(168,85,247,0.12)',
    stats:[['12+','Insurers'],['3 min','Quick Quote'],['24/7','Claim Support']],
    tags:['Third Party','Comprehensive','Zero Dep','NCB Protection','Claim Assist'],
    cta:'Get Quote',
  },
  {
    id:'roadside', icon:'🚨', title:'Roadside Assistance',
    subtitle:'We come to you, anywhere, anytime',
    desc:'Flat tyre? Dead battery? Engine trouble? Our network of rapid response teams reaches you in under 45 minutes anywhere in the city — 24/7, 365 days.',
    color:'#ef4444', colorDim:'rgba(239,68,68,0.12)',
    stats:[['< 45min','Response'],['24/7','Always On'],['50+','Cities']],
    tags:['Flat Tyre','Battery Jump','Towing','Fuel Delivery','Lockout','Winching'],
    cta:'Get Assistance Now',
    urgent:true,
  },
]

function ServiceDetailShell({ icon, title, color, onBack, children }) {
  return (
    <div>
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem' }}>
        <button onClick={onBack}
          style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.5rem 1rem', cursor:'pointer', fontFamily:D.body, fontWeight:500, fontSize:'0.88rem', color:C.textMuted, transition:'all 0.2s' }}
          onMouseEnter={e => { e.currentTarget.style.color=C.text; e.currentTarget.style.background=C.surface2 }}
          onMouseLeave={e => { e.currentTarget.style.color=C.textMuted; e.currentTarget.style.background=C.surface }}>
          ← Back to Services
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <div style={{ width:40, height:40, borderRadius:10, background:`${color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem' }}>{icon}</div>
          <h2 style={{ fontFamily:D.display, fontSize:'1.75rem', fontWeight:700, color:C.text, letterSpacing:'-0.02em' }}>{title}</h2>
        </div>
      </div>
      {children}
    </div>
  )
}

function RepairView({ onBack }) {
  const shops = [
    { id:1, name:'Pradeep Motors', rating:4.8, reviews:214, location:'Indiranagar, Bangalore', speciality:'Japanese Cars · ECU Tuning', price:'₹500/hr', verified:true, wait:'Available Now' },
    { id:2, name:'AutoCare Pro', rating:4.6, reviews:178, location:'Koramangala, Bangalore', speciality:'All Makes · AC Specialist', price:'₹400/hr', verified:true, wait:'1hr wait' },
    { id:3, name:'SpeedWrench', rating:4.9, reviews:89, location:'HSR Layout, Bangalore', speciality:'Performance & Mods', price:'₹700/hr', verified:true, wait:'Available Now' },
    { id:4, name:'QuickFix Garage', rating:4.4, reviews:312, location:'Whitefield, Bangalore', speciality:'Budget Repairs · Multi-brand', price:'₹300/hr', verified:false, wait:'2hr wait' },
  ]
  return (
    <ServiceDetailShell icon="🔧" title="Repair & Service" color="#EF8354" onBack={onBack}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'1.25rem' }}>
        {shops.map(s => (
          <div key={s.id} style={{ background:C.surface2, borderRadius:16, padding:'1.5rem', border:`1px solid ${C.border}`, transition:'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1rem' }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.25rem' }}>
                  <span style={{ fontFamily:D.display, fontWeight:700, fontSize:'1.1rem', color:C.text }}>{s.name}</span>
                  {s.verified && <span style={{ fontSize:'0.65rem', fontWeight:600, color:C.green, background:'rgba(94,170,126,0.12)', padding:'0.1rem 0.45rem', borderRadius:5 }}>✓ Verified</span>}
                </div>
                <div style={{ fontFamily:D.body, fontSize:'0.8rem', color:C.textMuted }}>📍 {s.location}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:700, color:C.amber }}>★ {s.rating}</div>
                <div style={{ fontFamily:D.body, fontSize:'0.7rem', color:C.textMuted }}>{s.reviews} reviews</div>
              </div>
            </div>
            <div style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textSoft, marginBottom:'0.75rem' }}>🔧 {s.speciality}</div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem' }}>
              <span style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:700, color:C.coral }}>{s.price}</span>
              <span style={{ fontFamily:D.body, fontSize:'0.75rem', color: s.wait === 'Available Now' ? C.green : C.amber, background: s.wait === 'Available Now' ? 'rgba(94,170,126,0.1)' : 'rgba(245,166,35,0.1)', padding:'0.2rem 0.6rem', borderRadius:6 }}>● {s.wait}</span>
            </div>
            <ContactShopButton shop={s} />
          </div>
        ))}
      </div>
    </ServiceDetailShell>
  )
}

function RoadsideView({ onBack }) {
  const [step, setStep] = useState('home')
  const [issue, setIssue] = useState('')

  const ISSUES = [
    { id:'tyre', icon:'🔴', label:'Flat Tyre', eta:'25 min' },
    { id:'battery', icon:'⚡', label:'Dead Battery', eta:'20 min' },
    { id:'tow', icon:'🚛', label:'Need Towing', eta:'40 min' },
    { id:'fuel', icon:'⛽', label:'Out of Fuel', eta:'30 min' },
    { id:'lockout', icon:'🔑', label:'Locked Out', eta:'35 min' },
    { id:'other', icon:'🔧', label:'Engine Trouble', eta:'45 min' },
  ]

  return (
    <ServiceDetailShell icon="🚨" title="Roadside Assistance" color="#ef4444" onBack={onBack}>
      {step === 'home' && (
        <div>
          <div style={{ background:'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.04))', border:'1px solid rgba(239,68,68,0.25)', borderRadius:16, padding:'1.75rem', marginBottom:'2rem', display:'flex', gap:'1.5rem', alignItems:'center' }}>
            <div style={{ fontSize:'3rem', flexShrink:0 }}>🚨</div>
            <div style={{ flex:1 }}>
              <div style={{ fontFamily:D.display, fontSize:'1.4rem', fontWeight:700, color:C.text, marginBottom:'0.35rem' }}>Stuck on the road?</div>
              <div style={{ fontFamily:D.body, fontSize:'0.95rem', color:C.textSoft, lineHeight:1.6 }}>Our rapid response network covers 50+ cities. Average arrival under 45 minutes — 24 hours a day, 365 days a year.</div>
            </div>
            <button onClick={() => setStep('requesting')}
              style={{ flexShrink:0, background:'#ef4444', border:'none', borderRadius:12, padding:'0.9rem 2rem', cursor:'pointer', fontFamily:D.display, fontWeight:700, fontSize:'1rem', color:C.white, whiteSpace:'nowrap', transition:'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background='#dc2626'}
              onMouseLeave={e => e.currentTarget.style.background='#ef4444'}>
              Request Now
            </button>
          </div>

          <div style={{ marginBottom:'2rem' }}>
            <div style={{ fontFamily:D.display, fontSize:'1.15rem', fontWeight:700, color:C.text, marginBottom:'1rem' }}>What do you need help with?</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
              {ISSUES.map(i => (
                <div key={i.id} onClick={() => { setIssue(i.id); setStep('requesting') }}
                  style={{ background:C.surface2, borderRadius:14, padding:'1.5rem', textAlign:'center', cursor:'pointer', border:`1px solid ${C.border}`, transition:'all 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.background='#3d4258'; e.currentTarget.style.borderColor='rgba(239,68,68,0.3)'; e.currentTarget.style.transform='translateY(-3px)' }}
                  onMouseLeave={e => { e.currentTarget.style.background=C.surface2; e.currentTarget.style.borderColor=C.border; e.currentTarget.style.transform='translateY(0)' }}>
                  <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>{i.icon}</div>
                  <div style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:600, color:C.text, marginBottom:'0.35rem' }}>{i.label}</div>
                  <div style={{ fontFamily:D.body, fontSize:'0.78rem', color:'#ef4444' }}>~{i.eta} ETA</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background:C.surface2, borderRadius:16, padding:'1.5rem', border:`1px solid ${C.border}` }}>
            <div style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:700, color:C.text, marginBottom:'1rem' }}>Coverage Cities</div>
            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
              {['Bangalore','Chennai','Mumbai','Pune','Hyderabad','Delhi','Gurgaon','Noida','Kolkata','Ahmedabad','Kochi','Coimbatore'].map(city => (
                <span key={city} style={{ fontFamily:D.body, fontSize:'0.8rem', fontWeight:500, padding:'0.3rem 0.8rem', background:'rgba(239,131,84,0.08)', border:'1px solid rgba(239,131,84,0.2)', borderRadius:20, color:C.coral }}>{city}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === 'requesting' && (
        <div style={{ maxWidth:560, margin:'0 auto' }}>
          <div style={{ background:C.surface2, borderRadius:20, padding:'2rem', border:`1px solid ${C.border}` }}>
            <div style={{ fontFamily:D.display, fontSize:'1.5rem', fontWeight:700, color:C.text, marginBottom:'0.5rem' }}>Where are you?</div>
            <div style={{ fontFamily:D.body, fontSize:'0.9rem', color:C.textMuted, marginBottom:'1.75rem' }}>Help us find you so we can dispatch the nearest team.</div>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div>
                <label style={{ fontFamily:D.body, fontSize:'0.78rem', fontWeight:600, color:C.textMuted, display:'block', marginBottom:'0.4rem', letterSpacing:'0.06em', textTransform:'uppercase' }}>Your Location</label>
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  <input placeholder="e.g. Near Forum Mall, Koramangala, Bangalore"
                    style={{ flex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.8rem 1rem', color:C.text, fontFamily:D.body, fontSize:'0.9rem', outline:'none' }}
                    onFocus={e => e.target.style.borderColor='rgba(239,131,84,0.5)'}
                    onBlur={e => e.target.style.borderColor=C.border} />
                  <button style={{ background:'rgba(239,131,84,0.1)', border:'1px solid rgba(239,131,84,0.3)', borderRadius:10, padding:'0.8rem 1rem', cursor:'pointer', color:C.coral, fontSize:'1.1rem' }}>📍</button>
                </div>
              </div>
              <div>
                <label style={{ fontFamily:D.body, fontSize:'0.78rem', fontWeight:600, color:C.textMuted, display:'block', marginBottom:'0.4rem', letterSpacing:'0.06em', textTransform:'uppercase' }}>Select Issue</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.5rem' }}>
                  {ISSUES.map(i => (
                    <button key={i.id} onClick={() => setIssue(i.id)}
                      style={{ background: issue===i.id ? 'rgba(239,68,68,0.15)' : C.surface, border:`1px solid ${issue===i.id ? 'rgba(239,68,68,0.4)' : C.border}`, borderRadius:10, padding:'0.7rem', cursor:'pointer', display:'flex', alignItems:'center', gap:'0.6rem', transition:'all 0.2s' }}>
                      <span style={{ fontSize:'1.2rem' }}>{i.icon}</span>
                      <span style={{ fontFamily:D.body, fontSize:'0.82rem', fontWeight:500, color: issue===i.id ? C.text : C.textMuted }}>{i.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontFamily:D.body, fontSize:'0.78rem', fontWeight:600, color:C.textMuted, display:'block', marginBottom:'0.4rem', letterSpacing:'0.06em', textTransform:'uppercase' }}>Phone Number</label>
                <input placeholder="+91 98765 43210"
                  style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.8rem 1rem', color:C.text, fontFamily:D.body, fontSize:'0.9rem', outline:'none' }}
                  onFocus={e => e.target.style.borderColor='rgba(239,131,84,0.5)'}
                  onBlur={e => e.target.style.borderColor=C.border} />
              </div>
              <button onClick={() => setStep('live')}
                style={{ width:'100%', background:'#ef4444', border:'none', borderRadius:12, padding:'1rem', cursor:'pointer', fontFamily:D.display, fontWeight:700, fontSize:'1rem', color:C.white, marginTop:'0.5rem', transition:'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background='#dc2626'}
                onMouseLeave={e => e.currentTarget.style.background='#ef4444'}>
                🚨 Dispatch Help Now
              </button>
              <button onClick={() => setStep('home')}
                style={{ background:'none', border:'none', cursor:'pointer', fontFamily:D.body, fontSize:'0.85rem', color:C.textMuted, padding:'0.25rem' }}>
                ← Back
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'live' && (
        <div style={{ maxWidth:560, margin:'0 auto' }}>
          <div style={{ background:C.surface2, borderRadius:20, padding:'2.5rem', border:'1px solid rgba(239,68,68,0.25)', textAlign:'center' }}>
            <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(239,68,68,0.12)', border:'2px solid rgba(239,68,68,0.35)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', margin:'0 auto 1.5rem' }}>🚨</div>
            <div style={{ fontFamily:D.display, fontSize:'1.8rem', fontWeight:700, color:C.text, marginBottom:'0.5rem' }}>Help is on the way!</div>
            <div style={{ fontFamily:D.body, fontSize:'0.95rem', color:C.textMuted, marginBottom:'2rem', lineHeight:1.6 }}>A responder has been dispatched. You'll receive an SMS with their name and live location.</div>

            <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.22)', borderRadius:16, padding:'1.5rem', marginBottom:'1.5rem' }}>
              <div style={{ fontFamily:D.body, fontSize:'0.75rem', fontWeight:600, letterSpacing:'0.12em', textTransform:'uppercase', color:'#ef4444', marginBottom:'0.5rem' }}>Estimated Arrival</div>
              <div style={{ fontFamily:D.display, fontSize:'3.5rem', fontWeight:700, color:C.text, lineHeight:1 }}>38 <span style={{ fontSize:'1.5rem', color:C.textMuted }}>min</span></div>
            </div>

            <div style={{ background:C.surface, borderRadius:14, padding:'1.25rem', display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem', textAlign:'left' }}>
              <div style={{ width:48, height:48, borderRadius:'50%', background:C.coral, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'1.1rem', color:C.white, flexShrink:0 }}>R</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:D.display, fontSize:'1.05rem', fontWeight:600, color:C.text }}>Rajan Kumar</div>
                <div style={{ fontFamily:D.body, fontSize:'0.8rem', color:C.textMuted }}>Roadside Technician · ★ 4.9 · 847 assists</div>
              </div>
              <button style={{ background:'rgba(94,170,126,0.12)', border:'1px solid rgba(94,170,126,0.3)', borderRadius:10, padding:'0.5rem 1rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.82rem', color:C.green }}>📞 Call</button>
            </div>

            <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem', textAlign:'left', marginBottom:'1.5rem' }}>
              {[
                { label:'Request received', done:true },
                { label:'Responder dispatched', done:true },
                { label:'En route to your location', done:false, active:true },
                { label:'Arrived', done:false },
              ].map(({ label, done, active }) => (
                <div key={label} style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                  <div style={{ width:20, height:20, borderRadius:'50%', background: done ? C.green : active ? 'rgba(239,68,68,0.25)' : C.surface, border:`2px solid ${done ? C.green : active ? '#ef4444' : C.border}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    {done && <span style={{ fontSize:'0.6rem', color:C.white }}>✓</span>}
                    {active && <div style={{ width:6, height:6, borderRadius:'50%', background:'#ef4444' }} />}
                  </div>
                  <span style={{ fontFamily:D.body, fontSize:'0.88rem', fontWeight: active ? 600 : 400, color: done || active ? C.text : C.textMuted }}>{label}</span>
                </div>
              ))}
            </div>

            <button onClick={() => setStep('home')}
              style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.7rem 2rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.85rem', color:C.textMuted }}>
              Cancel Request
            </button>
          </div>
        </div>
      )}
    </ServiceDetailShell>
  )
}

function InsuranceView({ onBack }) {
  const plans = [
    { name:'BasicShield', insurer:'Bajaj Allianz', premium:'₹3,200/yr', cover:'Third Party', idv:'₹0 (TP Only)', color:'#4F5D75', features:['Third Party Liability','PA Cover','24/7 Claim Support'] },
    { name:'TotalGuard', insurer:'HDFC ERGO', premium:'₹8,400/yr', cover:'Comprehensive', idv:'₹6.2L', color:'#EF8354', popular:true, features:['Own Damage Cover','Zero Dep Add-on','Roadside Assist','Engine Protection'] },
    { name:'EliteCover', insurer:'ICICI Lombard', premium:'₹11,800/yr', cover:'Comprehensive+', idv:'₹6.2L', color:'#5eaa7e', features:['Zero Depreciation','Return to Invoice','NCB Protection','Consumables Cover','Key Replacement'] },
  ]
  return (
    <ServiceDetailShell icon="🛡️" title="Insurance Portal" color="#a855f7" onBack={onBack}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
        {plans.map(p => (
          <div key={p.name} style={{ background:C.surface2, borderRadius:16, padding:'1.75rem', border:`1px solid ${p.popular ? 'rgba(239,131,84,0.4)' : C.border}`, position:'relative', transition:'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform='translateY(-3px)'}
            onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
            {p.popular && (
              <div style={{ position:'absolute', top:-12, left:'50%', transform:'translateX(-50%)', fontFamily:D.body, fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', background:C.coral, color:C.white, padding:'0.25rem 0.9rem', borderRadius:20 }}>
                Most Popular
              </div>
            )}
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.25rem' }}>
              <div style={{ width:40, height:40, borderRadius:10, background:`${p.color}22`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem' }}>🛡️</div>
              <div>
                <div style={{ fontFamily:D.display, fontSize:'1.1rem', fontWeight:700, color:C.text }}>{p.name}</div>
                <div style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.textMuted }}>{p.insurer}</div>
              </div>
            </div>
            <div style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:700, color:p.color, lineHeight:1, marginBottom:'0.25rem' }}>{p.premium}</div>
            <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.25rem' }}>
              <span style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:600, padding:'0.2rem 0.6rem', borderRadius:6, background:`${p.color}22`, color:p.color }}>{p.cover}</span>
              <span style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:500, padding:'0.2rem 0.6rem', borderRadius:6, background:'rgba(191,192,192,0.08)', color:C.textMuted }}>IDV {p.idv}</span>
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1.5rem' }}>
              {p.features.map(f => (
                <div key={f} style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <span style={{ color:C.green, fontSize:'0.75rem' }}>✓</span>
                  <span style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textSoft }}>{f}</span>
                </div>
              ))}
            </div>
            <button style={{ width:'100%', background:p.popular ? C.coral : 'transparent', border:`1px solid ${p.popular ? C.coral : C.borderBright}`, borderRadius:10, padding:'0.75rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.88rem', color:p.popular ? C.white : C.text, transition:'all 0.2s' }}
              onMouseEnter={e => { if (!p.popular) { e.currentTarget.style.background=C.surface; e.currentTarget.style.borderColor=C.coral; e.currentTarget.style.color=C.coral }}}
              onMouseLeave={e => { if (!p.popular) { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor=C.borderBright; e.currentTarget.style.color=C.text }}}>
              Buy Now
            </button>
          </div>
        ))}
      </div>
    </ServiceDetailShell>
  )
}

function GenericServiceView({ service, onBack }) {
  const [contactId, setContactId] = useState(null)
  const providers = [
    { id:1, name:'Top Provider', rating:4.8, reviews:214, location:'Bangalore', speciality:`${service.tags[0]} · ${service.tags[1]}`, price:'By Quote', verified:true },
    { id:2, name:'Pro Studio', rating:4.6, reviews:178, location:'Chennai', speciality:`${service.tags[1]} · ${service.tags[2]}`, price:'₹2,000+', verified:true },
    { id:3, name:'Expert Solutions', rating:4.9, reviews:89, location:'Mumbai', speciality:`${service.tags[0]} · Specialist`, price:'₹1,500+', verified:false },
  ]
  return (
    <ServiceDetailShell icon={service.icon} title={service.title} color={service.color} onBack={onBack}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem' }}>
        {providers.map(p => (
          <div key={p.id} style={{ background:C.surface2, borderRadius:16, padding:'1.5rem', border:`1px solid ${C.border}`, transition:'transform 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1rem' }}>
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.2rem' }}>
                  <span style={{ fontFamily:D.display, fontWeight:700, fontSize:'1.05rem', color:C.text }}>{p.name}</span>
                  {p.verified && <span style={{ fontSize:'0.65rem', fontWeight:600, color:C.green, background:'rgba(94,170,126,0.12)', padding:'0.1rem 0.45rem', borderRadius:5 }}>✓</span>}
                </div>
                <div style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted }}>📍 {p.location}</div>
              </div>
              <div style={{ textAlign:'right' }}>
                <div style={{ fontFamily:D.display, fontWeight:700, color:C.amber }}>★ {p.rating}</div>
                <div style={{ fontFamily:D.body, fontSize:'0.7rem', color:C.textMuted }}>{p.reviews} reviews</div>
              </div>
            </div>
            <div style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textSoft, marginBottom:'0.75rem' }}>{p.speciality}</div>
            <div style={{ fontFamily:D.display, fontSize:'1.1rem', fontWeight:700, color:service.color, marginBottom:'1rem' }}>{p.price}</div>
            {contactId === p.id ? (
              <div style={{ background:'rgba(239,131,84,0.08)', border:'1px solid rgba(239,131,84,0.2)', borderRadius:10, padding:'0.85rem' }}>
                <input placeholder="Your phone number" style={{ width:'100%', background:C.surface, border:`1px solid ${C.border}`, borderRadius:8, padding:'0.5rem 0.8rem', color:C.text, fontFamily:D.body, fontSize:'0.85rem', outline:'none', marginBottom:'0.5rem' }} />
                <button style={{ width:'100%', background:C.coral, border:'none', borderRadius:8, padding:'0.5rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.82rem', color:C.white }}>Send Request</button>
              </div>
            ) : (
              <button onClick={() => setContactId(p.id)}
                style={{ width:'100%', background:service.color, border:'none', borderRadius:10, padding:'0.7rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.88rem', color:C.white, transition:'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity='0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity='1'}>
                Get Quote
              </button>
            )}
          </div>
        ))}
      </div>
    </ServiceDetailShell>
  )
}

export default function ServicesPage() {
  const [activeService, setActiveService] = useState(null)
  const active = SERVICE_FEATURES.find(s => s.id === activeService)

  return (
    <div style={{ minHeight:'calc(100vh - 60px)', background:C.bg, padding:'2.5rem 3rem' }}>
      <div style={{ maxWidth:1300, margin:'0 auto' }}>
        {!activeService ? (
          <>
            <div style={{ marginBottom:'3rem' }}>
              <div style={{ fontFamily:D.body, fontSize:'0.75rem', fontWeight:600, letterSpacing:'0.15em', textTransform:'uppercase', color:C.coral, marginBottom:'0.5rem' }}>Real World</div>
              <h1 style={{ fontFamily:D.display, fontSize:'3rem', fontWeight:700, color:C.text, lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:'0.75rem' }}>Services Directory</h1>
              <p style={{ fontFamily:D.body, fontSize:'1.05rem', color:C.textMuted, maxWidth:580, lineHeight:1.65 }}>
                Everything your vehicle needs — repair, upgrades, protection, and emergency help. All services verified by the TorqueGrid community.
              </p>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'1.5rem' }}>
              {SERVICE_FEATURES.map(s => (
                <div key={s.id} onClick={() => setActiveService(s.id)}
                  style={{ background:C.surface, borderRadius:20, padding:'2rem', cursor:'pointer', border:`1px solid ${s.urgent ? 'rgba(239,68,68,0.22)' : C.border}`, transition:'all 0.25s', position:'relative', overflow:'hidden', display:'flex', flexDirection:'column' }}
                  onMouseEnter={e => { e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.background=C.surface2; e.currentTarget.style.borderColor=`${s.color}55` }}
                  onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.background=C.surface; e.currentTarget.style.borderColor=s.urgent ? 'rgba(239,68,68,0.22)' : C.border }}>

                  <div style={{ position:'absolute', top:-40, right:-40, width:140, height:140, borderRadius:'50%', background:s.color, opacity:0.06, pointerEvents:'none' }} />

                  {s.urgent && (
                    <div style={{ position:'absolute', top:16, right:16, fontFamily:D.body, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', background:'rgba(239,68,68,0.15)', color:'#ef4444', border:'1px solid rgba(239,68,68,0.3)', padding:'0.2rem 0.6rem', borderRadius:20 }}>
                      24/7 Live
                    </div>
                  )}

                  <div style={{ width:60, height:60, borderRadius:16, background:s.colorDim, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', marginBottom:'1.5rem' }}>{s.icon}</div>

                  <div style={{ fontFamily:D.display, fontSize:'1.35rem', fontWeight:700, color:C.text, marginBottom:'0.35rem', letterSpacing:'-0.01em' }}>{s.title}</div>
                  <div style={{ fontFamily:D.body, fontSize:'0.82rem', fontWeight:500, color:s.color, marginBottom:'0.75rem' }}>{s.subtitle}</div>
                  <p style={{ fontFamily:D.body, fontSize:'0.88rem', color:C.textMuted, lineHeight:1.65, marginBottom:'1.5rem', flex:1 }}>{s.desc}</p>

                  <div style={{ display:'flex', gap:'1.25rem', marginBottom:'1.5rem', paddingTop:'1rem', borderTop:`1px solid ${C.border}` }}>
                    {s.stats.map(([val, label]) => (
                      <div key={label}>
                        <div style={{ fontFamily:D.display, fontSize:'1.05rem', fontWeight:700, color:s.color, lineHeight:1 }}>{val}</div>
                        <div style={{ fontFamily:D.body, fontSize:'0.68rem', color:C.textMuted, marginTop:'0.15rem' }}>{label}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'1.5rem' }}>
                    {s.tags.slice(0,3).map(tag => (
                      <span key={tag} style={{ fontFamily:D.body, fontSize:'0.7rem', fontWeight:500, padding:'0.2rem 0.65rem', background:`${s.color}12`, border:`1px solid ${s.color}33`, borderRadius:20, color:s.color }}>{tag}</span>
                    ))}
                    {s.tags.length > 3 && <span style={{ fontFamily:D.body, fontSize:'0.7rem', color:C.textMuted, alignSelf:'center' }}>+{s.tags.length - 3} more</span>}
                  </div>

                  <button style={{ width:'100%', background:s.urgent ? '#ef4444' : s.color, border:'none', borderRadius:12, padding:'0.875rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', color:C.white, transition:'opacity 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}
                    onMouseEnter={e => e.currentTarget.style.opacity='0.88'}
                    onMouseLeave={e => e.currentTarget.style.opacity='1'}>
                    {s.urgent && '🚨'} {s.cta} →
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {active?.id === 'repair' && <RepairView onBack={() => setActiveService(null)} />}
            {active?.id === 'roadside' && <RoadsideView onBack={() => setActiveService(null)} />}
            {active?.id === 'insurance' && <InsuranceView onBack={() => setActiveService(null)} />}
            {(active?.id === 'mods' || active?.id === 'detailing' || active?.id === 'pdi') && (
              <GenericServiceView service={active} onBack={() => setActiveService(null)} />
            )}
          </>
        )}
      </div>
    </div>
  )
}