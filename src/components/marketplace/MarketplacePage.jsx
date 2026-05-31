import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useVehicleListings, usePartsListings, useCreateVehicleListing, useCreatePartsListing, useSendEnquiry } from '../../hooks/useMarketplace'
import { CardSkeleton } from '../ui/Skeleton'
import { X, ChevronLeft, ChevronRight, BadgeCheck, MapPin, Fuel, Settings2, MessageCircle } from 'lucide-react'

const C = {
  bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50', navy:'#2D3142',
  coral:'#EF8354', coralDim:'#d96a3a', slate:'#4F5D75',
  text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0',
  border:'rgba(191,192,192,0.12)', borderBright:'rgba(191,192,192,0.22)',
  white:'#FFFFFF', green:'#5eaa7e', amber:'#f5a623', red:'#ef4444',
}
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const CARS = [
  { id:1, title:'Honda Civic Type R', variant:'EK9 · 1998', price:1850000, priceDisplay:'₹18.5L', km:'62,000 km', location:'Bangalore', seller:'TurboMike', sellerRating:4.9, verified:true, type:'Car', fuel:'Petrol', transmission:'Manual', tag:'Modified', saves:34, color:'#EF8354', posted:'2d ago', desc:'Full K-swap build. 320hp on stock bottom end. Daily driven. All paperwork clear. Serious buyers only.', imgs:['https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=900&q=80','https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=900&q=80','https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&q=80'] },
  { id:2, title:'Kawasaki Z900 RS', variant:'2021 · Candy Tone Brown', price:910000, priceDisplay:'₹9.1L', km:'8,200 km', location:'Chennai', seller:'RaiderKing', sellerRating:4.7, verified:true, type:'Bike', fuel:'Petrol', transmission:'Manual', tag:'Stock', saves:21, color:'#f39c12', posted:'1d ago', desc:'One owner. Full service history. Only stock parts. Selling due to upgrade.', imgs:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80','https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=900&q=80'] },
  { id:3, title:'Maruti Swift Sport', variant:'2019 · Red', price:780000, priceDisplay:'₹7.8L', km:'34,000 km', location:'Hyderabad', seller:'ZeroShift', sellerRating:4.5, verified:false, type:'Car', fuel:'Petrol', transmission:'Manual', tag:'Modified', saves:12, color:'#3b82f6', posted:'3d ago', desc:'Stage 2 tune. New exhaust. Coilovers. Very fun daily driver. Priced to sell.', imgs:['https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=900&q=80','https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=900&q=80'] },
  { id:4, title:'Royal Enfield Interceptor 650', variant:'2022 · Orange Crush', price:280000, priceDisplay:'₹2.8L', km:'11,000 km', location:'Bangalore', seller:'NightRider', sellerRating:4.8, verified:true, type:'Bike', fuel:'Petrol', transmission:'Manual', tag:'Stock', saves:45, color:'#27ae60', posted:'5h ago', desc:'Pristine condition. Minor accessories added. Full service done last month.', imgs:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80'] },
  { id:5, title:'Toyota Supra A80', variant:'1995 · JZA80 · Import', price:4200000, priceDisplay:'₹42L', km:'87,000 km', location:'Mumbai', seller:'GarageGuru', sellerRating:5.0, verified:true, type:'Car', fuel:'Petrol', transmission:'Manual', tag:'JDM Import', saves:89, color:'#a855f7', posted:'1w ago', desc:'Genuine JZA80. All original. Imported and registered. One of only a few in India.', imgs:['https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=900&q=80','https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=900&q=80'] },
  { id:6, title:'KTM Duke 390', variant:'2023 · White', price:210000, priceDisplay:'₹2.1L', km:'4,500 km', location:'Pune', seller:'ApexHunter', sellerRating:4.6, verified:false, type:'Bike', fuel:'Petrol', transmission:'Manual', tag:'Near Stock', saves:18, color:'#EF8354', posted:'2d ago', desc:'Near new. Only Akrapovic exhaust added. Rest stock. Warranty still valid.', imgs:['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80'] },
]

const PARTS = [
  { id:1, name:'Turbocharger — GT3582', category:'Engine', price:62000, priceDisplay:'₹62,000', condition:'Used - Good', conditionColor:'#f5a623', seller:'TurboMike', sellerRating:4.9, location:'Bangalore', compatible:'Universal', color:'#EF8354', verified:true, posted:'1d ago', img:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80', desc:'GT3582 turbo, ceramic bearings, less than 10k km on rebuild. Includes oil/coolant lines.' },
  { id:2, name:'K&N Air Filter — Universal', category:'Intake', price:4200, priceDisplay:'₹4,200', condition:'New', conditionColor:'#5eaa7e', seller:'ZeroShift', sellerRating:4.5, location:'Chennai', compatible:'Universal', color:'#27ae60', verified:false, posted:'3h ago', img:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80', desc:'Brand new K&N drop-in. Washable and reusable. Increases airflow 15-20% over stock.' },
  { id:3, name:'Tein Coilover Kit — EK9', category:'Suspension', price:38000, priceDisplay:'₹38,000', condition:'Used - Excellent', conditionColor:'#5eaa7e', seller:'DriftQueen', sellerRating:4.8, location:'Hyderabad', compatible:'Honda Civic EK', color:'#3b82f6', verified:true, posted:'2d ago', img:'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80', desc:'Full Tein Street Basis kit for EK chassis. Height adjustable. Excellent condition.' },
  { id:4, name:'Akrapovic Exhaust — Duke 390', category:'Exhaust', price:28500, priceDisplay:'₹28,500', condition:'Used - Good', conditionColor:'#f5a623', seller:'RaiderKing', sellerRating:4.7, location:'Bangalore', compatible:'KTM Duke 390', color:'#f39c12', verified:true, posted:'5h ago', img:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80', desc:'Genuine Akrapovic slip-on for Duke 390. Titanium can. Sounds insane.' },
  { id:5, name:'Work Emotion CR Kiwami — Set of 4', category:'Wheels', price:120000, priceDisplay:'₹1.2L', condition:'Used - Good', conditionColor:'#f5a623', seller:'GhostLap', sellerRating:4.6, location:'Mumbai', compatible:'5x114.3', color:'#a855f7', verified:true, posted:'1w ago', img:'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80', desc:'Set of 4 Work Emotion CR Kiwami. 17x9 +22. 5x114.3. Minor curb rash on one.' },
  { id:6, name:'AP Racing Big Brake Kit', category:'Brakes', price:85000, priceDisplay:'₹85,000', condition:'New', conditionColor:'#5eaa7e', seller:'ApexHunter', sellerRating:4.6, location:'Pune', compatible:'Universal', color:'#EF8354', verified:false, posted:'2d ago', img:'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=600&q=80', desc:'Brand new AP Racing 6-piston kit. Never installed. Fits most 17" and above setups.' },
  { id:7, name:'Bride Bucket Seat — Zeta III', category:'Interior', price:32000, priceDisplay:'₹32,000', condition:'Used - Good', conditionColor:'#f5a623', seller:'TurboMike', sellerRating:4.9, location:'Bangalore', compatible:'Universal', color:'#3b82f6', verified:true, posted:'4d ago', img:'https://images.unsplash.com/photo-1546614042-7df3c24c9e5d?w=600&q=80', desc:'Bride Zeta III Gradation. Low-max version. Harness holes. Very light at 5.4kg.' },
  { id:8, name:'Hondata FlashPro ECU', category:'ECU / Tune', price:18000, priceDisplay:'₹18,000', condition:'Used - Excellent', conditionColor:'#5eaa7e', seller:'NightRider', sellerRating:4.8, location:'Bangalore', compatible:'Honda K-series', color:'#27ae60', verified:false, posted:'6h ago', img:'https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?w=600&q=80', desc:'Hondata FlashPro with current basemap loaded. Works with all K-series Honda platforms.' },
]

// ── Vehicle Detail Modal ─────────────────────────────────
function VehicleDetailModal({ item, onClose }) {
  const [imgIdx, setImgIdx] = useState(0)
  const [phone, setPhone]   = useState('')
  const [sent,  setSent]    = useState(false)
  const imgs = item.imgs || []

  return (
    <div style={{ position:'fixed', inset:0, zIndex:700, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(8,10,18,0.88)', backdropFilter:'blur(8px)' }} onClick={onClose} />
      <div style={{ position:'relative', zIndex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:22, width:'100%', maxWidth:760, maxHeight:'92vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 32px 80px rgba(0,0,0,0.6)' }}>
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, zIndex:10, width:32, height:32, borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, cursor:'pointer', color:C.textMuted, display:'flex', alignItems:'center', justifyContent:'center' }}><X size={15} /></button>

        <div style={{ overflowY:'auto', flex:1 }}>
          {/* Image carousel */}
          <div style={{ position:'relative', height:300, background:'#0a0b12', overflow:'hidden' }}>
            {imgs.length > 0 ? (
              <>
                <img src={imgs[imgIdx]} alt={item.title} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'opacity 0.3s' }} />
                <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(31,34,48,0.8) 0%, transparent 60%)' }} />
              </>
            ) : (
              <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', background:`linear-gradient(135deg,${item.color}18,${item.color}06)` }}>
                <span style={{ fontSize:'5rem' }}>{item.type === 'Bike' ? '🏍️' : '🚗'}</span>
              </div>
            )}
            {imgs.length > 1 && (
              <>
                <button onClick={() => setImgIdx(i => Math.max(0, i-1))} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,0.55)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}><ChevronLeft size={18} color="#fff" /></button>
                <button onClick={() => setImgIdx(i => Math.min(imgs.length-1, i+1))} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', width:36, height:36, borderRadius:'50%', background:'rgba(0,0,0,0.55)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(4px)' }}><ChevronRight size={18} color="#fff" /></button>
                <div style={{ position:'absolute', bottom:12, left:'50%', transform:'translateX(-50%)', display:'flex', gap:'6px' }}>
                  {imgs.map((_, i) => <div key={i} style={{ width: i===imgIdx?20:6, height:6, borderRadius:3, background: i===imgIdx ? C.coral : 'rgba(255,255,255,0.4)', transition:'all 0.25s' }} />)}
                </div>
              </>
            )}
            {/* Thumbnail strip */}
            {imgs.length > 1 && (
              <div style={{ position:'absolute', bottom:0, left:0, right:0, display:'flex', gap:'4px', padding:'0 12px 40px', overflowX:'auto' }}>
                {imgs.map((img, i) => (
                  <div key={i} onClick={() => setImgIdx(i)} style={{ width:60, height:42, borderRadius:8, overflow:'hidden', flexShrink:0, cursor:'pointer', border:`2px solid ${i===imgIdx ? C.coral : 'transparent'}`, transition:'border-color 0.2s' }}>
                    <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ padding:'1.5rem' }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1.25rem', flexWrap:'wrap', gap:'0.75rem' }}>
              <div>
                <h2 style={{ fontFamily:D.display, fontSize:'1.75rem', fontWeight:700, color:C.text, lineHeight:1.1, marginBottom:'0.25rem' }}>{item.title}</h2>
                <div style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textMuted }}>{item.variant}</div>
              </div>
              <div style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:700, color:C.coral }}>{item.priceDisplay}</div>
            </div>

            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'0.75rem', marginBottom:'1.25rem' }}>
              {[
                [<MapPin size={14} />, item.location],
                [<Fuel size={14} />,   item.fuel],
                [<Settings2 size={14} />, item.transmission],
                [<MessageCircle size={14} />, `${item.km}`],
              ].map(([icon, val], i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:C.surface2, borderRadius:10, padding:'0.65rem 0.85rem' }}>
                  <span style={{ color:C.textMuted }}>{icon}</span>
                  <span style={{ fontFamily:D.body, fontSize:'0.85rem', fontWeight:500, color:C.text }}>{val}</span>
                </div>
              ))}
            </div>

            <p style={{ fontFamily:D.body, fontSize:'0.9rem', color:C.textSoft, lineHeight:1.65, marginBottom:'1.5rem' }}>{item.desc}</p>

            {/* Seller */}
            <div style={{ display:'flex', alignItems:'center', gap:'0.85rem', padding:'1rem', background:C.surface2, borderRadius:12, marginBottom:'1.25rem' }}>
              <div style={{ width:40, height:40, borderRadius:'50%', background:item.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'1rem', color:'#fff', flexShrink:0 }}>{item.seller[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  <span style={{ fontFamily:D.body, fontSize:'0.9rem', fontWeight:700, color:C.text }}>{item.seller}</span>
                  {item.verified && <BadgeCheck size={14} color={C.green} />}
                </div>
                <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.amber }}>★ {item.sellerRating} · {item.posted}</div>
              </div>
            </div>

            {/* Contact */}
            {sent ? (
              <div style={{ background:'rgba(94,170,126,0.1)', border:'1px solid rgba(94,170,126,0.3)', borderRadius:12, padding:'1.1rem', textAlign:'center' }}>
                <div style={{ fontFamily:D.display, fontSize:'1.1rem', fontWeight:700, color:C.green, marginBottom:'0.35rem' }}>✓ Message Sent!</div>
                <div style={{ fontFamily:D.body, fontSize:'0.85rem', color:C.textMuted }}>{item.seller} will call you back within 2 hours.</div>
              </div>
            ) : (
              <div>
                <div style={{ fontFamily:D.body, fontSize:'0.75rem', fontWeight:600, color:C.textMuted, letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'0.5rem' }}>Your Phone Number</div>
                <div style={{ display:'flex', gap:'0.6rem' }}>
                  <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210"
                    style={{ flex:1, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.75rem 1rem', color:C.text, fontFamily:D.body, fontSize:'0.9rem', outline:'none' }}
                    onFocus={e => e.target.style.borderColor='rgba(239,131,84,0.4)'}
                    onBlur={e => e.target.style.borderColor=C.border} />
                  <button onClick={() => phone.length >= 7 && setSent(true)}
                    style={{ background:C.coral, border:'none', borderRadius:10, padding:'0.75rem 1.5rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', color:'#fff', opacity: phone.length < 7 ? 0.5 : 1, transition:'all 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
                    onMouseLeave={e => e.currentTarget.style.background=C.coral}>Contact Seller</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Parts Detail Modal ───────────────────────────────────
function PartDetailModal({ item, onClose }) {
  const [phone, setPhone] = useState('')
  const [sent,  setSent]  = useState(false)
  return (
    <div style={{ position:'fixed', inset:0, zIndex:700, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(8,10,18,0.88)', backdropFilter:'blur(8px)' }} onClick={onClose} />
      <div style={{ position:'relative', zIndex:1, background:C.surface, border:`1px solid ${C.border}`, borderRadius:22, width:'100%', maxWidth:580, maxHeight:'90vh', overflow:'hidden', display:'flex', flexDirection:'column', boxShadow:'0 32px 80px rgba(0,0,0,0.6)' }}>
        <button onClick={onClose} style={{ position:'absolute', top:14, right:14, zIndex:10, width:32, height:32, borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, cursor:'pointer', color:C.textMuted, display:'flex', alignItems:'center', justifyContent:'center' }}><X size={15} /></button>
        <div style={{ overflowY:'auto', flex:1 }}>
          <div style={{ height:220, overflow:'hidden', position:'relative' }}>
            <img src={item.img} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} />
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(31,34,48,0.85) 0%, transparent 60%)' }} />
          </div>
          <div style={{ padding:'1.5rem' }}>
            <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1rem', flexWrap:'wrap', gap:'0.5rem' }}>
              <div>
                <h2 style={{ fontFamily:D.display, fontSize:'1.4rem', fontWeight:700, color:C.text, marginBottom:'0.2rem' }}>{item.name}</h2>
                <div style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted }}>Compatible: {item.compatible}</div>
              </div>
              <div style={{ fontFamily:D.display, fontSize:'1.6rem', fontWeight:700, color:C.coral }}>{item.priceDisplay}</div>
            </div>
            <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1rem' }}>
              <span style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:600, padding:'0.22rem 0.65rem', borderRadius:20, background:`${item.color}18`, color:item.color, border:`1px solid ${item.color}33` }}>{item.category}</span>
              <span style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:600, padding:'0.22rem 0.65rem', borderRadius:20, background:`${item.conditionColor}18`, color:item.conditionColor, border:`1px solid ${item.conditionColor}33` }}>{item.condition}</span>
              <span style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:600, padding:'0.22rem 0.65rem', borderRadius:20, background:'rgba(191,192,192,0.08)', color:C.textMuted }}><MapPin size={10} style={{ display:'inline', marginRight:3 }} />{item.location}</span>
            </div>
            <p style={{ fontFamily:D.body, fontSize:'0.9rem', color:C.textSoft, lineHeight:1.65, marginBottom:'1.25rem' }}>{item.desc}</p>
            <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.85rem', background:C.surface2, borderRadius:12, marginBottom:'1.25rem' }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:item.color, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.9rem', color:'#fff', flexShrink:0 }}>{item.seller[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  <span style={{ fontFamily:D.body, fontSize:'0.88rem', fontWeight:700, color:C.text }}>{item.seller}</span>
                  {item.verified && <BadgeCheck size={13} color={C.green} />}
                </div>
                <div style={{ fontFamily:D.body, fontSize:'0.7rem', color:C.amber }}>★ {item.sellerRating} · {item.posted}</div>
              </div>
            </div>
            {sent ? (
              <div style={{ background:'rgba(94,170,126,0.1)', border:'1px solid rgba(94,170,126,0.3)', borderRadius:12, padding:'1rem', textAlign:'center' }}>
                <div style={{ fontFamily:D.display, fontSize:'1rem', fontWeight:700, color:C.green, marginBottom:'0.25rem' }}>✓ Message Sent!</div>
                <div style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textMuted }}>{item.seller} will get back to you shortly.</div>
              </div>
            ) : (
              <div style={{ display:'flex', gap:'0.6rem' }}>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 98765 43210"
                  style={{ flex:1, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.72rem 1rem', color:C.text, fontFamily:D.body, fontSize:'0.9rem', outline:'none' }}
                  onFocus={e => e.target.style.borderColor='rgba(239,131,84,0.4)'}
                  onBlur={e => e.target.style.borderColor=C.border} />
                <button onClick={() => phone.length >= 7 && setSent(true)}
                  style={{ background:C.coral, border:'none', borderRadius:10, padding:'0.72rem 1.25rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.88rem', color:'#fff', opacity: phone.length < 7 ? 0.5 : 1, transition:'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
                  onMouseLeave={e => e.currentTarget.style.background=C.coral}>Contact</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const CAR_MAKES = ['Toyota','Honda','Ford','BMW','Mercedes','Audi','Nissan','Mazda','Suzuki','Mahindra','Tata','Royal Enfield','Yamaha','Bajaj','Hero','KTM','Kawasaki','Ducati','Harley-Davidson','Other']
const PART_CATS = ['Engine','Intake','Exhaust','Suspension','Brakes','Wheels','Interior','ECU / Tune','Body','Lighting','Tyres','Other']

function Badge({ label, color, bg }) {
  return (
    <span style={{ fontFamily:D.body, fontSize:'0.68rem', fontWeight:600, padding:'0.18rem 0.55rem', borderRadius:6, background:bg || `${color}18`, color, border:`1px solid ${color}33` }}>
      {label}
    </span>
  )
}

function SellerRow({ seller, rating, verified, posted }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'0.6rem' }}>
      <div style={{ width:28, height:28, borderRadius:'50%', background:C.coral, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.75rem', color:C.white, flexShrink:0 }}>{seller[0]}</div>
      <div style={{ flex:1 }}>
        <span style={{ fontFamily:D.body, fontSize:'0.82rem', fontWeight:600, color:C.text }}>{seller}</span>
        {verified && <span style={{ fontFamily:D.body, fontSize:'0.65rem', fontWeight:600, color:C.green, background:'rgba(94,170,126,0.12)', padding:'0.08rem 0.4rem', borderRadius:5, marginLeft:'0.4rem' }}>✓</span>}
      </div>
      <span style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.amber }}>★ {rating}</span>
      <span style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted }}>{posted}</span>
    </div>
  )
}

function CarCard({ item, onContact, contacted, onDetail }) {
  const [saved, setSaved] = useState(false)
  return (
    <div style={{ background:C.surface, borderRadius:18, overflow:'hidden', border:`1px solid ${C.border}`, transition:'all 0.25s', display:'flex', flexDirection:'column', cursor:'pointer' }}
      onClick={onDetail}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor=`${item.color}44` }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor=C.border }}>
      <div style={{ height:180, position:'relative', overflow:'hidden' }}>
        {item.imgs?.[0]
          ? <img src={item.imgs[0]} alt={item.title} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s' }} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.05)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'} />
          : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg,${item.color}18,${item.color}06)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'4rem' }}>{item.type==='Bike'?'🏍️':'🚗'}</div>
        }
        <div style={{ position:'absolute', top:12, left:12, display:'flex', gap:'0.4rem' }}>
          <Badge label={item.tag} color={item.color} />
          {item.type === 'Bike' && <Badge label="Bike" color={C.slate} />}
        </div>
        <button onClick={() => setSaved(s => !s)}
          style={{ position:'absolute', top:10, right:12, background:'rgba(31,34,48,0.75)', border:'none', borderRadius:8, width:34, height:34, cursor:'pointer', fontSize:'1rem', backdropFilter:'blur(4px)' }}>
          {saved ? '❤️' : '🤍'}
        </button>
      </div>
      <div style={{ padding:'1.25rem', display:'flex', flexDirection:'column', flex:1, gap:'0.75rem' }}>
        <div>
          <div style={{ fontFamily:D.display, fontSize:'1.2rem', fontWeight:700, color:C.text, lineHeight:1.1 }}>{item.title}</div>
          <div style={{ fontFamily:D.body, fontSize:'0.8rem', color:C.textMuted, marginTop:'0.2rem' }}>{item.variant}</div>
        </div>
        <div style={{ fontFamily:D.display, fontSize:'1.75rem', fontWeight:700, color:C.coral, lineHeight:1 }}>{item.priceDisplay}</div>
        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
          <Badge label={`🛣️ ${item.km}`} color={C.textMuted} bg="rgba(191,192,192,0.08)" />
          <Badge label={`📍 ${item.location}`} color={C.textMuted} bg="rgba(191,192,192,0.08)" />
          <Badge label={item.fuel} color={C.textMuted} bg="rgba(191,192,192,0.08)" />
          <Badge label={item.transmission} color={C.textMuted} bg="rgba(191,192,192,0.08)" />
        </div>
        <p style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textMuted, lineHeight:1.55, flex:1 }}>{item.desc}</p>
        <SellerRow seller={item.seller} rating={item.sellerRating} verified={item.verified} posted={item.posted} />
        {contacted === item.id ? (
          <div style={{ background:'rgba(239,131,84,0.08)', border:'1px solid rgba(239,131,84,0.2)', borderRadius:12, padding:'0.85rem' }}>
            <div style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted, marginBottom:'0.6rem' }}>{item.seller} will call you back within 2 hours.</div>
            <div style={{ display:'flex', gap:'0.5rem' }}>
              <input placeholder="+91 98765 43210" style={{ flex:1, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, padding:'0.5rem 0.75rem', color:C.text, fontFamily:D.body, fontSize:'0.85rem', outline:'none' }} />
              <button style={{ background:C.coral, border:'none', borderRadius:8, padding:'0.5rem 1rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.82rem', color:C.white }}>Send</button>
            </div>
          </div>
        ) : (
          <div style={{ display:'flex', gap:'0.6rem' }}>
            <button onClick={() => onContact(item.id)}
              style={{ flex:1, background:C.coral, border:'none', borderRadius:10, padding:'0.75rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.88rem', color:C.white, transition:'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
              onMouseLeave={e => e.currentTarget.style.background=C.coral}>
              Contact Seller
            </button>
            <button style={{ width:44, background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, cursor:'pointer', color:C.textMuted, fontSize:'1rem', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor=C.coral; e.currentTarget.style.color=C.coral }}
              onMouseLeave={e => { e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.textMuted }}>
              💬
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function PartCard({ item, onContact, contacted, onDetail }) {
  const [saved, setSaved] = useState(false)
  return (
    <div style={{ background:C.surface, borderRadius:18, overflow:'hidden', border:`1px solid ${C.border}`, transition:'all 0.25s', display:'flex', flexDirection:'column', cursor:'pointer' }}
      onClick={onDetail}
      onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.borderColor=`${item.color}44` }}
      onMouseLeave={e => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.borderColor=C.border }}>
      <div style={{ height:130, position:'relative', overflow:'hidden' }}>
        {item.img
          ? <img src={item.img} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform 0.4s' }} onMouseEnter={e=>e.currentTarget.style.transform='scale(1.06)'} onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'} />
          : <div style={{ width:'100%', height:'100%', background:`linear-gradient(135deg,${item.color}18,${item.color}06)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'3rem' }}>⚙️</div>
        }
        <div style={{ position:'absolute', top:10, left:12 }}><Badge label={item.category} color={item.color} /></div>
        <div style={{ position:'absolute', top:10, right:12 }}><Badge label={item.condition} color={item.conditionColor} /></div>
        <button onClick={() => setSaved(s => !s)}
          style={{ position:'absolute', bottom:10, right:12, background:'rgba(31,34,48,0.7)', border:'none', borderRadius:7, width:30, height:30, cursor:'pointer', fontSize:'0.85rem' }}>
          {saved ? '❤️' : '🤍'}
        </button>
      </div>
      <div style={{ padding:'1.2rem', display:'flex', flexDirection:'column', flex:1, gap:'0.7rem' }}>
        <div>
          <div style={{ fontFamily:D.display, fontSize:'1.05rem', fontWeight:700, color:C.text, lineHeight:1.2 }}>{item.name}</div>
          <div style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.textMuted, marginTop:'0.2rem' }}>🔗 {item.compatible}</div>
        </div>
        <div style={{ fontFamily:D.display, fontSize:'1.6rem', fontWeight:700, color:C.coral, lineHeight:1 }}>{item.priceDisplay}</div>
        <Badge label={`📍 ${item.location}`} color={C.textMuted} bg="rgba(191,192,192,0.08)" />
        <SellerRow seller={item.seller} rating={item.sellerRating} verified={item.verified} posted={item.posted} />
        {contacted === item.id ? (
          <div style={{ background:'rgba(239,131,84,0.08)', border:'1px solid rgba(239,131,84,0.2)', borderRadius:10, padding:'0.75rem' }}>
            <input placeholder="+91 98765 43210" style={{ width:'100%', background:C.surface2, border:`1px solid ${C.border}`, borderRadius:8, padding:'0.5rem 0.75rem', color:C.text, fontFamily:D.body, fontSize:'0.85rem', outline:'none', marginBottom:'0.5rem' }} />
            <button style={{ width:'100%', background:C.coral, border:'none', borderRadius:8, padding:'0.45rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.82rem', color:C.white }}>Send Request</button>
          </div>
        ) : (
          <button onClick={() => onContact(item.id)}
            style={{ background:C.coral, border:'none', borderRadius:10, padding:'0.7rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.88rem', color:C.white, transition:'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
            onMouseLeave={e => e.currentTarget.style.background=C.coral}>
            Contact Seller
          </button>
        )}
      </div>
    </div>
  )
}

function ModalShell({ onClose, children }) {
  return (
    <div style={{ position:'fixed', inset:0, zIndex:500, display:'flex', alignItems:'center', justifyContent:'center', padding:'1rem' }}>
      <div style={{ position:'absolute', inset:0, background:'rgba(10,12,20,0.8)', backdropFilter:'blur(6px)' }} onClick={onClose} />
      <div style={{ position:'relative', zIndex:1, background:C.surface, borderRadius:20, padding:'2rem', maxWidth:680, width:'100%', maxHeight:'90vh', overflowY:'auto', border:`1px solid ${C.border}`, boxShadow:'0 25px 60px rgba(0,0,0,0.5)' }}>
        <button onClick={onClose}
          style={{ position:'absolute', top:16, right:16, width:32, height:32, borderRadius:8, background:C.surface2, border:`1px solid ${C.border}`, cursor:'pointer', color:C.textMuted, fontSize:'1rem', display:'flex', alignItems:'center', justifyContent:'center' }}>
          ✕
        </button>
        {children}
      </div>
    </div>
  )
}

function PostListingModal({ onClose, defaultTab }) {
  const [tab, setTab] = useState(defaultTab || 'vehicle')
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [files, setFiles] = useState([])
  const fileRef = useRef()
  const [form, setForm] = useState({
    make:'', model:'', year:'', km:'', price:'', location:'', condition:'', transmission:'', fuel:'', desc:'', contact:'',
    partName:'', category:'', compatible:'', partCondition:'', partPrice:'', partLocation:'', partDesc:'', partContact:'',
  })
  const u = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const createVehicle = useCreateVehicleListing()
  const createPart    = useCreatePartsListing()

  const handleSubmit = async () => {
    if (tab === 'vehicle') {
      await createVehicle.mutateAsync({
        listing: { make: form.make, model: form.model, year: Number(form.year), mileage_km: Number(form.km), price: Number(form.price), location: form.location, condition: form.condition?.toLowerCase() || 'used', description: form.desc, type: 'car' },
        files,
      })
    } else {
      await createPart.mutateAsync({
        listing: { title: form.partName, category: form.category, compatible_with: form.compatible ? [form.compatible] : [], condition: form.partCondition?.toLowerCase().replace(' - ','_') || 'used', price: Number(form.partPrice), location: form.partLocation, description: form.partDesc },
        files,
      })
    }
    setSubmitted(true)
  }

  const Field = ({ label, children }) => (
    <div style={{ display:'flex', flexDirection:'column', gap:'0.35rem' }}>
      <label style={{ fontFamily:D.body, fontSize:'0.75rem', fontWeight:600, color:C.textMuted, letterSpacing:'0.06em', textTransform:'uppercase' }}>{label}</label>
      {children}
    </div>
  )
  const Input = ({ k, ph, type='text' }) => (
    <input type={type} placeholder={ph} value={form[k]} onChange={e => u(k, e.target.value)}
      style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.75rem 1rem', color:C.text, fontFamily:D.body, fontSize:'0.9rem', outline:'none', width:'100%' }}
      onFocus={e => e.target.style.borderColor='rgba(239,131,84,0.5)'}
      onBlur={e => e.target.style.borderColor=C.border} />
  )
  const Sel = ({ k, opts }) => (
    <select value={form[k]} onChange={e => u(k, e.target.value)}
      style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.75rem 1rem', color:form[k] ? C.text : C.textMuted, fontFamily:D.body, fontSize:'0.9rem', outline:'none', width:'100%', cursor:'pointer' }}>
      <option value="">Select...</option>
      {opts.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  )
  const ToggleBtns = ({ k, opts }) => (
    <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
      {opts.map(t => (
        <button key={t} onClick={() => u(k, t)}
          style={{ padding:'0.6rem 1rem', borderRadius:9, background: form[k]===t ? C.coral : C.surface2, border:`1px solid ${form[k]===t ? C.coral : C.border}`, color: form[k]===t ? C.white : C.textMuted, fontFamily:D.body, fontSize:'0.82rem', fontWeight:600, cursor:'pointer', transition:'all 0.2s' }}>
          {t}
        </button>
      ))}
    </div>
  )

  if (submitted) return (
    <ModalShell onClose={onClose}>
      <div style={{ textAlign:'center', padding:'2rem 1rem' }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(94,170,126,0.15)', border:'2px solid rgba(94,170,126,0.4)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', margin:'0 auto 1.5rem' }}>✅</div>
        <div style={{ fontFamily:D.display, fontSize:'1.8rem', fontWeight:700, color:C.text, marginBottom:'0.6rem' }}>Listing Submitted!</div>
        <p style={{ fontFamily:D.body, fontSize:'0.95rem', color:C.textMuted, lineHeight:1.6, marginBottom:'2rem' }}>Your listing is under review and will go live within 24 hours. We'll notify you by SMS.</p>
        <button onClick={onClose} style={{ background:C.coral, border:'none', borderRadius:12, padding:'0.85rem 2.5rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.95rem', color:C.white }}>Done</button>
      </div>
    </ModalShell>
  )

  return (
    <ModalShell onClose={onClose}>
      <div style={{ fontFamily:D.display, fontSize:'1.6rem', fontWeight:700, color:C.text, marginBottom:'0.25rem' }}>Post a Listing</div>
      <p style={{ fontFamily:D.body, fontSize:'0.88rem', color:C.textMuted, marginBottom:'1.75rem' }}>Anyone can sell — fill in the details and we'll review your listing within 24 hours.</p>

      <div style={{ display:'inline-flex', gap:'0.25rem', background:C.surface2, padding:'0.3rem', borderRadius:12, marginBottom:'1.75rem' }}>
        {[['vehicle','🚗 Vehicle'],['part','🔧 Part / Mod']].map(([val, label]) => (
          <button key={val} onClick={() => { setTab(val); setStep(1) }}
            style={{ fontFamily:D.body, fontSize:'0.88rem', fontWeight:600, padding:'0.55rem 1.3rem', borderRadius:9, background: tab===val ? C.coral : 'transparent', color: tab===val ? C.white : C.textMuted, border:'none', cursor:'pointer', transition:'all 0.2s' }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'vehicle' && (
        <>
          <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'1.75rem' }}>
            {['Details','Pricing','Photos'].map((s, i) => (
              <div key={s} style={{ display:'flex', alignItems:'center', gap:'0.5rem', flex: i < 2 ? 1 : 0 }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <div style={{ width:28, height:28, borderRadius:'50%', background: step > i+1 ? C.green : step === i+1 ? C.coral : C.surface2, border:`2px solid ${step > i+1 ? C.green : step === i+1 ? C.coral : C.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.8rem', color: step >= i+1 ? C.white : C.textMuted, transition:'all 0.3s' }}>
                    {step > i+1 ? '✓' : i+1}
                  </div>
                  <span style={{ fontFamily:D.body, fontSize:'0.8rem', fontWeight: step===i+1 ? 600 : 400, color: step===i+1 ? C.text : C.textMuted }}>{s}</span>
                </div>
                {i < 2 && <div style={{ flex:1, height:2, background: step > i+1 ? C.green : C.surface2, borderRadius:1, transition:'background 0.3s' }} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <Field label="Make / Brand"><Sel k="make" opts={CAR_MAKES} /></Field>
              <Field label="Model"><Input k="model" ph="e.g. Civic, Duke 390" /></Field>
              <Field label="Year"><Input k="year" ph="e.g. 2019" type="number" /></Field>
              <Field label="Kilometres Driven"><Input k="km" ph="e.g. 34000" /></Field>
              <div style={{ gridColumn:'span 2' }}><Field label="Transmission"><ToggleBtns k="transmission" opts={['Manual','Automatic','DCT','CVT']} /></Field></div>
              <div style={{ gridColumn:'span 2' }}><Field label="Fuel Type"><ToggleBtns k="fuel" opts={['Petrol','Diesel','EV','CNG','Hybrid']} /></Field></div>
              <div style={{ gridColumn:'span 2' }}><Field label="Condition"><ToggleBtns k="condition" opts={['Stock','Modified','Project Car','Spares / Repair']} /></Field></div>
              <div style={{ gridColumn:'span 2' }}><Field label="City / Location"><Input k="location" ph="e.g. Bangalore, KA" /></Field></div>
            </div>
          )}

          {step === 2 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <Field label="Asking Price (₹)">
                <div style={{ position:'relative' }}>
                  <span style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', fontFamily:D.display, fontWeight:700, fontSize:'1rem', color:C.textMuted }}>₹</span>
                  <input type="number" placeholder="e.g. 850000" value={form.price} onChange={e => u('price', e.target.value)}
                    style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.75rem 1rem 0.75rem 2.2rem', color:C.text, fontFamily:D.body, fontSize:'0.9rem', outline:'none', width:'100%' }}
                    onFocus={e => e.target.style.borderColor='rgba(239,131,84,0.5)'}
                    onBlur={e => e.target.style.borderColor=C.border} />
                </div>
                {form.price && <div style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.green, marginTop:'0.2rem' }}>= ₹{Number(form.price).toLocaleString('en-IN')}</div>}
              </Field>
              <Field label="Description">
                <textarea placeholder="Describe the vehicle — mods, service history, reason for selling, any known issues..." value={form.desc} onChange={e => u('desc', e.target.value)}
                  style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.75rem 1rem', color:C.text, fontFamily:D.body, fontSize:'0.9rem', outline:'none', minHeight:130, resize:'vertical', lineHeight:1.6, width:'100%' }}
                  onFocus={e => e.target.style.borderColor='rgba(239,131,84,0.5)'}
                  onBlur={e => e.target.style.borderColor=C.border} />
              </Field>
              <Field label="Contact Number"><Input k="contact" ph="+91 98765 43210" /></Field>
            </div>
          )}

          {step === 3 && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <input ref={fileRef} type="file" multiple accept="image/*" style={{ display:'none' }} onChange={e => setFiles(Array.from(e.target.files))} />
              <div onClick={() => fileRef.current.click()} style={{ height:180, border:`2px dashed rgba(191,192,192,0.2)`, borderRadius:14, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'0.75rem', cursor:'pointer', background:'rgba(191,192,192,0.02)', transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(239,131,84,0.4)'; e.currentTarget.style.background='rgba(239,131,84,0.02)' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(191,192,192,0.2)'; e.currentTarget.style.background='rgba(191,192,192,0.02)' }}>
                <div style={{ fontSize:'2.5rem' }}>📸</div>
                <div style={{ fontFamily:D.display, fontSize:'1.1rem', fontWeight:600, color:files.length ? C.green : C.textMuted }}>{files.length ? `${files.length} photo(s) selected` : 'Upload Photos'}</div>
                <div style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted }}>Up to 10 photos · JPG, PNG · Max 5MB each</div>
                <div style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.coral }}>First photo becomes the cover image</div>
              </div>
              <div style={{ background:C.surface2, borderRadius:14, padding:'1.25rem', border:`1px solid ${C.border}` }}>
                <div style={{ fontFamily:D.body, fontSize:'0.72rem', fontWeight:700, letterSpacing:'0.12em', textTransform:'uppercase', color:C.textMuted, marginBottom:'0.85rem' }}>Listing Preview</div>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                  {[['Vehicle',`${form.year} ${form.make} ${form.model}`],['Condition',form.condition],['Fuel',form.fuel],['Transmission',form.transmission],['Kilometres',form.km ? `${Number(form.km).toLocaleString('en-IN')} km` : '—'],['Location',form.location],['Asking Price',form.price ? `₹${Number(form.price).toLocaleString('en-IN')}` : '—'],['Contact',form.contact]].map(([k,v]) => (
                    <div key={k}>
                      <div style={{ fontFamily:D.body, fontSize:'0.7rem', color:C.textMuted }}>{k}</div>
                      <div style={{ fontFamily:D.body, fontSize:'0.9rem', fontWeight:600, color:C.text, marginTop:'0.1rem' }}>{v || '—'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {tab === 'part' && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
          <Field label="Part Name"><Input k="partName" ph="e.g. Akrapovic Exhaust" /></Field>
          <Field label="Category"><Sel k="category" opts={PART_CATS} /></Field>
          <Field label="Compatible With"><Input k="compatible" ph="e.g. KTM Duke 390, Universal" /></Field>
          <Field label="Condition"><Sel k="partCondition" opts={['New','Used - Excellent','Used - Good','Used - Fair']} /></Field>
          <Field label="Price (₹)">
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', fontFamily:D.display, fontWeight:700, color:C.textMuted }}>₹</span>
              <input type="number" placeholder="e.g. 28500" value={form.partPrice} onChange={e => u('partPrice', e.target.value)}
                style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.75rem 1rem 0.75rem 2.2rem', color:C.text, fontFamily:D.body, fontSize:'0.9rem', outline:'none', width:'100%' }} />
            </div>
          </Field>
          <Field label="Location"><Input k="partLocation" ph="e.g. Bangalore, KA" /></Field>
          <div style={{ gridColumn:'span 2' }}>
            <Field label="Description">
              <textarea placeholder="Describe the part — usage, condition details, why selling..." value={form.partDesc} onChange={e => u('partDesc', e.target.value)}
                style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.75rem 1rem', color:C.text, fontFamily:D.body, fontSize:'0.9rem', outline:'none', minHeight:100, resize:'vertical', lineHeight:1.6, width:'100%' }} />
            </Field>
          </div>
          <div style={{ gridColumn:'span 2' }}>
            <Field label="Contact Number"><Input k="partContact" ph="+91 98765 43210" /></Field>
          </div>
        </div>
      )}

      <div style={{ display:'flex', gap:'0.75rem', marginTop:'1.75rem', justifyContent:'flex-end' }}>
        {tab === 'vehicle' && step > 1 && (
          <button onClick={() => setStep(s => s-1)}
            style={{ background:C.surface2, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.75rem 1.5rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', color:C.textMuted, transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.color=C.text }}
            onMouseLeave={e => { e.currentTarget.style.color=C.textMuted }}>
            ← Back
          </button>
        )}
        {tab === 'vehicle' && step < 3 ? (
          <button onClick={() => setStep(s => s+1)}
            style={{ background:C.coral, border:'none', borderRadius:10, padding:'0.75rem 2rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', color:C.white, transition:'background 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
            onMouseLeave={e => e.currentTarget.style.background=C.coral}>
            Next →
          </button>
        ) : (
          <button onClick={handleSubmit} disabled={createVehicle.isPending || createPart.isPending}
            style={{ background:C.coral, border:'none', borderRadius:10, padding:'0.75rem 2rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', color:C.white, transition:'background 0.2s', opacity: (createVehicle.isPending || createPart.isPending) ? 0.7 : 1 }}
            onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
            onMouseLeave={e => e.currentTarget.style.background=C.coral}>
            {(createVehicle.isPending || createPart.isPending) ? 'Submitting...' : 'Submit Listing ✓'}
          </button>
        )}
      </div>
    </ModalShell>
  )
}

function EmptyState({ msg }) {
  return (
    <div style={{ textAlign:'center', padding:'4rem 2rem' }}>
      <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🔍</div>
      <div style={{ fontFamily:D.display, fontSize:'1.2rem', fontWeight:600, color:C.textMuted }}>{msg}</div>
    </div>
  )
}

// Normalise DB rows into the same shape as the mock data
function normaliseVehicle(row, i) {
  const colors = ['#EF8354','#f39c12','#3b82f6','#27ae60','#a855f7']
  return {
    id: row.id ?? i,
    title: `${row.make} ${row.model}`,
    variant: `${row.year}${row.trim ? ' · ' + row.trim : ''}`,
    price: row.price,
    priceDisplay: `₹${(row.price/100000).toFixed(1)}L`,
    km: row.mileage_km ? `${row.mileage_km.toLocaleString('en-IN')} km` : '—',
    location: row.location || '—',
    seller: row.profiles?.username || 'Seller',
    sellerRating: 4.5,
    verified: row.profiles?.is_verified || false,
    emoji: row.type === 'motorcycle' ? '🏍️' : '🚗',
    type: row.type === 'motorcycle' ? 'Bike' : 'Car',
    fuel: row.fuel_type || 'Petrol',
    transmission: row.transmission || 'Manual',
    tag: row.condition === 'new' ? 'New' : 'Used',
    saves: 0,
    color: colors[i % colors.length],
    posted: new Date(row.created_at).toLocaleDateString(),
    desc: row.description || '',
  }
}

function normalisePart(row, i) {
  const colors = ['#EF8354','#27ae60','#3b82f6','#f39c12','#a855f7']
  return {
    id: row.id ?? i,
    name: row.title,
    category: row.category,
    price: row.price,
    priceDisplay: `₹${row.price.toLocaleString('en-IN')}`,
    condition: row.condition?.replace('_',' ') || 'Used',
    conditionColor: row.condition === 'new' ? '#5eaa7e' : '#f5a623',
    seller: row.profiles?.username || 'Seller',
    sellerRating: 4.5,
    location: row.location || '—',
    compatible: row.compatible_with?.[0] || 'Universal',
    emoji: '⚙️',
    color: colors[i % colors.length],
    verified: row.profiles?.is_verified || false,
    posted: new Date(row.created_at).toLocaleDateString(),
  }
}

export default function MarketplacePage() {
  const { user } = useAuth()
  const [tab, setTab] = useState('cars')
  const [showModal, setShowModal] = useState(false)
  const [modalTab, setModalTab] = useState('vehicle')
  const [contacted, setContacted] = useState(null)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('All')
  const [catFilter, setCatFilter] = useState('All')
  const [sortBy, setSortBy] = useState('newest')

  const [detailVehicle, setDetailVehicle] = useState(null)
  const [detailPart,    setDetailPart]    = useState(null)

  const { data: dbCars,  isLoading: loadingCars  } = useVehicleListings()
  const { data: dbParts, isLoading: loadingParts } = usePartsListings()

  // Use DB data when available, otherwise show mock data so UI is never empty
  const rawCars  = (dbCars  && dbCars.length  > 0) ? dbCars.map(normaliseVehicle)  : CARS
  const rawParts = (dbParts && dbParts.length > 0) ? dbParts.map(normalisePart) : PARTS

  const openSell = (t) => { setModalTab(t); setShowModal(true) }

  const filteredCars = rawCars.filter(c =>
    (typeFilter === 'All' || c.type === typeFilter) &&
    (search === '' || c.title.toLowerCase().includes(search.toLowerCase()) || c.location.toLowerCase().includes(search.toLowerCase()))
  )
  const filteredParts = rawParts.filter(p =>
    (catFilter === 'All' || p.category === catFilter) &&
    (search === '' || p.name.toLowerCase().includes(search.toLowerCase()) || p.compatible.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div style={{ minHeight:'calc(100vh - 60px)', background:C.bg, padding:'2.5rem 3rem' }}>
      <div style={{ maxWidth:1300, margin:'0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'2.5rem', flexWrap:'wrap', gap:'1rem' }}>
          <div>
            <div style={{ fontFamily:D.body, fontSize:'0.75rem', fontWeight:600, letterSpacing:'0.15em', textTransform:'uppercase', color:C.coral, marginBottom:'0.5rem' }}>The Strip</div>
            <h1 style={{ fontFamily:D.display, fontSize:'3rem', fontWeight:700, color:C.text, lineHeight:1.05, letterSpacing:'-0.03em', marginBottom:'0.6rem' }}>Marketplace</h1>
            <p style={{ fontFamily:D.body, fontSize:'1rem', color:C.textMuted, lineHeight:1.6, maxWidth:480 }}>
              Buy and sell cars, bikes, and performance parts. Community-verified listings, no middlemen.
            </p>
          </div>
          <div style={{ display:'flex', gap:'0.75rem', flexWrap:'wrap' }}>
            <button onClick={() => openSell('vehicle')}
              style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:C.coral, border:'none', borderRadius:12, padding:'0.85rem 1.5rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', color:C.white, transition:'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
              onMouseLeave={e => e.currentTarget.style.background=C.coral}>
              🚗 Sell a Vehicle
            </button>
            <button onClick={() => openSell('part')}
              style={{ display:'flex', alignItems:'center', gap:'0.5rem', background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:'0.85rem 1.5rem', cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', color:C.text, transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background=C.surface2; e.currentTarget.style.borderColor=C.coral; e.currentTarget.style.color=C.coral }}
              onMouseLeave={e => { e.currentTarget.style.background=C.surface; e.currentTarget.style.borderColor=C.border; e.currentTarget.style.color=C.text }}>
              🔧 Sell a Part
            </button>
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1px', background:C.border, borderRadius:16, overflow:'hidden', marginBottom:'2rem' }}>
          {[['2,340','Active Listings'],['847','Cars & Bikes'],['1,493','Parts & Mods'],['98%','Verified Sellers']].map(([val, label]) => (
            <div key={label} style={{ background:C.surface, padding:'1rem 1.5rem', textAlign:'center' }}>
              <div style={{ fontFamily:D.display, fontSize:'1.6rem', fontWeight:700, color:C.coral, lineHeight:1 }}>{val}</div>
              <div style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted, marginTop:'0.2rem' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Toggle + Search + Sort */}
        <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.75rem', flexWrap:'wrap' }}>
          <div style={{ display:'inline-flex', gap:'0.25rem', background:C.surface, padding:'0.3rem', borderRadius:12 }}>
            {[['cars','🚗 Cars & Bikes'],['parts','🔧 Parts & Mods']].map(([val, label]) => (
              <button key={val} onClick={() => { setTab(val); setSearch(''); setTypeFilter('All'); setCatFilter('All') }}
                style={{ fontFamily:D.body, fontSize:'0.9rem', fontWeight:600, padding:'0.65rem 1.6rem', borderRadius:9, background: tab===val ? C.coral : 'transparent', color: tab===val ? C.white : C.textMuted, border:'none', cursor:'pointer', transition:'all 0.2s' }}>
                {label}
              </button>
            ))}
          </div>
          <div style={{ flex:1, display:'flex', alignItems:'center', gap:'0.6rem', background:C.surface, border:`1px solid ${C.border}`, borderRadius:12, padding:'0.7rem 1rem', maxWidth:380 }}>
            <span style={{ color:C.textMuted }}>🔍</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder={tab === 'cars' ? 'Search make, model, city...' : 'Search parts, compatible vehicles...'}
              style={{ background:'none', border:'none', outline:'none', fontFamily:D.body, fontSize:'0.9rem', color:C.text, flex:1 }} />
            {search && <button onClick={() => setSearch('')} style={{ background:'none', border:'none', cursor:'pointer', color:C.textMuted }}>✕</button>}
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}
            style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:10, padding:'0.7rem 1rem', color:C.textMuted, fontFamily:D.body, fontSize:'0.85rem', outline:'none', cursor:'pointer' }}>
            <option value="newest">Newest First</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
            <option value="saves">Most Saved</option>
          </select>
        </div>

        {/* Cars Tab */}
        {tab === 'cars' && (
          <>
            <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', flexWrap:'wrap', alignItems:'center' }}>
              {['All','Car','Bike'].map(f => (
                <button key={f} onClick={() => setTypeFilter(f)}
                  style={{ fontFamily:D.body, fontSize:'0.82rem', fontWeight:600, padding:'0.4rem 1rem', borderRadius:20, background: typeFilter===f ? C.coral : 'transparent', border:`1px solid ${typeFilter===f ? C.coral : C.border}`, color: typeFilter===f ? C.white : C.textMuted, cursor:'pointer', transition:'all 0.2s' }}>
                  {f}
                </button>
              ))}
              <div style={{ marginLeft:'auto', fontFamily:D.body, fontSize:'0.82rem', color:C.textMuted }}>{filteredCars.length} listings</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1.25rem' }}>
              {loadingCars
                ? Array.from({length:6}).map((_,i) => <CardSkeleton key={i} />)
                : filteredCars.map(item => <CarCard key={item.id} item={item} onContact={setContacted} contacted={contacted} onDetail={() => setDetailVehicle(item)} />)
              }
            </div>
            {!loadingCars && filteredCars.length === 0 && <EmptyState msg="No listings match your search" />}
          </>
        )}

        {/* Parts Tab */}
        {tab === 'parts' && (
          <>
            <div style={{ display:'flex', gap:'0.5rem', marginBottom:'1.5rem', flexWrap:'wrap', alignItems:'center' }}>
              {['All',...PART_CATS.slice(0,7)].map(f => (
                <button key={f} onClick={() => setCatFilter(f)}
                  style={{ fontFamily:D.body, fontSize:'0.82rem', fontWeight:600, padding:'0.4rem 1rem', borderRadius:20, background: catFilter===f ? C.coral : 'transparent', border:`1px solid ${catFilter===f ? C.coral : C.border}`, color: catFilter===f ? C.white : C.textMuted, cursor:'pointer', transition:'all 0.2s' }}>
                  {f}
                </button>
              ))}
              <div style={{ marginLeft:'auto', fontFamily:D.body, fontSize:'0.82rem', color:C.textMuted }}>{filteredParts.length} listings</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:'1.25rem' }}>
              {loadingParts
                ? Array.from({length:8}).map((_,i) => <CardSkeleton key={i} />)
                : filteredParts.map(item => <PartCard key={item.id} item={item} onContact={setContacted} contacted={contacted} onDetail={() => setDetailPart(item)} />)
              }
            </div>
            {!loadingParts && filteredParts.length === 0 && <EmptyState msg="No parts match your search" />}
          </>
        )}
      </div>

      {showModal      && <PostListingModal  onClose={() => setShowModal(false)}     defaultTab={modalTab} />}
      {detailVehicle  && <VehicleDetailModal item={detailVehicle} onClose={() => setDetailVehicle(null)} />}
      {detailPart     && <PartDetailModal    item={detailPart}    onClose={() => setDetailPart(null)}    />}
    </div>
  )
}