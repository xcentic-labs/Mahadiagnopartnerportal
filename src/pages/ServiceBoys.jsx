import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Phone, Mail, Briefcase, Clock, CheckCircle2, MapPin, UserPlus, RefreshCw } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import ConfirmDialog from '../components/ConfirmDialog'
import { Loader, EmptyState } from '../components/States'
import { usePartner } from '../hooks/usePartner'
import api, { errorMessage } from '../utils/api'
import { formatCurrency } from '../utils/format'

const ServiceBoys = () => {
  const partner = usePartner()
  const partnerId = partner?.id
  const [boys, setBoys] = useState([])
  const [loading, setLoading] = useState(true)
  const [confirmBoy, setConfirmBoy] = useState(null)
  const [saving, setSaving] = useState(false)

  const fetchBoys = useCallback(async () => {
    if (!partnerId) return
    setLoading(true)
    try {
      const res = await api.get(`/serviceboy/getmyserviceboy/${partnerId}`)
      setBoys(res.data.serviceBoy || [])
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to fetch service boys'))
    } finally {
      setLoading(false)
    }
  }, [partnerId])

  useEffect(() => {
    fetchBoys()
  }, [fetchBoys])

  const markReceived = async () => {
    setSaving(true)
    try {
      await api.patch(`/serviceboy/updatedcashrecived/${confirmBoy.id}`)
      toast.success('Marked as received')
      setConfirmBoy(null)
      fetchBoys()
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to update'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Service Boys"
        subtitle="Your field staff, their workload and cash to collect"
        action={
          <div className="flex gap-2">
            <button className="btn-outline" onClick={fetchBoys} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
            </button>
            <Link to="/my-subscriptions" className="btn-primary"><UserPlus className="w-4 h-4" /> Add Service Boy</Link>
          </div>
        }
      />

      {loading ? (
        <Loader text="Loading service boys..." />
      ) : boys.length === 0 ? (
        <EmptyState
          title="No service boys found"
          message="Service boys are added from an active subscription."
          action={<Link to="/my-subscriptions" className="btn-primary">Go to My Subscriptions</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {boys.map((b) => (
            <div key={b.id} className="card p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">{b.firstName || 'N/A'} {b.lastName || ''}</h3>
                <span className="flex items-center gap-1.5 bg-gray-100 px-2.5 py-0.5 rounded-full text-xs font-medium">
                  <span className={`w-2 h-2 rounded-full ${b.status ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                  <span className={b.status ? 'text-emerald-600' : 'text-gray-500'}>{b.status ? 'Online' : 'Offline'}</span>
                </span>
              </div>
              <div className="space-y-1.5 text-sm text-gray-700 mb-4">
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {b.phoneNumber || 'Not provided'}</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" /> {b.email || 'Not provided'}</p>
              </div>
              <div className="grid grid-cols-3 border-t border-gray-100 pt-3 text-center">
                <div>
                  <Briefcase className="w-5 h-5 text-primary mx-auto" />
                  <p className="text-lg font-bold text-gray-900">{b.totalAppointments ?? 0}</p>
                  <p className="text-xs text-gray-500">Total</p>
                </div>
                <div>
                  <Clock className="w-5 h-5 text-amber-500 mx-auto" />
                  <p className="text-lg font-bold text-gray-900">{b.acceptedAppointments ?? 0}</p>
                  <p className="text-xs text-gray-500">Accepted</p>
                </div>
                <div>
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mx-auto" />
                  <p className="text-lg font-bold text-gray-900">{b.completedAppointments ?? 0}</p>
                  <p className="text-xs text-gray-500">Completed</p>
                </div>
              </div>
              <div className="flex justify-between items-center border-t border-gray-100 mt-3 pt-3">
                <span className="text-sm text-gray-500">Money to be received</span>
                <span className="text-primary font-bold">{formatCurrency(b.pendingMoney)}</span>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="btn-primary flex-1 !py-2 text-sm" onClick={() => setConfirmBoy(b)} disabled={!b.pendingMoney}>
                  Mark Cash Received
                </button>
                {b.status && (
                  <Link to={`/service-boys/${b.id}/track`} state={{ name: `${b.firstName || ''} ${b.lastName || ''}`.trim() }} className="btn-outline !py-2 text-sm">
                    <MapPin className="w-4 h-4" /> Track
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmBoy}
        title="Confirm cash received"
        message={confirmBoy ? `Confirm you have received ${formatCurrency(confirmBoy.pendingMoney)} from ${confirmBoy.firstName} ${confirmBoy.lastName || ''}?` : ''}
        confirmLabel="Received"
        loading={saving}
        onCancel={() => setConfirmBoy(null)}
        onConfirm={markReceived}
      />
    </div>
  )
}

export default ServiceBoys
