import { useState } from 'react'
import { useAuth } from '../../../context/AuthContext'

const C = {
  bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50',
  coral:'#EF8354', coralDim:'#d96a3a',
  text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0',
  border:'rgba(191,192,192,0.12)', green:'#5eaa7e', amber:'#f5a623',
}
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const FEED_POSTS = [
  { id:1, user:'TurboMike', avatar:'T', avatarColor:'#f39c12', time:'2m ago', vehicle:'Honda Civic EK9', tag:'Mod Update', content:'Finally got the K-swap done. 320hp on a stock bottom end. Car is an absolute animal on the strip now 🔥 Three years of work, blood, sweat and a lot of rupees — worth every penny.', likes:284, comments:42, image:'🚗', badge:'Build King' },
  { id:2, user:'DriftQueen', avatar:'D', avatarColor:'#5eaa7e', time:'15m ago', vehicle:'Nissan 180SX', tag:'Car Spotting', content:'Spotted this S13 at the Bangalore meet last night. Absolutely mint condition. Owner spent 3 years on this build 👀 Hands down the cleanest build in the city right now.', likes:512, comments:89, image:'📸', badge:'Spotter' },
  { id:3, user:'RaiderKing', avatar:'R', avatarColor:'#EF8354', time:'1h ago', vehicle:'KTM Duke 390', tag:'Track Day', content:'CEAT track day at Kari Motor Speedway. Best lap: 1:42.3. Still chasing the 1:40 barrier. Who else was there? The conditions were perfect — dry line all morning.', likes:193, comments:31, image:'🏁', badge:'Track Rat' },
  { id:4, user:'NightRider', avatar:'N', avatarColor:'#a855f7', time:'5h ago', vehicle:'Royal Enfield Interceptor', tag:'Road Trip', content:'Coorg to Ooty in one day. 280km of pure mountain roads. The Interceptor just eats this stuff for breakfast ☕ Photos incoming.', likes:741, comments:103, image:'🛣️', badge:'Road Warrior' },
]

const TRENDING = ['#KSwap','#TrackDay','#JDM','#MotoGP2026','#DriftLife','#ModReveal','#BangaloreMeet']

const EVENTS = [
  { title:'Bangalore JDM Meet', date:'Jun 7', spots:'12 spots', color:'#EF8354' },
  { title:'KTM Track Day', date:'Jun 14', spots:'4 spots', color:'#f5a623' },
  { title:'JDM Concours', date:'Jun 21', spots:'Open', color:'#5eaa7e' },
]

const SUGGEST = [
  { name:'RaiderKing', vehicle:'Nissan GTR R35', avatar:'R', color:'#EF8354', followers:'1.2K' },
  { name:'LapQueenKL', vehicle:'Honda Type R FK8', avatar:'L', color:'#a855f7', followers:'847' },
  { name:'GarageGuru', vehicle:'Toyota Supra A80', avatar:'G', color:'#5eaa7e', followers:'2.4K' },
]

function PostCard({ post }) {
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(post.likes)

  return (
    <div style={{ background:C.surface, borderRadius:16, overflow:'hidden', border:`1px solid ${C.border}`, marginBottom:'1rem', transition:'border-color 0.2s' }}
      onMouseEnter={e => e.currentTarget.style.borderColor='rgba(239,131,84,0.25)'}
      onMouseLeave={e => e.currentTarget.style.borderColor=C.border}>
      <div style={{ padding:'1.25rem 1.25rem 0', display:'flex', alignItems:'center', gap:'0.85rem' }}>
        <div style={{ width:44, height:44, borderRadius:'50%', background:post.avatarColor, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'1.1rem', color:'#fff', flexShrink:0 }}>{post.avatar}</div>
        <div style={{ flex:1 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', flexWrap:'wrap' }}>
            <span style={{ fontFamily:D.body, fontSize:'0.95rem', fontWeight:700, color:C.text }}>{post.user}</span>
            <span style={{ fontFamily:D.body, fontSize:'0.65rem', fontWeight:600, color:post.avatarColor, background:`${post.avatarColor}18`, padding:'0.1rem 0.5rem', borderRadius:5, border:`1px solid ${post.avatarColor}33` }}>{post.badge}</span>
          </div>
          <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', marginTop:'0.15rem' }}>
            <span style={{ fontFamily:D.body, fontSize:'0.78rem', fontWeight:500, color:C.coral }}>{post.vehicle}</span>
            <span style={{ width:3, height:3, borderRadius:'50%', background:C.textMuted, display:'inline-block' }} />
            <span style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.textMuted }}>{post.time}</span>
          </div>
        </div>
        <span style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', padding:'0.3rem 0.75rem', background:'rgba(239,131,84,0.1)', color:C.coral, border:'1px solid rgba(239,131,84,0.25)', borderRadius:8 }}>{post.tag}</span>
      </div>

      <div style={{ padding:'1rem 1.25rem' }}>
        <p style={{ fontFamily:D.body, fontSize:'0.92rem', lineHeight:1.65, color:C.text }}>{post.content}</p>
      </div>

      <div style={{ margin:'0 1.25rem', height:220, background:`linear-gradient(135deg, rgba(239,131,84,0.08), rgba(79,93,117,0.08))`, borderRadius:12, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'4rem', border:`1px solid ${C.border}` }}>
        {post.image}
      </div>

      <div style={{ padding:'0.85rem 1.25rem', display:'flex', gap:'0.5rem', alignItems:'center', borderTop:`1px solid ${C.border}`, marginTop:'1rem' }}>
        <button onClick={() => { setLiked(!liked); setLikes(l => liked ? l-1 : l+1) }}
          style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.5rem 0.85rem', borderRadius:9, background: liked ? 'rgba(239,131,84,0.12)' : 'transparent', border:`1px solid ${liked ? 'rgba(239,131,84,0.3)' : 'transparent'}`, cursor:'pointer', fontFamily:D.body, fontSize:'0.85rem', fontWeight:600, color: liked ? C.coral : C.textMuted, transition:'all 0.2s' }}>
          {liked ? '❤️' : '🤍'} {likes}
        </button>
        {['💬 '+post.comments,'↗ Share','🔖 Save'].map((label, i) => (
          <button key={label}
            style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.5rem 0.85rem', borderRadius:9, background:'transparent', border:'1px solid transparent', cursor:'pointer', fontFamily:D.body, fontSize:'0.85rem', fontWeight:600, color:C.textMuted, marginLeft: i === 2 ? 'auto' : 0, transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(191,192,192,0.06)'; e.currentTarget.style.color=C.text }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=C.textMuted }}>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function OverviewFeed() {
  const { user } = useAuth()
  const [postText, setPostText] = useState('')
  const [activeTab, setActiveTab] = useState('For You')

  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 300px', minHeight:'100%' }}>
      <div style={{ padding:'1.75rem', borderRight:`1px solid ${C.border}` }}>
        <div style={{ background:C.surface, borderRadius:16, padding:'1.25rem', marginBottom:'1.5rem', border:`1px solid ${C.border}` }}>
          <div style={{ display:'flex', gap:'0.85rem', alignItems:'flex-start' }}>
            <div style={{ width:40, height:40, borderRadius:'50%', background:`linear-gradient(135deg, ${C.coral}, #f39c12)`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'1rem', color:'#1f2230', flexShrink:0 }}>
              {user?.user_metadata?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ flex:1 }}>
              <textarea value={postText} onChange={e => setPostText(e.target.value)}
                placeholder="What's happening in your garage?"
                style={{ width:'100%', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:12, padding:'0.85rem 1rem', color:C.text, fontFamily:D.body, fontSize:'0.9rem', resize:'none', outline:'none', minHeight:80, lineHeight:1.6 }}
                onFocus={e => e.target.style.borderColor='rgba(239,131,84,0.5)'}
                onBlur={e => e.target.style.borderColor=C.border} />
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:'0.85rem' }}>
                <div style={{ display:'flex', gap:'0.25rem' }}>
                  {[['📸','Photo'],['🎥','Reel'],['📍','Location'],['🔧','Tag']].map(([em, label]) => (
                    <button key={label} style={{ display:'flex', alignItems:'center', gap:'0.3rem', padding:'0.4rem 0.75rem', background:'transparent', border:`1px solid ${C.border}`, borderRadius:8, cursor:'pointer', fontFamily:D.body, fontSize:'0.78rem', fontWeight:500, color:C.textMuted, transition:'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background=C.surface2; e.currentTarget.style.color=C.text; e.currentTarget.style.borderColor=C.coral }}
                      onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=C.textMuted; e.currentTarget.style.borderColor=C.border }}>
                      {em} {label}
                    </button>
                  ))}
                </div>
                <button style={{ background:C.coral, border:'none', borderRadius:9, padding:'0.5rem 1.4rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.85rem', color:'#fff', transition:'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
                  onMouseLeave={e => e.currentTarget.style.background=C.coral}>
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display:'inline-flex', gap:'0.25rem', background:C.surface, padding:'0.3rem', borderRadius:12, marginBottom:'1.5rem' }}>
          {['For You','Following','Trending','Builds','Motorsport'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              style={{ fontFamily:D.body, fontSize:'0.82rem', fontWeight:600, padding:'0.5rem 1rem', borderRadius:9, background: activeTab===tab ? C.coral : 'transparent', color: activeTab===tab ? '#fff' : C.textMuted, border:'none', cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap' }}>
              {tab}
            </button>
          ))}
        </div>

        {FEED_POSTS.map(post => <PostCard key={post.id} post={post} />)}
      </div>

      <div style={{ padding:'1.75rem', display:'flex', flexDirection:'column', gap:'1.25rem' }}>
        <div style={{ display:'flex', alignItems:'center', gap:'0.6rem', background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:'0.7rem 1rem' }}>
          <span style={{ color:C.textMuted }}>🔍</span>
          <input placeholder="Search builds, users..." style={{ background:'none', border:'none', outline:'none', fontFamily:D.body, fontSize:'0.85rem', color:C.text, flex:1 }} />
        </div>

        <div style={{ background:C.surface, borderRadius:16, padding:'1.25rem', border:`1px solid ${C.border}` }}>
          <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:C.textMuted, marginBottom:'1rem' }}>Trending Now</div>
          {TRENDING.map((tag, i) => (
            <div key={tag} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'0.6rem 0.75rem', borderRadius:9, cursor:'pointer', transition:'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background=C.surface2}
              onMouseLeave={e => e.currentTarget.style.background='transparent'}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
                <span style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted, width:14 }}>{i+1}</span>
                <span style={{ fontFamily:D.body, fontSize:'0.88rem', fontWeight:600, color:C.text }}>{tag}</span>
              </div>
              <span style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted }}>{Math.floor(Math.random()*900+100)} posts</span>
            </div>
          ))}
        </div>

        <div style={{ background:C.surface, borderRadius:16, padding:'1.25rem', border:`1px solid ${C.border}` }}>
          <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:C.textMuted, marginBottom:'1rem' }}>Near You</div>
          {EVENTS.map(({ title, date, spots, color }) => (
            <div key={title} style={{ display:'flex', gap:'0.85rem', alignItems:'center', padding:'0.75rem', background:C.surface2, borderRadius:12, marginBottom:'0.6rem', cursor:'pointer', border:`1px solid ${C.border}`, transition:'all 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor=`${color}44`}
              onMouseLeave={e => e.currentTarget.style.borderColor=C.border}>
              <div style={{ width:40, height:40, background:`${color}18`, border:`1px solid ${color}33`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                <span style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.65rem', color, textAlign:'center', lineHeight:1.2 }}>{date}</span>
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:D.body, fontSize:'0.85rem', fontWeight:600, color:C.text }}>{title}</div>
                <div style={{ fontFamily:D.body, fontSize:'0.72rem', color, marginTop:'0.1rem' }}>{spots} left</div>
              </div>
              <span style={{ color:C.textMuted }}>→</span>
            </div>
          ))}
        </div>

        <div style={{ background:C.surface, borderRadius:16, padding:'1.25rem', border:`1px solid ${C.border}` }}>
          <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.15em', textTransform:'uppercase', color:C.textMuted, marginBottom:'1rem' }}>Who To Follow</div>
          {SUGGEST.map(({ name, vehicle, avatar, color, followers }) => (
            <div key={name} style={{ display:'flex', alignItems:'center', gap:'0.7rem', marginBottom:'0.85rem' }}>
              <div style={{ width:38, height:38, borderRadius:'50%', background:color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.95rem', color:'#fff', flexShrink:0 }}>{avatar}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:D.body, fontSize:'0.85rem', fontWeight:600, color:C.text }}>{name}</div>
                <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted }}>{vehicle} · {followers}</div>
              </div>
              <button style={{ background:'transparent', border:`1px solid ${C.coral}`, borderRadius:8, padding:'0.3rem 0.75rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.75rem', color:C.coral, transition:'all 0.2s', whiteSpace:'nowrap' }}
                onMouseEnter={e => { e.currentTarget.style.background=C.coral; e.currentTarget.style.color='#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=C.coral }}>
                Follow
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}