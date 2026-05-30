import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Car, ChevronRight, Gauge, Zap } from 'lucide-react'

const CAR_MAKES = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Volkswagen',
  'Hyundai', 'Kia', 'Nissan', 'Mazda', 'Suzuki', 'Mahindra', 'Tata', 'Royal Enfield',
  'Yamaha', 'Bajaj', 'Hero', 'KTM', 'Kawasaki', 'Ducati', 'Harley-Davidson', 'Other']

export default function AuthPage() {
  const [mode, setMode] = useState('login') // 'login' | 'signup' | 'vehicle'
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    email: '', password: '', username: '',
    vehicleMake: '', vehicleModel: '', vehicleYear: '', vehicleType: 'car'
  })

  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()

  const update = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await signIn(form.email, form.password)
    if (error) setError(error.message)
    else navigate('/app')
    setLoading(false)
  }

  const handleSignupStep1 = (e) => {
    e.preventDefault()
    if (!form.email || !form.password || !form.username) return
    setMode('vehicle')
  }

  const handleSignupComplete = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const vehicle = {
      make: form.vehicleMake,
      model: form.vehicleModel,
      year: form.vehicleYear,
      type: form.vehicleType
    }
    const { error } = await signUp(form.email, form.password, form.username, vehicle)
    if (error) setError(error.message)
    else navigate('/app')
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'var(--bg-primary)' }}>
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0800 100%)' }}>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />

        {/* Diagonal accent */}
        <div className="absolute bottom-0 right-0 w-96 h-96 opacity-20"
          style={{
            background: 'radial-gradient(circle, var(--accent-orange) 0%, transparent 70%)'
          }} />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded flex items-center justify-center"
              style={{ background: 'var(--accent-orange)' }}>
              <Gauge size={22} color="white" />
            </div>
            <span className="text-2xl font-bold tracking-widest" style={{ fontFamily: 'Bebas Neue' }}>
              REVVIT
            </span>
          </div>
        </div>

        <div className="relative z-10">
          <h1 className="text-7xl leading-none mb-6" style={{ fontFamily: 'Bebas Neue', color: 'var(--text-primary)' }}>
            YOUR<br />
            <span style={{ color: 'var(--accent-orange)' }}>MACHINE</span><br />
            YOUR STORY
          </h1>
          <p className="text-lg" style={{ color: 'var(--text-secondary)', fontFamily: 'Rajdhani' }}>
            The only social platform built around your vehicle.<br />
            Show it off. Connect. Upgrade.
          </p>

          <div className="mt-10 flex gap-8">
            {[['50K+', 'Enthusiasts'], ['120K+', 'Vehicles'], ['1M+', 'Posts']].map(([num, label]) => (
              <div key={label}>
                <div className="text-3xl font-bold" style={{ fontFamily: 'Bebas Neue', color: 'var(--accent-orange)' }}>{num}</div>
                <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex gap-4">
          {['F1', 'MotoGP', 'Cars', 'Bikes', 'Mods', 'Meets'].map(tag => (
            <span key={tag} className="px-3 py-1 rounded-full text-xs border"
              style={{ borderColor: 'var(--border-bright)', color: 'var(--text-muted)' }}>
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8"
        style={{ background: 'var(--bg-secondary)' }}>

        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-9 h-9 rounded flex items-center justify-center"
              style={{ background: 'var(--accent-orange)' }}>
              <Gauge size={18} color="white" />
            </div>
            <span className="text-2xl tracking-widest" style={{ fontFamily: 'Bebas Neue' }}>REVVIT</span>
          </div>

          <AnimatePresence mode="wait">

            {/* LOGIN */}
            {mode === 'login' && (
              <motion.div key="login"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-4xl mb-1" style={{ fontFamily: 'Bebas Neue' }}>Welcome Back</h2>
                <p className="mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Your garage is waiting.
                </p>

                <form onSubmit={handleLogin} className="space-y-4">
                  <InputField label="Email" type="email" value={form.email}
                    onChange={v => update('email', v)} placeholder="you@example.com" />
                  <InputField label="Password" type={showPass ? 'text' : 'password'}
                    value={form.password} onChange={v => update('password', v)}
                    placeholder="••••••••"
                    suffix={
                      <button type="button" onClick={() => setShowPass(!showPass)}>
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    } />

                  {error && <p className="text-sm" style={{ color: '#ff4444' }}>{error}</p>}

                  <SubmitBtn loading={loading} label="START ENGINE" />
                </form>

                <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                  No account?{' '}
                  <button onClick={() => setMode('signup')} className="font-semibold hover:underline"
                    style={{ color: 'var(--accent-orange)' }}>
                    Join the crew
                  </button>
                </p>
              </motion.div>
            )}

            {/* SIGNUP STEP 1 */}
            {mode === 'signup' && (
              <motion.div key="signup"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-3 mb-6">
                  <StepDot active={true} num="1" />
                  <div className="flex-1 h-px" style={{ background: 'var(--border)' }} />
                  <StepDot active={false} num="2" />
                </div>

                <h2 className="text-4xl mb-1" style={{ fontFamily: 'Bebas Neue' }}>Create Account</h2>
                <p className="mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Step 1 of 2 — Your credentials
                </p>

                <form onSubmit={handleSignupStep1} className="space-y-4">
                  <InputField label="Username" type="text" value={form.username}
                    onChange={v => update('username', v)} placeholder="your_garage_name" />
                  <InputField label="Email" type="email" value={form.email}
                    onChange={v => update('email', v)} placeholder="you@example.com" />
                  <InputField label="Password" type={showPass ? 'text' : 'password'}
                    value={form.password} onChange={v => update('password', v)}
                    placeholder="Min. 8 characters"
                    suffix={
                      <button type="button" onClick={() => setShowPass(!showPass)}>
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    } />

                  <SubmitBtn loading={false} label="NEXT: ADD YOUR RIDE" icon={<ChevronRight size={16} />} />
                </form>

                <p className="mt-6 text-center text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Already a member?{' '}
                  <button onClick={() => setMode('login')} className="font-semibold hover:underline"
                    style={{ color: 'var(--accent-orange)' }}>
                    Log in
                  </button>
                </p>
              </motion.div>
            )}

            {/* SIGNUP STEP 2 - Vehicle */}
            {mode === 'vehicle' && (
              <motion.div key="vehicle"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex items-center gap-3 mb-6">
                  <StepDot active={true} num="1" done />
                  <div className="flex-1 h-px" style={{ background: 'var(--accent-orange)' }} />
                  <StepDot active={true} num="2" />
                </div>

                <h2 className="text-4xl mb-1" style={{ fontFamily: 'Bebas Neue' }}>Add Your Ride</h2>
                <p className="mb-8 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Step 2 of 2 — Tell us about your machine
                </p>

                <form onSubmit={handleSignupComplete} className="space-y-4">
                  {/* Vehicle Type Toggle */}
                  <div>
                    <label className="block text-xs mb-2 tracking-wider uppercase"
                      style={{ color: 'var(--text-secondary)' }}>Vehicle Type</label>
                    <div className="flex gap-3">
                      {['car', 'bike'].map(type => (
                        <button key={type} type="button"
                          onClick={() => update('vehicleType', type)}
                          className="flex-1 py-3 rounded-lg text-sm font-semibold uppercase tracking-wider transition-all"
                          style={{
                            background: form.vehicleType === type ? 'var(--accent-orange)' : 'var(--bg-card)',
                            color: form.vehicleType === type ? 'white' : 'var(--text-secondary)',
                            border: `1px solid ${form.vehicleType === type ? 'var(--accent-orange)' : 'var(--border)'}`
                          }}>
                          {type === 'car' ? '🚗 Car' : '🏍️ Bike'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Make Dropdown */}
                  <div>
                    <label className="block text-xs mb-2 tracking-wider uppercase"
                      style={{ color: 'var(--text-secondary)' }}>Make / Brand</label>
                    <select value={form.vehicleMake} onChange={e => update('vehicleMake', e.target.value)}
                      className="w-full px-4 py-3 rounded-lg text-sm outline-none"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text-primary)' }}>
                      <option value="">Select make</option>
                      {CAR_MAKES.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>

                  <InputField label="Model" type="text" value={form.vehicleModel}
                    onChange={v => update('vehicleModel', v)} placeholder="e.g. Civic, Duke 390" />
                  <InputField label="Year" type="number" value={form.vehicleYear}
                    onChange={v => update('vehicleYear', v)} placeholder="e.g. 2022" />

                  {error && <p className="text-sm" style={{ color: '#ff4444' }}>{error}</p>}

                  <SubmitBtn loading={loading} label="ENTER THE GARAGE" icon={<Zap size={16} />} />
                </form>

                <button onClick={() => setMode('signup')} className="mt-4 text-sm w-full text-center hover:underline"
                  style={{ color: 'var(--text-muted)' }}>
                  ← Back
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

/* ── Reusable sub-components ─────────────────────────── */

function InputField({ label, type, value, onChange, placeholder, suffix }) {
  return (
    <div>
      <label className="block text-xs mb-2 tracking-wider uppercase"
        style={{ color: 'var(--text-secondary)' }}>{label}</label>
      <div className="relative">
        <input type={type} value={value} onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
          style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border)',
            color: 'var(--text-primary)',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--accent-orange)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        {suffix && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--text-muted)' }}>
            {suffix}
          </div>
        )}
      </div>
    </div>
  )
}

function SubmitBtn({ loading, label, icon }) {
  return (
    <button type="submit" disabled={loading}
      className="w-full py-3 rounded-lg font-bold tracking-widest text-sm flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95"
      style={{ background: loading ? 'var(--bg-elevated)' : 'var(--accent-orange)', color: 'white', fontFamily: 'Bebas Neue', fontSize: '16px' }}>
      {loading ? (
        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
      ) : (
        <>{label} {icon}</>
      )}
    </button>
  )
}

function StepDot({ num, active, done }) {
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all"
      style={{
        background: done || active ? 'var(--accent-orange)' : 'var(--bg-card)',
        color: done || active ? 'white' : 'var(--text-muted)',
        border: `2px solid ${done || active ? 'var(--accent-orange)' : 'var(--border)'}`
      }}>
      {done ? '✓' : num}
    </div>
  )
}
