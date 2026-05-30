import { useState } from 'react'

const C = { dark:'#2B2D42', light:'#EDF2F4', red:'#EF233C', black:'#1a1b26', card:'#23253a', muted:'#8D99AE' }
const D = { display:"'Barlow Condensed', sans-serif", body:"'Barlow', sans-serif" }

const SERIES = [
  { id:'f1', name:'Formula 1', emoji:'🏎️', status:'LIVE', round:'Round 8 · Monaco GP', color:'#EF233C', viewers:'2,847' },
  { id:'motogp', name:'MotoGP', emoji:'🏍️', status:'QUALIFYING', round:'Round 7 · Mugello', color:'#f39c12', viewers:'1,203' },
  { id:'f2', name:'Formula 2', emoji:'🏁', status:'NEXT: 14:00', round:'Round 8 · Monaco', color:'#3b82f6', viewers:'456' },
  { id:'wsbk', name:'WorldSBK', emoji:'🔥', status:'FINISHED', round:'Round 5 · Estoril', color:'#27ae60', viewers:'—' },
]

const F1_STANDINGS = [
  { pos:1, driver:'Verstappen', team:'Red Bull', pts:144, color:'#3b82f6' },
  { pos:2, driver:'Leclerc', team:'Ferrari', pts:138, color:'#EF233C' },
  { pos:3, driver:'Norris', team:'McLaren', pts:121, color:'#f39c12' },
  { pos:4, driver:'Piastri', team:'McLaren', pts:109, color:'#f39c12' },
  { pos:5, driver:'Hamilton', team:'Ferrari', pts:102, color:'#EF233C' },
  { pos:6, driver:'Russell', team:'Mercedes', pts:89, color:'#27ae60' },
]

const INITIAL_CHAT = [
  { user:'TurboMike', msg:'VERSTAPPEN ON POLE AGAIN 🔥', time:'now', color:'#f39c12' },
  { user:'DriftQueen', msg:'Leclerc gap closing every lap', time:'1m', color:'#27ae60' },
  { user:'RaiderKing', msg:'This Monaco circuit is insane in the rain', time:'2m', color:'#EF233C' },
  { user:'ZeroShift', msg:'McLaren needs to pit NOW', time:'2m', color:'#3b82f6' },
  { user:'NightRider', msg:'Best F1 season in years fr', time:'3m', color:'#a855f7' },
  { user:'ApexHunter', msg:'Lap 47 — gap is 1.2s to Leclerc', time:'4m', color:'#27ae60' },
]

export default function MotorsportSection() {
  const [activeSeries, setActiveSeries] = useState('f1')
  const [chatMsg, setChatMsg] = useState('')
  const [messages, setMessages] = useState(INITIAL_CHAT)

  const sendMsg = () => {
    if (!chatMsg.trim()) return
    setMessages(m => [{ user:'You', msg:chatMsg, time:'now', color:C.red }, ...m])
    setChatMsg('')
  }

  return (
    <div style={{ padding:'1.5rem' }}>
      <div style={{ marginBottom:'1.5rem' }}>
        <div style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:C.red, marginBottom:'0.25rem' }}>🔴 Live Now</div>
        <h2 style={{ fontFamily:D.display, fontSize:'2.5rem', fontWeight:900, color:C.light, lineHeight:1 }}>Motorsport Hub</h2>
      </div>

      {/* Series tabs */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1px', background:'rgba(141,153,174,0.1)', marginBottom:'1.5rem' }}>
        {SERIES.map(s => (
          <button key={s.id} onClick={() => setActiveSeries(s.id)}
            style={{ background: activeSeries===s.id ? C.card : C.black, border:'none', borderTop: activeSeries===s.id ? `3px solid ${s.color}` : '3px solid transparent', padding:'1.2rem 1rem', cursor:'pointer', textAlign:'left', transition:'all 0.2s' }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.5rem' }}>
              <span style={{ fontSize:'1.5rem' }}>{s.emoji}</span>
              <span style={{ fontFamily:D.display, fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', padding:'0.15rem 0.5rem', background: s.status==='LIVE' ? 'rgba(239,35,60,0.2)' : 'rgba(141,153,174,0.1)', color: s.status==='LIVE' ? C.red : C.muted, border:`1px solid ${s.status==='LIVE' ? 'rgba(239,35,60,0.4)' : 'rgba(141,153,174,0.2)'}` }}>
                {s.status==='LIVE' ? '🔴 LIVE' : s.status}
              </span>
            </div>
            <div style={{ fontFamily:D.display, fontSize:'1.1rem', fontWeight:900, color: activeSeries===s.id ? C.light : C.muted }}>{s.name}</div>
            <div style={{ fontFamily:D.display, fontSize:'0.72rem', color:C.muted, marginTop:'0.2rem' }}>{s.round}</div>
            {s.viewers !== '—' && <div style={{ fontFamily:D.display, fontSize:'0.68rem', color:s.color, marginTop:'0.3rem' }}>👁 {s.viewers} watching</div>}
          </button>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 320px', gap:'1.5rem' }}>
        {/* Race view */}
        <div>
          <div style={{ background:C.card, border:'1px solid rgba(141,153,174,0.12)', borderTop:`3px solid ${C.red}`, padding:'2rem', marginBottom:'1.5rem', position:'relative', overflow:'hidden' }}>
            <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'8rem', opacity:0.04, pointerEvents:'none' }}>🏎️</div>
            <div style={{ position:'relative', zIndex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem' }}>
                <div style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', color:C.red, background:'rgba(239,35,60,0.1)', padding:'0.25rem 0.75rem', border:'1px solid rgba(239,35,60,0.3)' }}>🔴 LIVE · LAP 47/78</div>
                <div style={{ fontFamily:D.display, fontSize:'0.65rem', color:C.muted }}>Monaco Grand Prix · Monte Carlo</div>
              </div>
              <h3 style={{ fontFamily:D.display, fontSize:'3rem', fontWeight:900, color:C.light, lineHeight:1, marginBottom:'0.5rem' }}>MONACO GRAND PRIX</h3>
              <div style={{ fontFamily:D.display, fontSize:'1rem', color:C.muted, marginBottom:'2rem' }}>Lap 47 of 78 · Light Rain · Safety Car Period</div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1px', background:'rgba(141,153,174,0.1)', marginBottom:'1.5rem' }}>
                {[
                  { pos:'P1', driver:'VERSTAPPEN', gap:'Leader', team:'Red Bull', color:'#3b82f6' },
                  { pos:'P2', driver:'LECLERC', gap:'+1.2s', team:'Ferrari', color:'#EF233C' },
                  { pos:'P3', driver:'NORRIS', gap:'+4.8s', team:'McLaren', color:'#f39c12' },
                ].map(({ pos, driver, gap, team, color }) => (
                  <div key={pos} style={{ background:C.black, padding:'1rem', borderTop:`3px solid ${color}` }}>
                    <div style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.2em', color:C.muted, marginBottom:'0.25rem' }}>{pos}</div>
                    <div style={{ fontFamily:D.display, fontSize:'1.4rem', fontWeight:900, color:C.light, lineHeight:1 }}>{driver}</div>
                    <div style={{ fontFamily:D.display, fontSize:'0.72rem', color, marginTop:'0.25rem' }}>{team}</div>
                    <div style={{ fontFamily:D.display, fontSize:'0.85rem', fontWeight:700, color:C.muted, marginTop:'0.5rem' }}>{gap}</div>
                  </div>
                ))}
              </div>

              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.4rem' }}>
                  <span style={{ fontFamily:D.display, fontSize:'0.72rem', color:C.muted }}>Race Progress</span>
                  <span style={{ fontFamily:D.display, fontSize:'0.72rem', color:C.red }}>Lap 47 / 78</span>
                </div>
                <div style={{ height:4, background:'rgba(141,153,174,0.15)', borderRadius:2 }}>
                  <div style={{ height:'100%', width:'60%', background:C.red, borderRadius:2 }} />
                </div>
              </div>
            </div>
          </div>

          {/* Standings */}
          <div style={{ background:C.card, border:'1px solid rgba(141,153,174,0.12)', borderTop:'3px solid #f39c12' }}>
            <div style={{ padding:'1rem 1.5rem', borderBottom:'1px solid rgba(141,153,174,0.1)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <div style={{ fontFamily:D.display, fontSize:'1.2rem', fontWeight:900, color:C.light }}>Driver Standings</div>
              <div style={{ fontFamily:D.display, fontSize:'0.72rem', color:C.muted }}>After Round 7</div>
            </div>
            {F1_STANDINGS.map(({ pos, driver, team, pts, color }) => (
              <div key={driver} style={{ display:'flex', alignItems:'center', gap:'1rem', padding:'0.85rem 1.5rem', borderBottom:'1px solid rgba(141,153,174,0.07)', cursor:'pointer', transition:'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background='rgba(141,153,174,0.04)'}
                onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                <div style={{ fontFamily:D.display, fontSize:'1.2rem', fontWeight:900, color: pos===1 ? '#f39c12' : C.muted, width:24, textAlign:'center' }}>{pos}</div>
                <div style={{ width:3, height:28, background:color }} />
                <div style={{ flex:1 }}>
                  <div style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:700, color:C.light }}>{driver}</div>
                  <div style={{ fontFamily:D.display, fontSize:'0.72rem', color:C.muted }}>{team}</div>
                </div>
                <div style={{ fontFamily:D.display, fontSize:'1.3rem', fontWeight:900, color: pos===1 ? '#f39c12' : C.light }}>{pts} pts</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Chat */}
        <div style={{ background:C.card, border:'1px solid rgba(141,153,174,0.12)', borderTop:`3px solid ${C.red}`, display:'flex', flexDirection:'column' }}>
          <div style={{ padding:'1rem 1.2rem', borderBottom:'1px solid rgba(141,153,174,0.1)', display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <div style={{ width:8, height:8, borderRadius:'50%', background:C.red }} />
            <div style={{ fontFamily:D.display, fontSize:'0.95rem', fontWeight:700, color:C.light }}>Live Chat</div>
            <div style={{ marginLeft:'auto', fontFamily:D.display, fontSize:'0.68rem', color:C.muted }}>2,847 watching</div>
          </div>
          <div style={{ flex:1, overflowY:'auto', padding:'1rem', display:'flex', flexDirection:'column', gap:'0.75rem', maxHeight:380 }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display:'flex', gap:'0.5rem', alignItems:'flex-start' }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background:m.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:900, fontSize:'0.6rem', color:'#fff', flexShrink:0 }}>{m.user[0]}</div>
                <div>
                  <span style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.78rem', color:m.color }}>{m.user} </span>
                  <span style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.light }}>{m.msg}</span>
                  <div style={{ fontFamily:D.display, fontSize:'0.62rem', color:C.muted, marginTop:'0.1rem' }}>{m.time}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding:'0.75rem', borderTop:'1px solid rgba(141,153,174,0.1)', display:'flex', gap:'0.5rem' }}>
            <input value={chatMsg} onChange={e => setChatMsg(e.target.value)} onKeyDown={e => e.key==='Enter' && sendMsg()}
              placeholder="React to the race..."
              style={{ flex:1, background:'rgba(141,153,174,0.06)', border:'1px solid rgba(141,153,174,0.15)', padding:'0.5rem 0.75rem', color:C.light, fontFamily:D.body, fontSize:'0.82rem', outline:'none' }}
              onFocus={e => e.target.style.borderColor=C.red} onBlur={e => e.target.style.borderColor='rgba(141,153,174,0.15)'} />
            <button onClick={sendMsg} style={{ background:C.red, border:'none', padding:'0.5rem 0.9rem', cursor:'pointer', fontFamily:D.display, fontWeight:800, fontSize:'0.8rem', color:C.light }}>Send</button>
          </div>
        </div>
      </div>
    </div>
  )
}