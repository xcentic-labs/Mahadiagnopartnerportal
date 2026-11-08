import { useCallback, useEffect, useMemo, useState } from 'react'
import { RefreshCw, Search } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import AppointmentCard from '../components/AppointmentCard'
import { Loader, ErrorState, EmptyState } from '../components/States'
import { usePartner } from '../hooks/usePartner'
import api, { errorMessage } from '../utils/api'

// "report" = completed appointments still waiting for a report (handled by the backend)
const tabs = [
  { key: 'all', label: 'All' },
  { key: 'scheduled', label: 'Scheduled' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'report', label: 'Pending Reports' },
]

const Appointments = () => {
  const partner = usePartner()
  const partnerId = partner?.id
  const [status, setStatus] = useState('all')
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [query, setQuery] = useState('')

  const fetchAppointments = useCallback(async () => {
    if (!partnerId) return
    setLoading(true)
    setError(null)
    try {
      const res = await api.get(`/appointment/partnerappointement/${partnerId}`, { params: { status } })
      let list = res.data.myAppointments || []
      if (status === 'report') list = list.filter((a) => !a.isReportUploaded)
      setAppointments(list)
    } catch (err) {
      setError(errorMessage(err, 'Failed to load appointments'))
    } finally {
      setLoading(false)
    }
  }, [partnerId, status])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return appointments
    return appointments.filter((a) =>
      [a.appointementId, a.patientFirstName, a.patientLastName, a.serviceId?.title, a.referringDoctor]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    )
  }, [appointments, query])

  return (
    <div>
      <PageHeader
        title="Appointments"
        subtitle="Track bookings and upload reports for completed appointments"
        action={
          <button className="btn-outline" onClick={fetchAppointments} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        }
      />

      <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-6">
        <div className="flex gap-2 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setStatus(t.key)}
              className={`px-4 py-2 rounded-full border text-sm font-medium whitespace-nowrap cursor-pointer ${
                status === t.key ? 'bg-primary border-primary text-white' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative lg:ml-auto lg:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input className="input !pl-9" placeholder="Search patient, ID, service..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
      </div>

      {loading ? (
        <Loader text="Loading appointments..." />
      ) : error ? (
        <ErrorState message={error} onRetry={fetchAppointments} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No appointments found" message={status !== 'all' ? 'Try another status filter.' : undefined} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((a) => (
            <AppointmentCard key={a.id} data={a} onUpdated={fetchAppointments} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Appointments
