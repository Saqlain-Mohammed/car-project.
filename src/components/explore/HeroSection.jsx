import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'

const C = {
  dark: '#2B2D42', steel: '#8D99AE', light: '#EDF2F4',
  red: '#EF233C', redDim: '#c01a2f', black: '#1a1b26',
  card: '#23253a', muted: '#8D99AE',
}
const D = { display: "'Barlow Condensed', sans-serif", body: "'Barlow', sans-serif" }

const TICKER_ITEMS = [
  'Virtual Garage', 'Transformation Timelines', 'Parts Marketplace',
  'Live Motorsport Feeds', 'Car Spotting', 'Crew & Clubs',
  'Reels Section', 'Insurance Portal', 'PDI Checklists', 'Knowledge Hub',
]

const FEATURES = [
  { n: '01', icon: '🔧', name: 'Virtual Garage', desc: 'Vehicle-centric profiles with transformation timelines, mod lists, and achievement badges. Each machine gets its own story.' },
  { n: '02', icon: '📸', name: 'Social Feed', desc: 'Posts, Reels, car spotting, wallpapers. Verified brand posts alongside real street content.' },
  { n: '03', icon: '🏁', name: 'Motorsport', desc: 'Live F1, MotoGP and racing feeds with real-time community chat. Feel the race with your crew.' },
  { n: '04', icon: '📚', name: 'Knowledge Hub', desc: 'Full spec database on every car and bike. Parts directories, maintenance guides, and daily news.' },
  { n: '05', icon: '🛒', name: 'Marketplace', desc: 'Buy and sell complete vehicles or individual parts. Community-trusted listings with verified sellers.' },
  { n: '06', icon: '⚙️', name: 'Services', desc: 'Insurance portal, PDI checklists, and a verified directory of custom mod makers near you.' },
]

const MARKET_ITEMS = [
  { icon: '🚗', name: 'Honda Civic Type R', price: '₹18.5L', tag: 'Complete Vehicle · 2017' },
  { icon: '🔩', name: 'Turbocharger — GT3582', price: '₹62,000', tag: 'Engine Parts · Used' },
  { icon: '🏍️', name: 'Kawasaki Z900 RS', price: '₹9.1L', tag: 'Motorcycle · 2021' },
  { icon: '💨', name: 'K&N Air Filter', price: '₹4,200', tag: 'Intake System · New' },
]

const COMMUNITY_CARDS = [
  { icon: '📅', name: 'Meetups & Events', desc: 'Interactive map and calendar for local meets, group rides, and track days in your city.' },
  { icon: '👥', name: 'Crews & Clubs', desc: 'Create or join a local automotive club with private chats and organised group rides.' },
  { icon: '🏎️', name: 'Live Motorsport', desc: 'Real-time F1, MotoGP, and racing event feeds with live community chat. Watch with your crew and react as it happens.', wide: true },
  { icon: '🎥', name: 'Reels', desc: 'Short-form vertical videos — exhausts, flyby clips, skill showcases, mod installs.' },
  { icon: '📸', name: 'Car Spotting', desc: 'Capture rare machines on the street. Upload wallpapers. Build the community image library.' },
]

function SectionLabel({ children }) {
  return (
    <div style={{ fontFamily: D.display, fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.35em', textTransform: 'uppercase', color: C.red, marginBottom: '0.8rem' }}>
      {children}
    </div>
  )
}

function SectionTitle({ children }) {
  return (
    <h2 style={{ fontFamily: D.display, fontSize: 'clamp(2.5rem,6vw,5rem)', lineHeight: 0.95, letterSpacing: '0.03em', color: C.light }}>
      {children}
    </h2>
  )
}

function FeatureCard({ n, icon, name, desc }) {
  const [hovered, setHovered] = useState(false)
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: hovered ? C.card : C.black, padding: '2.5rem 2rem', position: 'relative', overflow: 'hidden', transition: 'background 0.3s', cursor: 'default' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: 3, height: hovered ? '100%' : 0, background: C.red, transition: 'height 0.4s ease' }} />
      <div style={{ fontFamily: D.display, fontSize: '4rem', fontWeight: 900, color: hovered ? 'rgba(239,35,60,0.35)' : 'rgba(239,35,60,0.12)', lineHeight: 1, marginBottom: '1rem', transition: 'color 0.3s' }}>{n}</div>
      <div style={{ fontSize: '1.4rem', marginBottom: '0.8rem' }}>{icon}</div>
      <div style={{ fontFamily: D.display, fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.light, marginBottom: '0.6rem' }}>{name}</div>
      <p style={{ fontFamily: D.body, fontSize: '0.875rem', lineHeight: 1.6, color: C.muted }}>{desc}</p>
    </div>
  )
}

export default function HeroSection() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const username = user?.user_metadata?.username || user?.email?.split('@')[0] || 'Enthusiast'
  const vehicle = user?.user_metadata?.vehicle

  return (
    <div style={{ background: C.dark, position: 'relative' }}>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 3rem 6rem', overflow: 'hidden' }}>

        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: `radial-gradient(ellipse 60% 50% at 70% 50%, rgba(239,35,60,0.10) 0%, transparent 70%),
                       radial-gradient(ellipse 40% 60% at 20% 80%, rgba(141,153,174,0.06) 0%, transparent 60%),
                       linear-gradient(160deg, #1a1b26 0%, #2B2D42 50%, #1a1b26 100%)`
        }} />

        {/* Speed lines */}
        <div style={{ position: 'absolute', top: 0, right: 0, width: '55%', height: '100%', overflow: 'hidden', zIndex: 0 }}>
          <div style={{
            position: 'absolute', top: '-20%', right: '-10%', width: '200%', height: '200%',
            background: 'repeating-linear-gradient(-25deg, transparent 0px, transparent 60px, rgba(239,35,60,0.04) 60px, rgba(239,35,60,0.04) 61px)',
            animation: 'speedLines 8s linear infinite'
          }} />
        </div>

        {/* Corner boxes */}
        <div style={{ position: 'absolute', top: 80, right: 60, width: 260, height: 260, border: '1px solid rgba(239,35,60,0.12)', zIndex: 0 }} />
        <div style={{ position: 'absolute', top: 100, right: 80, width: 220, height: 220, border: '1px solid rgba(239,35,60,0.06)', zIndex: 0 }} />

        {/* Stats — right side */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}
          style={{ position: 'absolute', right: '3rem', bottom: '6rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', zIndex: 1, alignItems: 'center' }}>
          {[['50K+', 'Builds Listed'], ['120+', 'Meets / Month'], ['98%', 'Real Enthusiasts']].map(([num, label], i) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: D.display, fontSize: '2.2rem', fontWeight: 900, color: C.light, lineHeight: 1 }}>{num}</div>
              <div style={{ fontFamily: D.display, fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, marginTop: '0.15rem' }}>{label}</div>
              {i < 2 && <div style={{ width: 1, height: 32, background: `linear-gradient(to bottom, ${C.red}, transparent)`, margin: '0.6rem auto 0.6rem' }} />}
            </div>
          ))}
        </motion.div>

        {/* Scroll hint */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', fontFamily: D.display, fontSize: '0.62rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: C.muted, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', zIndex: 1 }}>
          Scroll
          <span style={{ display: 'block', width: 1, height: 36, background: `linear-gradient(to bottom, ${C.red}, transparent)`, animation: 'scrollPulse 2s ease-in-out infinite' }} />
        </motion.div>

        {/* Main text */}
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900 }}>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            style={{ fontFamily: D.display, fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', color: C.red, marginBottom: '1.2rem' }}>
            ● Your Garage Is Live — Welcome Back, {username}
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            style={{ fontFamily: D.display, fontSize: 'clamp(5rem,14vw,12rem)', lineHeight: 0.88, fontWeight: 900, letterSpacing: '0.02em', color: C.light }}>
            YOUR<br />
            MACHINE<span style={{ color: C.red }}>.</span><br />
            <span style={{ WebkitTextStroke: `2px ${C.light}`, color: 'transparent' }}>YOUR STORY</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            style={{ fontFamily: D.display, fontSize: 'clamp(1rem,2vw,1.25rem)', fontWeight: 400, letterSpacing: '0.04em', color: C.muted, maxWidth: 500, lineHeight: 1.6, marginTop: '2rem' }}>
            Not just a profile — a full garage. Showcase your build, connect with the street, buy and sell parts, and live the culture.
          </motion.p>

          {vehicle?.make && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem', padding: '0.5rem 1.2rem', background: 'rgba(43,45,66,0.8)', border: `1px solid rgba(239,35,60,0.3)` }}>
              <span style={{ color: C.red, fontSize: '0.7rem', fontFamily: D.display, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase' }}>My Ride</span>
              <span style={{ width: 1, height: 14, background: 'rgba(239,35,60,0.4)' }} />
              <span style={{ fontFamily: D.display, fontWeight: 700, fontSize: '1rem', color: C.light, letterSpacing: '0.05em' }}>
                {vehicle.year} {vehicle.make} {vehicle.model}
              </span>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
            style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/app/explore')}
              style={{ fontFamily: D.display, fontWeight: 800, fontSize: '0.9rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: C.red, color: C.light, border: 'none', padding: '1rem 2.5rem', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = C.redDim}
              onMouseLeave={e => e.currentTarget.style.background = C.red}>
              Claim Your Garage
            </button>
            <button onClick={() => navigate('/app/explore')}
              style={{ fontFamily: D.display, fontWeight: 700, fontSize: '0.9rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: 'transparent', color: C.light, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: 0.75 }}
              onMouseEnter={e => e.currentTarget.style.opacity = '1'}
              onMouseLeave={e => e.currentTarget.style.opacity = '0.75'}>
              <span style={{ color: C.red }}>▶</span> See What's Inside
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div style={{ background: C.red, overflow: 'hidden', padding: '0.7rem 0', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'ticker 22s linear infinite' }}>
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} style={{ fontFamily: D.display, fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: C.dark, padding: '0 2rem', display: 'inline-flex', alignItems: 'center', gap: '1rem' }}>
              {item} <span style={{ opacity: 0.5 }}>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section style={{ padding: '8rem 3rem', background: C.black, position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'end', marginBottom: '5rem' }}>
            <div>
              <SectionLabel>Everything You Need</SectionLabel>
              <SectionTitle>BUILT FOR<br />GEARHEADS<br /><span style={{ color: C.red }}>BY GEARHEADS</span></SectionTitle>
            </div>
            <p style={{ fontFamily: D.body, fontSize: '1rem', lineHeight: 1.7, color: C.muted, maxWidth: 480 }}>
              Six core pillars that cover everything from showcasing your build to finding the rarest OEM parts. This isn't Instagram with car filters — this is the real thing.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1px', background: 'rgba(141,153,174,0.15)', border: '1px solid rgba(141,153,174,0.15)' }}>
            {FEATURES.map(f => <FeatureCard key={f.n} {...f} />)}
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${C.red}, transparent)`, opacity: 0.4, position: 'relative', zIndex: 1 }} />

      {/* ── GARAGE MOCKUP ── */}
      <section style={{ padding: '8rem 3rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ position: 'relative' }}>
            <div style={{ background: C.card, border: '1px solid rgba(141,153,174,0.2)', borderTop: `3px solid ${C.red}`, padding: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(141,153,174,0.15)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: C.red }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f39c12' }} />
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#27ae60' }} />
                <span style={{ fontFamily: D.display, fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, marginLeft: '0.5rem' }}>Your Virtual Garage</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ width: 52, height: 52, borderRadius: '50%', background: `linear-gradient(135deg, ${C.red}, #f39c12)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: D.display, fontSize: '1.2rem', fontWeight: 900, color: C.dark, flexShrink: 0 }}>
                  {username[0].toUpperCase()}
                </div>
                <div>
                  <div style={{ fontFamily: D.display, fontSize: '1rem', fontWeight: 700, color: C.light }}>{username}</div>
                  <div style={{ fontFamily: D.display, fontSize: '0.7rem', color: C.muted, marginTop: '0.1rem' }}>@{username.toLowerCase()} · Bengaluru, KA</div>
                  <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem' }}>
                    {['✓ Verified', '★ Build King'].map(b => (
                      <span key={b} style={{ fontFamily: D.display, fontSize: '0.6rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', padding: '0.15rem 0.5rem', border: `1px solid ${b.includes('✓') ? C.red : '#f39c12'}`, color: b.includes('✓') ? C.red : '#f39c12' }}>{b}</span>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ fontFamily: D.display, fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: C.muted, marginBottom: '0.8rem' }}>My Machines</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                {[
                  { model: 'Honda Civic', year: 'EK9 · 1998', mods: '⚡ 14 Mods', active: true },
                  { model: 'KTM Duke', year: '390 · 2022', mods: '🔧 6 Mods', active: false },
                  { model: 'Maruti Swift', year: 'Sport · 2019', mods: '🔧 3 Mods', active: false },
                ].map(({ model, year, mods, active }) => (
                  <div key={model} style={{ background: 'rgba(141,153,174,0.1)', padding: '1rem', borderLeft: `2px solid ${active ? '#f39c12' : C.red}` }}>
                    <div style={{ fontFamily: D.display, fontWeight: 700, color: C.light, fontSize: '0.9rem' }}>{model}</div>
                    <div style={{ fontFamily: D.display, fontSize: '0.7rem', color: C.muted, marginTop: '0.2rem' }}>{year}</div>
                    <div style={{ fontFamily: D.body, fontSize: '0.75rem', color: C.steel, marginTop: '0.4rem' }}>{mods}</div>
                  </div>
                ))}
                <div style={{ padding: '1rem', border: '1px dashed rgba(141,153,174,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontFamily: D.display, fontSize: '0.75rem', color: C.muted, letterSpacing: '0.1em' }}>+ Add Vehicle</div>
                </div>
              </div>
              <div style={{ marginTop: '1.2rem', paddingTop: '1rem', borderTop: '1px solid rgba(141,153,174,0.15)', display: 'flex', gap: '2rem' }}>
                {[['247', 'Followers'], ['84', 'Posts'], ['12', 'Badges']].map(([v, l]) => (
                  <div key={l}>
                    <div style={{ fontFamily: D.display, fontSize: '1.2rem', fontWeight: 900, color: l === 'Badges' ? '#f39c12' : C.light }}>{v}</div>
                    <div style={{ fontFamily: D.display, fontSize: '0.7rem', color: C.muted }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'absolute', bottom: -12, right: -12, width: 60, height: 60, borderRight: `3px solid ${C.red}`, borderBottom: `3px solid ${C.red}`, zIndex: -1 }} />
            <div style={{ position: 'absolute', top: -12, left: -12, width: 60, height: 60, borderLeft: '3px solid rgba(141,153,174,0.3)', borderTop: '3px solid rgba(141,153,174,0.3)', zIndex: -1 }} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <SectionLabel>Virtual Garage</SectionLabel>
            <SectionTitle>YOUR CARS<br />GET THEIR<br /><span style={{ color: C.red }}>OWN STORY</span></SectionTitle>
            <p style={{ fontFamily: D.body, fontSize: '1rem', lineHeight: 1.7, color: C.muted, marginTop: '1.5rem' }}>
              Every vehicle you own gets a dedicated sub-profile. Track every mod, document every milestone, and build a full transformation timeline that the community can follow.
            </p>
            <ul style={{ marginTop: '2rem', listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {['Transformation timelines (Mods & General)', 'Full mod list with part specs', 'Verified ownership badges', 'Achievement & award system'].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontFamily: D.display, fontSize: '1rem', fontWeight: 600, color: C.light }}>
                  <span style={{ color: C.red }}>▸</span> {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${C.red}, transparent)`, opacity: 0.4, position: 'relative', zIndex: 1 }} />

      {/* ── MARKETPLACE ── */}
      <section style={{ padding: '8rem 3rem', background: C.black, position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'end', marginBottom: '3rem' }}>
            <div>
              <SectionLabel>Buy &amp; Sell</SectionLabel>
              <SectionTitle>THE<br /><span style={{ color: C.red }}>STRIP</span></SectionTitle>
            </div>
            <p style={{ fontFamily: D.body, fontSize: '1rem', lineHeight: 1.7, color: C.muted }}>
              Cars. Parts. Everything classified by type. Community-trusted listings where sellers are as verified as the parts they're selling.
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '1px', background: 'rgba(141,153,174,0.15)' }}>
            {MARKET_ITEMS.map(({ icon, name, price, tag }) => (
              <div key={name}
                style={{ background: C.card, padding: '2rem 1.5rem', borderTop: '3px solid transparent', transition: 'border-color 0.3s, background 0.3s', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderTopColor = C.red; e.currentTarget.style.background = '#2d3050' }}
                onMouseLeave={e => { e.currentTarget.style.borderTopColor = 'transparent'; e.currentTarget.style.background = C.card }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
                <div style={{ fontFamily: D.display, fontSize: '1rem', fontWeight: 700, color: C.light, marginBottom: '0.4rem' }}>{name}</div>
                <div style={{ fontFamily: D.display, fontSize: '1.5rem', fontWeight: 900, color: C.red, marginBottom: '0.4rem' }}>{price}</div>
                <div style={{ fontFamily: D.display, fontSize: '0.72rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted }}>{tag}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button onClick={() => navigate('/app/marketplace')}
              style={{ fontFamily: D.display, fontWeight: 800, fontSize: '0.88rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: 'transparent', color: C.light, border: '1px solid rgba(237,242,244,0.25)', padding: '0.9rem 2.5rem', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = C.red}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(237,242,244,0.25)'}>
              Browse All Listings →
            </button>
          </div>
        </div>
      </section>

      <div style={{ height: 1, background: `linear-gradient(to right, transparent, ${C.red}, transparent)`, opacity: 0.4, position: 'relative', zIndex: 1 }} />

      {/* ── COMMUNITY ── */}
      <section style={{ padding: '8rem 3rem', position: 'relative', zIndex: 1 }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '6rem', alignItems: 'start' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1px', background: 'rgba(141,153,174,0.15)' }}>
            {COMMUNITY_CARDS.map(({ icon, name, desc, wide }) => (
              <div key={name}
                style={{ background: C.card, padding: '2rem 1.8rem', gridColumn: wide ? 'span 2' : 'span 1', borderTop: '3px solid transparent', transition: 'border-color 0.3s' }}
                onMouseEnter={e => e.currentTarget.style.borderTopColor = C.red}
                onMouseLeave={e => e.currentTarget.style.borderTopColor = 'transparent'}>
                <div style={{ fontSize: '1.8rem', marginBottom: '0.8rem' }}>{icon}</div>
                <div style={{ fontFamily: D.display, fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: C.light, marginBottom: '0.5rem' }}>{name}</div>
                <p style={{ fontFamily: D.body, fontSize: '0.875rem', lineHeight: 1.6, color: C.muted }}>{desc}</p>
              </div>
            ))}
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <SectionLabel>Community</SectionLabel>
            <SectionTitle>THE<br />SCENE<br /><span style={{ color: C.red }}>IS HERE</span></SectionTitle>
            <p style={{ fontFamily: D.body, fontSize: '1rem', lineHeight: 1.7, color: C.muted, marginTop: '1.5rem' }}>
              Online or offline. Digital or tarmac. Find your crew, organise the meet, and chase down the perfect spot.
            </p>
            <button onClick={() => navigate('/app/community')}
              style={{ marginTop: '2rem', fontFamily: D.display, fontWeight: 800, fontSize: '0.88rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: C.red, color: C.light, border: 'none', padding: '0.9rem 2rem', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = C.redDim}
              onMouseLeave={e => e.currentTarget.style.background = C.red}>
              Join The Scene →
            </button>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '10rem 3rem', textAlign: 'center', position: 'relative', overflow: 'hidden', background: C.black, zIndex: 1 }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: D.display, fontSize: 'clamp(10rem,28vw,24rem)', color: 'rgba(255,255,255,0.02)', whiteSpace: 'nowrap', pointerEvents: 'none', lineHeight: 1, fontWeight: 900 }}>
          JOIN
        </div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontFamily: D.display, fontSize: '0.8rem', letterSpacing: '0.35em', textTransform: 'uppercase', color: C.red, marginBottom: '1.5rem' }}>The garage is open</div>
          <h2 style={{ fontFamily: D.display, fontSize: 'clamp(3rem,9vw,8rem)', lineHeight: 0.9, fontWeight: 900, color: C.light, marginBottom: '2rem' }}>
            PARK<br />YOUR<br />BUILD HERE
          </h2>
          <p style={{ fontFamily: D.display, fontSize: '1.1rem', color: C.muted, marginBottom: '3rem', letterSpacing: '0.05em' }}>
            Free to join. No algorithms hiding your content. Just the community.
          </p>
          <button onClick={() => navigate('/app/explore')}
            style={{ fontFamily: D.display, fontWeight: 800, fontSize: '0.95rem', letterSpacing: '0.15em', textTransform: 'uppercase', background: C.red, color: C.light, border: 'none', padding: '1.1rem 3rem', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.background = C.redDim}
            onMouseLeave={e => e.currentTarget.style.background = C.red}>
            Create Your Garage — Free
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: C.card, borderTop: '1px solid rgba(141,153,174,0.15)', padding: '2.5rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', position: 'relative', zIndex: 1 }}>
        <div style={{ fontFamily: D.display, fontSize: '1.8rem', fontWeight: 900, letterSpacing: '0.08em', color: C.light }}>
          REV<span style={{ color: C.red }}>VIT</span>
        </div>
        <div style={{ display: 'flex', gap: '2rem' }}>
          {['explore', 'community', 'marketplace', 'knowledge', 'services'].map(l => (
            <button key={l} onClick={() => navigate(`/app/${l}`)}
              style={{ fontFamily: D.display, fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: C.muted, background: 'none', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => e.target.style.color = C.light}
              onMouseLeave={e => e.target.style.color = C.muted}>
              {l}
            </button>
          ))}
        </div>
        <div style={{ fontFamily: D.display, fontSize: '0.72rem', letterSpacing: '0.1em', color: 'rgba(141,153,174,0.5)' }}>© 2026 REVVIT. All rights reserved.</div>
      </footer>

    </div>
  )
}