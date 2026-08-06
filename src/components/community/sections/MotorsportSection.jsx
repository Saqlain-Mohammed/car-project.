import { useState } from 'react'
import { Maximize2, Send } from 'lucide-react'
import { C, D, R, SHADOW, SERIES } from '../../../lib/theme'
import { PageHeader, Card, Badge, Avatar, Divider, Button, Input, IconButton } from '../../ui/Primitives'
import Modal from '../../ui/Modal'
import { useLiveMotorsport, stat } from '../../../hooks/useCommunityStats'

const SERIES_DATA = {
  f1: {
    name:'Formula 1', status:'LIVE', tone:C.accent, viewers:'2,847', round:'Round 8',
    event:'Monaco Grand Prix', circuit:'Monte Carlo, Monaco',
    detail:'Lap 47 of 78 · Light rain · Safety car', progress:60,
    podium:[
      { pos:'P1', driver:'VERSTAPPEN', team:'Red Bull', gap:'Leader', tone:SERIES[0] },
      { pos:'P2', driver:'LECLERC',    team:'Ferrari',  gap:'+1.2s',  tone:SERIES[4] },
      { pos:'P3', driver:'NORRIS',     team:'McLaren',  gap:'+4.8s',  tone:SERIES[1] },
    ],
    standings:[
      ['Verstappen','Red Bull',144,SERIES[0]], ['Leclerc','Ferrari',138,SERIES[4]],
      ['Norris','McLaren',121,SERIES[1]], ['Piastri','McLaren',109,SERIES[1]], ['Hamilton','Ferrari',102,SERIES[4]],
    ],
    chat:[
      { user:'TurboMike',  text:'Verstappen on pole again, unreal pace', tone:SERIES[1] },
      { user:'DriftQueen', text:'Leclerc closing every lap now',         tone:SERIES[2] },
      { user:'RaiderKing', text:'Monaco in the rain is the best watch',  tone:SERIES[0] },
      { user:'ZeroShift',  text:'McLaren needs to pit this lap',         tone:SERIES[3] },
    ],
  },
  motogp: {
    name:'MotoGP', status:'QUALIFYING', tone:C.live, viewers:'1,203', round:'Round 7',
    event:"Gran Premio d'Italia", circuit:'Mugello, Italy',
    detail:'Q2 · 8:00 remaining · Dry, 32°C track', progress:45,
    podium:[
      { pos:'P1', driver:'MARQUEZ', team:'Ducati',  gap:'1:44.761', tone:SERIES[4] },
      { pos:'P2', driver:'BAGNAIA', team:'Ducati',  gap:'+0.123s',  tone:SERIES[4] },
      { pos:'P3', driver:'MARTIN',  team:'Aprilia', gap:'+0.341s',  tone:SERIES[2] },
    ],
    standings:[
      ['Bagnaia','Ducati',201,SERIES[4]], ['Martin','Aprilia',188,SERIES[2]],
      ['Marquez','Ducati',176,SERIES[4]], ['Binder','KTM',134,SERIES[1]], ['Quartararo','Yamaha',98,SERIES[0]],
    ],
    chat:[
      { user:'RaiderKing', text:'Marquez is flying today',            tone:SERIES[0] },
      { user:'ApexHunter', text:'Bagnaia keeping it close though',    tone:SERIES[2] },
      { user:'NightRider', text:'Mugello is the best track, no debate',tone:SERIES[3] },
    ],
  },
  f2: {
    name:'Formula 2', status:'NEXT 14:00', tone:SERIES[5], viewers:'456', round:'Round 8',
    event:'Formula 2 Feature Race', circuit:'Circuit de Monaco',
    detail:'Starts in 2h 14m · Dry and sunny', progress:0,
    podium:[
      { pos:'P1', driver:'BEARMAN', team:'Prema',    gap:'Pole',  tone:SERIES[4] },
      { pos:'P2', driver:'HAUGER',  team:'MP Motor', gap:'+0.2s', tone:SERIES[0] },
      { pos:'P3', driver:'DOOHAN',  team:'ART GP',   gap:'+0.4s', tone:SERIES[2] },
    ],
    standings:[
      ['Bearman','Prema',167,SERIES[4]], ['Hauger','MP Motor',154,SERIES[0]],
      ['Doohan','ART GP',142,SERIES[2]], ['Colapinto','Van Amersfoort',119,SERIES[3]], ['Maloney','Rodin',98,SERIES[1]],
    ],
    chat:[
      { user:'ZeroShift', text:'Bearman to F1 next season?',       tone:SERIES[0] },
      { user:'GhostLap',  text:'Monaco quali was mega',            tone:SERIES[5] },
    ],
  },
  wsbk: {
    name:'WorldSBK', status:'FINISHED', tone:C.success, viewers:'—', round:'Round 5',
    event:'Estoril Race 2', circuit:'Autodromo do Estoril, Portugal',
    detail:'Race complete · Result final', progress:100,
    podium:[
      { pos:'P1', driver:'RAZGATLIOGLU', team:'BMW',    gap:'Winner', tone:SERIES[0] },
      { pos:'P2', driver:'BAUTISTA',     team:'Ducati', gap:'+2.1s',  tone:SERIES[4] },
      { pos:'P3', driver:'LOCATELLI',    team:'Yamaha', gap:'+5.8s',  tone:SERIES[2] },
    ],
    standings:[
      ['Razgatlioglu','BMW',289,SERIES[0]], ['Bautista','Ducati',267,SERIES[4]],
      ['Locatelli','Yamaha',198,SERIES[2]], ['Iannone','Ducati',176,SERIES[4]], ['Lowes','Kawasaki',154,SERIES[1]],
    ],
    chat:[
      { user:'IronBlock',  text:'Toprak is back! What a ride',   tone:SERIES[4] },
      { user:'DriftQueen', text:'BMW on top form at Estoril',    tone:SERIES[2] },
    ],
  },
}

const ORDER = ['f1','motogp','f2','wsbk']

function statusTone(status) {
  if (status === 'LIVE')       return 'live'
  if (status === 'QUALIFYING') return 'live'
  if (status === 'FINISHED')   return 'success'
  return 'neutral'
}

/* ── Live chat, shared between the panel and its expanded modal ── */
function LiveChat({ data, messages, onSend, draft, setDraft, expanded, onExpand }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100%', minHeight:0 }}>
      <div style={{ padding:'0.95rem 1.15rem', display:'flex', alignItems:'center', gap:'0.6rem', flexShrink:0 }}>
        <span style={{ width:7, height:7, borderRadius:'50%', background: data.status === 'LIVE' ? C.live : C.textDim, animation: data.status === 'LIVE' ? 'livePulse 2s infinite' : 'none' }} />
        <span style={{ fontFamily:D.display, fontSize:'0.9rem', fontWeight:700, color:C.text }}>Live chat</span>
        <span style={{ marginLeft:'auto', fontFamily:D.body, fontSize:'0.73rem', color:C.textMuted, fontVariantNumeric:'tabular-nums' }}>{data.viewers} watching</span>
        {!expanded && <IconButton icon={Maximize2} label="Expand chat" onClick={onExpand} size={32} />}
      </div>
      <Divider />

      <div style={{ flex:1, overflowY:'auto', padding:'0.9rem 1.15rem', display:'flex', flexDirection:'column', gap:'0.75rem', minHeight:0 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:'flex', gap:'0.6rem', alignItems:'flex-start' }}>
            <Avatar name={m.user} size={26} tone={m.tone} />
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ background:C.surface2, borderRadius:R.md, padding:'0.5rem 0.75rem' }}>
                <span style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.765rem', color:C.text }}>{m.user} </span>
                <span style={{ fontFamily:D.body, fontSize:'0.815rem', color:C.textSoft }}>{m.text}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding:'0.85rem 1rem', display:'flex', gap:'0.5rem', flexShrink:0, boxShadow:`inset 0 1px 0 ${C.border}` }}>
        <Input value={draft} onChange={e => setDraft(e.target.value)} placeholder="React to the race…"
          onKeyDown={e => e.key === 'Enter' && onSend()} />
        <Button icon={Send} onClick={onSend} disabled={!draft.trim()} />
      </div>
    </div>
  )
}

export default function MotorsportSection() {
  const { data: live } = useLiveMotorsport()
  const [key, setKey]           = useState('f1')
  const [draft, setDraft]       = useState('')
  const [expanded, setExpanded] = useState(false)
  const [allChat, setAllChat]   = useState(
    Object.fromEntries(ORDER.map(k => [k, SERIES_DATA[k].chat]))
  )

  const base = SERIES_DATA[key]
  // When the database reports a live session, its viewer count wins over the
  // seeded figure so the number on screen reflects actual activity.
  const data = live?.live && base.status === 'LIVE'
    ? { ...base, viewers: stat(live.viewers), event: live.event?.title ?? base.event, circuit: live.event?.circuit ?? base.circuit }
    : base
  const messages = allChat[key]

  const send = () => {
    if (!draft.trim()) return
    setAllChat(c => ({ ...c, [key]: [{ user:'You', text: draft, tone: C.accent }, ...c[key]] }))
    setDraft('')
  }

  const chatProps = { data, messages, onSend: send, draft, setDraft }

  return (
    <div style={{ padding:'2rem 2.25rem 3rem', maxWidth:1400 }}>
      <PageHeader eyebrow="Live" title="Motorsport"
        description="Race weekends as they happen, with the community reacting in real time." />

      {/* Series selector */}
      <div style={{ display:'flex', gap:'0.7rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {ORDER.map(k => {
          const s = SERIES_DATA[k]
          const on = k === key
          return (
            <button key={k} onClick={() => setKey(k)} className="t-press"
              style={{
                minWidth:180, textAlign:'left', padding:'0.85rem 1rem',
                background: on ? C.surface : 'transparent',
                border:`1px solid ${on ? s.tone + '55' : C.border}`,
                borderRadius:R.lg, cursor:'pointer',
                boxShadow: on ? SHADOW.sm : 'none',
                transition:'background-color 250ms cubic-bezier(0.22,1,0.36,1), border-color 250ms cubic-bezier(0.22,1,0.36,1), scale 150ms cubic-bezier(0.22,1,0.36,1)',
              }}>
              <div style={{ fontFamily:D.body, fontSize:'0.9rem', fontWeight:600, color: on ? C.text : C.textSoft, marginBottom:'0.4rem' }}>{s.name}</div>
              <Badge tone={statusTone(s.status)} dot={s.status === 'LIVE'}>{s.status}</Badge>
            </button>
          )
        })}
      </div>

      <div className="tg-split" style={{ display:'grid', gridTemplateColumns:'minmax(0,1.9fr) minmax(320px,1fr)', gap:'1.15rem', alignItems:'start' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'1.15rem', minWidth:0 }}>

          {/* Event */}
          <Card padding={0} radius={R.xl} style={{ overflow:'hidden', boxShadow:SHADOW.md }}>
            <div style={{ padding:'1.5rem 1.6rem', background:`linear-gradient(150deg, ${data.tone}14, transparent 70%)` }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'1rem', flexWrap:'wrap' }}>
                <Badge tone={statusTone(data.status)} dot={data.status === 'LIVE'}>
                  {data.status === 'LIVE' ? 'Live' : data.status}
                </Badge>
                <span style={{ fontFamily:D.body, fontSize:'0.8rem', color:C.textMuted }}>{data.circuit}</span>
                <span style={{ marginLeft:'auto', fontFamily:D.body, fontSize:'0.75rem', color:C.textDim }}>{data.round}</span>
              </div>

              <h2 style={{ fontFamily:D.display, fontSize:'1.6rem', fontWeight:700, color:C.text, letterSpacing:'-0.02em', lineHeight:1.15 }}>{data.event}</h2>
              <p style={{ fontFamily:D.body, fontSize:'0.855rem', color:C.textMuted, marginTop:'0.35rem' }}>{data.detail}</p>
            </div>

            <div style={{ padding:'0 1.6rem 1.5rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))', gap:'0.7rem', marginBottom:'1.35rem' }}>
                {data.podium.map(p => (
                  <div key={p.pos} style={{ background:C.surface2, borderRadius:R.md, padding:'0.9rem 1rem', boxShadow:`inset 0 2px 0 ${p.tone}` }}>
                    <div style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.1em', color:C.textMuted, marginBottom:'0.3rem' }}>{p.pos}</div>
                    <div style={{ fontFamily:D.display, fontSize:'1.05rem', fontWeight:700, color:C.text, lineHeight:1.15, letterSpacing:'-0.01em' }}>{p.driver}</div>
                    <div style={{ fontFamily:D.body, fontSize:'0.74rem', color:p.tone, marginTop:'0.25rem' }}>{p.team}</div>
                    <div style={{ fontFamily:D.body, fontSize:'0.83rem', fontWeight:600, color:C.textSoft, marginTop:'0.45rem', fontVariantNumeric:'tabular-nums' }}>{p.gap}</div>
                  </div>
                ))}
              </div>

              {data.progress > 0 && (
                <>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.45rem' }}>
                    <span style={{ fontFamily:D.body, fontSize:'0.76rem', color:C.textMuted }}>Progress</span>
                    <span style={{ fontFamily:D.body, fontSize:'0.76rem', fontWeight:600, color:data.tone, fontVariantNumeric:'tabular-nums' }}>{data.progress}%</span>
                  </div>
                  <div style={{ height:5, background:C.surface2, borderRadius:R.full, overflow:'hidden' }}>
                    <div style={{
                      height:'100%', width:`${data.progress}%`, borderRadius:R.full,
                      background:`linear-gradient(to right, ${data.tone}, ${data.tone}99)`,
                      transition:'width 500ms cubic-bezier(0.22,1,0.36,1)',
                    }} />
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Standings */}
          <Card padding={0} radius={R.xl} style={{ overflow:'hidden', boxShadow:SHADOW.sm }}>
            <div style={{ padding:'1.1rem 1.5rem', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:700, color:C.text }}>Championship standings</span>
              <span style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.textMuted }}>After {data.round}</span>
            </div>
            <Divider />
            {data.standings.map(([driver, team, pts, tone], i) => (
              <div key={driver} className="t-row"
                style={{
                  display:'flex', alignItems:'center', gap:'0.9rem', padding:'0.8rem 1.5rem',
                  boxShadow: i < data.standings.length - 1 ? `inset 0 -1px 0 ${C.border}` : 'none',
                }}
                onMouseEnter={e => e.currentTarget.style.background = C.surface2}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                <span style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:700, color: i === 0 ? C.live : C.textDim, width:20, textAlign:'center', fontVariantNumeric:'tabular-nums' }}>{i + 1}</span>
                <span style={{ width:3, height:26, borderRadius:2, background:tone, flexShrink:0 }} />
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontFamily:D.body, fontSize:'0.885rem', fontWeight:600, color:C.text }}>{driver}</div>
                  <div style={{ fontFamily:D.body, fontSize:'0.74rem', color:C.textMuted }}>{team}</div>
                </div>
                <span style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:700, color: i === 0 ? C.live : C.text, fontVariantNumeric:'tabular-nums' }}>
                  {pts}<span style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:400, color:C.textMuted }}> pts</span>
                </span>
              </div>
            ))}
          </Card>
        </div>

        {/* Chat panel */}
        <Card padding={0} radius={R.xl} style={{ height:620, overflow:'hidden', boxShadow:SHADOW.sm, position:'sticky', top:80 }}>
          <LiveChat {...chatProps} expanded={false} onExpand={() => setExpanded(true)} />
        </Card>
      </div>

      {/* Expanded chat */}
      <Modal open={expanded} onClose={() => setExpanded(false)} width={720}>
        <div style={{ height:'72vh', display:'flex', flexDirection:'column' }}>
          <LiveChat {...chatProps} expanded />
        </div>
      </Modal>
    </div>
  )
}
