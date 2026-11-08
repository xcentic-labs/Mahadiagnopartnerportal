import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { RefreshCw, Wallet as WalletIcon, ArrowUpRight, AlertTriangle } from 'lucide-react'
import PageHeader from '../components/PageHeader'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'
import { Loader, EmptyState } from '../components/States'
import { usePartnerDetails } from '../hooks/usePartnerDetails'
import api, { errorMessage } from '../utils/api'
import { formatCurrency, formatDateTime } from '../utils/format'

const Wallet = () => {
  const { partner, details, loading: detailsLoading, refresh } = usePartnerDetails()
  const partnerId = partner?.id
  const [history, setHistory] = useState([])
  const [historyLoading, setHistoryLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [methodId, setMethodId] = useState('')
  const [saving, setSaving] = useState(false)

  const balance = Number(details?.amount || 0)
  const methods = details?.paymentMethod || []

  const fetchHistory = useCallback(async () => {
    if (!partnerId) return
    setHistoryLoading(true)
    try {
      const res = await api.get(`/withdraw/get/${partnerId}`)
      setHistory(Array.isArray(res.data) ? res.data : [])
    } catch {
      setHistory([])
    } finally {
      setHistoryLoading(false)
    }
  }, [partnerId])

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const reload = () => {
    refresh()
    fetchHistory()
  }

  const openWithdraw = () => {
    if (balance <= 0) return toast.error('Insufficient balance for withdrawal')
    if (!methods.length) return toast.error('Add a bank account before requesting a withdrawal')
    setMethodId(String(methods[0].id))
    setAmount('')
    setOpen(true)
  }

  const submitWithdraw = async (e) => {
    e.preventDefault()
    const value = Number(amount)
    if (!value || value <= 0) return toast.error('Please enter a valid withdrawal amount')
    if (value > balance) return toast.error('Withdrawal amount cannot exceed available balance')
    if (!methodId) return toast.error('Select a bank account')

    setSaving(true)
    try {
      await api.post('/withdraw/add', { partnerId: partner.id, amount: value, paymentMethodId: Number(methodId) })
      toast.success('Withdrawal request submitted successfully')
      setOpen(false)
      reload()
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to process withdrawal request'))
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        title="Wallet"
        subtitle="Your earnings and withdrawal requests"
        action={<button className="btn-outline" onClick={reload}><RefreshCw className="w-4 h-4" /> Refresh</button>}
      />

      <div className="rounded-2xl p-6 sm:p-8 text-white shadow-lg mb-6 bg-gradient-to-r from-primary to-[#00c9b7]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm uppercase tracking-wider text-white/80">Available Balance</p>
            <p className="text-4xl font-bold mt-2">{detailsLoading ? '—' : formatCurrency(balance)}</p>
          </div>
          <div className="bg-white/20 rounded-full p-4"><WalletIcon className="w-7 h-7" /></div>
        </div>
        <button
          onClick={openWithdraw}
          disabled={detailsLoading || balance <= 0}
          className="mt-6 bg-white text-primary px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-100 inline-flex items-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <ArrowUpRight className="w-4 h-4" /> Withdraw
        </button>
      </div>

      {!detailsLoading && !methods.length && (
        <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 mb-6 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
          <p className="text-amber-800 text-sm flex-1">
            No bank account added. <Link to="/payment-method" className="font-semibold underline">Add a payment method</Link> to withdraw your earnings.
          </p>
        </div>
      )}

      <div className="card p-5 sm:p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Withdrawal History</h3>
        {historyLoading ? (
          <Loader />
        ) : history.length === 0 ? (
          <EmptyState title="No transactions yet" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b border-gray-100">
                  <th className="py-2 pr-4 font-medium">Requested</th>
                  <th className="py-2 pr-4 font-medium">Amount</th>
                  <th className="py-2 pr-4 font-medium">Bank</th>
                  <th className="py-2 pr-4 font-medium">Status</th>
                  <th className="py-2 font-medium">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {history.map((w) => (
                  <tr key={w.id} className="border-b border-gray-50 last:border-0">
                    <td className="py-3 pr-4 text-gray-600 whitespace-nowrap">{formatDateTime(w.requestedAt || w.createdAt)}</td>
                    <td className="py-3 pr-4 font-bold text-gray-900">{formatCurrency(w.amount)}</td>
                    <td className="py-3 pr-4 text-gray-600">
                      {w.paymentMethod ? `${w.paymentMethod.bankName} ••••${String(w.paymentMethod.accountNumber || '').slice(-4)}` : '—'}
                    </td>
                    <td className="py-3 pr-4"><StatusBadge status={w.status} /></td>
                    <td className="py-3 text-gray-600">{w.remarks || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={open} title="Withdraw Funds" onClose={() => setOpen(false)}>
        <form onSubmit={submitWithdraw} className="space-y-4">
          <div>
            <p className="text-sm text-gray-500">Available Balance</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(balance)}</p>
          </div>
          <div>
            <label className="label">Withdrawal Amount</label>
            <input className="input text-lg" inputMode="numeric" placeholder="Enter amount" value={amount}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9.]/g, ''))} />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[1000, 5000, 10000].map((q) => (
              <button type="button" key={q} disabled={q > balance} onClick={() => setAmount(String(q))}
                className="px-2 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed">
                {formatCurrency(q)}
              </button>
            ))}
            <button type="button" onClick={() => setAmount(String(balance))}
              className="px-2 py-2 border border-primary text-primary rounded-lg text-sm font-medium hover:bg-blueshade cursor-pointer">
              Max
            </button>
          </div>
          <div>
            <label className="label">Bank Account</label>
            <select className="input" value={methodId} onChange={(e) => setMethodId(e.target.value)}>
              {methods.map((m) => (
                <option key={m.id} value={m.id}>{m.bankName} — ••••{String(m.accountNumber).slice(-4)} ({m.bankeeName})</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" className="btn-outline flex-1" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary flex-1" disabled={saving}>{saving ? 'Processing...' : 'Confirm'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Wallet
