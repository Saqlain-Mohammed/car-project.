import { useState } from 'react'

const C = { bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50', coral:'#EF8354', coralDim:'#d96a3a', text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0', border:'rgba(191,192,192,0.12)', green:'#5eaa7e', amber:'#f5a623' }
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const SERIES = [
  { id:'f1', name:'Formula 1', emoji:'🏎️', status:'LIVE', round:'Round 8 · Monaco GP', color:'#EF8354', viewers:'2,847' },
  { id:'motogp', name:'MotoGP', emoji:'🏍️', status:'QUALIFYING', round:'Round 7 · Mugello', color:'#f5a623', viewers:'1,203' },
  { id:'f2', name:'Formula 2', emoji:'🏁', status:'NEXT: 14:00', round:'Round 8 · Monaco', color:'#3b82f6', viewers:'456' },
  { id:'wsbk', name:'WorldSBK', emoji:'🔥', status:'FINISHED', round:'Round 5 · Estoril', color:'#5eaa7e', viewers:'—' },
]

const STANDINGS = [
  { pos:1, driver:'Verstappen', team:'Red Bull', pts:144, color:'#3b82f6' },
  { pos:2, driver:'Leclerc', team:'Ferrari', pts:138, color:'#EF8354' },
  { pos:3, driver:'Norris', team:'McLaren', pts:121, color:'#f5a623' },
  { pos:4, driver:'Piastri', team:'McLaren', pts:109, color:'#f5a623' },
  { pos:5, driver:'Hamilton', team:'Ferrari', pts:102, color:'#EF8354' },
  { pos:6, driver:'Russell', team:'Mercedes', pts:89, color:'#5eaa7e' },
]

const CHAT_INIT = [
  { user:'TurboMike', msg:'VERSTAPPEN ON POLE AGAIN 🔥', time:'now', color:'#f5a623' },
  { user:'DriftQueen', msg:'Leclerc gap closing every lap', time:'1m', color:'#5eaa7e' },
  { user:'RaiderKing', msg:'Monaco in the rain is absolutely insane to watch', time:'2m', color:'#EF8354' },
  { user:'ZeroShift', msg:'McLaren needs to pit NOW', time:'2m', color:'#3b82f6' },
  { user:'NightRider', msg:'Best F1 season in years fr', time:'3m', color:'#a855f7' },
  { user:'ApexHunter', msg:'Lap 47 — gap is 1.2s to Leclerc', time:'4m', color:'#5eaa7e' },
]

export default function MotorsportSection() {
  const [activeSeries, setActiveSeries] = useState('f1')
  const [chatMsg, setChatMsg] = useState('')
  const [messages, setMessages] = useState(CHAT_INIT)

  const sendMsg = () => {
    if (!chatMsg.trim()) return
    setMessages(m => [{ user:'You', msg:chatMsg, time:'now', color:C.coral }, ...m])
    setChatMsg('')
  }

  return (
    <div style={{ padding:'2rem' }}>
      <div style={{ marginBottom:'1.5rem' }}>
        <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:'#ef4444', marginBottom:'0.4rem', display:'flex', alignItems:'center', gap:'0.4rem' }}>
          <span style={{ width:7, height:7, borderRadius:'50%', background:'#ef4444', display:'inline-block' }} /> Live Now
        </div>
        <h2 style={{ fontFamily:D.display, fontSize:'2.5rem', fontWeight:700, color:C.text, lineHeight:1 }}>Motorsport Hub</h2>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1rem', marginBottom:'1.5rem' }}>
        {SERIES.map(s => (
          <button key={s.id} onClick={() => setActiveSeries(s.id)}
            style={{ background: activeSeries===s.id ? C.surface2 : C.surface, border:`1px solid ${activeSeries===s.id ? `${s.color}44` : C.border}`, borderRadius:16, padding:'1.25rem', cursor:'pointer', textAlign:'left', transition:'all 0.2s', borderTop:`3px solid ${activeSeries===s.id ? s.color : 'transparent'}` }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'0.75rem' }}>
              <span style={{ fontSize:'1.8rem' }}>{s.emoji}</span>
              <span style={{ fontFamily:D.body, fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.18rem 0.5rem', borderRadius:6, background: s.status==='LIVE' ? 'rgba(239,68,68,0.15)' : s.status==='QUALIFYING' ? 'rgba(245,166,35,0.15)' : 'rgba(191,192,192,0.08)', color: s.status==='LIVE' ? '#ef4444' : s.status==='QUALIFYING' ? C.amber : C.textMuted }}>
                {s.status==='LIVE' ? '🔴 LIVE' : s.status}
              </span>
            </div>
            <div style={{ fontFamily:D.body, fontSize:'0.95rem', fontWeight:700, color: activeSeries===s.id ? C.text : C.textSoft, marginBottom:'0.2rem' }}>{s.name}</div>
            <div style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.textMuted, marginBottom:'0.3rem' }}>{s.round}</div>
            {s.viewers !== '—' && <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:s.color }}>👁 {s.viewers} watching</div>}
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 340px', gap:'1.5rem' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div style={{ background:C.surface, borderRadius:20, padding:'2rem', border:`1px solid rgba(239,131,84,0.2)`, position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', top:-30, right:-30, width:160, height:160, borderRadius:'50%', background:'#EF8354', opacity:0.04, pointerEvents:'none' }} />
            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.25rem' }}>
                <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color:'#ef4444', background:'rgba(239,68,68,0.12)', padding:'0.3rem 0.75rem', borderRadius:8, border:'1px solid rgba(239,68,68,0.25)', display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  <span style={{ width:6, height:6, borderRadius:'50%', background:'#ef4444', display:'inline-block' }} /> LIVE · LAP 47/78
                </div>
                <span style={{ fontFamily:D.body, fontSize:'0.8rem', color:C.textMuted }}>Monaco Grand Prix · Monte Carlo</span>
              </div>
              <h3 style={{ fontFamily:D.display, fontSize:'2.5rem', fontWeight:700, color:C.text, lineHeight:1, marginBottom:'0.4rem' }}>MONACO GRAND PRIX</h3>
              <p style={{ fontFamily:D.body, fontSize:'0.9rem', color:C.textMuted, marginBottom:'1.75rem' }}>Lap 47 of 78 · Light Rain · Safety Car Period</p>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem', marginBottom:'1.75rem' }}>
                {[
                  { pos:'P1', driver:'VERSTAPPEN', gap:'Leader', team:'Red Bull', color:'#3b82f6' },
                  { pos:'P2', driver:'LECLERC', gap:'+1.2s', team:'Ferrari', color:'#EF8354' },
                  { pos:'P3', driver:'NORRIS', gap:'+4.8s', team:'McLaren', color:'#f5a623' },
                ].map(({ pos, driver, gap, team, color }) => (
                  <div key={pos} style={{ background:C.surface2, borderRadius:14, padding:'1.25rem', borderTop:`3px solid ${color}` }}>
                    <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.textMuted, marginBottom:'0.3rem' }}>{pos}</div>
                    <div style={{ fontFamily:D.display, fontSize:'1.5rem', fontWeight:700, color:C.text, lineHeight:1, marginBottom:'0.2rem' }}>{driver}</div>
                    <div style={{ fontFamily:D.body, fontSize:'0.75rem', color, marginBottom:'0.5rem' }}>{team}</div>
                    <div style={{ fontFamily:D.body, fontSize:'0.9rem', fontWeight:600, color:C.textMuted }}>{gap}</div>
                  </div>
                ))}
              </div>
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.5rem' }}>
                  <span style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted }}>Race Progress</span>
                  <span style={{ fontFamily:D.body, fontSize:'0.78rem', fontWeight:600, color:C.coral }}>Lap 47 / 78</span>
                </div>
                <div style={{ height:6, background:'rgba(191,192,192,0.1)', borderRadius:3 }}>
                  <div style={{ height:'100%', width:'60%', background:`linear-gradient(to right, ${C.coral}, #f39c12)`, borderRadius:3 }} />
                </div>
              </div>
            </div>
          </div>

          <div style={{ background:C.surface, borderRadius:20, border:`1px solid ${C.border}`, overflow:'hidden' }}>
            <div style={{ padding:'1.25rem 1.5rem', borderBottom:`1px solid ${C.border}`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontFamily:D.display, fontSize:'1.2rem', fontWeight:700, color:C.text }}>Driver Standings</div>
              <div style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.textMuted }}>After Round 7</div>
            </div>
            {STANDINGS.map(({ pos, driver, team, pts, color }) => (
              <div key={driver} style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'0.9rem 1.5rem', borderBottom:`1px solid ${C.border}`, cursor:'pointer', transition:'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background=C.surface2}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <div style={{ fontFamily:D.display, fontSize:'1.2rem', fontWeight:700, color: pos===1 ? C.amber : C.textMuted, width:24, textAlign:'center', flexShrink:0 }}>{pos}</div>
                <div style={{ width:3, height:32, borderRadius:2, background:color, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:D.body, fontSize:'0.95rem', fontWeight:700, color:C.text }}>{driver}</div>
                  <div style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.textMuted }}>{team}</div>
                </div>
                <div style={{ fontFamily:D.display, fontSize:'1.25rem', fontWeight:700, color: pos===1 ? C.amber : C.text }}>{pts} <span style={{ fontSize:'0.75rem', fontFamily:D.body, fontWeight:400, color:C.textMuted }}>pts</span></div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background:C.surface, borderRadius:20, border:`1px solid rgba(239,131,84,0.2)`, display:'flex', flexDirection:'column', maxHeight:640 }}>
          <div style={{ padding:'1rem 1.25rem', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:'0.6rem' }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:'#ef4444' }} />
            <span style={{ fontFamily:D.body, fontSize:'0.95rem', fontWeight:700, color:C.text }}>Live Chat</span>
            <span style={{ marginLeft:'auto', fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted }}>2,847 watching</span>
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
      </div>
    </div>
  )
}