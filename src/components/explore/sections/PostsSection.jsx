import { useState } from 'react'

const C = { dark:'#2B2D42', light:'#EDF2F4', red:'#EF233C', black:'#1a1b26', card:'#23253a', muted:'#8D99AE' }
const D = { display:"'Barlow Condensed', sans-serif", body:"'Barlow', sans-serif" }

const POSTS = [
  { id:1, user:'TurboMike', avatar:'T', color:'#f39c12', time:'2h ago', tag:'Build Update', emoji:'🔧', title:'K-Swap Complete', desc:'320hp, stock bottom end, daily driven. Ask me anything.', likes:284, comments:42 },
  { id:2, user:'DriftQueen', avatar:'D', color:'#27ae60', time:'4h ago', tag:'Car Spotting', emoji:'📸', title:'Perfect S13 at Bangalore Meet', desc:'3 years of work. Completely stock looking from outside but pure track weapon inside.', likes:512, comments:89 },
  { id:3, user:'RaiderKing', avatar:'R', color:'#EF233C', time:'6h ago', tag:'Track Day', emoji:'🏁', title:'Kari Motor Speedway Session', desc:'Best lap 1:42.3. Hunting that 1:40 barrier before year end.', likes:193, comments:31 },
  { id:4, user:'ZeroShift', avatar:'Z', color:'#3b82f6', time:'8h ago', tag:'Mod Reveal', emoji:'⚙️', title:'Stage 2 Tune Results', desc:'+28hp over stock. The pull in 3rd gear is absolutely mental now.', likes:367, comments:54 },
  { id:5, user:'NightRider', avatar:'N', color:'#a855f7', time:'1d ago', tag:'Road Trip', emoji:'🛣️', title:'Coorg to Ooty Solo Ride', desc:'280km. 8 hours. Zero regrets. The Interceptor is made for this.', likes:741, comments:103 },
  { id:6, user:'ApexHunter', avatar:'A', color:'#27ae60', time:'1d ago', tag:'Garage', emoji:'🏠', title:'New Lift Installed', desc:'Finally have a proper 2-post lift in the garage. Game changer.', likes:428, comments:67 },
]

const FILTERS = ['All','Builds','Car Spotting','Track Days','Mods','Road Trips']

export default function PostsSection() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [layout, setLayout] = useState('grid')
  const filtered = activeFilter === 'All' ? POSTS : POSTS.filter(p => p.tag.toLowerCase().includes(activeFilter.toLowerCase().split(' ')[0].toLowerCase()))

  return (
    <div style={{ padding:'1.5rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem' }}>
        <div>
          <div style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:C.red, marginBottom:'0.25rem' }}>Community</div>
          <h2 style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:900, color:C.light, lineHeight:1 }}>Posts</h2>
        </div>
        <div style={{ display:'flex', gap:'0.5rem' }}>
          {[['⊞','grid'],['☰','list']].map(([icon,mode]) => (
            <button key={mode} onClick={() => setLayout(mode)}
              style={{ width:36, height:36, background: layout===mode ? C.red : C.card, border:'none', cursor:'pointer', fontSize:'1rem', color:C.light }}>
              {icon}
            </button>
          ))}
        </div>
      </div>
      <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', flexWrap:'wrap' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.78rem', letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.35rem 0.9rem', background: activeFilter===f ? C.red : 'none', border:`1px solid ${activeFilter===f ? C.red : 'rgba(141,153,174,0.2)'}`, color: activeFilter===f ? C.light : C.muted, cursor:'pointer' }}>
            {f}
          </button>
        ))}
      </div>
      {layout === 'grid' ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(260px,1fr))', gap:'1px', background:'rgba(141,153,174,0.1)' }}>
          {filtered.map(post => (
            <div key={post.id} style={{ background:C.card, padding:'1.5rem', cursor:'pointer', borderTop:'3px solid transparent', transition:'border-top-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderTopColor=C.red}
              onMouseLeave={e => e.currentTarget.style.borderTopColor='transparent'}>
              <div style={{ height:100, background:'rgba(141,153,174,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', marginBottom:'1rem' }}>{post.emoji}</div>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.75rem' }}>
                <div style={{ width:28, height:28, borderRadius:'50%', background:post.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:900, fontSize:'0.75rem', color:'#fff', flexShrink:0 }}>{post.avatar}</div>
                <span style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.85rem', color:C.light }}>{post.user}</span>
                <span style={{ marginLeft:'auto', fontFamily:D.display, fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.red }}>{post.tag}</span>
              </div>
              <div style={{ fontFamily:D.display, fontWeight:700, fontSize:'1.05rem', color:C.light, marginBottom:'0.4rem' }}>{post.title}</div>
              <div style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.muted, lineHeight:1.5, marginBottom:'1rem' }}>{post.desc}</div>
              <div style={{ display:'flex', gap:'1rem', borderTop:'1px solid rgba(141,153,174,0.1)', paddingTop:'0.75rem' }}>
                <span style={{ fontFamily:D.display, fontSize:'0.82rem', color:C.muted }}>❤️ {post.likes}</span>
                <span style={{ fontFamily:D.display, fontSize:'0.82rem', color:C.muted }}>💬 {post.comments}</span>
                <span style={{ marginLeft:'auto', fontFamily:D.display, fontSize:'0.72rem', color:C.muted }}>{post.time}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'1px', background:'rgba(141,153,174,0.1)' }}>
          {filtered.map(post => (
            <div key={post.id} style={{ background:C.card, padding:'1.2rem 1.5rem', display:'flex', gap:'1rem', alignItems:'center', cursor:'pointer', borderLeft:'3px solid transparent', transition:'border-color 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderLeftColor=C.red}
              onMouseLeave={e => e.currentTarget.style.borderLeftColor='transparent'}>
              <div style={{ width:50, height:50, background:'rgba(141,153,174,0.06)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.6rem', flexShrink:0 }}>{post.emoji}</div>
              <div style={{ width:34, height:34, borderRadius:'50%', background:post.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:900, fontSize:'0.85rem', color:'#fff', flexShrink:0 }}>{post.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.2rem' }}>
                  <span style={{ fontFamily:D.display, fontWeight:700, fontSize:'1rem', color:C.light }}>{post.title}</span>
                  <span style={{ fontFamily:D.display, fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.red }}>{post.tag}</span>
                </div>
                <div style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.muted }}>{post.desc}</div>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontFamily:D.display, fontSize:'0.82rem', color:C.muted }}>❤️ {post.likes} · 💬 {post.comments}</div>
                <div style={{ fontFamily:D.display, fontSize:'0.72rem', color:C.muted, marginTop:'0.2rem' }}>{post.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}