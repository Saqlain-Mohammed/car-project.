import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'

const C = { dark:'#2B2D42', light:'#EDF2F4', red:'#EF233C', black:'#1a1b26', card:'#23253a', muted:'#8D99AE' }
const D = { display:"'Barlow Condensed', sans-serif", body:"'Barlow', sans-serif" }

const FEED_POSTS = [
  { id:1, user:'TurboMike', avatar:'T', avatarColor:'#f39c12', time:'2m ago', vehicle:'Honda Civic EK9', tag:'Mod Update', content:'Finally got the K-swap done. 320hp on a stock bottom end. Car is an absolute animal on the strip now 🔥', likes:284, comments:42, image:'🚗', badge:'Build King' },
  { id:2, user:'DriftQueen', avatar:'D', avatarColor:'#27ae60', time:'15m ago', vehicle:'Nissan 180SX', tag:'Car Spotting', content:'Spotted this S13 at the Bangalore meet last night. Absolutely mint condition. Owner spent 3 years on this build 👀', likes:512, comments:89, image:'📸', badge:'Spotter' },
  { id:3, user:'RaiderKing', avatar:'R', avatarColor:'#EF233C', time:'1h ago', vehicle:'KTM Duke 390', tag:'Track Day', content:'CEAT track day at Kari Motor Speedway. Best lap: 1:42.3. Still chasing the 1:40 barrier. Who else was there?', likes:193, comments:31, image:'🏁', badge:'Track Rat' },
  { id:4, user:'ZeroShift', avatar:'Z', avatarColor:'#3b82f6', time:'3h ago', vehicle:'Maruti Swift Sport', tag:'Mod Reveal', content:'Stage 2 ECU tune + full exhaust done. Gained 28hp over stock. The sound alone is worth every rupee 🔊', likes:367, comments:54, image:'⚙️', badge:'Tuner' },
  { id:5, user:'NightRider', avatar:'N', avatarColor:'#a855f7', time:'5h ago', vehicle:'Royal Enfield Interceptor', tag:'Road Trip', content:'Coorg to Ooty in one day. 280km of pure mountain roads. The Interceptor just eats this stuff for breakfast ☕', likes:741, comments:103, image:'🛣️', badge:'Road Warrior' },
]

const TRENDING_TAGS = ['#KSwap','#TrackDay','#JDM','#MotoGP2026','#DriftLife','#ModReveal','#BangaloreMeet','#Interceptor']

const EVENTS = [
  { title:'Bangalore Meet', date:'Jun 7', spots:'12 spots left', color:'#EF233C' },
  { title:'KTM Track Day', date:'Jun 14', spots:'4 spots left', color:'#f39c12' },
  { title:'JDM Concours', date:'Jun 21', spots:'Open', color:'#27ae60' },
]

function PostCard({ post }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes)
  return (
    <div style={{ background:C.card, border:'1px solid rgba(141,153,174,0.1)', borderTop:'3px solid transparent', marginBottom:'1px', transition:'border-top-color 0.3s', padding:'1.5rem' }}
      onMouseEnter={e => e.currentTarget.style.borderTopColor = C.red}
      onMouseLeave={e => e.currentTarget.style.borderTopColor = 'transparent'}>
      <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
        <div style={{ width:42, height:42, borderRadius:'50%', background:post.avatarColor, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:900, fontSize:'1.1rem', color:'#fff', flexShrink:0 }}>{post.avatar}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
            <span style={{ fontFamily:D.display, fontWeight:700, fontSize:'1rem', color:C.light }}>{post.user}</span>
            <span style={{ fontFamily:D.display, fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.1rem 0.4rem', border:`1px solid ${post.avatarColor}`, color:post.avatarColor }}>{post.badge}</span>
          </div>
          <div style={{ display:'flex', gap:'0.75rem', alignItems:'center', marginTop:'0.15rem' }}>
            <span style={{ fontFamily:D.display, fontSize:'0.75rem', color:C.red }}>{post.vehicle}</span>
            <span style={{ width:3, height:3, borderRadius:'50%', background:C.muted, display:'inline-block' }} />
            <span style={{ fontFamily:D.display, fontSize:'0.72rem', color:C.muted }}>{post.time}</span>
          </div>
        </div>
        <span style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.2em', textTransform:'uppercase', padding:'0.25rem 0.6rem', background:'rgba(239,35,60,0.1)', color:C.red, border:'1px solid rgba(239,35,60,0.2)' }}>{post.tag}</span>
      </div>
      <p style={{ fontFamily:D.body, fontSize:'0.95rem', lineHeight:1.6, color:C.light, marginBottom:'1.2rem' }}>{post.content}</p>
      <div style={{ height:180, background:'rgba(141,153,174,0.06)', border:'1px solid rgba(141,153,174,0.1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem', marginBottom:'1.2rem' }}>{post.image}</div>
      <div style={{ display:'flex', gap:'1.5rem', alignItems:'center' }}>
        <button onClick={() => { setLiked(!liked); setLikes(l => liked ? l-1 : l+1) }}
          style={{ display:'flex', alignItems:'center', gap:'0.4rem', background:'none', border:'none', cursor:'pointer', fontFamily:D.display, fontSize:'0.85rem', fontWeight:700, color: liked ? C.red : C.muted }}>
          {liked ? '❤️' : '🤍'} {likes}
        </button>
        <button style={{ display:'flex', alignItems:'center', gap:'0.4rem', background:'none', border:'none', cursor:'pointer', fontFamily:D.display, fontSize:'0.85rem', fontWeight:700, color:C.muted }}>💬 {post.comments}</button>
        <button style={{ display:'flex', alignItems:'center', gap:'0.4rem', background:'none', border:'none', cursor:'pointer', fontFamily:D.display, fontSize:'0.85rem', fontWeight:700, color:C.muted }}>↗ Share</button>
        <button style={{ marginLeft:'auto', background:'none', border:'none', cursor:'pointer', fontFamily:D.display, fontSize:'0.85rem', fontWeight:700, color:C.muted }}>··· Save</button>
      </div>
    </div>
  )
}

export default function OverviewFeed() {
  const { user } = useAuth()
  const [postText, setPostText] = useState('')
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 300px' }}>
      <div style={{ borderRight:'1px solid rgba(141,153,174,0.1)', padding:'1.5rem' }}>
        {/* Composer */}
        <div style={{ background:C.card, border:'1px solid rgba(141,153,174,0.12)', padding:'1.2rem', marginBottom:'1.5rem' }}>
          <div style={{ display:'flex', gap:'0.75rem', alignItems:'flex-start' }}>
            <div style={{ width:38, height:38, borderRadius:'50%', background:`linear-gradient(135deg, #EF233C, #f39c12)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:900, fontSize:'1rem', color:C.dark, flexShrink:0 }}>
              {user?.user_metadata?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex:1 }}>
              <textarea value={postText} onChange={e => setPostText(e.target.value)} placeholder="What's happening in your garage?"
                style={{ width:'100%', background:'rgba(141,153,174,0.06)', border:'1px solid rgba(141,153,174,0.15)', padding:'0.75rem', color:C.light, fontFamily:D.body, fontSize:'0.9rem', resize:'none', outline:'none', minHeight:72, lineHeight:1.5 }}
                onFocus={e => e.target.style.borderColor = C.red}
                onBlur={e => e.target.style.borderColor = 'rgba(141,153,174,0.15)'} />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'0.75rem' }}>
                <div style={{ display:'flex', gap:'1rem' }}>
                  {['📸 Photo','🎥 Reel','📍 Location','🔧 Mod Tag'].map(a => (
                    <button key={a} style={{ background:'none', border:'none', cursor:'pointer', fontFamily:D.display, fontSize:'0.78rem', fontWeight:600, color:C.muted }}
                      onMouseEnter={e => e.target.style.color = C.light} onMouseLeave={e => e.target.style.color = C.muted}>{a}</button>
                  ))}
                </div>
                <button style={{ background:C.red, border:'none', padding:'0.5rem 1.4rem', cursor:'pointer', fontFamily:D.display, fontWeight:800, fontSize:'0.82rem', letterSpacing:'0.1em', textTransform:'uppercase', color:C.light }}>Post</button>
              </div>
            </div>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display:'flex', borderBottom:'1px solid rgba(141,153,174,0.1)', marginBottom:'1px' }}>
          {['For You','Following','Trending','Builds','Motorsport'].map((tab, i) => (
            <button key={tab} style={{ fontFamily:D.display, fontSize:'0.82rem', fontWeight:700, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.6rem 1.1rem', background:'none', border:'none', cursor:'pointer', color: i===0 ? C.light : C.muted, borderBottom: i===0 ? `2px solid ${C.red}` : '2px solid transparent' }}>
              {tab}
            </button>
          ))}
        </div>
        {FEED_POSTS.map(post => <PostCard key={post.id} post={post} />)}
      </div>

      {/* Right panel */}
      <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
        <div style={{ background:C.card, border:'1px solid rgba(141,153,174,0.12)', padding:'0.6rem 1rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
          <span style={{ color:C.muted }}>🔍</span>
          <input placeholder="Search builds, users, cars..." style={{ background:'none', border:'none', outline:'none', fontFamily:D.body, fontSize:'0.85rem', color:C.light, flex:1 }} />
        </div>
        <div style={{ background:C.card, border:'1px solid rgba(141,153,174,0.12)', padding:'1.2rem' }}>
          <div style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:C.muted, marginBottom:'1rem' }}>Trending Tags</div>
          {TRENDING_TAGS.map((tag, i) => (
            <div key={tag} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.5rem 0', borderBottom: i < TRENDING_TAGS.length-1 ? '1px solid rgba(141,153,174,0.08)' : 'none', cursor:'pointer' }}>
              <span style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.9rem', color:C.light }}>{tag}</span>
              <span style={{ fontFamily:D.display, fontSize:'0.7rem', color:C.muted }}>{Math.floor(Math.random()*900+100)} posts</span>
            </div>
          ))}
        </div>
        <div style={{ background:C.card, border:'1px solid rgba(141,153,174,0.12)', padding:'1.2rem' }}>
          <div style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:C.muted, marginBottom:'1rem' }}>Upcoming Near You</div>
          {EVENTS.map(({ title, date, spots, color }) => (
            <div key={title} style={{ display:'flex', gap:'0.75rem', alignItems:'center', padding:'0.65rem 0', borderBottom:'1px solid rgba(141,153,174,0.08)', cursor:'pointer' }}>
              <div style={{ width:38, height:38, background:`${color}22`, border:`1px solid ${color}44`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontFamily:D.display, fontWeight:900, fontSize:'0.65rem', color, textAlign:'center', lineHeight:1.2 }}>{date}</span>
              </div>
              <div>
                <div style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.9rem', color:C.light }}>{title}</div>
                <div style={{ fontFamily:D.display, fontSize:'0.7rem', color, marginTop:'0.1rem' }}>{spots}</div>
              </div>
            </div>
          ))}
        </div>
        <div style={{ background:C.card, border:'1px solid rgba(141,153,174,0.12)', padding:'1.2rem' }}>
          <div style={{ fontFamily:D.display, fontSize:'0.65rem', fontWeight:700, letterSpacing:'0.3em', textTransform:'uppercase', color:C.muted, marginBottom:'1rem' }}>Who To Follow</div>
          {[
            { name:'RaiderKing', vehicle:'Nissan GTR R35', avatar:'R', color:'#EF233C' },
            { name:'LapQueenKL', vehicle:'Honda Type R FK8', avatar:'L', color:'#a855f7' },
            { name:'GarageGuru', vehicle:'Toyota Supra A80', avatar:'G', color:'#27ae60' },
          ].map(({ name, vehicle, avatar, color }) => (
            <div key={name} style={{ display:'flex', alignItems:'center', gap:'0.6rem', marginBottom:'0.9rem' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:900, fontSize:'0.9rem', color:'#fff', flexShrink:0 }}>{avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.88rem', color:C.light }}>{name}</div>
                <div style={{ fontFamily:D.display, fontSize:'0.68rem', color:C.muted }}>{vehicle}</div>
              </div>
              <button style={{ background:'none', border:`1px solid ${C.red}`, padding:'0.2rem 0.7rem', cursor:'pointer', fontFamily:D.display, fontWeight:700, fontSize:'0.7rem', color:C.red }}
                onMouseEnter={e => { e.currentTarget.style.background=C.red; e.currentTarget.style.color=C.light }}
                onMouseLeave={e => { e.currentTarget.style.background='none'; e.currentTarget.style.color=C.red }}>Follow</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}