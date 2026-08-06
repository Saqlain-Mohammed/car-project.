import { useState } from 'react'
import { Wrench, Settings2, Sparkles, ClipboardCheck, Shield, LifeBuoy, ChevronLeft, MapPin, CheckCircle2, Star } from 'lucide-react'
import { C, D, R, SHADOW, SERIES } from '../../lib/theme'
import { PageHeader, Card, Badge, Avatar, Button, Divider, Input, EmptyState, Field } from '../ui/Primitives'
import { useServiceEnquiry } from '../../hooks/useServices'

const SERVICES = [
  { id:'repair',    Icon: Wrench,         title:'Repair & Service',   tone: SERIES[0],
    tagline:'Trusted mechanics near you',
    desc:'Verified workshops, garages, and mobile mechanics. Compare ratings, specialities, and pricing before you book.',
    stats:[['2,400+','Verified shops'],['4.7','Avg rating'],['< 2h','Response']],
    tags:['Engine repair','Oil change','Brakes','AC','Electrical'] },
  { id:'mods',      Icon: Settings2,      title:'Custom Mods',        tone: SERIES[3],
    tagline:'Build your dream machine',
    desc:'Specialist fabricators, tuners, and body shops. From bolt-ons to full engine builds with accurate quotes upfront.',
    stats:[['860+','Mod shops'],['500+','Projects'],['₹500+','From']],
    tags:['Turbo kits','Body kits','Exhaust','Roll cages','ECU tune'] },
  { id:'detailing', Icon: Sparkles,       title:'Detailing',          tone: SERIES[2],
    tagline:'Showroom finish, every time',
    desc:'PPF, ceramic coatings, paint correction, and full interior detailing — with verified before-and-after portfolios.',
    stats:[['620+','Studios'],['99%','Satisfaction'],['1 day','Turnaround']],
    tags:['PPF','Ceramic coat','Paint correction','Interior'] },
  { id:'pdi',       Icon: ClipboardCheck, title:'PDI Checks',         tone: SERIES[5],
    tagline:'Know before you buy',
    desc:'Professional pre-delivery inspection for used vehicles. 150-point checklist, OBD scan, and a full digital report.',
    stats:[['150pt','Inspection'],['₹1,500','Starting'],['24h','Report']],
    tags:['OBD scan','Engine check','Chassis','Test drive','Documents'] },
  { id:'insurance', Icon: Shield,         title:'Insurance',          tone: SERIES[4],
    tagline:'Compare, buy, and manage',
    desc:'Compare policies from twelve insurers instantly. File claims and track renewals from your garage profile.',
    stats:[['12+','Insurers'],['3 min','Quote'],['24/7','Claims']],
    tags:['Third party','Comprehensive','Zero dep','NCB protect'] },
  { id:'roadside',  Icon: LifeBuoy,       title:'Roadside Assistance',tone: C.danger, urgent: true,
    tagline:'We come to you, anywhere',
    desc:'Flat tyre, dead battery, or worse — rapid response teams reach you in under 45 minutes, around the clock.',
    stats:[['< 45m','Response'],['24/7','Always on'],['50+','Cities']],
    tags:['Flat tyre','Battery','Towing','Fuel','Lockout'] },
]

const PROVIDERS = {
  repair: [
    { id:1, name:'Pradeep Motors', rating:4.8, reviews:214, city:'Indiranagar, Bangalore', speciality:'Japanese cars · ECU tuning', price:'₹500/hr', verified:true,  status:'Available now' },
    { id:2, name:'AutoCare Pro',   rating:4.6, reviews:178, city:'Koramangala, Bangalore', speciality:'All makes · AC specialist',  price:'₹400/hr', verified:true,  status:'1 hour wait' },
    { id:3, name:'SpeedWrench',    rating:4.9, reviews:89,  city:'HSR Layout, Bangalore',  speciality:'Performance & mods',         price:'₹700/hr', verified:true,  status:'Available now' },
    { id:4, name:'QuickFix Garage',rating:4.4, reviews:312, city:'Whitefield, Bangalore',  speciality:'Budget repairs · Multi-brand',price:'₹300/hr', verified:false, status:'2 hour wait' },
  ],
}

const GENERIC = svc => [
  { id:1, name:'Top Provider',      rating:4.8, reviews:214, city:'Bangalore', speciality:`${svc.tags[0]} · ${svc.tags[1]}`, price:'By quote', verified:true,  status:'Available now' },
  { id:2, name:'Pro Studio',        rating:4.6, reviews:178, city:'Chennai',   speciality:`${svc.tags[1]} · ${svc.tags[2] ?? svc.tags[0]}`, price:'₹2,000+', verified:true,  status:'Booking' },
  { id:3, name:'Expert Solutions',  rating:4.9, reviews:89,  city:'Mumbai',    speciality:`${svc.tags[0]} specialist`,        price:'₹1,500+', verified:false, status:'Available now' },
]

/* ── Get quote — validated, submits, and confirms ───────── */
function ContactProvider({ name, serviceType }) {
  const [phone, setPhone]   = useState('')
  const [touched, setTouched] = useState(false)
  const [state, setState]   = useState('idle')   // idle | sending | sent | error
  const submitEnquiry = useServiceEnquiry()

  // Indian mobile numbers are 10 digits; allow an optional +91 / 0 prefix.
  const digits = phone.replace(/\D/g, '')
  const valid  = /^(?:91|0)?[6-9]\d{9}$/.test(digits)
  const showError = touched && phone.length > 0 && !valid

  const submit = async () => {
    if (!valid || state === 'sending') return
    setState('sending')
    try {
      await submitEnquiry.mutateAsync({
        phone: digits.slice(-10),
        providerName: name,
        serviceType,
        message: `Quote request for ${name}`,
      })
      setState('sent')
    } catch {
      // The mutation surfaces a toast; keep the form open so it can be retried.
      setState('error')
    }
  }

  if (state === 'sent') return (
    <div className="t-fade" style={{ display:'flex', alignItems:'center', gap:'0.7rem', padding:'0.8rem 0.9rem', background:C.successBg, borderRadius:R.md }}>
      <CheckCircle2 size={18} color={C.success} style={{ flexShrink:0 }} />
      <div style={{ minWidth:0 }}>
        <div style={{ fontFamily:D.body, fontSize:'0.82rem', fontWeight:600, color:C.success }}>Quote requested</div>
        <div style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.textMuted }}>{name} will call {digits.slice(-10)} shortly.</div>
      </div>
    </div>
  )

  return (
    <div>
      <div style={{ display:'flex', gap:'0.5rem', alignItems:'flex-start' }}>
        <div style={{ flex:1, minWidth:0 }}>
          <Input value={phone} inputMode="tel"
            onChange={e => setPhone(e.target.value)}
            onBlur={() => setTouched(true)}
            placeholder="Your phone number"
            aria-invalid={showError}
            aria-label={`Phone number to get a quote from ${name}`}
            onKeyDown={e => e.key === 'Enter' && submit()} />
        </div>
        <Button onClick={submit} disabled={!valid} loading={state === 'sending'}>
          Get quote
        </Button>
      </div>
      {showError && (
        <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.danger, marginTop:'0.35rem' }}>
          Enter a valid 10-digit mobile number.
        </div>
      )}
      {state === 'error' && (
        <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.danger, marginTop:'0.35rem' }}>
          Could not send that request. Please try again.
        </div>
      )}
    </div>
  )
}

/* ── Provider card ──────────────────────────────────────── */
function ProviderCard({ p, serviceType }) {
  const open = p.status === 'Available now'
  return (
    <Card radius={R.lg} padding={20}>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem', marginBottom:'0.85rem' }}>
        <div style={{ minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.45rem', marginBottom:'0.25rem', flexWrap:'wrap' }}>
            <span style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:600, color:C.text, letterSpacing:'-0.01em' }}>{p.name}</span>
            {p.verified && <Badge tone="success">Verified</Badge>}
          </div>
          <div style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted, display:'flex', alignItems:'center', gap:'0.3rem' }}>
            <MapPin size={11} /> {p.city}
          </div>
        </div>
        <div style={{ textAlign:'right', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.25rem', justifyContent:'flex-end' }}>
            <Star size={13} color={C.live} fill={C.live} />
            <span style={{ fontFamily:D.display, fontSize:'0.95rem', fontWeight:700, color:C.text, fontVariantNumeric:'tabular-nums' }}>{p.rating}</span>
          </div>
          <div style={{ fontFamily:D.body, fontSize:'0.71rem', color:C.textDim, marginTop:'0.15rem', fontVariantNumeric:'tabular-nums' }}>{p.reviews} reviews</div>
        </div>
      </div>

      <div style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textSoft, marginBottom:'0.9rem' }}>{p.speciality}</div>

      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem', gap:'0.75rem' }}>
        <span style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:700, color:C.accent }}>{p.price}</span>
        <Badge tone={open ? 'success' : 'live'} dot>{p.status}</Badge>
      </div>

      <ContactProvider name={p.name} serviceType={serviceType} />
    </Card>
  )
}

/* ── Page ───────────────────────────────────────────────── */
export default function ServicesPage() {
  const [active, setActive] = useState(null)

  if (active) {
    const providers = PROVIDERS[active.id] ?? GENERIC(active)
    return (
      <div style={{ padding:'2rem 2.25rem 3rem', maxWidth:1240, margin:'0 auto' }}>
        <Button variant="ghost" icon={ChevronLeft} onClick={() => setActive(null)} style={{ marginBottom:'1.5rem' }}>
          All services
        </Button>

        <div style={{ display:'flex', alignItems:'flex-start', gap:'1.1rem', marginBottom:'1.75rem' }}>
          <div style={{ width:52, height:52, borderRadius:R.md, background:`${active.tone}1F`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <active.Icon size={24} color={active.tone} />
          </div>
          <div>
            <h1 style={{ fontFamily:D.display, fontSize:'1.75rem', fontWeight:700, color:C.text, letterSpacing:'-0.02em' }}>{active.title}</h1>
            <p style={{ fontFamily:D.body, fontSize:'0.9rem', color:C.textMuted, marginTop:'0.35rem', maxWidth:560, lineHeight:1.6 }}>{active.desc}</p>
          </div>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:'1.15rem' }}>
          {providers.map(p => <ProviderCard key={p.id} p={p} serviceType={active.id} />)}
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding:'2rem 2.25rem 3rem', maxWidth:1240, margin:'0 auto' }}>
      <PageHeader eyebrow="Services" title="Get it sorted"
        description="Repair, upgrades, protection, and emergency help — every provider verified by the TorqueGrid community." />

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(330px,1fr))', gap:'1.15rem' }}>
        {SERVICES.map(svc => (
          <Card key={svc.id} hover onClick={() => setActive(svc)} padding={0} radius={R.xl}
            style={{ overflow:'hidden', boxShadow:SHADOW.sm }}>
            <div style={{ padding:'1.5rem 1.5rem 1.25rem', background:`linear-gradient(150deg, ${svc.tone}12, transparent 70%)` }}>
              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:'1rem', marginBottom:'1rem' }}>
                <div style={{ width:46, height:46, borderRadius:R.md, background:`${svc.tone}1F`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <svc.Icon size={21} color={svc.tone} />
                </div>
                {svc.urgent && <Badge tone="danger" dot>24/7</Badge>}
              </div>
              <h3 style={{ fontFamily:D.display, fontSize:'1.15rem', fontWeight:700, color:C.text, letterSpacing:'-0.015em', marginBottom:'0.2rem' }}>{svc.title}</h3>
              <div style={{ fontFamily:D.body, fontSize:'0.8rem', color:svc.tone, marginBottom:'0.7rem' }}>{svc.tagline}</div>
              <p style={{ fontFamily:D.body, fontSize:'0.845rem', color:C.textMuted, lineHeight:1.6 }}>{svc.desc}</p>
            </div>

            <Divider />

            <div style={{ padding:'1rem 1.5rem', display:'flex', gap:'1.75rem' }}>
              {svc.stats.map(([v, l]) => (
                <div key={l}>
                  <div style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:700, color:C.text, fontVariantNumeric:'tabular-nums' }}>{v}</div>
                  <div style={{ fontFamily:D.body, fontSize:'0.69rem', color:C.textMuted, marginTop:'0.15rem' }}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{ padding:'0 1.5rem 1.35rem', display:'flex', gap:'0.35rem', flexWrap:'wrap' }}>
              {svc.tags.slice(0, 4).map(t => <Badge key={t}>{t}</Badge>)}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
