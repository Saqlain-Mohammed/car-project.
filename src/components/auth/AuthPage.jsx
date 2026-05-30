import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'

const C = {
  bg:'#1f2230', surface:'#2a2f40', surface2:'#353b50',
  coral:'#EF8354', coralDim:'#d96a3a',
  text:'#EDEEF0', textSoft:'#BFC0C0', textMuted:'#8b90a0',
  border:'rgba(191,192,192,0.14)', borderFocus:'rgba(239,131,84,0.5)',
  green:'#5eaa7e', red:'#ef4444',
}
const D = { display:"'Space Grotesk', sans-serif", body:"'Inter', sans-serif" }

const CAR_MAKES = [
  'Toyota','Honda','Ford','BMW','Mercedes','Audi','Volkswagen',
  'Hyundai','Kia','Nissan','Mazda','Suzuki','Mahindra','Tata',
  'Royal Enfield','Yamaha','Bajaj','Hero','KTM','Kawasaki',
  'Ducati','Harley-Davidson','Other'
]

function InputField({ label, type='text', value, onChange, placeholder, suffix, error }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
      <label style={{ fontFamily:D.body, fontSize:'0.75rem', fontWeight:600, color: focused ? C.coral : C.textMuted, letterSpacing:'0.06em', textTransform:'uppercase', transition:'color 0.2s' }}>
        {label}
      </label>
      <div style={{ position:'relative' }}>
        <input
          type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width:'100%', padding: suffix ? '0.85rem 3rem 0.85rem 1rem' : '0.85rem 1rem',
            background:C.surface2, border:`1.5px solid ${focused ? C.coral : error ? C.red : C.border}`,
            borderRadius:12, color:C.text, fontFamily:D.body, fontSize:'0.95rem',
            outline:'none', transition:'border-color 0.2s',
            boxSizing:'border-box',
          }}
        />
        {suffix && (
          <div style={{ position:'absolute', right:'0.85rem', top:'50%', transform:'translateY(-50%)', color:C.textMuted }}>
            {suffix}
          </div>
        )}
      </div>
      {error && <span style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.red }}>{error}</span>}
    </div>
  )
}

function SelectField({ label, value, onChange, options, error }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
      <label style={{ fontFamily:D.body, fontSize:'0.75rem', fontWeight:600, color: focused ? C.coral : C.textMuted, letterSpacing:'0.06em', textTransform:'uppercase', transition:'color 0.2s' }}>
        {label}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ width:'100%', padding:'0.85rem 1rem', background:C.surface2, border:`1.5px solid ${focused ? C.coral : error ? C.red : C.border}`, borderRadius:12, color: value ? C.text : C.textMuted, fontFamily:D.body, fontSize:'0.95rem', outline:'none', cursor:'pointer', transition:'border-color 0.2s' }}>
        <option value="">Select...</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
      {error && <span style={{ fontFamily:D.body, fontSize:'0.75rem', color:C.red }}>{error}</span>}
    </div>
  )
}

function SubmitBtn({ loading, label, icon }) {
  return (
    <button type="submit" disabled={loading}
      style={{ width:'100%', padding:'0.95rem', background: loading ? C.surface2 : C.coral, border:'none', borderRadius:12, color: loading ? C.textMuted : '#fff', fontFamily:D.body, fontWeight:700, fontSize:'0.95rem', cursor: loading ? 'not-allowed' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem', transition:'background 0.2s' }}
      onMouseEnter={e => { if (!loading) e.currentTarget.style.background=C.coralDim }}
      onMouseLeave={e => { if (!loading) e.currentTarget.style.background=C.coral }}>
      {loading ? (
        <div style={{ width:18, height:18, border:'2px solid rgba(255,255,255,0.3)', borderTopColor:'#fff', borderRadius:'50%', animation:'spin 0.8s linear infinite' }} />
      ) : <>{label} {icon}</>}
    </button>
  )
}

function StepDot({ n, active, done }) {
  return (
    <div style={{ width:30, height:30, borderRadius:'50%', background: done ? C.green : active ? C.coral : C.surface2, border:`2px solid ${done ? C.green : active ? C.coral : C.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:D.display, fontWeight:700, fontSize:'0.8rem', color: done || active ? '#fff' : C.textMuted, transition:'all 0.3s', flexShrink:0 }}>
      {done ? '✓' : n}
    </div>
  )
}

export default function AuthPage() {
  const [mode, setMode] = useState('login')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    email:'', password:'', confirmPassword:'', username:'',
    vehicleMake:'', vehicleModel:'', vehicleYear:'', vehicleType:'car'
  })

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const u = (k, v) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const validateLogin = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep1 = () => {
    const e = {}
    if (!form.username || form.username.length < 3) e.username = 'At least 3 characters'
    if (!form.email) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password || form.password.length < 8) e.password = 'At least 8 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e = {}
    if (!form.vehicleMake) e.vehicleMake = 'Select a make'
    if (!form.vehicleModel) e.vehicleModel = 'Enter your model'
    if (!form.vehicleYear || form.vehicleYear < 1950 || form.vehicleYear > 2026) e.vehicleYear = 'Enter a valid year'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateLogin()) return
    setLoading(true)
    const { error } = await signIn(form.email, form.password)
    if (error) setErrors({ general: error.message })
    else navigate('/app')
    setLoading(false)
  }

  const handleStep1 = (e) => {
    e.preventDefault()
    if (validateStep1()) setMode('vehicle')
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!validateStep2()) return
    setLoading(true)
    const vehicle = { make:form.vehicleMake, model:form.vehicleModel, year:form.vehicleYear, type:form.vehicleType }
    const { error } = await signUp(form.email, form.password, form.username, vehicle)
    if (error) setErrors({ general: error.message })
    else navigate('/app')
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', background:C.bg, fontFamily:D.body }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        input::placeholder { color: #8b90a0; }
        select option { background: #2a2f40; color: #EDEEF0; }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div style={{ width:'52%', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'3rem', position:'relative', overflow:'hidden', background:'linear-gradient(145deg, #1a1c2a 0%, #2D3142 60%, #1f2230 100%)' }}>

        {/* Background decoration */}
        <div style={{ position:'absolute', top:-100, right:-100, width:400, height:400, borderRadius:'50%', background:'rgba(239,131,84,0.06)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-80, left:-80, width:300, height:300, borderRadius:'50%', background:'rgba(79,93,117,0.15)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(191,192,192,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(191,192,192,0.03) 1px, transparent 1px)', backgroundSize:'40px 40px', pointerEvents:'none' }} />

        {/* Logo */}
        <div style={{ position:'relative', zIndex:1, display:'flex', alignItems:'center', gap:'0.75rem' }}>
          <div style={{ width:36, height:36, borderRadius:10, background:C.coral, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 13 L9 3 L15 13" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 13 L13 13" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontFamily:D.display, fontSize:'1.4rem', fontWeight:700, color:C.text, letterSpacing:'-0.02em' }}>Revvit</span>
        </div>

        {/* Main copy */}
        <div style={{ position:'relative', zIndex:1 }}>
          <div style={{ fontFamily:D.body, fontSize:'0.75rem', fontWeight:600, letterSpacing:'0.2em', textTransform:'uppercase', color:C.coral, marginBottom:'1.5rem' }}>
            ● The Automotive Social Platform
          </div>
          <h1 style={{ fontFamily:D.display, fontSize:'clamp(3rem, 6vw, 5rem)', fontWeight:700, color:C.text, lineHeight:0.95, letterSpacing:'-0.03em', marginBottom:'1.5rem' }}>
            Your<br/>
            Machine<span style={{ color:C.coral }}>.</span><br/>
            Your Story<span style={{ color:C.coral }}>.</span>
          </h1>
          <p style={{ fontFamily:D.body, fontSize:'1rem', color:C.textMuted, lineHeight:1.65, maxWidth:400, marginBottom:'2.5rem' }}>
            The only social platform built around your vehicle. Show it off, connect with crews, track motorsport, and find parts.
          </p>

          {/* Stats */}
          <div style={{ display:'flex', gap:'2.5rem', paddingTop:'2rem', borderTop:'1px solid rgba(191,192,192,0.1)' }}>
            {[['50K+','Enthusiasts'],['120K+','Vehicles'],['340+','Live Events']].map(([num, label]) => (
              <div key={label}>
                <div style={{ fontFamily:D.display, fontSize:'1.8rem', fontWeight:700, color:C.coral, lineHeight:1 }}>{num}</div>
                <div style={{ fontFamily:D.body, fontSize:'0.78rem', color:C.textMuted, marginTop:'0.25rem' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tags */}
        <div style={{ position:'relative', zIndex:1, display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
          {['F1 2026','MotoGP','JDM','Drift','Track Days','Meetups','Mods'].map(tag => (
            <span key={tag} style={{ fontFamily:D.body, fontSize:'0.75rem', fontWeight:500, padding:'0.3rem 0.75rem', background:'rgba(191,192,192,0.06)', border:'1px solid rgba(191,192,192,0.1)', borderRadius:20, color:C.textMuted }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ flex:1, display:'flex', alignItems:'center', justifyContent:'center', padding:'2rem', background:C.bg, overflowY:'auto' }}>
        <div style={{ width:'100%', maxWidth:420, animation:'fadeIn 0.4s ease' }}>

          {/* ══ LOGIN ══ */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
              <div>
                <h2 style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:700, color:C.text, lineHeight:1, marginBottom:'0.5rem', letterSpacing:'-0.02em' }}>Welcome back</h2>
                <p style={{ fontFamily:D.body, fontSize:'0.9rem', color:C.textMuted }}>Your garage is waiting.</p>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <InputField label="Email" type="email" value={form.email} onChange={v => u('email', v)} placeholder="you@example.com" error={errors.email} />
                <InputField label="Password" type={showPass ? 'text' : 'password'} value={form.password} onChange={v => u('password', v)} placeholder="Your password"
                  error={errors.password}
                  suffix={
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ background:'none', border:'none', cursor:'pointer', color:C.textMuted, display:'flex', alignItems:'center' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  } />
              </div>

              {errors.general && (
                <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:10, padding:'0.75rem 1rem', fontFamily:D.body, fontSize:'0.85rem', color:C.red }}>
                  {errors.general}
                </div>
              )}

              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <SubmitBtn loading={loading} label="Sign In" icon="→" />
                <div style={{ textAlign:'center' }}>
                  <button type="button" style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textMuted, background:'none', border:'none', cursor:'pointer' }}>
                    Forgot password?
                  </button>
                </div>
              </div>

              <div style={{ textAlign:'center', fontFamily:D.body, fontSize:'0.88rem', color:C.textMuted }}>
                No account?{' '}
                <button type="button" onClick={() => { setMode('signup'); setErrors({}) }}
                  style={{ color:C.coral, background:'none', border:'none', cursor:'pointer', fontWeight:600, fontSize:'0.88rem' }}>
                  Create one free →
                </button>
              </div>
            </form>
          )}

          {/* ══ SIGNUP STEP 1 ══ */}
          {mode === 'signup' && (
            <form onSubmit={handleStep1} style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
              {/* Steps */}
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.5rem' }}>
                  <StepDot n="1" active={true} done={false} />
                  <div style={{ flex:1, height:2, background:`linear-gradient(to right, ${C.coral}, rgba(191,192,192,0.15))`, borderRadius:1 }} />
                  <StepDot n="2" active={false} done={false} />
                  <div style={{ flex:1, height:2, background:'rgba(191,192,192,0.1)', borderRadius:1 }} />
                  <StepDot n="3" active={false} done={false} />
                </div>
                <h2 style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:700, color:C.text, lineHeight:1, marginBottom:'0.4rem', letterSpacing:'-0.02em' }}>Create account</h2>
                <p style={{ fontFamily:D.body, fontSize:'0.88rem', color:C.textMuted }}>Step 1 of 3 — Your credentials</p>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <InputField label="Username" value={form.username} onChange={v => u('username', v)} placeholder="your_garage_name" error={errors.username} />
                <InputField label="Email" type="email" value={form.email} onChange={v => u('email', v)} placeholder="you@example.com" error={errors.email} />
                <InputField label="Password" type={showPass ? 'text' : 'password'} value={form.password} onChange={v => u('password', v)} placeholder="At least 8 characters"
                  error={errors.password}
                  suffix={
                    <button type="button" onClick={() => setShowPass(!showPass)} style={{ background:'none', border:'none', cursor:'pointer', color:C.textMuted, display:'flex', alignItems:'center' }}>
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  } />

                {/* Password strength */}
                {form.password && (
                  <div>
                    <div style={{ display:'flex', gap:'0.3rem', marginBottom:'0.4rem' }}>
                      {[1,2,3,4].map(i => {
                        const strength = form.password.length >= 12 ? 4 : form.password.length >= 10 ? 3 : form.password.length >= 8 ? 2 : 1
                        return <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i <= strength ? (strength >= 4 ? C.green : strength >= 3 ? '#f5a623' : strength >= 2 ? C.coral : C.red) : 'rgba(191,192,192,0.1)', transition:'background 0.3s' }} />
                      })}
                    </div>
                    <div style={{ fontFamily:D.body, fontSize:'0.72rem', color:C.textMuted }}>
                      {form.password.length >= 12 ? '✓ Strong password' : form.password.length >= 10 ? 'Good — add more chars' : form.password.length >= 8 ? 'Fair — could be stronger' : 'Too short'}
                    </div>
                  </div>
                )}

                <InputField label="Confirm Password" type="password" value={form.confirmPassword} onChange={v => u('confirmPassword', v)} placeholder="Repeat your password"
                  error={errors.confirmPassword}
                  suffix={form.confirmPassword && form.password === form.confirmPassword ? <span style={{ color:C.green, fontSize:'1rem' }}>✓</span> : null} />
              </div>

              <SubmitBtn loading={false} label="Next: Add Your Ride" icon="→" />

              <div style={{ textAlign:'center', fontFamily:D.body, fontSize:'0.88rem', color:C.textMuted }}>
                Already have an account?{' '}
                <button type="button" onClick={() => { setMode('login'); setErrors({}) }}
                  style={{ color:C.coral, background:'none', border:'none', cursor:'pointer', fontWeight:600, fontSize:'0.88rem' }}>
                  Sign in
                </button>
              </div>
            </form>
          )}

          {/* ══ SIGNUP STEP 2 — Vehicle ══ */}
          {mode === 'vehicle' && (
            <form onSubmit={handleSignup} style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
              {/* Steps */}
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1.5rem' }}>
                  <StepDot n="1" active={false} done={true} />
                  <div style={{ flex:1, height:2, background:C.coral, borderRadius:1 }} />
                  <StepDot n="2" active={true} done={false} />
                  <div style={{ flex:1, height:2, background:'rgba(191,192,192,0.1)', borderRadius:1 }} />
                  <StepDot n="3" active={false} done={false} />
                </div>
                <h2 style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:700, color:C.text, lineHeight:1, marginBottom:'0.4rem', letterSpacing:'-0.02em' }}>Add your ride</h2>
                <p style={{ fontFamily:D.body, fontSize:'0.88rem', color:C.textMuted }}>Step 2 of 3 — Your machine</p>
              </div>

              {/* Vehicle type toggle */}
              <div>
                <label style={{ fontFamily:D.body, fontSize:'0.75rem', fontWeight:600, color:C.textMuted, letterSpacing:'0.06em', textTransform:'uppercase', display:'block', marginBottom:'0.5rem' }}>Vehicle Type</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.75rem' }}>
                  {[['car','🚗 Car'],['bike','🏍️ Bike']].map(([val, label]) => (
                    <button key={val} type="button" onClick={() => u('vehicleType', val)}
                      style={{ padding:'0.85rem', borderRadius:12, background: form.vehicleType===val ? 'rgba(239,131,84,0.15)' : C.surface2, border:`1.5px solid ${form.vehicleType===val ? C.coral : C.border}`, cursor:'pointer', fontFamily:D.body, fontWeight:600, fontSize:'0.9rem', color: form.vehicleType===val ? C.coral : C.textMuted, transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:'0.5rem' }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
                <SelectField label="Make / Brand" value={form.vehicleMake} onChange={v => u('vehicleMake', v)} options={CAR_MAKES} error={errors.vehicleMake} />
                <InputField label="Model" value={form.vehicleModel} onChange={v => u('vehicleModel', v)} placeholder="e.g. Civic, Duke 390" error={errors.vehicleModel} />
                <InputField label="Year" type="number" value={form.vehicleYear} onChange={v => u('vehicleYear', v)} placeholder="e.g. 2022" error={errors.vehicleYear} />
              </div>

              {errors.general && (
                <div style={{ background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.25)', borderRadius:10, padding:'0.75rem 1rem', fontFamily:D.body, fontSize:'0.85rem', color:C.red }}>
                  {errors.general}
                </div>
              )}

              <SubmitBtn loading={loading} label="Next: Verify Email" icon="→" />

              <button type="button" onClick={() => setMode('signup')}
                style={{ background:'none', border:'none', cursor:'pointer', fontFamily:D.body, fontSize:'0.85rem', color:C.textMuted, textAlign:'center', padding:'0.25rem' }}>
                ← Back
              </button>
            </form>
          )}

          {/* ══ STEP 3 — Email Verification ══ */}
          {mode === 'verify' && (
            <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem', textAlign:'center', animation:'fadeIn 0.4s ease' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.5rem' }}>
                <StepDot n="1" active={false} done={true} />
                <div style={{ flex:1, height:2, background:C.coral, borderRadius:1 }} />
                <StepDot n="2" active={false} done={true} />
                <div style={{ flex:1, height:2, background:C.coral, borderRadius:1 }} />
                <StepDot n="3" active={true} done={false} />
              </div>

              <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(94,170,126,0.12)', border:'2px solid rgba(94,170,126,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', margin:'1rem auto 0' }}>
                📧
              </div>

              <div>
                <h2 style={{ fontFamily:D.display, fontSize:'2rem', fontWeight:700, color:C.text, lineHeight:1, marginBottom:'0.5rem', letterSpacing:'-0.02em' }}>Check your inbox</h2>
                <p style={{ fontFamily:D.body, fontSize:'0.9rem', color:C.textMuted, lineHeight:1.6 }}>
                  We sent a verification link to<br/>
                  <strong style={{ color:C.text }}>{form.email}</strong>
                </p>
              </div>

              <div style={{ background:C.surface, border:`1px solid ${C.border}`, borderRadius:14, padding:'1.25rem', textAlign:'left' }}>
                <div style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textMuted, lineHeight:1.7 }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem' }}><span style={{ color:C.green }}>✓</span> Account created successfully</div>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.5rem' }}><span style={{ color:C.green }}>✓</span> {form.vehicleType === 'bike' ? '🏍️' : '🚗'} {form.vehicleYear} {form.vehicleMake} {form.vehicleModel} added</div>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.5rem' }}><span style={{ color:C.coral }}>◎</span> Email verification pending</div>
                </div>
              </div>

              <button onClick={() => navigate('/app')}
                style={{ width:'100%', padding:'0.95rem', background:C.coral, border:'none', borderRadius:12, color:'#fff', fontFamily:D.body, fontWeight:700, fontSize:'0.95rem', cursor:'pointer', transition:'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background=C.coralDim}
                onMouseLeave={e => e.currentTarget.style.background=C.coral}>
                Enter Your Garage →
              </button>

              <div style={{ fontFamily:D.body, fontSize:'0.82rem', color:C.textMuted }}>
                Didn't get the email?{' '}
                <button style={{ color:C.coral, background:'none', border:'none', cursor:'pointer', fontWeight:600, fontSize:'0.82rem' }}>Resend</button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}