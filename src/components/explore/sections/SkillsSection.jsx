const C = { dark:'#2B2D42', light:'#EDF2F4', red:'#EF233C', black:'#1a1b26', card:'#23253a', muted:'#8D99AE' }
const D = { display:"'Barlow Condensed', sans-serif", body:"'Barlow', sans-serif" }

const SKILLS = [
  { id:1, user:'DriftQueen', avatar:'D', color:'#27ae60', skill:'Drift Entry — FMD', desc:'Front-to-Rear drift initiation technique. Watch the weight transfer timing.', difficulty:'Advanced', views:'34K', emoji:'💨', badge:'Pro Driver' },
  { id:2, user:'TurboMike', avatar:'T', color:'#f39c12', skill:'Heel-Toe Downshift', desc:'Perfect rev-match downshift technique for track days. Works on any manual car.', difficulty:'Intermediate', views:'67K', emoji:'🎯', badge:'Track Rat' },
  { id:3, user:'ApexHunter', avatar:'A', color:'#3b82f6', skill:'Trail Braking', desc:'How to carry brake into the corner for a faster entry. The most impactful skill for lap times.', difficulty:'Advanced', views:'89K', emoji:'🏁', badge:'Track Rat' },
  { id:4, user:'GhostLap', avatar:'G', color:'#8D99AE', skill:'Left Foot Braking', desc:'Using left foot for brake on automatic or AWD cars. Reduces response time by 0.2s.', difficulty:'Intermediate', views:'23K', emoji:'⚡', badge:'Tuner' },
]

const diffColor = { Beginner:'#27ae60', Intermediate:'#f39c12', Advanced:'#EF233C' }

export default function SkillsSection() {
  return (
    <div style={{ padding:'1.5rem' }}>
      <div style={{ marginBottom:'1.5rem' }}>
        <div style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:C.red, marginBottom:'0.25rem' }}>Community</div>
        <h2 style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:900, color:C.light, lineHeight:1 }}>Skills Showcase</h2>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'1px', background:'rgba(141,153,174,0.1)' }}>
        {SKILLS.map(s => (
          <div key={s.id} style={{ background:C.card, padding:'1.5rem 2rem', display:'grid', gridTemplateColumns:'auto 1fr auto', gap:'1.5rem', alignItems:'center', borderLeft:'3px solid transparent', transition:'border-color 0.2s', cursor:'pointer' }}
            onMouseEnter={e => e.currentTarget.style.borderLeftColor=C.red}
            onMouseLeave={e => e.currentTarget.style.borderLeftColor='transparent'}>
            <div style={{ width:60, height:60, background:'rgba(141,153,174,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', flexShrink:0 }}>{s.emoji}</div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.4rem' }}>
                <span style={{ fontFamily:D.display, fontSize:'1.3rem', fontWeight:900, color:C.light }}>{s.skill}</span>
                <span style={{ fontFamily:D.display, fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', padding:'0.15rem 0.5rem', border:`1px solid ${diffColor[s.difficulty]}`, color:diffColor[s.difficulty] }}>{s.difficulty}</span>
              </div>
              <div style={{ fontFamily:D.body, fontSize:'0.88rem', color:C.muted, lineHeight:1.5, marginBottom:'0.6rem' }}>{s.desc}</div>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <div style={{ width:24, height:24, borderRadius:'50%', background:s.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:900, fontSize:'0.65rem', color:'#fff' }}>{s.avatar}</div>
                <span style={{ fontFamily:D.display, fontSize:'0.78rem', color:C.muted }}>{s.user}</span>
                <span style={{ fontFamily:D.display, fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.1rem 0.4rem', border:`1px solid ${s.color}`, color:s.color }}>{s.badge}</span>
              </div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontFamily:D.display, fontSize:'1.2rem', fontWeight:900, color:C.light }}>👁 {s.views}</div>
              <button style={{ marginTop:'0.5rem', fontFamily:D.display, fontWeight:800, fontSize:'0.78rem', letterSpacing:'0.1em', textTransform:'uppercase', background:C.red, color:C.light, border:'none', padding:'0.4rem 1rem', cursor:'pointer' }}>Watch</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}