import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Plus, Trash2, Home, XCircle, Tag, AlertTriangle } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { Loader, EmptyState } from '../components/States'
import { usePartnerDetails } from '../hooks/usePartnerDetails'
import api, { errorMessage } from '../utils/api'
import { formatCurrency } from '../utils/format'

const emptyForm = { title: '', price: '', isHomeServiceAvail: false }

const Services = () => {
  const { partner, details } = usePartnerDetails()
  const partnerId = partner?.id
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [addOpen, setAddOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchServices = useCallback(async () => {
    if (!partnerId) return
    setLoading(true)
    try {
      const res = await api.get(`/service/getmyservices/${partnerId}`)
      setServices(res.data.services || [])
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to load services'))
    } finally {
      setLoading(false)
    }
  }, [partnerId])

  useEffect(() => {
    fetchServices()
  }, [fetchServices])

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!form.title.trim() || !form.price) return toast.error('Title and price are required')
    if (Number(form.price) <= 0) return toast.error('Enter a valid price')

    setSaving(true)
    try {
      const fd = new FormData()
      fd.append('title', form.title.trim())
      fd.append('price', form.price)
      fd.append('isHomeServiceAvail', form.isHomeServiceAvail)
      fd.append('partnerId', partner.id)
      await api.post('/service/addservice', fd)
      toast.success('Service added successfully')
      setAddOpen(false)
      setForm(emptyForm)
      fetchServices()
    } catch (err) {
      toast.error(errorMessage(err, 'Error adding service'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/service/deleteservice/${deleteId}`)
      toast.success('Service deleted successfully')
      setDeleteId(null)
      fetchServices()
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to delete service'))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="My Services"
        subtitle="Diagnostic services your hospital offers to patients"
        action={
          <button className="btn-primary" onClick={() => setAddOpen(true)}>
            <Plus className="w-5 h-5" /> Add New Service
          </button>
        }
      />

      {details && !details.isSubscribed && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-amber-800 text-sm flex-1">
            Your services are not visible to users. Please <Link to="/subscription" className="font-semibold underline">subscribe to a plan</Link> to continue.
          </p>
        </div>
      )}

      {loading ? (
        <Loader text="Loading services..." />
      ) : services.length === 0 ? (
        <EmptyState
          title="No services yet"
          message="Add your first diagnostic service to start receiving appointments."
          action={<button className="btn-primary" onClick={() => setAddOpen(true)}><Plus className="w-5 h-5" /> Add Service</button>}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {services.map((s) => (
            <div key={s.id} className="card p-5 flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-bold text-gray-900">{s.title}</h3>
                <span className="flex items-center gap-1 text-primary font-bold whitespace-nowrap">
                  <Tag className="w-4 h-4" /> {formatCurrency(s.price)}
                </span>
              </div>
              <div className={`flex items-center gap-2 mt-3 text-sm font-medium ${s.isHomeServiceAvail ? 'text-emerald-600' : 'text-red-500'}`}>
                {s.isHomeServiceAvail ? <Home className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                {s.isHomeServiceAvail ? 'Home Service Available' : 'No Home Service'}
              </div>
              <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
                <button
                  className="flex items-center gap-1.5 text-sm text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg cursor-pointer"
                  onClick={() => setDeleteId(s.id)}
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={addOpen} title="Add New Service" onClose={() => setAddOpen(false)}>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="label">Service Title</label>
            <input className="input" placeholder="e.g. Portable X-Ray (Chest)" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div>
            <label className="label">Service Price (₹)</label>
            <input className="input" inputMode="numeric" placeholder="Enter price" value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value.replace(/[^0-9.]/g, '') })} />
          </div>
          <div>
            <label className="label">Home Service Available?</label>
            <div className="flex gap-3">
              {[true, false].map((val) => (
                <button
                  type="button"
                  key={String(val)}
                  onClick={() => setForm({ ...form, isHomeServiceAvail: val })}
                  className={`px-6 py-2 rounded-lg border-2 font-medium cursor-pointer ${
                    form.isHomeServiceAvail === val ? 'bg-primary border-primary text-white' : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {val ? 'Yes' : 'No'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-outline flex-1" onClick={() => setAddOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>{saving ? 'Saving...' : 'Add Service'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Service"
        message="Are you sure you want to delete this service?"
        confirmLabel="Delete"
        danger
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export default Services
