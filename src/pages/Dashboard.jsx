import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Stethoscope, Bike, CalendarCheck, CheckCircle2, Clock, XCircle, Wallet, BadgeCheck, AlertTriangle,
  CreditCard, Banknote, UserRound, ArrowRight,
} from 'lucide-react'
import { usePartnerDetails } from '../hooks/usePartnerDetails'
import { Loader, ErrorState } from '../components/States'
import StatusBadge from '../components/StatusBadge'
import api from '../utils/api'
import { formatCurrency, formatDateTime } from '../utils/format'

const quickActions = [
  { name: 'Services', icon: Stethoscope, color: '#009e92', route: '/services' },
  { name: 'Appointments', icon: CalendarCheck, color: '#3B82F6', route: '/appointments' },
  { name: 'Service Boys', icon: Bike, color: '#F59E0B', route: '/service-boys' },
  { name: 'Buy Subscription', icon: CreditCard, color: '#8B5CF6', route: '/subscription' },
  { name: 'Wallet', icon: Wallet, color: '#10B981', route: '/wallet' },
  { name: 'Payment Method', icon: Banknote, color: '#EC4899', route: '/payment-method' },
  { name: 'Profile', icon: UserRound, color: '#0C2E50', route: '/profile' },
]

const StatCard = ({ label, value, icon: Icon, color }) => (
  <div className="card p-5 flex items-center justify-between hover:shadow-md transition-shadow" style={{ borderLeft: `4px solid ${color}` }}>
    <div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
    <div className="p-3 rounded-xl" style={{ backgroundColor: `${color}15` }}>
      <Icon className="w-7 h-7" style={{ color }} />
    </div>
  </div>
)

const Dashboard = () => {
  const navigate = useNavigate()
  const { partner, details, loading, error, refresh } = usePartnerDetails()
  const [recent, setRecent] = useState([])

  useEffect(() => {
    if (!partner?.id) return
    api.get(`/appointment/partnerappointement/${partner.id}?status=all`)
      .then((res) => setRecent((res.data.myAppointments || []).slice(0, 5)))
      .catch(() => setRecent([]))
  }, [partner?.id])

  const appointments = details?.appointment || []
  const count = (status) => appointments.filter((a) => a.status?.toUpperCase() === status).length
  const activeSubscriptions = (details?.subscription_purchase || []).filter((s) => new Date(s.expiresAt) > new Date())

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, {partner?.hospitalName}</h2>
        <p className="text-gray-500 mt-1">Here's an overview of your hospital on MahaDiagno.</p>
      </div>

      {loading ? (
        <Loader text="Loading dashboard..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <>
          {!details?.isSubscribed && (
            <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
              <div className="flex-1">
                <p className="text-amber-800 font-semibold">Your services are not visible to users</p>
                <p className="text-amber-700 text-sm">Subscribe to a plan to list your services and add service boys.</p>
              </div>
              <Link to="/subscription" className="btn-primary !py-2 text-sm shrink-0">Subscribe</Link>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
            <StatCard label="Wallet Balance" value={formatCurrency(details?.amount)} icon={Wallet} color="#10B981" />
            <StatCard label="My Services" value={details?.services?.length || 0} icon={Stethoscope} color="#009e92" />
            <StatCard label="Service Boys" value={details?.serviceBoy?.length || 0} icon={Bike} color="#F59E0B" />
            <StatCard
              label="Subscription"
              value={details?.isSubscribed ? 'Active' : 'Inactive'}
              icon={BadgeCheck}
              color={details?.isSubscribed ? '#8B5CF6' : '#9CA3AF'}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Appointments" value={appointments.length} icon={CalendarCheck} color="#3B82F6" />
            <StatCard label="Scheduled" value={count('SCHEDULED')} icon={Clock} color="#F59E0B" />
            <StatCard label="Completed" value={count('COMPLETED')} icon={CheckCircle2} color="#10B981" />
            <StatCard label="Cancelled" value={count('CANCELLED')} icon={XCircle} color="#EF4444" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="card p-5 lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900">Recent Appointments</h3>
                <Link to="/appointments" className="text-sm text-primary font-semibold flex items-center gap-1">
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              {recent.length === 0 ? (
                <p className="text-gray-500 text-sm py-8 text-center">No appointments yet.</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500 border-b border-gray-100">
                        <th className="py-2 pr-3 font-medium">ID</th>
                        <th className="py-2 pr-3 font-medium">Patient</th>
                        <th className="py-2 pr-3 font-medium">Service</th>
                        <th className="py-2 pr-3 font-medium">Date</th>
                        <th className="py-2 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recent.map((a) => (
                        <tr key={a.id} className="border-b border-gray-50 last:border-0">
                          <td className="py-2.5 pr-3 font-mono text-xs text-gray-600">#{a.appointementId}</td>
                          <td className="py-2.5 pr-3 text-gray-800">{a.patientFirstName} {a.patientLastName}</td>
                          <td className="py-2.5 pr-3 text-gray-600">{a.serviceId?.title || '—'}</td>
                          <td className="py-2.5 pr-3 text-gray-600 whitespace-nowrap">{formatDateTime(a.createdAt)}</td>
                          <td className="py-2.5"><StatusBadge status={a.status} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="card p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Subscription</h3>
              {activeSubscriptions.length ? (
                <div className="space-y-3">
                  {activeSubscriptions.map((s) => (
                    <div key={s.id} className="rounded-xl bg-blueshade/60 p-3">
                      <p className="text-sm text-gray-600">Expires {new Date(s.expiresAt).toLocaleDateString('en-IN')}</p>
                      <p className="text-sm font-semibold text-gray-800 mt-0.5">Service boy slots left: {s.numberOfServiceBoyLeft}</p>
                    </div>
                  ))}
                  <Link to="/my-subscriptions" className="btn-outline w-full text-sm">Manage subscriptions</Link>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No active subscription.</p>
                  <Link to="/subscription" className="btn-primary mt-4 text-sm">View plans</Link>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
          {quickActions.map((a) => (
            <button
              key={a.name}
              onClick={() => navigate(a.route)}
              className="card p-4 flex flex-col items-center hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-xl mb-2 flex items-center justify-center group-hover:scale-110 transition-transform"
                style={{ backgroundColor: `${a.color}15` }}>
                <a.icon className="w-6 h-6" style={{ color: a.color }} />
              </div>
              <span className="text-gray-800 font-semibold text-xs sm:text-sm text-center">{a.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
