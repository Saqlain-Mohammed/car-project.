const C = { bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50', coral:'#EF8354', text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0', border:'rgba(191,192,192,0.12)' }
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const NEWS = [
  { id:1, tag:'F1 2026', title:'New Power Unit Regulations Lock In Final Spec', time:'2h ago', read:'4 min', emoji:'🏎️', hot:true, desc:'All ten teams have signed off on the 2026 technical regulations following months of negotiations.' },
  { id:2, tag:'MotoGP', title:'Marquez Takes Pole at Mugello — Record Lap', time:'5h ago', read:'3 min', emoji:'🏍️', hot:true, desc:'Marc Marquez set a new circuit record in qualifying at the Mugello circuit in Italy.' },
  { id:3, tag:'Indian Market', title:'Tata Curvv EV Sales Cross 10,000 Units', time:'8h ago', read:'2 min', emoji:'⚡', hot:false, desc:'The Curvv EV crosses a major milestone just six months after launch.' },
  { id:4, tag:'Mod Guide', title:'Best Budget Suspension Upgrades Under ₹30K', time:'1d ago', read:'6 min', emoji:'🔧', hot:false, desc:'We tested 8 suspension kits across various platforms to find the best bang for buck.' },
  { id:5, tag:'Royal Enfield', title:'Himalayan 450 Gets New Colour for 2026 Season', time:'1d ago', read:'2 min', emoji:'🏔️', hot:false, desc:'Royal Enfield adds three new colourways to the popular Himalayan 450 lineup.' },
  { id:6, tag:'JDM', title:'Toyota Supra A100 Confirmed — Manual Returns', time:'2d ago', read:'5 min', emoji:'🚗', hot:true, desc:'Toyota officially confirms the next-generation Supra will offer a 6-speed manual option.' },
]

export default function NewsSection() {
  return (
    <div style={{ padding:'2rem' }}>
      <div style={{ marginBottom:'1.5rem' }}>
        <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:C.coral, marginBottom:'0.4rem' }}>Latest</div>
        <h2 style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:700, color:C.text, lineHeight:1 }}>News & Updates</h2>
      </div>

      <div style={{ background:C.surface, borderRadius:20, padding:'2rem', marginBottom:'1.25rem', border:`1px solid rgba(239,131,84,0.25)`, cursor:'pointer', transition:'all 0.2s', position:'relative', overflow:'hidden' }}
        onMouseEnter={e => e.currentTarget.style.borderColor='rgba(239,131,84,0.5)'}
        onMouseLeave={e => e.currentTarget.style.borderColor='rgba(239,131,84,0.25)'}>
        <div style={{ position:'absolute', top:-30, right:-30, width:140, height:140, borderRadius:'50%', background:C.coral, opacity:0.06, pointerEvents:'none' }} />
        <div style={{ display:'flex', gap:'0.6rem', marginBottom:'1rem', alignItems:'center' }}>
          <span style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:700, color:C.coral, background:'rgba(239,131,84,0.12)', padding:'0.2rem 0.6rem', borderRadius:6, border:'1px solid rgba(239,131,84,0.25)' }}>🔥 Hot</span>
          <span style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:C.textMuted }}>F1 2026</span>
        </div>
        <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🏎️</div>
        <h3 style={{ fontFamily:D.display, fontSize:'1.8rem', fontWeight:700, color:C.text, lineHeight:1.1, marginBottom:'0.6rem' }}>New Power Unit Regulations Lock In Final Spec</h3>
        <p style={{ fontFamily:D.body, fontSize:'0.9rem', color:C.textMuted, lineHeight:1.6, marginBottom:'0.75rem' }}>All ten teams have signed off on the 2026 technical regulations following months of negotiations.</p>
        <div style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted }}>2h ago · 4 min read</div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
        {NEWS.slice(1).map(n => (
          <div key={n.id} style={{ background:C.surface, borderRadius:14, padding:'1.25rem 1.5rem', display:'flex', gap:'1.25rem', alignItems:'center', cursor:'pointer', border:`1px solid ${C.border}`, transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background=C.surface2; e.currentTarget.style.borderColor='rgba(239,131,84,0.25)' }}
            onMouseLeave={e => { e.currentTarget.style.background=C.surface; e.currentTarget.style.borderColor=C.border }}>
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
              <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted, marginTop:'0.15rem' }}>{n.read} read</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}