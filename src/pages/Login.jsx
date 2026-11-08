import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthLayout from '../components/AuthLayout'
import PasswordInput from '../components/PasswordInput'
import api, { errorMessage } from '../utils/api'
import { isLoggedIn, saveSession } from '../utils/auth'

const Login = () => {
  const navigate = useNavigate()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  if (isLoggedIn()) return <Navigate to="/dashboard" replace />

  const handleLogin = async (e) => {
    e?.preventDefault()
    if (!/^\d{10}$/.test(phoneNumber)) return toast.error('Enter a valid 10-digit phone number')
    if (!password) return toast.error('Enter your password')

    setLoading(true)
    try {
      const res = await api.post('/partners/partnerslogin', { phoneNumber, password })
      saveSession(res.data.partner)
      toast.success('Logged in successfully')
      navigate('/dashboard', { replace: true })
    } catch (err) {
      toast.error(errorMessage(err, 'Invalid credentials'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout
      title={<>Welcome back to <br />MahaDiagno Partner Portal</>}
      subtitle="Manage your services, appointments, service boys and payouts in one place."
    >
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="label">Phone Number</label>
          <input
            className="input"
            type="tel"
            inputMode="numeric"
            maxLength={10}
            placeholder="Enter your 10-digit phone number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            autoComplete="tel"
          />
        </div>
        <div>
          <label className="label">Password</label>
          <PasswordInput value={password} onChange={setPassword} />
          <div className="text-right mt-2">
            <Link to="/forgot-password" className="text-sm font-semibold text-primary hover:underline">Forgot password?</Link>
          </div>
        </div>
        <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="flex items-center my-6">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="mx-3 text-xs text-gray-400">OR</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>
      <p className="text-center text-sm text-gray-500">
        New to MahaDiagno?{' '}
        <Link to="/register" className="text-primary font-semibold hover:underline">Join as Hospital</Link>
      </p>
    </AuthLayout>
  )
}

export default Login
