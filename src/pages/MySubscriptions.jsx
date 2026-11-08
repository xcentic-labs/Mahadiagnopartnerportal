import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CalendarDays, CalendarCheck, Users, Clock, IndianRupee, CheckCircle2, UserPlus } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Modal from '../components/Modal'
import PasswordInput from '../components/PasswordInput'
import { Loader, ErrorState, EmptyState } from '../components/States'
import { usePartner } from '../hooks/usePartner'
import api, { errorMessage } from '../utils/api'
import { formatCurrency, formatDate } from '../utils/format'

const emptyBoy = { firstName: '', lastName: '', phoneNumber: '', email: '', password: '' }

const MySubscriptions = () => {
  const partner = usePartner()
  const partnerId = partner?.id
  const [subs, setSubs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [addFor, setAddFor] = useState(null) // purchased subscription id
  const [boy, setBoy] = useState(emptyBoy)
  const [saving, setSaving] = useState(false)

  const fetchSubs = useCallback(async () => {
    if (!partnerId) return
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/subscriptionpurchase/getmysubscriptions/${partnerId}`)
      setSubs(res.data.subscriptions || [])
    } catch (err) {
      setError(errorMessage(err, 'Error fetching subscriptions'))
    } finally {
      setLoading(false)
    }
  }, [partnerId])

  useEffect(() => {
    fetchSubs()
  }, [fetchSubs])

  const handleAddBoy = async (e) => {
    e.preventDefault()
    const { firstName, lastName, phoneNumber, email, password } = boy
    if (!firstName.trim() || !lastName.trim() || !phoneNumber || !email.trim() || !password) return toast.error('All fields are required')
    if (!/^[6-9]\d{9}$/.test(phoneNumber)) return toast.error('Enter a valid 10-digit phone number')
    if (!/\S+@\S+\.\S+/.test(email)) return toast.error('Enter a valid email address')

    setSaving(true)
    try {
      await api.post('/serviceboy/addserviceboy', {
        ...boy,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        partnerId: Number(partner.id),
        subscriptionId: Number(addFor),
      })
      toast.success('Service boy added successfully')
      setAddFor(null)
      setBoy(emptyBoy)
      fetchSubs()
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to add service boy'))
    } finally {
      setSaving(false)
    }
  }

  const field = (key, label, props = {}) => (
    <div>
      <label className="label">{label} <span className="text-red-500">*</span></label>
      <input className="input" placeholder={label} value={boy[key]} onChange={(e) => setBoy({ ...boy, [key]: props.digits ? e.target.value.replace(/\D/g, '') : e.target.value })} {...(props.digits ? { maxLength: 10, inputMode: 'numeric' } : {})} type={props.type || 'text'} />
    </div>
  )

  return (
    <div>
      <PageHeader
        title="My Subscriptions"
        subtitle="Your purchased plans and remaining service boy slots"
        action={<Link to="/subscription" className="btn-outline">View plans</Link>}
      />

      {loading ? (
        <Loader text="Loading subscriptions..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchSubs} />
      ) : subs.length === 0 ? (
        <EmptyState title="No subscriptions found" message="Buy a plan to start adding service boys." action={<Link to="/subscription" className="btn-primary">Buy Subscription</Link>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {subs.map((sub) => {
            const expired = new Date(sub.expiresAt) < new Date()
            const canAdd = sub.numberOfServiceBoyLeft > 0 && !expired
            return (
              <div key={sub.id} className="card p-6 flex flex-col">
                <div className="flex items-center justify-between gap-2 mb-4">
                  <h3 className="text-xl font-bold text-gray-900">{sub.subscription?.subscriptionName || 'Plan'}</h3>
                  <span className={`px-2.5 py-1 text-xs rounded-md font-semibold ${expired ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                    {expired ? 'Expired' : 'Active'}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="flex items-center gap-2"><CalendarDays className="w-4 h-4 text-indigo-500" /> Purchased: {formatDate(sub.purchasedAt)}</p>
                  {sub.renewedAt && <p className="flex items-center gap-2"><CalendarCheck className="w-4 h-4 text-emerald-500" /> Renewed: {formatDate(sub.renewedAt)}</p>}
                  <p className="flex items-center gap-2"><CalendarCheck className="w-4 h-4 text-emerald-500" /> Expires: {formatDate(sub.expiresAt)}</p>
                  <p className="flex items-center gap-2"><Users className="w-4 h-4 text-amber-500" /> Service boys left: <span className="font-semibold">{sub.numberOfServiceBoyLeft}</span></p>
                  {sub.subscription && (
                    <>
                      <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-gray-500" /> Duration: {sub.subscription.timePeriod} Month(s)</p>
                      <p className="flex items-center gap-2"><IndianRupee className="w-4 h-4 text-red-500" /> {formatCurrency(sub.subscription.price)}</p>
                    </>
                  )}
                </div>
                {sub.subscription?.benefits && (
                  <div className="mt-4 flex-1">
                    <p className="text-sm font-semibold text-gray-700 mb-1.5">Benefits</p>
                    <ul className="space-y-1.5">
                      {sub.subscription.benefits.split(',').filter((b) => b.trim()).map((b, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> {b.trim()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {canAdd && (
                  <button className="btn-primary w-full mt-5" onClick={() => { setBoy(emptyBoy); setAddFor(sub.id) }}>
                    <UserPlus className="w-5 h-5" /> Add Service Boy
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      <Modal open={!!addFor} title="Add Service Boy" onClose={() => setAddFor(null)}>
        <form onSubmit={handleAddBoy} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {field('firstName', 'First Name')}
            {field('lastName', 'Last Name')}
          </div>
          {field('phoneNumber', 'Phone Number', { digits: true })}
          {field('email', 'Email', { type: 'email' })}
          <div>
            <label className="label">Password <span className="text-red-500">*</span></label>
            <PasswordInput value={boy.password} onChange={(v) => setBoy({ ...boy, password: v })} autoComplete="new-password" />
            <p className="text-xs text-gray-500 mt-1">The service boy uses this phone number and password to log in to the Service Boy app.</p>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-outline flex-1" onClick={() => setAddFor(null)}>Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>{saving ? 'Adding...' : 'Add Service Boy'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default MySubscriptions
