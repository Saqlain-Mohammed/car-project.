import { useState } from 'react'
import { Heart, MessageCircle, Share2, Bookmark, X, BadgeCheck, ChevronUp, ChevronDown } from 'lucide-react'

const C = { bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50', coral:'#EF8354', coralDim:'#d96a3a', text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0', border:'rgba(191,192,192,0.12)', green:'#5eaa7e', amber:'#f5a623' }
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

// Verified company posts — shown FIRST
const COMPANY_POSTS = [
  { id:'c1', isCompany:true, user:'Honda India', avatar:'H', color:'#EF8354',  time:'1h ago',  tag:'New Launch',   title:'Civic Type R Limited Edition — India Exclusive',    desc:'We are bringing 150 units of the FL5 Type R to India. Bookings open June 15th. Are you ready?', likes:4210, comments:312, img:'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80', tags:['#TypeR','#FL5','#HondaIndia','#LimitedEdition'] },
  { id:'c2', isCompany:true, user:'KTM India',   avatar:'K', color:'#f5a623',  time:'3h ago',  tag:'Announcement',  title:'KTM 390 Adventure V2 — Official Launch',             desc:'The most capable 390 Adventure ever. New traction control, larger tank, improved suspension. Available at all KTM dealers from July 1st.', likes:2847, comments:198, img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80', tags:['#KTM390','#Adventure','#KTMIndia'] },
  { id:'c3', isCompany:true, user:'Pirelli',     avatar:'P', color:'#5eaa7e',  time:'5h ago',  tag:'Product Drop',  title:'P Zero Trofeo RS — Now Available in India',         desc:'Track-day compound now officially available for Indian roads. Compatible with all B-segment sports cars. DM for fitment details.', likes:1893, comments:84,  img:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80', tags:['#Pirelli','#Trofeo','#Tyres','#TrackDay'] },
]

// User posts — shown AFTER company posts
const USER_POSTS = [
  { id:'u1', isCompany:false, user:'TurboMike',  avatar:'T', color:'#f39c12',  time:'2h ago',  tag:'Build Update', title:'K-Swap Complete 🔥',                               desc:'320hp on a stock bottom end. Daily driven. Ask me anything — happy to share the full parts list.', likes:284, comments:42, img:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80', tags:['#KSwap','#Honda','#BuildUpdate','#EK9'] },
  { id:'u2', isCompany:false, user:'DriftQueen', avatar:'D', color:'#5eaa7e',  time:'4h ago',  tag:'Car Spotting', title:'Cleanest S13 I\'ve ever seen at the Bangalore Meet', desc:'3 years of work. Completely stock looking but pure track weapon inside. Owner built it all himself.', likes:512, comments:89, img:'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=800&q=80', tags:['#S13','#Nissan','#Drift','#JDM'] },
  { id:'u3', isCompany:false, user:'RaiderKing', avatar:'R', color:'#EF8354',  time:'6h ago',  tag:'Track Day',    title:'Kari Motor Speedway — 1:42.3 Personal Best',       desc:'Hunting that 1:40 barrier before year end. Brake bias is off, need to adjust for sector 2.', likes:193, comments:31, img:'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&q=80', tags:['#TrackDay','#Kari','#PersonalBest','#Motorsport'] },
  { id:'u4', isCompany:false, user:'ZeroShift',  avatar:'Z', color:'#3b82f6',  time:'8h ago',  tag:'Mod Reveal',   title:'Stage 2 Tune — +28hp Over Stock',                 desc:'The pull in 3rd gear is absolutely mental now. Will be doing a full dyno video this weekend.', likes:367, comments:54, img:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80', tags:['#ECUTune','#Stage2','#DynoDay','#Performance'] },
  { id:'u5', isCompany:false, user:'NightRider', avatar:'N', color:'#a855f7',  time:'1d ago',  tag:'Road Trip',    title:'Coorg → Ooty Solo Ride — 280km, 8 Hours',         desc:'Zero regrets. The Interceptor is absolutely made for this kind of riding. Ghat road at dawn is something else.', likes:741, comments:103, img:'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=800&q=80', tags:['#RoadTrip','#Interceptor','#Touring','#GhatRoad'] },
  { id:'u6', isCompany:false, user:'ApexHunter', avatar:'A', color:'#5eaa7e',  time:'1d ago',  tag:'Garage',       title:'New 2-Post Lift Installed — Game Changer',        desc:'Finally have a proper lift in the garage. Working under the car standing up hits different. Worth every rupee.', likes:428, comments:67, img:'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80', tags:['#Garage','#CarLift','#GarageGoals','#DIY'] },
]

const ALL_POSTS = [...COMPANY_POSTS, ...USER_POSTS]
const FILTERS   = ['All', 'Companies', 'Users', 'Builds', 'Car Spotting', 'Track Days', 'Mods', 'Road Trips']

const REDDIT_COMMENTS = [
  { id:1, user:'GhostLap',   avatar:'G', color:'#8b90a0', text:'This is insane work, what does it cost to maintain?', votes:47, time:'1h ago',
    replies:[
      { id:11, user:'TurboMike', avatar:'T', color:'#f39c12', text:'Insurance is the big one, roughly ₹45K/yr for performance cover.', votes:23, time:'55m ago' },
    ]
  },
  { id:2, user:'DriftQueen', avatar:'D', color:'#5eaa7e', text:'What tune shop did you use? Been looking for someone who knows K-series.', votes:31, time:'1h ago', replies:[] },
  { id:3, user:'IronBlock',  avatar:'I', color:'#EF8354', text:'Daily driven on this?? Absolute madman 👏', votes:89, time:'2h ago', replies:[] },
  { id:4, user:'ZeroShift',  avatar:'Z', color:'#3b82f6', text:'Full build list somewhere? Would love to replicate this.', votes:18, time:'2h ago', replies:[] },
]

function PostDetailModal({ post, onClose }) {
  const [liked,    setLiked]   = useState(false)
  const [saved,    setSaved]   = useState(false)
  const [comment,  setComment] = useState('')
  const [comments, setComments]= useState(REDDIT_COMMENTS)
  const [expanded, setExpanded]= useState({})

  const submitComment = () => {
    if (!comment.trim()) return
    setComments(c => [{ id: Date.now(), user:'You', avatar:'Y', color:C.coral, text:comment, votes:1, time:'now', replies:[] }, ...c])
    setComment('')
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:700, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(8,10,18,0.88)', backdropFilter:'blur(8px)' }} onClick={onClose} />
      <div style={{ position:'relative', zIndex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:22, width:'100%', maxWidth:720, maxHeight:'92vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 32px 80px rgba(0,0,0,0.6)' }}>

        {/* Close */}
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, zIndex:10, width:32, height:32, borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, cursor:'pointer', color:C.textMuted, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <X size={15} />
        </button>

        <div style={{ overflowY:'auto', flex:1 }}>
          {/* Hero image */}
          <div style={{ height:280, position:'relative', overflow:'hidden' }}>
            <img src={post.img} alt={post.title} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(31,34,48,1) 0%, transparent 60%)' }} />
            {/* Company badge */}
            {post.isCompany && (
              <div style={{ position:'absolute', top:14, left:14, display:'flex', alignItems:'center', gap:'0.4rem', background:'rgba(94,170,126,0.9)', backdropFilter:'blur(4px)', padding:'0.3rem 0.75rem', borderRadius:20 }}>
                <BadgeCheck size={13} color="#fff" />
                <span style={{ fontFamily:D.body, fontSize:'0.7rem', fontWeight:700, color:'#fff' }}>Verified Company</span>
              </div>
            )}
          </div>

          <div style={{ padding:'1.5rem' }}>
            {/* Author */}
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
              <div style={{ width:42, height:42, borderRadius:'50%', background:post.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'1rem', color:'#fff', flexShrink:0 }}>{post.avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <span style={{ fontFamily:D.body, fontSize:'0.95rem', fontWeight:700, color:C.text }}>{post.user}</span>
                  {post.isCompany && <BadgeCheck size={14} color={C.green} />}
                </div>
                <span style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted }}>{post.time}</span>
              </div>
              <button style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.78rem', background:'transparent', border:`1px solid ${C.border}`, borderRadius:8, padding:'0.35rem 0.85rem', cursor:'pointer', color:C.textMuted }}>Follow</button>
            </div>

            {/* Title + desc */}
            <h2 style={{ fontFamily:D.display, fontSize:'1.5rem', fontWeight:700, color:C.text, lineHeight:1.2, marginBottom:'0.6rem' }}>{post.title}</h2>
            <p style={{ fontFamily:D.body, fontSize:'0.92rem', color:C.textSoft, lineHeight:1.65, marginBottom:'1rem' }}>{post.desc}</p>

            {/* Tags */}
            <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
              {post.tags.map(t => <span key={t} style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:600, padding:'0.22rem 0.65rem', borderRadius:20, background:`${post.color}18`, color:post.color, border:`1px solid ${post.color}33` }}>{t}</span>)}
            </div>

            {/* Actions */}
            <div style={{ display:'flex', gap:'0.5rem', paddingBottom:'1.25rem', borderBottom:`1px solid ${C.border}` }}>
              {[
                { Icon:Heart,        label: liked ? post.likes+1 : post.likes, action:() => setLiked(l=>!l), active:liked,  activeColor:'#ef4444' },
                { Icon:MessageCircle,label: post.comments, action:() => {}, active:false, activeColor:C.coral },
                { Icon:Share2,       label:'Share', action:() => {}, active:false, activeColor:C.coral },
                { Icon:Bookmark,     label:'Save',  action:() => setSaved(s=>!s), active:saved, activeColor:C.amber },
              ].map(({ Icon, label, action, active, activeColor }) => (
                <button key={String(label)} onClick={action}
                  style={{ display:'flex', alignItems:'center', gap:'0.4rem', padding:'0.45rem 0.9rem', borderRadius:9, background: active ? `${activeColor}18` : 'transparent', border:`1px solid ${active ? `${activeColor}33` : C.border}`, cursor:'pointer', fontFamily:D.body, fontSize:'0.82rem', fontWeight:600, color: active ? activeColor : C.textMuted, transition:'all 0.2s' }}>
                  <Icon size={15} fill={active ? activeColor : 'none'} color={active ? activeColor : C.textMuted} /> {label}
                </button>
              ))}
            </div>

            {/* Reddit-style comments */}
            <div style={{ paddingTop:'1.25rem' }}>
              <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.textMuted, marginBottom:'1rem' }}>Discussion ({post.comments})</div>

              {/* Comment input */}
              <div style={{ display:'flex', gap:'0.6rem', marginBottom:'1.5rem' }}>
                <input value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key==='Enter' && submitComment()}
                  placeholder="Add to the discussion..."
                  style={{ flex:1, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.65rem 1rem', color:C.text, fontFamily:D.body, fontSize:'0.88rem', outline:'none' }}
                  onFocus={e => e.target.style.borderColor='rgba(239,131,84,0.4)'}
                  onBlur={e => e.target.style.borderColor=C.border} />
                <button onClick={submitComment} style={{ background:C.coral, border:'none', borderRadius:10, padding:'0.65rem 1.1rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.85rem', color:'#fff' }}>Post</button>
              </div>

              {/* Comment threads */}
              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                {comments.map(c => (
                  <div key={c.id}>
                    <div style={{ display:'flex', gap:'0.6rem' }}>
                      {/* Vote */}
                      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'0.15rem', flexShrink:0 }}>
                        <button style={{ background:'none', border:'none', cursor:'pointer', color:C.textMuted, padding:'0.1rem' }}><ChevronUp size={14} /></button>
                        <span style={{ fontFamily:D.display, fontSize:'0.72rem', fontWeight:700, color:C.amber }}>{c.votes}</span>
                        <button style={{ background:'none', border:'none', cursor:'pointer', color:C.textMuted, padding:'0.1rem' }}><ChevronDown size={14} /></button>
                      </div>
                      <div style={{ flex:1 }}>
                        <div style={{ background:C.surface2, borderRadius:12, padding:'0.75rem 1rem' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.4rem' }}>
                            <div style={{ width:22, height:22, borderRadius:'50%', background:c.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.58rem', color:'#fff' }}>{c.avatar}</div>
                            <span style={{ fontFamily:D.body, fontSize:'0.78rem', fontWeight:700, color:c.color }}>{c.user}</span>
                            <span style={{ fontFamily:D.body, fontSize:'0.68rem', color:C.textMuted }}>{c.time}</span>
                          </div>
                          <p style={{ fontFamily:D.body, fontSize:'0.88rem', color:C.text, lineHeight:1.55, margin:0 }}>{c.text}</p>
                        </div>
                        {c.replies.length > 0 && (
                          <button onClick={() => setExpanded(e => ({ ...e, [c.id]: !e[c.id] }))}
                            style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:600, color:C.textMuted, background:'none', border:'none', cursor:'pointer', padding:'0.3rem 0.5rem', marginTop:'0.3rem' }}>
                            {expanded[c.id] ? '▲ Hide' : `▼ ${c.replies.length} repl${c.replies.length===1?'y':'ies'}`}
                          </button>
                        )}
                        {expanded[c.id] && (
                          <div style={{ marginLeft:'1.5rem', marginTop:'0.5rem', display:'flex', flexDirection:'column', gap:'0.5rem', borderLeft:`2px solid ${C.border}`, paddingLeft:'0.85rem' }}>
                            {c.replies.map(r => (
                              <div key={r.id} style={{ background:C.surface2, borderRadius:10, padding:'0.65rem 0.85rem' }}>
                                <div style={{ display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.25rem' }}>
                                  <div style={{ width:18, height:18, borderRadius:'50%', background:r.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.5rem', color:'#fff' }}>{r.avatar}</div>
                                  <span style={{ fontFamily:D.body, fontSize:'0.75rem', fontWeight:700, color:r.color }}>{r.user}</span>
                                  <span style={{ fontFamily:D.body, fontSize:'0.65rem', color:C.textMuted }}>{r.time}</span>
                                </div>
                                <p style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.text, margin:0 }}>{r.text}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PostCard({ post, onClick }) {
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  return (
    <div style={{ background:C.surface, borderRadius:16, overflow:'hidden', border:`1px solid ${C.border}`, cursor:'pointer', transition:'all 0.22s', display:'flex', flexDirection:'column' }}
      onDoubleClick={onClick}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor= post.isCompany ? `${C.green}44` : `${post.color}44` }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)';    e.currentTarget.style.borderColor=C.border }}>

      {/* Image */}
      <div style={{ height:160, position:'relative', overflow:'hidden', background:`linear-gradient(135deg,${post.color}22,${post.color}08)` }}>
        {post.img && (
          <img src={post.img} alt={post.title}
            style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s' }}
            onMouseEnter={e => e.currentTarget.style.transform='scale(1.06)'}
            onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
            onError={e => { e.currentTarget.style.display='none' }} />
        )}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(31,34,48,0.7) 0%, transparent 60%)' }} />
        <div style={{ position:'absolute', top:10, right:10, fontFamily:D.body, fontSize:'0.62rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', color: post.isCompany ? C.green : post.color, background: post.isCompany ? 'rgba(94,170,126,0.18)' : `${post.color}18`, padding:'0.2rem 0.5rem', borderRadius:6, border:`1px solid ${post.isCompany ? 'rgba(94,170,126,0.3)' : `${post.color}33`}` }}>{post.tag}</div>
        {post.isCompany && (
          <div style={{ position:'absolute', top:10, left:10, display:'flex', alignItems:'center', gap:'0.3rem', background:'rgba(94,170,126,0.85)', padding:'0.2rem 0.5rem', borderRadius:6, backdropFilter:'blur(4px)' }}>
            <BadgeCheck size={11} color="#fff" />
            <span style={{ fontFamily:D.body, fontSize:'0.6rem', fontWeight:700, color:'#fff' }}>Verified</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding:'1.1rem', display:'flex', flexDirection:'column', flex:1, gap:'0.6rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
          <div style={{ width:28, height:28, borderRadius:'50%', background:post.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.75rem', color:'#fff', flexShrink:0 }}>{post.avatar}</div>
          <span style={{ fontFamily:D.body, fontSize:'0.82rem', fontWeight:600, color:C.text, flex:1 }}>{post.user}</span>
          <span style={{ fontFamily:D.body, fontSize:'0.68rem', color:C.textMuted }}>{post.time}</span>
        </div>
        <div style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:700, color:C.text, lineHeight:1.25 }}>{post.title}</div>
        <p style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textMuted, lineHeight:1.5, flex:1 }}>{post.desc}</p>
        <div style={{ display:'flex', gap:'0.4rem', paddingTop:'0.75rem', borderTop:`1px solid ${C.border}` }}>
          <button onClick={e => { e.stopPropagation(); setLiked(l=>!l) }}
            style={{ display:'flex', alignItems:'center', gap:'0.35rem', padding:'0.3rem 0.65rem', borderRadius:8, background: liked ? 'rgba(239,68,68,0.1)' : 'transparent', border:`1px solid ${liked ? 'rgba(239,68,68,0.25)' : 'transparent'}`, cursor:'pointer', fontFamily:D.body, fontSize:'0.78rem', fontWeight:600, color: liked ? '#ef4444' : C.textMuted, transition:'all 0.2s' }}>
            <Heart size={13} fill={liked ? '#ef4444' : 'none'} color={liked ? '#ef4444' : C.textMuted} />
            {post.likes + (liked ? 1 : 0)}
          </button>
          <button style={{ display:'flex', alignItems:'center', gap:'0.35rem', padding:'0.3rem 0.65rem', borderRadius:8, background:'transparent', border:'none', cursor:'pointer', fontFamily:D.body, fontSize:'0.78rem', fontWeight:600, color:C.textMuted }}>
            <MessageCircle size={13} />{post.comments}
          </button>
          <button onClick={e => { e.stopPropagation(); setSaved(s=>!s) }}
            style={{ marginLeft:'auto', display:'flex', alignItems:'center', padding:'0.3rem 0.5rem', borderRadius:8, background:'transparent', border:'none', cursor:'pointer', color: saved ? C.amber : C.textMuted, transition:'color 0.2s' }}>
            <Bookmark size={13} fill={saved ? C.amber : 'none'} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PostsSection() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [detailPost,   setDetailPost]   = useState(null)

  const getFiltered = () => {
    let base = ALL_POSTS
    if (activeFilter === 'Companies') return COMPANY_POSTS
    if (activeFilter === 'Users')     return USER_POSTS
    if (activeFilter === 'All')       return ALL_POSTS
    return ALL_POSTS.filter(p => p.tag.toLowerCase().includes(activeFilter.toLowerCase().split(' ')[0].toLowerCase()))
  }
  const filtered = getFiltered()

  return (
    <div style={{ padding:'2rem' }}>
      {/* Header */}
      <div style={{ marginBottom:'1.5rem' }}>
        <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:C.coral, marginBottom:'0.4rem' }}>Community</div>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <h2 style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:700, color:C.text, lineHeight:1 }}>Posts</h2>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display:'flex', gap:'0.25rem', flexWrap:'wrap', background:C.surface, padding:'0.3rem', borderRadius:12, marginBottom:'1.5rem', width:'fit-content' }}>
        {FILTERS.map(f => (
          <button key={f} onClick={() => setActiveFilter(f)}
            style={{ fontFamily:D.body, fontSize:'0.82rem', fontWeight:600, padding:'0.5rem 1rem', borderRadius:9, background: activeFilter===f ? C.coral : 'transparent', color: activeFilter===f ? '#fff' : C.textMuted, border:'none', cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap' }}>
            {f}
          </button>
        ))}
      </div>

      {/* ── When "All": show company section first, then user section ── */}
      {activeFilter === 'All' ? (
        <>
          {/* Company posts */}
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.85rem' }}>
            <BadgeCheck size={14} color={C.green} />
            <span style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.green }}>Verified Companies</span>
            <div style={{ flex:1, height:1, background:`${C.green}22` }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem', marginBottom:'2.5rem' }}>
            {COMPANY_POSTS.map(post => (
              <PostCard key={post.id} post={post} onClick={() => setDetailPost(post)} />
            ))}
          </div>

          {/* User posts */}
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.85rem' }}>
            <span style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.textMuted }}>Community Posts</span>
            <div style={{ flex:1, height:1, background:C.border }} />
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem' }}>
            {USER_POSTS.map(post => (
              <PostCard key={post.id} post={post} onClick={() => setDetailPost(post)} />
            ))}
          </div>
        </>
      ) : (
        /* Single filtered grid for all other filters */
        <>
          {activeFilter === 'Companies' && (
            <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.85rem' }}>
              <BadgeCheck size={14} color={C.green} />
              <span style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.green }}>Verified Companies</span>
              <div style={{ flex:1, height:1, background:`${C.green}22` }} />
            </div>
          )}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem' }}>
            {filtered.map(post => (
              <PostCard key={post.id} post={post} onClick={() => setDetailPost(post)} />
            ))}
          </div>
        </>
      )}

      {detailPost && <PostDetailModal post={detailPost} onClose={() => setDetailPost(null)} />}
    </div>
  )
}
