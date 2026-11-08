import { useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { HeartPulse, User, MapPin, Clock, CreditCard, Upload, FileCheck2, Stethoscope, ExternalLink } from 'lucide-react'
import StatusBadge from './StatusBadge'
import api, { errorMessage } from '../utils/api'
import { reportUrl } from '../utils/config'
import { formatDateTime } from '../utils/format'

const MAX_SIZE = 5 * 1024 * 1024 // backend limit

const AppointmentCard = ({ data, onUpdated }) => {
  const fileRef = useRef(null)
  const [uploading, setUploading] = useState(false)

  const address = [data?.address?.area, data?.address?.landmark, data?.address?.district, data?.address?.state]
    .filter(Boolean)
    .join(', ')

  const handleFile = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (file.size > MAX_SIZE) return toast.error('File too large. Max size is 5MB.')

    const fd = new FormData()
    fd.append('report', file)
    setUploading(true)
    try {
      await api.post(`/appointment/uploadreport/${data.id}`, fd)
      toast.success('Report uploaded successfully')
      onUpdated?.()
    } catch (err) {
      toast.error(errorMessage(err, 'Failed to upload report'))
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="card p-5 border-l-4 !border-l-primary flex flex-col">
      <div className="flex items-start justify-between gap-3 pb-3 mb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 min-w-0">
          <div className="bg-primary/10 p-2 rounded-full shrink-0">
            <HeartPulse className="w-5 h-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="font-bold text-gray-900 truncate">{data?.serviceId?.title || 'Medical Service'}</p>
            <p className="text-xs text-gray-500 font-mono">ID: #{data?.appointementId || 'N/A'}</p>
          </div>
        </div>
        <StatusBadge status={data?.status} />
      </div>

      <div className="bg-gray-50 rounded-xl p-3 mb-3">
        <div className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-1.5">
          <User className="w-4 h-4 text-primary" /> Patient
        </div>
        <p className="text-sm text-gray-800 font-medium">
          {data?.patientFirstName} {data?.patientLastName}
          <span className="text-xs text-gray-500 font-normal ml-2">
            ({[data?.gender, data?.patientAge && `${data.patientAge} years`].filter(Boolean).join(', ')})
          </span>
        </p>
        {data?.referringDoctor && (
          <p className="text-sm text-gray-600 flex items-center gap-1.5 mt-1">
            <Stethoscope className="w-3.5 h-3.5 text-emerald-500" /> Dr. {data.referringDoctor}
          </p>
        )}
      </div>

      {address && (
        <div className="flex items-start gap-2 text-sm text-gray-700 mb-3">
          <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <span>{address}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-3">
          <p className="text-xs text-purple-600 font-medium flex items-center gap-1"><Clock className="w-3 h-3" /> Booked</p>
          <p className="text-sm text-gray-800 font-medium mt-0.5">{formatDateTime(data?.createdAt)}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-3">
          <p className="text-xs text-green-600 font-medium flex items-center gap-1"><CreditCard className="w-3 h-3" /> Payment</p>
          <p className="text-sm text-gray-800 font-medium capitalize mt-0.5">{data?.modeOfPayment || 'N/A'}</p>
          <p className={`text-xs font-semibold ${data?.isPaid ? 'text-green-600' : 'text-red-500'}`}>
            {data?.isPaid ? '✓ Paid' : '✗ Unpaid'}
          </p>
        </div>
      </div>

      <div className="mt-auto">
        {data?.isReportUploaded ? (
          <div className="flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
            <span className="flex items-center gap-1.5 text-sm text-primary font-semibold">
              <FileCheck2 className="w-4 h-4" /> Report uploaded
            </span>
            {data?.reportName && (
              <a href={reportUrl(data.reportName)} target="_blank" rel="noreferrer" className="text-sm text-gray-600 hover:text-primary flex items-center gap-1">
                View <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        ) : data?.status?.toUpperCase() === 'COMPLETED' ? (
          <div className="pt-3 border-t border-gray-100">
            <input ref={fileRef} type="file" accept=".pdf,.doc,.docx,application/pdf" className="hidden" onChange={handleFile} />
            <button className="btn-primary w-full !py-2 text-sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
              <Upload className="w-4 h-4" /> {uploading ? 'Uploading...' : 'Upload Report'}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default AppointmentCard
