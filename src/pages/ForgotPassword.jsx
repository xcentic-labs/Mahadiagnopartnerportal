import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import AuthLayout from '../components/AuthLayout'
import PasswordInput from '../components/PasswordInput'
import api, { errorMessage } from '../utils/api'

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const sendOtp = async (e) => {
    e?.preventDefault()
    if (!/^\d{10}$/.test(phoneNumber)) return toast.error('Enter a valid 10-digit phone number')
    setLoading(true)
    try {
      await api.post('/partners/getotp', { phoneNumber })
      toast.success('OTP sent successfully')
      setStep(2)
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to send OTP'))
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (e) => {
    e?.preventDefault()
    if (!otp || !password) return toast.error('Enter the OTP and a new password')
    if (password !== confirm) return toast.error('Passwords do not match')
    setLoading(true)
    try {
      await api.post('/partners/chagepassword', { phoneNumber, otp, password, type: 'partner' })
      toast.success('Password changed successfully. Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to change password'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Forgot Password" subtitle="Reset your password using the OTP sent to your registered phone number.">
      {step === 1 ? (
        <form onSubmit={sendOtp} className="space-y-4">
          <div>
            <label className="label">Phone Number</label>
            <input
              className="input"
              type="tel"
              maxLength={10}
              placeholder="Registered phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
            {loading ? 'Sending...' : 'Get OTP'}
          </button>
        </form>
      ) : (
        <form onSubmit={changePassword} className="space-y-4">
          <p className="text-sm text-gray-500">
            OTP sent to <span className="font-semibold text-gray-700">+91 {phoneNumber}</span>.{' '}
            <button type="button" className="text-primary font-semibold cursor-pointer" onClick={() => setStep(1)}>Change</button>
          </p>
          <div>
            <label className="label">OTP</label>
            <input
              className="input tracking-widest"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            />
          </div>
          <div>
            <label className="label">New Password</label>
            <PasswordInput value={password} onChange={setPassword} placeholder="New password" autoComplete="new-password" />
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <PasswordInput value={confirm} onChange={setConfirm} placeholder="Confirm new password" autoComplete="new-password" />
          </div>
          <button type="submit" className="btn-primary w-full py-3" disabled={loading}>
            {loading ? 'Updating...' : 'Change Password'}
          </button>
          <button type="button" className="w-full text-sm text-gray-500 hover:text-primary cursor-pointer" onClick={sendOtp} disabled={loading}>
            Resend OTP
          </button>
        </form>
      )}
      <p className="text-center text-sm text-gray-500 mt-6">
        Remembered it? <Link to="/login" className="text-primary font-semibold hover:underline">Back to login</Link>
      </p>
    </AuthLayout>
  )
}

export default ForgotPassword
