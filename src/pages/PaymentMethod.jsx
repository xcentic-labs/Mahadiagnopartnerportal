import { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { Plus, Landmark, Trash2, ShieldCheck } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Modal from '../components/Modal'
import ConfirmDialog from '../components/ConfirmDialog'
import { Loader, EmptyState } from '../components/States'
import { usePartner } from '../hooks/usePartner'
import api, { errorMessage } from '../utils/api'

const emptyForm = { bankName: '', accountNumber: '', ifscCode: '', bankeeName: '' }

const PaymentMethod = () => {
  const partner = usePartner()
  const [methods, setMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const fetchMethods = useCallback(async () => {
    if (!partner?.id) return
    setLoading(true)
    try {
      const res = await api.get(`/paymentmethod/get/${partner.id}`)
      setMethods(Array.isArray(res.data) ? res.data : [])
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to load payment methods'))
    } finally {
      setLoading(false)
    }
  }, [partner?.id])

  useEffect(() => {
    fetchMethods()
  }, [fetchMethods])

  const validate = () => {
    const e = {}
    if (!form.bankName.trim()) e.bankName = 'Bank name is required'
    if (!form.accountNumber.trim()) e.accountNumber = 'Account number is required'
    else if (!/^\d{9,18}$/.test(form.accountNumber)) e.accountNumber = 'Enter a valid account number (9-18 digits)'
    if (!form.ifscCode.trim()) e.ifscCode = 'IFSC code is required'
    else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(form.ifscCode.toUpperCase())) e.ifscCode = 'Invalid IFSC code format'
    if (!form.bankeeName.trim()) e.bankeeName = 'Account holder name is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setSaving(true)
    try {
      await api.post('/paymentmethod/add', {
        partnerId: partner.id,
        bankName: form.bankName.trim(),
        accountNumber: form.accountNumber.trim(),
        ifscCode: form.ifscCode.trim().toUpperCase(),
        bankeeName: form.bankeeName.trim(),
      })
      toast.success('Payment method added successfully')
      setOpen(false)
      setForm(emptyForm)
      fetchMethods()
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to add payment method'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/paymentmethod/delete/${deleteId}`)
      toast.success('Payment method deleted successfully')
      setDeleteId(null)
      fetchMethods()
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to delete payment method'))
    } finally {
      setDeleting(false)
    }
  }

  const input = (key, label, placeholder, opts = {}) => (
    <div>
      <label className="label">{label} *</label>
      <input
        className={`input ${opts.mono ? 'font-mono' : ''} ${errors[key] ? '!border-red-400' : ''}`}
        placeholder={placeholder}
        value={form[key]}
        maxLength={opts.maxLength}
        inputMode={opts.numeric ? 'numeric' : undefined}
        onChange={(e) => {
          let v = e.target.value
          if (opts.numeric) v = v.replace(/\D/g, '')
          if (opts.upper) v = v.toUpperCase()
          setForm({ ...form, [key]: v })
          if (errors[key]) setErrors({ ...errors, [key]: undefined })
        }}
      />
      {errors[key] && <p className="text-xs text-red-500 mt-1">{errors[key]}</p>}
    </div>
  )

  return (
    <div>
      <PageHeader
        title="Payment Method"
        subtitle="Bank accounts used for your withdrawals"
        action={<button className="btn-primary" onClick={() => { setForm(emptyForm); setErrors({}); setOpen(true) }}><Plus className="w-5 h-5" /> Add Bank Account</button>}
      />

      {loading ? (
        <Loader />
      ) : methods.length === 0 ? (
        <EmptyState title="No bank account added" message="Add your bank details to receive payouts." />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {methods.map((m) => (
            <div key={m.id} className="card p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-xl bg-blueshade"><Landmark className="w-6 h-6 text-primary" /></div>
                  <div>
                    <p className="font-bold text-gray-900">{m.bankName}</p>
                    <p className="text-sm text-gray-500">{m.bankeeName}</p>
                  </div>
                </div>
                <button className="p-2 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer" onClick={() => setDeleteId(m.id)} aria-label="Delete">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-5 text-sm">
                <div>
                  <p className="text-gray-500">Account Number</p>
                  <p className="font-mono font-medium text-gray-800">••••{String(m.accountNumber).slice(-4)}</p>
                </div>
                <div>
                  <p className="text-gray-500">IFSC Code</p>
                  <p className="font-mono font-medium text-gray-800">{m.ifscCode}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-6 flex gap-3">
        <ShieldCheck className="w-5 h-5 text-gray-600 shrink-0 mt-0.5" />
        <p className="text-gray-600 text-sm">Your bank details are stored securely and only used for payout processing.</p>
      </div>

      <Modal open={open} title="Add Bank Account" onClose={() => setOpen(false)}>
        <form onSubmit={handleAdd} className="space-y-4">
          {input('bankName', 'Bank Name', 'e.g. State Bank of India')}
          {input('accountNumber', 'Account Number', 'Enter account number', { numeric: true, mono: true, maxLength: 18 })}
          {input('ifscCode', 'IFSC Code', 'e.g. SBIN0001234', { upper: true, mono: true, maxLength: 11 })}
          {input('bankeeName', 'Account Holder Name', 'Name as per bank records')}
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-outline flex-1" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>{saving ? 'Adding...' : 'Add Account'}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="Delete Payment Method"
        message="Are you sure you want to delete this bank account?"
        confirmLabel="Delete"
        danger
        loading={deleting}
        onCancel={() => setDeleteId(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

export default PaymentMethod
