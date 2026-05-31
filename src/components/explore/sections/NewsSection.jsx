import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Flame, Clock, TrendingUp, Eye, X, BookOpen, Share2, Bookmark } from 'lucide-react'

const C = { bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50', coral:'#EF8354', coralDim:'#d96a3a', text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0', border:'rgba(191,192,192,0.12)' }
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const NEWS = [
  { id:1, tag:'F1 2026', title:'New Power Unit Regulations Lock In Final Spec', time:'2h ago', read:4, views:18400, emoji:'🏎️', hot:true,
    desc:'All ten teams have signed off on the 2026 technical regulations.',
    body:`The 2026 Formula 1 power unit regulations have been officially locked in after months of negotiations between the FIA, Formula 1 Management, and all ten constructors. The new rules mandate a 50/50 split between internal combustion and electrical power, capping the ICE at around 550bhp with the MGU-H removed entirely.\n\nAll current engine suppliers — Mercedes, Ferrari, Renault, Honda, and new entrant Volkswagen — have confirmed they will produce compliant units. The regulations also introduce a standardised energy store and control electronics to help reduce development costs for smaller teams.\n\n"This is the most significant regulatory reset since 2014," said FIA president Mohammed Ben Sulayem. "We have created a platform for close racing and a sustainable future for the sport."` },
  { id:2, tag:'MotoGP', title:'Marquez Takes Pole at Mugello — Record Lap', time:'5h ago', read:3, views:24100, emoji:'🏍️', hot:true,
    desc:'Marc Marquez set a new circuit record in qualifying at Mugello.',
    body:`Marc Marquez delivered a stunning qualifying performance at the Autodromo del Mugello, setting a new all-time lap record of 1:44.761 aboard his Ducati GP25 to claim pole position for the Gran Premio d'Italia.\n\nThe Spaniard, who has returned to championship-winning form this season, was nearly two tenths clear of factory Ducati teammate Francesco Bagnaia in second. Jorge Martin on the Aprilia RS-GP qualified third.\n\n"The bike felt incredible in sector three," Marquez said. "We made a small change to the front geometry yesterday and everything clicked. I'm confident for the race." With light rain forecast for Sunday, the grid order could be crucial.` },
  { id:3, tag:'Indian Market', title:'Tata Curvv EV Sales Cross 10,000 Units', time:'8h ago', read:2, views:9800, emoji:'⚡', hot:false,
    desc:'The Curvv EV crosses a major milestone just six months after launch.',
    body:`Tata Motors has announced that cumulative sales of the Curvv EV have crossed 10,000 units in just six months since launch, making it the fastest-selling premium electric vehicle in India. The milestone underscores growing EV adoption in the country's ₹20–30 lakh segment.\n\nThe Curvv EV is available in two battery variants — 45kWh and 55kWh — with the larger pack claiming a real-world range of over 500km. Tata attributes its success to an expanded fast-charging network, competitive pricing, and strong after-sales support through Tata-authorised service centres nationwide.\n\nThe company plans to add three new colour options and a performance AWD variant in Q3 2026.` },
  { id:4, tag:'Mod Guide', title:'Best Budget Suspension Upgrades Under ₹30K', time:'1d ago', read:6, views:31200, emoji:'🔧', hot:false,
    desc:'We tested 8 suspension kits to find the best bang for buck.',
    body:`After three months of real-world testing across track days, canyon roads, and daily city use, we've ranked the eight most popular budget coilover and spring kits available in India under ₹30,000.\n\n**1. Tein Street Basis Z (₹28,500)** — Best all-rounder. 16-way dampening adjustment, excellent ride quality on broken roads. Recommended for daily drivers.\n\n**2. KW V1 (₹27,000)** — German engineering at an accessible price. Fixed damping but very well-tuned from the factory. Ideal for those who don't want to adjust.\n\n**3. BC Racing BR (₹24,500)** — Most adjustable in this price range. 30-way click adjustment. Slight harshness on potholes but exceptional cornering response.\n\n**Budget King: Megan Racing Street (₹18,000)** — If you want to drop ride height on a budget without sacrificing too much comfort, this is the pick for city use.` },
  { id:5, tag:'Royal Enfield', title:'Himalayan 450 Gets New Colour for 2026 Season', time:'1d ago', read:2, views:7300, emoji:'🏔️', hot:false,
    desc:'Royal Enfield adds three new colourways to the Himalayan 450.',
    body:`Royal Enfield has quietly updated the Himalayan 450 lineup for the 2026 model year with three new colour options: Granite Black, Forest Green, and Slate Blue. All three add a matte finish variant to the range, a first for the Himalayan nameplate.\n\nMechanically, the bike remains unchanged — powered by the proven 452cc Sherpa single-cylinder engine producing 40hp and 40Nm of torque. However, the company has revised the USB-C charging socket placement to a more accessible location on the tank console.\n\nPrices start at ₹3.09 lakh (ex-showroom) for the base Slate variant, with the new colours priced at a ₹8,000 premium. Deliveries begin from the first week of July.` },
  { id:6, tag:'JDM', title:'Toyota Supra A100 Confirmed — Manual Returns', time:'2d ago', read:5, views:52100, emoji:'🚗', hot:true,
    desc:'Toyota confirms the next Supra will offer a 6-speed manual.',
    body:`Toyota has officially confirmed the next-generation Supra, internally codenamed A100, will be offered with a 6-speed manual gearbox — the first manual Supra since the iconic A80 generation was discontinued in 2002.\n\nThe new car will be powered by Toyota's own 3.0-litre turbocharged inline-six, producing an estimated 420hp, paired with a Getrag-sourced 6MT. A GR-S automatic variant will also be available. The A100 ditches the BMW-derived platform of the current A90 in favour of Toyota's TNGA-F rear-wheel-drive architecture, shared with the LC500.\n\nOfficial reveal is scheduled for the Tokyo Auto Salon in January 2027, with a global launch the following year. No pricing has been confirmed, but sources suggest a starting price around $65,000 USD.` },
]

// Extended full-text body for each article
const NEWS_BODY = Object.fromEntries(NEWS.map(n => [n.id, n.body]))

const SORT_OPTIONS = [
  { value:'latest',     label:'Latest',      Icon: Clock      },
  { value:'trending',   label:'Trending',    Icon: TrendingUp },
  { value:'most_viewed',label:'Most Viewed', Icon: Eye        },
  { value:'hot',        label:'Hot',         Icon: Flame      },
  { value:'quick',      label:'Quick Reads', Icon: Clock      },
]

function sortNews(items, sort) {
  switch (sort) {
    case 'trending':    return [...items].sort((a, b) => b.views - a.views)
    case 'most_viewed': return [...items].sort((a, b) => b.views - a.views)
    case 'hot':         return [...items].filter(n => n.hot).concat(items.filter(n => !n.hot))
    case 'quick':       return [...items].sort((a, b) => a.read - b.read)
    default:            return items
  }
}

function NewsDetailModal({ article, onClose }) {
  const [saved, setSaved] = useState(false)
  const body = NEWS_BODY[article.id] || article.desc
  const paragraphs = body.split('\n\n').filter(Boolean)

  return (
    <div style={{ position:'fixed', inset:0, zIndex:700, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(8,10,18,0.88)', backdropFilter:'blur(8px)' }} onClick={onClose} />
      <div style={{ position:'relative', zIndex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:22, width:'100%', maxWidth:680, maxHeight:'90vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 32px 80px rgba(0,0,0,0.6)' }}>
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, zIndex:10, width:32, height:32, borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, cursor:'pointer', color:C.textMuted, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <X size={15} />
        </button>
        <div style={{ overflowY:'auto', flex:1 }}>
          {/* Hero */}
          <div style={{ background:`linear-gradient(135deg, rgba(239,131,84,0.15), rgba(239,131,84,0.04))`, padding:'2.5rem 2rem 1.5rem', borderBottom:`1px solid ${C.border}`, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-20, right:-20, width:120, height:120, borderRadius:'50%', background:C.coral, opacity:0.06, pointerEvents:'none' }} />
            <div style={{ display:'flex', gap:'0.6rem', marginBottom:'1rem', alignItems:'center' }}>
              {article.hot && <span style={{ fontFamily:D.body, fontSize:'0.65rem', fontWeight:700, color:C.coral, background:'rgba(239,131,84,0.12)', padding:'0.2rem 0.6rem', borderRadius:6, border:'1px solid rgba(239,131,84,0.25)' }}>🔥 Hot</span>}
              <span style={{ fontFamily:D.body, fontSize:'0.7rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.textMuted }}>{article.tag}</span>
              <span style={{ marginLeft:'auto', fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted }}>{article.views.toLocaleString()} views</span>
            </div>
            <div style={{ fontSize:'2.5rem', marginBottom:'0.85rem' }}>{article.emoji}</div>
            <h2 style={{ fontFamily:D.display, fontSize:'1.75rem', fontWeight:700, color:C.text, lineHeight:1.15, marginBottom:'0.75rem' }}>{article.title}</h2>
            <div style={{ display:'flex', alignItems:'center', gap:'1.25rem' }}>
              <span style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted }}>{article.time}</span>
              <span style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted }}><BookOpen size={12} style={{ display:'inline', marginRight:4 }} />{article.read} min read</span>
              <div style={{ marginLeft:'auto', display:'flex', gap:'0.5rem' }}>
                <button onClick={() => setSaved(s => !s)}
                  style={{ display:'flex', alignItems:'center', gap:'0.35rem', padding:'0.35rem 0.75rem', borderRadius:8, background: saved ? 'rgba(245,166,35,0.12)' : 'transparent', border:`1px solid ${saved ? 'rgba(245,166,35,0.3)' : C.border}`, cursor:'pointer', fontFamily:D.body, fontSize:'0.78rem', fontWeight:600, color: saved ? '#f5a623' : C.textMuted, transition:'all 0.2s' }}>
                  <Bookmark size={13} fill={saved ? '#f5a623' : 'none'} /> {saved ? 'Saved' : 'Save'}
                </button>
                <button style={{ display:'flex', alignItems:'center', gap:'0.35rem', padding:'0.35rem 0.75rem', borderRadius:8, background:'transparent', border:`1px solid ${C.border}`, cursor:'pointer', fontFamily:D.body, fontSize:'0.78rem', fontWeight:600, color:C.textMuted, transition:'all 0.2s' }}>
                  <Share2 size={13} /> Share
                </button>
              </div>
            </div>
          </div>

          {/* Article body */}
          <div style={{ padding:'1.75rem 2rem' }}>
            {paragraphs.map((para, i) => (
              para.startsWith('**') ? (
                <p key={i} style={{ fontFamily:D.body, fontSize:'0.92rem', color:C.text, lineHeight:1.75, marginBottom:'1rem', fontWeight:600 }}>
                  {para.replace(/\*\*/g, '')}
                </p>
              ) : (
                <p key={i} style={{ fontFamily:D.body, fontSize:'0.92rem', color:C.textSoft, lineHeight:1.8, marginBottom:'1.1rem' }}>
                  {para}
                </p>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NewsSection() {
  const [sort,        setSort]      = useState('latest')
  const [dropOpen,    setDropOpen]  = useState(false)
  const [activeArticle, setArticle] = useState(null)
  const dropRef = useRef(null)

  useEffect(() => {
    const h = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const sorted     = sortNews(NEWS, sort)
  const feature    = sorted[0]
  const rest       = sorted.slice(1)
  const activeSort = SORT_OPTIONS.find(o => o.value === sort)

  return (
    <div style={{ padding:'2rem' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom:'1.5rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:C.coral, marginBottom:'0.4rem' }}>Latest</div>
          <h2 style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:700, color:C.text, lineHeight:1 }}>News & Updates</h2>
        </div>

        {/* Sort dropdown */}
        <div ref={dropRef} style={{ position:'relative' }}>
          <button onClick={() => setDropOpen(o => !o)}
            style={{ display:'flex', alignItems:'center', gap:'0.6rem', background:C.surface, border:`1px solid ${dropOpen ? 'rgba(239,131,84,0.4)' : C.border}`, borderRadius:12, padding:'0.65rem 1rem', cursor:'pointer', fontFamily:D.body, fontSize:'0.85rem', fontWeight:600, color:C.text, transition:'all 0.2s', minWidth:160 }}>
            {activeSort && <activeSort.Icon size={15} color={C.coral} />}
            <span style={{ flex:1, textAlign:'left' }}>{activeSort?.label}</span>
            <ChevronDown size={14} color={C.textMuted} style={{ transform: dropOpen ? 'rotate(180deg)' : 'rotate(0)', transition:'transform 0.2s' }} />
          </button>
          {dropOpen && (
            <div style={{ position:'absolute', top:'calc(100% + 8px)', right:0, width:180, background:'rgba(26,28,42,0.97)', backdropFilter:'blur(16px)', border:`1px solid ${C.border}`, borderRadius:14, overflow:'hidden', boxShadow:'0 16px 40px rgba(0,0,0,0.5)', zIndex:100 }}>
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
      </div>

      {/* Featured article */}
      <div onClick={() => setArticle(feature)}
        style={{ background:C.surface, borderRadius:20, padding:'2rem', marginBottom:'1.25rem', border:`1px solid rgba(239,131,84,0.25)`, cursor:'pointer', transition:'all 0.2s', position:'relative', overflow:'hidden' }}
        onMouseEnter={e => e.currentTarget.style.borderColor='rgba(239,131,84,0.5)'}
        onMouseLeave={e => e.currentTarget.style.borderColor='rgba(239,131,84,0.25)'}>
        <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140, borderRadius:'50%', background:C.coral, opacity:0.06, pointerEvents:'none' }} />
        <div style={{ display:'flex', gap:'0.6rem', marginBottom:'1rem', alignItems:'center' }}>
          {feature.hot && <span style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:700, color:C.coral, background:'rgba(239,131,84,0.12)', padding:'0.2rem 0.6rem', borderRadius:6, border:'1px solid rgba(239,131,84,0.25)' }}>🔥 Hot</span>}
          <span style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:C.textMuted }}>{feature.tag}</span>
          <span style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted, marginLeft:'auto' }}>{feature.views.toLocaleString()} views</span>
        </div>
        <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>{feature.emoji}</div>
        <h3 style={{ fontFamily:D.display, fontSize:'1.8rem', fontWeight:700, color:C.text, lineHeight:1.1, marginBottom:'0.6rem' }}>{feature.title}</h3>
        <p style={{ fontFamily:D.body, fontSize:'0.9rem', color:C.textMuted, lineHeight:1.6, marginBottom:'0.75rem' }}>{feature.desc}</p>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted }}>{feature.time} · {feature.read} min read</div>
          <span style={{ fontFamily:D.body, fontSize:'0.78rem', fontWeight:600, color:C.coral }}>Read article →</span>
        </div>
      </div>

      {/* Article list */}
      <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
        {rest.map(n => (
          <div key={n.id} onClick={() => setArticle(n)}
            style={{ background:C.surface, borderRadius:14, padding:'1.25rem 1.5rem', display:'flex', gap:'1.25rem', alignItems:'center', cursor:'pointer', border:`1px solid ${C.border}`, transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background=C.surface2; e.currentTarget.style.borderColor='rgba(239,131,84,0.25)' }}
            onMouseLeave={e => { e.currentTarget.style.background=C.surface;  e.currentTarget.style.borderColor=C.border }}>
            <div style={{ width:54, height:54, borderRadius:14, background:'rgba(191,192,192,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', flexShrink:0 }}>{n.emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.35rem' }}>
                {n.hot && <span style={{ fontFamily:D.body, fontSize:'0.65rem', fontWeight:600, color:C.coral, background:'rgba(239,131,84,0.12)', padding:'0.15rem 0.5rem', borderRadius:5 }}>Hot</span>}
                <span style={{ fontFamily:D.body, fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:C.textMuted }}>{n.tag}</span>
              </div>
              <div style={{ fontFamily:D.body, fontSize:'1rem', fontWeight:700, color:C.text, marginBottom:'0.25rem' }}>{n.title}</div>
              <p style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textMuted, lineHeight:1.5 }}>{n.desc}</p>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.textMuted }}>{n.time}</div>
              <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted, marginTop:'0.15rem' }}>{n.read} min read</div>
              <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted, marginTop:'0.1rem' }}>{(n.views/1000).toFixed(1)}K views</div>
            </div>
          </div>
        ))}
      </div>

      {activeArticle && <NewsDetailModal article={activeArticle} onClose={() => setArticle(null)} />}
    </div>
  )
}
