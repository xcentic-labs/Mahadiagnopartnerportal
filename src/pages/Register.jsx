import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { LocateFixed } from 'lucide-react'
import AuthLayout from '../components/AuthLayout'
import Steps from '../components/Steps'
import PasswordInput from '../components/PasswordInput'
import LocationPicker from '../components/LocationPicker'
import api, { errorMessage } from '../utils/api'

const emptyAddress = { area: '', landmark: '', district: '', state: '', pincode: '' }

const Register = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [basic, setBasic] = useState({ hospitalName: '', email: '', phoneNumber: '' })
  const [zones, setZones] = useState([])
  const [zoneId, setZoneId] = useState('')
  const [address, setAddress] = useState(emptyAddress)
  const [location, setLocation] = useState(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')

  // Remember the created address so a retry after a failed signup doesn't create duplicates
  const savedAddress = useRef({ key: null, id: null })

  useEffect(() => {
    api.get('/zone/getzones')
      .then((res) => setZones(res.data.ZoneData || []))
      .catch(() => toast.error('Unable to load service zones'))
  }, [])

  const captureCurrentLocation = () => {
    if (!navigator.geolocation) return toast.error('Geolocation is not supported by your browser')
    const id = toast.loading('Fetching current location...')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        toast.update(id, { render: 'Location captured', type: 'success', isLoading: false, autoClose: 2000 })
      },
      () => toast.update(id, { render: 'Unable to get location. Please allow location access or pick on the map.', type: 'error', isLoading: false, autoClose: 3500 }),
      { enableHighAccuracy: true, timeout: 15000 },
    )
  }

  // Ask for location once when the address step opens
  useEffect(() => {
    if (step === 2 && !location) captureCurrentLocation()
  }, [step]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleZoneChange = (value) => {
    setZoneId(value)
    const zone = zones.find((z) => String(z.id) === value)
    setAddress((a) => ({
      ...a,
      district: zone?.district || '',
      pincode: zone?.pincode ? String(zone.pincode) : '',
      state: zone?.state || '',
    }))
  }

  const nextFromBasic = (e) => {
    e.preventDefault()
    const { hospitalName, email, phoneNumber } = basic
    if (!hospitalName.trim() || !email.trim() || !phoneNumber) return toast.error('All fields are required')
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error('Enter a valid email address')
    if (!/^\d{10}$/.test(phoneNumber)) return toast.error('Enter a valid 10-digit phone number')
    setStep(2)
  }

  const nextFromAddress = (e) => {
    e.preventDefault()
    if (!zoneId) return toast.error('Select your district')
    if (!address.area.trim() || !address.landmark.trim()) return toast.error('Enter area and landmark')
    if (!location) return toast.error('Pick your hospital location on the map')
    setStep(3)
  }

  const createAccount = async (e) => {
    e.preventDefault()
    if (!password || password.length < 6) return toast.error('Password must be at least 6 characters')
    if (password !== confirm) return toast.error('Password and confirm password should be the same')

    setLoading(true)
    try {
      const addressPayload = {
        ...address,
        lat: location.lat.toFixed(4),
        lng: location.lng.toFixed(4),
      }
      const key = JSON.stringify(addressPayload)
      let addressId = savedAddress.current.key === key ? savedAddress.current.id : null
      if (!addressId) {
        const addrRes = await api.post('/address/addaddress', addressPayload)
        addressId = addrRes.data.address.id
        savedAddress.current = { key, id: addressId }
      }

      await api.post('/partners/createaccount', {
        hospitalName: basic.hospitalName.trim(),
        email: basic.email.trim(),
        phoneNumber: basic.phoneNumber,
        addressId,
        password,
        zoneId: Number(zoneId),
      })
      toast.success('Account created successfully. Please log in.')
      navigate('/login')
    } catch (err) {
      toast.error(errorMessage(err, 'Unable to create account'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Join MahaDiagno as a Hospital" subtitle="Register your hospital to start offering diagnostic services.">
      <Steps active={step} labels={['Hospital', 'Address', 'Password']} />

      {step === 1 && (
        <form onSubmit={nextFromBasic} className="space-y-4">
          <div>
            <label className="label">Hospital Name</label>
            <input className="input" placeholder="Hospital name" value={basic.hospitalName}
              onChange={(e) => setBasic({ ...basic, hospitalName: e.target.value })} />
          </div>
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="hospital@example.com" value={basic.email}
              onChange={(e) => setBasic({ ...basic, email: e.target.value })} />
          </div>
          <div>
            <label className="label">Phone Number</label>
            <input className="input" type="tel" maxLength={10} placeholder="10-digit phone number" value={basic.phoneNumber}
              onChange={(e) => setBasic({ ...basic, phoneNumber: e.target.value.replace(/\D/g, '') })} />
          </div>
          <button type="submit" className="btn-primary w-full py-3">Next</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={nextFromAddress} className="space-y-4">
          <div>
            <label className="label">Address / Area</label>
            <input className="input" placeholder="Street, area" value={address.area}
              onChange={(e) => setAddress({ ...address, area: e.target.value })} />
          </div>
          <div>
            <label className="label">Landmark</label>
            <input className="input" placeholder="Nearby landmark" value={address.landmark}
              onChange={(e) => setAddress({ ...address, landmark: e.target.value })} />
          </div>
          <div>
            <label className="label">District / Town / City</label>
            <select className="input" value={zoneId} onChange={(e) => handleZoneChange(e.target.value)}>
              <option value="">Select a district</option>
              {zones.map((z) => (
                <option key={z.id} value={z.id}>{z.district}{z.pincode ? ` (${z.pincode})` : ''}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Pincode</label>
              <input className="input" value={address.pincode} readOnly placeholder="Auto-filled" />
            </div>
            <div>
              <label className="label">State</label>
              <input className="input" value={address.state} readOnly placeholder="Auto-filled" />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="label !mb-0">Hospital Location</label>
              <button type="button" onClick={captureCurrentLocation} className="text-sm text-primary font-semibold flex items-center gap-1 cursor-pointer">
                <LocateFixed className="w-4 h-4" /> Use current location
              </button>
            </div>
            <LocationPicker value={location} onChange={setLocation} height={240} />
            <p className="text-xs text-gray-500 mt-1.5">
              {location ? `Selected: ${location.lat.toFixed(5)}, ${location.lng.toFixed(5)} — click the map or drag the pin to adjust.` : 'Click on the map to drop a pin.'}
            </p>
          </div>
          <div className="flex gap-3">
            <button type="button" className="btn-outline flex-1" onClick={() => setStep(1)}>Back</button>
            <button type="submit" className="btn-primary flex-1">Next</button>
          </div>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={createAccount} className="space-y-4">
          <div>
            <label className="label">Password</label>
            <PasswordInput value={password} onChange={setPassword} autoComplete="new-password" />
          </div>
          <div>
            <label className="label">Confirm Password</label>
            <PasswordInput value={confirm} onChange={setConfirm} placeholder="Confirm password" autoComplete="new-password" />
            {confirm && password !== confirm && (
              <p className="text-xs text-red-600 mt-1.5">Password and confirm password should be the same</p>
            )}
          </div>
          <div className="flex gap-3">
            <button type="button" className="btn-outline flex-1" onClick={() => setStep(2)} disabled={loading}>Back</button>
            <button type="submit" className="btn-primary flex-1" disabled={loading}>
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      )}

      <p className="text-center text-sm text-gray-500 mt-6">
        Already registered? <Link to="/login" className="text-primary font-semibold hover:underline">Login here</Link>
      </p>
    </AuthLayout>
  )
}

export default Register
