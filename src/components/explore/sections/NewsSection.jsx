const C = { dark:'#2B2D42', light:'#EDF2F4', red:'#EF233C', black:'#1a1b26', card:'#23253a', muted:'#8D99AE' }
const D = { display:"'Barlow Condensed', sans-serif", body:"'Barlow', sans-serif" }

const NEWS = [
  { id:1, tag:'F1 2026', title:'New Power Unit Regulations Lock In Final Spec', time:'2h ago', read:'4 min read', emoji:'🏎️', hot:true },
  { id:2, tag:'MotoGP', title:'Marquez Takes Pole at Mugello — Record Lap', time:'5h ago', read:'3 min read', emoji:'🏍️', hot:true },
  { id:3, tag:'Indian Market', title:'Tata Curvv EV Sales Cross 10,000 Units', time:'8h ago', read:'2 min read', emoji:'⚡', hot:false },
  { id:4, tag:'Mod Guide', title:'Best Budget Suspension Upgrades Under ₹30K', time:'1d ago', read:'6 min read', emoji:'🔧', hot:false },
  { id:5, tag:'Royal Enfield', title:'Himalayan 450 Gets New Colour for 2026 Season', time:'1d ago', read:'2 min read', emoji:'🏔️', hot:false },
  { id:6, tag:'JDM', title:'Toyota Supra A100 Confirmed — Manual Gearbox Returns', time:'2d ago', read:'5 min read', emoji:'🚗', hot:true },
  { id:7, tag:'Track Day', title:'CEAT Opens Kari Motor Speedway for Public Track Days', time:'2d ago', read:'3 min read', emoji:'🏁', hot:false },
]

export default function NewsSection() {
  return (
    <div style={{ padding:'1.5rem' }}>
      <div style={{ marginBottom:'1.5rem' }}>
        <div style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:C.red, marginBottom:'0.25rem' }}>Latest</div>
        <h2 style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:900, color:C.light, lineHeight:1 }}>News & Updates</h2>
      </div>
      {/* Featured */}
      <div style={{ background:C.card, border:'1px solid rgba(141,153,174,0.12)', borderTop:`3px solid ${C.red}`, padding:'2rem', marginBottom:'1px', cursor:'pointer' }}
        onMouseEnter={e => e.currentTarget.style.background='#2d3050'}
        onMouseLeave={e => e.currentTarget.style.background=C.card}>
        <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1rem', alignItems:'center' }}>
          <span style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:C.red, background:'rgba(239,35,60,0.1)', padding:'0.2rem 0.5rem', border:'1px solid rgba(239,35,60,0.25)' }}>🔥 Hot</span>
          <span style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', color:C.muted }}>F1 2026</span>
        </div>
        <div style={{ fontSize:'2.5rem', marginBottom:'1rem' }}>🏎️</div>
        <h3 style={{ fontFamily:D.display, fontSize:'1.8rem', fontWeight:900, color:C.light, lineHeight:1.1, marginBottom:'0.5rem' }}>New Power Unit Regulations Lock In Final Spec</h3>
        <div style={{ fontFamily:D.display, fontSize:'0.78rem', color:C.muted }}>2h ago · 4 min read</div>
      </div>
      {/* List */}
      <div style={{ display:'flex', flexDirection:'column', gap:'1px', background:'rgba(141,153,174,0.1)' }}>
        {NEWS.slice(1).map(({ id, tag, title, time, read, emoji, hot }) => (
          <div key={id} style={{ background:C.card, padding:'1.2rem 1.5rem', display:'flex', gap:'1.2rem', alignItems:'center', cursor:'pointer', borderLeft:'3px solid transparent', transition:'border-color 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.borderLeftColor=C.red}
            onMouseLeave={e => e.currentTarget.style.borderLeftColor='transparent'}>
            <div style={{ width:52, height:52, background:'rgba(141,153,174,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', flexShrink:0 }}>{emoji}</div>
            <div style={{ flex:1 }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.3rem' }}>
                {hot && <span style={{ fontFamily:D.display, fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:C.red, background:'rgba(239,35,60,0.1)', padding:'0.1rem 0.35rem', border:'1px solid rgba(239,35,60,0.25)' }}>Hot</span>}
                <span style={{ fontFamily:D.display, fontSize:'0.68rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:C.muted }}>{tag}</span>
              </div>
              <div style={{ fontFamily:D.display, fontSize:'1.05rem', fontWeight:700, color:C.light, lineHeight:1.2 }}>{title}</div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontFamily:D.display, fontSize:'0.72rem', color:C.muted }}>{time}</div>
              <div style={{ fontFamily:D.display, fontSize:'0.68rem', color:C.muted, marginTop:'0.2rem' }}>{read}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
