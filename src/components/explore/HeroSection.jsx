import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
  Wrench, Camera, Flag, BookOpen, ShoppingBag, Settings,
  ChevronRight, Star, Shield, TrendingUp, Users, Zap,
} from 'lucide-react'

/* ── Colour system — matches the rest of the app ─────────── */
const C = {
  bg:      '#1f2230',
  surface: '#2a2f40',
  surface2:'#353b50',
  coral:   '#EF8354',
  coralDim:'#d96a3a',
  amber:   '#f5a623',
  green:   '#5eaa7e',
  text:    '#EDEEF0',
  textSoft:'#BFC0C0',
  muted:   '#8b90a0',
  border:  'rgba(191,192,192,0.12)',
}
const D = {
  display: "'Space Grotesk', sans-serif",
  body:    "'Inter', sans-serif",
  headline:"'Barlow Condensed', sans-serif",
}

const TICKER_ITEMS = [
  'Virtual Garage', 'Transformation Timelines', 'Parts Marketplace',
  'Live Motorsport Feeds', 'Car Spotting', 'Crew & Clubs',
  'Reels', 'Insurance Portal', 'PDI Checklists', 'Knowledge Hub',
]

const FEATURES = [
  { Icon: Wrench,      n:'01', name:'Virtual Garage',  desc:'Vehicle-centric profiles with transformation timelines, mod lists, and achievement badges. Each machine gets its own story.' },
  { Icon: Camera,      n:'02', name:'Social Feed',     desc:'Posts, Reels, car spotting, wallpapers. Verified brand posts alongside real street content from the community.' },
  { Icon: Flag,        n:'03', name:'Motorsport',      desc:'Live F1, MotoGP and racing feeds with real-time community chat. Feel every lap with your crew.' },
  { Icon: BookOpen,    n:'04', name:'Knowledge Hub',   desc:'Full spec database on every car and bike. Parts directories, maintenance guides, and daily news.' },
  { Icon: ShoppingBag, n:'05', name:'Marketplace',     desc:'Buy and sell complete vehicles or individual parts. Community-trusted listings with verified sellers.' },
  { Icon: Settings,    n:'06', name:'Services',        desc:'Insurance portal, PDI checklists, and a directory of verified custom mod makers near you.' },
]

const MARKET_ITEMS = [
  { img:'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400&q=75', name:'Honda Civic Type R', price:'₹18.5L', tag:'Complete Vehicle · 2017' },
  { img:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=400&q=75', name:'Turbocharger — GT3582', price:'₹62,000', tag:'Engine Parts · Used' },
  { img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75', name:'Kawasaki Z900 RS', price:'₹9.1L', tag:'Motorcycle · 2021' },
  { img:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&q=75', name:'K&N Cold Air Intake', price:'₹4,200', tag:'Intake System · New' },
]

const COMMUNITY_CARDS = [
  { Icon: Star,        name:'Meetups & Events',  desc:'Interactive calendar for local meets, group rides, and track days in your city.', wide:false },
  { Icon: Users,       name:'Crews & Clubs',     desc:'Create or join a local automotive club with private chats and organised rides.', wide:false },
  { Icon: Zap,         name:'Live Motorsport',   desc:'Real-time F1, MotoGP, and racing feeds with live community chat. Watch with your crew.', wide:true },
  { Icon: Camera,      name:'Reels',             desc:'Short-form vertical videos — exhausts, flyby clips, skill showcases, mod installs.', wide:false },
  { Icon: TrendingUp,  name:'Car Spotting',      desc:'Capture rare machines on the street. Upload wallpapers. Build the community library.', wide:false },
]

/* ── Reusable section label ─────────────────────────────── */
function Label({ children }) {
  return (
    <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.25em', textTransform:'uppercase', color:C.coral, marginBottom:'0.85rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
      <span style={{ display:'inline-block', width:20, height:2, background:C.coral, borderRadius:1 }} />
      {children}
    </div>
  )
}

/* ── Feature card ────────────────────────────────────────── */
function FeatureCard({ Icon, n, name, desc }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? C.surface : '#1a1c2a', padding:'2.5rem 2rem', position:'relative', overflow:'hidden', transition:'background 0.3s', cursor:'default', borderTop:`3px solid ${hovered ? C.coral : 'transparent'}` }}>
      <div style={{ position:'absolute', top:0, left:0, width:3, height: hovered ? '100%' : 0, background:C.coral, transition:'height 0.35s ease', display:'none' }} />
      <div style={{ fontFamily:D.headline, fontSize:'3.5rem', fontWeight:900, color: hovered ? `rgba(239,131,84,0.28)` : `rgba(239,131,84,0.1)`, lineHeight:1, marginBottom:'1.25rem', transition:'color 0.3s' }}>{n}</div>
      <div style={{ width:42, height:42, borderRadius:12, background: hovered ? 'rgba(239,131,84,0.15)' : 'rgba(191,192,192,0.06)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem', transition:'background 0.3s' }}>
        <Icon size={20} color={hovered ? C.coral : C.muted} />
      </div>
      <div style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:700, letterSpacing:'0.04em', textTransform:'uppercase', color:C.text, marginBottom:'0.6rem' }}>{name}</div>
      <p style={{ fontFamily:D.body, fontSize:'0.875rem', lineHeight:1.65, color:C.muted }}>{desc}</p>
    </div>
  )
}

/* ── Main component ─────────────────────────────────────── */
export default function HeroSection() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'Enthusiast'
  const vehicle  = user?.user_metadata?.vehicle

  return (
    <div style={{ background:C.bg, position:'relative' }}>

      {/* ══════════════════════════════════════
          HERO
      ══════════════════════════════════════ */}
      <section style={{ position:'relative', minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'flex-end', padding:'0 4rem 6rem', overflow:'hidden' }}>

        {/* Background: real car image, darkened */}
        <div style={{ position:'absolute', inset:0, zIndex:0, overflow:'hidden' }}>
          <img
            src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=1600&q=80"
            alt=""
            style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center 40%', opacity:0.18, filter:'saturate(0.6)' }}
          />
          {/* Layered gradient over the photo */}
          <div style={{ position:'absolute', inset:0,
            background:`linear-gradient(to right, ${C.bg} 35%, rgba(31,34,48,0.7) 65%, rgba(31,34,48,0.4) 100%),
                        linear-gradient(to top, ${C.bg} 0%, transparent 55%)`
          }} />
        </div>

        {/* Animated diagonal speed lines */}
        <div style={{ position:'absolute', top:0, right:0, width:'55%', height:'100%', overflow:'hidden', zIndex:0 }}>
          <div style={{
            position:'absolute', top:'-20%', right:'-10%', width:'200%', height:'200%',
            background:'repeating-linear-gradient(-22deg, transparent 0px, transparent 60px, rgba(239,131,84,0.035) 60px, rgba(239,131,84,0.035) 61px)',
            animation:'speedLines 10s linear infinite',
          }} />
        </div>

        {/* Decorative corner frame — right side */}
        <div style={{ position:'absolute', top:100, right:80, width:240, height:240, border:`1px solid rgba(239,131,84,0.14)`, zIndex:0, borderRadius:4 }} />
        <div style={{ position:'absolute', top:118, right:98, width:206, height:206, border:`1px solid rgba(239,131,84,0.07)`, zIndex:0, borderRadius:2 }} />

        {/* Stats — right column */}
        <motion.div initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.85 }}
          style={{ position:'absolute', right:'4rem', bottom:'6.5rem', display:'flex', flexDirection:'column', gap:'0.4rem', zIndex:1, alignItems:'center' }}>
          {[['50K+','Builds Listed'],['120+','Meets / Month'],['98%','Real Enthusiasts']].map(([num, label], i) => (
            <div key={label} style={{ textAlign:'center' }}>
              <div style={{ fontFamily:D.headline, fontSize:'2rem', fontWeight:900, color:C.text, lineHeight:1 }}>{num}</div>
              <div style={{ fontFamily:D.body, fontSize:'0.62rem', letterSpacing:'0.2em', textTransform:'uppercase', color:C.muted, marginTop:'0.12rem' }}>{label}</div>
              {i < 2 && <div style={{ width:1, height:28, background:`linear-gradient(to bottom, ${C.coral}, transparent)`, margin:'0.55rem auto' }} />}
            </div>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:1.3 }}
          style={{ position:'absolute', bottom:'2rem', left:'50%', transform:'translateX(-50%)', fontFamily:D.body, fontSize:'0.6rem', letterSpacing:'0.3em', textTransform:'uppercase', color:C.muted, display:'flex', flexDirection:'column', alignItems:'center', gap:'0.4rem', zIndex:1 }}>
          Scroll
          <span style={{ display:'block', width:1, height:34, background:`linear-gradient(to bottom, ${C.coral}, transparent)`, animation:'scrollPulse 2s ease-in-out infinite' }} />
        </motion.div>

        {/* ── Main copy ── */}
        <div style={{ position:'relative', zIndex:1, maxWidth:820 }}>

          {/* Welcome pill */}
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}
            style={{ display:'inline-flex', alignItems:'center', gap:'0.6rem', marginBottom:'1.5rem', padding:'0.35rem 0.85rem 0.35rem 0.5rem', background:'rgba(239,131,84,0.1)', border:`1px solid rgba(239,131,84,0.3)`, borderRadius:40, backdropFilter:'blur(6px)' }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:C.coral, display:'inline-block', boxShadow:`0 0 6px ${C.coral}` }} />
            <span style={{ fontFamily:D.body, fontSize:'0.78rem', fontWeight:600, letterSpacing:'0.08em', color:C.coral }}>
              Your Garage Is Live — Welcome Back, {username}
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.25 }}
            style={{ fontFamily:D.headline, fontSize:'clamp(5rem,13vw,11rem)', lineHeight:0.88, fontWeight:900, letterSpacing:'0.02em', color:C.text, marginBottom:0 }}>
            YOUR<br />
            MACHINE<span style={{ color:C.coral }}>.</span><br />
            <span style={{ WebkitTextStroke:`2px ${C.text}`, color:'transparent' }}>YOUR STORY</span>
          </motion.h1>

          {/* Sub-copy */}
          <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.42 }}
            style={{ fontFamily:D.body, fontSize:'clamp(0.95rem,1.8vw,1.15rem)', fontWeight:400, color:C.textSoft, maxWidth:480, lineHeight:1.65, marginTop:'1.75rem' }}>
            Not just a profile — a full garage. Showcase your build, connect with the street, buy and sell parts, and live the culture.
          </motion.p>

          {/* My ride badge */}
          {vehicle?.make && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.52 }}
              style={{ display:'inline-flex', alignItems:'center', gap:'0.75rem', marginTop:'1.25rem', padding:'0.5rem 1.1rem', background:C.surface, border:`1px solid rgba(239,131,84,0.3)`, borderRadius:8 }}>
              <span style={{ color:C.coral, fontSize:'0.68rem', fontFamily:D.body, fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase' }}>My Ride</span>
              <span style={{ width:1, height:12, background:'rgba(239,131,84,0.4)' }} />
              <span style={{ fontFamily:D.display, fontWeight:700, fontSize:'0.95rem', color:C.text }}>{vehicle.year} {vehicle.make} {vehicle.model}</span>
            </motion.div>
          )}

          {/* CTAs */}
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.62 }}
            style={{ display:'flex', gap:'1rem', marginTop:'2.25rem', alignItems:'center', flexWrap:'wrap' }}>
            <button onClick={() => navigate('/app/explore')}
              style={{ fontFamily:D.body, fontWeight:700, fontSize:'0.9rem', letterSpacing:'0.06em', background:C.coral, color:'#fff', border:'none', padding:'0.95rem 2.4rem', cursor:'pointer', borderRadius:10, display:'flex', alignItems:'center', gap:'0.5rem', boxShadow:`0 8px 28px rgba(239,131,84,0.35)`, transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background=C.coralDim; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background=C.coral;    e.currentTarget.style.transform='translateY(0)' }}>
              Claim Your Garage <ChevronRight size={16} />
            </button>
            <button onClick={() => navigate('/app/explore')}
              style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', letterSpacing:'0.04em', background:'transparent', color:C.textSoft, border:`1px solid ${C.border}`, padding:'0.95rem 1.75rem', cursor:'pointer', borderRadius:10, display:'flex', alignItems:'center', gap:'0.5rem', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(239,131,84,0.5)'; e.currentTarget.style.color=C.text }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textSoft }}>
              <span style={{ color:C.coral, fontSize:'0.8rem' }}>▶</span> See What's Inside
            </button>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          TICKER
      ══════════════════════════════════════ */}
      <div style={{ background:C.coral, overflow:'hidden', padding:'0.75rem 0', position:'relative', zIndex:1 }}>
        <div style={{ display:'flex', whiteSpace:'nowrap', animation:'ticker 24s linear infinite' }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} style={{ fontFamily:D.body, fontSize:'0.78rem', fontWeight:700, letterSpacing:'0.18em', textTransform:'uppercase', color:C.bg, padding:'0 2.25rem', display:'inline-flex', alignItems:'center', gap:'1rem' }}>
              {item} <span style={{ opacity:0.45 }}>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          FEATURES
      ══════════════════════════════════════ */}
      <section style={{ padding:'8rem 4rem', background:'#1a1c2a', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:1400, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'4rem', alignItems:'end', marginBottom:'5rem' }}>
            <div>
              <Label>Everything You Need</Label>
              <h2 style={{ fontFamily:D.headline, fontSize:'clamp(2.5rem,6vw,5rem)', lineHeight:0.92, letterSpacing:'0.03em', color:C.text }}>
                BUILT FOR<br />GEARHEADS<br />
                <span style={{ color:C.coral }}>BY GEARHEADS</span>
              </h2>
            </div>
            <p style={{ fontFamily:D.body, fontSize:'1rem', lineHeight:1.75, color:C.muted, maxWidth:480 }}>
              Six core pillars that cover everything from showcasing your build to finding the rarest OEM parts. This isn't Instagram with car filters — this is the real thing.
            </p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1px', background:`rgba(191,192,192,0.1)`, border:`1px solid rgba(191,192,192,0.1)`, borderRadius:2 }}>
            {FEATURES.map(f => <FeatureCard key={f.n} {...f} />)}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ height:1, background:`linear-gradient(to right, transparent, ${C.coral}, transparent)`, opacity:0.35, position:'relative', zIndex:1 }} />

      {/* ══════════════════════════════════════
          GARAGE MOCKUP
      ══════════════════════════════════════ */}
      <section style={{ padding:'8rem 4rem', background:C.bg, position:'relative', zIndex:1, overflow:'hidden' }}>
        {/* Soft ambient glow */}
        <div style={{ position:'absolute', top:'30%', left:'50%', width:600, height:600, borderRadius:'50%', background:`radial-gradient(circle, rgba(239,131,84,0.05) 0%, transparent 70%)`, transform:'translateX(-50%)', pointerEvents:'none' }} />

        <div style={{ maxWidth:1400, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6rem', alignItems:'center', position:'relative', zIndex:1 }}>

          {/* Mockup card */}
          <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} style={{ position:'relative' }}>
            <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderTop:`3px solid ${C.coral}`, borderRadius:16, padding:'1.5rem', boxShadow:'0 24px 64px rgba(0,0,0,0.35)' }}>
              {/* Window chrome dots */}
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.5rem', paddingBottom:'1rem', borderBottom:`1px solid ${C.border}` }}>
                <div style={{ width:8, height:8, borderRadius:'50%', background:'#ef4444' }} />
                <div style={{ width:8, height:8, borderRadius:'50%', background:C.amber }} />
                <div style={{ width:8, height:8, borderRadius:'50%', background:C.green }} />
                <span style={{ fontFamily:D.body, fontSize:'0.72rem', letterSpacing:'0.12em', textTransform:'uppercase', color:C.muted, marginLeft:'0.5rem' }}>Virtual Garage</span>
              </div>
              {/* Avatar + name */}
              <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.5rem' }}>
                <div style={{ width:50, height:50, borderRadius:'50%', background:`linear-gradient(135deg, ${C.coral}, ${C.amber})`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontSize:'1.2rem', fontWeight:700, color:C.bg, flexShrink:0 }}>
                  {username[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:700, color:C.text }}>{username}</div>
                  <div style={{ fontFamily:D.body, fontSize:'0.7rem', color:C.muted, marginTop:'0.1rem' }}>@{username.toLowerCase()} · Bengaluru, KA</div>
                  <div style={{ display:'flex', gap:'0.4rem', marginTop:'0.4rem' }}>
                    {[['✓ Verified', C.green],['★ Build King', C.amber]].map(([label, color]) => (
                      <span key={label} style={{ fontFamily:D.body, fontSize:'0.6rem', fontWeight:700, letterSpacing:'0.08em', textTransform:'uppercase', padding:'0.15rem 0.5rem', border:`1px solid ${color}55`, color, borderRadius:5 }}>{label}</span>
                    ))}
                  </div>
                </div>
              </div>
              {/* Vehicles */}
              <div style={{ fontFamily:D.body, fontSize:'0.66rem', letterSpacing:'0.18em', textTransform:'uppercase', color:C.muted, marginBottom:'0.75rem' }}>My Machines</div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.65rem' }}>
                {[
                  { model:'Honda Civic', year:'EK9 · 1998', mods:'14 Mods', color:C.coral },
                  { model:'KTM Duke',    year:'390 · 2022',  mods:'6 Mods',  color:C.amber },
                  { model:'Maruti Swift',year:'Sport · 2019',mods:'3 Mods',  color:C.green },
                ].map(({ model, year, mods, color }) => (
                  <div key={model} style={{ background:C.surface2, padding:'0.9rem 1rem', borderLeft:`2px solid ${color}`, borderRadius:8 }}>
                    <div style={{ fontFamily:D.body, fontWeight:700, color:C.text, fontSize:'0.88rem' }}>{model}</div>
                    <div style={{ fontFamily:D.body, fontSize:'0.7rem', color:C.muted, marginTop:'0.15rem' }}>{year}</div>
                    <div style={{ fontFamily:D.body, fontSize:'0.72rem', color, marginTop:'0.3rem', fontWeight:600 }}>⚡ {mods}</div>
                  </div>
                ))}
                <div style={{ padding:'0.9rem 1rem', border:`1px dashed rgba(191,192,192,0.2)`, borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', transition:'border-color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor='rgba(239,131,84,0.4)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor='rgba(191,192,192,0.2)'}>
                  <span style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.muted }}>+ Add Vehicle</span>
                </div>
              </div>
              {/* Stats */}
              <div style={{ marginTop:'1.25rem', paddingTop:'1rem', borderTop:`1px solid ${C.border}`, display:'flex', gap:'2rem' }}>
                {[['247','Followers'],['84','Posts'],['12','Badges']].map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily:D.display, fontSize:'1.25rem', fontWeight:700, color: l==='Badges' ? C.amber : C.text }}>{v}</div>
                    <div style={{ fontFamily:D.body, fontSize:'0.68rem', color:C.muted }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Corner accents */}
            <div style={{ position:'absolute', bottom:-12, right:-12, width:56, height:56, borderRight:`2px solid ${C.coral}`, borderBottom:`2px solid ${C.coral}`, zIndex:-1, borderRadius:'0 0 4px 0' }} />
            <div style={{ position:'absolute', top:-12, left:-12, width:56, height:56, borderLeft:'2px solid rgba(191,192,192,0.25)', borderTop:'2px solid rgba(191,192,192,0.25)', zIndex:-1, borderRadius:'4px 0 0 0' }} />
          </motion.div>

          {/* Copy */}
          <motion.div initial={{ opacity:0, y:40 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:0.2 }}>
            <Label>Virtual Garage</Label>
            <h2 style={{ fontFamily:D.headline, fontSize:'clamp(2.5rem,6vw,5rem)', lineHeight:0.92, letterSpacing:'0.03em', color:C.text }}>
              YOUR CARS<br />GET THEIR<br /><span style={{ color:C.coral }}>OWN STORY</span>
            </h2>
            <p style={{ fontFamily:D.body, fontSize:'1rem', lineHeight:1.75, color:C.muted, marginTop:'1.5rem' }}>
              Every vehicle you own gets a dedicated sub-profile. Track every mod, document every milestone, and build a full transformation timeline that the community can follow.
            </p>
            <ul style={{ marginTop:'2rem', listStyle:'none', display:'flex', flexDirection:'column', gap:'0.75rem' }}>
              {['Transformation timelines (Mods & General)', 'Full mod list with part specs', 'Verified ownership badges', 'Achievement & award system'].map(item => (
                <li key={item} style={{ display:'flex', alignItems:'center', gap:'0.75rem', fontFamily:D.body, fontSize:'0.95rem', fontWeight:500, color:C.textSoft }}>
                  <span style={{ width:18, height:18, borderRadius:'50%', background:'rgba(239,131,84,0.15)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <ChevronRight size={11} color={C.coral} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ height:1, background:`linear-gradient(to right, transparent, ${C.coral}, transparent)`, opacity:0.35, position:'relative', zIndex:1 }} />

      {/* ══════════════════════════════════════
          MARKETPLACE
      ══════════════════════════════════════ */}
      <section style={{ padding:'8rem 4rem', background:'#1a1c2a', position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:1400, margin:'0 auto' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2rem', alignItems:'end', marginBottom:'3.5rem' }}>
            <div>
              <Label>Buy &amp; Sell</Label>
              <h2 style={{ fontFamily:D.headline, fontSize:'clamp(2.5rem,6vw,5rem)', lineHeight:0.92, letterSpacing:'0.03em', color:C.text }}>
                THE<br /><span style={{ color:C.coral }}>STRIP</span>
              </h2>
            </div>
            <p style={{ fontFamily:D.body, fontSize:'1rem', lineHeight:1.75, color:C.muted }}>
              Cars. Parts. Everything classified by type. Community-trusted listings where sellers are as verified as the parts they're selling.
            </p>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1px', background:`rgba(191,192,192,0.1)`, borderRadius:2, overflow:'hidden' }}>
            {MARKET_ITEMS.map(({ img, name, price, tag }) => (
              <div key={name}
                style={{ background:C.surface, padding:0, cursor:'pointer', transition:'background 0.25s', overflow:'hidden', position:'relative' }}
                onMouseEnter={e => e.currentTarget.style.background=C.surface2}
                onMouseLeave={e => e.currentTarget.style.background=C.surface}>
                {/* Real car photo */}
                <div style={{ height:160, overflow:'hidden', position:'relative' }}>
                  <img src={img} alt={name} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s' }}
                    onMouseEnter={e => e.currentTarget.style.transform='scale(1.06)'}
                    onMouseLeave={e => e.currentTarget.style.transform='scale(1)'} />
                  <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(42,47,64,0.9) 0%, transparent 55%)' }} />
                </div>
                {/* Info */}
                <div style={{ padding:'1.1rem 1.25rem', borderTop:`2px solid transparent`, transition:'border-color 0.25s' }}
                  onMouseEnter={e => e.currentTarget.style.borderTopColor=C.coral}
                  onMouseLeave={e => e.currentTarget.style.borderTopColor='transparent'}>
                  <div style={{ fontFamily:D.body, fontSize:'0.92rem', fontWeight:700, color:C.text, marginBottom:'0.3rem' }}>{name}</div>
                  <div style={{ fontFamily:D.headline, fontSize:'1.5rem', fontWeight:900, color:C.coral, marginBottom:'0.25rem' }}>{price}</div>
                  <div style={{ fontFamily:D.body, fontSize:'0.7rem', letterSpacing:'0.1em', textTransform:'uppercase', color:C.muted }}>{tag}</div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign:'center', marginTop:'2.5rem' }}>
            <button onClick={() => navigate('/app/marketplace')}
              style={{ fontFamily:D.body, fontWeight:600, fontSize:'0.88rem', letterSpacing:'0.06em', background:'transparent', color:C.text, border:`1px solid ${C.border}`, padding:'0.9rem 2.5rem', cursor:'pointer', borderRadius:10, display:'inline-flex', alignItems:'center', gap:'0.5rem', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=C.coral; e.currentTarget.style.color=C.coral }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.border;  e.currentTarget.style.color=C.text }}>
              Browse All Listings <ChevronRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div style={{ height:1, background:`linear-gradient(to right, transparent, ${C.coral}, transparent)`, opacity:0.35, position:'relative', zIndex:1 }} />

      {/* ══════════════════════════════════════
          COMMUNITY
      ══════════════════════════════════════ */}
      <section style={{ padding:'8rem 4rem', background:C.bg, position:'relative', zIndex:1 }}>
        <div style={{ maxWidth:1400, margin:'0 auto', display:'grid', gridTemplateColumns:'2fr 1fr', gap:'6rem', alignItems:'start' }}>

          {/* Cards grid */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1px', background:`rgba(191,192,192,0.1)`, borderRadius:2, overflow:'hidden' }}>
            {COMMUNITY_CARDS.map(({ Icon, name, desc, wide }) => (
              <div key={name}
                style={{ background:C.surface, padding:'2rem 1.75rem', gridColumn: wide ? 'span 2' : 'span 1', borderTop:'2px solid transparent', transition:'all 0.25s', cursor:'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderTopColor=C.coral; e.currentTarget.style.background=C.surface2 }}
                onMouseLeave={e => { e.currentTarget.style.borderTopColor='transparent'; e.currentTarget.style.background=C.surface }}>
                <div style={{ width:40, height:40, borderRadius:11, background:'rgba(239,131,84,0.1)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:'1rem' }}>
                  <Icon size={18} color={C.coral} />
                </div>
                <div style={{ fontFamily:D.body, fontSize:'0.95rem', fontWeight:700, color:C.text, marginBottom:'0.5rem' }}>{name}</div>
                <p style={{ fontFamily:D.body, fontSize:'0.85rem', lineHeight:1.65, color:C.muted }}>{desc}</p>
              </div>
            ))}
          </div>

          {/* Copy */}
          <motion.div initial={{ opacity:0, x:30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}>
            <Label>Community</Label>
            <h2 style={{ fontFamily:D.headline, fontSize:'clamp(2.5rem,6vw,5rem)', lineHeight:0.92, letterSpacing:'0.03em', color:C.text }}>
              THE<br />SCENE<br /><span style={{ color:C.coral }}>IS HERE</span>
            </h2>
            <p style={{ fontFamily:D.body, fontSize:'1rem', lineHeight:1.75, color:C.muted, marginTop:'1.5rem' }}>
              Online or offline. Digital or tarmac. Find your crew, organise the meet, and chase down the perfect spot.
            </p>
            <button onClick={() => navigate('/app/community')}
              style={{ marginTop:'2rem', fontFamily:D.body, fontWeight:700, fontSize:'0.9rem', letterSpacing:'0.04em', background:C.coral, color:'#fff', border:'none', padding:'0.9rem 2rem', cursor:'pointer', borderRadius:10, display:'flex', alignItems:'center', gap:'0.5rem', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background=C.coralDim; e.currentTarget.style.transform='translateY(-2px)' }}
              onMouseLeave={e => { e.currentTarget.style.background=C.coral;    e.currentTarget.style.transform='translateY(0)' }}>
              Join The Scene <ChevronRight size={16} />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA
      ══════════════════════════════════════ */}
      <section style={{ padding:'10rem 4rem', textAlign:'center', position:'relative', overflow:'hidden', background:'#1a1c2a', zIndex:1 }}>
        {/* Ghost wordmark */}
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', fontFamily:D.headline, fontSize:'clamp(8rem,22vw,20rem)', fontWeight:900, color:'rgba(255,255,255,0.018)', whiteSpace:'nowrap', pointerEvents:'none', lineHeight:1 }}>
          TORQUEGRID
        </div>
        {/* Ambient glow */}
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:400, height:400, borderRadius:'50%', background:`radial-gradient(circle, rgba(239,131,84,0.08) 0%, transparent 70%)`, pointerEvents:'none' }} />

        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ display:'inline-flex', alignItems:'center', gap:'0.6rem', padding:'0.35rem 1rem', background:'rgba(239,131,84,0.1)', border:`1px solid rgba(239,131,84,0.3)`, borderRadius:40, marginBottom:'2rem' }}>
            <span style={{ width:7, height:7, borderRadius:'50%', background:C.coral, boxShadow:`0 0 6px ${C.coral}` }} />
            <span style={{ fontFamily:D.body, fontSize:'0.75rem', fontWeight:600, letterSpacing:'0.1em', textTransform:'uppercase', color:C.coral }}>The Garage Is Open</span>
          </div>

          <h2 style={{ fontFamily:D.headline, fontSize:'clamp(3rem,9vw,8rem)', lineHeight:0.9, fontWeight:900, color:C.text, marginBottom:'2rem' }}>
            PARK<br />YOUR<br /><span style={{ color:C.coral }}>BUILD HERE</span>
          </h2>

          <p style={{ fontFamily:D.body, fontSize:'1.1rem', color:C.muted, marginBottom:'3rem', lineHeight:1.65, maxWidth:480, margin:'0 auto 3rem' }}>
            Free to join. No algorithms hiding your content. Just the community.
          </p>

          <button onClick={() => navigate('/app/explore')}
            style={{ fontFamily:D.body, fontWeight:700, fontSize:'1rem', letterSpacing:'0.06em', background:C.coral, color:'#fff', border:'none', padding:'1.1rem 3rem', cursor:'pointer', borderRadius:12, display:'inline-flex', alignItems:'center', gap:'0.5rem', boxShadow:`0 12px 40px rgba(239,131,84,0.35)`, transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background=C.coralDim; e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 18px 50px rgba(239,131,84,0.45)` }}
            onMouseLeave={e => { e.currentTarget.style.background=C.coral;    e.currentTarget.style.transform='translateY(0)';   e.currentTarget.style.boxShadow=`0 12px 40px rgba(239,131,84,0.35)` }}>
            Create Your Garage — Free <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer style={{ background:C.surface, borderTop:`1px solid ${C.border}`, padding:'2.5rem 4rem', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:'1rem', position:'relative', zIndex:1 }}>
        <div style={{ fontFamily:D.headline, fontSize:'1.8rem', fontWeight:900, letterSpacing:'0.06em', color:C.text }}>
          TORQUE<span style={{ color:C.coral }}>GRID</span>
        </div>
        <div style={{ display:'flex', gap:'2rem' }}>
          {['explore','community','marketplace','knowledge','services'].map(l => (
            <button key={l} onClick={() => navigate(`/app/${l}`)}
              style={{ fontFamily:D.body, fontSize:'0.78rem', fontWeight:500, letterSpacing:'0.1em', textTransform:'uppercase', color:C.muted, background:'none', border:'none', cursor:'pointer', transition:'color 0.2s' }}
              onMouseEnter={e => e.target.style.color=C.text}
              onMouseLeave={e => e.target.style.color=C.muted}>
              {l}
            </button>
          ))}
        </div>
        <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:'rgba(139,144,160,0.5)' }}>© 2026 TorqueGrid. All rights reserved.</div>
      </footer>

    </div>
  )
}
