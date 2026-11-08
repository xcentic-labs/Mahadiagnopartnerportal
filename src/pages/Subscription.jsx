import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { CheckCircle2, Medal, Users, CalendarDays } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import { Loader, ErrorState, EmptyState } from '../components/States'
import { usePartnerDetails } from '../hooks/usePartnerDetails'
import api, { errorMessage } from '../utils/api'
import { RAZORPAY_KEY_ID } from '../utils/config'
import { loadRazorpay } from '../utils/razorpay'
import { formatCurrency } from '../utils/format'
import logo from '../assets/logo.png'

const Subscription = () => {
  const { partner, details, loading: detailsLoading, error: detailsError, refresh } = usePartnerDetails()
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [buyingId, setBuyingId] = useState(null)

  const fetchPlans = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.get('/subscription/getsubscription')
      setPlans(res.data.subscriptions || [])
    } catch (err) {
      setError(errorMessage(err, 'Failed to load subscription plans'))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPlans()
  }, [])

  const handleBuy = async (plan) => {
    setBuyingId(plan.id)
    try {
      const ready = await loadRazorpay()
      if (!ready) throw new Error('Unable to load Razorpay. Check your internet connection.')

      const { data: order } = await api.post('/order/createorder', { amount: Math.round(Number(plan.price) * 100) })

      const rzp = new window.Razorpay({
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        order_id: order.id,
        name: 'MahaDiagno',
        description: `${plan.subscriptionName} subscription`,
        image: logo,
        prefill: { name: partner.hospitalName, email: partner.email, contact: partner.phoneNumber },
        theme: { color: '#009e92' },
        handler: async (payment) => {
          try {
            await api.post('/subscriptionpurchase/buysubscription', {
              subscriptionId: Number(plan.id),
              partnersId: Number(partner.id),
              razorpay_order_id: payment.razorpay_order_id,
              razorpay_payment_id: payment.razorpay_payment_id,
              razorpay_signature: payment.razorpay_signature,
            })
            toast.success('Subscription purchased successfully')
            refresh()
          } catch (err) {
            toast.error(errorMessage(err, 'Payment received but subscription could not be activated. Contact support.'))
          } finally {
            setBuyingId(null)
          }
        },
        modal: { ondismiss: () => setBuyingId(null) },
      })
      rzp.on('payment.failed', (resp) => {
        toast.error(resp?.error?.description || 'Payment unsuccessful')
        setBuyingId(null)
      })
      rzp.open()
    } catch (err) {
      toast.error(errorMessage(err, 'Unable to start payment'))
      setBuyingId(null)
    }
  }

  if (detailsLoading) return <Loader />
  if (detailsError) return <ErrorState message={detailsError} onRetry={refresh} />

  return (
    <div>
      <PageHeader title="Subscription Plans" subtitle="Subscribe to list your services and add service boys" />

      {details?.isSubscribed ? (
        <div className="card p-10 text-center max-w-xl mx-auto">
          <div className="bg-green-100 rounded-full p-3 w-fit mx-auto mb-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">You already have an active subscription!</h3>
          <p className="text-gray-500 mt-2">Thanks for subscribing to MahaDiagno. You can manage your subscription and add service boys from My Subscriptions.</p>
          <Link to="/my-subscriptions" className="btn-primary mt-6">Go to My Subscriptions</Link>
        </div>
      ) : loading ? (
        <Loader text="Loading plans..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchPlans} />
      ) : plans.length === 0 ? (
        <EmptyState title="No subscriptions available" message="Please check back later." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="card p-6 flex flex-col hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">{plan.subscriptionName}</h3>
                <Medal className="w-7 h-7 text-primary" />
              </div>
              <p className="text-3xl font-bold text-gray-900 mt-4">{formatCurrency(plan.price)}</p>
              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                {plan.timePeriod && (
                  <span className="flex items-center gap-1.5"><CalendarDays className="w-4 h-4 text-gray-400" /> {plan.timePeriod} Month(s)</span>
                )}
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4 text-amber-500" /> {plan.numberOfServiceBoys} Service Boy(s)</span>
              </div>
              <div className="mt-5 flex-1">
                <p className="text-sm font-semibold text-gray-700 mb-2">Benefits</p>
                <ul className="space-y-2">
                  {plan.benefits?.split(',').filter((b) => b.trim()).map((b, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" /> {b.trim()}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="btn-primary w-full mt-6" onClick={() => handleBuy(plan)} disabled={buyingId !== null}>
                {buyingId === plan.id ? 'Processing...' : 'Buy Now'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Subscription
