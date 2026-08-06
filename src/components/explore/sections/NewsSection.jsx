import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Clock, TrendingUp, Eye, Flame, Bookmark, Share2, Newspaper } from 'lucide-react'
import { C, D, R, SHADOW } from '../../../lib/theme'
import { PageHeader, Card, Badge, Button, Divider, Dropdown, MenuItem, EmptyState, useSticky } from '../../ui/Primitives'
import Modal from '../../ui/Modal'
import { RowSkeleton } from '../../ui/Skeleton'
import { useNews } from '../../../hooks/useKnowledge'

const ARTICLES = [
  { id:1, tag:'Formula 1', hot:true, time:'2h ago', read:4, views:18400,
    title:'2026 power unit regulations locked in — all ten teams sign off',
    excerpt:'The new rules mandate a 50/50 split between combustion and electrical power, with the MGU-H removed entirely.',
    body:'The 2026 Formula 1 power unit regulations have been officially locked in after months of negotiation between the FIA, Formula 1 Management, and all ten constructors. The new rules mandate a 50/50 split between internal combustion and electrical power, capping the ICE at around 550bhp with the MGU-H removed entirely.\n\nAll current suppliers — Mercedes, Ferrari, Renault and Honda — plus new entrant Audi have confirmed they will produce compliant units. The regulations also introduce a standardised energy store and control electronics to reduce development costs for smaller teams.\n\nThe change represents the most significant regulatory reset since the hybrid era began in 2014, and is intended to make the sport more attractive to manufacturers while keeping racing close.' },
  { id:2, tag:'MotoGP', hot:true, time:'5h ago', read:3, views:24100,
    title:'Marquez takes pole at Mugello with a new circuit record',
    excerpt:'A 1:44.761 on the Ducati GP25 put him nearly two tenths clear of his own teammate.',
    body:'Marc Marquez delivered a stunning qualifying performance at the Autodromo del Mugello, setting an all-time lap record of 1:44.761 aboard his Ducati GP25 to claim pole for the Gran Premio d\'Italia.\n\nThe Spaniard was nearly two tenths clear of factory Ducati teammate Francesco Bagnaia in second, with Jorge Martin on the Aprilia RS-GP qualifying third.\n\nWith light rain forecast for Sunday, grid position could prove decisive — Mugello\'s long front straight makes slipstream position critical into turn one.' },
  { id:3, tag:'India', hot:false, time:'8h ago', read:2, views:9800,
    title:'Tata Curvv EV crosses 10,000 units in six months',
    excerpt:'The fastest-selling premium EV in the country hits a major milestone.',
    body:'Tata Motors has announced that cumulative sales of the Curvv EV have crossed 10,000 units in just six months since launch, making it the fastest-selling premium electric vehicle in India.\n\nThe Curvv EV is offered with 45kWh and 55kWh battery packs, the larger claiming a real-world range beyond 500km. Tata attributes the result to an expanded fast-charging network, competitive pricing, and strong after-sales support.\n\nThree new colour options and a performance all-wheel-drive variant are planned for later this year.' },
  { id:4, tag:'Guide', hot:false, time:'1d ago', read:6, views:31200,
    title:'Best budget suspension upgrades under ₹30,000',
    excerpt:'Eight kits tested across track days, canyon roads, and daily city use.',
    body:'After three months of real-world testing we ranked the eight most popular budget coilover and spring kits available in India under ₹30,000.\n\nTein Street Basis Z (₹28,500) is the best all-rounder — sixteen-way damping adjustment with genuinely liveable ride quality on broken roads.\n\nKW V1 (₹27,000) offers German engineering at an accessible price. Damping is fixed but very well judged from the factory, which suits anyone who does not want to fiddle.\n\nBC Racing BR (₹24,500) is the most adjustable in the range with thirty clicks, though it is noticeably harsher over potholes. For pure city use on a budget, Megan Racing Street at ₹18,000 remains the value pick.' },
  { id:5, tag:'JDM', hot:true, time:'2d ago', read:5, views:52100,
    title:'Next Supra confirmed with a manual gearbox',
    excerpt:'The first manual Supra since the A80 was discontinued in 2002.',
    body:'Toyota has officially confirmed the next-generation Supra, internally codenamed A100, will be offered with a six-speed manual gearbox — the first manual Supra since the A80 generation ended production in 2002.\n\nThe car will use Toyota\'s own 3.0-litre turbocharged inline-six producing an estimated 420hp, paired with a Getrag-sourced transmission. An automatic variant will also be available.\n\nThe A100 abandons the BMW-derived platform of the current A90 in favour of Toyota\'s own rear-wheel-drive architecture. A reveal is scheduled for the Tokyo Auto Salon.' },
]

const SORTS = [
  { value:'latest',  label:'Latest',      Icon: Clock      },
  { value:'trending',label:'Trending',    Icon: TrendingUp },
  { value:'viewed',  label:'Most viewed', Icon: Eye        },
  { value:'hot',     label:'Hot',         Icon: Flame      },
]

function sortArticles(list, sort) {
  switch (sort) {
    case 'trending':
    case 'viewed': return [...list].sort((a, b) => b.views - a.views)
    case 'hot':    return [...list].filter(a => a.hot).concat(list.filter(a => !a.hot))
    default:       return list
  }
}

function ArticleModal({ item: itemProp, onClose }) {
  const item = useSticky(itemProp)
  const [saved, setSaved] = useState(false)
  if (!item) return null
  return (
    <Modal open={!!itemProp} onClose={onClose} width={660} labelledBy="article-title">
      <div style={{ overflowY:'auto' }}>
        <div style={{ padding:'2.25rem 1.75rem 1.4rem', background:`linear-gradient(160deg, ${C.accentBg}, transparent 70%)` }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1rem', flexWrap:'wrap' }}>
            {item.hot && <Badge tone="live" dot>Hot</Badge>}
            <Badge tone="accent">{item.tag}</Badge>
            <span style={{ marginLeft:'auto', fontFamily:D.body, fontSize:'0.74rem', color:C.textMuted, fontVariantNumeric:'tabular-nums' }}>
              {item.views.toLocaleString()} views
            </span>
          </div>
          <h2 id="article-title" style={{ fontFamily:D.display, fontSize:'1.6rem', fontWeight:700, color:C.text, lineHeight:1.25, letterSpacing:'-0.02em', marginBottom:'0.85rem' }}>
            {item.title}
          </h2>
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexWrap:'wrap' }}>
            <span style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted }}>{item.time} · {item.read} min read</span>
            <div style={{ marginLeft:'auto', display:'flex', gap:'0.45rem' }}>
              <Button variant={saved ? 'primary' : 'neutral'} size="sm" icon={Bookmark} onClick={() => setSaved(v => !v)}>
                {saved ? 'Saved' : 'Save'}
              </Button>
              <Button variant="neutral" size="sm" icon={Share2}>Share</Button>
            </div>
          </div>
        </div>
        <Divider />
        <div style={{ padding:'1.6rem 1.75rem 2rem' }}>
          {item.body.split('\n\n').map((p, i) => (
            <p key={i} style={{ fontFamily:D.body, fontSize:'0.94rem', color:C.textSoft, lineHeight:1.8, marginBottom:'1.15rem' }}>{p}</p>
          ))}
        </div>
      </div>
    </Modal>
  )
}

export default function NewsSection() {
  const [sort, setSort]     = useState('latest')
  const [open, setOpen]     = useState(false)
  const [active, setActive] = useState(null)
  const dropRef = useRef(null)

  const { data: dbNews, isLoading } = useNews()

  useEffect(() => {
    const h = e => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const source = dbNews?.length
    ? dbNews.map(n => ({
        id:n.id, tag:n.category ?? 'News', hot:false,
        time:new Date(n.published_at).toLocaleDateString(), read:4, views:n.view_count ?? 0,
        title:n.title, excerpt:n.excerpt ?? '', body:n.excerpt ?? '',
      }))
    : ARTICLES

  const sorted  = sortArticles(source, sort)
  const [lead, ...rest] = sorted
  const activeSort = SORTS.find(s => s.value === sort)

  return (
    <div style={{ padding:'2rem 2.25rem 3rem', maxWidth:960 }}>
      <PageHeader eyebrow="Latest" title="News"
        description="Industry moves, race weekends, and launches — the stuff that actually matters."
        actions={
          <div ref={dropRef} style={{ position:'relative' }}>
            <Button variant="neutral" icon={activeSort?.Icon} iconRight={ChevronDown} onClick={() => setOpen(o => !o)}>
              {activeSort?.label}
            </Button>
            <Dropdown open={open} width={190} origin="top-right">
              <div style={{ padding:'0.35rem' }}>
                {SORTS.map(({ value, label, Icon }) => (
                  <MenuItem key={value} icon={Icon} active={sort === value}
                    onClick={() => { setSort(value); setOpen(false) }}>
                    {label}
                  </MenuItem>
                ))}
              </div>
            </Dropdown>
          </div>
        } />

      {isLoading ? (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {Array.from({ length: 5 }).map((_, i) => <RowSkeleton key={i} />)}
        </div>
      ) : !lead ? (
        <EmptyState icon={Newspaper} title="No stories yet" message="Check back shortly — the feed updates through the day." />
      ) : (
        <>
          {/* Lead story */}
          <Card hover onClick={() => setActive(lead)} radius={R.xl} padding={0}
            style={{ marginBottom:'1.1rem', overflow:'hidden', boxShadow:SHADOW.md }}>
            <div style={{ padding:'1.6rem 1.75rem', background:`linear-gradient(140deg, ${C.accentBg}, transparent 65%)` }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.9rem', flexWrap:'wrap' }}>
                {lead.hot && <Badge tone="live" dot>Hot</Badge>}
                <Badge tone="accent">{lead.tag}</Badge>
                <span style={{ marginLeft:'auto', fontFamily:D.body, fontSize:'0.74rem', color:C.textMuted, fontVariantNumeric:'tabular-nums' }}>
                  {lead.views.toLocaleString()} views
                </span>
              </div>
              <h2 style={{ fontFamily:D.display, fontSize:'1.5rem', fontWeight:700, color:C.text, lineHeight:1.25, letterSpacing:'-0.02em', marginBottom:'0.6rem' }}>
                {lead.title}
              </h2>
              <p style={{ fontFamily:D.body, fontSize:'0.9rem', color:C.textMuted, lineHeight:1.65, marginBottom:'1rem', maxWidth:620 }}>
                {lead.excerpt}
              </p>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:'0.5rem' }}>
                <span style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted }}>{lead.time} · {lead.read} min read</span>
                <span style={{ fontFamily:D.body, fontSize:'0.8rem', fontWeight:600, color:C.accent }}>Read story →</span>
              </div>
            </div>
          </Card>

          {/* Remaining */}
          <div style={{ display:'flex', flexDirection:'column', gap:'0.7rem' }}>
            {rest.map(a => (
              <button key={a.id} onClick={() => setActive(a)} className="t-row"
                style={{
                  display:'flex', gap:'1.15rem', alignItems:'flex-start', width:'100%', textAlign:'left',
                  padding:'1.05rem 1.25rem', background:C.surface, border:'none',
                  borderRadius:R.lg, cursor:'pointer', boxShadow:SHADOW.sm,
                }}
                onMouseEnter={e => e.currentTarget.style.background = C.surface2}
                onMouseLeave={e => e.currentTarget.style.background = C.surface}>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.45rem', marginBottom:'0.4rem' }}>
                    {a.hot && <Badge tone="live">Hot</Badge>}
                    <span style={{ fontFamily:D.body, fontSize:'0.7rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:C.textMuted }}>{a.tag}</span>
                  </div>
                  <div style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:600, color:C.text, lineHeight:1.35, marginBottom:'0.3rem', letterSpacing:'-0.01em' }}>
                    {a.title}
                  </div>
                  <p style={{ fontFamily:D.body, fontSize:'0.83rem', color:C.textMuted, lineHeight:1.55 }}>{a.excerpt}</p>
                </div>
                <div style={{ textAlign:'right', flexShrink:0, fontFamily:D.body, fontSize:'0.74rem', color:C.textDim, lineHeight:1.7, fontVariantNumeric:'tabular-nums' }}>
                  <div>{a.time}</div>
                  <div>{a.read} min</div>
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      <ArticleModal item={active} onClose={() => setActive(null)} />
    </div>
  )
}
