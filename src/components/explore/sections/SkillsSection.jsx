
const C = { bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50', coral:'#EF8354', text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0', border:'rgba(191,192,192,0.12)', green:'#5eaa7e', amber:'#f5a623' }
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const SKILLS = [
  { id:1, user:'DriftQueen', avatar:'D', color:'#5eaa7e', skill:'Drift Entry — FMD', desc:'Front-to-Rear drift initiation technique. Watch the weight transfer timing.', difficulty:'Advanced', views:'34K', emoji:'💨', badge:'Pro Driver' },
  { id:2, user:'TurboMike', avatar:'T', color:'#f39c12', skill:'Heel-Toe Downshift', desc:'Perfect rev-match downshift technique for track days. Works on any manual car.', difficulty:'Intermediate', views:'67K', emoji:'🎯', badge:'Track Rat' },
  { id:3, user:'ApexHunter', avatar:'A', color:'#3b82f6', skill:'Trail Braking', desc:'How to carry brake into the corner for a faster entry. The most impactful skill for lap times.', difficulty:'Advanced', views:'89K', emoji:'🏁', badge:'Track Rat' },
  { id:4, user:'GhostLap', avatar:'G', color:'#8b90a0', skill:'Left Foot Braking', desc:'Using left foot for brake on automatic or AWD cars. Reduces response time significantly.', difficulty:'Intermediate', views:'23K', emoji:'⚡', badge:'Tuner' },
]

const diffColors = { Beginner:'#5eaa7e', Intermediate:'#f5a623', Advanced:'#EF8354' }

export default function SkillsSection() {
  return (
    <div style={{ padding:'2rem' }}>
      <div style={{ marginBottom:'1.5rem' }}>
        <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:C.coral, marginBottom:'0.4rem' }}>Community</div>
        <h2 style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:700, color:C.text, lineHeight:1 }}>Skills Showcase</h2>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
        {SKILLS.map(s => (
          <div key={s.id} style={{ background:C.surface, borderRadius:16, padding:'1.5rem 2rem', display:'grid', gridTemplateColumns:'auto 1fr auto', gap:'1.5rem', alignItems:'center', border:`1px solid ${C.border}`, transition:'all 0.2s', cursor:'pointer' }}
            onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(239,131,84,0.3)'; e.currentTarget.style.background=C.surface2 }}
            onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.background=C.surface }}>
            <div style={{ width:64, height:64, borderRadius:16, background:`${s.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2rem', flexShrink:0 }}>{s.emoji}</div>
            <div>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.4rem', flexWrap:'wrap' }}>
                <span style={{ fontFamily:D.display, fontSize:'1.3rem', fontWeight:700, color:C.text }}>{s.skill}</span>
                <span style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:600, padding:'0.2rem 0.6rem', borderRadius:6, background:`${diffColors[s.difficulty]}18`, border:`1px solid ${diffColors[s.difficulty]}33`, color:diffColors[s.difficulty] }}>{s.difficulty}</span>
              </div>
              <p style={{ fontFamily:D.body, fontSize:'0.88rem', color:C.textMuted, lineHeight:1.55, marginBottom:'0.65rem' }}>{s.desc}</p>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                <div style={{ width:26, height:26, borderRadius:'50%', background:s.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.68rem', color:'#fff' }}>{s.avatar}</div>
                <span style={{ fontFamily:D.body, fontSize:'0.8rem', fontWeight:500, color:C.textMuted }}>{s.user}</span>
                <span style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:600, color:s.color, background:`${s.color}18`, padding:'0.1rem 0.4rem', borderRadius:5 }}>{s.badge}</span>
              </div>
            </div>
            <div style={{ textAlign:'right', flexShrink:0 }}>
              <div style={{ fontFamily:D.display, fontSize:'1.5rem', fontWeight:700, color:C.text, marginBottom:'0.75rem' }}>👁 {s.views}</div>
              <button style={{ background:C.coral, border:'none', borderRadius:9, padding:'0.5rem 1.25rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.82rem', color:'#fff' }}>Watch</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}