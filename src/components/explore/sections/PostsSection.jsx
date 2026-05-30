import { useState } from 'react'

const C = { bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50', coral:'#EF8354', coralDim:'#d96a3a', text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0', border:'rgba(191,192,192,0.12)', green:'#5eaa7e' }
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const POSTS = [
  { id:1, user:'TurboMike', avatar:'T', color:'#f39c12', time:'2h ago', tag:'Build Update', emoji:'🔧', title:'K-Swap Complete', desc:'320hp, stock bottom end, daily driven. Ask me anything.', likes:284, comments:42 },
  { id:2, user:'DriftQueen', avatar:'D', color:'#5eaa7e', time:'4h ago', tag:'Car Spotting', emoji:'📸', title:'Perfect S13 at Bangalore Meet', desc:'3 years of work. Completely stock looking but pure track weapon inside.', likes:512, comments:89 },
  { id:3, user:'RaiderKing', avatar:'R', color:'#EF8354', time:'6h ago', tag:'Track Day', emoji:'🏁', title:'Kari Motor Speedway Session', desc:'Best lap 1:42.3. Hunting that 1:40 barrier before year end.', likes:193, comments:31 },
  { id:4, user:'ZeroShift', avatar:'Z', color:'#3b82f6', time:'8h ago', tag:'Mod Reveal', emoji:'⚙️', title:'Stage 2 Tune Results', desc:'+28hp over stock. The pull in 3rd gear is absolutely mental now.', likes:367, comments:54 },
  { id:5, user:'NightRider', avatar:'N', color:'#a855f7', time:'1d ago', tag:'Road Trip', emoji:'🛣️', title:'Coorg to Ooty Solo Ride', desc:'280km. 8 hours. Zero regrets. The Interceptor is made for this.', likes:741, comments:103 },
  { id:6, user:'ApexHunter', avatar:'A', color:'#5eaa7e', time:'1d ago', tag:'Garage', emoji:'🏠', title:'New Lift Installed', desc:'Finally have a proper 2-post lift in the garage. Game changer.', likes:428, comments:67 },
]

const FILTERS = ['All','Builds','Car Spotting','Track Days','Mods','Road Trips']

export default function PostsSection() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [layout, setLayout] = useState('grid')
  const [liked, setLiked] = useState({})
  const filtered = activeFilter === 'All' ? POSTS : POSTS.filter(p => p.tag.toLowerCase().includes(activeFilter.toLowerCase().split(' ')[0].toLowerCase()))

  return (
    <div style={{ padding:'2rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
        <div>
          <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:C.coral, marginBottom:'0.4rem' }}>Community</div>
          <h2 style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:700, color:C.text, lineHeight:1 }}>Posts</h2>
        </div>
        <div style={{ display:'flex', gap:'0.4rem' }}>
          {[['⊞','grid'],['☰','list']].map(([icon,mode]) => (
            <button key={mode} onClick={() => setLayout(mode)}
              style={{ width:38, height:38, borderRadius:10, background: layout===mode ? C.coral : C.surface, border:`1px solid ${layout===mode ? C.coral : C.border}`, cursor:'pointer', fontSize:'1rem', color: layout===mode ? '#fff' : C.textMuted, transition:'all 0.2s' }}>
              {icon}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:'inline-flex', gap:'0.25rem', background:C.surface, padding:'0.3rem', borderRadius:12, marginBottom:'1.5rem' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            style={{ fontFamily:D.body, fontSize:'0.82rem', fontWeight:600, padding:'0.5rem 1rem', borderRadius:9, background: activeFilter===f ? C.coral : 'transparent', color: activeFilter===f ? '#fff' : C.textMuted, border:'none', cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap' }}>
            {f}
          </button>
        ))}
      </div>

      {layout === 'grid' ? (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'1.25rem' }}>
          {filtered.map(post => (
            <div key={post.id} style={{ background:C.surface, borderRadius:16, overflow:'hidden', border:`1px solid ${C.border}`, cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor=`${post.color}44` }}
              onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor=C.border }}>
              <div style={{ height:110, background:`linear-gradient(135deg, ${post.color}18, ${post.color}06)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.8rem', position:'relative' }}>
                {post.emoji}
                <div style={{ position:'absolute', top:10, right:10, fontFamily:D.body, fontSize:'0.65rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:post.color, background:`${post.color}18`, padding:'0.2rem 0.5rem', borderRadius:6 }}>{post.tag}</div>
              </div>
              <div style={{ padding:'1.25rem' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.75rem' }}>
                  <div style={{ width:30, height:30, borderRadius:'50%', background:post.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.8rem', color:'#fff', flexShrink:0 }}>{post.avatar}</div>
                  <span style={{ fontFamily:D.body, fontSize:'0.85rem', fontWeight:600, color:C.text }}>{post.user}</span>
                  <span style={{ marginLeft:'auto', fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted }}>{post.time}</span>
                </div>
                <div style={{ fontFamily:D.display, fontSize:'1.1rem', fontWeight:700, color:C.text, marginBottom:'0.4rem' }}>{post.title}</div>
                <p style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.textMuted, lineHeight:1.55, marginBottom:'1rem' }}>{post.desc}</p>
                <div style={{ display:'flex', gap:'0.5rem', paddingTop:'0.75rem', borderTop:`1px solid ${C.border}` }}>
                  <button onClick={() => setLiked(l => ({ ...l, [post.id]: !l[post.id] }))}
                    style={{ display:'flex', alignItems:'center', gap:'0.4rem', padding:'0.35rem 0.75rem', borderRadius:8, background: liked[post.id] ? 'rgba(239,131,84,0.12)' : 'transparent', border:`1px solid ${liked[post.id] ? 'rgba(239,131,84,0.3)' : 'transparent'}`, cursor:'pointer', fontFamily:D.body, fontSize:'0.82rem', fontWeight:600, color: liked[post.id] ? C.coral : C.textMuted, transition:'all 0.2s' }}>
                    {liked[post.id] ? '❤️' : '🤍'} {post.likes + (liked[post.id] ? 1 : 0)}
                  </button>
                  <button style={{ display:'flex', alignItems:'center', gap:'0.4rem', padding:'0.35rem 0.75rem', borderRadius:8, background:'transparent', border:'none', cursor:'pointer', fontFamily:D.body, fontSize:'0.82rem', fontWeight:600, color:C.textMuted }}>
                    💬 {post.comments}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
          {filtered.map(post => (
            <div key={post.id} style={{ background:C.surface, borderRadius:14, padding:'1.25rem 1.5rem', display:'flex', gap:'1.25rem', alignItems:'center', cursor:'pointer', border:`1px solid ${C.border}`, transition:'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor=`${post.color}44`}
              onMouseLeave={e => e.currentTarget.style.borderColor=C.border}>
              <div style={{ width:56, height:56, borderRadius:14, background:`${post.color}18`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', flexShrink:0 }}>{post.emoji}</div>
              <div style={{ width:36, height:36, borderRadius:'50%', background:post.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.9rem', color:'#fff', flexShrink:0 }}>{post.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.2rem' }}>
                  <span style={{ fontFamily:D.body, fontSize:'1rem', fontWeight:700, color:C.text }}>{post.title}</span>
                  <span style={{ fontFamily:D.body, fontSize:'0.65rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:post.color }}>{post.tag}</span>
                </div>
                <p style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.textMuted }}>{post.desc}</p>
              </div>
              <div style={{ textAlign:'right', flexShrink:0 }}>
                <div style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textMuted }}>❤️ {post.likes} · 💬 {post.comments}</div>
                <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted, marginTop:'0.2rem' }}>{post.time}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}