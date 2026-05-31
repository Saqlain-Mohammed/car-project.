import { useState } from 'react'
import { X, Maximize2 } from 'lucide-react'

const C = { bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50', coral:'#EF8354', coralDim:'#d96a3a', text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0', border:'rgba(191,192,192,0.12)', green:'#5eaa7e', amber:'#f5a623' }
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const SERIES_DATA = {
  f1: {
    id:'f1', name:'Formula 1', status:'LIVE', round:'Round 8 · Monaco GP', color:'#EF8354', viewers:'2,847',
    event:'MONACO GRAND PRIX', circuit:'Monte Carlo · Monaco', lap:'47/78', condition:'Light Rain · Safety Car',
    top3:[
      { pos:'P1', driver:'VERSTAPPEN', gap:'Leader', team:'Red Bull', color:'#3b82f6' },
      { pos:'P2', driver:'LECLERC',    gap:'+1.2s',  team:'Ferrari', color:'#EF8354' },
      { pos:'P3', driver:'NORRIS',     gap:'+4.8s',  team:'McLaren', color:'#f5a623' },
    ],
    standings:[
      { pos:1, driver:'Verstappen', team:'Red Bull', pts:144, color:'#3b82f6' },
      { pos:2, driver:'Leclerc',    team:'Ferrari',  pts:138, color:'#EF8354' },
      { pos:3, driver:'Norris',     team:'McLaren',  pts:121, color:'#f5a623' },
      { pos:4, driver:'Piastri',    team:'McLaren',  pts:109, color:'#f5a623' },
      { pos:5, driver:'Hamilton',   team:'Ferrari',  pts:102, color:'#EF8354' },
    ],
    progress: 60,
    chatInit:[
      { user:'TurboMike', msg:'VERSTAPPEN ON POLE AGAIN 🔥', time:'now', color:'#f5a623' },
      { user:'DriftQueen', msg:'Leclerc gap closing every lap', time:'1m', color:'#5eaa7e' },
      { user:'RaiderKing', msg:'Monaco in the rain is absolutely insane', time:'2m', color:'#EF8354' },
      { user:'ZeroShift', msg:'McLaren needs to pit NOW', time:'2m', color:'#3b82f6' },
      { user:'NightRider', msg:'Best F1 season in years fr', time:'3m', color:'#a855f7' },
    ],
  },
  motogp: {
    id:'motogp', name:'MotoGP', status:'QUALIFYING', round:'Round 7 · Mugello', color:'#f5a623', viewers:'1,203',
    event:'GRAN PREMIO D\'ITALIA', circuit:'Autodromo del Mugello · Italy', lap:'Q2 — 8:00 remaining', condition:'Dry · 32°C track',
    top3:[
      { pos:'P1', driver:'MARQUEZ',   gap:'1:45.234', team:'Ducati',  color:'#EF8354' },
      { pos:'P2', driver:'BAGNAIA',   gap:'+0.123s',  team:'Ducati',  color:'#EF8354' },
      { pos:'P3', driver:'MARTIN',    gap:'+0.341s',  team:'Aprilia', color:'#5eaa7e' },
    ],
    standings:[
      { pos:1, driver:'Bagnaia', team:'Ducati',  pts:201, color:'#EF8354' },
      { pos:2, driver:'Martin',  team:'Aprilia', pts:188, color:'#5eaa7e' },
      { pos:3, driver:'Marquez', team:'Ducati',  pts:176, color:'#EF8354' },
      { pos:4, driver:'Binder',  team:'KTM',     pts:134, color:'#f5a623' },
      { pos:5, driver:'Quartararo', team:'Yamaha', pts:98, color:'#3b82f6' },
    ],
    progress: 45,
    chatInit:[
      { user:'RaiderKing', msg:'Marquez is on FIRE today 🏍️', time:'now', color:'#EF8354' },
      { user:'ApexHunter', msg:'Bagnaia keeping it close tho', time:'1m', color:'#5eaa7e' },
      { user:'NightRider', msg:'Mugello is the best track on the calendar', time:'2m', color:'#a855f7' },
      { user:'TurboMike', msg:'Martin needs to push NOW', time:'3m', color:'#f5a623' },
    ],
  },
  f2: {
    id:'f2', name:'Formula 2', status:'NEXT: 14:00', round:'Round 8 · Monaco', color:'#3b82f6', viewers:'456',
    event:'FORMULA 2 FEATURE RACE', circuit:'Circuit de Monaco · Monte Carlo', lap:'Starts in 2h 14m', condition:'Dry · Sunny',
    top3:[
      { pos:'P1', driver:'BEARMAN',  gap:'Pole', team:'Prema',     color:'#EF8354' },
      { pos:'P2', driver:'HAUGER',   gap:'+0.2s', team:'MP Motor', color:'#3b82f6' },
      { pos:'P3', driver:'DOOHAN',   gap:'+0.4s', team:'ART GP',   color:'#5eaa7e' },
    ],
    standings:[
      { pos:1, driver:'Bearman', team:'Prema',    pts:167, color:'#EF8354' },
      { pos:2, driver:'Hauger',  team:'MP Motor', pts:154, color:'#3b82f6' },
      { pos:3, driver:'Doohan',  team:'ART GP',   pts:142, color:'#5eaa7e' },
      { pos:4, driver:'Colapinto', team:'Van Amersfoort', pts:119, color:'#a855f7' },
      { pos:5, driver:'Maloney', team:'Rodin',    pts:98,  color:'#f5a623' },
    ],
    progress: 0,
    chatInit:[
      { user:'ZeroShift', msg:'Bearman to F1 next season? 🤔', time:'2m', color:'#3b82f6' },
      { user:'GhostLap', msg:'Monaco qualifying was mega', time:'5m', color:'#8b90a0' },
      { user:'ApexHunter', msg:'F2 always delivers on street circuits', time:'8m', color:'#5eaa7e' },
    ],
  },
  wsbk: {
    id:'wsbk', name:'WorldSBK', status:'FINISHED', round:'Round 5 · Estoril', color:'#5eaa7e', viewers:'—',
    event:'ESTORIL WORLD SBK RACE 2', circuit:'Autodromo do Estoril · Portugal', lap:'FINISHED · Race over', condition:'Result Final',
    top3:[
      { pos:'P1', driver:'RAZGATLIOGLU', gap:'Winner', team:'BMW',    color:'#3b82f6' },
      { pos:'P2', driver:'BAUTISTA',     gap:'+2.1s',  team:'Ducati', color:'#EF8354' },
      { pos:'P3', driver:'RAZ.TOPRAK',   gap:'+5.8s',  team:'BMW',    color:'#3b82f6' },
    ],
    standings:[
      { pos:1, driver:'Razgatlioglu', team:'BMW',    pts:289, color:'#3b82f6' },
      { pos:2, driver:'Bautista',     team:'Ducati', pts:267, color:'#EF8354' },
      { pos:3, driver:'Locatelli',    team:'Yamaha', pts:198, color:'#5eaa7e' },
      { pos:4, driver:'Iannone',      team:'Ducati', pts:176, color:'#EF8354' },
      { pos:5, driver:'Lowes',        team:'Kawasaki', pts:154, color:'#5eaa7e' },
    ],
    progress: 100,
    chatInit:[
      { user:'IronBlock', msg:'Toprak is back! What a comeback 🔥', time:'5m', color:'#EF8354' },
      { user:'DriftQueen', msg:'BMW on top form at Estoril', time:'8m', color:'#5eaa7e' },
      { user:'TurboMike', msg:'Bautista making it hard for him though', time:'10m', color:'#f5a623' },
    ],
  },
}

const SERIES_LIST = [
  { id:'f1',    name:'Formula 1', emoji:'🏎️' },
  { id:'motogp',name:'MotoGP',   emoji:'🏍️' },
  { id:'f2',    name:'Formula 2',emoji:'🏁' },
  { id:'wsbk',  name:'WorldSBK', emoji:'🔥' },
]

export default function MotorsportSection() {
  const [activeSeries, setActiveSeries] = useState('f1')
  const [chatMsg, setChatMsg] = useState('')
  const [allMessages, setAllMessages] = useState({
    f1: SERIES_DATA.f1.chatInit,
    motogp: SERIES_DATA.motogp.chatInit,
    f2: SERIES_DATA.f2.chatInit,
    wsbk: SERIES_DATA.wsbk.chatInit,
  })
  const [chatExpanded, setChatExpanded] = useState(false)

  const s = SERIES_DATA[activeSeries]
  const messages = allMessages[activeSeries]

  const sendMsg = () => {
    if (!chatMsg.trim()) return
    setAllMessages(m => ({ ...m, [activeSeries]: [{ user:'You', msg:chatMsg, time:'now', color:C.coral }, ...m[activeSeries]] }))
    setChatMsg('')
  }

  const ChatBox = ({ expanded }) => (
    <div style={{ background:C.surface, borderRadius: expanded ? 0 : 20, border: expanded ? 'none' : `1px solid rgba(239,131,84,0.2)`, display:'flex', flexDirection:'column', height: expanded ? '100%' : undefined, maxHeight: expanded ? '100%' : 600 }}>
      <div style={{ padding:'1rem 1.25rem', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:'0.6rem' }}>
        <div style={{ width:8, height:8, borderRadius:'50%', background: s.status==='LIVE' ? '#ef4444' : s.status==='QUALIFYING' ? C.amber : C.textMuted, animation: s.status==='LIVE' ? 'pulse 1.5s infinite' : 'none' }} />
        <span style={{ fontFamily:D.body, fontSize:'0.95rem', fontWeight:700, color:C.text }}>Live Chat</span>
        <span style={{ marginLeft:'auto', fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted }}>{s.viewers} watching</span>
        {!expanded && (
          <button onClick={() => setChatExpanded(true)}
            style={{ background:'none', border:'none', cursor:'pointer', color:C.textMuted, display:'flex', padding:'0.25rem', borderRadius:6, transition:'color 0.2s' }}
            title="Expand chat"
            onMouseEnter={e => e.currentTarget.style.color=C.text}
            onMouseLeave={e => e.currentTarget.style.color=C.textMuted}>
            <Maximize2 size={15} />
          </button>
        )}
      </div>
      <div style={{ flex:1, overflowY:'auto', padding:'1rem', display:'flex', flexDirection:'column', gap:'0.85rem' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:'flex', gap:'0.6rem', alignItems:'flex-start' }}>
            <div style={{ width:28, height:28, borderRadius:'50%', background:m.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.65rem', color:'#fff', flexShrink:0 }}>{m.user[0]}</div>
            <div style={{ background:C.surface2, borderRadius:12, borderBottomLeftRadius:4, padding:'0.6rem 0.85rem', flex:1 }}>
              <span style={{ fontFamily:D.body, fontWeight:700, fontSize:'0.78rem', color:m.color }}>{m.user} </span>
              <span style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.text }}>{m.msg}</span>
              <div style={{ fontFamily:D.body, fontSize:'0.62rem', color:C.textMuted, marginTop:'0.2rem' }}>{m.time}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding:'0.85rem', borderTop:`1px solid ${C.border}`, display:'flex', gap:'0.5rem' }}>
        <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key==='Enter' && sendMsg()}
          placeholder="React to the race..."
          style={{ flex:1, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.6rem 0.9rem', color:C.text, fontFamily:D.body, fontSize:'0.85rem', outline:'none' }}
          onFocus={e => e.target.style.borderColor='rgba(239,131,84,0.4)'}
          onBlur={e => e.target.style.borderColor=C.border} />
        <button onClick={sendMsg}
          style={{ background:C.coral, border:'none', borderRadius:10, padding:'0.6rem 1rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.82rem', color:'#fff', transition:'background 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
          onMouseLeave={e => e.currentTarget.style.background=C.coral}>Send</button>
      </div>
    </div>
  )

  return (
    <div style={{ padding:'2rem' }}>
      {/* Header */}
      <div style={{ marginBottom:'1.5rem' }}>
        <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'#ef4444', marginBottom:'0.4rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:'#ef4444', display:'inline-block' }} /> Live Now
        </div>
        <h2 style={{ fontFamily:D.display, fontSize:'1.9rem', fontWeight:700, color:C.text, lineHeight:1 }}>Motorsport Hub</h2>
      </div>

      {/* Series selector — tab style, no heavy borders */}
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {SERIES_LIST.map(sr => {
          const d = SERIES_DATA[sr.id]
          const active = activeSeries === sr.id
          return (
            <button key={sr.id} onClick={() => setActiveSeries(sr.id)}
              style={{ display:'flex', alignItems:'center', gap:'0.6rem', background: active ? C.surface2 : C.surface, borderRadius:12, padding:'0.75rem 1.2rem', cursor:'pointer', border: active ? `1px solid ${d.color}44` : `1px solid ${C.border}`, transition:'all 0.2s', borderBottom: active ? `3px solid ${d.color}` : `3px solid transparent` }}>
              <span style={{ fontSize:'1.2rem' }}>{sr.emoji}</span>
              <div style={{ textAlign:'left' }}>
                <div style={{ fontFamily:D.body, fontSize:'0.88rem', fontWeight: active ? 700 : 500, color: active ? C.text : C.textMuted }}>{sr.name}</div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.35rem', marginTop:'0.1rem' }}>
                  <span style={{ fontFamily:D.body, fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.12rem 0.45rem', borderRadius:5,
                    background: d.status==='LIVE' ? 'rgba(239,68,68,0.15)' : d.status==='QUALIFYING' ? 'rgba(245,166,35,0.15)' : d.status==='FINISHED' ? 'rgba(94,170,126,0.12)' : 'rgba(191,192,192,0.08)',
                    color: d.status==='LIVE' ? '#ef4444' : d.status==='QUALIFYING' ? C.amber : d.status==='FINISHED' ? C.green : C.textMuted }}>
                    {d.status==='LIVE' ? '● LIVE' : d.status}
                  </span>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'1.5rem' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>

          {/* Event card */}
          <div style={{ background:C.surface, borderRadius:20, padding:'1.75rem', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140, borderRadius:'50%', background:s.color, opacity:0.06, pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.25rem', flexWrap:'wrap' }}>
                <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.3rem 0.75rem', borderRadius:8,
                  background: s.status==='LIVE' ? 'rgba(239,68,68,0.12)' : s.status==='QUALIFYING' ? 'rgba(245,166,35,0.12)' : 'rgba(191,192,192,0.08)',
                  color: s.status==='LIVE' ? '#ef4444' : s.status==='QUALIFYING' ? C.amber : C.textMuted,
                  display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  {s.status==='LIVE' && <span style={{ width:6, height:6, borderRadius:'50%', background:'#ef4444', display:'inline-block' }} />}
                  {s.status==='LIVE' ? `LIVE · LAP ${s.lap}` : s.lap}
                </div>
                <span style={{ fontFamily:D.body, fontSize:'0.8rem', color:C.textMuted }}>{s.circuit}</span>
              </div>
              <h3 style={{ fontFamily:D.display, fontSize:'1.75rem', fontWeight:700, color:C.text, lineHeight:1, marginBottom:'0.35rem' }}>{s.event}</h3>
              <p style={{ fontFamily:D.body, fontSize:'0.88rem', color:C.textMuted, marginBottom:'1.5rem' }}>{s.condition}</p>

              {/* Top 3 */}
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.85rem', marginBottom:'1.5rem' }}>
                {s.top3.map(({ pos, driver, gap, team, color }) => (
                  <div key={pos} style={{ background:C.surface2, borderRadius:12, padding:'1rem', borderTop:`3px solid ${color}` }}>
                    <div style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.textMuted, marginBottom:'0.25rem' }}>{pos}</div>
                    <div style={{ fontFamily:D.display, fontSize:'1.15rem', fontWeight:700, color:C.text, lineHeight:1, marginBottom:'0.15rem' }}>{driver}</div>
                    <div style={{ fontFamily:D.body, fontSize:'0.72rem', color, marginBottom:'0.35rem' }}>{team}</div>
                    <div style={{ fontFamily:D.body, fontSize:'0.85rem', fontWeight:600, color:C.textMuted }}>{gap}</div>
                  </div>
                ))}
              </div>

              {/* Progress bar */}
              {s.progress > 0 && (
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
                    <span style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted }}>Race Progress</span>
                    <span style={{ fontFamily:D.body, fontSize:'0.78rem', fontWeight:600, color:s.color }}>{s.progress}%</span>
                  </div>
                  <div style={{ height:5, background:'rgba(191,192,192,0.1)', borderRadius:3 }}>
                    <div style={{ height:'100%', width:`${s.progress}%`, background:`linear-gradient(to right, ${s.color}, ${s.color}99)`, borderRadius:3, transition:'width 0.5s' }} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Standings */}
          <div style={{ background:C.surface, borderRadius:20, overflow:'hidden' }}>
            <div style={{ padding:'1.1rem 1.5rem', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontFamily:D.display, fontSize:'1.1rem', fontWeight:700, color:C.text }}>Championship Standings</div>
              <div style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.textMuted }}>{s.round}</div>
            </div>
            {s.standings.map(({ pos, driver, team, pts, color }) => (
              <div key={driver} style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'0.85rem 1.5rem', borderBottom:`1px solid ${C.border}`, cursor:'pointer', transition:'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background=C.surface2}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <div style={{ fontFamily:D.display, fontSize:'1.1rem', fontWeight:700, color: pos===1 ? C.amber : C.textMuted, width:24, textAlign:'center', flexShrink:0 }}>{pos}</div>
                <div style={{ width:3, height:28, borderRadius:2, background:color, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:D.body, fontSize:'0.9rem', fontWeight:700, color:C.text }}>{driver}</div>
                  <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted }}>{team}</div>
                </div>
                <div style={{ fontFamily:D.display, fontSize:'1.1rem', fontWeight:700, color: pos===1 ? C.amber : C.text }}>{pts} <span style={{ fontSize:'0.72rem', fontFamily:D.body, fontWeight:400, color:C.textMuted }}>pts</span></div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat panel */}
        <ChatBox expanded={false} />
      </div>

      {/* Expanded chat modal */}
      {chatExpanded && (
        <div style={{ position:'fixed', inset:0, zIndex:600, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem' }}>
          <div style={{ position:'absolute', inset:0, background:'rgba(8,10,18,0.88)', backdropFilter:'blur(8px)' }} onClick={() => setChatExpanded(false)} />
          <div style={{ position:'relative', zIndex:1, width:'100%', maxWidth:700, height:'80vh', background:C.surface, borderRadius:22, overflow:'hidden', border:`1px solid ${C.border}`, boxShadow:'0 32px 80px rgba(0,0,0,0.6)', display:'flex', flexDirection:'column' }}>
            <button onClick={() => setChatExpanded(false)}
              style={{ position:'absolute', top:12, right:12, zIndex:10, width:32, height:32, borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, cursor:'pointer', color:C.textMuted, display:'flex', alignItems:'center', justifyContent:'center' }}>
              <X size={15} />
            </button>
            <ChatBox expanded={true} />
          </div>
        </div>
      )}
    </div>
  )
}
